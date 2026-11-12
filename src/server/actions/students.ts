"use server";

import * as db from "@/lib/portal/db";
import { audit, statusHistory } from "@/lib/portal/audit";
import { PORTAL, requireAction } from "@/lib/portal/auth";
import { int, isEmail, list, runAction, str, type ActionState } from "@/lib/portal/form";
import { COUNTRIES, DAYS, digitsOnly } from "@/lib/portal/lookups";
import { assignRef } from "@/lib/portal/refs";
import { findStudentDuplicates } from "@/lib/portal/students";
import { isValidTimezone, isYmd } from "@/lib/portal/time";

function readStudent(fd: FormData) {
  const errors: Record<string, string> = {};
  const fullName = str(fd, "full_name", 150);
  const ageRaw = str(fd, "age", 5);
  const email = str(fd, "email", 190).toLowerCase();
  const whatsapp = str(fd, "whatsapp", 40);
  const country = str(fd, "country", 80);
  const timezone = str(fd, "timezone", 64);
  const registeredOn = str(fd, "registered_on", 10);
  const days = list(fd, "preferred_days").filter((d) => d in DAYS);
  if (!fullName) errors.full_name = "Enter the student's full name.";
  if (ageRaw && (!/^\d{1,3}$/.test(ageRaw) || Number(ageRaw) < 1 || Number(ageRaw) > 120)) errors.age = "Enter an age between 1 and 120, or leave it empty.";
  if (email && !isEmail(email)) errors.email = "Enter a valid email address, or leave it empty.";
  if (whatsapp && digitsOnly(whatsapp).length < 7) errors.whatsapp = "Enter the full number with country code, e.g. +44 7700 900123.";
  if (!email && !whatsapp) errors.email = "Add at least one way to contact the student or guardian (email or WhatsApp).";
  if (country && !(country in COUNTRIES)) errors.country = "Choose a country from the list.";
  if (timezone && !isValidTimezone(timezone)) errors.timezone = "Choose a valid timezone, e.g. Europe/London.";
  if (registeredOn && !isYmd(registeredOn)) errors.registered_on = "Use a valid date.";
  return {
    errors,
    data: {
      full_name: fullName,
      age: ageRaw ? Number(ageRaw) : null,
      guardian_name: str(fd, "guardian_name", 150) || null,
      email: email || null,
      whatsapp: whatsapp || null,
      whatsapp_digits: digitsOnly(whatsapp) || null,
      country: country || null,
      timezone: timezone || null,
      preferred_days: days.join(",") || null,
      preferred_time: str(fd, "preferred_time", 60) || null,
      registered_at: registeredOn ? `${registeredOn} 00:00:00` : null,
    },
  };
}

export async function saveStudentAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const id = int(fd, "id");
    const user = await requireAction(id ? "students.edit" : "students.create");
    const { errors, data } = readStudent(fd);
    if (Object.keys(errors).length) return { errors };

    if (fd.get("confirm_duplicate") !== "1") {
      const dups = await findStudentDuplicates(data.email, data.whatsapp_digits, id);
      if (dups.length) {
        return {
          errors: { duplicate: `Possible duplicate: ${dups.map((d) => `${d.ref_no} ${d.full_name}`).join("; ")} use the same email or WhatsApp number. Check them, then tick "Save anyway" if this is a different person (for example a sibling).` },
          message: "Possible duplicate student found. Nothing was saved yet.",
        };
      }
    }

    if (id) {
      const version = int(fd, "version") ?? 0;
      const before = await db.one<{ full_name: string }>("SELECT full_name FROM hq_students WHERE id = ?", [id]);
      if (!before) return { message: "This student no longer exists." };
      const changed = await db.update("hq_students", id, { ...data, updated_at: db.nowUtc() }, undefined, version);
      if (!changed) throw new db.ConflictError();
      await audit(user.id, "student.updated", `Updated student details for ${data.full_name}`, "student", id);
      return { redirectTo: `${PORTAL}/students/${id}`, flash: "Student details saved." };
    }

    const newId = await db.transaction(async (conn) => {
      const now = db.nowUtc();
      const sid = await db.insert("hq_students", { ...data, status: "active", created_by: user.id, created_at: now, updated_at: now }, conn);
      const ref = await assignRef("hq_students", sid, conn);
      await statusHistory("student", sid, null, "active", "Record created", user.id, conn);
      await audit(user.id, "student.created", `Created student ${ref} ${data.full_name}`, "student", sid, conn);
      return sid;
    });
    return { redirectTo: `${PORTAL}/students/${newId}`, flash: "Student added. You can now enrol them in a course." };
  });
}

const TRANSITIONS: Record<string, { from: string[]; perm: "students.edit" | "students.archive"; verb: string }> = {
  active: { from: ["inactive", "archived"], perm: "students.edit", verb: "Activated" },
  inactive: { from: ["active", "archived"], perm: "students.edit", verb: "Deactivated" },
  archived: { from: ["active", "inactive"], perm: "students.archive", verb: "Archived" },
};

export async function studentStatusAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const id = int(fd, "id");
    const to = str(fd, "to", 20);
    const rule = TRANSITIONS[to];
    if (!id || !rule) return { message: "Unknown status change." };
    const from = str(fd, "from", 20);
    // Restoring from the archive needs the archive permission too.
    const user = await requireAction(from === "archived" ? "students.archive" : rule.perm);
    const reason = str(fd, "reason", 500);
    if (to === "archived" && !reason) return { errors: { reason: "Give a short reason for archiving (kept in the record history)." } };
    await db.transaction(async (conn) => {
      const row = await db.one<{ status: string; full_name: string; ref_no: string }>("SELECT status, full_name, ref_no FROM hq_students WHERE id = ? FOR UPDATE", [id], conn);
      if (!row) throw new db.UserError("This student no longer exists.");
      if (!rule.from.includes(row.status)) throw new db.UserError(`The student is already ${row.status}. Refresh the page to see the current status.`);
      await db.exec("UPDATE hq_students SET status = ?, version = version + 1, updated_at = ? WHERE id = ?", [to, db.nowUtc(), id], conn);
      await statusHistory("student", id, row.status, to, reason || null, user.id, conn);
      await audit(user.id, `student.${to}`, `${rule.verb} student ${row.ref_no} ${row.full_name}${reason ? ` (reason: ${reason})` : ""}`, "student", id, conn);
    });
    return { redirectTo: `${PORTAL}/students/${id}`, flash: `Student ${rule.verb.toLowerCase()}. History has been recorded.` };
  });
}

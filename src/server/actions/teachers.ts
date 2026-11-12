"use server";

import * as db from "@/lib/portal/db";
import { audit, statusHistory } from "@/lib/portal/audit";
import { PORTAL, requireAction } from "@/lib/portal/auth";
import { int, isEmail, runAction, str, type ActionState } from "@/lib/portal/form";
import { digitsOnly } from "@/lib/portal/lookups";
import { assignRef } from "@/lib/portal/refs";
import { teacherConflicts } from "@/lib/portal/schedule";
import { isValidTimezone } from "@/lib/portal/time";

export async function saveTeacherAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const id = int(fd, "id");
    const user = await requireAction(id ? "teachers.edit" : "teachers.create");
    const errors: Record<string, string> = {};
    const data = {
      full_name: str(fd, "full_name", 150),
      email: str(fd, "email", 190).toLowerCase() || null,
      phone: str(fd, "phone", 40) || null,
      country: str(fd, "country", 80) || null,
      timezone: str(fd, "timezone", 64) || null,
      qualifications: str(fd, "qualifications", 2000) || null,
      specialisations: str(fd, "specialisations", 1000) || null,
      availability: str(fd, "availability", 2000) || null,
    };
    if (!data.full_name) errors.full_name = "Enter the teacher's full name.";
    if (data.email && !isEmail(data.email)) errors.email = "Enter a valid email address, or leave it empty.";
    if (data.phone && digitsOnly(data.phone).length < 7) errors.phone = "Enter the full number with country code.";
    if (!data.email && !data.phone) errors.email = "Add an email address or a phone number.";
    if (data.timezone && !isValidTimezone(data.timezone)) errors.timezone = "Choose a valid timezone, e.g. Asia/Karachi.";
    if (Object.keys(errors).length) return { errors };

    if (data.email && fd.get("confirm_duplicate") !== "1") {
      const dup = await db.one<{ ref_no: string; full_name: string }>("SELECT ref_no, full_name FROM hq_teachers WHERE email = ? AND id <> ?", [data.email, id ?? 0]);
      if (dup) return { errors: { duplicate: `${dup.ref_no} ${dup.full_name} already uses this email address. Tick "Save anyway" only if this is intended.` }, message: "Possible duplicate teacher found. Nothing was saved yet." };
    }

    if (id) {
      const changed = await db.update("hq_teachers", id, { ...data, updated_at: db.nowUtc() }, undefined, int(fd, "version") ?? 0);
      if (!changed) throw new db.ConflictError();
      await audit(user.id, "teacher.updated", `Updated teacher details for ${data.full_name}`, "teacher", id);
      return { redirectTo: `${PORTAL}/teachers/${id}`, flash: "Teacher details saved." };
    }
    const newId = await db.transaction(async (conn) => {
      const now = db.nowUtc();
      const tid = await db.insert("hq_teachers", { ...data, status: "active", created_by: user.id, created_at: now, updated_at: now }, conn);
      const ref = await assignRef("hq_teachers", tid, conn);
      await statusHistory("teacher", tid, null, "active", "Record created", user.id, conn);
      await audit(user.id, "teacher.created", `Created teacher ${ref} ${data.full_name}`, "teacher", tid, conn);
      return tid;
    });
    return { redirectTo: `${PORTAL}/teachers/${newId}`, flash: "Teacher added." };
  });
}

/**
 * Status change. Deactivating or archiving a teacher who still has current enrolments requires a
 * decision for each one (reassign_<enrolmentId> = new teacher id, or "none" to leave unassigned).
 * All reassignments and the status change happen in one transaction.
 */
export async function teacherStatusAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const id = int(fd, "id");
    const to = str(fd, "to", 20);
    if (!id || !["active", "inactive", "archived"].includes(to)) return { message: "Unknown status change." };
    const from = str(fd, "from", 20);
    const user = await requireAction(to === "archived" || from === "archived" ? "teachers.archive" : "teachers.edit");
    const reason = str(fd, "reason", 500);
    if (to === "archived" && !reason) return { errors: { reason: "Give a short reason for archiving." } };

    const errors: Record<string, string> = {};
    const reassigned: string[] = [];
    await db.transaction(async (conn) => {
      const t = await db.one<{ status: string; full_name: string; ref_no: string }>("SELECT status, full_name, ref_no FROM hq_teachers WHERE id = ? FOR UPDATE", [id], conn);
      if (!t) throw new db.UserError("This teacher no longer exists.");
      if (t.status === to) throw new db.UserError(`The teacher is already ${to}.`);
      if (to !== "active") {
        const live = await db.all<{ id: number; student_name: string; course_name: string }>(
          `SELECT e.id, s.full_name AS student_name, c.name AS course_name FROM hq_enrolments e
             JOIN hq_students s ON s.id = e.student_id JOIN hq_courses c ON c.id = e.course_id
            WHERE e.teacher_id = ? AND e.status IN ('pending','active','paused') FOR UPDATE`, [id], conn);
        for (const e of live) {
          const choice = str(fd, `reassign_${e.id}`, 20);
          if (!choice) {
            errors[`reassign_${e.id}`] = "Choose a new teacher or leave unassigned.";
            continue;
          }
          if (choice === "none") {
            await db.exec("UPDATE hq_enrolments SET teacher_id = NULL, version = version + 1, updated_at = ? WHERE id = ?", [db.nowUtc(), e.id], conn);
            reassigned.push(`${e.student_name} (${e.course_name}) unassigned`);
            continue;
          }
          const newId = Number(choice);
          const nt = await db.one<{ full_name: string; status: string }>("SELECT full_name, status FROM hq_teachers WHERE id = ?", [newId], conn);
          if (!nt || nt.status !== "active" || newId === id) {
            errors[`reassign_${e.id}`] = "Choose an active teacher.";
            continue;
          }
          const slots = await db.all<{ id: number; weekday: number; start_time: string; duration_min: number; timezone: string }>(
            "SELECT id, weekday, start_time, duration_min, timezone FROM hq_class_slots WHERE enrolment_id = ? AND status = 'scheduled'", [e.id], conn);
          for (const sl of slots) {
            const clash = await teacherConflicts(newId, sl, sl.id);
            if (clash.length) {
              errors[`reassign_${e.id}`] = `${nt.full_name} already teaches ${clash[0].student_name} at an overlapping time. Choose another teacher or change the class time first.`;
              break;
            }
          }
          if (errors[`reassign_${e.id}`]) continue;
          await db.exec("UPDATE hq_enrolments SET teacher_id = ?, version = version + 1, updated_at = ? WHERE id = ?", [newId, db.nowUtc(), e.id], conn);
          reassigned.push(`${e.student_name} (${e.course_name}) → ${nt.full_name}`);
          await audit(user.id, "enrolment.teacher_changed", `Reassigned ${e.student_name} (${e.course_name}) from ${t.full_name} to ${nt.full_name}`, "enrolment", e.id, conn);
        }
        if (Object.keys(errors).length) throw new db.UserError("REASSIGN");
      }
      await db.exec("UPDATE hq_teachers SET status = ?, version = version + 1, updated_at = ? WHERE id = ?", [to, db.nowUtc(), id], conn);
      await statusHistory("teacher", id, t.status, to, reason || null, user.id, conn);
      await audit(user.id, `teacher.${to}`, `Set teacher ${t.ref_no} ${t.full_name} to ${to}${reassigned.length ? `; ${reassigned.length} enrolment(s) handled` : ""}${reason ? ` (reason: ${reason})` : ""}`, "teacher", id, conn);
    }).catch((err) => {
      if (err instanceof db.UserError && err.message === "REASSIGN") return;
      throw err;
    });
    if (Object.keys(errors).length) return { errors, message: "Nothing was changed. Resolve the highlighted enrolments and try again." };
    return { redirectTo: `${PORTAL}/teachers/${id}`, flash: `Teacher set to ${to}.${reassigned.length ? ` ${reassigned.length} enrolment(s) reassigned or unassigned.` : ""}` };
  });
}

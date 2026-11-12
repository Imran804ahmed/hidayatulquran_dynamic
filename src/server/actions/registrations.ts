"use server";

import * as db from "@/lib/portal/db";
import { audit, statusHistory } from "@/lib/portal/audit";
import { PORTAL, requireAction } from "@/lib/portal/auth";
import { int, runAction, str, type ActionState } from "@/lib/portal/form";
import { REG_OPEN, REG_STATUS, suggestedTimezone, PACKAGES } from "@/lib/portal/lookups";
import { assignRef } from "@/lib/portal/refs";
import { isYmd } from "@/lib/portal/time";
import type { RegistrationRow } from "@/lib/portal/registrations";

/** Review update: status, assignee, follow-up date, rejection reason — one optimistic-locked save. */
export async function updateRegistrationAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const user = await requireAction("registrations.edit");
    const id = int(fd, "id");
    const version = int(fd, "version") ?? 0;
    if (!id) return { message: "Unknown registration." };
    const to = str(fd, "status", 20);
    const assignedRaw = str(fd, "assigned_to", 12);
    const follow = str(fd, "follow_up_on", 10);
    const reason = str(fd, "status_reason", 500);
    const errors: Record<string, string> = {};
    if (!(to in REG_STATUS)) errors.status = "Choose a status.";
    if (follow && !isYmd(follow)) errors.follow_up_on = "Use a valid date.";
    let assignee: number | null = null;
    if (assignedRaw) {
      assignee = Number(assignedRaw);
      if (!(await db.value("SELECT id FROM hq_users WHERE id = ? AND status = 'active'", [assignee]))) errors.assigned_to = "Choose an active portal user.";
    }
    if (Object.keys(errors).length) return { errors };

    const summary: string[] = [];
    await db.transaction(async (conn) => {
      const r = await db.one<RegistrationRow>("SELECT * FROM hq_registrations WHERE id = ? FOR UPDATE", [id], conn);
      if (!r) throw new db.UserError("This registration no longer exists.");
      if (r.version !== version) throw new db.ConflictError();
      if (to !== r.status) {
        if (r.status === "enrolled") throw new db.UserError("Enrolled registrations are complete and cannot change status. Manage the student's enrolments instead.");
        if (to === "enrolled") {
          const live = r.student_id ? await db.count("SELECT COUNT(*) FROM hq_enrolments WHERE student_id = ? AND status IN ('pending','active','paused')", [r.student_id], conn) : 0;
          if (!r.student_id || !live) throw new db.UserError("Enrolled is set by converting the registration and enrolling the student in a course. Use Convert to student.");
        }
        if (to === "rejected" && !reason) throw new db.UserError("REASON");
        if (r.status === "rejected" && !reason) throw new db.UserError("REOPEN");
        if (r.student_id && REG_OPEN.indexOf(to as never) > -1 && to !== "approved") throw new db.UserError("This registration is already linked to a student, so it can only be Approved or Enrolled.");
        await statusHistory("registration", id, r.status, to, reason || null, user.id, conn);
        summary.push(r.status === "rejected" ? `reopened as ${REG_STATUS[to as keyof typeof REG_STATUS]}` : `status ${REG_STATUS[r.status as keyof typeof REG_STATUS]} → ${REG_STATUS[to as keyof typeof REG_STATUS]}`);
      }
      if ((r.assigned_to ?? null) !== assignee) {
        const name = assignee ? await db.value<string>("SELECT name FROM hq_users WHERE id = ?", [assignee], conn) : null;
        summary.push(name ? `assigned to ${name}` : "unassigned");
      }
      if ((r.follow_up_on?.slice(0, 10) ?? "") !== follow) summary.push(follow ? `follow-up set to ${follow}` : "follow-up cleared");
      await db.exec(
        `UPDATE hq_registrations SET status = ?, assigned_to = ?, follow_up_on = ?, rejection_reason = ?, version = version + 1, updated_at = ? WHERE id = ?`,
        [to, assignee, follow || null, to === "rejected" ? reason : r.status === "rejected" ? null : r.rejection_reason, db.nowUtc(), id], conn,
      );
      if (summary.length) await audit(user.id, "registration.updated", `Registration ${r.ref_no}: ${summary.join("; ")}`, "registration", id, conn);
    }).catch((err) => {
      if (err instanceof db.UserError && err.message === "REASON") throw new db.UserError("Give an internal reason for rejecting this registration.");
      if (err instanceof db.UserError && err.message === "REOPEN") throw new db.UserError("Give a reason for reopening this rejected registration.");
      throw err;
    });
    return { redirectTo: `${PORTAL}/registrations/${id}`, flash: summary.length ? `Saved: ${summary.join("; ")}.` : "No changes to save." , flashType: summary.length ? "success" : "info" };
  });
}

/**
 * Converts an APPROVED registration into a student record (new or existing), optionally with a
 * course enrolment, in one transaction. The registration row is locked, so a repeated or
 * concurrent submission cannot create a second student.
 */
export async function convertRegistrationAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const user = await requireAction("registrations.convert");
    const id = int(fd, "id");
    if (!id) return { message: "Unknown registration." };
    const mode = str(fd, "mode", 20); // "new" | "link"
    const linkId = int(fd, "link_student_id");
    const enrol = fd.get("enrol") === "1";
    const courseId = int(fd, "course_id");
    const teacherId = int(fd, "teacher_id");
    const start = str(fd, "start_date", 10);
    const enrolStatus = str(fd, "enrol_status", 20) === "active" ? "active" : "pending";
    const errors: Record<string, string> = {};
    if (mode !== "new" && mode !== "link") errors.mode = "Choose whether to create a new student or link an existing one.";
    if (mode === "link" && !linkId) errors.mode = "Choose the existing student to link.";
    if (enrol) {
      if (!courseId) errors.course_id = "Choose a course.";
      if (start && !isYmd(start)) errors.start_date = "Use a valid date.";
    }
    if (Object.keys(errors).length) return { errors };
    if (enrol && teacherId && !user.permissions.has("enrolments.manage")) return { message: "Assigning a teacher needs the enrolments.manage permission. Leave the teacher empty or ask a Super Admin." };

    const result = await db.transaction(async (conn) => {
      const r = await db.one<RegistrationRow>("SELECT * FROM hq_registrations WHERE id = ? FOR UPDATE", [id], conn);
      if (!r) throw new db.UserError("This registration no longer exists.");
      if (r.student_id) throw new db.UserError("This registration has already been converted. It is linked to an existing student record, so nothing was changed.");
      if (r.status !== "approved") throw new db.UserError("Only Approved registrations can be converted. Approve it first (approval itself does not create a student).");
      const now = db.nowUtc();
      let studentId: number;
      let studentLabel: string;
      if (mode === "link") {
        const s = await db.one<{ id: number; ref_no: string; full_name: string; status: string }>("SELECT id, ref_no, full_name, status FROM hq_students WHERE id = ? FOR UPDATE", [linkId!], conn);
        if (!s) throw new db.UserError("The selected student no longer exists.");
        if (s.status === "archived") throw new db.UserError("The selected student is archived. Restore them first, or create a new student.");
        studentId = s.id;
        studentLabel = `${s.ref_no} ${s.full_name}`;
        // Fill gaps only; never overwrite information staff have already recorded.
        await db.exec(
          `UPDATE hq_students SET guardian_name = COALESCE(guardian_name, ?), email = COALESCE(email, ?), whatsapp = COALESCE(whatsapp, ?),
             whatsapp_digits = COALESCE(whatsapp_digits, ?), country = COALESCE(country, ?), age = COALESCE(age, ?), version = version + 1, updated_at = ? WHERE id = ?`,
          [r.guardian_name, r.email, r.whatsapp, r.whatsapp_digits, r.country, r.age, now, s.id], conn);
      } else {
        studentId = await db.insert("hq_students", {
          full_name: r.full_name, age: r.age, guardian_name: r.guardian_name, email: r.email, whatsapp: r.whatsapp, whatsapp_digits: r.whatsapp_digits,
          country: r.country, timezone: suggestedTimezone(r.country), preferred_days: r.preferred_days, preferred_time: r.preferred_time,
          status: "active", registered_at: r.submitted_at, source_registration_id: r.id, created_by: user.id, created_at: now, updated_at: now,
        }, conn);
        const ref = await assignRef("hq_students", studentId, conn);
        studentLabel = `${ref} ${r.full_name}`;
        await statusHistory("student", studentId, null, "active", `Created from registration ${r.ref_no}`, user.id, conn);
        await audit(user.id, "student.created", `Created student ${studentLabel} from registration ${r.ref_no}`, "student", studentId, conn);
      }
      let newStatus = "approved";
      let enrolmentId: number | null = null;
      if (enrol) {
        const c = await db.one<{ name: string; status: string }>("SELECT name, status FROM hq_courses WHERE id = ?", [courseId!], conn);
        if (!c || c.status !== "active") throw new db.UserError("The selected course is not active.");
        if (teacherId) {
          const t = await db.one<{ status: string }>("SELECT status FROM hq_teachers WHERE id = ?", [teacherId], conn);
          if (!t || t.status !== "active") throw new db.UserError("The selected teacher is not active. Inactive teachers cannot receive new assignments.");
        }
        const dupEnrol = await db.count("SELECT COUNT(*) FROM hq_enrolments WHERE student_id = ? AND course_id = ? AND status IN ('pending','active','paused')", [studentId, courseId!], conn);
        if (dupEnrol) throw new db.UserError(`This student already has a current enrolment in ${c.name}.`);
        const planDays = Number.parseInt(r.classes_plan ?? "", 10);
        enrolmentId = await db.insert("hq_enrolments", {
          student_id: studentId, course_id: courseId!, teacher_id: teacherId, package: r.package && r.package in PACKAGES ? r.package : null,
          classes_per_week: planDays > 0 && planDays < 8 ? planDays : null, status: enrolStatus, start_date: start || null,
          created_by: user.id, created_at: now, updated_at: now,
        }, conn);
        await audit(user.id, "enrolment.created", `Enrolled ${studentLabel} in ${c.name} (from registration ${r.ref_no})`, "enrolment", enrolmentId, conn);
        newStatus = "enrolled";
      }
      await db.exec("UPDATE hq_registrations SET student_id = ?, converted_at = ?, converted_by = ?, status = ?, version = version + 1, updated_at = ? WHERE id = ?",
        [studentId, now, user.id, newStatus, now, id], conn);
      if (newStatus !== r.status) await statusHistory("registration", id, r.status, newStatus, enrol ? "Converted and enrolled" : null, user.id, conn);
      await audit(user.id, "registration.converted", `Registration ${r.ref_no} ${mode === "link" ? "linked to existing" : "converted to new"} student ${studentLabel}${enrol ? " and enrolled" : ""}`, "registration", id, conn);
      return { studentId };
    });
    return { redirectTo: `${PORTAL}/students/${result.studentId}`, flash: "Registration converted. The original request is kept and linked to this student." };
  });
}

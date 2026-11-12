"use server";

import * as db from "@/lib/portal/db";
import { audit } from "@/lib/portal/audit";
import { PORTAL, requireAction } from "@/lib/portal/auth";
import { int, isHttpUrl, runAction, str, type ActionState } from "@/lib/portal/form";
import { ENROL_STATUS, PACKAGES, WEEKDAYS } from "@/lib/portal/lookups";
import { teacherConflicts } from "@/lib/portal/schedule";
import { isValidTimezone, isYmd } from "@/lib/portal/time";

/* ---------------- courses ---------------- */

export async function saveCourseAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const user = await requireAction("courses.edit");
    const id = int(fd, "id");
    const name = str(fd, "name", 150);
    const summary = str(fd, "summary", 500);
    const publicUrl = str(fd, "public_url", 255);
    const status = str(fd, "status", 10);
    const sort = int(fd, "sort_order") ?? 0;
    const errors: Record<string, string> = {};
    if (!name) errors.name = "Enter the course name.";
    if (publicUrl && !(publicUrl.startsWith("/") || isHttpUrl(publicUrl))) errors.public_url = "Use a website path such as /quran-tajweed-course-online, or a full https:// address.";
    if (!["active", "inactive"].includes(status)) errors.status = "Choose a status.";
    if (Object.keys(errors).length) return { errors };
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 150) || `course-${Date.now()}`;
    const data = { name, summary: summary || null, public_url: publicUrl || null, status, sort_order: sort, updated_at: db.nowUtc() };
    if (id) {
      const changed = await db.update("hq_courses", id, data, undefined, int(fd, "version") ?? 0);
      if (!changed) throw new db.ConflictError();
      await audit(user.id, "course.updated", `Updated course ${name} (${status})`, "course", id);
      return { redirectTo: `${PORTAL}/courses/${id}`, flash: "Course saved. The public website text is not affected." };
    }
    const newId = await db.insert("hq_courses", { ...data, slug, created_at: db.nowUtc() });
    await audit(user.id, "course.created", `Created course ${name}`, "course", newId);
    return { redirectTo: `${PORTAL}/courses/${newId}`, flash: "Course added to the portal." };
  });
}

/* ---------------- enrolments ---------------- */

async function assertTeacherAssignable(teacherId: number, enrolmentId: number | null, conn?: Parameters<typeof db.one>[2]) {
  const t = await db.one<{ full_name: string; status: string }>("SELECT full_name, status FROM hq_teachers WHERE id = ?", [teacherId], conn);
  if (!t) throw new db.UserError("The selected teacher no longer exists.");
  if (t.status !== "active") throw new db.UserError(`${t.full_name} is ${t.status}. Inactive teachers cannot receive new assignments.`);
  if (enrolmentId) {
    const slots = await db.all<{ id: number; weekday: number; start_time: string; duration_min: number; timezone: string }>(
      "SELECT id, weekday, start_time, duration_min, timezone FROM hq_class_slots WHERE enrolment_id = ? AND status = 'scheduled'", [enrolmentId], conn);
    for (const s of slots) {
      const clash = await teacherConflicts(teacherId, s, s.id);
      if (clash.length) throw new db.UserError(`${t.full_name} already teaches ${clash[0].student_name} on ${WEEKDAYS[clash[0].weekday]} at ${clash[0].start_time.slice(0, 5)} (${clash[0].timezone}), which overlaps this enrolment's ${WEEKDAYS[s.weekday]} ${s.start_time.slice(0, 5)} class.`);
    }
  }
  return t;
}

export async function saveEnrolmentAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const user = await requireAction("enrolments.manage");
    const id = int(fd, "id");
    const studentId = int(fd, "student_id");
    const courseId = int(fd, "course_id");
    const teacherId = int(fd, "teacher_id");
    const status = str(fd, "status", 20);
    const pkg = str(fd, "package", 40);
    const perWeek = int(fd, "classes_per_week");
    const start = str(fd, "start_date", 10);
    const end = str(fd, "end_date", 10);
    const notes = str(fd, "notes", 2000);
    const errors: Record<string, string> = {};
    if (!id && !studentId) errors.student_id = "Choose a student.";
    if (!courseId) errors.course_id = "Choose a course.";
    if (!(status in ENROL_STATUS)) errors.status = "Choose a status.";
    if (pkg && !(pkg in PACKAGES)) errors.package = "Choose a package from the list.";
    if (perWeek !== null && (perWeek < 1 || perWeek > 7)) errors.classes_per_week = "Between 1 and 7.";
    if (start && !isYmd(start)) errors.start_date = "Use a valid date.";
    if (end && !isYmd(end)) errors.end_date = "Use a valid date.";
    if (start && end && isYmd(start) && isYmd(end) && end < start) errors.end_date = "The end date is before the start date.";
    if (Object.keys(errors).length) return { errors };

    return db.transaction(async (conn) => {
      const now = db.nowUtc();
      if (id) {
        const e = await db.one<{ student_id: number; course_id: number; teacher_id: number | null; status: string; version: number; student_name: string; course_name: string }>(
          `SELECT e.student_id, e.course_id, e.teacher_id, e.status, e.version, s.full_name AS student_name, c.name AS course_name
             FROM hq_enrolments e JOIN hq_students s ON s.id = e.student_id JOIN hq_courses c ON c.id = e.course_id WHERE e.id = ? FOR UPDATE`, [id], conn);
        if (!e) throw new db.UserError("This enrolment no longer exists.");
        if (e.version !== (int(fd, "version") ?? 0)) throw new db.ConflictError();
        if (teacherId && teacherId !== e.teacher_id) await assertTeacherAssignable(teacherId, id, conn);
        if (courseId !== e.course_id) {
          const c = await db.one<{ status: string }>("SELECT status FROM hq_courses WHERE id = ?", [courseId!], conn);
          if (!c || c.status !== "active") throw new db.UserError("The selected course is not active.");
        }
        await db.exec(
          `UPDATE hq_enrolments SET course_id = ?, teacher_id = ?, package = ?, classes_per_week = ?, status = ?, start_date = ?, end_date = ?, notes = ?, version = version + 1, updated_at = ? WHERE id = ?`,
          [courseId!, teacherId, pkg || null, perWeek, status, start || null, end || null, notes || null, now, id], conn);
        const changes: string[] = [];
        if (e.status !== status) changes.push(`status ${e.status} → ${status}`);
        if (e.teacher_id !== teacherId) changes.push(teacherId ? "teacher changed" : "teacher removed");
        if (e.course_id !== courseId) changes.push("course changed");
        await audit(user.id, teacherId !== e.teacher_id ? "enrolment.teacher_changed" : "enrolment.updated",
          `Enrolment ${e.student_name} / ${e.course_name}: ${changes.join("; ") || "details updated"}`, "enrolment", id, conn);
        return { redirectTo: `${PORTAL}/enrolments/${id}`, flash: "Enrolment saved." };
      }
      const s = await db.one<{ full_name: string; status: string }>("SELECT full_name, status FROM hq_students WHERE id = ?", [studentId!], conn);
      if (!s) throw new db.UserError("The selected student no longer exists.");
      if (s.status !== "active") throw new db.UserError(`${s.full_name} is ${s.status}. Activate the student before enrolling them.`);
      const c = await db.one<{ name: string; status: string }>("SELECT name, status FROM hq_courses WHERE id = ?", [courseId!], conn);
      if (!c || c.status !== "active") throw new db.UserError("The selected course is not active.");
      if (teacherId) await assertTeacherAssignable(teacherId, null, conn);
      if (await db.count("SELECT COUNT(*) FROM hq_enrolments WHERE student_id = ? AND course_id = ? AND status IN ('pending','active','paused')", [studentId!, courseId!], conn)) {
        throw new db.UserError(`${s.full_name} already has a current enrolment in ${c.name}.`);
      }
      const newId = await db.insert("hq_enrolments", {
        student_id: studentId!, course_id: courseId!, teacher_id: teacherId, package: pkg || null, classes_per_week: perWeek, status,
        start_date: start || null, end_date: end || null, notes: notes || null, created_by: user.id, created_at: now, updated_at: now,
      }, conn);
      await audit(user.id, "enrolment.created", `Enrolled ${s.full_name} in ${c.name}`, "enrolment", newId, conn);
      return { redirectTo: `${PORTAL}/enrolments/${newId}`, flash: "Enrolment created. Add weekly class times below." };
    });
  });
}

export async function addSlotAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const user = await requireAction("enrolments.manage");
    const enrolmentId = int(fd, "enrolment_id");
    const weekday = int(fd, "weekday");
    const start = str(fd, "start_time", 5);
    const duration = int(fd, "duration_min");
    const tz = str(fd, "timezone", 64);
    const meeting = str(fd, "meeting_url", 500);
    const errors: Record<string, string> = {};
    if (!weekday || weekday < 1 || weekday > 7) errors.weekday = "Choose a day.";
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(start)) errors.start_time = "Use a time such as 17:30.";
    if (!duration || duration < 10 || duration > 240) errors.duration_min = "Between 10 and 240 minutes.";
    if (!isValidTimezone(tz)) errors.timezone = "Choose a valid timezone.";
    if (meeting && !(isHttpUrl(meeting) && meeting.startsWith("https://"))) errors.meeting_url = "Use a full https:// meeting link, or leave it empty.";
    if (Object.keys(errors).length || !enrolmentId || !weekday || !duration) return { errors };
    const e = await db.one<{ teacher_id: number | null; status: string; student_status: string; student_name: string; course_name: string }>(
      `SELECT e.teacher_id, e.status, s.status AS student_status, s.full_name AS student_name, c.name AS course_name
         FROM hq_enrolments e JOIN hq_students s ON s.id = e.student_id JOIN hq_courses c ON c.id = e.course_id WHERE e.id = ?`, [enrolmentId]);
    if (!e) return { message: "This enrolment no longer exists." };
    if (!["pending", "active"].includes(e.status)) return { message: "Classes can only be scheduled for Pending or Active enrolments." };
    if (e.student_status !== "active") return { message: "The student is not active, so classes cannot be scheduled." };
    const candidate = { weekday, start_time: `${start}:00`, duration_min: duration, timezone: tz };
    if (e.teacher_id) {
      const clash = await teacherConflicts(e.teacher_id, candidate, null);
      if (clash.length) {
        return { errors: { start_time: `Clashes with ${clash[0].student_name} (${clash[0].course_name}) on ${WEEKDAYS[clash[0].weekday]} ${clash[0].start_time.slice(0, 5)} ${clash[0].timezone}, ${clash[0].duration_min} min.` } };
      }
    }
    const now = db.nowUtc();
    const id = await db.insert("hq_class_slots", { enrolment_id: enrolmentId, weekday, start_time: `${start}:00`, duration_min: duration, timezone: tz, status: "scheduled", meeting_url: meeting || null, created_by: user.id, created_at: now, updated_at: now });
    await audit(user.id, "class.scheduled", `Scheduled ${WEEKDAYS[weekday]} ${start} (${tz}, ${duration} min) for ${e.student_name} / ${e.course_name}`, "enrolment", enrolmentId);
    void id;
    return { redirectTo: `${PORTAL}/enrolments/${enrolmentId}#classes`, flash: `Weekly class added: ${WEEKDAYS[weekday]} ${start}.` };
  });
}

export async function cancelSlotAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const user = await requireAction("enrolments.manage");
    const slotId = int(fd, "slot_id");
    const slot = slotId ? await db.one<{ enrolment_id: number; weekday: number; start_time: string; timezone: string; status: string }>("SELECT enrolment_id, weekday, start_time, timezone, status FROM hq_class_slots WHERE id = ?", [slotId]) : null;
    if (!slot) return { message: "This class time no longer exists." };
    if (slot.status === "cancelled") return { redirectTo: `${PORTAL}/enrolments/${slot.enrolment_id}#classes` };
    await db.exec("UPDATE hq_class_slots SET status = 'cancelled', updated_at = ? WHERE id = ?", [db.nowUtc(), slotId!]);
    await audit(user.id, "class.cancelled", `Stopped weekly class ${WEEKDAYS[slot.weekday]} ${slot.start_time.slice(0, 5)} (${slot.timezone})`, "enrolment", slot.enrolment_id);
    return { redirectTo: `${PORTAL}/enrolments/${slot.enrolment_id}#classes`, flash: "Weekly class stopped. It stays in the history." };
  });
}

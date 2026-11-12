import "server-only";
import * as db from "./db";

export type TeacherRow = {
  id: number; ref_no: string; full_name: string; email: string | null; phone: string | null; country: string | null; timezone: string | null;
  qualifications: string | null; specialisations: string | null; availability: string | null; status: "active" | "inactive" | "archived";
  version: number; created_at: string; updated_at: string;
};

export const TEACHER_SORTS: Record<string, string> = {
  name: "t.full_name", ref: "t.id", status: "t.status", students: "students", added: "t.created_at",
};

export function teacherWhere(f: { q?: string; status?: string; course?: string }): { sql: string; params: db.Param[] } {
  const where: string[] = [];
  const params: db.Param[] = [];
  const status = f.status ?? "current";
  if (status === "current") where.push("t.status IN ('active','inactive')");
  else if (["active", "inactive", "archived"].includes(status)) {
    where.push("t.status = ?");
    params.push(status);
  }
  if (f.q) {
    const t = db.likeTerm(f.q);
    where.push("(t.full_name LIKE ? OR t.ref_no LIKE ? OR t.email LIKE ? OR t.phone LIKE ? OR t.specialisations LIKE ?)");
    params.push(t, t, t, t, t);
  }
  if (f.course && /^\d+$/.test(f.course)) {
    where.push("EXISTS (SELECT 1 FROM hq_enrolments e WHERE e.teacher_id = t.id AND e.course_id = ? AND e.status IN ('pending','active','paused'))");
    params.push(Number(f.course));
  }
  return { sql: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

/** Enrolments still occupying a teacher (affected by deactivation). */
export function liveAssignments(teacherId: number) {
  return db.all<{ id: number; student_id: number; student_name: string; student_ref: string; course_name: string; status: string; slot_count: number }>(
    `SELECT e.id, e.student_id, s.full_name AS student_name, s.ref_no AS student_ref, c.name AS course_name, e.status,
       (SELECT COUNT(*) FROM hq_class_slots cs WHERE cs.enrolment_id = e.id AND cs.status = 'scheduled') AS slot_count
       FROM hq_enrolments e JOIN hq_students s ON s.id = e.student_id JOIN hq_courses c ON c.id = e.course_id
      WHERE e.teacher_id = ? AND e.status IN ('pending','active','paused') ORDER BY s.full_name`,
    [teacherId],
  );
}

import "server-only";
import * as db from "./db";
import { isYmd, localDayStartUtc, addDays } from "./time";

export type StudentRow = {
  id: number; ref_no: string; full_name: string; age: number | null; guardian_name: string | null; email: string | null;
  whatsapp: string | null; country: string | null; timezone: string | null; preferred_days: string | null; preferred_time: string | null;
  status: "active" | "inactive" | "archived"; registered_at: string | null; source_registration_id: number | null; version: number;
  created_at: string; updated_at: string;
};

export type StudentFilters = { q?: string; status?: string; course?: string; teacher?: string; from?: string; to?: string; sort?: string; dir?: string };

export const STUDENT_SORTS: Record<string, string> = {
  name: "s.full_name", ref: "s.id", status: "s.status", registered: "COALESCE(s.registered_at, s.created_at)", country: "s.country",
};

/**
 * WHERE clause shared by the list, the CSV export and dashboard links.
 * status: current (default: active + inactive) | active | inactive | archived | all
 */
export function studentWhere(f: StudentFilters, tz: string): { sql: string; params: db.Param[] } {
  const where: string[] = [];
  const params: db.Param[] = [];
  const status = f.status ?? "current";
  if (status === "current") where.push("s.status IN ('active','inactive')");
  else if (["active", "inactive", "archived"].includes(status)) {
    where.push("s.status = ?");
    params.push(status);
  }
  if (f.q) {
    const t = db.likeTerm(f.q);
    const digits = f.q.replace(/\D+/g, "");
    where.push(`(s.full_name LIKE ? OR s.ref_no LIKE ? OR s.email LIKE ? OR s.guardian_name LIKE ?${digits.length >= 4 ? " OR s.whatsapp_digits LIKE ?" : ""})`);
    params.push(t, t, t, t);
    if (digits.length >= 4) params.push(`%${digits}%`);
  }
  if (f.course && /^\d+$/.test(f.course)) {
    where.push("EXISTS (SELECT 1 FROM hq_enrolments e WHERE e.student_id = s.id AND e.course_id = ? AND e.status IN ('pending','active','paused'))");
    params.push(Number(f.course));
  }
  if (f.teacher === "none") {
    where.push("NOT EXISTS (SELECT 1 FROM hq_enrolments e WHERE e.student_id = s.id AND e.teacher_id IS NOT NULL AND e.status IN ('pending','active','paused'))");
  } else if (f.teacher && /^\d+$/.test(f.teacher)) {
    where.push("EXISTS (SELECT 1 FROM hq_enrolments e WHERE e.student_id = s.id AND e.teacher_id = ? AND e.status IN ('pending','active','paused'))");
    params.push(Number(f.teacher));
  }
  if (f.from && isYmd(f.from)) {
    where.push("COALESCE(s.registered_at, s.created_at) >= ?");
    params.push(localDayStartUtc(f.from, tz));
  }
  if (f.to && isYmd(f.to)) {
    where.push("COALESCE(s.registered_at, s.created_at) < ?");
    params.push(localDayStartUtc(addDays(f.to, 1), tz));
  }
  return { sql: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

export function orderBy(sorts: Record<string, string>, sort: string | undefined, dir: string | undefined, fallback: string): { sort: string; dir: "asc" | "desc"; sql: string } {
  const key = sort && sorts[sort] ? sort : fallback;
  const d = dir === "asc" ? "asc" : dir === "desc" ? "desc" : key === "name" ? "asc" : "desc";
  return { sort: key, dir: d, sql: `${sorts[key]} ${d.toUpperCase()}` };
}

/** Possible duplicates by email or WhatsApp number (digits), excluding a given student. */
export function findStudentDuplicates(email: string | null, whatsappDigits: string | null, excludeId: number | null = null) {
  const conds: string[] = [];
  const params: db.Param[] = [];
  if (email) {
    conds.push("email = ?");
    params.push(email);
  }
  if (whatsappDigits && whatsappDigits.length >= 7) {
    conds.push("whatsapp_digits = ?");
    params.push(whatsappDigits);
  }
  if (!conds.length) return Promise.resolve([] as Pick<StudentRow, "id" | "ref_no" | "full_name" | "email" | "whatsapp" | "status">[]);
  return db.all<Pick<StudentRow, "id" | "ref_no" | "full_name" | "email" | "whatsapp" | "status">>(
    `SELECT id, ref_no, full_name, email, whatsapp, status FROM hq_students WHERE (${conds.join(" OR ")})${excludeId ? " AND id <> ?" : ""} ORDER BY id LIMIT 10`,
    excludeId ? [...params, excludeId] : params,
  );
}

export type EnrolmentRow = {
  id: number; student_id: number; course_id: number; course_name: string; teacher_id: number | null; teacher_name: string | null;
  teacher_status: string | null; student_name: string; student_ref: string; status: string; package: string | null; classes_per_week: number | null;
  start_date: string | null; end_date: string | null; slot_count: number;
};

export function enrolmentsFor(where: string, params: db.Param[]) {
  return db.all<EnrolmentRow>(
    `SELECT e.id, e.student_id, e.course_id, c.name AS course_name, e.teacher_id, t.full_name AS teacher_name, t.status AS teacher_status,
            s.full_name AS student_name, s.ref_no AS student_ref, e.status, e.package, e.classes_per_week, e.start_date, e.end_date,
            (SELECT COUNT(*) FROM hq_class_slots cs WHERE cs.enrolment_id = e.id AND cs.status = 'scheduled') AS slot_count
       FROM hq_enrolments e JOIN hq_courses c ON c.id = e.course_id JOIN hq_students s ON s.id = e.student_id
       LEFT JOIN hq_teachers t ON t.id = e.teacher_id
      ${where} ORDER BY FIELD(e.status,'active','pending','paused','completed','withdrawn'), e.created_at DESC`,
    params,
  );
}

export function notesFor(type: string, id: number) {
  return db.all<{ id: number; body: string; created_at: string; user_name: string | null }>(
    `SELECT n.id, n.body, n.created_at, u.name AS user_name FROM hq_notes n LEFT JOIN hq_users u ON u.id = n.user_id
      WHERE n.entity_type = ? AND n.entity_id = ? ORDER BY n.created_at DESC, n.id DESC`,
    [type, id],
  );
}

export function activeCourses() {
  return db.all<{ id: number; name: string; status: string }>("SELECT id, name, status FROM hq_courses ORDER BY status = 'active' DESC, sort_order, name");
}

export function teacherOptions(includeInactive = false) {
  return db.all<{ id: number; full_name: string; status: string }>(
    `SELECT id, full_name, status FROM hq_teachers ${includeInactive ? "WHERE status <> 'archived'" : "WHERE status = 'active'"} ORDER BY full_name`,
  );
}

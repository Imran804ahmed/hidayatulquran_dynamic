import "server-only";
import * as db from "./db";

/** status: live (default: pending + active + paused) | <status> | all */
export function enrolmentWhere(f: { q?: string; status?: string; course?: string; teacher?: string }) {
  const where: string[] = [];
  const params: db.Param[] = [];
  const status = f.status ?? "live";
  if (status === "live") where.push("e.status IN ('pending','active','paused')");
  else if (["pending", "active", "paused", "completed", "withdrawn"].includes(status)) {
    where.push("e.status = ?");
    params.push(status);
  }
  if (f.q) {
    const t = db.likeTerm(f.q);
    where.push("(s.full_name LIKE ? OR s.ref_no LIKE ?)");
    params.push(t, t);
  }
  if (f.course && /^\d+$/.test(f.course)) {
    where.push("e.course_id = ?");
    params.push(Number(f.course));
  }
  if (f.teacher === "none") where.push("e.teacher_id IS NULL");
  else if (f.teacher && /^\d+$/.test(f.teacher)) {
    where.push("e.teacher_id = ?");
    params.push(Number(f.teacher));
  }
  return { sql: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

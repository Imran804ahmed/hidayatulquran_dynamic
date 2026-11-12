import * as db from "@/lib/portal/db";
import { audit } from "@/lib/portal/audit";
import { currentUser } from "@/lib/portal/auth";
import { csvResponse } from "@/lib/portal/csv";
import { enrolmentWhere } from "@/lib/portal/enrolments";
import { packageName, statusLabel } from "@/lib/portal/lookups";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return new Response("Sign in required", { status: 401 });
  if (!user.permissions.has("enrolments.export")) return new Response("You do not have permission to export enrolments.", { status: 403 });
  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const where = enrolmentWhere({ q: sp.q?.slice(0, 100), status: sp.status ?? "live", course: sp.course, teacher: sp.teacher });
  const rows = await db.all<Record<string, string | number | null>>(
    `SELECT s.ref_no, s.full_name, s.status AS student_status, c.name AS course, t.ref_no AS teacher_ref, t.full_name AS teacher, e.status, e.package, e.classes_per_week, e.start_date, e.end_date,
            (SELECT COUNT(*) FROM hq_class_slots cs WHERE cs.enrolment_id = e.id AND cs.status = 'scheduled') AS slots
       FROM hq_enrolments e JOIN hq_students s ON s.id = e.student_id JOIN hq_courses c ON c.id = e.course_id LEFT JOIN hq_teachers t ON t.id = e.teacher_id
      ${where.sql} ORDER BY s.full_name, c.name LIMIT 20000`, where.params);
  await audit(user.id, "enrolment.exported", `Exported ${rows.length} enrolments to CSV`);
  return csvResponse(`enrolments-${new Date().toISOString().slice(0, 10)}.csv`,
    ["Student ref", "Student", "Student record status", "Course", "Teacher ref", "Teacher", "Enrolment status", "Package", "Classes per week", "Start", "End", "Weekly class slots"],
    rows.map((r) => [r.ref_no, r.full_name, r.student_status, r.course, r.teacher_ref, r.teacher, statusLabel(r.status as string), packageName(r.package as string), r.classes_per_week, r.start_date, r.end_date, r.slots]));
}

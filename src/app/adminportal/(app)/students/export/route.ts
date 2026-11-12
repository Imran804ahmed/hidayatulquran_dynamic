import * as db from "@/lib/portal/db";
import { audit } from "@/lib/portal/audit";
import { currentUser } from "@/lib/portal/auth";
import { csvResponse } from "@/lib/portal/csv";
import { countryName, daysLabel } from "@/lib/portal/lookups";
import { academyTimezone } from "@/lib/portal/settings";
import { fmtDay } from "@/lib/portal/time";
import { studentWhere } from "@/lib/portal/students";

/** CSV of students matching the same filters as the list. Requires students.export. */
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return new Response("Sign in required", { status: 401 });
  if (!user.permissions.has("students.export")) return new Response("You do not have permission to export students.", { status: 403 });
  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const tz = await academyTimezone();
  const where = studentWhere({ q: sp.q?.slice(0, 100), status: sp.status ?? "current", course: sp.course, teacher: sp.teacher, from: sp.from, to: sp.to }, tz);
  const rows = await db.all<Record<string, string | number | null>>(
    `SELECT s.ref_no, s.full_name, s.age, s.guardian_name, s.email, s.whatsapp, s.country, s.timezone, s.preferred_days, s.preferred_time, s.status,
       COALESCE(s.registered_at, s.created_at) AS registered,
       (SELECT GROUP_CONCAT(CONCAT(c.name, ' [', e.status, ']', IFNULL(CONCAT(' - ', t.full_name), '')) SEPARATOR '; ')
          FROM hq_enrolments e JOIN hq_courses c ON c.id = e.course_id LEFT JOIN hq_teachers t ON t.id = e.teacher_id WHERE e.student_id = s.id) AS enrolments
     FROM hq_students s ${where.sql} ORDER BY s.id LIMIT 20000`,
    where.params,
  );
  await audit(user.id, "student.exported", `Exported ${rows.length} students to CSV${sp.status ? ` (status: ${sp.status})` : ""}`);
  return csvResponse(`students-${new Date().toISOString().slice(0, 10)}.csv`,
    ["Ref", "Full name", "Age", "Guardian", "Email", "WhatsApp", "Country", "Timezone", "Preferred days", "Preferred time", "Record status", "Registered", "Enrolments (course [status] - teacher)"],
    rows.map((r) => [r.ref_no, r.full_name, r.age, r.guardian_name, r.email, r.whatsapp, countryName(r.country as string), r.timezone, daysLabel(r.preferred_days as string), r.preferred_time, r.status, fmtDay(r.registered as string, tz), r.enrolments]));
}

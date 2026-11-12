import * as db from "@/lib/portal/db";
import { audit } from "@/lib/portal/audit";
import { currentUser } from "@/lib/portal/auth";
import { csvResponse } from "@/lib/portal/csv";
import { teacherWhere } from "@/lib/portal/teachers";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return new Response("Sign in required", { status: 401 });
  if (!user.permissions.has("teachers.export")) return new Response("You do not have permission to export teachers.", { status: 403 });
  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const where = teacherWhere({ q: sp.q?.slice(0, 100), status: sp.status ?? "current", course: sp.course });
  const rows = await db.all<Record<string, string | number | null>>(
    `SELECT t.ref_no, t.full_name, t.email, t.phone, t.country, t.timezone, t.specialisations, t.qualifications, t.availability, t.status,
       (SELECT COUNT(DISTINCT e.student_id) FROM hq_enrolments e WHERE e.teacher_id = t.id AND e.status IN ('pending','active','paused')) AS students
     FROM hq_teachers t ${where.sql} ORDER BY t.full_name LIMIT 20000`, where.params);
  await audit(user.id, "teacher.exported", `Exported ${rows.length} teachers to CSV`);
  return csvResponse(`teachers-${new Date().toISOString().slice(0, 10)}.csv`,
    ["Ref", "Full name", "Email", "Phone", "Country", "Timezone", "Specialisations", "Qualifications", "Availability", "Record status", "Current students"],
    rows.map((r) => Object.values(r)));
}

import * as db from "@/lib/portal/db";
import { audit } from "@/lib/portal/audit";
import { currentUser } from "@/lib/portal/auth";
import { csvResponse } from "@/lib/portal/csv";
import { PLANS, countryName, daysLabel, packageName, statusLabel } from "@/lib/portal/lookups";
import { registrationWhere } from "@/lib/portal/registrations";
import { academyTimezone } from "@/lib/portal/settings";
import { fmtDateTime } from "@/lib/portal/time";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return new Response("Sign in required", { status: 401 });
  if (!user.permissions.has("registrations.export")) return new Response("You do not have permission to export registrations.", { status: 403 });
  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const tz = await academyTimezone();
  const where = registrationWhere({ ...sp, q: sp.q?.slice(0, 100), status: sp.status ?? "open" }, tz, user.id);
  const rows = await db.all<Record<string, string | number | null>>(
    `SELECT r.ref_no, r.full_name, r.age, r.guardian_name, r.email, r.whatsapp, r.country, r.package, r.classes_plan, r.preferred_days, r.preferred_time,
            r.message, r.status, r.rejection_reason, u.name AS assignee, r.follow_up_on, r.submitted_at, r.submitted_at_known, s.ref_no AS student_ref, r.source_form
       FROM hq_registrations r LEFT JOIN hq_users u ON u.id = r.assigned_to LEFT JOIN hq_students s ON s.id = r.student_id
       ${where.sql} ORDER BY r.submitted_at DESC LIMIT 20000`, where.params);
  await audit(user.id, "registration.exported", `Exported ${rows.length} registrations to CSV (status: ${sp.status ?? "open"})`);
  return csvResponse(`registrations-${new Date().toISOString().slice(0, 10)}.csv`,
    ["Ref", "Applicant", "Age", "Guardian", "Email", "WhatsApp", "Country", "Package", "Plan", "Preferred days", "Preferred time", "Message", "Status", "Rejection reason", "Assigned to", "Follow-up", "Submitted", "Student ref", "Source"],
    rows.map((r) => [r.ref_no, r.full_name, r.age, r.guardian_name, r.email, r.whatsapp, countryName(r.country as string), packageName(r.package as string),
      PLANS[r.classes_plan as string] ?? r.classes_plan, daysLabel(r.preferred_days as string), r.preferred_time, r.message, statusLabel(r.status as string),
      r.rejection_reason, r.assignee, r.follow_up_on, r.submitted_at_known ? fmtDateTime(r.submitted_at as string, tz) : "unknown (imported)", r.student_ref, r.source_form]));
}

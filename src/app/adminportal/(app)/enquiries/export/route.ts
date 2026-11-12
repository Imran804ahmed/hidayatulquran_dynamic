import * as db from "@/lib/portal/db";
import { audit } from "@/lib/portal/audit";
import { currentUser } from "@/lib/portal/auth";
import { csvResponse } from "@/lib/portal/csv";
import { enquiryWhere } from "@/lib/portal/enquiries";
import { statusLabel } from "@/lib/portal/lookups";
import { academyTimezone } from "@/lib/portal/settings";
import { fmtDateTime } from "@/lib/portal/time";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return new Response("Sign in required", { status: 401 });
  if (!user.permissions.has("enquiries.export")) return new Response("You do not have permission to export enquiries.", { status: 403 });
  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const tz = await academyTimezone();
  const where = enquiryWhere({ ...sp, q: sp.q?.slice(0, 100), status: sp.status ?? "open" }, tz, user.id);
  const rows = await db.all<Record<string, string | number | null>>(
    `SELECT e.ref_no, e.full_name, e.email, e.subject, e.message, e.status, IF(e.read_at IS NULL, 'unread', 'read') AS read_state, u.name AS assignee,
            e.follow_up_on, e.submitted_at, e.submitted_at_known, e.source_form
       FROM hq_enquiries e LEFT JOIN hq_users u ON u.id = e.assigned_to ${where.sql} ORDER BY e.submitted_at DESC LIMIT 20000`, where.params);
  await audit(user.id, "enquiry.exported", `Exported ${rows.length} enquiries to CSV`);
  return csvResponse(`enquiries-${new Date().toISOString().slice(0, 10)}.csv`,
    ["Ref", "Name", "Email", "Subject", "Message", "Status", "Read", "Assigned to", "Follow-up", "Received", "Source"],
    rows.map((r) => [r.ref_no, r.full_name, r.email, r.subject, r.message, statusLabel(r.status as string), r.read_state, r.assignee, r.follow_up_on,
      r.submitted_at_known ? fmtDateTime(r.submitted_at as string, tz) : "unknown (imported)", r.source_form]));
}

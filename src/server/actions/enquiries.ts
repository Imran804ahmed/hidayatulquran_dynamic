"use server";

import * as db from "@/lib/portal/db";
import { audit, statusHistory } from "@/lib/portal/audit";
import { PORTAL, requireAction } from "@/lib/portal/auth";
import { int, runAction, str, type ActionState } from "@/lib/portal/form";
import { ENQ_STATUS } from "@/lib/portal/lookups";
import { isYmd } from "@/lib/portal/time";
import type { EnquiryRow } from "@/lib/portal/enquiries";

export async function updateEnquiryAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const user = await requireAction("enquiries.edit");
    const id = int(fd, "id");
    if (!id) return { message: "Unknown enquiry." };
    const to = str(fd, "status", 20);
    const follow = str(fd, "follow_up_on", 10);
    const assignedRaw = str(fd, "assigned_to", 12);
    const errors: Record<string, string> = {};
    if (!(to in ENQ_STATUS)) errors.status = "Choose a status.";
    if (follow && !isYmd(follow)) errors.follow_up_on = "Use a valid date.";
    const assignee = assignedRaw ? Number(assignedRaw) : null;
    if (assignee && !(await db.value("SELECT id FROM hq_users WHERE id = ? AND status = 'active'", [assignee]))) errors.assigned_to = "Choose an active portal user.";
    if (Object.keys(errors).length) return { errors };
    const summary: string[] = [];
    await db.transaction(async (conn) => {
      const e = await db.one<EnquiryRow>("SELECT * FROM hq_enquiries WHERE id = ? FOR UPDATE", [id], conn);
      if (!e) throw new db.UserError("This enquiry no longer exists.");
      if (e.version !== (int(fd, "version") ?? 0)) throw new db.ConflictError();
      if (e.status !== to) {
        await statusHistory("enquiry", id, e.status, to, str(fd, "status_reason", 500) || null, user.id, conn);
        summary.push(`status ${ENQ_STATUS[e.status as keyof typeof ENQ_STATUS]} → ${ENQ_STATUS[to as keyof typeof ENQ_STATUS]}`);
      }
      if ((e.assigned_to ?? null) !== assignee) {
        const name = assignee ? await db.value<string>("SELECT name FROM hq_users WHERE id = ?", [assignee], conn) : null;
        summary.push(name ? `assigned to ${name}` : "unassigned");
      }
      if ((e.follow_up_on?.slice(0, 10) ?? "") !== follow) summary.push(follow ? `follow-up set to ${follow}` : "follow-up cleared");
      await db.exec("UPDATE hq_enquiries SET status = ?, assigned_to = ?, follow_up_on = ?, read_at = COALESCE(read_at, ?), version = version + 1, updated_at = ? WHERE id = ?",
        [to, assignee, follow || null, db.nowUtc(), db.nowUtc(), id], conn);
      if (summary.length) await audit(user.id, "enquiry.updated", `Enquiry ${e.ref_no}: ${summary.join("; ")}`, "enquiry", id, conn);
    });
    return { redirectTo: `${PORTAL}/enquiries/${id}`, flash: summary.length ? `Saved: ${summary.join("; ")}.` : "No changes to save.", flashType: summary.length ? "success" : "info" };
  });
}

export async function markEnquiryUnreadAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    await requireAction("enquiries.edit");
    const id = int(fd, "id");
    if (!id) return { message: "Unknown enquiry." };
    await db.exec("UPDATE hq_enquiries SET read_at = NULL WHERE id = ?", [id]);
    return { redirectTo: `${PORTAL}/enquiries?unread=1`, flash: "Marked as unread." };
  });
}

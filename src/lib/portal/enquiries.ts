import "server-only";
import * as db from "./db";
import { ENQ_OPEN } from "./lookups";
import { addDays, isYmd, localDayStartUtc, localYmd } from "./time";

export type EnquiryRow = {
  id: number; ref_no: string; source_form: string; full_name: string; email: string | null; subject: string | null; message: string | null;
  status: string; read_at: string | null; assigned_to: number | null; follow_up_on: string | null; confirmation_email: string;
  submitted_at: string; submitted_at_known: number; version: number; updated_at: string;
};

export const ENQ_SORTS: Record<string, string> = {
  submitted: "e.submitted_at", name: "e.full_name", status: "FIELD(e.status,'new','in_progress','resolved','archived')", followup: "e.follow_up_on IS NULL, e.follow_up_on",
};

/** status: open (default: New + In progress) | <status> | all;  unread=1;  followup/assigned as for registrations. */
export function enquiryWhere(f: { q?: string; status?: string; unread?: string; followup?: string; assigned?: string; from?: string; to?: string }, tz: string, meId: number) {
  const where: string[] = [];
  const params: db.Param[] = [];
  const status = f.status ?? "open";
  const open = `e.status IN (${ENQ_OPEN.map(() => "?").join(",")})`;
  if (status === "open") {
    where.push(open);
    params.push(...ENQ_OPEN);
  } else if (["new", "in_progress", "resolved", "archived"].includes(status)) {
    where.push("e.status = ?");
    params.push(status);
  }
  if (f.unread === "1") where.push("e.read_at IS NULL");
  if (f.q) {
    const t = db.likeTerm(f.q);
    where.push("(e.full_name LIKE ? OR e.ref_no LIKE ? OR e.email LIKE ? OR e.subject LIKE ? OR e.message LIKE ?)");
    params.push(t, t, t, t, t);
  }
  const today = localYmd(tz);
  if (f.followup === "overdue") {
    where.push(`e.follow_up_on < ? AND ${open}`);
    params.push(today, ...ENQ_OPEN);
  } else if (f.followup === "today") {
    where.push("e.follow_up_on = ?");
    params.push(today);
  } else if (f.followup === "week") {
    where.push("e.follow_up_on BETWEEN ? AND ?");
    params.push(today, addDays(today, 7));
  }
  if (f.assigned === "me") {
    where.push("e.assigned_to = ?");
    params.push(meId);
  } else if (f.assigned === "unassigned") where.push("e.assigned_to IS NULL");
  else if (f.assigned && /^\d+$/.test(f.assigned)) {
    where.push("e.assigned_to = ?");
    params.push(Number(f.assigned));
  }
  if (f.from && isYmd(f.from)) {
    where.push("e.submitted_at >= ?");
    params.push(localDayStartUtc(f.from, tz));
  }
  if (f.to && isYmd(f.to)) {
    where.push("e.submitted_at < ?");
    params.push(localDayStartUtc(addDays(f.to, 1), tz));
  }
  return { sql: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

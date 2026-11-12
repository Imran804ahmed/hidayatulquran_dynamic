import "server-only";
import * as db from "./db";
import { REG_OPEN } from "./lookups";
import { addDays, isYmd, localDayStartUtc, localYmd } from "./time";

export type RegistrationRow = {
  id: number; ref_no: string; source_form: string; full_name: string; age: number | null; country: string | null; guardian_name: string | null;
  whatsapp: string | null; whatsapp_digits: string | null; email: string | null; package: string | null; classes_plan: string | null;
  preferred_days: string | null; preferred_time: string | null; message: string | null; status: string; rejection_reason: string | null;
  assigned_to: number | null; follow_up_on: string | null; student_id: number | null; converted_at: string | null; converted_by: number | null;
  confirmation_email: string; submitted_at: string; submitted_at_known: number; version: number; updated_at: string; legacy_key: string | null;
};

export const REG_SORTS: Record<string, string> = {
  submitted: "r.submitted_at", name: "r.full_name", status: "FIELD(r.status,'new','under_review','contacted','approved','enrolled','rejected')",
  followup: "r.follow_up_on IS NULL, r.follow_up_on", ref: "r.id",
};

export type RegFilters = { q?: string; status?: string; followup?: string; assigned?: string; package?: string; country?: string; from?: string; to?: string };

/**
 * Shared by the inbox, CSV export and dashboard links.
 * status: open (default: New + Under review + Contacted + Approved) | <status> | all
 * followup: overdue | today | week | none   assigned: me | unassigned | <user id>
 */
export function registrationWhere(f: RegFilters, tz: string, meId: number): { sql: string; params: db.Param[] } {
  const where: string[] = [];
  const params: db.Param[] = [];
  const status = f.status ?? "open";
  const open = `r.status IN (${REG_OPEN.map(() => "?").join(",")})`;
  if (status === "open") {
    where.push(open);
    params.push(...REG_OPEN);
  } else if (["new", "under_review", "contacted", "approved", "enrolled", "rejected"].includes(status)) {
    where.push("r.status = ?");
    params.push(status);
  }
  if (f.q) {
    const t = db.likeTerm(f.q);
    const digits = f.q.replace(/\D+/g, "");
    where.push(`(r.full_name LIKE ? OR r.ref_no LIKE ? OR r.email LIKE ? OR r.guardian_name LIKE ?${digits.length >= 4 ? " OR r.whatsapp_digits LIKE ?" : ""})`);
    params.push(t, t, t, t);
    if (digits.length >= 4) params.push(`%${digits}%`);
  }
  const today = localYmd(tz);
  if (f.followup === "overdue") {
    where.push(`r.follow_up_on < ? AND ${open}`);
    params.push(today, ...REG_OPEN);
  } else if (f.followup === "today") {
    where.push("r.follow_up_on = ?");
    params.push(today);
  } else if (f.followup === "week") {
    where.push("r.follow_up_on BETWEEN ? AND ?");
    params.push(today, addDays(today, 7));
  } else if (f.followup === "none") {
    where.push("r.follow_up_on IS NULL");
  }
  if (f.assigned === "me") {
    where.push("r.assigned_to = ?");
    params.push(meId);
  } else if (f.assigned === "unassigned") {
    where.push("r.assigned_to IS NULL");
  } else if (f.assigned && /^\d+$/.test(f.assigned)) {
    where.push("r.assigned_to = ?");
    params.push(Number(f.assigned));
  }
  if (f.package) {
    where.push("r.package = ?");
    params.push(f.package);
  }
  if (f.country) {
    where.push("r.country = ?");
    params.push(f.country);
  }
  if (f.from && isYmd(f.from)) {
    where.push("r.submitted_at >= ?");
    params.push(localDayStartUtc(f.from, tz));
  }
  if (f.to && isYmd(f.to)) {
    where.push("r.submitted_at < ?");
    params.push(localDayStartUtc(addDays(f.to, 1), tz));
  }
  return { sql: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

/** Likely duplicates: other registrations and existing students sharing email or WhatsApp digits. */
export async function registrationDuplicates(r: Pick<RegistrationRow, "id" | "email" | "whatsapp_digits" | "full_name">) {
  const conds: string[] = [];
  const params: db.Param[] = [];
  if (r.email) {
    conds.push("email = ?");
    params.push(r.email);
  }
  if (r.whatsapp_digits && r.whatsapp_digits.length >= 7) {
    conds.push("whatsapp_digits = ?");
    params.push(r.whatsapp_digits);
  }
  const otherRegs = conds.length
    ? await db.all<{ id: number; ref_no: string; full_name: string; status: string; submitted_at: string }>(
        `SELECT id, ref_no, full_name, status, submitted_at FROM hq_registrations WHERE (${conds.join(" OR ")}) AND id <> ? ORDER BY submitted_at DESC LIMIT 10`, [...params, r.id])
    : [];
  const students = await db.all<{ id: number; ref_no: string; full_name: string; status: string; email: string | null; whatsapp: string | null; guardian_name: string | null; reason: string }>(
    `SELECT id, ref_no, full_name, status, email, whatsapp, guardian_name,
       CONCAT_WS(', ', IF(email = ?, 'same email', NULL), IF(whatsapp_digits = ? AND ? <> '', 'same WhatsApp', NULL), IF(full_name = ?, 'same name', NULL)) AS reason
       FROM hq_students WHERE ${[...conds, "full_name = ?"].join(" OR ")} ORDER BY status = 'archived', id LIMIT 10`,
    [r.email ?? "", r.whatsapp_digits ?? "", r.whatsapp_digits ?? "", r.full_name, ...params, r.full_name],
  );
  return { otherRegs, students };
}

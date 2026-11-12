import "server-only";
import type { PoolConnection } from "mysql2/promise";
import * as db from "./db";
import { clientIp } from "./request";

export type EntityType = "student" | "teacher" | "registration" | "enquiry" | "course" | "enrolment" | "class" | "user" | "settings";

/**
 * Append-only audit trail. Summaries describe WHAT changed; they must never contain passwords,
 * tokens or message/note bodies.
 */
export async function audit(
  userId: number | null,
  action: string,
  summary: string,
  entityType: EntityType | null = null,
  entityId: number | null = null,
  ex?: PoolConnection,
): Promise<void> {
  await db.insert(
    "hq_audit_log",
    { user_id: userId, action, entity_type: entityType, entity_id: entityId, summary: summary.slice(0, 500), ip: await clientIp().catch(() => "n/a"), created_at: db.nowUtc() },
    ex,
  );
}

export async function statusHistory(
  entityType: EntityType,
  entityId: number,
  from: string | null,
  to: string,
  reason: string | null,
  userId: number | null,
  ex?: PoolConnection,
): Promise<void> {
  await db.insert(
    "hq_status_history",
    { entity_type: entityType, entity_id: entityId, from_status: from, to_status: to, reason: reason ? reason.slice(0, 500) : null, user_id: userId, created_at: db.nowUtc() },
    ex,
  );
}

export type HistoryRow = { id: number; from_status: string | null; to_status: string; reason: string | null; user_name: string | null; created_at: string };
export type AuditRow = { id: number; action: string; summary: string; entity_type: string | null; entity_id: number | null; user_name: string | null; created_at: string };

export function getHistory(entityType: EntityType, entityId: number) {
  return db.all<HistoryRow>(
    `SELECT h.id, h.from_status, h.to_status, h.reason, h.created_at, u.name AS user_name
       FROM hq_status_history h LEFT JOIN hq_users u ON u.id = h.user_id
      WHERE h.entity_type = ? AND h.entity_id = ? ORDER BY h.created_at DESC, h.id DESC`,
    [entityType, entityId],
  );
}

export function getEntityAudit(entityType: EntityType, entityId: number, limit = 25) {
  return db.all<AuditRow>(
    `SELECT a.id, a.action, a.summary, a.entity_type, a.entity_id, a.created_at, u.name AS user_name
       FROM hq_audit_log a LEFT JOIN hq_users u ON u.id = a.user_id
      WHERE a.entity_type = ? AND a.entity_id = ? ORDER BY a.id DESC LIMIT ${Math.trunc(limit)}`,
    [entityType, entityId],
  );
}

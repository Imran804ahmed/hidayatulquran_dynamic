import "server-only";
import type { PoolConnection } from "mysql2/promise";
import * as db from "./db";

const PREFIX = { hq_students: "HQS-", hq_teachers: "HQT-", hq_registrations: "REG-", hq_enquiries: "ENQ-" } as const;

/** Human-friendly unique reference derived from the primary key, e.g. HQS-00042. */
export async function assignRef(table: keyof typeof PREFIX, id: number, ex?: PoolConnection): Promise<string> {
  const ref = PREFIX[table] + String(id).padStart(5, "0");
  await db.exec(`UPDATE ${table} SET ref_no = ? WHERE id = ?`, [ref, id], ex);
  return ref;
}

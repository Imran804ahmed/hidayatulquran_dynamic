import "server-only";
import mysql from "mysql2/promise";
import type { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

/**
 * MySQL access through a single pooled connection set. Every query uses placeholders; table and
 * column names are never taken from user input. Dates are exchanged as UTC 'YYYY-MM-DD HH:MM:SS'
 * strings (dateStrings) so no implicit timezone conversion happens in the driver.
 */

type Executor = Pool | PoolConnection;
export type Row = Record<string, unknown>;
export type Param = string | number | null | boolean | Date;

const globalForDb = globalThis as unknown as { hqPool?: Pool };

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable ${name}`);
  return v;
}

export function pool(): Pool {
  if (!globalForDb.hqPool) {
    globalForDb.hqPool = mysql.createPool({
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT ?? 3306),
      user: required("DB_USER"),
      password: process.env.DB_PASSWORD ?? "",
      database: required("DB_NAME"),
      connectionLimit: Number(process.env.DB_POOL_SIZE ?? 5),
      timezone: "Z",
      dateStrings: true,
      charset: "utf8mb4",
      supportBigNumbers: true,
      bigNumberStrings: false,
    });
    globalForDb.hqPool.on("connection", (conn) => {
      conn.query("SET time_zone = '+00:00'");
    });
  }
  return globalForDb.hqPool;
}

export async function all<T extends Row = Row>(sql: string, params: Param[] = [], ex: Executor = pool()): Promise<T[]> {
  const [rows] = await ex.query<RowDataPacket[]>(sql, params);
  return rows as unknown as T[];
}

export async function one<T extends Row = Row>(sql: string, params: Param[] = [], ex: Executor = pool()): Promise<T | null> {
  const rows = await all<T>(sql, params, ex);
  return rows[0] ?? null;
}

export async function value<T = unknown>(sql: string, params: Param[] = [], ex: Executor = pool()): Promise<T | null> {
  const row = await one(sql, params, ex);
  return row ? (Object.values(row)[0] as T) : null;
}

export async function count(sql: string, params: Param[] = [], ex: Executor = pool()): Promise<number> {
  return Number((await value(sql, params, ex)) ?? 0);
}

export async function exec(sql: string, params: Param[] = [], ex: Executor = pool()): Promise<ResultSetHeader> {
  const [res] = await ex.query<ResultSetHeader>(sql, params);
  return res;
}

/** INSERT with a column map built in code (keys are trusted identifiers, values are bound). */
export async function insert(table: string, data: Record<string, Param | undefined>, ex: Executor = pool()): Promise<number> {
  const cols = Object.keys(data).filter((k) => data[k] !== undefined);
  const res = await exec(
    `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`,
    cols.map((c) => data[c] as Param),
    ex,
  );
  return res.insertId;
}

/** UPDATE by id; when `version` is given the update only applies if the row is unchanged (optimistic lock). */
export async function update(
  table: string,
  id: number,
  data: Record<string, Param | undefined>,
  ex: Executor = pool(),
  version?: number,
): Promise<number> {
  const cols = Object.keys(data).filter((k) => data[k] !== undefined);
  const sets = cols.map((c) => `${c} = ?`);
  const params: Param[] = cols.map((c) => data[c] as Param);
  if (version !== undefined) sets.push("version = version + 1");
  let sql = `UPDATE ${table} SET ${sets.join(", ")} WHERE id = ?`;
  params.push(id);
  if (version !== undefined) {
    sql += " AND version = ?";
    params.push(version);
  }
  return (await exec(sql, params, ex)).affectedRows;
}

/** Runs fn in a transaction on one connection; rolls back on any thrown error. */
export async function transaction<T>(fn: (conn: PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback().catch(() => undefined);
    throw err;
  } finally {
    conn.release();
  }
}

export function isDuplicateKey(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { errno?: number }).errno === 1062;
}

/** Current UTC time as a MySQL DATETIME string. */
export function nowUtc(): string {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

export function utcFromDate(d: Date): string {
  return d.toISOString().slice(0, 19).replace("T", " ");
}

/** Escapes LIKE wildcards in user search text. */
export function likeTerm(q: string): string {
  return `%${q.replace(/[\\%_]/g, (m) => "\\" + m)}%`;
}

export class ConflictError extends Error {
  constructor(message = "This record was changed by someone else while you were editing. Reload the page to see the latest version, then apply your changes again.") {
    super(message);
  }
}

export class UserError extends Error {}

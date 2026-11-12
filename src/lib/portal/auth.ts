import "server-only";
import crypto from "node:crypto";
import { promisify } from "node:util";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as db from "./db";
import { ASSIGNABLE, type Permission } from "./permissions";
import { audit } from "./audit";
import { clientIp, isRateLimited, recordRate, sha256, userAgent } from "./request";

export const PORTAL = "/adminportal";
export const SESSION_COOKIE = "hq_portal_session";
export const IDLE_TIMEOUT_SEC = 30 * 60; // signed out after 30 minutes without activity
export const ABSOLUTE_TIMEOUT_SEC = 12 * 60 * 60; // and always after 12 hours

const scrypt = promisify(crypto.scrypt) as (pw: string, salt: Buffer, len: number, opts: crypto.ScryptOptions) => Promise<Buffer>;
const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

/* ---------- password hashing: scrypt$N$r$p$salt$hash (same format as scripts/portal.mjs) ---------- */

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 64, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, N, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(N), r: Number(r), p: Number(p), maxmem: SCRYPT.maxmem,
  });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

const DUMMY_HASH = hashPassword("timing-equaliser-not-a-real-password");

export function passwordProblem(password: string, confirm: string): string | null {
  if (password.length < 10) return "Use at least 10 characters.";
  if (password.length > 200) return "Use at most 200 characters.";
  if (password !== confirm) return "The two passwords do not match.";
  return null;
}

/* ---------- sessions ---------- */

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "admin";
  permissions: Set<Permission>;
};

function cookieSecure(): boolean {
  return process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === "1" : process.env.NODE_ENV === "production";
}

async function createSession(userId: number): Promise<void> {
  const token = crypto.randomBytes(32).toString("base64url");
  const now = db.nowUtc();
  await db.insert("hq_sessions", {
    id: sha256(token), user_id: userId, created_at: now, last_seen_at: now,
    expires_at: db.utcFromDate(new Date(Date.now() + ABSOLUTE_TIMEOUT_SEC * 1000)),
    ip: await clientIp(), user_agent: await userAgent(),
  });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, secure: cookieSecure(), sameSite: "lax", path: PORTAL, maxAge: ABSOLUTE_TIMEOUT_SEC,
  });
}

/**
 * The signed-in user for this request, or null. Enforces idle and absolute expiry and account
 * status on every call (cached per request). Sliding expiry is stored in the database, so it
 * also works for Server Component renders where cookies cannot be written.
 */
export const currentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const id = sha256(token);
  const row = await db.one<{ user_id: number; last_seen_at: string; expires_at: string; name: string; email: string; role: "super_admin" | "admin"; status: string }>(
    `SELECT s.user_id, s.last_seen_at, s.expires_at, u.name, u.email, u.role, u.status
       FROM hq_sessions s JOIN hq_users u ON u.id = s.user_id WHERE s.id = ?`,
    [id],
  );
  if (!row) return null;
  const now = Date.now();
  const lastSeen = new Date(row.last_seen_at.replace(" ", "T") + "Z").getTime();
  const expires = new Date(row.expires_at.replace(" ", "T") + "Z").getTime();
  if (row.status !== "active" || now > expires || now - lastSeen > IDLE_TIMEOUT_SEC * 1000) {
    await db.exec("DELETE FROM hq_sessions WHERE id = ?", [id]);
    return null;
  }
  if (now - lastSeen > 60_000) {
    await db.exec("UPDATE hq_sessions SET last_seen_at = ? WHERE id = ?", [db.nowUtc(), id]);
  }
  let permissions: Set<Permission>;
  if (row.role === "super_admin") {
    permissions = new Set<Permission>([...ASSIGNABLE, "users.manage"]);
  } else {
    const perms = await db.all<{ permission: string }>("SELECT permission FROM hq_user_permissions WHERE user_id = ?", [row.user_id]);
    permissions = new Set(perms.map((p) => p.permission).filter((p) => (ASSIGNABLE as string[]).includes(p)) as Permission[]);
  }
  return { id: row.user_id, name: row.name, email: row.email, role: row.role, permissions };
});

/** Whether a session cookie was present (used to tell "expired" from "never signed in"). */
export async function hadSessionCookie(): Promise<boolean> {
  return Boolean((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For pages: redirects to sign-in when signed out; renders the 403 page when the permission is missing. */
export async function requirePage(permission?: Permission, nextPath?: string): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) {
    const expired = await hadSessionCookie();
    const q = new URLSearchParams();
    if (nextPath) q.set("next", nextPath);
    if (expired) q.set("expired", "1");
    redirect(`${PORTAL}/login${q.size ? `?${q}` : ""}`);
  }
  if (permission && !user.permissions.has(permission)) {
    redirect(`${PORTAL}/no-access?permission=${encodeURIComponent(permission)}`);
  }
  return user;
}

export class AuthError extends Error {}

/** For Server Actions and route handlers: throws AuthError (never trusts the client). */
export async function requireAction(permission?: Permission): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) throw new AuthError("Your session has ended. Please sign in again.");
  if (permission && !user.permissions.has(permission)) throw new AuthError(`Your account does not include the "${permission}" permission.`);
  return user;
}

export function can(user: SessionUser | null, permission: Permission): boolean {
  return Boolean(user?.permissions.has(permission));
}

/* ---------- sign in / out ---------- */

export async function signIn(emailRaw: string, password: string): Promise<string | null> {
  const email = emailRaw.trim().toLowerCase();
  if (await isRateLimited("login", email, { perSubject: 5, perIp: 20, windowSec: 900 })) {
    return "Too many unsuccessful sign-in attempts. Please wait 15 minutes and try again.";
  }
  const user = await db.one<{ id: number; password_hash: string; status: string }>(
    "SELECT id, password_hash, status FROM hq_users WHERE email = ?", [email],
  );
  // Always run one scrypt verification so response time does not reveal whether the email exists.
  const ok = (await verifyPassword(password, user?.password_hash ?? (await DUMMY_HASH))) && user?.status === "active";
  await recordRate("login", email, Boolean(ok));
  if (!ok || !user) return "The email or password is incorrect, or the account is disabled.";
  await createSession(user.id);
  await db.exec("UPDATE hq_users SET last_login_at = ? WHERE id = ?", [db.nowUtc(), user.id]);
  await audit(user.id, "auth.login", "Signed in", "user", user.id);
  return null;
}

export async function signOut(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const user = await currentUser();
  if (token) await db.exec("DELETE FROM hq_sessions WHERE id = ?", [sha256(token)]);
  jar.delete({ name: SESSION_COOKIE, path: PORTAL });
  if (user) await audit(user.id, "auth.logout", "Signed out", "user", user.id);
}

/** Sets a password and ends every session of that user except (optionally) the current one. */
export async function setPassword(userId: number, password: string, keepCurrent: boolean): Promise<void> {
  await db.exec("UPDATE hq_users SET password_hash = ?, password_changed_at = ?, updated_at = ? WHERE id = ?", [
    await hashPassword(password), db.nowUtc(), db.nowUtc(), userId,
  ]);
  const token = keepCurrent ? (await cookies()).get(SESSION_COOKIE)?.value : undefined;
  if (token) {
    await db.exec("DELETE FROM hq_sessions WHERE user_id = ? AND id <> ?", [userId, sha256(token)]);
  } else {
    await db.exec("DELETE FROM hq_sessions WHERE user_id = ?", [userId]);
  }
}

export async function endAllSessions(userId: number): Promise<void> {
  await db.exec("DELETE FROM hq_sessions WHERE user_id = ?", [userId]);
}

/** Safe post-login redirect: only paths inside the portal. */
export function safeNext(next: string | null | undefined): string | null {
  if (!next || typeof next !== "string") return null;
  if (!next.startsWith(PORTAL + "/") && next !== PORTAL) return null;
  if (next.startsWith("//") || /[\\\r\n]/.test(next) || next.includes("/../") || next.includes("//")) return null;
  return next;
}

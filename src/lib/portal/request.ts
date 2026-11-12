import "server-only";
import crypto from "node:crypto";
import { headers } from "next/headers";
import * as db from "./db";

/**
 * Client IP. Only trusts X-Forwarded-For when TRUST_PROXY=1 (set this when the app runs behind
 * a reverse proxy such as Hostinger's Node.js hosting or nginx); otherwise the header is ignored.
 */
export async function clientIp(): Promise<string> {
  const h = await headers();
  if (process.env.TRUST_PROXY === "1") {
    const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (fwd) return fwd.slice(0, 45);
    const real = h.get("x-real-ip");
    if (real) return real.slice(0, 45);
  }
  return "direct";
}

export async function userAgent(): Promise<string> {
  return ((await headers()).get("user-agent") ?? "").slice(0, 255);
}

export function sha256(v: string): string {
  return crypto.createHash("sha256").update(v).digest("hex");
}

/* ---------- rate limiting (DB backed, survives restarts and works across processes) ---------- */

export type RateKind = "login" | "reset" | "form";

export async function isRateLimited(kind: RateKind, subject: string | null, opts: { perSubject: number; perIp: number; windowSec: number }): Promise<boolean> {
  const ip = await clientIp();
  const since = db.utcFromDate(new Date(Date.now() - opts.windowSec * 1000));
  if (subject !== null) {
    const bySubject = await db.count(
      "SELECT COUNT(*) FROM hq_rate_events WHERE kind = ? AND subject_hash = ? AND ip = ? AND success = 0 AND created_at > ?",
      [kind, sha256(subject.toLowerCase()), ip, since],
    );
    if (bySubject >= opts.perSubject) return true;
  }
  // Without a trusted proxy every client shares the placeholder IP "direct"; a per-IP limit would
  // then lock out everyone at once, so only the per-account limit applies in that mode.
  if (ip === "direct") return false;
  const byIp = await db.count(
    "SELECT COUNT(*) FROM hq_rate_events WHERE kind = ? AND ip = ? AND success = 0 AND created_at > ?",
    [kind, ip, since],
  );
  return byIp >= opts.perIp;
}

/** Records an event. `success = false` events count toward limits. */
export async function recordRate(kind: RateKind, subject: string | null, success: boolean): Promise<void> {
  await db.insert("hq_rate_events", {
    kind, subject_hash: subject ? sha256(subject.toLowerCase()) : null, ip: await clientIp(), success: success ? 1 : 0, created_at: db.nowUtc(),
  });
  if (Math.random() < 0.02) {
    await db.exec("DELETE FROM hq_rate_events WHERE created_at < ?", [db.utcFromDate(new Date(Date.now() - 30 * 86400000))]);
  }
}

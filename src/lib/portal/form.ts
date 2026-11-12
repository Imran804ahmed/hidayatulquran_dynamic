import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError, PORTAL } from "./auth";
import { ConflictError, UserError, isDuplicateKey } from "./db";
import type { ActionState } from "./form-types";

export type { ActionState } from "./form-types";

/** Result of an action body: either field errors / a message, or a redirect with a flash message. */
export type ActionOutcome =
  | { errors?: Record<string, string | undefined>; message?: string; redirectTo?: undefined; flash?: undefined; flashType?: undefined }
  | { redirectTo: string; flash?: string; flashType?: "success" | "info" | "warning" | "error"; errors?: undefined; message?: undefined };

/** Collects the submitted string values so the form can be re-rendered without losing input. */
export function formValues(fd: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v !== "string" || k.startsWith("$ACTION") || k === "password" || k === "password_confirm") continue;
    values[k] = k in values ? `${values[k]},${v}` : v;
  }
  return values;
}

export async function setFlash(message: string, type: "success" | "info" | "warning" | "error" = "success") {
  (await cookies()).set("hq_flash", JSON.stringify({ type, message }), { path: PORTAL, maxAge: 60, sameSite: "lax", httpOnly: false });
}

/**
 * Standard wrapper for portal Server Actions: maps expected failures to friendly messages,
 * never leaks internals, keeps entered values, and performs redirects outside the try block.
 */
export async function runAction(prev: ActionState, fd: FormData, body: () => Promise<ActionOutcome>): Promise<ActionState> {
  let outcome: ActionOutcome;
  try {
    outcome = await body();
  } catch (err) {
    let message = "Something went wrong and nothing was saved. Please try again.";
    if (err instanceof AuthError || err instanceof UserError || err instanceof ConflictError) message = err.message;
    else if (isDuplicateKey(err)) message = "This would create a duplicate record, so nothing was saved.";
    else console.error("[adminportal] action failed:", err);
    return { ok: false, message, errors: {}, values: formValues(fd), nonce: prev.nonce + 1 };
  }
  if (outcome.redirectTo) {
    if (outcome.flash) await setFlash(outcome.flash, outcome.flashType ?? "success");
    redirect(outcome.redirectTo);
  }
  const errors = Object.fromEntries(Object.entries(outcome.errors ?? {}).filter((e): e is [string, string] => typeof e[1] === "string"));
  const hasErrors = Object.keys(errors).length > 0;
  return {
    ok: !hasErrors && !outcome.message,
    message: outcome.message ?? (hasErrors ? "Please correct the highlighted fields." : undefined),
    errors,
    values: formValues(fd),
    nonce: prev.nonce + 1,
  };
}

/* ---------- small, explicit validators ---------- */

export function str(fd: FormData, key: string, max = 255): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function int(fd: FormData, key: string): number | null {
  const v = str(fd, key, 20);
  return /^-?\d+$/.test(v) ? Number(v) : null;
}

export function list(fd: FormData, key: string): string[] {
  return fd.getAll(key).filter((v): v is string => typeof v === "string").map((v) => v.trim()).filter(Boolean);
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 190;
}

export function oneOf<T extends string>(v: string, allowed: readonly T[] | Record<T, unknown>): v is T {
  const keys = Array.isArray(allowed) ? allowed : Object.keys(allowed);
  return (keys as string[]).includes(v);
}

export function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

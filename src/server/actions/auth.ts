"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import * as db from "@/lib/portal/db";
import { audit } from "@/lib/portal/audit";
import { PORTAL, passwordProblem, requireAction, safeNext, setPassword, signIn, signOut } from "@/lib/portal/auth";
import { formValues, isEmail, runAction, setFlash, str, type ActionState } from "@/lib/portal/form";
import { escapeHtml, sendMail } from "@/lib/portal/mailer";
import { isRateLimited, recordRate, sha256 } from "@/lib/portal/request";

export async function loginAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, "email", 190).toLowerCase();
  const password = typeof fd.get("password") === "string" ? (fd.get("password") as string) : "";
  const errors: Record<string, string> = {};
  if (!isEmail(email)) errors.email = "Enter the email address of your portal account.";
  if (!password) errors.password = "Enter your password.";
  if (Object.keys(errors).length) return { ok: false, errors, values: formValues(fd), nonce: prev.nonce + 1, message: "Please correct the highlighted fields." };
  let problem: string | null;
  try {
    problem = await signIn(email, password);
  } catch (err) {
    console.error("[adminportal] sign-in error:", err);
    problem = "Sign-in is temporarily unavailable (the portal could not reach its database). Please try again shortly.";
  }
  if (problem) return { ok: false, errors: {}, values: formValues(fd), nonce: prev.nonce + 1, message: problem };
  redirect(safeNext(str(fd, "next", 500)) ?? `${PORTAL}/dashboard`);
}

export async function logoutAction(): Promise<void> {
  await signOut();
  await setFlash("You have signed out.", "success");
  redirect(`${PORTAL}/login`);
}

export async function forgotAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const email = str(fd, "email", 190).toLowerCase();
    if (!isEmail(email)) return { errors: { email: "Enter a valid email address." } };
    if (await isRateLimited("reset", email, { perSubject: 3, perIp: 10, windowSec: 900 })) {
      return { message: "Too many reset requests. Please wait 15 minutes and try again." };
    }
    await recordRate("reset", email, false);
    const user = await db.one<{ id: number; name: string; email: string }>("SELECT id, name, email FROM hq_users WHERE email = ? AND status = 'active'", [email]);
    if (user) {
      const token = crypto.randomBytes(32).toString("base64url");
      await db.exec("UPDATE hq_password_resets SET used_at = ? WHERE user_id = ? AND used_at IS NULL", [db.nowUtc(), user.id]);
      await db.insert("hq_password_resets", {
        user_id: user.id, token_hash: sha256(token), expires_at: db.utcFromDate(new Date(Date.now() + 3600_000)), created_at: db.nowUtc(),
      });
      const base = (process.env.PUBLIC_SITE_URL ?? "https://www.hidayatulquran.com").replace(/\/$/, "");
      const link = `${base}${PORTAL}/reset-password?token=${token}`;
      const result = await sendMail(user.email, user.name, "Reset your admin portal password",
        `<p>Assalamu alaikum ${escapeHtml(user.name)},</p><p>A password reset was requested for your Hidayatul Quran admin portal account.</p>
         <p><a href="${escapeHtml(link)}">Choose a new password</a> (valid for 60 minutes, single use).</p>
         <p>If you did not request this, ignore this email; your password is unchanged.</p>`);
      await audit(null, "auth.reset_requested", `Password reset email ${result.ok ? "accepted by mail server" : `failed: ${result.error}`}`, "user", user.id);
    }
    // Same answer whether or not the account exists (prevents account discovery).
    return { redirectTo: `${PORTAL}/forgot-password?sent=1` };
  });
}

export async function resetAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const token = str(fd, "token", 100);
    const password = String(fd.get("password") ?? "");
    const problem = passwordProblem(password, String(fd.get("password_confirm") ?? ""));
    if (problem) return { errors: { password: problem } };
    const userId = await db.transaction(async (conn) => {
      const row = await db.one<{ id: number; user_id: number }>(
        `SELECT r.id, r.user_id FROM hq_password_resets r JOIN hq_users u ON u.id = r.user_id
          WHERE r.token_hash = ? AND r.used_at IS NULL AND r.expires_at > ? AND u.status = 'active' FOR UPDATE`,
        [sha256(token), db.nowUtc()], conn,
      );
      if (!row) return null;
      await db.exec("UPDATE hq_password_resets SET used_at = ? WHERE id = ?", [db.nowUtc(), row.id], conn);
      return row.user_id;
    });
    if (!userId) return { message: "This reset link has expired or was already used. Request a new one." };
    await setPassword(userId, password, false);
    await audit(userId, "auth.password_reset", "Password changed with a reset link", "user", userId);
    return { redirectTo: `${PORTAL}/login`, flash: "Your password has been changed. Sign in with the new password." };
  });
}

export async function changeOwnPasswordAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const user = await requireAction();
    const current = String(fd.get("current_password") ?? "");
    const password = String(fd.get("password") ?? "");
    const { verifyPassword } = await import("@/lib/portal/auth");
    const row = await db.one<{ password_hash: string }>("SELECT password_hash FROM hq_users WHERE id = ?", [user.id]);
    if (!row || !(await verifyPassword(current, row.password_hash))) return { errors: { current_password: "Your current password is not correct." } };
    const problem = passwordProblem(password, String(fd.get("password_confirm") ?? ""));
    if (problem) return { errors: { password: problem } };
    await setPassword(user.id, password, true);
    await audit(user.id, "user.password_changed", "Changed own password (other sessions signed out)", "user", user.id);
    return { redirectTo: `${PORTAL}/profile`, flash: "Password changed. Other devices have been signed out." };
  });
}

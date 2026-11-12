"use server";

import * as db from "@/lib/portal/db";
import { audit } from "@/lib/portal/audit";
import { PORTAL, endAllSessions, hashPassword, passwordProblem, requireAction } from "@/lib/portal/auth";
import { int, isEmail, list, runAction, str, type ActionState } from "@/lib/portal/form";
import { isAssignable } from "@/lib/portal/permissions";
import { SETTING_DEFAULTS, getSettings, saveSetting, type SettingKey } from "@/lib/portal/settings";
import { isValidTimezone } from "@/lib/portal/time";

async function superAdminCount(conn?: Parameters<typeof db.count>[2]) {
  return db.count("SELECT COUNT(*) FROM hq_users WHERE role = 'super_admin' AND status = 'active'", [], conn);
}

export async function saveUserAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const me = await requireAction("users.manage");
    const id = int(fd, "id");
    const name = str(fd, "name", 120);
    const email = str(fd, "email", 190).toLowerCase();
    const role = str(fd, "role", 20) === "super_admin" ? "super_admin" : "admin";
    const status = str(fd, "status", 20) === "disabled" ? "disabled" : "active";
    const perms = list(fd, "permissions").filter(isAssignable);
    const password = String(fd.get("password") ?? "");
    const errors: Record<string, string> = {};
    if (!name) errors.name = "Enter a name.";
    if (!isEmail(email)) errors.email = "Enter a valid email address.";
    if (!id || password) {
      const p = passwordProblem(password, String(fd.get("password_confirm") ?? ""));
      if (p) errors.password = id ? `New password: ${p}` : p;
    }
    if (role === "admin" && perms.length === 0) errors.permissions = "Give an Admin / Coordinator at least one permission.";
    if (Object.keys(errors).length) return { errors };
    if (await db.value("SELECT id FROM hq_users WHERE email = ? AND id <> ?", [email, id ?? 0])) return { errors: { email: "Another portal user already uses this email." } };

    return db.transaction(async (conn) => {
      const now = db.nowUtc();
      let userId = id;
      if (id) {
        const before = await db.one<{ role: string; status: string; email: string }>("SELECT role, status, email FROM hq_users WHERE id = ? FOR UPDATE", [id], conn);
        if (!before) throw new db.UserError("This user no longer exists.");
        const losingSuper = before.role === "super_admin" && before.status === "active" && (role !== "super_admin" || status !== "active");
        if (losingSuper && (await superAdminCount(conn)) <= 1) throw new db.UserError("This is the only active Super Admin. Make another user Super Admin first.");
        if (id === me.id && status !== "active") throw new db.UserError("You cannot disable your own account.");
        await db.exec("UPDATE hq_users SET name = ?, email = ?, role = ?, status = ?, updated_at = ? WHERE id = ?", [name, email, role, status, now, id], conn);
        if (password) await db.exec("UPDATE hq_users SET password_hash = ?, password_changed_at = ? WHERE id = ?", [await hashPassword(password), now, id], conn);
        const changes = [before.role !== role && `role ${before.role} → ${role}`, before.status !== status && `status ${before.status} → ${status}`, password && "password reset by admin", before.email !== email && "email changed"].filter(Boolean);
        await audit(me.id, "user.updated", `Updated portal user ${email}${changes.length ? `: ${changes.join("; ")}` : ""}`, "user", id, conn);
      } else {
        userId = await db.insert("hq_users", { name, email, password_hash: await hashPassword(password), role, status, password_changed_at: now, created_at: now, updated_at: now }, conn);
        await audit(me.id, "user.created", `Created portal user ${email} (${role === "super_admin" ? "Super Admin" : "Admin / Coordinator"})`, "user", userId, conn);
      }
      const old = (await db.all<{ permission: string }>("SELECT permission FROM hq_user_permissions WHERE user_id = ?", [userId!], conn)).map((p) => p.permission);
      const next = role === "super_admin" ? [] : perms;
      await db.exec("DELETE FROM hq_user_permissions WHERE user_id = ?", [userId!], conn);
      for (const p of next) await db.exec("INSERT INTO hq_user_permissions (user_id, permission) VALUES (?, ?)", [userId!, p], conn);
      const added = next.filter((p) => !old.includes(p));
      const removed = old.filter((p) => !(next as string[]).includes(p));
      if (id && (added.length || removed.length)) {
        await audit(me.id, "user.permissions_changed", `Permissions for ${email}: ${added.length ? `added ${added.join(", ")}` : ""}${added.length && removed.length ? "; " : ""}${removed.length ? `removed ${removed.join(", ")}` : ""}`, "user", userId!, conn);
      }
      if (id && (status !== "active" || password)) await endAllSessions(id);
      return { redirectTo: `${PORTAL}/users`, flash: id ? "User saved." : "User created. Share the temporary password securely and ask them to change it in My profile." };
    });
  });
}

export async function saveSettingsAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const me = await requireAction("settings.manage");
    const errors: Record<string, string> = {};
    const values: Partial<Record<SettingKey, string>> = {
      academy_name: str(fd, "academy_name", 120),
      academy_email: str(fd, "academy_email", 190),
      academy_phone: str(fd, "academy_phone", 40),
      timezone: str(fd, "timezone", 64),
      notify_emails: str(fd, "notify_emails", 500),
      send_confirmations: fd.get("send_confirmations") === "1" ? "1" : "0",
      reject_duplicate_registration_email: fd.get("reject_duplicate_registration_email") === "1" ? "1" : "0",
    };
    if (!values.academy_name) errors.academy_name = "Enter the academy name.";
    if (values.academy_email && !isEmail(values.academy_email)) errors.academy_email = "Enter a valid email address.";
    if (!values.timezone || !isValidTimezone(values.timezone)) errors.timezone = "Choose a valid timezone.";
    const bad = (values.notify_emails ?? "").split(",").map((s) => s.trim()).filter((s) => s && !isEmail(s));
    if (bad.length) errors.notify_emails = `Not a valid address: ${bad.join(", ")}`;
    if (Object.keys(errors).length) return { errors };
    const before = await getSettings();
    const changed = (Object.keys(values) as SettingKey[]).filter((k) => (values[k] ?? "") !== (before[k] ?? SETTING_DEFAULTS[k]));
    await db.transaction(async (conn) => {
      for (const k of changed) await saveSetting(k, values[k] ?? "", me.id, conn);
      if (changed.length) await audit(me.id, "settings.updated", `Changed settings: ${changed.join(", ")}`, "settings", null, conn);
    });
    return { redirectTo: `${PORTAL}/settings`, flash: changed.length ? `Saved ${changed.length} setting(s).` : "No changes to save.", flashType: changed.length ? "success" : "info" };
  });
}

export async function saveProfileAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const me = await requireAction();
    const name = str(fd, "name", 120);
    if (!name) return { errors: { name: "Enter your name." } };
    await db.exec("UPDATE hq_users SET name = ?, updated_at = ? WHERE id = ?", [name, db.nowUtc(), me.id]);
    if (name !== me.name) await audit(me.id, "user.profile_updated", "Updated own display name", "user", me.id);
    return { redirectTo: `${PORTAL}/profile`, flash: "Profile saved." };
  });
}


"use client";

import Link from "next/link";
import { ActionForm, Checkbox, FormError, Hidden, PasswordField, SelectField, ShowWhen, SubmitButton, TextField, useFormCtx } from "./forms";
import { TimezoneField } from "./records";
import { saveProfileAction, saveSettingsAction, saveUserAction } from "@/server/actions/admin";
import { changeOwnPasswordAction } from "@/server/actions/auth";
import { COORDINATOR_DEFAULTS, PERMISSION_MATRIX } from "@/lib/portal/permissions";

const PORTAL = "/adminportal";

function PermissionMatrix({ selected }: { selected: string[] }) {
  const { state } = useFormCtx();
  const current = state.values ? (state.values.permissions ?? "").split(",") : selected;
  return (
    <div>
      <p className="label mb-2">Permissions</p>
      {Object.entries(PERMISSION_MATRIX).map(([group, perms]) => (
        <fieldset key={group} className="perm-group">
          <legend>{group}</legend>
          {Object.entries(perms).map(([key, label]) => (
            <label key={key} className="check"><input type="checkbox" name="permissions" value={key} defaultChecked={current.includes(key)} /> <span>{label}</span> <span className="mono">{key}</span></label>
          ))}
        </fieldset>
      ))}
      <FormError name="permissions" />
    </div>
  );
}

export function UserForm({ user, isSelf }: { user?: { id: number; name: string; email: string; role: string; status: string; permissions: string[] }; isSelf?: boolean }) {
  const u = user;
  return (
    <ActionForm action={saveUserAction} className="card">
      <div className="card-body">
        {u && <Hidden name="id" value={u.id} />}
        <div className="form-grid">
          <TextField name="name" label="Name" required defaultValue={u?.name} maxLength={120} />
          <TextField name="email" label="Email (sign-in)" required type="email" defaultValue={u?.email} maxLength={190} autoComplete="off" />
          <SelectField name="role" label="Role" defaultValue={u?.role ?? "admin"} options={[["admin", "Admin / Coordinator (assigned permissions)"], ["super_admin", "Super Admin (full access, manages users)"]]} />
          {isSelf ? <><Hidden name="status" value="active" /><div className="field"><span className="label">Account status</span><p className="hint">You cannot disable your own account.</p></div></>
            : <SelectField name="status" label="Account status" defaultValue={u?.status ?? "active"} options={[["active", "Active"], ["disabled", "Disabled (cannot sign in)"]]} />}
          <PasswordField name="password" label={u ? "Set a new password" : "Temporary password"} autoComplete="new-password" required={!u}
            hint={u ? "Leave empty to keep the current password. Setting one signs the user out everywhere." : "At least 10 characters. Share it securely; the user can change it in My profile."} />
          <PasswordField name="password_confirm" label="Repeat password" autoComplete="new-password" required={!u} />
        </div>
        <ShowWhen field="role" values={["admin"]} initial={u?.role ?? "admin"}>
          <PermissionMatrix selected={u?.permissions ?? COORDINATOR_DEFAULTS} />
        </ShowWhen>
        <ShowWhen field="role" values={["super_admin"]} initial={u?.role ?? "admin"}>
          <div className="alert alert-warning"><i className="bi bi-shield-exclamation" aria-hidden="true" /><p>Super Admins have every permission, including managing users and permissions.</p></div>
        </ShowWhen>
        <div className="form-actions">
          <Link className="btn btn-ghost" href={`${PORTAL}/users`}>Cancel</Link>
          <SubmitButton icon="check2-circle">{u ? "Save user" : "Create user"}</SubmitButton>
        </div>
      </div>
    </ActionForm>
  );
}

export function SettingsForm({ s, zones }: { s: Record<string, string>; zones: string[] }) {
  return (
    <ActionForm action={saveSettingsAction} className="stack">
      <section className="card">
        <div className="card-head"><h2><i className="bi bi-building" aria-hidden="true" /> Academy details</h2><span className="pill">Portal &amp; emails only</span></div>
        <div className="card-body">
          <p className="small muted">Used in the portal and in confirmation emails sent after website forms. The contact details printed on the public website pages are part of the site&apos;s code and are not changed here.</p>
          <div className="form-grid">
            <TextField name="academy_name" label="Academy name" required defaultValue={s.academy_name} maxLength={120} />
            <TextField name="academy_phone" label="Phone / WhatsApp" optional defaultValue={s.academy_phone} maxLength={40} hint="Shown in confirmation emails." />
            <TextField name="academy_email" label="Contact email" optional type="email" defaultValue={s.academy_email} maxLength={190} />
            <TimezoneField defaultValue={s.timezone} zones={zones} hint="All dates and the timetable are shown in this timezone." />
          </div>
        </div>
      </section>
      <section className="card">
        <div className="card-head"><h2><i className="bi bi-bell" aria-hidden="true" /> Notifications</h2></div>
        <div className="card-body">
          <TextField name="notify_emails" label="Notify staff of new website submissions" optional defaultValue={s.notify_emails} placeholder="admin@example.com, coordinator@example.com" hint="Comma-separated. Leave empty to turn off. Requires email to be configured on the server." />
          <Checkbox name="send_confirmations" label="Send the confirmation email to people who submit the registration or contact form (current website behaviour)" defaultChecked={s.send_confirmations === "1"} />
        </div>
      </section>
      <section className="card">
        <div className="card-head"><h2><i className="bi bi-globe" aria-hidden="true" /> Website form rules</h2><span className="pill pill-warn">Affects the public website</span></div>
        <div className="card-body">
          <Checkbox name="reject_duplicate_registration_email" label="Refuse a registration when the email address has already registered (current website behaviour)"
            defaultChecked={s.reject_duplicate_registration_email === "1"}
            hint="When off, repeat registrations (e.g. siblings using a parent's email) are accepted and flagged as possible duplicates in the inbox instead." />
        </div>
      </section>
      <div className="row-gap"><SubmitButton icon="check2-circle">Save settings</SubmitButton></div>
    </ActionForm>
  );
}

export function ProfileForm({ name }: { name: string }) {
  return (
    <ActionForm action={saveProfileAction}>
      <TextField name="name" label="Display name" required defaultValue={name} maxLength={120} />
      <SubmitButton icon="check2-circle" size="sm">Save</SubmitButton>
    </ActionForm>
  );
}

export function ChangePasswordForm() {
  return (
    <ActionForm action={changeOwnPasswordAction}>
      <PasswordField name="current_password" label="Current password" autoComplete="current-password" />
      <PasswordField name="password" label="New password" autoComplete="new-password" hint="At least 10 characters." />
      <PasswordField name="password_confirm" label="Repeat new password" autoComplete="new-password" />
      <SubmitButton icon="key" size="sm">Change password</SubmitButton>
    </ActionForm>
  );
}

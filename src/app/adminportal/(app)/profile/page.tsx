import type { Metadata } from "next";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { academyTimezone } from "@/lib/portal/settings";
import { fmtDateTime } from "@/lib/portal/time";
import { PERMISSION_MATRIX } from "@/lib/portal/permissions";
import { Badge, DefinitionList, PageHeader } from "@/components/portal/ui";
import { ChangePasswordForm, ProfileForm } from "@/components/portal/admin-forms";

export const metadata: Metadata = { title: "My profile" };

export default async function ProfilePage() {
  const me = await requirePage(undefined, `${PORTAL}/profile`);
  const tz = await academyTimezone();
  const info = await db.one<{ last_login_at: string | null; password_changed_at: string | null }>("SELECT last_login_at, password_changed_at FROM hq_users WHERE id = ?", [me.id]);
  const sessions = await db.count("SELECT COUNT(*) FROM hq_sessions WHERE user_id = ? AND expires_at > ?", [me.id, db.nowUtc()]);
  const labels = Object.values(PERMISSION_MATRIX).reduce<Record<string, string>>((acc, g) => ({ ...acc, ...g }), {});
  return (
    <>
      <PageHeader title="My profile" subtitle={me.email} />
      <div className="grid grid-2">
        <div className="stack">
          <section className="card"><div className="card-head"><h2>Account</h2><Badge status={me.role} /></div>
            <div className="card-body"><ProfileForm name={me.name} />
              <div className="mt-4"><DefinitionList items={[["Email (sign-in)", me.email], ["Last sign-in", fmtDateTime(info?.last_login_at, tz)], ["Password last changed", fmtDateTime(info?.password_changed_at, tz)], ["Active sessions", sessions]]} /></div>
            </div></section>
          <section className="card"><div className="card-head"><h2>Change password</h2></div><div className="card-body"><ChangePasswordForm /><p className="hint mt-3">Changing your password signs out your other devices.</p></div></section>
        </div>
        <section className="card"><div className="card-head"><h2>My permissions</h2></div>
          <div className="card-body">{me.role === "super_admin" ? <p>Super Admin: full access, including users, roles and permissions.</p> : (
            <ul>{[...me.permissions].map((p) => <li key={p}>{labels[p] ?? p} <span className="mono muted">{p}</span></li>)}</ul>
          )}</div></section>
      </div>
    </>
  );
}

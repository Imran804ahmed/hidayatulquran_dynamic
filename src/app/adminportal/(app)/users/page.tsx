import type { Metadata } from "next";
import Link from "next/link";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { academyTimezone } from "@/lib/portal/settings";
import { relativeTime } from "@/lib/portal/time";
import { Avatar, Badge, Icon, PageHeader } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Users & roles" };

export default async function UsersPage() {
  await requirePage("users.manage", `${PORTAL}/users`);
  const tz = await academyTimezone();
  const users = await db.all<{ id: number; name: string; email: string; role: string; status: string; last_login_at: string | null; perms: number }>(
    "SELECT u.id, u.name, u.email, u.role, u.status, u.last_login_at, (SELECT COUNT(*) FROM hq_user_permissions p WHERE p.user_id = u.id) AS perms FROM hq_users u ORDER BY u.status, u.role DESC, u.name");
  return (
    <>
      <PageHeader eyebrow="Administration" title="Users & roles" subtitle="Portal logins for academy staff. There is no public sign-up; only Super Admins can create accounts. Student and teacher records are not logins."
        actions={<Link className="btn btn-primary" href={`${PORTAL}/users/new`}><Icon name="person-plus" /> Add user</Link>} />
      <div className="card">
        <div className="table-wrap"><table className="table responsive">
          <thead><tr><th scope="col">User</th><th scope="col">Role</th><th scope="col">Permissions</th><th scope="col">Last sign-in</th><th scope="col">Status</th></tr></thead>
          <tbody>{users.map((u) => (
            <tr key={u.id}>
              <td className="cell-primary"><div className="person"><Avatar name={u.name} /><div><Link className="row-link" href={`${PORTAL}/users/${u.id}`}>{u.name}</Link><div className="person-sub">{u.email}</div></div></div></td>
              <td data-label="Role"><Badge status={u.role} /></td>
              <td data-label="Permissions">{u.role === "super_admin" ? "All" : `${u.perms} assigned`}</td>
              <td data-label="Last sign-in">{u.last_login_at ? relativeTime(u.last_login_at, tz) : <span className="muted">Never</span>}</td>
              <td data-label="Status"><Badge status={u.status} /></td>
            </tr>))}
          </tbody>
        </table></div>
      </div>
    </>
  );
}

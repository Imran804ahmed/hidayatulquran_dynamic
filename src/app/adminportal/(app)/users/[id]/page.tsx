import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { PageHeader } from "@/components/portal/ui";
import { UserForm } from "@/components/portal/admin-forms";

export const metadata: Metadata = { title: "Edit user" };

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await requirePage("users.manage", `${PORTAL}/users/${id}`);
  const u = /^\d+$/.test(id) ? await db.one<{ id: number; name: string; email: string; role: string; status: string }>("SELECT id, name, email, role, status FROM hq_users WHERE id = ?", [Number(id)]) : null;
  if (!u) notFound();
  const permissions = (await db.all<{ permission: string }>("SELECT permission FROM hq_user_permissions WHERE user_id = ?", [u.id])).map((p) => p.permission);
  return (
    <>
      <PageHeader crumbs={[{ href: `${PORTAL}/users`, label: "Users & roles" }]} title={`Edit ${u.name}`} subtitle="Permission changes apply on the user's next page load and are recorded in the audit history." />
      <UserForm user={{ ...u, permissions }} isSelf={u.id === me.id} />
    </>
  );
}

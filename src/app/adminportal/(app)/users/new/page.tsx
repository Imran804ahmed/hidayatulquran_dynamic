import type { Metadata } from "next";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import { PageHeader } from "@/components/portal/ui";
import { UserForm } from "@/components/portal/admin-forms";

export const metadata: Metadata = { title: "Add user" };

export default async function NewUserPage() {
  await requirePage("users.manage", `${PORTAL}/users/new`);
  return (
    <>
      <PageHeader crumbs={[{ href: `${PORTAL}/users`, label: "Users & roles" }]} title="Add portal user" subtitle="Give Admin / Coordinator accounts only the permissions they need." />
      <UserForm />
    </>
  );
}

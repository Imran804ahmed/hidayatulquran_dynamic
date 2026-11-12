import type { Metadata } from "next";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import { allTimezones } from "@/lib/portal/time";
import { PageHeader } from "@/components/portal/ui";
import { TeacherForm } from "@/components/portal/teacher-forms";

export const metadata: Metadata = { title: "Add teacher" };

export default async function NewTeacherPage() {
  await requirePage("teachers.create", `${PORTAL}/teachers/new`);
  return (
    <>
      <PageHeader crumbs={[{ href: `${PORTAL}/teachers`, label: "Teachers" }]} title="Add teacher" subtitle="Fields marked * are required. This creates a teacher record, not a portal login." />
      <TeacherForm zones={allTimezones()} />
    </>
  );
}

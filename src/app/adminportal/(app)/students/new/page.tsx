import type { Metadata } from "next";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import { allTimezones } from "@/lib/portal/time";
import { PageHeader } from "@/components/portal/ui";
import { StudentForm } from "@/components/portal/records";

export const metadata: Metadata = { title: "Add student" };

export default async function NewStudentPage() {
  await requirePage("students.create", `${PORTAL}/students/new`);
  return (
    <>
      <PageHeader crumbs={[{ href: `${PORTAL}/students`, label: "Students" }]} title="Add student"
        subtitle="Fields marked * are required. To turn a website registration into a student, use Convert on the registration instead: it keeps the link to the original request." />
      <StudentForm zones={allTimezones()} />
    </>
  );
}

import type { Metadata } from "next";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import { PageHeader } from "@/components/portal/ui";
import { CourseForm } from "@/components/portal/academic-forms";

export const metadata: Metadata = { title: "Add course" };

export default async function NewCoursePage() {
  await requirePage("courses.edit", `${PORTAL}/courses/new`);
  return (
    <>
      <PageHeader crumbs={[{ href: `${PORTAL}/courses`, label: "Courses" }]} title="Add course" />
      <CourseForm />
    </>
  );
}

import type { Metadata } from "next";
import * as db from "@/lib/portal/db";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import { activeCourses, teacherOptions } from "@/lib/portal/students";
import { PageHeader, type Params } from "@/components/portal/ui";
import { EnrolmentForm } from "@/components/portal/academic-forms";

export const metadata: Metadata = { title: "New enrolment" };

export default async function NewEnrolmentPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePage("enrolments.manage", `${PORTAL}/enrolments/new`);
  const sp = await searchParams;
  const preset = sp.student && /^\d+$/.test(sp.student)
    ? await db.one<{ id: number; ref_no: string; full_name: string; status: string }>("SELECT id, ref_no, full_name, status FROM hq_students WHERE id = ?", [Number(sp.student)])
    : null;
  const [students, courses, teachers] = await Promise.all([
    preset ? Promise.resolve([]) : db.all<{ id: number; ref_no: string; full_name: string }>("SELECT id, ref_no, full_name FROM hq_students WHERE status = 'active' ORDER BY full_name LIMIT 5000"),
    activeCourses(), teacherOptions(false),
  ]);
  return (
    <>
      <PageHeader crumbs={[preset ? { href: `${PORTAL}/students/${preset.id}`, label: preset.full_name } : { href: `${PORTAL}/enrolments`, label: "Enrolments" }]}
        title="New enrolment" subtitle="Only active students, active courses and active teachers can be used. Fields marked * are required." />
      {preset && preset.status !== "active" && <div className="alert alert-warning"><i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /><p>{preset.full_name} is {preset.status}. Activate the student before enrolling them.</p></div>}
      <EnrolmentForm e={{ student_id: preset?.id, course_id: sp.course && /^\d+$/.test(sp.course) ? Number(sp.course) : undefined }}
        students={students} courses={courses} teachers={teachers} studentLocked={preset ? `${preset.full_name} (${preset.ref_no})` : undefined} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { countryName, daysLabel, packageName, PLANS } from "@/lib/portal/lookups";
import { registrationDuplicates, type RegistrationRow } from "@/lib/portal/registrations";
import { teacherOptions } from "@/lib/portal/students";
import { Badge, DefinitionList, Icon, PageHeader } from "@/components/portal/ui";
import { ConvertForm } from "@/components/portal/registration-forms";

export const metadata: Metadata = { title: "Convert registration" };

export default async function ConvertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requirePage("registrations.convert", `${PORTAL}/registrations/${id}/convert`);
  const r = /^\d+$/.test(id) ? await db.one<RegistrationRow>("SELECT * FROM hq_registrations WHERE id = ?", [Number(id)]) : null;
  if (!r) notFound();
  const back = { href: `${PORTAL}/registrations/${r.id}`, label: `${r.ref_no} ${r.full_name}` };
  if (r.student_id || r.status !== "approved") {
    return (
      <>
        <PageHeader crumbs={[back]} title="Convert to student" />
        <div className="alert alert-info"><Icon name="info-circle-fill" /><p>
          {r.student_id ? <>This registration has already been converted. <Link href={`${PORTAL}/students/${r.student_id}`}>Open the linked student</Link>.</> : <>Only Approved registrations can be converted. Current status: <Badge status={r.status} />.</>}
        </p></div>
      </>
    );
  }
  const [dups, courses, teachers] = await Promise.all([
    registrationDuplicates(r),
    db.all<{ id: number; name: string }>("SELECT id, name FROM hq_courses WHERE status = 'active' ORDER BY sort_order, name"),
    teacherOptions(false),
  ]);
  return (
    <>
      <PageHeader crumbs={[back]} eyebrow="Registration request" title={`Convert ${r.full_name} to a student`}
        subtitle="Creates or links exactly one student record. The original registration is kept unchanged and linked to the student." />
      <div className="grid grid-main-side">
        <ConvertForm id={r.id} candidates={dups.students} courses={courses} teachers={teachers} canAssignTeacher={can(user, "enrolments.manage")} />
        <section className="card">
          <div className="card-head"><h2><Icon name="arrow-left-right" /> Information carried over</h2></div>
          <div className="card-body tight">
            <DefinitionList items={[
              ["Name", r.full_name], ["Age", r.age ?? ""], ["Guardian", r.guardian_name ?? ""], ["WhatsApp", r.whatsapp ?? ""], ["Email", r.email ?? ""],
              ["Country", countryName(r.country)], ["Preferred days / time", `${daysLabel(r.preferred_days) || "—"} · ${r.preferred_time ?? "—"}`],
              ["Package (to enrolment)", `${packageName(r.package)}${r.classes_plan ? ` · ${PLANS[r.classes_plan] ?? r.classes_plan}` : ""}`],
            ]} />
          </div>
          {dups.students.length > 0 && <div className="card-foot"><Icon name="exclamation-triangle-fill" /> {dups.students.length} existing student(s) look similar. Consider linking instead of creating a duplicate.</div>}
        </section>
      </div>
    </>
  );
}

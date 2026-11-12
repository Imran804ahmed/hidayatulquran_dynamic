import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { liveAssignments, type TeacherRow } from "@/lib/portal/teachers";
import { teacherOptions } from "@/lib/portal/students";
import { Badge, PageHeader } from "@/components/portal/ui";
import { ReassignForm } from "@/components/portal/teacher-forms";

export const metadata: Metadata = { title: "Change teacher status" };

/** Deactivate / archive workflow: shows affected enrolments and requires a decision for each. */
export default async function TeacherStatusPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ to?: string }> }) {
  const { id } = await params;
  const { to } = await searchParams;
  const target = to === "archived" ? "archived" : "inactive";
  await requirePage(target === "archived" ? "teachers.archive" : "teachers.edit", `${PORTAL}/teachers/${id}/status?to=${target}`);
  const t = /^\d+$/.test(id) ? await db.one<TeacherRow>("SELECT * FROM hq_teachers WHERE id = ?", [Number(id)]) : null;
  if (!t) notFound();
  if (t.status === target) redirect(`${PORTAL}/teachers/${t.id}`);
  const [assignments, teachers] = await Promise.all([liveAssignments(t.id), teacherOptions(false)]);
  const verb = target === "archived" ? "Archive" : "Deactivate";
  return (
    <>
      <PageHeader crumbs={[{ href: `${PORTAL}/teachers/${t.id}`, label: t.full_name }]} title={`${verb} ${t.full_name}`}
        subtitle={<>Currently <Badge status={t.status} />. {target === "archived" ? "Archived teachers are hidden from the default list; their history is kept." : "Inactive teachers cannot receive new assignments."}</>} />
      <section className="card">
        <div className="card-head"><h2><i className="bi bi-people" aria-hidden="true" /> Affected students ({assignments.length})</h2></div>
        <div className="card-body">
          {assignments.length === 0
            ? <p className="muted">No current enrolments are assigned to this teacher, so no students are affected.</p>
            : <p>These current enrolments are taught by {t.full_name}. Choose a new active teacher for each, or leave it unassigned to decide later. The new teacher&apos;s timetable is checked for clashes. Past (completed / withdrawn) enrolments keep their original teacher.</p>}
          <ReassignForm teacherId={t.id} teacherName={t.full_name} from={t.status} to={target} assignments={assignments} teachers={teachers} />
        </div>
      </section>
    </>
  );
}

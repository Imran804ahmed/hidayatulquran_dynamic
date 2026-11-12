import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { enrolmentsFor } from "@/lib/portal/students";
import { fmtDate } from "@/lib/portal/time";
import { Badge, DefinitionList, EmptyState, Icon, PageHeader } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Course" };

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requirePage("courses.view", `${PORTAL}/courses/${id}`);
  const c = /^\d+$/.test(id) ? await db.one<{ id: number; name: string; summary: string | null; public_url: string | null; status: string }>("SELECT id, name, summary, public_url, status FROM hq_courses WHERE id = ?", [Number(id)]) : null;
  if (!c) notFound();
  const enrolments = await enrolmentsFor("WHERE e.course_id = ? AND e.status IN ('pending','active','paused')", [c.id]);
  return (
    <>
      <PageHeader crumbs={[{ href: `${PORTAL}/courses`, label: "Courses" }]} eyebrow="Course" title={<>{c.name} <Badge status={c.status} /></>}
        actions={<>
          {can(user, "enrolments.manage") && c.status === "active" && <Link className="btn btn-secondary" href={`${PORTAL}/enrolments/new?course=${c.id}`}><Icon name="plus-lg" /> Enrol a student</Link>}
          {can(user, "courses.edit") && <Link className="btn btn-primary" href={`${PORTAL}/courses/${c.id}/edit`}><Icon name="pencil-square" /> Edit</Link>}
        </>} />
      <div className="grid grid-main-side">
        <section className="card">
          <div className="card-head"><h2><Icon name="people" /> Current enrolments ({enrolments.length})</h2><Link className="small" href={`${PORTAL}/enrolments?course=${c.id}&status=all`}>Include past</Link></div>
          {enrolments.length === 0 ? <EmptyState icon="journal-plus" title="No current enrolments" text="Students enrolled in this course will be listed here." /> : (
            <div className="table-wrap"><table className="table responsive">
              <thead><tr><th scope="col">Student</th><th scope="col">Teacher</th><th scope="col">Start</th><th scope="col">Status</th></tr></thead>
              <tbody>{enrolments.map((e) => (
                <tr key={e.id}>
                  <td className="cell-primary"><Link className="row-link" href={`${PORTAL}/enrolments/${e.id}`}>{e.student_name}</Link> <span className="mono muted small">{e.student_ref}</span></td>
                  <td data-label="Teacher">{e.teacher_name ?? <span className="muted">Not assigned</span>}</td>
                  <td data-label="Start">{e.start_date ? fmtDate(e.start_date) : "—"}</td>
                  <td data-label="Status"><Badge status={e.status} /></td>
                </tr>))}
              </tbody>
            </table></div>
          )}
        </section>
        <section className="card">
          <div className="card-head"><h2><Icon name="info-circle" /> Details</h2></div>
          <div className="card-body tight"><DefinitionList items={[["Description", c.summary ?? ""], ["Public page", c.public_url ? <a href={c.public_url} target="_blank" rel="noopener">{c.public_url}</a> : ""], ["Status", <Badge key="s" status={c.status} />]]} /></div>
        </section>
      </div>
    </>
  );
}

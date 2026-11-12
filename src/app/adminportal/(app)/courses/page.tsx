import type { Metadata } from "next";
import Link from "next/link";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { Badge, EmptyState, Icon, PageHeader, type Params } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Courses" };

export default async function CoursesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requirePage("courses.view", `${PORTAL}/courses`);
  const { status } = await searchParams;
  const filter = status === "active" || status === "inactive" ? status : "";
  const rows = await db.all<{ id: number; name: string; summary: string | null; public_url: string | null; status: string; live: number; teachers: number; total: number }>(
    `SELECT c.id, c.name, c.summary, c.public_url, c.status,
       (SELECT COUNT(*) FROM hq_enrolments e WHERE e.course_id = c.id AND e.status IN ('pending','active','paused')) AS live,
       (SELECT COUNT(DISTINCT e.teacher_id) FROM hq_enrolments e WHERE e.course_id = c.id AND e.status IN ('pending','active','paused')) AS teachers,
       (SELECT COUNT(*) FROM hq_enrolments e WHERE e.course_id = c.id) AS total
     FROM hq_courses c ${filter ? "WHERE c.status = ?" : ""} ORDER BY c.status = 'active' DESC, c.sort_order, c.name`, filter ? [filter] : []);
  return (
    <>
      <PageHeader eyebrow="Academics" title="Courses" subtitle="The courses offered on the website. Course status controls whether new enrolments can be made."
        actions={can(user, "courses.edit") ? <Link className="btn btn-primary" href={`${PORTAL}/courses/new`}><Icon name="plus-lg" /> Add course</Link> : undefined} />
      <div className="card">
        <nav className="tabs" aria-label="Course status">
          <Link href={`${PORTAL}/courses`} aria-current={!filter ? "page" : undefined}>All</Link>
          <Link href={`${PORTAL}/courses?status=active`} aria-current={filter === "active" ? "page" : undefined}>Active</Link>
          <Link href={`${PORTAL}/courses?status=inactive`} aria-current={filter === "inactive" ? "page" : undefined}>Inactive</Link>
        </nav>
        {rows.length === 0 ? <EmptyState icon="book" title="No courses" text="No courses match this filter." /> : (
          <div className="table-wrap">
            <table className="table responsive">
              <thead><tr><th scope="col">Course</th><th scope="col" className="num">Current enrolments</th><th scope="col" className="num">Teachers</th><th scope="col" className="num">All-time enrolments</th><th scope="col">Public page</th><th scope="col">Status</th></tr></thead>
              <tbody>{rows.map((c) => (
                <tr key={c.id}>
                  <td className="cell-primary"><Link className="row-link" href={`${PORTAL}/courses/${c.id}`}>{c.name}</Link>{c.summary && <div className="person-sub">{c.summary}</div>}</td>
                  <td data-label="Current enrolments" className="num"><Link href={`${PORTAL}/enrolments?course=${c.id}`}>{c.live}</Link></td>
                  <td data-label="Teachers" className="num">{c.teachers}</td>
                  <td data-label="All-time" className="num">{c.total}</td>
                  <td data-label="Public page">{c.public_url ? <a href={c.public_url} target="_blank" rel="noopener" className="small">{c.public_url} <Icon name="box-arrow-up-right" /></a> : <span className="muted">—</span>}</td>
                  <td data-label="Status"><Badge status={c.status} /></td>
                </tr>))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

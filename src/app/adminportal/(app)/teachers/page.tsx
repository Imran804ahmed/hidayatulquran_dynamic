import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { activeCourses, orderBy } from "@/lib/portal/students";
import { TEACHER_SORTS, teacherWhere } from "@/lib/portal/teachers";
import { Avatar, Badge, EmptyState, Icon, PageHeader, Pagination, SortHeader, hrefWith, paginate, type Params } from "@/components/portal/ui";
import { AutoSubmit, RememberList, ScrollMemory } from "@/components/portal/shell";

export const metadata: Metadata = { title: "Teachers" };
const BASE = `${PORTAL}/teachers`;

export default async function TeachersPage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requirePage("teachers.view", BASE);
  const sp = await searchParams;
  const f = { q: sp.q?.trim().slice(0, 100), status: sp.status ?? "current", course: sp.course };
  const where = teacherWhere(f);
  const order = orderBy(TEACHER_SORTS, sp.sort, sp.dir, "name");
  const total = await db.count(`SELECT COUNT(*) FROM hq_teachers t ${where.sql}`, where.params);
  const pg = paginate(total, sp.page);
  const rows = await db.all<{ id: number; ref_no: string; full_name: string; email: string | null; phone: string | null; specialisations: string | null; status: string; students: number; courses: string | null }>(
    `SELECT t.id, t.ref_no, t.full_name, t.email, t.phone, t.specialisations, t.status,
       (SELECT COUNT(DISTINCT e.student_id) FROM hq_enrolments e WHERE e.teacher_id = t.id AND e.status IN ('pending','active','paused')) AS students,
       (SELECT GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ', ') FROM hq_enrolments e JOIN hq_courses c ON c.id = e.course_id WHERE e.teacher_id = t.id AND e.status IN ('pending','active','paused')) AS courses
     FROM hq_teachers t ${where.sql} ORDER BY ${order.sql}, t.id LIMIT ${pg.perPage} OFFSET ${pg.offset}`,
    where.params,
  );
  const courses = await activeCourses();
  const params: Params = { q: f.q, status: sp.status, course: f.course, sort: sp.sort, dir: sp.dir };
  const filtered = Boolean(f.q || (sp.status && sp.status !== "current") || f.course);
  const sortProps = { base: BASE, params, sort: order.sort, dir: order.dir };
  return (
    <>
      <Suspense fallback={null}><RememberList module="teachers" /><ScrollMemory /></Suspense>
      <PageHeader eyebrow="People" title="Teachers" subtitle="Teacher records are separate from portal logins. Inactive teachers cannot receive new assignments."
        actions={<>
          {can(user, "teachers.export") && <a className="btn btn-secondary" href={hrefWith(`${BASE}/export`, { q: f.q, status: sp.status, course: f.course })}><Icon name="download" /> Export CSV</a>}
          {can(user, "teachers.create") && <Link className="btn btn-primary" href={`${BASE}/new`}><Icon name="plus-lg" /> Add teacher</Link>}
        </>} />
      <div className="card">
        <form className="filters" method="get" action={BASE} role="search" aria-label="Filter teachers">
          <AutoSubmit>
            <div className="field field-search"><label htmlFor="q">Search</label><input className="input" id="q" name="q" type="search" defaultValue={f.q} placeholder="Name, ref, email, phone or specialisation" /></div>
            <div className="field"><label htmlFor="status">Record status</label>
              <select className="input" id="status" name="status" defaultValue={f.status}><option value="current">Active + inactive</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="archived">Archived</option><option value="all">All</option></select></div>
            <div className="field"><label htmlFor="course">Teaches course</label>
              <select className="input" id="course" name="course" defaultValue={f.course ?? ""}><option value="">Any course</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          </AutoSubmit>
          <div className="filter-actions"><button className="btn btn-secondary" type="submit"><Icon name="funnel" /> Apply</button>{filtered && <Link className="btn btn-ghost" href={BASE}>Clear</Link>}</div>
        </form>
        {rows.length === 0 ? (
          filtered ? <EmptyState icon="search" title="No teachers match these filters" text="Try a different search or clear the filters." action={<Link className="btn btn-secondary" href={BASE}>Clear filters</Link>} />
            : <EmptyState icon="person-badge" title="No teachers yet" text="Add your teachers so you can assign them to student enrolments." action={can(user, "teachers.create") ? <Link className="btn btn-primary" href={`${BASE}/new`}><Icon name="plus-lg" /> Add teacher</Link> : undefined} />
        ) : (
          <div className="table-wrap">
            <table className="table responsive">
              <caption className="sr-only">Teachers, {total} results</caption>
              <thead><tr>
                <SortHeader column="name" label="Teacher" {...sortProps} />
                <SortHeader column="ref" label="Ref" {...sortProps} />
                <th scope="col">Contact</th>
                <th scope="col">Current courses</th>
                <SortHeader column="students" label="Students" {...sortProps} />
                <SortHeader column="status" label="Status" {...sortProps} />
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="cell-primary"><div className="person"><Avatar name={r.full_name} tone="blue" /><div><Link className="row-link" href={`${BASE}/${r.id}`}>{r.full_name}</Link>{r.specialisations && <div className="person-sub">{r.specialisations.slice(0, 60)}</div>}</div></div></td>
                    <td data-label="Ref" className="mono nowrap">{r.ref_no}</td>
                    <td data-label="Contact"><div className="small">{r.phone ?? ""}</div><div className="small muted">{r.email ?? ""}</div></td>
                    <td data-label="Courses" className="small">{r.courses ?? <span className="muted">None</span>}</td>
                    <td data-label="Students" className="num">{r.students}</td>
                    <td data-label="Status"><Badge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination info={pg} base={BASE} params={params} />
      </div>
    </>
  );
}

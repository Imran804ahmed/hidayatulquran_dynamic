import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { academyTimezone } from "@/lib/portal/settings";
import { fmtDay } from "@/lib/portal/time";
import { countryName } from "@/lib/portal/lookups";
import { STUDENT_SORTS, activeCourses, orderBy, studentWhere, teacherOptions } from "@/lib/portal/students";
import { ActiveFilters, Avatar, Badge, EmptyState, Icon, PageHeader, Pagination, SortHeader, hrefWith, paginate, type ActiveFilter, type Params } from "@/components/portal/ui";
import { AutoSubmit, MoreFilters, RememberList, ScrollMemory } from "@/components/portal/shell";

const STATUS: Record<string, string> = { active: "Active", inactive: "Inactive", archived: "Archived", all: "All" };

export const metadata: Metadata = { title: "Students" };

const BASE = `${PORTAL}/students`;

export default async function StudentsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requirePage("students.view", BASE);
  const sp = await searchParams;
  const tz = await academyTimezone();
  const f = { q: sp.q?.trim().slice(0, 100), status: sp.status ?? "current", course: sp.course, teacher: sp.teacher, from: sp.from, to: sp.to };
  const where = studentWhere(f, tz);
  const order = orderBy(STUDENT_SORTS, sp.sort, sp.dir, "registered");
  const total = await db.count(`SELECT COUNT(*) FROM hq_students s ${where.sql}`, where.params);
  const pg = paginate(total, sp.page);
  const rows = await db.all<{ id: number; ref_no: string; full_name: string; guardian_name: string | null; email: string | null; whatsapp: string | null; country: string | null; status: string; registered: string; courses: string | null; teachers: string | null }>(
    `SELECT s.id, s.ref_no, s.full_name, s.guardian_name, s.email, s.whatsapp, s.country, s.status, COALESCE(s.registered_at, s.created_at) AS registered,
       (SELECT GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ', ') FROM hq_enrolments e JOIN hq_courses c ON c.id = e.course_id WHERE e.student_id = s.id AND e.status IN ('pending','active','paused')) AS courses,
       (SELECT GROUP_CONCAT(DISTINCT t.full_name ORDER BY t.full_name SEPARATOR ', ') FROM hq_enrolments e JOIN hq_teachers t ON t.id = e.teacher_id WHERE e.student_id = s.id AND e.status IN ('pending','active','paused')) AS teachers
     FROM hq_students s ${where.sql} ORDER BY ${order.sql}, s.id DESC LIMIT ${pg.perPage} OFFSET ${pg.offset}`,
    where.params,
  );
  const [courses, teachers] = await Promise.all([activeCourses(), teacherOptions(true)]);
  const params: Params = { q: f.q, status: sp.status, course: f.course, teacher: f.teacher, from: f.from, to: f.to, sort: sp.sort, dir: sp.dir };
  const filtered = Boolean(f.q || (sp.status && sp.status !== "current") || f.course || f.teacher || f.from || f.to);
  const sortProps = { base: BASE, params, sort: order.sort, dir: order.dir };
  const without = (key: string) => hrefWith(BASE, params, { [key]: undefined, page: undefined });
  const chip = (label: string, value: string | undefined, key: string): ActiveFilter[] => (value ? [{ label, value, removeHref: without(key) }] : []);
  const chips = [
    ...chip("Search", f.q && `“${f.q}”`, "q"),
    ...chip("Status", f.status !== "current" ? STATUS[f.status] ?? f.status : undefined, "status"),
    ...chip("Course", f.course && (courses.find((c) => String(c.id) === f.course)?.name ?? f.course), "course"),
    ...chip("Teacher", f.teacher && (f.teacher === "none" ? "No teacher assigned" : teachers.find((t) => String(t.id) === f.teacher)?.full_name ?? f.teacher), "teacher"),
    ...chip("Registered from", f.from, "from"),
    ...chip("Registered to", f.to, "to"),
  ];
  const moreActive = chips.length - (f.q ? 1 : 0);

  return (
    <>
      <Suspense fallback={null}><RememberList module="students" /><ScrollMemory /></Suspense>
      <PageHeader
        eyebrow="People"
        title="Students"
        subtitle="Student records are separate from portal logins. Status describes the record; enrolment status describes participation in a course."
        actions={<>
          {can(user, "students.export") && <a className="btn btn-secondary" href={hrefWith(`${BASE}/export`, { ...params, sort: undefined, dir: undefined })}><Icon name="download" /> Export CSV</a>}
          {can(user, "students.create") && <Link className="btn btn-primary" href={`${BASE}/new`}><Icon name="plus-lg" /> Add student</Link>}
        </>}
      />
      <div className="card">
        <form className="filters" method="get" action={BASE} role="search" aria-label="Filter students">
          <AutoSubmit>
            <div className="field field-search"><label htmlFor="q">Search</label><input className="input" id="q" name="q" type="search" defaultValue={f.q} placeholder="Name, ref, email, guardian or phone" /></div>
            <MoreFilters active={moreActive}>
            <div className="field"><label htmlFor="status">Record status</label>
              <select className="input" id="status" name="status" defaultValue={f.status}>
                <option value="current">Active + inactive</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="archived">Archived</option><option value="all">All</option>
              </select></div>
            <div className="field"><label htmlFor="course">Course</label>
              <select className="input" id="course" name="course" defaultValue={f.course ?? ""}><option value="">Any course</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="field"><label htmlFor="teacher">Teacher</label>
              <select className="input" id="teacher" name="teacher" defaultValue={f.teacher ?? ""}><option value="">Any teacher</option><option value="none">No teacher assigned</option>{teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}{t.status !== "active" ? " (inactive)" : ""}</option>)}</select></div>
            <div className="field"><label htmlFor="from">Registered from</label><input className="input" id="from" name="from" type="date" defaultValue={f.from} /></div>
            <div className="field"><label htmlFor="to">Registered to</label><input className="input" id="to" name="to" type="date" defaultValue={f.to} /></div>
            </MoreFilters>
          </AutoSubmit>
          <div className="filter-actions">
            <button className="btn btn-secondary" type="submit"><Icon name="funnel" /> Apply</button>
            {filtered && <Link className="btn btn-ghost" href={BASE}>Clear filters</Link>}
          </div>
        </form>
        <ActiveFilters total={total} noun={["student", "students"]} filters={chips} clearHref={BASE} />
        {rows.length === 0 ? (
          filtered
            ? <EmptyState icon="search" title="No students match these filters" text="Try a different search or clear the filters." action={<Link className="btn btn-secondary" href={BASE}>Clear filters</Link>} />
            : <EmptyState icon="people" title="No students yet" text="Add a student, or convert an approved registration request into a student record." action={can(user, "students.create") ? <Link className="btn btn-primary" href={`${BASE}/new`}><Icon name="plus-lg" /> Add student</Link> : undefined} />
        ) : (
          <div className="table-wrap">
            <table className="table responsive">
              <caption className="sr-only">Students, {total} results</caption>
              <thead><tr>
                <SortHeader column="name" label="Student" {...sortProps} />
                <SortHeader column="ref" label="Ref" {...sortProps} />
                <th scope="col">Contact</th>
                <th scope="col">Courses &amp; teachers</th>
                <SortHeader column="country" label="Country" {...sortProps} />
                <SortHeader column="registered" label="Registered" {...sortProps} />
                <SortHeader column="status" label="Status" {...sortProps} />
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="cell-primary"><div className="person"><Avatar name={r.full_name} tone="green" /><div><Link className="row-link" href={`${BASE}/${r.id}`}>{r.full_name}</Link>{r.guardian_name && <div className="person-sub">Guardian: {r.guardian_name}</div>}</div></div></td>
                    <td data-label="Ref" className="mono nowrap">{r.ref_no}</td>
                    <td data-label="Contact">{r.whatsapp || r.email ? <><div className="small">{r.whatsapp ?? ""}</div><div className="small muted">{r.email ?? ""}</div></> : <span className="muted">—</span>}</td>
                    <td data-label="Courses">{r.courses ? <><div className="small">{r.courses}</div><div className="small muted">{r.teachers ?? "No teacher assigned"}</div></> : <span className="small muted">Not enrolled</span>}</td>
                    <td data-label="Country">{countryName(r.country) || <span className="muted">—</span>}</td>
                    <td data-label="Registered" className="nowrap">{fmtDay(r.registered, tz)}</td>
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

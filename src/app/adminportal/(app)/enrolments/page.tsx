import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { ENROL_STATUS, packageName } from "@/lib/portal/lookups";
import { enrolmentWhere } from "@/lib/portal/enrolments";
import { activeCourses, teacherOptions } from "@/lib/portal/students";
import { fmtDate } from "@/lib/portal/time";
import { Badge, EmptyState, Icon, PageHeader, Pagination, hrefWith, paginate, type Params } from "@/components/portal/ui";
import { AutoSubmit, RememberList, ScrollMemory } from "@/components/portal/shell";

export const metadata: Metadata = { title: "Enrolments" };
const BASE = `${PORTAL}/enrolments`;

export default async function EnrolmentsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requirePage("courses.view", BASE);
  const sp = await searchParams;
  const f = { q: sp.q?.trim().slice(0, 100), status: sp.status ?? "live", course: sp.course, teacher: sp.teacher };
  const where = enrolmentWhere(f);
  const total = await db.count(`SELECT COUNT(*) FROM hq_enrolments e JOIN hq_students s ON s.id = e.student_id ${where.sql}`, where.params);
  const pg = paginate(total, sp.page);
  const rows = await db.all<{ id: number; student_id: number; student_name: string; student_ref: string; student_status: string; course_name: string; teacher_name: string | null; teacher_status: string | null; status: string; package: string | null; start_date: string | null; slots: number }>(
    `SELECT e.id, e.student_id, s.full_name AS student_name, s.ref_no AS student_ref, s.status AS student_status, c.name AS course_name, t.full_name AS teacher_name, t.status AS teacher_status,
            e.status, e.package, e.start_date, (SELECT COUNT(*) FROM hq_class_slots cs WHERE cs.enrolment_id = e.id AND cs.status = 'scheduled') AS slots
       FROM hq_enrolments e JOIN hq_students s ON s.id = e.student_id JOIN hq_courses c ON c.id = e.course_id LEFT JOIN hq_teachers t ON t.id = e.teacher_id
      ${where.sql} ORDER BY s.full_name, c.name LIMIT ${pg.perPage} OFFSET ${pg.offset}`, where.params);
  const [courses, teachers] = await Promise.all([activeCourses(), teacherOptions(true)]);
  const params: Params = { ...f, status: sp.status };
  const filtered = Boolean(f.q || f.course || f.teacher || (sp.status && sp.status !== "live"));
  return (
    <>
      <Suspense fallback={null}><RememberList module="enrolments" /><ScrollMemory /></Suspense>
      <PageHeader eyebrow="Academics" title="Enrolments" subtitle="Each enrolment links one student to one course and (optionally) a teacher. Enrolment status is separate from the student's record status."
        actions={<>
          {can(user, "enrolments.export") && <a className="btn btn-secondary" href={hrefWith(`${BASE}/export`, params)}><Icon name="download" /> Export CSV</a>}
          {can(user, "enrolments.manage") && <Link className="btn btn-primary" href={`${BASE}/new`}><Icon name="plus-lg" /> New enrolment</Link>}
        </>} />
      <div className="card">
        <form className="filters" method="get" action={BASE} role="search" aria-label="Filter enrolments">
          <AutoSubmit>
            <div className="field field-search"><label htmlFor="q">Student</label><input className="input" id="q" name="q" type="search" defaultValue={f.q} placeholder="Name or ref" /></div>
            <div className="field"><label htmlFor="status">Enrolment status</label><select className="input" id="status" name="status" defaultValue={f.status}><option value="live">Current (pending, active, paused)</option>{Object.entries(ENROL_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}<option value="all">All</option></select></div>
            <div className="field"><label htmlFor="course">Course</label><select className="input" id="course" name="course" defaultValue={f.course ?? ""}><option value="">Any course</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="field"><label htmlFor="teacher">Teacher</label><select className="input" id="teacher" name="teacher" defaultValue={f.teacher ?? ""}><option value="">Any teacher</option><option value="none">Not assigned</option>{teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}</select></div>
          </AutoSubmit>
          <div className="filter-actions"><button className="btn btn-secondary" type="submit"><Icon name="funnel" /> Apply</button>{filtered && <Link className="btn btn-ghost" href={BASE}>Clear</Link>}</div>
        </form>
        {rows.length === 0 ? <EmptyState icon="journal-check" title={filtered ? "No enrolments match" : "No current enrolments"} text={filtered ? "Try different filters." : "Enrol a student from their record, or convert an approved registration."} /> : (
          <div className="table-wrap"><table className="table responsive">
            <caption className="sr-only">Enrolments, {total} results</caption>
            <thead><tr><th scope="col">Student</th><th scope="col">Course</th><th scope="col">Teacher</th><th scope="col">Package</th><th scope="col">Start</th><th scope="col" className="num">Weekly classes</th><th scope="col">Status</th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id}>
                <td className="cell-primary"><Link className="row-link" href={`${BASE}/${r.id}`}>{r.student_name}</Link> <span className="mono muted small">{r.student_ref}</span>{r.student_status !== "active" && <span className="pill pill-warn" style={{ marginLeft: 6 }}>Student {r.student_status}</span>}</td>
                <td data-label="Course">{r.course_name}</td>
                <td data-label="Teacher">{r.teacher_name ? <>{r.teacher_name}{r.teacher_status !== "active" && <span className="pill pill-warn" style={{ marginLeft: 6 }}>{r.teacher_status}</span>}</> : <span className="muted">Not assigned</span>}</td>
                <td data-label="Package" className="small">{packageName(r.package) || "—"}</td>
                <td data-label="Start">{r.start_date ? fmtDate(r.start_date) : "—"}</td>
                <td data-label="Weekly classes" className="num">{r.slots}</td>
                <td data-label="Status"><Badge status={r.status} /></td>
              </tr>))}
            </tbody>
          </table></div>
        )}
        <Pagination info={pg} base={BASE} params={params} />
      </div>
    </>
  );
}

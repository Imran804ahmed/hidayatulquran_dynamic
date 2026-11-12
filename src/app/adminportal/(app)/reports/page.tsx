import type { Metadata } from "next";
import Link from "next/link";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { academyTimezone } from "@/lib/portal/settings";
import { addDays, isYmd, localDayStartUtc, localYmd } from "@/lib/portal/time";
import { ENQ_STATUS, REG_STATUS, RECORD_STATUS, countryName, packageName, statusLabel } from "@/lib/portal/lookups";
import { BarRow } from "@/components/portal/charts";
import { Icon, PageHeader, hrefWith, type Params } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Reports" };
const P = PORTAL;

type Count = { k: string | null; n: number };

function Section({ title, icon, children, action }: { title: string; icon: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="card">
      <div className="card-head"><h2><Icon name={icon} /> {title}</h2>{action}</div>
      <div className="card-body">{children}</div>
    </section>
  );
}

function Bars({ rows, label, href }: { rows: Count[]; label: (k: string) => string; href?: (k: string) => string }) {
  const max = Math.max(0, ...rows.map((r) => Number(r.n)));
  if (!rows.length || max === 0) return <p className="muted small">No records yet.</p>;
  return <>{rows.map((r) => <BarRow key={r.k ?? "none"} label={label(r.k ?? "")} value={Number(r.n)} max={max} href={href?.(r.k ?? "")} />)}</>;
}

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requirePage("reports.view", `${P}/reports`);
  const sp = await searchParams;
  const tz = await academyTimezone();
  const today = localYmd(tz);
  const from = sp.from && isYmd(sp.from) ? sp.from : addDays(today, -89);
  const to = sp.to && isYmd(sp.to) && sp.to >= from ? sp.to : today;
  const range = [localDayStartUtc(from, tz), localDayStartUtc(addDays(to, 1), tz)];
  const group = (sql: string, params: db.Param[] = []) => db.all<Count>(sql, params);

  const [stu, tea, regStatus, regPkg, regCountry, enqStatus, courseRows, teacherRows, overdue] = await Promise.all([
    can(user, "students.view") ? group("SELECT status AS k, COUNT(*) AS n FROM hq_students GROUP BY status") : [],
    can(user, "teachers.view") ? group("SELECT status AS k, COUNT(*) AS n FROM hq_teachers GROUP BY status") : [],
    can(user, "registrations.view") ? group("SELECT status AS k, COUNT(*) AS n FROM hq_registrations WHERE submitted_at >= ? AND submitted_at < ? GROUP BY status ORDER BY n DESC", range) : [],
    can(user, "registrations.view") ? group("SELECT package AS k, COUNT(*) AS n FROM hq_registrations WHERE submitted_at >= ? AND submitted_at < ? GROUP BY package ORDER BY n DESC", range) : [],
    can(user, "registrations.view") ? group("SELECT country AS k, COUNT(*) AS n FROM hq_registrations WHERE submitted_at >= ? AND submitted_at < ? GROUP BY country ORDER BY n DESC", range) : [],
    can(user, "enquiries.view") ? group("SELECT status AS k, COUNT(*) AS n FROM hq_enquiries WHERE submitted_at >= ? AND submitted_at < ? GROUP BY status ORDER BY n DESC", range) : [],
    can(user, "courses.view") ? db.all<{ id: number; name: string; live: number; completed: number; withdrawn: number }>(
      `SELECT c.id, c.name, SUM(e.status IN ('pending','active','paused')) AS live, SUM(e.status = 'completed') AS completed, SUM(e.status = 'withdrawn') AS withdrawn
         FROM hq_courses c LEFT JOIN hq_enrolments e ON e.course_id = c.id GROUP BY c.id, c.name ORDER BY live DESC, c.sort_order`) : [],
    can(user, "courses.view") ? db.all<{ id: number; full_name: string; status: string; live: number; slots: number }>(
      `SELECT t.id, t.full_name, t.status, COUNT(DISTINCT e.id) AS live,
         (SELECT COUNT(*) FROM hq_class_slots cs JOIN hq_enrolments e2 ON e2.id = cs.enrolment_id WHERE e2.teacher_id = t.id AND cs.status = 'scheduled' AND e2.status IN ('pending','active')) AS slots
         FROM hq_teachers t LEFT JOIN hq_enrolments e ON e.teacher_id = t.id AND e.status IN ('pending','active','paused')
        WHERE t.status <> 'archived' GROUP BY t.id, t.full_name, t.status ORDER BY live DESC, t.full_name`) : [],
    Promise.all([
      can(user, "registrations.view") ? db.count("SELECT COUNT(*) FROM hq_registrations WHERE follow_up_on < ? AND status IN ('new','under_review','contacted','approved')", [today]) : 0,
      can(user, "enquiries.view") ? db.count("SELECT COUNT(*) FROM hq_enquiries WHERE follow_up_on < ? AND status IN ('new','in_progress')", [today]) : 0,
    ]),
  ]);
  const unassigned = can(user, "courses.view") ? await db.count("SELECT COUNT(*) FROM hq_enrolments WHERE teacher_id IS NULL AND status IN ('pending','active','paused')") : 0;
  const dateQ = { from, to };

  return (
    <>
      <PageHeader eyebrow="Administration" title="Reports" subtitle="Live figures from the portal database. Each bar links to the matching filtered list; exports respect your permissions." />
      <form className="card filters mb-4" method="get" action={`${P}/reports`} style={{ borderRadius: "var(--radius)" }}>
        <div className="field"><label htmlFor="from">Submissions from</label><input className="input" id="from" name="from" type="date" defaultValue={from} max={today} /></div>
        <div className="field"><label htmlFor="to">to</label><input className="input" id="to" name="to" type="date" defaultValue={to} max={today} /></div>
        <div className="filter-actions"><button className="btn btn-secondary" type="submit"><Icon name="funnel" /> Apply</button></div>
        <p className="hint" style={{ alignSelf: "center" }}>The date range applies to registration and enquiry figures ({tz}). Imported rows without an original date count as their import date.</p>
      </form>
      <div className="grid grid-2">
        {can(user, "students.view") && (
          <Section title="Student record status" icon="people" action={can(user, "students.export") ? <a className="small" href={`${P}/students/export?status=all`}>Export</a> : undefined}>
            <Bars rows={stu} label={(k) => RECORD_STATUS[k as keyof typeof RECORD_STATUS] ?? k} href={(k) => `${P}/students?status=${k}`} />
          </Section>
        )}
        {can(user, "teachers.view") && (
          <Section title="Teacher record status" icon="person-badge" action={can(user, "teachers.export") ? <a className="small" href={`${P}/teachers/export?status=all`}>Export</a> : undefined}>
            <Bars rows={tea} label={(k) => RECORD_STATUS[k as keyof typeof RECORD_STATUS] ?? k} href={(k) => `${P}/teachers?status=${k}`} />
          </Section>
        )}
        {can(user, "registrations.view") && (
          <>
            <Section title="Registrations by status" icon="person-plus" action={can(user, "registrations.export") ? <a className="small" href={hrefWith(`${P}/registrations/export`, { status: "all", ...dateQ })}>Export</a> : undefined}>
              <Bars rows={regStatus} label={(k) => REG_STATUS[k as keyof typeof REG_STATUS] ?? k} href={(k) => hrefWith(`${P}/registrations`, { status: k, ...dateQ })} />
            </Section>
            <Section title="Registrations by package" icon="box">
              <Bars rows={regPkg} label={(k) => packageName(k) || "Not given"} href={(k) => hrefWith(`${P}/registrations`, { status: "all", package: k, ...dateQ })} />
            </Section>
            <Section title="Registrations by country" icon="globe">
              <Bars rows={regCountry} label={(k) => countryName(k) || "Not given"} href={(k) => hrefWith(`${P}/registrations`, { status: "all", country: k, ...dateQ })} />
              <p className="hint mt-3">The website registration form asks for a package, not a course; course demand is visible in enrolments below.</p>
            </Section>
          </>
        )}
        {can(user, "enquiries.view") && (
          <Section title="Enquiries by status" icon="envelope" action={can(user, "enquiries.export") ? <a className="small" href={hrefWith(`${P}/enquiries/export`, { status: "all", ...dateQ })}>Export</a> : undefined}>
            <Bars rows={enqStatus} label={(k) => ENQ_STATUS[k as keyof typeof ENQ_STATUS] ?? k} href={(k) => hrefWith(`${P}/enquiries`, { status: k, ...dateQ })} />
          </Section>
        )}
        {(can(user, "registrations.view") || can(user, "enquiries.view")) && (
          <Section title="Follow-ups" icon="alarm">
            <ul className="list-plain">
              {can(user, "registrations.view") && <li><Link className="list-row" href={`${P}/registrations?followup=overdue`}><span className="list-row-main">Overdue registration follow-ups</span><strong>{overdue[0]}</strong></Link></li>}
              {can(user, "enquiries.view") && <li><Link className="list-row" href={`${P}/enquiries?followup=overdue`}><span className="list-row-main">Overdue enquiry follow-ups</span><strong>{overdue[1]}</strong></Link></li>}
              {can(user, "registrations.view") && <li><Link className="list-row" href={`${P}/registrations?assigned=unassigned`}><span className="list-row-main">Open registrations with nobody assigned</span><Icon name="chevron-right" /></Link></li>}
            </ul>
          </Section>
        )}
        {can(user, "courses.view") && (
          <>
            <Section title="Course enrolments" icon="journal-check" action={can(user, "enrolments.export") ? <a className="small" href={`${P}/enrolments/export?status=all`}>Export</a> : undefined}>
              <div className="table-wrap"><table className="table compact">
                <thead><tr><th scope="col">Course</th><th scope="col" className="num">Current</th><th scope="col" className="num">Completed</th><th scope="col" className="num">Withdrawn</th></tr></thead>
                <tbody>{courseRows.map((c) => (
                  <tr key={c.id}><td><Link href={`${P}/enrolments?course=${c.id}`}>{c.name}</Link></td><td className="num">{Number(c.live ?? 0)}</td><td className="num">{Number(c.completed ?? 0)}</td><td className="num">{Number(c.withdrawn ?? 0)}</td></tr>))}
                </tbody>
              </table></div>
            </Section>
            <Section title="Teacher assignments" icon="person-badge" action={<Link className="small" href={`${P}/enrolments?teacher=none`}>{unassigned} without teacher</Link>}>
              {teacherRows.length === 0 ? <p className="muted small">No teachers yet.</p> : (
                <div className="table-wrap"><table className="table compact">
                  <thead><tr><th scope="col">Teacher</th><th scope="col" className="num">Current enrolments</th><th scope="col" className="num">Weekly classes</th></tr></thead>
                  <tbody>{teacherRows.map((t) => (
                    <tr key={t.id}><td><Link href={`${P}/teachers/${t.id}`}>{t.full_name}</Link>{t.status !== "active" && <span className="muted small"> ({statusLabel(t.status)})</span>}</td><td className="num">{Number(t.live)}</td><td className="num">{Number(t.slots)}</td></tr>))}
                  </tbody>
                </table></div>
              )}
            </Section>
          </>
        )}
      </div>
    </>
  );
}

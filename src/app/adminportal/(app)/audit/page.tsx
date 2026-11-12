import type { Metadata } from "next";
import Link from "next/link";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { academyTimezone } from "@/lib/portal/settings";
import { addDays, fmtDateTime, isYmd, localDayStartUtc } from "@/lib/portal/time";
import { EmptyState, Icon, PageHeader, Pagination, paginate, type Params } from "@/components/portal/ui";
import { AutoSubmit } from "@/components/portal/shell";

export const metadata: Metadata = { title: "Audit history" };
const BASE = `${PORTAL}/audit`;
const AREAS: Record<string, string> = {
  student: "Students", teacher: "Teachers", registration: "Registrations", enquiry: "Enquiries", enrolment: "Enrolments & classes",
  course: "Courses", user: "Users & sign-in", settings: "Settings", import: "Data import",
};
const LINK: Record<string, string> = { student: "students", teacher: "teachers", registration: "registrations", enquiry: "enquiries", enrolment: "enrolments", course: "courses", user: "users" };

export default async function AuditPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePage("audit.view", BASE);
  const sp = await searchParams;
  const tz = await academyTimezone();
  const where: string[] = [];
  const params: db.Param[] = [];
  if (sp.area && sp.area in AREAS) { where.push("a.action LIKE ?"); params.push(`${sp.area}.%`); }
  if (sp.user === "system") where.push("a.user_id IS NULL");
  else if (sp.user && /^\d+$/.test(sp.user)) { where.push("a.user_id = ?"); params.push(Number(sp.user)); }
  if (sp.q) { where.push("a.summary LIKE ?"); params.push(db.likeTerm(sp.q.slice(0, 100))); }
  if (sp.from && isYmd(sp.from)) { where.push("a.created_at >= ?"); params.push(localDayStartUtc(sp.from, tz)); }
  if (sp.to && isYmd(sp.to)) { where.push("a.created_at < ?"); params.push(localDayStartUtc(addDays(sp.to, 1), tz)); }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const total = await db.count(`SELECT COUNT(*) FROM hq_audit_log a ${w}`, params);
  const pg = paginate(total, sp.page, 50);
  const rows = await db.all<{ id: number; action: string; summary: string; entity_type: string | null; entity_id: number | null; ip: string | null; created_at: string; user_name: string | null }>(
    `SELECT a.id, a.action, a.summary, a.entity_type, a.entity_id, a.ip, a.created_at, u.name AS user_name FROM hq_audit_log a LEFT JOIN hq_users u ON u.id = a.user_id ${w} ORDER BY a.id DESC LIMIT ${pg.perPage} OFFSET ${pg.offset}`, params);
  const users = await db.all<{ id: number; name: string }>("SELECT id, name FROM hq_users ORDER BY name");
  const p: Params = { area: sp.area, user: sp.user, q: sp.q, from: sp.from, to: sp.to };
  return (
    <>
      <PageHeader eyebrow="Administration" title="Audit history" subtitle="Who did what and when. Passwords, tokens and note or message contents are never recorded here." />
      <div className="card">
        <form className="filters" method="get" action={BASE} role="search" aria-label="Filter audit history">
          <AutoSubmit>
            <div className="field field-search"><label htmlFor="q">Search</label><input className="input" id="q" name="q" type="search" defaultValue={sp.q} placeholder="Name, reference or action" /></div>
            <div className="field"><label htmlFor="area">Area</label><select className="input" id="area" name="area" defaultValue={sp.area ?? ""}><option value="">All areas</option>{Object.entries(AREAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="user">By</label><select className="input" id="user" name="user" defaultValue={sp.user ?? ""}><option value="">Anyone</option><option value="system">Website / system</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div className="field"><label htmlFor="from">From</label><input className="input" id="from" name="from" type="date" defaultValue={sp.from} /></div>
            <div className="field"><label htmlFor="to">To</label><input className="input" id="to" name="to" type="date" defaultValue={sp.to} /></div>
          </AutoSubmit>
          <div className="filter-actions"><button className="btn btn-secondary" type="submit"><Icon name="funnel" /> Apply</button><Link className="btn btn-ghost" href={BASE}>Clear</Link></div>
        </form>
        {rows.length === 0 ? <EmptyState icon="clock-history" title="No matching activity" text="Nothing has been recorded for these filters." /> : (
          <div className="table-wrap"><table className="table responsive">
            <thead><tr><th scope="col">When</th><th scope="col">Who</th><th scope="col">What</th><th scope="col">Action</th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id}>
                <td data-label="When" className="nowrap">{fmtDateTime(r.created_at, tz)}</td>
                <td data-label="Who">{r.user_name ?? <span className="muted">Website / system</span>}</td>
                <td className="cell-primary">{r.entity_type && r.entity_id && LINK[r.entity_type] ? <Link href={`${PORTAL}/${LINK[r.entity_type]}/${r.entity_id}`}>{r.summary}</Link> : r.summary}</td>
                <td data-label="Action" className="mono small muted">{r.action}</td>
              </tr>))}
            </tbody>
          </table></div>
        )}
        <Pagination info={pg} base={BASE} params={p} />
      </div>
    </>
  );
}

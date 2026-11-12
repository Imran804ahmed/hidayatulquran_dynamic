import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { academyTimezone } from "@/lib/portal/settings";
import { localYmd, relativeTime, fmtDateTime } from "@/lib/portal/time";
import { COUNTRIES, PACKAGES, REG_OPEN, REG_STATUS, countryName, packageName } from "@/lib/portal/lookups";
import { REG_SORTS, registrationWhere } from "@/lib/portal/registrations";
import { orderBy } from "@/lib/portal/students";
import { Badge, EmptyState, FollowUp, Icon, PageHeader, Pagination, SortHeader, hrefWith, paginate, type Params } from "@/components/portal/ui";
import { AutoSubmit, RememberList, ScrollMemory } from "@/components/portal/shell";

export const metadata: Metadata = { title: "Registrations" };
const BASE = `${PORTAL}/registrations`;

export default async function RegistrationsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requirePage("registrations.view", BASE);
  const sp = await searchParams;
  const tz = await academyTimezone();
  const today = localYmd(tz);
  const f = { q: sp.q?.trim().slice(0, 100), status: sp.status ?? "open", followup: sp.followup, assigned: sp.assigned, package: sp.package, country: sp.country, from: sp.from, to: sp.to };
  const where = registrationWhere(f, tz, user.id);
  const order = orderBy(REG_SORTS, sp.sort, sp.dir, "submitted");
  const total = await db.count(`SELECT COUNT(*) FROM hq_registrations r ${where.sql}`, where.params);
  const pg = paginate(total, sp.page);
  const rows = await db.all<{ id: number; ref_no: string; full_name: string; age: number | null; guardian_name: string | null; country: string | null; package: string | null; classes_plan: string | null; status: string; submitted_at: string; submitted_at_known: number; follow_up_on: string | null; assignee: string | null; student_id: number | null }>(
    `SELECT r.id, r.ref_no, r.full_name, r.age, r.guardian_name, r.country, r.package, r.classes_plan, r.status, r.submitted_at, r.submitted_at_known, r.follow_up_on, r.student_id, u.name AS assignee
       FROM hq_registrations r LEFT JOIN hq_users u ON u.id = r.assigned_to ${where.sql} ORDER BY ${order.sql}, r.id DESC LIMIT ${pg.perPage} OFFSET ${pg.offset}`,
    where.params,
  );
  const counts = Object.fromEntries((await db.all<{ status: string; n: number }>("SELECT status, COUNT(*) AS n FROM hq_registrations GROUP BY status")).map((r) => [r.status, Number(r.n)]));
  const users = await db.all<{ id: number; name: string }>("SELECT id, name FROM hq_users WHERE status = 'active' ORDER BY name");
  const params: Params = { ...f, status: sp.status, sort: sp.sort, dir: sp.dir };
  const sortProps = { base: BASE, params, sort: order.sort, dir: order.dir };
  const tab = (status: string) => hrefWith(BASE, { ...params, status, page: undefined });
  const filtered = Boolean(f.q || f.followup || f.assigned || f.package || f.country || f.from || f.to);
  const openCount = REG_OPEN.reduce((s, k) => s + (counts[k] ?? 0), 0);

  return (
    <>
      <Suspense fallback={null}><RememberList module="registrations" /><ScrollMemory /></Suspense>
      <PageHeader eyebrow="Admissions" title="Registration requests"
        subtitle="Submissions from registration.html. Review → contact → approve → convert to a student and enrol. Approval alone never creates a student, login or message."
        actions={can(user, "registrations.export") ? <a className="btn btn-secondary" href={hrefWith(`${BASE}/export`, { ...f, status: f.status })}><Icon name="download" /> Export CSV</a> : undefined} />
      <div className="card">
        <nav className="tabs" aria-label="Registration status">
          <Link href={tab("open")} aria-current={f.status === "open" ? "page" : undefined}>Open <span className="pill">{openCount}</span></Link>
          {Object.entries(REG_STATUS).map(([k, label]) => (
            <Link key={k} href={tab(k)} aria-current={f.status === k ? "page" : undefined}>{label} <span className="pill">{counts[k] ?? 0}</span></Link>
          ))}
          <Link href={tab("all")} aria-current={f.status === "all" ? "page" : undefined}>All</Link>
        </nav>
        <form className="filters" method="get" action={BASE} role="search" aria-label="Filter registrations">
          <input type="hidden" name="status" value={f.status} />
          <AutoSubmit>
            <div className="field field-search"><label htmlFor="q">Search</label><input className="input" id="q" name="q" type="search" defaultValue={f.q} placeholder="Name, ref, email, guardian or phone" /></div>
            <div className="field"><label htmlFor="followup">Follow-up</label>
              <select className="input" id="followup" name="followup" defaultValue={f.followup ?? ""}><option value="">Any</option><option value="overdue">Overdue</option><option value="today">Due today</option><option value="week">Next 7 days</option><option value="none">No follow-up set</option></select></div>
            <div className="field"><label htmlFor="assigned">Assigned to</label>
              <select className="input" id="assigned" name="assigned" defaultValue={f.assigned ?? ""}><option value="">Anyone</option><option value="me">Me</option><option value="unassigned">Unassigned</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div className="field"><label htmlFor="package">Package</label>
              <select className="input" id="package" name="package" defaultValue={f.package ?? ""}><option value="">Any</option>{Object.entries(PACKAGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="country">Country</label>
              <select className="input" id="country" name="country" defaultValue={f.country ?? ""}><option value="">Any</option>{Object.entries(COUNTRIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="from">Submitted from</label><input className="input" id="from" name="from" type="date" defaultValue={f.from} /></div>
            <div className="field"><label htmlFor="to">Submitted to</label><input className="input" id="to" name="to" type="date" defaultValue={f.to} /></div>
          </AutoSubmit>
          <div className="filter-actions"><button className="btn btn-secondary" type="submit"><Icon name="funnel" /> Apply</button>{filtered && <Link className="btn btn-ghost" href={tab(f.status)}>Clear</Link>}</div>
        </form>
        {rows.length === 0 ? (
          filtered || f.status !== "open"
            ? <EmptyState icon="search" title="No registrations match" text="Nothing matches this status and these filters." action={<Link className="btn btn-secondary" href={BASE}>Show open requests</Link>} />
            : <EmptyState icon="inbox" title="No open registration requests" text="New submissions from the website registration form will appear here." />
        ) : (
          <div className="table-wrap">
            <table className="table responsive">
              <caption className="sr-only">Registration requests, {total} results</caption>
              <thead><tr>
                <SortHeader column="name" label="Applicant" {...sortProps} />
                <th scope="col">Package</th>
                <th scope="col">Country</th>
                <SortHeader column="submitted" label="Submitted" {...sortProps} />
                <th scope="col">Assigned</th>
                <SortHeader column="followup" label="Follow-up" {...sortProps} />
                <SortHeader column="status" label="Status" {...sortProps} />
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={r.status === "new" ? "is-unread" : undefined}>
                    <td className="cell-primary">
                      <Link className="row-link" href={`${BASE}/${r.id}`}>{r.full_name}</Link>{r.age ? <span className="muted small"> · age {r.age}</span> : null}
                      <div className="person-sub"><span className="mono">{r.ref_no}</span>{r.guardian_name ? ` · Guardian: ${r.guardian_name}` : ""}{r.student_id ? " · Converted" : ""}</div>
                    </td>
                    <td data-label="Package" className="small">{packageName(r.package)}</td>
                    <td data-label="Country">{countryName(r.country)}</td>
                    <td data-label="Submitted" className="nowrap" title={fmtDateTime(r.submitted_at, tz)}>{r.submitted_at_known ? relativeTime(r.submitted_at, tz) : <span className="muted">Imported (date unknown)</span>}</td>
                    <td data-label="Assigned" className="small">{r.assignee ?? <span className="muted">—</span>}</td>
                    <td data-label="Follow-up"><FollowUp date={r.follow_up_on} open={REG_OPEN.includes(r.status as never)} today={today} /></td>
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

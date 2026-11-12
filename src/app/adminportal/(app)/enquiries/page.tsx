import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { academyTimezone } from "@/lib/portal/settings";
import { fmtDateTime, localYmd, relativeTime } from "@/lib/portal/time";
import { ENQ_OPEN, ENQ_STATUS } from "@/lib/portal/lookups";
import { ENQ_SORTS, enquiryWhere } from "@/lib/portal/enquiries";
import { orderBy } from "@/lib/portal/students";
import { Badge, EmptyState, FollowUp, Icon, PageHeader, Pagination, SortHeader, hrefWith, paginate, type Params } from "@/components/portal/ui";
import { AutoSubmit, RememberList, ScrollMemory } from "@/components/portal/shell";

export const metadata: Metadata = { title: "Enquiries" };
const BASE = `${PORTAL}/enquiries`;

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requirePage("enquiries.view", BASE);
  const sp = await searchParams;
  const tz = await academyTimezone();
  const today = localYmd(tz);
  const f = { q: sp.q?.trim().slice(0, 100), status: sp.status ?? "open", unread: sp.unread, followup: sp.followup, assigned: sp.assigned, from: sp.from, to: sp.to };
  const where = enquiryWhere(f, tz, user.id);
  const order = orderBy(ENQ_SORTS, sp.sort, sp.dir, "submitted");
  const total = await db.count(`SELECT COUNT(*) FROM hq_enquiries e ${where.sql}`, where.params);
  const pg = paginate(total, sp.page);
  const rows = await db.all<{ id: number; ref_no: string; full_name: string; email: string | null; subject: string | null; message: string | null; status: string; read_at: string | null; submitted_at: string; submitted_at_known: number; follow_up_on: string | null; assignee: string | null }>(
    `SELECT e.id, e.ref_no, e.full_name, e.email, e.subject, LEFT(e.message, 140) AS message, e.status, e.read_at, e.submitted_at, e.submitted_at_known, e.follow_up_on, u.name AS assignee
       FROM hq_enquiries e LEFT JOIN hq_users u ON u.id = e.assigned_to ${where.sql} ORDER BY ${order.sql}, e.id DESC LIMIT ${pg.perPage} OFFSET ${pg.offset}`, where.params);
  const counts = Object.fromEntries((await db.all<{ status: string; n: number }>("SELECT status, COUNT(*) AS n FROM hq_enquiries GROUP BY status")).map((r) => [r.status, Number(r.n)]));
  const unread = await db.count("SELECT COUNT(*) FROM hq_enquiries WHERE read_at IS NULL AND status IN ('new','in_progress')");
  const users = await db.all<{ id: number; name: string }>("SELECT id, name FROM hq_users WHERE status = 'active' ORDER BY name");
  const params: Params = { ...f, status: sp.status, sort: sp.sort, dir: sp.dir };
  const sortProps = { base: BASE, params, sort: order.sort, dir: order.dir };
  const tab = (status: string) => hrefWith(BASE, { ...params, status, page: undefined, unread: undefined });
  const filtered = Boolean(f.q || f.unread || f.followup || f.assigned || f.from || f.to);
  return (
    <>
      <Suspense fallback={null}><RememberList module="enquiries" /><ScrollMemory /></Suspense>
      <PageHeader eyebrow="Admissions" title="Enquiries" subtitle="Messages from the website contact form. Internal notes and assignments are never visible to the sender."
        actions={<>
          {unread > 0 && <Link className="btn btn-secondary" href={hrefWith(BASE, { status: "open", unread: "1" })}><Icon name="envelope" /> {unread} unread</Link>}
          {can(user, "enquiries.export") && <a className="btn btn-secondary" href={hrefWith(`${BASE}/export`, { ...f })}><Icon name="download" /> Export CSV</a>}
        </>} />
      <div className="card">
        <nav className="tabs" aria-label="Enquiry status">
          <Link href={tab("open")} aria-current={f.status === "open" ? "page" : undefined}>Unresolved <span className="pill">{ENQ_OPEN.reduce((s, k) => s + (counts[k] ?? 0), 0)}</span></Link>
          {Object.entries(ENQ_STATUS).map(([k, label]) => <Link key={k} href={tab(k)} aria-current={f.status === k ? "page" : undefined}>{label} <span className="pill">{counts[k] ?? 0}</span></Link>)}
          <Link href={tab("all")} aria-current={f.status === "all" ? "page" : undefined}>All</Link>
        </nav>
        <form className="filters" method="get" action={BASE} role="search" aria-label="Filter enquiries">
          <input type="hidden" name="status" value={f.status} />
          <AutoSubmit>
            <div className="field field-search"><label htmlFor="q">Search</label><input className="input" id="q" name="q" type="search" defaultValue={f.q} placeholder="Name, ref, email, subject or message" /></div>
            <div className="field"><label htmlFor="unread">Read state</label><select className="input" id="unread" name="unread" defaultValue={f.unread ?? ""}><option value="">Any</option><option value="1">Unread only</option></select></div>
            <div className="field"><label htmlFor="followup">Follow-up</label><select className="input" id="followup" name="followup" defaultValue={f.followup ?? ""}><option value="">Any</option><option value="overdue">Overdue</option><option value="today">Due today</option><option value="week">Next 7 days</option></select></div>
            <div className="field"><label htmlFor="assigned">Assigned to</label><select className="input" id="assigned" name="assigned" defaultValue={f.assigned ?? ""}><option value="">Anyone</option><option value="me">Me</option><option value="unassigned">Unassigned</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div className="field"><label htmlFor="from">From</label><input className="input" id="from" name="from" type="date" defaultValue={f.from} /></div>
            <div className="field"><label htmlFor="to">To</label><input className="input" id="to" name="to" type="date" defaultValue={f.to} /></div>
          </AutoSubmit>
          <div className="filter-actions"><button className="btn btn-secondary" type="submit"><Icon name="funnel" /> Apply</button>{filtered && <Link className="btn btn-ghost" href={tab(f.status)}>Clear</Link>}</div>
        </form>
        {rows.length === 0 ? (
          filtered || f.status !== "open"
            ? <EmptyState icon="search" title="No enquiries match" text="Nothing matches this status and these filters." action={<Link className="btn btn-secondary" href={BASE}>Show unresolved</Link>} />
            : <EmptyState icon="envelope-open" title="No unresolved enquiries" text="New messages from the website contact form will appear here." />
        ) : (
          <div className="table-wrap">
            <table className="table responsive">
              <caption className="sr-only">Enquiries, {total} results</caption>
              <thead><tr>
                <SortHeader column="name" label="From" {...sortProps} />
                <th scope="col">Subject</th>
                <SortHeader column="submitted" label="Received" {...sortProps} />
                <th scope="col">Assigned</th>
                <SortHeader column="followup" label="Follow-up" {...sortProps} />
                <SortHeader column="status" label="Status" {...sortProps} />
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={!r.read_at ? "is-unread" : undefined}>
                    <td className="cell-primary">{!r.read_at && <span className="unread-dot" title="Unread" />}<span className="sr-only">{!r.read_at ? "Unread. " : ""}</span>
                      <Link className="row-link" href={`${BASE}/${r.id}`}>{r.full_name}</Link><div className="person-sub">{r.email}</div></td>
                    <td data-label="Subject"><div className={!r.read_at ? "" : "muted"} style={{ fontWeight: r.read_at ? 400 : 700 }}>{r.subject}</div><div className="small muted">{(r.message ?? "").slice(0, 90)}{(r.message ?? "").length > 90 ? "…" : ""}</div></td>
                    <td data-label="Received" className="nowrap" title={fmtDateTime(r.submitted_at, tz)}>{r.submitted_at_known ? relativeTime(r.submitted_at, tz) : <span className="muted">Imported</span>}</td>
                    <td data-label="Assigned" className="small">{r.assignee ?? <span className="muted">—</span>}</td>
                    <td data-label="Follow-up"><FollowUp date={r.follow_up_on} open={ENQ_OPEN.includes(r.status as never)} today={today} /></td>
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

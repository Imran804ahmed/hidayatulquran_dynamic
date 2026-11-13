import type { Metadata } from "next";
import Link from "next/link";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { getSettings } from "@/lib/portal/settings";
import { fmtTime, localYmd, relativeTime, addDays } from "@/lib/portal/time";
import { resolveRange, trend } from "@/lib/portal/trends";
import { upcomingClasses } from "@/lib/portal/schedule";
import { registrationWhere } from "@/lib/portal/registrations";
import { enquiryWhere } from "@/lib/portal/enquiries";
import { enrolmentWhere } from "@/lib/portal/enrolments";
import { AttentionList, Badge, EmptyState, FollowUp, Icon, ModuleCard, StatCard, type AttentionItem } from "@/components/portal/ui";
import { portalModules } from "@/lib/portal/modules";
import { TrendChart } from "@/components/portal/charts";
import { countryName, packageName } from "@/lib/portal/lookups";

export const metadata: Metadata = { title: "Dashboard" };

type Sp = Promise<Record<string, string | undefined>>;

export default async function Dashboard({ searchParams }: { searchParams: Sp }) {
  const user = await requirePage("dashboard.view", `${PORTAL}/dashboard`);
  const sp = await searchParams;
  const settings = await getSettings();
  const tz = settings.timezone;
  const today = localYmd(tz);
  const p = (path: string) => `${PORTAL}/${path}`;

  const canReg = can(user, "registrations.view");
  const canEnq = can(user, "enquiries.view");
  const canStu = can(user, "students.view");
  const canTea = can(user, "teachers.view");
  const canCourses = can(user, "courses.view");

  const statusCounts = async (table: string) => {
    const rows = await db.all<{ status: string; n: number }>(`SELECT status, COUNT(*) AS n FROM ${table} GROUP BY status`);
    return Object.fromEntries(rows.map((r) => [r.status, Number(r.n)])) as Record<string, number>;
  };
  // Work-queue counts use the same filter helpers as the lists they link to, so the numbers always match.
  const regCount = (f: Parameters<typeof registrationWhere>[0]) => {
    const w = registrationWhere(f, tz, user.id);
    return db.count(`SELECT COUNT(*) FROM hq_registrations r ${w.sql}`, w.params);
  };
  const enqCount = (f: Parameters<typeof enquiryWhere>[0]) => {
    const w = enquiryWhere(f, tz, user.id);
    return db.count(`SELECT COUNT(*) FROM hq_enquiries e ${w.sql}`, w.params);
  };
  const enrolCount = (f: Parameters<typeof enrolmentWhere>[0]) => {
    const w = enrolmentWhere(f);
    return db.count(`SELECT COUNT(*) FROM hq_enrolments e JOIN hq_students s ON s.id = e.student_id ${w.sql}`, w.params);
  };
  const [stu, tea, reg, enq, activeCourses, regApproved, regOverdue, enqUnread, enqOverdue, liveEnrolments, noTeacher] = await Promise.all([
    canStu ? statusCounts("hq_students") : null,
    canTea ? statusCounts("hq_teachers") : null,
    canReg ? statusCounts("hq_registrations") : null,
    canEnq ? statusCounts("hq_enquiries") : null,
    canCourses ? db.count("SELECT COUNT(*) FROM hq_courses WHERE status = 'active'") : 0,
    canReg ? regCount({ status: "approved" }) : 0,
    canReg ? regCount({ status: "open", followup: "overdue" }) : 0,
    canEnq ? enqCount({ status: "open", unread: "1" }) : 0,
    canEnq ? enqCount({ status: "open", followup: "overdue" }) : 0,
    canCourses ? enrolCount({ status: "live" }) : 0,
    canCourses ? enrolCount({ status: "live", teacher: "none" }) : 0,
  ]);
  const n = (o: Record<string, number> | null, ...keys: string[]) => keys.reduce((sum, k) => sum + (o?.[k] ?? 0), 0);

  const range = resolveRange(sp, tz);
  const trendData = canReg || canEnq ? await trend(range, tz) : null;

  type Recent = { id: number; ref_no: string; full_name: string; status: string; submitted_at: string; extra: string | null; extra2: string | null };
  const recentRegs = canReg ? await db.all<Recent>("SELECT id, ref_no, full_name, status, submitted_at, package AS extra, country AS extra2 FROM hq_registrations ORDER BY submitted_at DESC, id DESC LIMIT 6") : [];
  const recentEnqs = canEnq ? await db.all<Recent & { read_at: string | null }>("SELECT id, ref_no, full_name, status, submitted_at, subject AS extra, NULL AS extra2, read_at FROM hq_enquiries ORDER BY submitted_at DESC, id DESC LIMIT 6") : [];

  type Follow = { kind: "registration" | "enquiry"; id: number; ref_no: string; full_name: string; follow_up_on: string; status: string; assignee: string | null };
  const weekAhead = addDays(today, 7);
  const follows: Follow[] = [
    ...(canReg ? await db.all<Follow>(`SELECT 'registration' AS kind, r.id, r.ref_no, r.full_name, r.follow_up_on, r.status, u.name AS assignee
        FROM hq_registrations r LEFT JOIN hq_users u ON u.id = r.assigned_to
        WHERE r.follow_up_on <= ? AND r.status IN ('new','under_review','contacted','approved') ORDER BY r.follow_up_on LIMIT 10`, [weekAhead]) : []),
    ...(canEnq ? await db.all<Follow>(`SELECT 'enquiry' AS kind, e.id, e.ref_no, e.full_name, e.follow_up_on, e.status, u.name AS assignee
        FROM hq_enquiries e LEFT JOIN hq_users u ON u.id = e.assigned_to
        WHERE e.follow_up_on <= ? AND e.status IN ('new','in_progress') ORDER BY e.follow_up_on LIMIT 10`, [weekAhead]) : []),
  ].sort((a, b) => a.follow_up_on.localeCompare(b.follow_up_on)).slice(0, 10);

  const classes = canCourses ? await upcomingClasses(24, 8) : [];
  const activity = can(user, "audit.view")
    ? await db.all<{ id: number; summary: string; action: string; created_at: string; user_name: string | null; entity_type: string | null; entity_id: number | null }>(
        "SELECT a.id, a.summary, a.action, a.created_at, a.entity_type, a.entity_id, u.name AS user_name FROM hq_audit_log a LEFT JOIN hq_users u ON u.id = a.user_id WHERE a.action NOT IN ('auth.login','auth.logout') ORDER BY a.id DESC LIMIT 8")
    : [];

  // Every section this user can open, except the dashboard itself.
  const modules = portalModules(user).flatMap((g) => g.items).filter((m) => m.key !== "dashboard");

  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", hour12: false }).format(new Date()));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const rangeHref = (r: string) => `${p("dashboard")}?range=${r}`;
  const entityHref = (t: string | null, id: number | null) =>
    t && id ? ({ student: "students", teacher: "teachers", registration: "registrations", enquiry: "enquiries", course: "courses", enrolment: "enrolments" } as Record<string, string>)[t] : null;

  const attention: AttentionItem[] = [
    ...(canReg ? [
      { key: "reg-new", label: "New registrations", sub: "Submitted on the website, not reviewed yet", count: n(reg, "new"), href: p("registrations?status=new"), action: "Review" },
      { key: "reg-approved", label: "Approved registrations", sub: can(user, "registrations.convert") ? "Next step: convert to a student and enrol" : "Waiting for a user who can convert them", count: regApproved, href: p("registrations?status=approved"), action: "Open" },
      { key: "reg-overdue", label: "Overdue registration follow-ups", sub: "Open requests past their follow-up date", count: regOverdue, href: p("registrations?followup=overdue"), urgent: true, action: "Follow up" },
    ] : []),
    ...(canEnq ? [
      { key: "enq-unread", label: "Unread enquiries", sub: "Unresolved messages nobody has opened", count: enqUnread, href: p("enquiries?status=open&unread=1"), action: "Read" },
      { key: "enq-overdue", label: "Overdue enquiry follow-ups", sub: "Unresolved enquiries past their follow-up date", count: enqOverdue, href: p("enquiries?followup=overdue"), urgent: true, action: "Follow up" },
    ] : []),
    ...(canCourses ? [
      { key: "enrol-noteacher", label: "Enrolments without a teacher", sub: "Current enrolments that still need a teacher", count: noTeacher, href: p("enrolments?teacher=none"), action: "Assign" },
    ] : []),
  ];

  // One primary action; the rest are secondary.
  const primary = canReg && n(reg, "new") > 0
    ? <Link className="btn btn-primary" href={p("registrations?status=new")}><Icon name="inbox" /> Review new registrations</Link>
    : can(user, "students.create") ? <Link className="btn btn-primary" href={p("students/new")}><Icon name="person-plus" /> Add student</Link> : null;

  return (
    <>
      {/* The page's h1 ("Dashboard" + welcome line) is in the top bar. */}
      <div className="page-head page-head-compact">
        <div className="page-head-text">
          <div className="eyebrow">{new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}</div>
          <p className="page-sub">{greeting}. Here are today&apos;s work queue, key numbers and recent activity. Times are shown in {tz}.</p>
        </div>
        <div className="page-actions">
          {primary}
          {canReg && n(reg, "new") > 0 && can(user, "students.create") && <Link className="btn btn-secondary" href={p("students/new")}><Icon name="person-plus" /> Add student</Link>}
          {can(user, "teachers.create") && <Link className="btn btn-secondary" href={p("teachers/new")}><Icon name="person-badge" /> Add teacher</Link>}
        </div>
      </div>

      <h2 className="sr-only">Key figures</h2>
      <div className="stats">
        {canStu && <StatCard href={p("students?status=current")} label="Students" value={n(stu, "active", "inactive")} icon="people-fill" tone="purple"
          meta={<><Link href={p("students?status=active")}><strong>{n(stu, "active")}</strong> active</Link><Link href={p("students?status=inactive")}><strong>{n(stu, "inactive")}</strong> inactive</Link></>} />}
        {canTea && <StatCard href={p("teachers?status=current")} label="Teachers" value={n(tea, "active", "inactive")} icon="person-badge-fill" tone="pink"
          meta={<><Link href={p("teachers?status=active")}><strong>{n(tea, "active")}</strong> active</Link><Link href={p("teachers?status=inactive")}><strong>{n(tea, "inactive")}</strong> inactive</Link></>} />}
        {canReg && <StatCard href={p("registrations")} label="Open registrations" value={n(reg, "new", "under_review", "contacted", "approved")} icon="person-plus-fill" tone="sky"
          definition="New, under review, contacted or approved; not yet enrolled." />}
        {canEnq && <StatCard href={p("enquiries")} label="Unresolved enquiries" value={n(enq, "new", "in_progress")} icon="envelope-fill" tone="amber"
          definition="New or in progress." />}
        {canCourses && <StatCard href={p("enrolments")} label="Current enrolments" value={liveEnrolments} icon="journal-check" tone="teal" definition="Pending, active or paused." />}
        {canCourses && <StatCard href={p("courses?status=active")} label="Active courses" value={activeCourses} icon="book-fill" tone="indigo" definition="Open for new enrolments." />}
      </div>

      {modules.length > 0 && (
        <section className="mb-section" aria-labelledby="mod-title">
          <h2 id="mod-title" className="section-title">Modules</h2>
          <ul className="module-grid list-plain">
            {modules.map((m) => (
              <li key={m.key}><ModuleCard href={m.href} label={m.label} description={m.description} icon={m.icon} tone={m.tone}
                badge={m.key === "registrations" ? n(reg, "new") : m.key === "enquiries" ? n(enq, "new") : undefined} /></li>
            ))}
          </ul>
        </section>
      )}

      {attention.length > 0 && (
        <section className="card mb-section" aria-labelledby="att-title">
          <div className="card-head"><h2 id="att-title"><Icon name="flag-fill" /> Needs attention</h2><span className="small muted">Each item opens the matching filtered list</span></div>
          <AttentionList items={attention} />
        </section>
      )}

      <div className="grid grid-main-side">
        <div className="stack">
          {trendData && (
            <section className="card" aria-labelledby="trend-title">
              <div className="card-head">
                <h2 id="trend-title"><Icon name="graph-up" /> Registrations &amp; enquiries received</h2>
                <form className="range-form" method="get" action={p("dashboard")} aria-label="Chart date range">
                  <div className="seg" role="group" aria-label="Preset range">
                    {["7", "30", "90"].map((r) => <Link key={r} href={rangeHref(r)} aria-current={range.preset === r ? "true" : undefined}>{r} days</Link>)}
                  </div>
                  <label className="sr-only" htmlFor="tr-from">From</label>
                  <input className="input" id="tr-from" type="date" name="from" defaultValue={range.from} max={today} />
                  <span className="muted small" aria-hidden="true">to</span>
                  <label className="sr-only" htmlFor="tr-to">To</label>
                  <input className="input" id="tr-to" type="date" name="to" defaultValue={range.to} max={today} />
                  <button className="btn btn-secondary btn-sm" type="submit">Apply</button>
                </form>
              </div>
              <div className="card-body">
                <div className="legend mb-4">
                  <span><i className="swatch swatch-reg" /> Registrations: <strong>{trendData.buckets.reduce((s, b) => s + b.reg, 0)}</strong></span>
                  <span><i className="swatch swatch-enq" /> Enquiries: <strong>{trendData.buckets.reduce((s, b) => s + b.enq, 0)}</strong></span>
                  <span>{trendData.unit === "week" ? "Per week" : "Per day"}, {range.from} to {range.to}</span>
                </div>
                <TrendChart buckets={trendData.buckets} title={`Registrations and enquiries per ${trendData.unit}, ${range.from} to ${range.to}`} />
                {trendData.unknownTimes > 0 && <p className="hint mt-3">{trendData.unknownTimes} imported submission(s) have no original timestamp and are not shown in the chart.</p>}
              </div>
            </section>
          )}

          <div className="grid grid-2">
            {canReg && (
              <section className="card" aria-labelledby="rr-title">
                <div className="card-head"><h2 id="rr-title"><Icon name="person-plus" /> Latest registrations</h2><Link className="small" href={p("registrations?status=all")}>View all<span className="sr-only"> registrations</span></Link></div>
                {recentRegs.length === 0 ? <EmptyState icon="inbox" title="No registrations yet" text="Submissions from the website registration form will appear here as soon as they are received." /> : (
                  <ul className="list-plain">
                    {recentRegs.map((r) => (
                      <li key={r.id}><Link className="list-row" href={p(`registrations/${r.id}`)}>
                        <div className="list-row-main"><div className="list-row-title">{r.full_name}</div><div className="list-row-sub">{r.ref_no} · {packageName(r.extra) || "No package"} · {countryName(r.extra2) || "No country"}</div></div>
                        <div className="list-row-end"><Badge status={r.status} /><span className="small muted">{relativeTime(r.submitted_at, tz)}</span></div>
                      </Link></li>
                    ))}
                  </ul>
                )}
              </section>
            )}
            {canEnq && (
              <section className="card" aria-labelledby="re-title">
                <div className="card-head"><h2 id="re-title"><Icon name="envelope" /> Latest enquiries</h2><Link className="small" href={p("enquiries?status=all")}>View all<span className="sr-only"> enquiries</span></Link></div>
                {recentEnqs.length === 0 ? <EmptyState icon="envelope-open" title="No enquiries yet" text="Messages from the website contact form will appear here." /> : (
                  <ul className="list-plain">
                    {recentEnqs.map((r) => (
                      <li key={r.id}><Link className="list-row" href={p(`enquiries/${r.id}`)}>
                        <div className="list-row-main"><div className="list-row-title">{!r.read_at && <><span className="unread-dot" aria-hidden="true" /><span className="sr-only">Unread: </span></>}{r.full_name}</div><div className="list-row-sub">{r.extra || "No subject"}</div></div>
                        <div className="list-row-end"><Badge status={r.status} /><span className="small muted">{relativeTime(r.submitted_at, tz)}</span></div>
                      </Link></li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>
        </div>

        <div className="stack">
          {(canReg || canEnq) && (
            <section className="card" id="follow-ups" aria-labelledby="fu-title">
              <div className="card-head"><h2 id="fu-title"><Icon name="alarm" /> Follow-ups due</h2><span className="small muted">Overdue and next 7 days</span></div>
              {follows.length === 0 ? <div className="empty-inline">No follow-ups are due. Set a follow-up date on a registration or enquiry to see it here.</div> : (
                <ul className="list-plain">
                  {follows.map((f) => (
                    <li key={`${f.kind}-${f.id}`}><Link className="list-row" href={p(`${f.kind === "registration" ? "registrations" : "enquiries"}/${f.id}`)}>
                      <div className="list-row-main"><div className="list-row-title">{f.full_name}</div><div className="list-row-sub">{f.kind === "registration" ? "Registration" : "Enquiry"} {f.ref_no}{f.assignee ? ` · ${f.assignee}` : " · Unassigned"}</div></div>
                      <div className="list-row-end"><FollowUp date={f.follow_up_on} open today={today} /></div>
                    </Link></li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {canCourses && (
            <section className="card" aria-labelledby="uc-title">
              <div className="card-head"><h2 id="uc-title"><Icon name="calendar-event" /> Classes in the next 24 hours</h2><Link className="small" href={p("timetable")}>Timetable</Link></div>
              {classes.length === 0 ? <div className="empty-inline">No scheduled classes in the next 24 hours.</div> : (
                <ul className="list-plain">
                  {classes.map((c) => (
                    <li key={`${c.id}-${c.at.getTime()}`}><Link className="list-row" href={p(`enrolments/${c.enrolment_id}`)}>
                      <div className="list-row-main"><div className="list-row-title">{c.student_name}</div><div className="list-row-sub">{c.course_name} · {c.teacher_name ?? "No teacher"}</div></div>
                      <div className="list-row-end"><strong className="tt-time">{fmtTime(c.at, tz)}</strong><span className="small muted">{localYmd(tz, c.at) === today ? "today" : "tomorrow"} · {c.duration_min} min</span></div>
                    </Link></li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {can(user, "audit.view") && (
            <section className="card" aria-labelledby="ra-title">
              <div className="card-head"><h2 id="ra-title"><Icon name="clock-history" /> Recent activity</h2><Link className="small" href={p("audit")}>Full history</Link></div>
              {activity.length === 0 ? <div className="empty-inline">No administrative activity recorded yet.</div> : (
                <div className="card-body tight">
                  <ul className="timeline mt-3">
                    {activity.map((a) => {
                      const mod = entityHref(a.entity_type, a.entity_id);
                      return (
                        <li key={a.id}>
                          <span className="t-what">{mod ? <Link href={p(`${mod}/${a.entity_id}`)}>{a.summary}</Link> : a.summary}</span>
                          <span className="t-when">{a.user_name ?? "System / website"} · {relativeTime(a.created_at, tz)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}

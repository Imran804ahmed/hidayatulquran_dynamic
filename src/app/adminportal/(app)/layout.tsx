import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { PORTAL, can, currentUser, hadSessionCookie, safeNext } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { academyTimezone } from "@/lib/portal/settings";
import { localYmd } from "@/lib/portal/time";
import { SidebarNav, type NavGroup } from "@/components/portal/nav";
import { FlashMessages, MenuCloser, MenuToggle, NavProgress } from "@/components/portal/shell";
import { logoutAction } from "@/server/actions/auth";
import { Avatar } from "@/components/portal/ui";
import Image from "next/image";

/** Authenticated application shell: sidebar, top bar, notifications, account menu. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) {
    const q = new URLSearchParams();
    const next = safeNext((await headers()).get("x-hq-path"));
    if (next) q.set("next", next);
    if (await hadSessionCookie()) q.set("expired", "1");
    redirect(`${PORTAL}/login${q.size ? `?${q}` : ""}`);
  }

  const today = localYmd(await academyTimezone());
  const counts = { reg: 0, enq: 0, overdue: 0 };
  if (can(user, "registrations.view")) {
    counts.reg = await db.count("SELECT COUNT(*) FROM hq_registrations WHERE status = 'new'");
    counts.overdue += await db.count("SELECT COUNT(*) FROM hq_registrations WHERE follow_up_on < ? AND status IN ('new','under_review','contacted','approved')", [today]);
  }
  if (can(user, "enquiries.view")) {
    counts.enq = await db.count("SELECT COUNT(*) FROM hq_enquiries WHERE status = 'new'");
    counts.overdue += await db.count("SELECT COUNT(*) FROM hq_enquiries WHERE follow_up_on < ? AND status IN ('new','in_progress')", [today]);
  }
  const p = (path: string) => `${PORTAL}/${path}`;
  const groups: NavGroup[] = [
    { title: "Overview", items: can(user, "dashboard.view") ? [{ href: p("dashboard"), label: "Dashboard", icon: "grid-1x2" }] : [] },
    {
      title: "Admissions",
      items: [
        ...(can(user, "registrations.view") ? [{ href: p("registrations"), label: "Registrations", icon: "person-plus", count: counts.reg }] : []),
        ...(can(user, "enquiries.view") ? [{ href: p("enquiries"), label: "Enquiries", icon: "envelope", count: counts.enq }] : []),
      ],
    },
    {
      title: "People",
      items: [
        ...(can(user, "students.view") ? [{ href: p("students"), label: "Students", icon: "people" }] : []),
        ...(can(user, "teachers.view") ? [{ href: p("teachers"), label: "Teachers", icon: "person-badge" }] : []),
      ],
    },
    {
      title: "Academics",
      items: can(user, "courses.view")
        ? [
            { href: p("courses"), label: "Courses", icon: "book" },
            { href: p("enrolments"), label: "Enrolments", icon: "journal-check" },
            { href: p("timetable"), label: "Timetable", icon: "calendar-week" },
          ]
        : [],
    },
    {
      title: "Administration",
      items: [
        ...(can(user, "reports.view") ? [{ href: p("reports"), label: "Reports", icon: "bar-chart-line" }] : []),
        ...(can(user, "audit.view") ? [{ href: p("audit"), label: "Audit history", icon: "clock-history" }] : []),
        ...(can(user, "users.manage") ? [{ href: p("users"), label: "Users & roles", icon: "shield-lock" }] : []),
        ...(can(user, "settings.manage") ? [{ href: p("settings"), label: "Settings", icon: "gear" }] : []),
      ],
    },
  ].filter((g) => g.items.length > 0);
  const notifTotal = counts.reg + counts.enq + counts.overdue;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Suspense fallback={null}><NavProgress /></Suspense>
      <aside className="sidebar" id="sidebar" aria-label="Main navigation">
        <Link className="brand" href={p("dashboard")}>
          <Image className="brand-logo" src="/assets/img/hidayatulquran1.png" alt="" width={46} height={46} />
          <span className="brand-text"><span className="brand-name">Hidayatul Quran</span><span className="brand-sub">Admin portal</span></span>
        </Link>
        <SidebarNav groups={groups} />
        <div className="sidebar-foot">
          <a href="/" target="_blank" rel="noopener"><i className="bi bi-box-arrow-up-right" aria-hidden="true" /> View public website</a>
        </div>
      </aside>
      <div className="backdrop" aria-hidden="true" />
      <div className="main">
        <header className="topbar">
          <MenuToggle />
          {can(user, "students.view") && (
            <form className="topbar-search" role="search" action={p("students")} method="get">
              <i className="bi bi-search" aria-hidden="true" />
              <label className="sr-only" htmlFor="global-q">Search students by name, reference, email or phone</label>
              <input id="global-q" name="q" type="search" placeholder="Search students by name, ref, email or phone…" />
            </form>
          )}
          <div className="topbar-right">
            <details className="menu notif">
              <summary className="icon-btn" aria-label={`Notifications: ${notifTotal} items need attention`}>
                <i className="bi bi-bell" aria-hidden="true" />
                {notifTotal > 0 && <span className="notif-dot" aria-hidden="true">{notifTotal > 99 ? "99+" : notifTotal}</span>}
              </summary>
              <div className="menu-panel">
                <div className="menu-head">Needs attention</div>
                {can(user, "registrations.view") && <Link href={p("registrations?status=new")}><i className="bi bi-person-plus" aria-hidden="true" /> New registrations <span className="count">{counts.reg}</span></Link>}
                {can(user, "enquiries.view") && <Link href={p("enquiries?status=new")}><i className="bi bi-envelope" aria-hidden="true" /> New enquiries <span className="count">{counts.enq}</span></Link>}
                {(can(user, "registrations.view") || can(user, "enquiries.view")) && (
                  <Link href={p("dashboard#follow-ups")}><i className="bi bi-alarm" aria-hidden="true" /> Overdue follow-ups <span className="count">{counts.overdue}</span></Link>
                )}
              </div>
            </details>
            <details className="menu">
              <summary className="user-chip" aria-label="Account menu">
                <Avatar name={user.name} />
                <span className="user-chip-text"><span className="user-chip-name">{user.name}</span><span className="user-chip-role">{user.role === "super_admin" ? "Super Admin" : "Admin / Coordinator"}</span></span>
                <i className="bi bi-chevron-down muted" aria-hidden="true" />
              </summary>
              <div className="menu-panel">
                <div className="menu-head">{user.email}</div>
                <Link href={p("profile")}><i className="bi bi-person-circle" aria-hidden="true" /> My profile &amp; password</Link>
                <hr />
                <form action={logoutAction}>
                  <button type="submit"><i className="bi bi-box-arrow-right" aria-hidden="true" /> Sign out</button>
                </form>
              </div>
            </details>
          </div>
        </header>
        <main className="content" id="main" tabIndex={-1}>
          <Suspense fallback={null}><FlashMessages /></Suspense>
          <MenuCloser />
          {children}
        </main>
      </div>
    </>
  );
}

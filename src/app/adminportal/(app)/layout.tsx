import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { PORTAL, can, currentUser, hadSessionCookie, safeNext } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { academyTimezone } from "@/lib/portal/settings";
import { localYmd } from "@/lib/portal/time";
import { SidebarNav, TopbarTitle, type NavGroup } from "@/components/portal/nav";
import { portalModules } from "@/lib/portal/modules";
import { FlashMessages, MenuCloser, MenuToggle, NavProgress, SidebarControls } from "@/components/portal/shell";
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
  const counts = { reg: 0, enq: 0, regOverdue: 0, enqOverdue: 0 };
  if (can(user, "registrations.view")) {
    counts.reg = await db.count("SELECT COUNT(*) FROM hq_registrations WHERE status = 'new'");
    counts.regOverdue = await db.count("SELECT COUNT(*) FROM hq_registrations WHERE follow_up_on < ? AND status IN ('new','under_review','contacted','approved')", [today]);
  }
  if (can(user, "enquiries.view")) {
    counts.enq = await db.count("SELECT COUNT(*) FROM hq_enquiries WHERE status = 'new'");
    counts.enqOverdue = await db.count("SELECT COUNT(*) FROM hq_enquiries WHERE follow_up_on < ? AND status IN ('new','in_progress')", [today]);
  }
  // Desktop sidebar width is remembered in a cookie so the server renders it without a flash.
  const collapsed = (await cookies()).get("hq_sidebar")?.value === "collapsed";
  const p = (path: string) => `${PORTAL}/${path}`;
  // Same sections and permission checks as the dashboard module grid (src/lib/portal/modules.ts).
  const newCounts: Record<string, number> = { registrations: counts.reg, enquiries: counts.enq };
  const groups: NavGroup[] = portalModules(user).map((g) => ({
    title: g.title,
    items: g.items.map((m) => ({ href: m.href, label: m.label, icon: m.icon, tone: m.tone, count: newCounts[m.key] })),
  }));
  const notifTotal = counts.reg + counts.enq + counts.regOverdue + counts.enqOverdue;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Suspense fallback={null}><NavProgress /></Suspense>
      <div className={`app-shell${collapsed ? " is-collapsed" : ""}`}>
      <aside className="sidebar" id="sidebar" aria-label="Main navigation">
        <div className="sidebar-head">
          <Link className="brand" href={p("dashboard")} title="Dashboard">
            <Image className="brand-logo" src="/assets/img/hidayatulquran1.png" alt="" width={46} height={46} />
            <span className="brand-text"><span className="brand-name">Hidayatul Quran</span><span className="brand-sub">Admin portal</span></span>
          </Link>
          <SidebarControls collapsed={collapsed} />
        </div>
        <SidebarNav groups={groups} />
        <div className="sidebar-foot">
          <a href="/" target="_blank" rel="noopener" title="View public website (opens in a new tab)">
            <i className="bi bi-globe2" aria-hidden="true" /> <span className="foot-label">View public website<span className="sr-only"> (opens in a new tab)</span></span>
          </a>
          <form action={logoutAction}>
            <button type="submit" className="sidebar-logout" title="Sign out">
              <i className="bi bi-box-arrow-right" aria-hidden="true" /> <span className="foot-label">Sign out</span>
            </button>
          </form>
        </div>
      </aside>
      <div className="backdrop" aria-hidden="true" />
      <div className="main">
        <header className="topbar">
          <MenuToggle />
          <TopbarTitle groups={groups} dashboardHref={p("dashboard")} firstName={user.name.split(" ")[0]} />
          <div className="topbar-right">
            {can(user, "students.view") && (
              <form className="topbar-search" role="search" action={p("students")} method="get">
                <i className="bi bi-search" aria-hidden="true" />
                <label className="sr-only" htmlFor="global-q">Search students by name, reference, email or phone</label>
                <input id="global-q" name="q" type="search" placeholder="Search students…" title="Search students by name, reference, email or phone" />
              </form>
            )}
            <details className="menu notif">
              <summary className="icon-btn" aria-label={`Notifications: ${notifTotal} items need attention`}>
                <i className="bi bi-bell" aria-hidden="true" />
                {notifTotal > 0 && <span className="notif-dot" aria-hidden="true">{notifTotal > 99 ? "99+" : notifTotal}</span>}
              </summary>
              <div className="menu-panel">
                <div className="menu-head">Needs attention</div>
                {can(user, "registrations.view") && <Link href={p("registrations?status=new")}><i className="bi bi-person-plus" aria-hidden="true" /> New registrations <span className="count">{counts.reg}</span></Link>}
                {can(user, "enquiries.view") && <Link href={p("enquiries?status=new")}><i className="bi bi-envelope" aria-hidden="true" /> New enquiries <span className="count">{counts.enq}</span></Link>}
                {can(user, "registrations.view") && <Link href={p("registrations?followup=overdue")}><i className="bi bi-alarm" aria-hidden="true" /> Overdue registration follow-ups <span className="count">{counts.regOverdue}</span></Link>}
                {can(user, "enquiries.view") && <Link href={p("enquiries?followup=overdue")}><i className="bi bi-alarm" aria-hidden="true" /> Overdue enquiry follow-ups <span className="count">{counts.enqOverdue}</span></Link>}
                {notifTotal === 0 && <p className="menu-empty"><i className="bi bi-check-circle" aria-hidden="true" /> Nothing needs attention right now.</p>}
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
      </div>
    </>
  );
}

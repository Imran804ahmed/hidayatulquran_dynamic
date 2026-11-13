"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string; icon: string; tone?: string; count?: number };
export type NavGroup = { title: string; items: NavItem[] };

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

/** Sidebar links with an aria-current active state for the current section. */
export function SidebarNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="Portal sections">
      {groups.map((g) => (
        <div key={g.title} className="nav-group">
          <div className="nav-section">{g.title}</div>
          {g.items.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} title={item.count ? `${item.label} (${item.count} new)` : item.label}>
              <i className={`bi bi-${item.icon}${item.tone ? ` nav-ic-${item.tone}` : ""}`} aria-hidden="true" />
              <span className="nav-label">{item.label}</span>
              {item.count ? <span className="nav-count">{item.count > 99 ? "99+" : item.count}<span className="sr-only"> new</span></span> : null}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}

/**
 * Header title. On the dashboard it is the page's h1 with a welcome line; on inner pages it names
 * the current section (the page keeps its own h1 in the content area).
 */
export function TopbarTitle({ groups, dashboardHref, firstName }: { groups: NavGroup[]; dashboardHref: string; firstName: string }) {
  const pathname = usePathname();
  if (pathname === dashboardHref) {
    return (
      <div className="topbar-title">
        <h1>Dashboard</h1>
        <p className="topbar-welcome">Welcome back, {firstName} <span aria-hidden="true">👋</span></p>
      </div>
    );
  }
  let current: { group: string; item: NavItem } | null = null;
  for (const g of groups) for (const item of g.items) if (isActive(pathname, item.href)) current = { group: g.title, item };
  const label = current?.item.label ?? (pathname.includes("/profile") ? "My profile" : "Admin portal");
  return (
    <div className="topbar-title is-inner">
      {current && <span className="topbar-group">{current.group}</span>}
      <span className="topbar-section">{label}</span>
    </div>
  );
}

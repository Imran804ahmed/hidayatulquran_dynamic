"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string; icon: string; count?: number };
export type NavGroup = { title: string; items: NavItem[] };

/** Sidebar links with an aria-current active state for the current section. */
export function SidebarNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="Portal sections">
      {groups.map((g) => (
        <div key={g.title}>
          <div className="nav-section">{g.title}</div>
          {g.items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                <i className={`bi bi-${item.icon}`} aria-hidden="true" />
                <span>{item.label}</span>
                {item.count ? <span className="nav-count">{item.count}<span className="sr-only"> new</span></span> : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

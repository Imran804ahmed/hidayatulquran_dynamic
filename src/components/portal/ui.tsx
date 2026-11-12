import Link from "next/link";
import type { ReactNode } from "react";
import { TONES, statusLabel } from "@/lib/portal/lookups";

/* Server-safe presentational components for the admin portal. */

export function Icon({ name, className }: { name: string; className?: string }) {
  return <i className={`bi bi-${name}${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}

/** Status badge: colour plus a text label (never colour alone). */
export function Badge({ status, label }: { status: string; label?: string }) {
  const tone = TONES[status] ?? "neutral";
  return (
    <span className={`badge badge-${tone}`}>
      <span className="badge-dot" aria-hidden="true" />
      {label ?? statusLabel(status)}
    </span>
  );
}

export function PageHeader({ title, subtitle, eyebrow, actions, crumbs }: {
  title: ReactNode; subtitle?: ReactNode; eyebrow?: string; actions?: ReactNode; crumbs?: { href: string; label: string }[];
}) {
  return (
    <div className="page-head">
      <div className="page-head-text">
        {crumbs && crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={c.href} className="row-gap">
                {i > 0 && <span aria-hidden="true">/</span>}
                <Link href={c.href}>{i === 0 && <Icon name="arrow-left" />}{c.label}</Link>
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: string; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon name={icon} /></span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function LoadError({ what }: { what: string }) {
  return (
    <div className="load-error" role="alert">
      <Icon name="exclamation-triangle-fill" /> Could not load {what}. This is a loading problem, not an empty list. Refresh the page to try again.
    </div>
  );
}

export type Params = Record<string, string | undefined>;

/** Builds a URL from the current filters with overrides (undefined/'' removes a key). */
export function hrefWith(base: string, params: Params, overrides: Params = {}): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...params, ...overrides })) {
    if (v !== undefined && v !== "") q.set(k, v);
  }
  const s = q.toString();
  return s ? `${base}?${s}` : base;
}

export function SortHeader({ column, label, base, params, sort, dir }: { column: string; label: string; base: string; params: Params; sort: string; dir: "asc" | "desc" }) {
  const active = sort === column;
  const next = active && dir === "asc" ? "desc" : "asc";
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : undefined}>
      <Link className="sort-link" href={hrefWith(base, params, { sort: column, dir: next, page: undefined })}>
        {label} {active ? <Icon name={dir === "asc" ? "caret-up-fill" : "caret-down-fill"} /> : <Icon name="chevron-expand" className="sort-idle" />}
        {active && <span className="sr-only">, sorted {dir === "asc" ? "ascending" : "descending"}</span>}
      </Link>
    </th>
  );
}

export type PageInfo = { total: number; page: number; pages: number; perPage: number; offset: number };

export function paginate(total: number, pageParam: string | undefined, perPage = 25): PageInfo {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(pages, Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1));
  return { total, page, pages, perPage, offset: (page - 1) * perPage };
}

export function Pagination({ info, base, params }: { info: PageInfo; base: string; params: Params }) {
  if (info.total === 0) return null;
  const from = info.offset + 1;
  const to = Math.min(info.total, info.offset + info.perPage);
  const nums = [...new Set([1, info.page - 1, info.page, info.page + 1, info.pages])].filter((n) => n >= 1 && n <= info.pages).sort((a, b) => a - b);
  const items: ReactNode[] = [];
  let last = 0;
  for (const n of nums) {
    if (n - last > 1) items.push(<li key={`gap-${n}`}><span className="pager-gap">…</span></li>);
    items.push(
      <li key={n}>
        {n === info.page ? <span aria-current="page">{n}</span> : <Link href={hrefWith(base, params, { page: String(n) })}>{n}</Link>}
      </li>,
    );
    last = n;
  }
  return (
    <nav className="pager" aria-label="Pagination">
      <span className="pager-info">Showing <strong>{from}–{to}</strong> of <strong>{info.total}</strong></span>
      {info.pages > 1 && (
        <ul className="pager-list">
          <li>{info.page > 1 ? <Link href={hrefWith(base, params, { page: String(info.page - 1) })} rel="prev"><Icon name="chevron-left" /><span className="sr-only">Previous page</span></Link> : <span aria-disabled="true"><Icon name="chevron-left" /></span>}</li>
          {items}
          <li>{info.page < info.pages ? <Link href={hrefWith(base, params, { page: String(info.page + 1) })} rel="next"><Icon name="chevron-right" /><span className="sr-only">Next page</span></Link> : <span aria-disabled="true"><Icon name="chevron-right" /></span>}</li>
        </ul>
      )}
    </nav>
  );
}

export function StatCard({ href, label, value, icon, tone, meta, definition }: {
  href?: string; label: string; value: number | string; icon: string; tone?: "gold" | "blue" | "navy" | "danger"; meta?: ReactNode; definition?: string;
}) {
  // The main figure is one link; secondary links in `meta` sit beside it (never nested <a>).
  const head = (
    <>
      <span className="stat-top"><span className="stat-label">{label}</span><span className="stat-icon"><Icon name={icon} /></span></span>
      <span className="stat-value">{value}</span>
    </>
  );
  return (
    <div className={`stat${tone ? ` tone-${tone}` : ""}${href ? " is-link" : ""}`}>
      {href ? <Link className="stat-link" href={href}>{head}<span className="sr-only"> — view list</span></Link> : <span className="stat-link">{head}</span>}
      {meta && <div className="stat-meta">{meta}</div>}
      {definition && <div className="stat-def">{definition}</div>}
    </div>
  );
}

export function DefinitionList({ items }: { items: [ReactNode, ReactNode][] }) {
  return (
    <dl className="dl">
      {items.map(([k, v], i) => (
        <div key={i} style={{ display: "contents" }}>
          <dt>{k}</dt>
          <dd>{v === "" || v === null || v === undefined ? <span className="muted">—</span> : v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Avatar({ name, tone, large }: { name: string; tone?: "green" | "blue"; large?: boolean }) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const text = ((parts[0]?.[0] ?? "?") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  return <span className={`avatar${tone ? ` avatar-${tone}` : ""}${large ? " avatar-lg" : ""}`} aria-hidden="true">{text}</span>;
}

export function FollowUp({ date, open, today }: { date: string | null; open: boolean; today: string }) {
  if (!date) return <span className="muted">—</span>;
  const d = date.slice(0, 10);
  const overdue = open && d < today;
  const isToday = open && d === today;
  const label = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }).format(new Date(d + "T00:00:00Z"));
  return <span className={`pill${overdue ? " pill-alert" : isToday ? " pill-warn" : ""}`}>{overdue ? "Overdue · " : isToday ? "Today · " : ""}{label}</span>;
}

export function whatsappHref(n: string | null | undefined): string | null {
  const d = (n ?? "").replace(/\D+/g, "");
  return d.length >= 7 ? `https://wa.me/${d}` : null;
}

"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const CLOSE_NAV = "hq:close-nav";

/**
 * Mobile navigation drawer toggle (shown at ≤1024px). While open: body.nav-open, the page behind
 * is inert (focus stays in the drawer), focus moves to the first link, and Escape, the backdrop,
 * the drawer's close button or a navigation closes it and returns focus to this button.
 */
export function MenuToggle() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  // Close when the route changes (state is adjusted during render, not in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    const main = document.querySelector<HTMLElement>(".main");
    document.body.classList.toggle("nav-open", open);
    if (main) main.inert = open;
    if (open) {
      (document.querySelector<HTMLElement>('#sidebar .nav a[aria-current="page"]') ?? document.querySelector<HTMLElement>("#sidebar .nav a"))?.focus();
    } else if (wasOpen.current) {
      btnRef.current?.focus();
    }
    wasOpen.current = open;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const backdrop = document.querySelector(".backdrop");
    document.addEventListener("keydown", onKey);
    document.addEventListener(CLOSE_NAV, close);
    backdrop?.addEventListener("click", close);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener(CLOSE_NAV, close);
      backdrop?.removeEventListener("click", close);
    };
  }, [open]);
  // Leaving the mobile breakpoint with the drawer open must not leave the page inert.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1025px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return (
    <button ref={btnRef} className="icon-btn menu-toggle" type="button" aria-controls="sidebar" aria-expanded={open} aria-label="Open navigation menu" onClick={() => setOpen((o) => !o)}>
      <i className="bi bi-list" aria-hidden="true" />
    </button>
  );
}

/**
 * Sidebar header controls. Desktop: collapse to icons / expand (remembered in a cookie so the
 * server renders the same width, no flash). Mobile drawer: a close button inside the drawer.
 */
export function SidebarControls({ collapsed: initial }: { collapsed: boolean }) {
  const [collapsed, setCollapsed] = useState(initial);
  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.querySelector(".app-shell")?.classList.toggle("is-collapsed", next);
    document.cookie = `hq_sidebar=${next ? "collapsed" : "expanded"}; Max-Age=31536000; path=/adminportal; SameSite=Lax`;
  };
  return (
    <>
      <button type="button" className="sidebar-btn sidebar-collapse" aria-controls="sidebar" aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={toggle}>
        <i className={`bi ${collapsed ? "bi-chevron-double-right" : "bi-chevron-double-left"}`} aria-hidden="true" />
      </button>
      <button type="button" className="sidebar-btn sidebar-close" aria-label="Close navigation menu" onClick={() => document.dispatchEvent(new Event(CLOSE_NAV))}>
        <i className="bi bi-x-lg" aria-hidden="true" />
      </button>
    </>
  );
}

/**
 * Secondary list filters. On wide screens they are always shown inline (the toggle is hidden by
 * CSS); on phones they collapse behind a "Filters" toggle so results stay near the top. Starts
 * open when any of these filters is active.
 */
export function MoreFilters({ active, children }: { active: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(active > 0);
  const id = useId();
  return (
    <>
      <button type="button" className="btn btn-secondary filter-more-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <i className="bi bi-sliders" aria-hidden="true" /> {open ? "Hide filters" : "More filters"}{active ? ` (${active} active)` : ""}
      </button>
      <div id={id} className={`filter-more${open ? " is-open" : ""}`}>{children}</div>
    </>
  );
}

/** Shows the one-time flash message set by a Server Action (cookie hq_flash), then clears it. */
export function FlashMessages() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [flash, setFlash] = useState<{ type: string; message: string } | null>(null);
  useEffect(() => {
    const raw = document.cookie.split("; ").find((c) => c.startsWith("hq_flash="));
    if (!raw) return;
    try {
      // Reading and clearing a one-time cookie is a side effect, so it belongs in an effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFlash(JSON.parse(decodeURIComponent(raw.slice("hq_flash=".length))));
    } catch {
      /* ignore malformed */
    }
    document.cookie = "hq_flash=; Max-Age=0; path=/adminportal; SameSite=Lax";
    const t = setTimeout(() => setFlash(null), 8000);
    return () => clearTimeout(t);
  }, [pathname, search]);
  if (!flash) return null;
  const icon = flash.type === "success" ? "check-circle-fill" : flash.type === "error" ? "exclamation-octagon-fill" : "info-circle-fill";
  return (
    <div className="flash-region" aria-live="polite">
      <div className={`alert alert-${flash.type}`} role={flash.type === "error" ? "alert" : "status"}>
        <i className={`bi bi-${icon}`} aria-hidden="true" />
        <p>{flash.message}</p>
        <button className="alert-close" type="button" aria-label="Dismiss message" onClick={() => setFlash(null)}><i className="bi bi-x-lg" aria-hidden="true" /></button>
      </div>
    </div>
  );
}

/** Closes <details> menus when clicking elsewhere or navigating. */
export function MenuCloser() {
  const pathname = usePathname();
  useEffect(() => {
    document.querySelectorAll("details.menu[open]").forEach((d) => d.removeAttribute("open"));
  }, [pathname]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      document.querySelectorAll("details.menu[open]").forEach((d) => {
        if (!d.contains(e.target as Node)) d.removeAttribute("open");
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

/** Filter selects that apply immediately (the form still works with the Apply button without JS). */
export function AutoSubmit({ children }: { children: React.ReactNode }) {
  return (
    <span
      onChange={(e) => {
        const el = e.target as HTMLInputElement;
        if (el.tagName === "SELECT" || el.type === "date") el.form?.requestSubmit();
      }}
      style={{ display: "contents" }}
    >
      {children}
    </span>
  );
}

/** Remembers the list scroll position per URL, so returning from a record lands in the same place. */
export function ScrollMemory() {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    const key = `hq-scroll:${pathname}?${search.toString()}`;
    try {
      const y = sessionStorage.getItem(key);
      if (y) requestAnimationFrame(() => window.scrollTo(0, Number(y)));
    } catch {
      /* storage unavailable */
    }
    const save = () => {
      try {
        sessionStorage.setItem(key, String(window.scrollY));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      save();
      window.removeEventListener("scroll", save);
    };
  }, [pathname, search]);
  return null;
}


/** Stores the current list URL (filters, sort, page) for the module. */
export function RememberList({ module }: { module: string }) {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    try {
      sessionStorage.setItem(`hq-list:${module}`, `${pathname}${search.size ? `?${search}` : ""}`);
    } catch {
      /* ignore */
    }
  }, [module, pathname, search]);
  return null;
}

const noopSubscribe = () => () => {};

/** "Back to list" link that returns to the remembered filtered list, falling back to the plain list. */
export function BackToList({ module, fallback, label }: { module: string; fallback: string; label: string }) {
  // Server render (and first hydration pass) use the plain list; the browser then uses the remembered one.
  const href = useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        const saved = sessionStorage.getItem(`hq-list:${module}`);
        return saved && saved.startsWith(fallback) ? saved : fallback;
      } catch {
        return fallback;
      }
    },
    () => fallback,
  );
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href={href}>
        <i className="bi bi-arrow-left" aria-hidden="true" /> {label}
      </Link>
    </nav>
  );
}

/**
 * Thin progress bar while an in-portal navigation is pending (pages render fully on the server,
 * so this is the visible loading state between pages). Hidden again when the URL changes.
 */
export function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [active, setActive] = useState(false);
  // Hide the bar once the URL has changed.
  const url = `${pathname}?${search}`;
  const [shownFor, setShownFor] = useState(url);
  if (shownFor !== url) {
    setShownFor(url);
    setActive(false);
  }
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith("/adminportal") || url.pathname.includes("/export")) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      setActive(true);
    };
    const onSubmit = (e: SubmitEvent) => {
      const f = e.target as HTMLFormElement;
      if (f.method.toLowerCase() === "get" && !e.defaultPrevented) setActive(true);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
    };
  }, []);
  return <div className={`nav-progress${active ? " is-active" : ""}`} role="progressbar" aria-hidden={!active} aria-label="Loading page" />;
}

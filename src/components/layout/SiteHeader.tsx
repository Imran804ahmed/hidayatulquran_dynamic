"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { HOME_SECTIONS, MAIN_NAV, type NavItem } from "@/config/navigation";
import { SITE } from "@/config/site";
import { useScrolledPast } from "@/hooks/useScrolledPast";
import SiteImage from "@/components/ui/SiteImage";

const MOBILE_BREAKPOINT = 991;

/** Which menu link is "active": by page, or on the home page by the section in view. */
function useActiveHref() {
  const pathname = usePathname();
  const [homeSection, setHomeSection] = useState("/");

  useEffect(() => {
    if (pathname !== "/") return;
    const update = () => {
      const position = window.scrollY + 200;
      let active = "";
      for (const [id, href] of Object.entries(HOME_SECTIONS)) {
        const el = document.getElementById(id);
        if (el && position >= el.offsetTop && position <= el.offsetTop + el.offsetHeight) active = href;
      }
      setHomeSection(active);
    };
    const frame = requestAnimationFrame(update);
    document.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", update);
    };
  }, [pathname]);

  return pathname === "/" ? homeSection : pathname;
}

function MenuItem({ item, activeHref, mobile, onNavigate, depth = 0 }: {
  item: NavItem;
  depth?: number;
  activeHref: string;
  mobile: boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  // Sub-menus only expand inside the mobile drawer.
  const expanded = mobile && open;

  if ("href" in item) {
    return (
      <li>
        <Link href={item.href} className={item.href === activeHref ? "active" : undefined} onClick={onNavigate}>
          {item.label}
        </Link>
      </li>
    );
  }

  // Dropdown: opens on hover on desktop (CSS), on tap/Enter in the mobile drawer.
  const toggle = (e: MouseEvent) => {
    e.preventDefault();
    if (mobile) setOpen((o) => !o);
  };
  return (
    <li className="dropdown">
      <a
        href="#"
        role="button"
        aria-haspopup="true"
        aria-expanded={expanded}
        className={expanded ? "expanded" : undefined}
        onClick={toggle}
      >
        <span>{item.label}</span> <i className={`bi ${depth === 0 ? "bi-chevron-down" : "bi-chevron-right"}`} aria-hidden="true"></i>
      </a>
      <ul className={expanded ? "dropdown-active" : undefined}>
        {item.children.map((child) => (
          <MenuItem key={child.label} item={child} depth={depth + 1} activeHref={activeHref} mobile={mobile} onNavigate={onNavigate} />
        ))}
      </ul>
    </li>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolledPast(100);
  const activeHref = useActiveHref();
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => setMobileOpen(false);

  // Close the drawer when the route changes (including browser back/forward).
  const [drawerPath, setDrawerPath] = useState(pathname);
  if (drawerPath !== pathname) {
    setDrawerPath(pathname);
    setMobileOpen(false);
  }

  // Close on Escape and when resizing to desktop; lock page scroll while open.
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.classList.add("mobile-nav-open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onResize = () => window.innerWidth > MOBILE_BREAKPOINT && close();
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.classList.remove("mobile-nav-open");
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  const toggleButton = (
    <button
      className={`mobile-nav-toggle bi ${mobileOpen ? "bi-x" : "bi-list"}`}
      type="button"
      aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-controls="navbar"
      aria-expanded={mobileOpen}
      onClick={() => setMobileOpen((o) => !o)}
    ></button>
  );

  const nav = (
    <nav
      id="navbar"
      className={mobileOpen ? "navbar navbar-mobile" : "navbar"}
      aria-label="Primary navigation"
      // Tapping the dimmed backdrop (the nav element itself) closes the drawer.
      onClick={(e) => mobileOpen && e.target === e.currentTarget && close()}
    >
      <ul>
        {MAIN_NAV.map((item) => (
          <MenuItem key={item.label} item={item} activeHref={activeHref} mobile={mobileOpen} onNavigate={close} />
        ))}
      </ul>
      {toggleButton}
    </nav>
  );

  return (
    <header id="header" className={scrolled ? "header fixed-top header-scrolled" : "header fixed-top"}>
      <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
        <Link href="/" className="logo d-flex align-items-center" aria-label={`${SITE.name} home`}>
          <SiteImage src={SITE.logo} alt={`${SITE.name} logo`} style={{ width: "auto" }} sizes="48px" />
          <span>{SITE.shortName}</span>
        </Link>
        {/* The open drawer is rendered into <body>: the header's backdrop-filter would otherwise
            become the containing block of the fixed-position drawer. */}
        {mobileOpen ? createPortal(nav, document.body) : nav}
        {pathname !== "/registration" && (
          <Link href="/registration" className="header-register">
            Register Now
          </Link>
        )}
      </div>
    </header>
  );
}

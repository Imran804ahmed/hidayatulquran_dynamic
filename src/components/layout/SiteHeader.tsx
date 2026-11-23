"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MAIN_NAV } from "@/config/navigation";
import { SITE } from "@/config/site";
import SiteImage from "@/components/ui/SiteImage";
import styles from "./SiteHeader.module.css";

/** A course page counts as being "in" Courses for the menu highlight. */
const COURSE_PATHS = ["/courses", "/noorani-qaida-online", "/quran-reading-course-online", "/quran-tajweed-course-online", "/quran-memorization-hifz-online", "/tafseer-quran-course-online", "/quranic-arabic-course-online"];

function isCurrent(href: string, pathname: string) {
  if (href === "/courses") return COURSE_PATHS.includes(pathname);
  return !href.includes("#") && href === pathname;
}

/**
 * Fixed site header. On narrow screens the menu collapses behind a "Menu" disclosure button:
 * the panel opens below the header, Escape closes it and returns focus to the button, and it
 * closes on navigation. "Register" stays visible at every width.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close the menu when the route changes (including browser back/forward).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onResize = () => window.matchMedia("(min-width: 1024px)").matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const onRegistration = pathname.startsWith("/registration");

  return (
    <header className={`hq-chrome ${styles.header}`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label={`${SITE.name}, home`}>
          <SiteImage src={SITE.logo} alt="" className={styles.logo} sizes="44px" loading="eager" />
          <span className={styles.brandName}>
            Hidayatul Quran <span className={styles.brandAcademy}>Academy</span>
          </span>
        </Link>

        <nav aria-label="Main" className={styles.desktopNav}>
          <ul className={styles.navList}>
            {MAIN_NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={styles.navLink} aria-current={isCurrent(l.href, pathname) ? "page" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {!onRegistration && (
            <Link href="/registration" className={`hq-btn hq-btn--primary hq-btn--sm ${styles.register}`}>
              Register
            </Link>
          )}
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className={styles.menuIcon} aria-hidden="true" data-open={open}>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span>{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      <nav id="mobile-menu" aria-label="Main" className={styles.mobileNav} data-open={open}>
        <ul className={styles.mobileList}>
          {MAIN_NAV.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={styles.mobileLink}
                aria-current={isCurrent(l.href, pathname) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.mobileCtas}>
          <Link href="/courses" className="hq-btn hq-btn--secondary hq-btn--block" onClick={() => setOpen(false)}>
            Explore courses
          </Link>
          <Link href="/registration" className="hq-btn hq-btn--primary hq-btn--block" onClick={() => setOpen(false)}>
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}

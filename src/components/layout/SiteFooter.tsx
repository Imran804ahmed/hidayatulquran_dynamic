import Link from "next/link";
import { SITE, SOCIAL_LINKS, WHATSAPP_TRIAL } from "@/config/site";
import { CATALOG } from "@/content/course-catalog";
import SiteImage from "@/components/ui/SiteImage";
import styles from "./SiteFooter.module.css";

const QUICK_LINKS = [
  { label: "All courses", href: "/courses" },
  { label: "Register", href: "/registration" },
  { label: "Fees", href: "/#fees" },
  { label: "How it works", href: "/enrollment-process" },
  { label: "FAQ", href: "/faq" },
  { label: "About us", href: "/about" },
  { label: "Social platforms", href: "/social-platforms" },
];

export default function SiteFooter() {
  return (
    <footer className={`hq-chrome hq-on-dark hq-band ${styles.footer}`}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand} aria-label={`${SITE.name}, home`}>
            <span className={styles.logoWrap}>
              <SiteImage src={SITE.logo} alt="" className={styles.logo} sizes="56px" />
            </span>
            <span className={styles.brandName}>Hidayatul Quran Academy</span>
          </Link>
          <p className={styles.about}>
            Live one-to-one online Quran classes for kids and adults, with certified male and female tutors.
          </p>
          <ul className={styles.social} aria-label="Social media">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.href}>
                <a href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                  <i className={`bi ${s.icon}`} aria-hidden="true"></i>
                </a>
              </li>
            ))}
            <li>
              <a href={WHATSAPP_TRIAL} aria-label="WhatsApp chat" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-whatsapp" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </div>

        <nav aria-labelledby="footer-courses">
          <h2 id="footer-courses" className={styles.heading}>Courses</h2>
          <ul className={styles.list}>
            {CATALOG.map((c) => (
              <li key={c.slug}>
                <Link href={c.path}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-links">
          <h2 id="footer-links" className={styles.heading}>Quick links</h2>
          <ul className={styles.list}>
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={styles.heading}>Contact</h2>
          <ul className={styles.list}>
            <li>
              <a href={`tel:${SITE.phone.pk}`}><i className="bi bi-telephone" aria-hidden="true"></i> +92 336 5398542</a>
            </li>
            <li>
              <a href={`tel:${SITE.phone.uk}`}><i className="bi bi-telephone" aria-hidden="true"></i> +44 7376 282389</a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`}><i className="bi bi-envelope" aria-hidden="true"></i> {SITE.email}</a>
            </li>
            <li>
              <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer"><i className="bi bi-whatsapp" aria-hidden="true"></i> Chat on WhatsApp</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

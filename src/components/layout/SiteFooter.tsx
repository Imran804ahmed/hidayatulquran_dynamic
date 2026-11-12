import Link from "next/link";
import { SITE, SOCIAL_LINKS, WHATSAPP_TRIAL } from "@/config/site";
import styles from "./SiteFooter.module.css";

const COURSES = [
  { label: "Noorani Qaida Online", href: "/noorani-qaida-online" },
  { label: "Quran Reading Course", href: "/quran-reading-course-online" },
  { label: "Quran with Tajweed", href: "/quran-tajweed-course-online" },
  { label: "Quran Memorization (Hifz)", href: "/quran-memorization-hifz-online" },
  { label: "Tafseer e Quran", href: "/tafseer-quran-course-online" },
  { label: "Quranic Arabic Course", href: "/quranic-arabic-course-online" },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Register Now", href: "/registration" },
  { label: "Contact Us", href: "/#contact" },
  { label: "Social Platforms", href: "/social-platforms" },
];

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className={styles.list}>
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href}>{l.label}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function SiteFooter() {
  return (
    <footer id="footer" className={`footer ${styles.footer}`}>
      <div className={styles.main}>
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6">
              <h4 className={styles.heading}>{SITE.shortName}</h4>
              <p className={styles.about}>
                Online Quran Academy offering 1-on-1 live Quran classes with certified male and female tutors worldwide.
              </p>
              <div className={styles.social}>
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.href} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                    <i className={`bi ${s.icon}`}></i>
                  </a>
                ))}
                <a href={WHATSAPP_TRIAL} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-whatsapp"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className={styles.heading}>Our Courses</h4>
              <LinkList links={COURSES} />
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className={styles.heading}>Quick Links</h4>
              <LinkList links={QUICK_LINKS} />
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className={styles.heading}>Contact</h4>
              <p className={styles.contact}>
                <i className="bi bi-telephone"></i>
                <a href={`tel:${SITE.phone.pk}`}>+92 336 5398542</a>
                <br />
                <i className="bi bi-telephone"></i>
                <a href={`tel:${SITE.phone.uk}`}>+44 7376282389</a>
                <br />
                <i className="bi bi-envelope"></i>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} <strong>{SITE.name}</strong>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

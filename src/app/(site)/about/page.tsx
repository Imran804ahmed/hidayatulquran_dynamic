import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import SiteImage from "@/components/ui/SiteImage";
import { SITE, WHATSAPP_TRIAL } from "@/config/site";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  path: "/about",
  title: "About HidayatulQuran Academy — Certified Online Quran Tutors",
  description: "Learn about HidayatulQuran Academy — a trusted online Quran academy with certified male and female tutors offering 1-on-1 live Quran classes for kids and adults worldwide.",
  ogDescription: "Learn about HidayatulQuran Academy — certified male and female Quran tutors offering live 1-on-1 online Quran classes for kids and adults in USA, UK, Canada and worldwide.",
  twitterDescription: "Certified male and female Quran tutors offering live 1-on-1 online Quran classes for kids and adults in USA, UK, Canada and worldwide.",
});

const REASONS = [
  { icon: "bi-patch-check", title: "Certified Quran teachers", text: "Our tutors are Hafiz-e-Quran and Tajweed-certified with years of professional teaching experience." },
  { icon: "bi-person-lines-fill", title: "One-to-one live classes", text: "Personalised 1-on-1 sessions ensure better understanding and faster progress for every student." },
  { icon: "bi-book", title: "Learn Quran with Tajweed", text: "Focus on correct Makharij (pronunciation) and proper Tajweed rules to perfect your recitation." },
  { icon: "bi-people", title: "Courses for all ages", text: "Programs for kids, adults, and new Muslims — Quran reading, Tajweed, Hifz, Tafseer, and Arabic." },
  { icon: "bi-clock", title: "Flexible timings", text: "Classes available across USA, UK, Canada, UAE, and all major time zones — at your convenience." },
  { icon: "bi-graph-up", title: "Progress tracking", text: "Regular assessments, feedback, and monthly reports ensure continuous and measurable improvement." },
];

const VALUES = ["Accessibility", "Quality education", "Patience with every learner", "Global reach"];

export default function Page() {
  return (
    <div className="hq-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About HidayatulQuran Academy",
        "url": "https://www.hidayatulquran.com/about",
        "description": "HidayatulQuran Academy is a certified online Quran academy offering 1-on-1 live Quran classes with qualified male and female tutors for kids and adults in USA, UK, Canada, UAE and worldwide.",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.hidayatulquran.com/" },
            { "@type": "ListItem", "position": 2, "name": "About", "item": "https://www.hidayatulquran.com/about" },
          ],
        },
      }} />
      <main id="main">
        <section className={`hq-section hq-section--sand ${styles.head}`} aria-labelledby="page-heading">
          <div className="hq-container hq-enter">
            <nav aria-label="Breadcrumb" className="hq-breadcrumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li aria-current="page">About</li>
              </ol>
            </nav>
            <p className="hq-eyebrow">About us</p>
            <h1 id="page-heading" className="hq-h1">About Hidayatul Quran Academy</h1>
            <p className={`hq-lead ${styles.lead}`}>
              Connecting students worldwide with certified, experienced Quran tutors — one class at a time.
            </p>
          </div>
        </section>

        <section className="hq-section" aria-labelledby="story-heading">
          <div className={`hq-container ${styles.story}`}>
            <div>
              <p className="hq-eyebrow">Who we are</p>
              <h2 id="story-heading" className="hq-h2">A Quran teacher for every student</h2>
              <p className={styles.para}>
                <strong>Hidayatul Quran Academy</strong> is a trusted <strong>online Quran academy</strong> for students
                around the world. Whether you need a <strong>Quran teacher online</strong> for your child or want to{" "}
                <strong>learn Quran with Tajweed</strong> yourself, we offer structured programs from the comfort of your home.
              </p>
              <p className={styles.para}>
                Complete beginners start from the basics, while experienced readers polish their recitation — each student
                progressing at their own pace towards fluent, confident reading of the Holy Quran.
              </p>
              <div className={`hq-btn-row ${styles.ctas}`}>
                <Link href="/registration" className="hq-btn hq-btn--primary">Register for a free trial</Link>
                <Link href="/courses" className="hq-btn hq-btn--secondary">Explore courses</Link>
              </div>
              <p className={styles.alt}>
                Prefer to talk first?{" "}
                <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer">
                  Message us on WhatsApp<span className="hq-visually-hidden"> (opens in a new tab)</span>
                </a>
              </p>
            </div>
            <figure className={styles.logoFigure}>
              <SiteImage src={SITE.logo} alt="Hidayatul Quran Academy logo" className={styles.logo} sizes="(max-width: 900px) 240px, 340px" />
              <figcaption className={styles.caption}>
                <span className={styles.captionName}>Hidayatul Quran Academy</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="hq-section hq-section--sand" aria-labelledby="why-heading">
          <div className="hq-container">
            <Reveal className="hq-section-head">
              <p className="hq-eyebrow">Our advantages</p>
              <h2 id="why-heading" className="hq-h2">Why students choose us</h2>
              <p className="hq-lead">
                Six things every family can expect from their very first class.
              </p>
            </Reveal>
            <RevealGroup className={styles.reasons}>
              {REASONS.map((r) => (
                <li key={r.title} className={styles.reason}>
                  <span className={styles.icon} aria-hidden="true"><i className={`bi ${r.icon}`}></i></span>
                  <h3 className={styles.reasonTitle}>{r.title}</h3>
                  <p className={styles.reasonText}>{r.text}</p>
                </li>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section className="hq-section hq-section--dark hq-band" aria-labelledby="mission-heading">
          <Reveal className={`hq-container ${styles.mission}`}>
            <p className="hq-eyebrow">Our purpose</p>
            <h2 id="mission-heading" className="hq-h2">Our mission</h2>
            <p className={`hq-lead ${styles.missionText}`}>
              To make <strong className={styles.highlight}>Quran learning online</strong> accessible, easy and effective
              for everyone — helping every Muslim understand the Holy Quran, recite it correctly and build a lasting
              connection with the Book of Allah.
            </p>
            <ul className={styles.values} aria-label="Our values">
              {VALUES.map((v) => (
                <li key={v}><i className="bi bi-check2" aria-hidden="true"></i> {v}</li>
              ))}
            </ul>
            <div className={`hq-btn-row ${styles.missionCtas}`}>
              <Link href="/registration" className="hq-btn hq-btn--gold">Register now</Link>
              <Link href="/courses" className="hq-btn hq-btn--ghost-light">Explore courses</Link>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}

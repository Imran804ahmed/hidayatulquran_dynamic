import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { countryLanguages } from "@/content/country-hreflang";
import JsonLd from "@/components/seo/JsonLd";
import SiteImage from "@/components/ui/SiteImage";
import CourseCard from "@/components/course/CourseCard";
import ClassFormat from "@/components/course/ClassFormat";
import NextSteps from "@/components/course/NextSteps";
import PricingTable from "@/components/home/PricingTable";
import EnvironmentGallery from "@/components/home/EnvironmentGallery";
import FaqSection from "@/components/home/sections/FaqSection";
import TestimonialsSection from "@/components/home/sections/TestimonialsSection";
import PaymentsSection from "@/components/home/sections/PaymentsSection";
import ContactSection from "@/components/home/sections/ContactSection";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { CATALOG } from "@/content/course-catalog";
import { SITE, WHATSAPP_TRIAL } from "@/config/site";
import { faqSchema, organizationSchema, websiteSchema } from "@/content/home-schema";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  path: "/",
  title: "Online Quran Classes for Kids and Adults | HidayatulQuran Academy",
  description: "Join live 1-on-1 online Quran classes with certified male and female tutors. Tajweed, Hifz, Noorani Qaida and more for kids and adults in USA, UK, Canada and worldwide. Book a free trial today!",
  keywords: "HidayatulQuran, online Quran academy, online Quran classes, learn Quran online, Quran with Tajweed, Noorani Qaida, Quran reading course, Quran memorization, Tafseer course, Quranic Arabic, Islamic studies, Quran tutor for kids, female Quran teacher, one to one Quran classes",
  ogDescription: "Join live 1-on-1 online Quran classes with certified male and female tutors. Tajweed, Hifz, Noorani Qaida for kids and adults in USA, UK, Canada. Free trial!",
  twitterDescription: "Join live 1-on-1 online Quran classes. Tajweed, Hifz, Noorani Qaida for kids and adults in USA, UK, Canada. Book a free trial class today!",
  locale: "en_US",
  // The homepage is the x-default of the country cluster, so it lists the same set as every country page.
  languages: countryLanguages("/"),
});

const AUDIENCE = [
  { icon: "bi-emoji-smile", label: "Children", text: "Patient tutors and step-by-step lessons from the first letters." },
  { icon: "bi-person", label: "Adults", text: "Beginners and advanced learners, at times that fit work and family." },
  { icon: "bi-heart", label: "New Muslims", text: "A welcoming start to reading the Quran from scratch." },
];

const COUNTRIES: [string, string][] = [
  ["UK", "/online-quran-classes-uk"],
  ["USA", "/online-quran-classes-usa"],
  ["Canada", "/online-quran-classes-canada"],
  ["UAE", "/online-quran-classes-uae"],
  ["Saudi Arabia", "/online-quran-classes-saudi-arabia"],
  ["Australia", "/online-quran-classes-australia"],
  ["Qatar", "/online-quran-classes-qatar"],
  ["Pakistan", "/online-quran-classes-pakistan"],
  ["India", "/online-quran-classes-india"],
  ["Germany", "/online-quran-classes-germany"],
  ["France", "/online-quran-classes-france"],
  ["Russia", "/online-quran-classes-russia"],
  ["Brazil", "/online-quran-classes-brazil"],
  ["South Africa", "/online-quran-classes-south-africa"],
];

export default function HomePage() {
  return (
    <div className={`hq-page ${styles.page}`}>
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={websiteSchema} />
      <main id="main">
        {/* Hero */}
        <section className={`hq-section hq-section--sand ${styles.hero}`} aria-labelledby="hero-heading">
          <div className={`hq-container ${styles.heroGrid}`}>
            <div className="hq-enter">
              <p className="hq-eyebrow">Hidayatul Quran Academy</p>
              <h1 id="hero-heading" className="hq-h1">Online Quran classes &amp; courses for kids and adults</h1>
              <p className={`hq-lead ${styles.heroLead}`}>
                Live one-to-one lessons with certified male and female tutors — from the first Arabic letters to Tajweed,
                Hifz, Tafseer and Quranic Arabic. Start with a free trial class.
              </p>
              <div className={`hq-btn-row ${styles.heroCtas}`}>
                <Link href="/courses" className="hq-btn hq-btn--primary">
                  Explore courses <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </Link>
                <Link href="/registration" className="hq-btn hq-btn--secondary">
                  Register for a free trial
                </Link>
              </div>
              <p className={styles.heroAlt}>
                Prefer to talk first?{" "}
                <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer">
                  Message us on WhatsApp<span className="hq-visually-hidden"> (opens in a new tab)</span>
                </a>
              </p>
              <ul className={styles.trust}>
                <li><i className="bi bi-check2-circle" aria-hidden="true"></i> Free trial class</li>
                <li><i className="bi bi-check2-circle" aria-hidden="true"></i> One-to-one live lessons</li>
                <li><i className="bi bi-check2-circle" aria-hidden="true"></i> Times for every time zone</li>
              </ul>
            </div>
            <div className={styles.heroArt} aria-hidden="true">
              <div className={`hq-enter-art ${styles.medallion}`}>
                <SiteImage src={SITE.logo} alt="" className={styles.heroLogo} fetchPriority="high" loading="eager" sizes="(max-width: 900px) 240px, 360px" />
              </div>
            </div>
          </div>
        </section>

        {/* Who we teach */}
        <section className={`hq-section ${styles.audience}`} aria-labelledby="audience-heading">
          <div className="hq-container">
            <Reveal className="hq-section-head">
              <p className="hq-eyebrow">Who we teach</p>
              <h2 id="audience-heading" className="hq-h2">Quran learning for every age and level</h2>
              <p className="hq-lead">
                Anyone can join — children, adults, beginners and advanced learners — wherever they live.
              </p>
            </Reveal>
            <RevealGroup className={styles.audienceList}>
              {AUDIENCE.map((a) => (
                <li key={a.label} className={styles.audienceItem}>
                  <div className={styles.audienceBody}>
                    <span className={styles.audienceIcon} aria-hidden="true">
                      <i className={`bi ${a.icon}`}></i>
                    </span>
                    <h3 className={styles.audienceTitle}>{a.label}</h3>
                    <span className={styles.audienceRule} aria-hidden="true"></span>
                    <p className={styles.audienceText}>{a.text}</p>
                  </div>
                </li>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* Courses */}
        <section id="QuranCourses" className="hq-section hq-section--surface" aria-labelledby="courses-heading">
          <div className="hq-container">
            <Reveal className={styles.headRow}>
              <div className="hq-section-head">
                <p className="hq-eyebrow">Our courses</p>
                <h2 id="courses-heading" className="hq-h2">Find the right course</h2>
                <p className="hq-lead">Six courses that take students from the Arabic alphabet to understanding the Quran.</p>
              </div>
              <Link href="/courses" className="hq-btn hq-btn--secondary">
                Compare all courses
              </Link>
            </Reveal>
            <RevealGroup className={`hq-grid hq-grid--cards ${styles.cardList}`}>
              {CATALOG.map((c) => (
                <li key={c.slug}>
                  <CourseCard course={c} />
                </li>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* How classes work */}
        <section id="OurTeachingMethod" className="hq-section" aria-labelledby="format-heading">
          <div className="hq-container">
            <Reveal id="features" className="hq-section-head">
              <p className="hq-eyebrow">How classes work</p>
              <h2 id="format-heading" className="hq-h2">Personal lessons, wherever you are</h2>
            </Reveal>
            <ClassFormat />
          </div>
        </section>

        <EnvironmentGallery />

        {/* Getting started */}
        <section className="hq-section" aria-labelledby="start-heading">
          <div className="hq-container">
            <Reveal className="hq-section-head">
              <p className="hq-eyebrow">Getting started</p>
              <h2 id="start-heading" className="hq-h2">Three simple steps</h2>
            </Reveal>
            <NextSteps />
            <div className={`hq-btn-row ${styles.startCtas}`}>
              <Link href="/registration" className="hq-btn hq-btn--primary">Register for a free trial</Link>
              <Link href="/enrollment-process" className="hq-link">More about enrolment</Link>
            </div>
          </div>
        </section>

        {/* Fees */}
        <section id="fees" className="hq-section" aria-labelledby="fees-heading">
          <span id="MonthlyFee" className={styles.legacyAnchor}></span>
          <div className="hq-container">
            <Reveal className="hq-section-head">
              <p className="hq-eyebrow">Fees</p>
              <h2 id="fees-heading" className="hq-h2">Monthly plans</h2>
              <p className="hq-lead">The same plans apply to every course. Choose your country to see fees in your currency.</p>
            </Reveal>
            <PricingTable />
          </div>
        </section>

        {/* Countries */}
        <section className="hq-section hq-section--surface" aria-labelledby="countries-heading">
          <div className="hq-container">
            <Reveal className="hq-section-head">
              <p className="hq-eyebrow">Worldwide</p>
              <h2 id="countries-heading" className="hq-h2">Online Quran classes in your country</h2>
            </Reveal>
            <Reveal>
            <ul className={styles.countryList}>
              {COUNTRIES.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className={styles.countryLink}>{label}</Link>
                </li>
              ))}
            </ul>
            </Reveal>
          </div>
        </section>

        <div className={styles.legacy}>
          <FaqSection />
          <TestimonialsSection />
          <PaymentsSection />
          <ContactSection />
        </div>

        {/* Closing call to action */}
        <section className="hq-section hq-section--dark hq-band" aria-labelledby="cta-heading">
          <Reveal className={`hq-container ${styles.cta}`}>
            <h2 id="cta-heading" className="hq-h2">Ready to begin?</h2>
            <p className="hq-lead">Register in a few minutes. Our team will arrange your free trial class.</p>
            <div className={`hq-btn-row ${styles.ctaButtons}`}>
              <Link href="/registration" className="hq-btn hq-btn--gold">Register now</Link>
              <Link href="/courses" className="hq-btn hq-btn--ghost-light">Explore courses</Link>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}

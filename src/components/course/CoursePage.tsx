import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import ClassFormat from "@/components/course/ClassFormat";
import NextSteps from "@/components/course/NextSteps";
import CourseCard from "@/components/course/CourseCard";
import SiteImage from "@/components/ui/SiteImage";
import { SITE, WHATSAPP_TRIAL, absoluteUrl } from "@/config/site";
import { CATALOG, registerHref } from "@/content/course-catalog";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import type { CourseContent } from "./types";
import { RevealGroup } from "@/components/motion/Reveal";
import styles from "./CoursePage.module.css";

export function courseMetadata(course: CourseContent): Metadata {
  return pageMetadata({
    path: course.path,
    title: course.title,
    description: course.description,
    keywords: course.keywords,
    ogTitle: course.ogTitle,
    ogDescription: course.ogDescription,
    image: course.image,
  });
}

/** Template for the six course detail pages. Copy comes from src/content/courses.tsx. */
export default function CoursePage({ course }: { course: CourseContent }) {
  const entry = CATALOG.find((c) => c.path === course.path);
  if (!entry) throw new Error(`Course ${course.path} is missing from src/content/course-catalog.ts`);
  const register = registerHref(entry.slug);
  const others = CATALOG.filter((c) => c.slug !== entry.slug).slice(0, 3);

  return (
    <div className="hq-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: course.schema.name,
          description: course.schema.description,
          provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
          courseMode: "online",
          educationalLevel: course.schema.educationalLevel,
          inLanguage: ["en", "ur", "ar"],
          url: absoluteUrl(course.path),
          image: absoluteUrl(course.image),
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Courses", path: "/courses" },
          { name: course.schema.breadcrumb, path: course.path },
        ])}
      />
      <main id="main">
        <section className={`hq-section hq-section--sand ${styles.hero}`} aria-labelledby="course-heading">
          <div className={`hq-container ${styles.heroGrid}`}>
            <div className="hq-enter">
              <nav aria-label="Breadcrumb" className="hq-breadcrumb">
                <ol>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/courses">Courses</Link></li>
                  <li aria-current="page">{entry.name}</li>
                </ol>
              </nav>
              <p className={styles.badges}>
                <span className="hq-badge">{entry.level}</span>
                <span className="hq-badge hq-badge--gold">Free trial class</span>
              </p>
              <h1 id="course-heading" className="hq-h1">{course.name}</h1>
              <p className={`hq-lead ${styles.lead}`}>{entry.summary}</p>
              <div className={`hq-btn-row ${styles.ctas}`}>
                <Link href={register} className="hq-btn hq-btn--primary">
                  Register for {entry.shortName}
                </Link>
                <a href="#how-classes-work" className="hq-btn hq-btn--secondary">How classes work</a>
              </div>
            </div>
            <div className={`hq-enter-art ${styles.media}`}>
              <SiteImage src={course.image} alt={course.imageAlt} className={styles.image} loading="eager" sizes="(max-width: 900px) 100vw, 520px" />
            </div>
          </div>
        </section>

        <div className={`hq-container ${styles.layout}`}>
          <div className={styles.content}>
            <section aria-labelledby="about-heading" className={styles.block}>
              <h2 id="about-heading" className="hq-h2">{course.introHeading}</h2>
              {course.intro.map((p, i) => (
                <p key={i} className={styles.para}>{p}</p>
              ))}
            </section>

            <section aria-labelledby="for-heading" className={styles.block}>
              <h2 id="for-heading" className="hq-h2">Who this course is for</h2>
              <ul className={`hq-checklist ${styles.list}`}>
                {course.audience.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>

            <section aria-labelledby="learn-heading" className={styles.block}>
              <h2 id="learn-heading" className="hq-h2">{course.learnHeading}</h2>
              <ul className={`hq-checklist ${styles.list} ${styles.learn}`}>
                {course.learn.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>

            <section aria-labelledby="free-heading" className={`${styles.block} ${styles.freeBox}`}>
              <h2 id="free-heading" className="hq-h3">Choose one free course with your lessons</h2>
              <ul className={styles.freeList}>
                {entry.freeCourses.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </section>

            <section id="how-classes-work" aria-labelledby="format-heading" className={styles.block}>
              <h2 id="format-heading" className="hq-h2">How classes work</h2>
              <ClassFormat />
            </section>

            <section aria-labelledby="fees-heading" className={styles.block}>
              <h2 id="fees-heading" className="hq-h2">Fees and schedule</h2>
              <p className={styles.para}>
                Fees are monthly and the same for every course: plans of 3, 4 or 5 classes a week. Registration is free.
                You choose your preferred days and class time when you register, in your own time zone.
              </p>
              <p className={styles.para}>
                <Link href="/#fees" className="hq-link">See monthly fees for your country</Link>
              </p>
            </section>

            <section aria-labelledby="steps-heading" className={styles.block}>
              <h2 id="steps-heading" className="hq-h2">How to join</h2>
              <NextSteps />
            </section>
          </div>

          <aside className={styles.aside} aria-labelledby="summary-heading">
            <div className={styles.summary}>
              <h2 id="summary-heading" className={styles.summaryTitle}>{entry.name}</h2>
              <dl className={styles.facts}>
                <div><dt>Level</dt><dd>{entry.level}</dd></div>
                <div><dt>Format</dt><dd>Live one-to-one online classes</dd></div>
                <div><dt>Tutors</dt><dd>Certified male and female tutors</dd></div>
                <div><dt>Schedule</dt><dd>3, 4 or 5 days a week, at a time you choose</dd></div>
                <div><dt>Start</dt><dd>Free trial class, no payment required</dd></div>
              </dl>
              <Link href={register} className="hq-btn hq-btn--primary hq-btn--block">
                Register for {entry.shortName}
              </Link>
              <p className={styles.summaryAlt}>
                Questions first?{" "}
                <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer">
                  Ask on WhatsApp<span className="hq-visually-hidden"> (opens in a new tab)</span>
                </a>
              </p>
            </div>
          </aside>
        </div>

        <section className="hq-section hq-section--surface" aria-labelledby="other-heading">
          <div className="hq-container">
            <div className={styles.otherHead}>
              <h2 id="other-heading" className="hq-h2">Other courses</h2>
              <Link href="/courses" className="hq-link">View all courses</Link>
            </div>
            <RevealGroup className={`hq-grid hq-grid--cards ${styles.otherList}`}>
              {others.map((c) => (
                <li key={c.slug}>
                  <CourseCard course={c} />
                </li>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section className="hq-section hq-section--dark hq-band" aria-labelledby="final-heading">
          <div className={`hq-container ${styles.final}`}>
            <h2 id="final-heading" className="hq-h2">Start {entry.name} with a free trial class</h2>
            <p className="hq-lead">Register in a few minutes. Our team will contact you on WhatsApp or email to arrange it.</p>
            <div className={`hq-btn-row ${styles.finalButtons}`}>
              <Link href={register} className="hq-btn hq-btn--gold">Register for {entry.shortName}</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

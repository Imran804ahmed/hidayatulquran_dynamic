import Link from "next/link";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import CourseCard from "@/components/course/CourseCard";
import { CATALOG, COURSE_BY_SLUG } from "@/content/course-catalog";
import { SITE, absoluteUrl } from "@/config/site";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  path: "/courses",
  title: "Online Quran Courses for Kids and Adults | HidayatulQuran Academy",
  description: "Compare our online Quran courses: Noorani Qaida, Quran Reading, Tajweed, Hifz, Tafseer and Quranic Arabic. Live 1-on-1 classes with certified tutors. Free trial class.",
  ogDescription: "Noorani Qaida, Quran Reading, Tajweed, Hifz, Tafseer and Quranic Arabic — live 1-on-1 online classes. Free trial class.",
});

/** Learning path, from each course page's "Who is this course for?" (which course follows which). */
const PATH = [
  { slug: "noorani-qaida", note: "Start here if the student cannot yet read Arabic letters." },
  { slug: "quran-reading", note: "For students who have completed Noorani Qaida." },
  { slug: "quran-tajweed", note: "For students who can read the Quran and want correct recitation." },
  { slug: "quran-memorization", note: "For students who have completed Quran reading with Tajweed." },
] as const;

const UNDERSTANDING = ["tafseer-quran", "quranic-arabic"] as const;

export default function CoursesPage() {
  return (
    <div className="hq-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Online Quran courses",
          itemListElement: CATALOG.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Course",
              name: c.name,
              description: c.summary,
              url: absoluteUrl(c.path),
              provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
            },
          })),
        }}
      />
      <JsonLd data={breadcrumbSchema([{ name: "Courses", path: "/courses" }])} />
      <main id="main">
        <section className="hq-section hq-section--sand" aria-labelledby="page-heading">
          <div className="hq-container hq-enter">
            <nav aria-label="Breadcrumb" className="hq-breadcrumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li aria-current="page">Courses</li>
              </ol>
            </nav>
            <h1 id="page-heading" className="hq-h1">Online Quran courses</h1>
            <p className={`hq-lead ${styles.lead}`}>
              Every course is taught live and one-to-one by a certified tutor, for children and adults. Compare the courses
              below, open one for details, or register and we will help you choose during your free trial class.
            </p>
          </div>
        </section>

        <section className="hq-section" aria-labelledby="all-heading">
          <div className="hq-container">
            <h2 id="all-heading" className="hq-visually-hidden">All courses</h2>
            <RevealGroup className={`hq-grid hq-grid--cards ${styles.list}`}>
              {CATALOG.map((c) => (
                <li key={c.slug}>
                  <CourseCard course={c} showRegister />
                </li>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section className="hq-section hq-section--surface" aria-labelledby="path-heading">
          <Reveal className={`hq-container ${styles.pathGrid}`}>
            <div>
              <p className="hq-eyebrow">Not sure where to start?</p>
              <h2 id="path-heading" className="hq-h2">Reading and reciting</h2>
              <ol className={styles.path}>
                {PATH.map((p) => {
                  const c = COURSE_BY_SLUG[p.slug];
                  return (
                    <li key={p.slug}>
                      <Link href={c.path} className={styles.pathLink}>{c.name}</Link>
                      <span className={styles.pathNote}>{p.note}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div>
              <h2 className="hq-h2">Understanding the Quran</h2>
              <ul className={styles.path}>
                {UNDERSTANDING.map((slug) => {
                  const c = COURSE_BY_SLUG[slug];
                  return (
                    <li key={slug}>
                      <Link href={c.path} className={styles.pathLink}>{c.name}</Link>
                      <span className={styles.pathNote}>{c.suits}.</span>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.helpBox}>
                <p>
                  <strong>Still unsure?</strong> Choose the course closest to the student&apos;s level when you register. The tutor
                  checks the student&apos;s level in the free trial class.
                </p>
                <Link href="/registration" className="hq-btn hq-btn--primary">Register for a free trial</Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}

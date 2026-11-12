import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import CourseLinks from "@/components/course/CourseLinks";
import EnrollCta from "@/components/course/EnrollCta";
import { SITE, WHATSAPP_TRIAL, absoluteUrl } from "@/config/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import type { CourseContent } from "./types";
import styles from "./CoursePage.module.css";
import SiteImage from "@/components/ui/SiteImage";

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

/** Template for the six course landing pages. */
export default function CoursePage({ course }: { course: CourseContent }) {
  return (
    <>
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
          { name: "Courses", path: "/#QuranCourses" },
          { name: course.schema.breadcrumb, path: course.path },
        ])}
      />
      <main id="main">
        <section className={`breadcrumbs ${styles.breadcrumbs}`}>
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/#QuranCourses">Courses</Link></li>
              <li>{course.breadcrumb}</li>
            </ol>
            <h1><strong>{course.name}</strong></h1>
          </div>
        </section>
        <section id="course-detail" className={`about ${styles.detail}`}>
          <div className="container" data-aos="fade-up">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <SiteImage src={course.image} className={`img-fluid ${styles.image}`} alt={course.imageAlt} loading="eager" sizes="(max-width: 992px) 100vw, 50vw" />
              </div>
              <div className="col-lg-6">
                <h2>{course.introHeading}</h2>
                {course.intro.map((p, i) => (
                  <p key={i} className={i === 0 ? styles.lead : undefined}>{p}</p>
                ))}
                <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer" className="cta-btn-trial">
                  <i className={`bi bi-whatsapp ${styles.trialIcon}`}></i> <span>Book Free Trial Class</span>
                </a>
              </div>
            </div>
            <div className="row mt-5" data-aos="fade-up">
              <div className="col-lg-6">
                <h2>{course.learnHeading}</h2>
                <ul>
                  {course.learn.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="col-lg-6">
                <h2>Who Is This Course For?</h2>
                <ul>
                  {course.audience.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
            <div className="row mt-5" data-aos="fade-up">
              <div className="col-12">
                <EnrollCta />
              </div>
            </div>
            <div className="row mt-5" data-aos="fade-up">
              <div className="col-12">
                <CourseLinks />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

import Link from "next/link";
import SiteImage from "@/components/ui/SiteImage";
import { registerHref, type CatalogCourse } from "@/content/course-catalog";
import styles from "./CourseCard.module.css";

/**
 * Course card used on the home page, the course listing and "Other courses". The title is the
 * main link (its clickable area covers the card); the optional Register link preselects this
 * course. The artwork sits in the same gold frame as the Environment gallery.
 */
export default function CourseCard({
  course,
  headingLevel = 3,
  showRegister = false,
}: {
  course: CatalogCourse;
  headingLevel?: 2 | 3;
  showRegister?: boolean;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={styles.card}>
      <div className={styles.frame}>
        <div className={styles.media}>
          <SiteImage src={course.image} alt="" className={styles.image} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 380px" />
        </div>
        <p className={styles.level}>
          <i className="bi bi-bar-chart-fill" aria-hidden="true"></i>
          <span className="hq-visually-hidden">Level: </span>
          {course.level}
        </p>
      </div>
      <div className={styles.body}>
        <Heading className={styles.title}>
          <Link href={course.path} className={styles.titleLink}>
            {course.name}
          </Link>
        </Heading>
        <span className={styles.rule} aria-hidden="true"></span>
        <p className={styles.summary}>{course.summary}</p>
        <dl className={styles.meta}>
          <div>
            <dt>
              <span className={styles.metaIcon} aria-hidden="true"><i className="bi bi-people"></i></span>
              Suits
            </dt>
            <dd>{course.suits}</dd>
          </div>
          <div>
            <dt>
              <span className={styles.metaIcon} aria-hidden="true"><i className="bi bi-camera-video"></i></span>
              Format
            </dt>
            <dd>Live one-to-one online classes</dd>
          </div>
        </dl>
        <div className={styles.actions}>
          <span className={styles.more} aria-hidden="true">
            View course
            <span className={styles.moreIcon}><i className="bi bi-arrow-right"></i></span>
          </span>
          {showRegister && (
            <Link href={registerHref(course.slug)} className={`hq-btn hq-btn--primary hq-btn--sm ${styles.register}`}>
              Register<span className="hq-visually-hidden"> for {course.name}</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

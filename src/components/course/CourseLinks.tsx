import Link from "next/link";
import { COURSE_LINKS } from "@/config/navigation";
import styles from "./CourseLinks.module.css";

/** Grid of links to all six course pages. */
export default function CourseLinks() {
  return (
    <>
      <h2 className={styles.heading}>Explore Our Online Quran Courses</h2>
      <div className="row gy-3">
        {COURSE_LINKS.map((c) => (
          <div key={c.href} className="col-lg-4 col-md-6">
            <Link href={c.href} className="course-name-link">
              <i className="bi bi-book"></i> {c.label}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

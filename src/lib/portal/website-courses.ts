import "server-only";
import * as db from "@/lib/portal/db";

/**
 * Every course offered on the public website. The portal makes sure each one exists in
 * hq_courses, so they are always available by default for enrolments, filters and reports.
 * When a new course page is added to the website, add it here as well.
 *
 * Rows are matched by slug (and the unique course name), and existing rows are never changed:
 * an admin's edits — renaming, editing the summary, marking a course inactive — are kept.
 */
export const WEBSITE_COURSES = [
  { slug: "noorani-qaida", name: "Noorani Qaida", summary: "Arabic letters, pronunciation and joining rules as a foundation for Quran reading.", public_url: "/noorani-qaida-online" },
  { slug: "quran-reading", name: "Quran Reading Course", summary: "Fluent, correct reading from words to complete verses.", public_url: "/quran-reading-course-online" },
  { slug: "quran-tajweed", name: "Quran with Tajweed", summary: "Tajweed rules such as Ghunna, Qalqalah, Ikhfa, Idgham and Madd.", public_url: "/quran-tajweed-course-online" },
  { slug: "quran-memorization", name: "Quran Memorization", summary: "Structured Hifz with daily lessons and revision cycles.", public_url: "/quran-memorization-hifz-online" },
  { slug: "tafseer-quran", name: "Tafseer e Quran Course", summary: "Meaning and explanation of the Quran.", public_url: "/tafseer-quran-course-online" },
  { slug: "quranic-arabic", name: "Quranic Arabic Course", summary: "Arabic language for understanding the Quran.", public_url: "/quranic-arabic-course-online" },
] as const;

const g = globalThis as unknown as { hqWebsiteCourses?: Promise<void> };

async function sync() {
  const now = db.nowUtc();
  const placeholders = WEBSITE_COURSES.map(() => "(?, ?, ?, ?, 'active', ?, ?, ?)").join(", ");
  const params = WEBSITE_COURSES.flatMap((c, i) => [c.name, c.slug, c.summary, c.public_url, i + 1, now, now]);
  // INSERT IGNORE skips rows whose slug or name already exists, so admin edits are preserved.
  await db.exec(`INSERT IGNORE INTO hq_courses (name, slug, summary, public_url, status, sort_order, created_at, updated_at) VALUES ${placeholders}`, params);
}

/** Adds any missing website course to hq_courses. Runs once per server process. */
export function ensureWebsiteCourses(): Promise<void> {
  g.hqWebsiteCourses ??= sync().catch((err) => {
    g.hqWebsiteCourses = undefined; // retry on the next request
    console.error("Could not sync website courses into hq_courses:", err);
  });
  return g.hqWebsiteCourses;
}

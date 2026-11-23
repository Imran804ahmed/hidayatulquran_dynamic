export type NavLink = { label: string; href: string };

/**
 * Main menu of the public website, organised around what families come to do: choose a course,
 * check fees, see how enrolment works, get answers, or get in touch. "Register" is a separate,
 * always-visible button in the header.
 */
export const MAIN_NAV: NavLink[] = [
  { label: "Courses", href: "/courses" },
  { label: "Fees", href: "/#fees" },
  { label: "How it works", href: "/enrollment-process" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

/** Course page links (country pages' course list and footer). Kept in course-catalog order. */
export const COURSE_LINKS: NavLink[] = [
  { label: "Noorani Qaida Online", href: "/noorani-qaida-online" },
  { label: "Quran Reading Course Online", href: "/quran-reading-course-online" },
  { label: "Quran with Tajweed Online", href: "/quran-tajweed-course-online" },
  { label: "Quran Memorization (Hifz)", href: "/quran-memorization-hifz-online" },
  { label: "Tafseer e Quran Course", href: "/tafseer-quran-course-online" },
  { label: "Quranic Arabic Course", href: "/quranic-arabic-course-online" },
];

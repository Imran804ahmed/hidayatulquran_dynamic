export type NavLink = { label: string; href: string };
export type NavItem = NavLink | { label: string; children: NavItem[] };

/**
 * Main menu of the public website, organised around what visitors come to do: choose a course,
 * check fees, see how enrolment works, get answers, or get in touch. At most two levels deep.
 */
export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Courses",
    children: [
      { label: "All Courses", href: "/#QuranCourses" },
      { label: "Noorani Qaida", href: "/noorani-qaida-online" },
      { label: "Quran Reading", href: "/quran-reading-course-online" },
      { label: "Quran with Tajweed", href: "/quran-tajweed-course-online" },
      { label: "Quran Memorization (Hifz)", href: "/quran-memorization-hifz-online" },
      { label: "Tafseer e Quran", href: "/tafseer-quran-course-online" },
      { label: "Quranic Arabic", href: "/quranic-arabic-course-online" },
    ],
  },
  { label: "Fees", href: "/#MonthlyFee" },
  { label: "How to Enroll", href: "/enrollment-process" },
  { label: "FAQ", href: "/faq" },
  {
    label: "About",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Why Choose Us", href: "/#features" },
      { label: "Our Teaching Method", href: "/#OurTeachingMethod" },
      { label: "Empowering Students", href: "/empowering-through-quranic-learning" },
      { label: "Social Platforms", href: "/social-platforms" },
    ],
  },
  { label: "Contact", href: "/#contact" },
];

/** Sections of the home page that the menu highlights while scrolling ("scroll spy"). */
export const HOME_SECTIONS: Record<string, string> = {
  hero: "/",
  QuranCourses: "/#QuranCourses",
  MonthlyFee: "/#MonthlyFee",
  contact: "/#contact",
};

export const COURSE_LINKS: NavLink[] = [
  { label: "Noorani Qaida Online", href: "/noorani-qaida-online" },
  { label: "Quran Reading Course Online", href: "/quran-reading-course-online" },
  { label: "Quran with Tajweed Online", href: "/quran-tajweed-course-online" },
  { label: "Quran Memorization (Hifz)", href: "/quran-memorization-hifz-online" },
  { label: "Tafseer e Quran Course", href: "/tafseer-quran-course-online" },
  { label: "Quranic Arabic Course", href: "/quranic-arabic-course-online" },
];

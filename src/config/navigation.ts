export type NavLink = { label: string; href: string };
export type NavItem = NavLink | { label: string; children: NavItem[] };

/** Main menu of the public website. */
export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/#QuranCourses" },
  { label: "Monthly Fee", href: "/#MonthlyFee" },
  {
    label: "Services",
    children: [
      { label: "Enrollment Process", href: "/enrollment-process" },
      {
        label: "Specialities",
        children: [
          { label: "Why Choose", href: "/#features" },
          { label: "Our Teaching Method", href: "/#OurTeachingMethod" },
          { label: "Empowering Students", href: "/empowering-through-quranic-learning" },
        ],
      },
      { label: "F.A.Q", href: "/faq" },
    ],
  },
  { label: "Social Platform", href: "/social-platforms" },
  { label: "About", href: "/about" },
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

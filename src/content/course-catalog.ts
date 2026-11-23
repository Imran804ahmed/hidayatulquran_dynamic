/**
 * Course catalogue shared by the course listing, course cards, course pages, the registration
 * form (client) and the registration endpoint (server). Plain data only, so it is safe to import
 * anywhere.
 *
 * `slug` matches WEBSITE_COURSES in src/lib/portal/website-courses.ts (the admin portal's course
 * list), so a registration's course can be matched to the course the portal enrols students in.
 * All wording below comes from the academy's own course pages and home-page course cards.
 */
export type CourseSlug =
  | "noorani-qaida"
  | "quran-reading"
  | "quran-tajweed"
  | "quran-memorization"
  | "tafseer-quran"
  | "quranic-arabic";

export type CatalogCourse = {
  slug: CourseSlug;
  /** Key in COURSES (src/content/courses.tsx). */
  key: "noorani" | "reading" | "tajweed" | "hifz" | "tafseer" | "arabic";
  name: string;
  /** Short name for buttons, e.g. "Register for Tajweed". */
  shortName: string;
  path: string;
  image: string;
  imageAlt: string;
  /** One-sentence summary (home-page course card copy). */
  summary: string;
  /** Level as published in the course page's structured data. */
  level: string;
  /** Who it suits, in a few words (from the course page's "Who is this course for?"). */
  suits: string;
  /** "You can choose one free course" list from the home-page course card. */
  freeCourses: string[];
};

export const CATALOG: CatalogCourse[] = [
  {
    slug: "noorani-qaida",
    key: "noorani",
    name: "Noorani Qaida",
    shortName: "Noorani Qaida",
    path: "/noorani-qaida-online",
    image: "/assets/img/NooraniQaida_hidayatulquran_Academy.jpg",
    imageAlt: "Noorani Qaida online course for kids and Quran beginners",
    summary: "Learn Arabic letters, correct pronunciation, proper joining, and enhanced fluency for Quran reading.",
    level: "Beginner",
    suits: "Kids and adults starting from scratch, and new Muslims",
    freeCourses: ["Seerat Nabi (S.A.W.)", "Multiple Duas", "Six Kalimas", "Hadith"],
  },
  {
    slug: "quran-reading",
    key: "reading",
    name: "Quran Reading Course",
    shortName: "Quran Reading",
    path: "/quran-reading-course-online",
    image: "/assets/img/QuranReadingCourse_hidayatulquran_Academy.jpeg",
    imageAlt: "Quran reading course online with certified tutor guidance",
    summary: "Progress from recognizing letters to reading full verses fluently with Tajweed accuracy.",
    level: "Beginner to Intermediate",
    suits: "Students who have completed Noorani Qaida, and adults improving fluency",
    freeCourses: ["The method of ablution (Wazu) and its rulings", "Seerat Nabi (S.A.W.)", "Multiple Duas", "Hadith"],
  },
  {
    slug: "quran-tajweed",
    key: "tajweed",
    name: "Quran with Tajweed",
    shortName: "Tajweed",
    path: "/quran-tajweed-course-online",
    image: "/assets/img/QuranWithTajweed_hidayatulquran_Academy.jpeg",
    imageAlt: "Quran with Tajweed course for accurate online recitation",
    summary: "Master proper recitation rules such as Ghunna, Qalqalah, and Madd to beautify your Tilawat.",
    level: "Intermediate",
    suits: "Students who can read the Quran and want to recite it correctly",
    freeCourses: ["The method of ablution (Wazu) and its rulings", "The method of Ghusal and its rulings", "Seerat Nabi (S.A.W.)", "Hadith"],
  },
  {
    slug: "quran-memorization",
    key: "hifz",
    name: "Quran Memorization (Hifz)",
    shortName: "Hifz",
    path: "/quran-memorization-hifz-online",
    image: "/assets/img/QuranMemorization_hidayatulquran_Academy.jpeg",
    imageAlt: "Online Hifz and Quran memorization course with structured daily revision",
    summary: "Memorize short Surahs or the entire Quran with structured daily lessons and regular revision cycles.",
    level: "Intermediate to Advanced",
    suits: "Kids and adults who read with Tajweed and want to memorize",
    freeCourses: ["The method of Salah, its rulings and translation", "The method of ablution (Wazu) and its rulings", "The method of Ghusal and its rulings", "Seerat Nabi (S.A.W.)"],
  },
  {
    slug: "tafseer-quran",
    key: "tafseer",
    name: "Tafseer e Quran",
    shortName: "Tafseer",
    path: "/tafseer-quran-course-online",
    image: "/assets/img/TafseerQuran_hidayatulquran_Academy.jpeg",
    imageAlt: "Tafseer e Quran course for understanding Quranic meaning and wisdom",
    summary: "Explore the translation and explanation of verses to apply Quranic wisdom in daily life.",
    level: "Intermediate to Advanced",
    suits: "Anyone who reads the Quran and wants to understand its meaning",
    freeCourses: ["The method of Salah, its rulings and translation", "The method of ablution (Wazu) and its rulings", "The method of Ghusal and its rulings", "Islamic etiquette of life"],
  },
  {
    slug: "quranic-arabic",
    key: "arabic",
    name: "Quranic Arabic",
    shortName: "Quranic Arabic",
    path: "/quranic-arabic-course-online",
    image: "/assets/img/QuranicArabic_hidayatulquran_Academy.jpeg",
    imageAlt: "Quranic Arabic course for understanding Quran vocabulary and grammar",
    summary: "Understand Quranic grammar and meanings directly from Arabic without needing translation.",
    level: "Beginner to Intermediate",
    suits: "Students who want to understand the Quran directly in Arabic",
    freeCourses: ["The method of Salah, its rulings and translation", "The method of ablution (Wazu) and its rulings", "The method of Ghusal and its rulings", "Rules of purification (Taharah)"],
  },
];

export const COURSE_BY_SLUG: Record<string, CatalogCourse> = Object.fromEntries(CATALOG.map((c) => [c.slug, c]));

export const courseBySlug = (slug: string | null | undefined): CatalogCourse | undefined =>
  slug ? COURSE_BY_SLUG[slug] : undefined;

/** Link to the registration form with the course preselected. */
export const registerHref = (slug?: CourseSlug) => (slug ? `/registration?course=${slug}` : "/registration");

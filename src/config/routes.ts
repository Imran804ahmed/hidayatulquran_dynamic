
type SitemapEntry = { path: string; priority: number; changeFrequency: "weekly" | "monthly" };

/** Public, indexable pages. Used by app/sitemap.ts; add new public pages here. */
export const PUBLIC_PAGES: SitemapEntry[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/noorani-qaida-online", priority: 0.9, changeFrequency: "monthly" },
  { path: "/quran-reading-course-online", priority: 0.9, changeFrequency: "monthly" },
  { path: "/quran-tajweed-course-online", priority: 0.9, changeFrequency: "monthly" },
  { path: "/quran-memorization-hifz-online", priority: 0.9, changeFrequency: "monthly" },
  { path: "/tafseer-quran-course-online", priority: 0.9, changeFrequency: "monthly" },
  { path: "/quranic-arabic-course-online", priority: 0.9, changeFrequency: "monthly" },
  { path: "/online-quran-classes-uk", priority: 0.9, changeFrequency: "monthly" },
  { path: "/online-quran-classes-usa", priority: 0.9, changeFrequency: "monthly" },
  { path: "/online-quran-classes-canada", priority: 0.9, changeFrequency: "monthly" },
  { path: "/online-quran-classes-uae", priority: 0.9, changeFrequency: "monthly" },
  { path: "/online-quran-classes-saudi-arabia", priority: 0.9, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
  { path: "/registration", priority: 0.8, changeFrequency: "monthly" },
  { path: "/enrollment-process", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/empowering-through-quranic-learning", priority: 0.7, changeFrequency: "monthly" },
  { path: "/social-platforms", priority: 0.5, changeFrequency: "monthly" },
];

/** Date the content (or URL) of the public pages last changed. Update when publishing changes. */
export const CONTENT_LAST_MODIFIED = "2026-11-12";


type Redirect = { source: string; destination: string; statusCode: 301 };

/**
 * Permanent (301) redirects from the URLs of the original static site to the clean URLs.
 * Keep these for as long as search engines or old links may still use the .html addresses.
 */
const renamed: Record<string, string> = {
  index: "/",
  Explore: "/courses",
  socialPlatforms: "/social-platforms",
};

/**
 * FlexStart template demo pages that were never part of the real site. They answer 410 Gone
 * (see proxy.ts) instead of redirecting to the home page, which search engines treat as a soft 404.
 */
export const GONE_PATHS = new Set(
  ["inner-page", "portfolio-details", "blog", "blog-single"].flatMap((p) => [`/${p}`, `/${p}.html`]),
);

const pages = [
  "about",
  "empowering-through-quranic-learning",
  "enrollment-process",
  "faq",
  "noorani-qaida-online",
  "online-quran-classes-canada",
  "online-quran-classes-saudi-arabia",
  "online-quran-classes-uae",
  "online-quran-classes-uk",
  "online-quran-classes-usa",
  "quran-memorization-hifz-online",
  "quran-reading-course-online",
  "quran-tajweed-course-online",
  "quranic-arabic-course-online",
  "registration",
  "tafseer-quran-course-online",
];

export const legacyRedirects: Redirect[] = [
  ...Object.entries(renamed).map(([from, to]) => ({ source: `/${from}.html`, destination: to, statusCode: 301 as const })),
  ...pages.map((p) => ({ source: `/${p}.html`, destination: `/${p}`, statusCode: 301 as const })),
  // The old course explorer is now the course listing. Next matches redirect sources
  // case-insensitively, so this also covers "/Explore".
  { source: "/explore", destination: "/courses", statusCode: 301 as const },
  // Old paths without the extension.
  { source: "/socialPlatforms", destination: "/social-platforms", statusCode: 301 as const },
];

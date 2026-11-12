type Redirect = { source: string; destination: string; statusCode: 301 };

/**
 * Permanent (301) redirects from the URLs of the original static site to the clean URLs.
 * Keep these for as long as search engines or old links may still use the .html addresses.
 */
const renamed: Record<string, string> = {
  index: "/",
  Explore: "/explore",
  socialPlatforms: "/social-platforms",
  // FlexStart template demo pages that were never part of the real site.
  "inner-page": "/",
  "portfolio-details": "/",
  blog: "/",
  "blog-single": "/",
};

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
  // Old paths without the extension. (No "/Explore" -> "/explore" rule: Next matches redirect
  // sources case-insensitively, so it would loop.)
  { source: "/socialPlatforms", destination: "/social-platforms", statusCode: 301 as const },
  { source: "/inner-page", destination: "/", statusCode: 301 as const },
  { source: "/portfolio-details", destination: "/", statusCode: 301 as const },
  { source: "/blog", destination: "/", statusCode: 301 as const },
];

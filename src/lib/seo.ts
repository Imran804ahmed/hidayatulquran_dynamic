import type { Metadata } from "next";
import { SITE, absoluteUrl, IS_STAGING } from "@/config/site";

type PageSeo = {
  /** Site path of the page, e.g. "/about" (used for canonical and og:url). */
  path: string;
  title: string;
  description: string;
  keywords?: string;
  /** Open Graph / social card overrides (default: title / description). */
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  /** Social image path or URL (default: the logo). */
  image?: string;
  /** Open Graph locale, e.g. "en_GB". */
  locale?: string;
  /** hreflang alternates: { "en-gb": "/online-quran-classes-uk", ... }. Country cluster only. */
  languages?: Record<string, string>;
  /** Keep the page out of search results (it stays crawlable so the noindex is seen). */
  noindex?: boolean;
};

/** Builds the page metadata (title, description, canonical, Open Graph, Twitter) in one place. */
export function pageMetadata(seo: PageSeo): Metadata {
  const image = absoluteUrl(seo.image ?? SITE.logo);
  return {
    title: seo.title,
    description: seo.description,
    // `keywords` is accepted for reference but not emitted: search engines ignore the meta tag.
    ...(seo.noindex || IS_STAGING ? { robots: { index: false, follow: !IS_STAGING } } : {}),
    alternates: {
      canonical: absoluteUrl(seo.path),
      languages: seo.languages
        ? Object.fromEntries(Object.entries(seo.languages).map(([lang, p]) => [lang, absoluteUrl(p)]))
        : undefined,
    },
    openGraph: {
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      type: "website",
      url: absoluteUrl(seo.path),
      images: [image],
      siteName: SITE.name,
      locale: seo.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle ?? seo.ogTitle ?? seo.title,
      description: seo.twitterDescription ?? seo.ogDescription ?? seo.description,
      images: [image],
    },
  };
}

/** schema.org BreadcrumbList for a page under Home (› optional middle crumb). */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

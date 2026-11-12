import type { ReactNode } from "react";

export type Package = {
  name: string;
  days: string;
  price: string;
  per: string;
  features: string[];
  href: string;
};

/** Content of one country landing page (see src/content/countries.tsx). */
export type CountryContent = {
  path: string;
  title: string;
  description: string;
  keywords: string;
  /** hreflang alternates (site paths). */
  languages: Record<string, string>;
  ogTitle: string;
  ogDescription: string;
  ogLocale: string;
  twitterTitle: string;
  twitterDescription: string;
  ogImage?: string;
  name: string;
  breadcrumb: string;
  breadcrumbSchema: string;
  image: string;
  imageAlt: string;
  /** WhatsApp link with a country-specific greeting. */
  whatsapp: string;
  introHeading: string;
  intro: ReactNode[];
  /** Optional local phone line under the intro. */
  contactLine?: ReactNode;
  whyHeading: string;
  why: ReactNode[];
  coursesHeading: string;
  courses: ReactNode[];
  feeHeading: string;
  /** Bronze, Silver (highlighted), Gold. */
  packages: Package[];
  perks: string[];
  ctaLabel: string;
  faqHeading: string;
  faqId: string;
  faqs: { q: string; a: string }[];
  /** schema.org Service (without @context/url) and FAQPage entries, kept as published. */
  serviceSchema: Record<string, unknown>;
  faqSchema: Record<string, unknown>[];
};

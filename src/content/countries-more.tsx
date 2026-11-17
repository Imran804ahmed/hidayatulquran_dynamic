import Link from "next/link";
// Country landing pages generated from a compact spec (Australia, Pakistan, India, ...).
// Rendered by components/country/CountryPage, same as the hand-written pages in countries.tsx.
import type { CountryContent } from "@/components/country/types";
import { countryLanguages } from "./country-hreflang";

type Spec = {
  slug: string;
  /** Display name, e.g. "South Africa". */
  name: string;
  hreflang: string;
  ogLocale: string;
  cities: string[];
  /** Time zones as written in sentences, e.g. "AEST, ACST and AWST". */
  zones: string;
  /** Short label for the perks strip, e.g. "All Australian Time Zones". */
  zonesPerk: string;
  currency: "USD" | "EUR";
  prices: [string, string, string];
};

const SYMBOL = { USD: "$", EUR: "€" } as const;
const PLANS = [
  { name: "Bronze Package", days: 3, plan: 3 },
  { name: "Silver Package", days: 4, plan: 4 },
  { name: "Gold Package", days: 5, plan: 5 },
];

const linkStyle = { color: "#082c4c" };

function buildCountry(s: Spec): CountryContent {
  const path = `/online-quran-classes-${s.slug}`;
  const cityList = `${s.cities.slice(0, -1).join(", ")} and ${s.cities[s.cities.length - 1]}`;
  const cityShort = s.cities.slice(0, 3).join(", ");
  const sym = SYMBOL[s.currency];
  const from = `${sym}${s.prices[0]}`;
  const fromText = `${from} ${s.currency}/month`;
  const enc = encodeURIComponent(`Assalamu Alaikum, I am from ${s.name} and want to book a free trial Quran class.`);

  const faqs = [
    {
      q: `Which time zones do you cover in ${s.name}?`,
      a: `We schedule classes in ${s.zones}, serving students in ${cityList} and all over ${s.name} with morning, afternoon, and evening slots.`,
    },
    {
      q: `How much do online Quran classes cost in ${s.name}?`,
      a: `Plans start from ${fromText} for 3 classes per week. There is no registration fee and the trial class is completely free.`,
    },
    {
      q: "Do you offer female Quran teachers?",
      a: "Yes. Certified female Quran tutors are available for female students and children. Request a female teacher during registration — this preference is fully respected.",
    },
    {
      q: `Can my child join as a complete beginner from ${s.name}?`,
      a: "Absolutely. We start with Noorani Qaida for complete beginners — Arabic letters, correct pronunciation (Makharij), and basic Tajweed. Suitable for kids from age 4 and adults.",
    },
    {
      q: "What platform is used for online classes?",
      a: "All classes are via Zoom. You only need a stable internet connection and a smartphone, tablet, or computer. Teachers use screen sharing and a digital whiteboard for interactive lessons.",
    },
    {
      q: `How do I enroll from ${s.name}?`,
      a: `Send a WhatsApp message or fill in our registration form. We will contact you within 24 hours, assign a tutor, and book your free trial class at a time that suits your ${s.name} time zone.`,
    },
  ];

  return {
    path,
    title: `Online Quran Classes in ${s.name} — Certified Tutors | HidayatulQuran Academy`,
    description: `Join live 1-on-1 online Quran classes in ${s.name} with certified male and female tutors. Tajweed, Hifz, Noorani Qaida for kids and adults in ${cityShort} and more. Free trial available.`,
    keywords: [
      "online Quran classes", "Quran tutor", "learn Quran online", "online Quran teacher", "Quran classes for kids",
      "Tajweed online", "Hifz classes", "female Quran teacher", "one to one Quran classes", "Noorani Qaida",
      "Islamic education online",
    ].map((k) => `${k} ${s.name}`).join(", "),
    languages: countryLanguages(path),
    ogTitle: `Online Quran Classes in ${s.name} — Certified Tutors | HidayatulQuran Academy`,
    ogDescription: `Live 1-on-1 online Quran classes for students in ${s.name}. Certified tutors, ${s.currency} pricing, flexible scheduling in ${s.zones}. Free trial class available.`,
    ogLocale: s.ogLocale,
    twitterTitle: `Online Quran Classes in ${s.name} | HidayatulQuran Academy`,
    twitterDescription: `Live 1-on-1 Quran classes for students in ${s.name}. Certified tutors, ${s.currency} pricing, flexible scheduling. Free trial available.`,
    ogImage: "/assets/img/hidayatulquran1.png",
    name: `Online Quran Classes in ${s.name}`,
    breadcrumb: `Online Quran Classes ${s.name}`,
    breadcrumbSchema: `Online Quran Classes ${s.name}`,
    image: "/assets/img/hidayatulquran1.png",
    imageAlt: `Online Quran classes for students in ${s.name} with certified tutors`,
    whatsapp: `https://wa.me/923365398542?text=${enc}`,
    introHeading: `Live 1-on-1 Online Quran Classes for Students in ${s.name}`,
    intro: [
      <>
        HidayatulQuran Academy offers certified{" "}
        <strong>online Quran classes for students across {s.name}</strong>
        {" "}— {s.cities.join(", ")} and beyond. Our tutors are available in{" "}
        <strong>{s.zones}</strong>
        , with flexible scheduling morning, afternoon, and evening.
      </>,
      <>
        Live 1-on-1 Zoom sessions covering{" "}
        <strong>Noorani Qaida, Quran Reading, Tajweed, Hifz, Tafseer</strong>
        {" "}and Quranic Arabic.{" "}
        <strong>Plans from {fromText}.</strong>
        {" "}Free trial class — no payment or commitment required.
      </>,
    ],
    whyHeading: `Why Families in ${s.name} Choose HidayatulQuran`,
    why: [
      <><strong>{s.zonesPerk}</strong>{" "}— {s.zones}</>,
      <><strong>Certified male &amp; female Quran tutors</strong></>,
      <><strong>{s.currency} pricing</strong>{" "}— from {from}/month, no hidden fees</>,
      <><strong>Personalised 1-on-1 sessions</strong>{" "}— not group classes</>,
      <><strong>Kids and adults welcome</strong>{" "}— all levels from scratch</>,
      <><strong>Monthly progress reports</strong>{" "}sent to parents</>,
      <><strong>Free trial class</strong>{" "}— no commitment, no payment</>,
    ],
    coursesHeading: `Courses Available for Students in ${s.name}`,
    courses: [
      <><Link href="/noorani-qaida-online" style={linkStyle}><strong>Noorani Qaida</strong></Link>{" "}— for complete Quran beginners</>,
      <><Link href="/quran-reading-course-online" style={linkStyle}><strong>Quran Reading Course</strong></Link>{" "}— fluent reading with Tajweed</>,
      <><Link href="/quran-tajweed-course-online" style={linkStyle}><strong>Quran with Tajweed</strong></Link>{" "}— master proper recitation rules</>,
      <><Link href="/quran-memorization-hifz-online" style={linkStyle}><strong>Quran Memorization (Hifz)</strong></Link>{" "}— structured Hifz programme</>,
      <><Link href="/tafseer-quran-course-online" style={linkStyle}><strong>Tafseer e Quran</strong></Link>{" "}— understand Quranic meaning</>,
      <><Link href="/quranic-arabic-course-online" style={linkStyle}><strong>Quranic Arabic</strong></Link>{" "}— read and understand Arabic</>,
    ],
    feeHeading: `Monthly Fee for Students in ${s.name} (${s.currency})`,
    packages: PLANS.map((p, i) => ({
      name: p.name,
      days: `${p.days} Days Per Week`,
      price: `${sym}${s.prices[i]}`,
      per: `${s.currency}/month`,
      features: [`${p.days * 4} Classes Per Month`, "30 Minutes Each", "1-on-1 Live Session", "Free Registration"],
      href: `/registration?plan=${p.plan}`,
    })),
    perks: ["Certified Tutors", "1-on-1 Live Classes", "Free Trial Class", s.zonesPerk, `${s.currency} Pricing from ${from}`],
    ctaLabel: "Book Free Trial — No Payment Required",
    faqHeading: `Frequently Asked Questions — ${s.name} Students`,
    faqId: `faq-${s.hreflang.slice(3)}`,
    faqs,
    serviceSchema: {
      "@type": "Service",
      name: `Online Quran Classes in ${s.name}`,
      description: `Live 1-on-1 online Quran classes for students in ${s.name} with certified male and female tutors. Tajweed, Hifz, Noorani Qaida and more.`,
      provider: {
        "@type": "EducationalOrganization",
        name: "HidayatulQuran Academy",
        url: "https://www.hidayatulquran.com",
        telephone: "+92-336-5398542",
      },
      areaServed: { "@type": "Country", name: s.name },
      serviceType: "Online Quran Education",
      offers: PLANS.map((p, i) => ({
        "@type": "Offer",
        name: `${p.name} — ${p.days} Days/Week`,
        price: s.prices[i],
        priceCurrency: s.currency,
        description: `${p.days * 4} classes per month, 30 min each, 1-on-1 live`,
      })),
    },
    faqSchema: faqs.map((f) => ({
      "@type": "Question",
      name: f.q.includes(s.name) ? f.q : `${f.q.replace(/\?$/, "")} for students in ${s.name}?`,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export const MORE_COUNTRIES = {
  australia: buildCountry({
    slug: "australia", name: "Australia", hreflang: "en-au", ogLocale: "en_AU",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    zones: "AEST, ACST and AWST", zonesPerk: "All Australian Time Zones",
    currency: "USD", prices: ["20", "25", "30"],
  }),
  pakistan: buildCountry({
    slug: "pakistan", name: "Pakistan", hreflang: "en-pk", ogLocale: "en_PK",
    cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar"],
    zones: "PKT (Pakistan Standard Time)", zonesPerk: "Pakistan Time (PKT)",
    currency: "USD", prices: ["20", "25", "30"],
  }),
  india: buildCountry({
    slug: "india", name: "India", hreflang: "en-in", ogLocale: "en_IN",
    cities: ["Hyderabad", "Mumbai", "Delhi", "Bengaluru", "Lucknow"],
    zones: "IST (India Standard Time)", zonesPerk: "India Time (IST)",
    currency: "USD", prices: ["20", "25", "30"],
  }),
  germany: buildCountry({
    slug: "germany", name: "Germany", hreflang: "en-de", ogLocale: "en_DE",
    cities: ["Berlin", "Hamburg", "Munich", "Frankfurt", "Cologne"],
    zones: "CET and CEST", zonesPerk: "German Time (CET/CEST)",
    currency: "EUR", prices: ["22", "25", "28"],
  }),
  france: buildCountry({
    slug: "france", name: "France", hreflang: "en-fr", ogLocale: "en_FR",
    cities: ["Paris", "Marseille", "Lyon", "Lille", "Toulouse"],
    zones: "CET and CEST", zonesPerk: "French Time (CET/CEST)",
    currency: "EUR", prices: ["22", "25", "28"],
  }),
  russia: buildCountry({
    slug: "russia", name: "Russia", hreflang: "en-ru", ogLocale: "en_RU",
    cities: ["Moscow", "Saint Petersburg", "Kazan", "Ufa", "Makhachkala"],
    zones: "MSK (Moscow Time) and all other Russian time zones", zonesPerk: "All Russian Time Zones",
    currency: "USD", prices: ["20", "25", "30"],
  }),
  brazil: buildCountry({
    slug: "brazil", name: "Brazil", hreflang: "en-br", ogLocale: "en_BR",
    cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Curitiba", "Foz do Iguaçu"],
    zones: "BRT (Brasília Time) and all Brazilian time zones", zonesPerk: "All Brazilian Time Zones",
    currency: "USD", prices: ["20", "25", "30"],
  }),
  southAfrica: buildCountry({
    slug: "south-africa", name: "South Africa", hreflang: "en-za", ogLocale: "en_ZA",
    cities: ["Cape Town", "Johannesburg", "Durban", "Pretoria", "Gqeberha"],
    zones: "SAST (South Africa Standard Time)", zonesPerk: "South Africa Time (SAST)",
    currency: "USD", prices: ["20", "25", "30"],
  }),
  qatar: buildCountry({
    slug: "qatar", name: "Qatar", hreflang: "en-qa", ogLocale: "en_QA",
    cities: ["Doha", "Al Rayyan", "Al Wakrah", "Lusail", "Al Khor"],
    zones: "AST (Arabia Standard Time)", zonesPerk: "Qatar Time (AST)",
    currency: "USD", prices: ["20", "25", "30"],
  }),
} satisfies Record<string, CountryContent>;

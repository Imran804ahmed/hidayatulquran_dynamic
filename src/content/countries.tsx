import Link from "next/link";
// Content of the country landing pages. Rendered by components/country/CountryPage.
import type { CountryContent } from "@/components/country/types";

export const COUNTRIES = {
  uk: {
    path: "/online-quran-classes-uk",
    title: "Online Quran Classes in the UK — Certified Tutors | HidayatulQuran Academy",
    description: "Join live 1-on-1 online Quran classes in the UK with certified male and female tutors. Tajweed, Hifz, Noorani Qaida for kids and adults. Free trial — no payment required. GBP pricing available.",
    keywords: "online Quran classes UK, Quran tutor UK, learn Quran online UK, online Quran teacher UK, Quran classes for kids UK, Tajweed online UK, Hifz classes UK, female Quran teacher UK, one to one Quran classes UK, Noorani Qaida UK, Islamic education online UK",
    languages: {
      "en-gb": "/online-quran-classes-uk",
      "en-us": "/online-quran-classes-usa",
      "en-ca": "/online-quran-classes-canada",
      "en-ae": "/online-quran-classes-uae",
      "en-sa": "/online-quran-classes-saudi-arabia",
      "x-default": "/"
    },
    ogTitle: "Online Quran Classes in the UK — Certified Tutors | HidayatulQuran Academy",
    ogDescription: "Live 1-on-1 online Quran classes for UK students. Certified tutors, GBP pricing, flexible GMT/BST scheduling. Free trial class available.",
    ogLocale: "en_GB",
    twitterTitle: "Online Quran Classes in the UK | HidayatulQuran Academy",
    twitterDescription: "Live 1-on-1 Quran classes for UK students. Certified tutors, flexible GMT/BST scheduling. Free trial available.",
    ogImage: "/assets/img/hidayatulquran1.png",
    name: "Online Quran Classes in the UK",
    breadcrumb: "Online Quran Classes UK",
    breadcrumbSchema: "Online Quran Classes UK",
    image: "/assets/img/hidayatulquran1.png",
    imageAlt: "Online Quran classes for UK students with certified tutors",
    whatsapp: "https://wa.me/923365398542?text=Assalamu%20Alaikum%2C%20I%20am%20from%20the%20UK%20and%20want%20to%20book%20a%20free%20trial%20Quran%20class.",
    introHeading: "Live 1-on-1 Online Quran Classes for UK Students",
    intro: [
      <>
        Looking for trusted{" "}
        <strong>online Quran classes in the UK</strong>
        ? HidayatulQuran Academy connects you with certified male and female Quran tutors who teach live, one-to-one sessions — perfectly scheduled for{" "}
        <strong>GMT and BST time zones</strong>
        . Whether you are in London, Manchester, Birmingham, Leeds, or Glasgow, our tutors are available around your schedule.
      </>,
      <>
        We offer{" "}
        <strong>Noorani Qaida, Quran Reading, Tajweed, Hifz, Tafseer</strong>
        {" "}and Quranic Arabic courses for kids and adults. All classes are conducted via Zoom.{" "}
        <strong>Free trial class available — no payment required.</strong>
      </>,
    ],
    contactLine: <>
      <i className="bi bi-telephone-fill" style={{ color: "#082c4c" }}></i>
      {" "}UK Contact:{" "}
      <strong>+44 7376 282389</strong>
    </>,
    whyHeading: "Why UK Muslims Choose HidayatulQuran",
    why: [
      <>
        <strong>GMT/BST scheduling</strong>
        {" "}— morning, evening and weekend slots
      </>,
      <>
        <strong>Certified Hafiz and Tajweed tutors</strong>
        {" "}— qualified scholars
      </>,
      <>
        <strong>GBP pricing</strong>
        {" "}— from just £22/month
      </>,
      <>
        <strong>Male &amp; female tutors</strong>
        {" "}— student chooses their preference
      </>,
      <>
        <strong>Flexible alternative</strong>
        {" "}to weekend Quran school or madrasah
      </>,
      <>
        <strong>Progress reports</strong>
        {" "}shared with parents every month
      </>,
      <>
        <strong>Free trial class</strong>
        {" "}— no commitment, no payment required
      </>,
    ],
    coursesHeading: "Courses Available for UK Students",
    courses: [
      <>
        <Link href="/noorani-qaida-online" style={{ color: "#082c4c" }}><strong>Noorani Qaida</strong></Link>
        {" "}— for complete Quran beginners
      </>,
      <>
        <Link href="/quran-reading-course-online" style={{ color: "#082c4c" }}><strong>Quran Reading Course</strong></Link>
        {" "}— fluent reading with Tajweed
      </>,
      <>
        <Link href="/quran-tajweed-course-online" style={{ color: "#082c4c" }}><strong>Quran with Tajweed</strong></Link>
        {" "}— master proper recitation rules
      </>,
      <>
        <Link href="/quran-memorization-hifz-online" style={{ color: "#082c4c" }}><strong>Quran Memorization (Hifz)</strong></Link>
        {" "}— structured Hifz programme
      </>,
      <>
        <Link href="/tafseer-quran-course-online" style={{ color: "#082c4c" }}><strong>Tafseer e Quran</strong></Link>
        {" "}— understand Quranic meaning
      </>,
      <>
        <Link href="/quranic-arabic-course-online" style={{ color: "#082c4c" }}><strong>Quranic Arabic</strong></Link>
        {" "}— read and understand Arabic
      </>,
    ],
    feeHeading: "Monthly Fee for UK Students (GBP)",
    packages: [
      {
        "name": "Bronze Package",
        "days": "3 Days Per Week",
        "price": "£22",
        "per": "/month",
        "features": [
          "12 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=3"
      },
      {
        "name": "Silver Package",
        "days": "4 Days Per Week",
        "price": "£25",
        "per": "/month",
        "features": [
          "16 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=4"
      },
      {
        "name": "Gold Package",
        "days": "5 Days Per Week",
        "price": "£28",
        "per": "/month",
        "features": [
          "20 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=5"
      }
    ],
    perks: ["Certified Tutors","1-on-1 Live Classes","Free Trial Class","GMT/BST Scheduling","GBP Pricing"],
    ctaLabel: "Book Free Trial — No Payment Required",
    faqHeading: "Frequently Asked Questions — UK Students",
    faqId: "faq-uk",
    faqs: [
      {
        "q": "Are classes available in GMT and BST time zones?",
        "a": "Yes. All our UK students are scheduled in GMT or BST. We offer morning, afternoon, and evening slots to fit school and work schedules across the UK."
      },
      {
        "q": "Do you offer female Quran teachers for UK students?",
        "a": "Yes. We have certified female Quran tutors available for female students and children who prefer a female teacher. You can request this during registration."
      },
      {
        "q": "Is the fee in GBP?",
        "a": "Yes. UK students pay in GBP. Our plans start from £22/month for 3 classes per week. There is no registration fee and the trial class is completely free."
      },
      {
        "q": "Can my child join if they have never read Quran before?",
        "a": "Absolutely. We start with Noorani Qaida — the foundation course for complete beginners. It covers Arabic letters, pronunciation, and basic Tajweed rules before moving to full Quran reading."
      },
      {
        "q": "How is this different from a weekend Quran school?",
        "a": "Unlike group classes at a weekend school, our sessions are 1-on-1, online, and available any day of the week. Your child gets full tutor attention and progresses at their own pace — no commuting required."
      },
      {
        "q": "How do I enroll for UK online Quran classes?",
        "a": "Message us on WhatsApp at +44 7376 282389 or fill in the registration form. We will arrange your free trial class within 24 hours and assign a tutor that fits your preferred time slot."
      }
    ],
    serviceSchema: {
      "@type": "Service",
      "name": "Online Quran Classes in the UK",
      "description": "Live 1-on-1 online Quran classes for students in the UK with certified male and female tutors. Tajweed, Hifz, Noorani Qaida and more.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "HidayatulQuran Academy",
        "url": "https://www.hidayatulquran.com",
        "telephone": "+44-7376282389",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+44-7376282389",
          "contactType": "customer service",
          "areaServed": "GB",
          "availableLanguage": [
            "English",
            "Urdu",
            "Arabic"
          ]
        }
      },
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom"
      },
      "serviceType": "Online Quran Education",
      "offers": [
        {
          "@type": "Offer",
          "name": "Bronze Package — 3 Days/Week",
          "price": "22",
          "priceCurrency": "GBP",
          "description": "12 classes per month, 30 min each, 1-on-1 live"
        },
        {
          "@type": "Offer",
          "name": "Silver Package — 4 Days/Week",
          "price": "25",
          "priceCurrency": "GBP",
          "description": "16 classes per month, 30 min each, 1-on-1 live"
        },
        {
          "@type": "Offer",
          "name": "Gold Package — 5 Days/Week",
          "price": "28",
          "priceCurrency": "GBP",
          "description": "20 classes per month, 30 min each, 1-on-1 live"
        }
      ]
    },
    faqSchema: [
      {
        "@type": "Question",
        "name": "Are online Quran classes available in GMT and BST time zones?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All UK students are scheduled in GMT or BST with morning, afternoon, and evening slots available to fit around school and work schedules."
        }
      },
      {
        "@type": "Question",
        "name": "Is the monthly fee in GBP for UK students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. UK students pay in GBP. Plans start from £22/month for 3 classes per week. No registration fee — the trial class is completely free."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer female Quran teachers for UK students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Certified female Quran tutors are available for female students and children who prefer a female teacher. You can request this during registration."
        }
      },
      {
        "@type": "Question",
        "name": "Can my child join UK Quran classes as a complete beginner?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We start with Noorani Qaida — covering Arabic letters, pronunciation, and basic Tajweed before full Quran reading. Suitable for kids from age 4 and adults."
        }
      },
      {
        "@type": "Question",
        "name": "How is this different from a UK weekend Quran school?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unlike group weekend classes, our sessions are 1-on-1, online, and available any day. Your child gets full tutor attention, learns at their own pace, and no commuting is required."
        }
      },
      {
        "@type": "Question",
        "name": "How do I enroll in online Quran classes in the UK?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Message us on WhatsApp at +44 7376 282389 or fill in the registration form. We will arrange your free trial class within 24 hours and assign a tutor matching your preferred time slot."
        }
      }
    ],
  },
  usa: {
    path: "/online-quran-classes-usa",
    title: "Online Quran Classes in the USA — Certified Tutors | HidayatulQuran Academy",
    description: "Join live 1-on-1 online Quran classes in the USA with certified male and female tutors. Tajweed, Hifz, Noorani Qaida for kids and adults. All US time zones covered. Free trial — no payment required.",
    keywords: "online Quran classes USA, Quran tutor USA, learn Quran online America, online Quran teacher USA, Quran classes for kids USA, Tajweed online USA, Hifz classes USA, female Quran teacher USA, one to one Quran classes USA, Noorani Qaida USA, Islamic education online USA",
    languages: {
      "en-us": "/online-quran-classes-usa",
      "en-gb": "/online-quran-classes-uk",
      "en-ca": "/online-quran-classes-canada",
      "en-ae": "/online-quran-classes-uae",
      "en-sa": "/online-quran-classes-saudi-arabia",
      "x-default": "/"
    },
    ogTitle: "Online Quran Classes in the USA — Certified Tutors | HidayatulQuran Academy",
    ogDescription: "Live 1-on-1 online Quran classes for US students. Certified tutors, USD pricing, flexible EST/CST/PST scheduling. Free trial class available.",
    ogLocale: "en_US",
    twitterTitle: "Online Quran Classes in the USA | HidayatulQuran Academy",
    twitterDescription: "Live 1-on-1 Quran classes for US students. Certified tutors, flexible EST/CST/PST scheduling. Free trial available.",
    ogImage: "/assets/img/hidayatulquran1.png",
    name: "Online Quran Classes in the USA",
    breadcrumb: "Online Quran Classes USA",
    breadcrumbSchema: "Online Quran Classes USA",
    image: "/assets/img/hidayatulquran1.png",
    imageAlt: "Online Quran classes for USA students with certified tutors",
    whatsapp: "https://wa.me/923365398542?text=Assalamu%20Alaikum%2C%20I%20am%20from%20the%20USA%20and%20want%20to%20book%20a%20free%20trial%20Quran%20class.",
    introHeading: "Live 1-on-1 Online Quran Classes for Students Across the USA",
    intro: [
      <>
        HidayatulQuran Academy provides certified{" "}
        <strong>online Quran classes for US students</strong>
        {" "}in every state — New York, Texas, California, Florida, Illinois and beyond. Our tutors are available across all US time zones:{" "}
        <strong>EST, CST, MST and PST</strong>
        , with flexible morning, afternoon, and evening slots designed around school and work schedules.
      </>,
      <>
        All sessions are live, one-to-one, conducted via Zoom. We offer{" "}
        <strong>Noorani Qaida, Quran Reading, Tajweed, Hifz, Tafseer</strong>
        {" "}and Quranic Arabic.{" "}
        <strong>Starting from just $20/month.</strong>
        {" "}Free trial class — no payment required.
      </>,
    ],
    whyHeading: "Why US Muslims Choose HidayatulQuran",
    why: [
      <>
        <strong>All US time zones</strong>
        {" "}— EST, CST, MST, PST scheduling available
      </>,
      <>
        <strong>Certified male &amp; female tutors</strong>
        {" "}— qualified Hafiz and Tajweed scholars
      </>,
      <>
        <strong>USD pricing</strong>
        {" "}— starting from just $20/month
      </>,
      <>
        <strong>Convenient alternative</strong>
        {" "}to Islamic Sunday school
      </>,
      <>
        <strong>1-on-1 personalised attention</strong>
        {" "}— not group classes
      </>,
      <>
        <strong>Monthly progress reports</strong>
        {" "}for parents
      </>,
      <>
        <strong>Free trial class</strong>
        {" "}— no commitment needed
      </>,
    ],
    coursesHeading: "Courses Available for USA Students",
    courses: [
      <>
        <Link href="/noorani-qaida-online" style={{ color: "#082c4c" }}><strong>Noorani Qaida</strong></Link>
        {" "}— for complete Quran beginners
      </>,
      <>
        <Link href="/quran-reading-course-online" style={{ color: "#082c4c" }}><strong>Quran Reading Course</strong></Link>
        {" "}— fluent reading with Tajweed
      </>,
      <>
        <Link href="/quran-tajweed-course-online" style={{ color: "#082c4c" }}><strong>Quran with Tajweed</strong></Link>
        {" "}— master proper recitation rules
      </>,
      <>
        <Link href="/quran-memorization-hifz-online" style={{ color: "#082c4c" }}><strong>Quran Memorization (Hifz)</strong></Link>
        {" "}— structured Hifz programme
      </>,
      <>
        <Link href="/tafseer-quran-course-online" style={{ color: "#082c4c" }}><strong>Tafseer e Quran</strong></Link>
        {" "}— understand Quranic meaning
      </>,
      <>
        <Link href="/quranic-arabic-course-online" style={{ color: "#082c4c" }}><strong>Quranic Arabic</strong></Link>
        {" "}— read and understand Arabic
      </>,
    ],
    feeHeading: "Monthly Fee for USA Students (USD)",
    packages: [
      {
        "name": "Bronze Package",
        "days": "3 Days Per Week",
        "price": "$20",
        "per": "/month",
        "features": [
          "12 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=3"
      },
      {
        "name": "Silver Package",
        "days": "4 Days Per Week",
        "price": "$25",
        "per": "/month",
        "features": [
          "16 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=4"
      },
      {
        "name": "Gold Package",
        "days": "5 Days Per Week",
        "price": "$30",
        "per": "/month",
        "features": [
          "20 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=5"
      }
    ],
    perks: ["Certified Tutors","1-on-1 Live Classes","Free Trial Class","All US Time Zones","USD Pricing from $20"],
    ctaLabel: "Book Free Trial — No Payment Required",
    faqHeading: "Frequently Asked Questions — USA Students",
    faqId: "faq-usa",
    faqs: [
      {
        "q": "Are all US time zones covered?",
        "a": "Yes. We cover EST, CST, MST and PST with morning, afternoon, and evening slots — 7 days a week — for students across all US states."
      },
      {
        "q": "Is the monthly fee in USD?",
        "a": "Yes. US students pay in USD. Plans start from $20/month for 3 classes per week. No registration fee — the trial class is completely free."
      },
      {
        "q": "Do you offer female Quran teachers?",
        "a": "Yes. Certified female Quran tutors are available for female students and children who prefer a female teacher. Simply request this during registration."
      },
      {
        "q": "Can my child join as a complete beginner?",
        "a": "Absolutely. We start with Noorani Qaida — covering Arabic letters, correct pronunciation, and basic Tajweed. Suitable for kids from age 4 and adults of all levels."
      },
      {
        "q": "How is this different from Islamic Sunday school?",
        "a": "Our sessions are live, 1-on-1, and available any day of the week — not just weekends. Your child receives personalised attention and progresses much faster than in group Sunday school classes."
      },
      {
        "q": "How do I enroll from the USA?",
        "a": "Send a WhatsApp message or fill in our registration form. We will contact you within 24 hours, assign a tutor, and schedule your free trial at your preferred US time zone."
      }
    ],
    serviceSchema: {
      "@type": "Service",
      "name": "Online Quran Classes in the USA",
      "description": "Live 1-on-1 online Quran classes for students in the USA with certified male and female tutors. Tajweed, Hifz, Noorani Qaida and more.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "HidayatulQuran Academy",
        "url": "https://www.hidayatulquran.com",
        "telephone": "+92-336-5398542"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "serviceType": "Online Quran Education",
      "offers": [
        {
          "@type": "Offer",
          "name": "Bronze Package — 3 Days/Week",
          "price": "20",
          "priceCurrency": "USD",
          "description": "12 classes per month, 30 min each, 1-on-1 live"
        },
        {
          "@type": "Offer",
          "name": "Silver Package — 4 Days/Week",
          "price": "25",
          "priceCurrency": "USD",
          "description": "16 classes per month, 30 min each, 1-on-1 live"
        },
        {
          "@type": "Offer",
          "name": "Gold Package — 5 Days/Week",
          "price": "30",
          "priceCurrency": "USD",
          "description": "20 classes per month, 30 min each, 1-on-1 live"
        }
      ]
    },
    faqSchema: [
      {
        "@type": "Question",
        "name": "Are online Quran classes available in all US time zones?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We cover EST, CST, MST and PST time zones with morning, afternoon, and evening slots — 7 days a week — to fit around school and work schedules across all US states."
        }
      },
      {
        "@type": "Question",
        "name": "Is the monthly fee in USD for US students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. US students pay in USD. Plans start from $20/month for 3 classes per week. No registration fee — the trial class is completely free."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer female Quran teachers for US students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Certified female Quran tutors are available for female students and children who prefer a female teacher. You can request this during registration."
        }
      },
      {
        "@type": "Question",
        "name": "Can my child join as a complete Quran beginner in the USA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We start with Noorani Qaida — the foundation course covering Arabic letters, correct pronunciation, and basic Tajweed. Suitable for kids from age 4 and adults of all levels."
        }
      },
      {
        "@type": "Question",
        "name": "How is this different from an Islamic Sunday school in the USA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our sessions are live, 1-on-1, and available any day of the week — not just weekends. Your child receives personalised attention and progresses much faster than in group Sunday school classes."
        }
      },
      {
        "@type": "Question",
        "name": "How do I enroll in online Quran classes in the USA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Send a WhatsApp message or fill in our registration form. We will contact you within 24 hours, assign a suitable tutor, and schedule your free trial at a time that works for your US time zone."
        }
      }
    ],
  },
  canada: {
    path: "/online-quran-classes-canada",
    title: "Online Quran Classes in Canada — Certified Tutors | HidayatulQuran Academy",
    description: "Join live 1-on-1 online Quran classes in Canada with certified male and female tutors. Tajweed, Hifz, Noorani Qaida for kids and adults in Toronto, Vancouver, Calgary and more. Free trial available.",
    keywords: "online Quran classes Canada, Quran tutor Canada, learn Quran online Canada, online Quran teacher Canada, Quran classes for kids Canada, Tajweed online Canada, Hifz classes Canada, female Quran teacher Canada, one to one Quran classes Canada, Noorani Qaida Canada, Islamic education online Canada",
    languages: {
      "en-ca": "/online-quran-classes-canada",
      "en-gb": "/online-quran-classes-uk",
      "en-us": "/online-quran-classes-usa",
      "en-ae": "/online-quran-classes-uae",
      "en-sa": "/online-quran-classes-saudi-arabia",
      "x-default": "/"
    },
    ogTitle: "Online Quran Classes in Canada — Certified Tutors | HidayatulQuran Academy",
    ogDescription: "Live 1-on-1 online Quran classes for Canadian students. Certified tutors, CAD pricing, flexible scheduling for all Canadian time zones. Free trial class available.",
    ogLocale: "en_CA",
    twitterTitle: "Online Quran Classes in Canada | HidayatulQuran Academy",
    twitterDescription: "Live 1-on-1 Quran classes for Canadian students. Certified tutors, CAD pricing, flexible scheduling. Free trial available.",
    ogImage: "/assets/img/hidayatulquran1.png",
    name: "Online Quran Classes in Canada",
    breadcrumb: "Online Quran Classes Canada",
    breadcrumbSchema: "Online Quran Classes Canada",
    image: "/assets/img/hidayatulquran1.png",
    imageAlt: "Online Quran classes for Canada students with certified tutors",
    whatsapp: "https://wa.me/923365398542?text=Assalamu%20Alaikum%2C%20I%20am%20from%20Canada%20and%20want%20to%20book%20a%20free%20trial%20Quran%20class.",
    introHeading: "Live 1-on-1 Online Quran Classes for Canadian Students",
    intro: [
      <>
        HidayatulQuran Academy offers certified{" "}
        <strong>online Quran classes for students across Canada</strong>
        {" "}— Toronto, Vancouver, Calgary, Ottawa, Montreal and beyond. Our tutors are available to fit all Canadian time zones:{" "}
        <strong>EST, CST, MST and PST</strong>
        , with flexible scheduling morning, afternoon, and evening.
      </>,
      <>
        Live 1-on-1 Zoom sessions covering{" "}
        <strong>Noorani Qaida, Quran Reading, Tajweed, Hifz, Tafseer</strong>
        {" "}and Quranic Arabic.{" "}
        <strong>Plans from CAD $35/month.</strong>
        {" "}Free trial class — no payment or commitment required.
      </>,
    ],
    whyHeading: "Why Canadian Muslims Choose HidayatulQuran",
    why: [
      <>
        <strong>All Canadian time zones</strong>
        {" "}— EST, CST, MST, PST available
      </>,
      <>
        <strong>Certified male &amp; female Quran tutors</strong>
      </>,
      <>
        <strong>CAD pricing</strong>
        {" "}— from $35/month, no hidden fees
      </>,
      <>
        <strong>Personalised 1-on-1 sessions</strong>
        {" "}— not group classes
      </>,
      <>
        <strong>Kids and adults welcome</strong>
        {" "}— all levels from scratch
      </>,
      <>
        <strong>Monthly progress reports</strong>
        {" "}sent to parents
      </>,
      <>
        <strong>Free trial class</strong>
        {" "}— no commitment, no payment
      </>,
    ],
    coursesHeading: "Courses Available for Canadian Students",
    courses: [
      <>
        <Link href="/noorani-qaida-online" style={{ color: "#082c4c" }}><strong>Noorani Qaida</strong></Link>
        {" "}— for complete Quran beginners
      </>,
      <>
        <Link href="/quran-reading-course-online" style={{ color: "#082c4c" }}><strong>Quran Reading Course</strong></Link>
        {" "}— fluent reading with Tajweed
      </>,
      <>
        <Link href="/quran-tajweed-course-online" style={{ color: "#082c4c" }}><strong>Quran with Tajweed</strong></Link>
        {" "}— master proper recitation rules
      </>,
      <>
        <Link href="/quran-memorization-hifz-online" style={{ color: "#082c4c" }}><strong>Quran Memorization (Hifz)</strong></Link>
        {" "}— structured Hifz programme
      </>,
      <>
        <Link href="/tafseer-quran-course-online" style={{ color: "#082c4c" }}><strong>Tafseer e Quran</strong></Link>
        {" "}— understand Quranic meaning
      </>,
      <>
        <Link href="/quranic-arabic-course-online" style={{ color: "#082c4c" }}><strong>Quranic Arabic</strong></Link>
        {" "}— read and understand Arabic
      </>,
    ],
    feeHeading: "Monthly Fee for Canadian Students (CAD)",
    packages: [
      {
        "name": "Bronze Package",
        "days": "3 Days Per Week",
        "price": "$35",
        "per": "CAD/month",
        "features": [
          "12 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=3"
      },
      {
        "name": "Silver Package",
        "days": "4 Days Per Week",
        "price": "$40",
        "per": "CAD/month",
        "features": [
          "16 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=4"
      },
      {
        "name": "Gold Package",
        "days": "5 Days Per Week",
        "price": "$45",
        "per": "CAD/month",
        "features": [
          "20 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=5"
      }
    ],
    perks: ["Certified Tutors","1-on-1 Live Classes","Free Trial Class","All Canadian Time Zones","CAD Pricing from $35"],
    ctaLabel: "Book Free Trial — No Payment Required",
    faqHeading: "Frequently Asked Questions — Canada Students",
    faqId: "faq-ca",
    faqs: [
      {
        "q": "Are all Canadian time zones covered?",
        "a": "Yes. We cover EST, CST, MST and PST — serving students across Toronto, Vancouver, Calgary, Ottawa, Montreal and all Canadian provinces with morning, afternoon, and evening slots."
      },
      {
        "q": "Is the monthly fee in CAD?",
        "a": "Yes. Canadian students pay in CAD. Plans start from $35 CAD/month for 3 classes per week. No registration fee — the trial class is completely free."
      },
      {
        "q": "Do you offer female Quran teachers?",
        "a": "Yes. Certified female Quran tutors are available for female students and children. Request a female teacher during registration — this preference is fully respected."
      },
      {
        "q": "Can my child join as a complete beginner from Canada?",
        "a": "Absolutely. We start with Noorani Qaida for complete beginners — Arabic letters, correct pronunciation, and basic Tajweed. Suitable for kids from age 4 and adults."
      },
      {
        "q": "What platform is used for online classes?",
        "a": "All classes are via Zoom. You only need a stable internet connection and a smartphone, tablet, or computer. Teachers use screen sharing and a digital whiteboard for interactive lessons."
      },
      {
        "q": "How do I enroll from Canada?",
        "a": "Send a WhatsApp message or fill in our registration form. We will contact you within 24 hours, assign a tutor, and book your free trial class at your preferred Canadian time zone."
      }
    ],
    serviceSchema: {
      "@type": "Service",
      "name": "Online Quran Classes in Canada",
      "description": "Live 1-on-1 online Quran classes for students in Canada with certified male and female tutors. Tajweed, Hifz, Noorani Qaida and more.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "HidayatulQuran Academy",
        "url": "https://www.hidayatulquran.com",
        "telephone": "+92-336-5398542"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Canada"
      },
      "serviceType": "Online Quran Education",
      "offers": [
        {
          "@type": "Offer",
          "name": "Bronze Package — 3 Days/Week",
          "price": "35",
          "priceCurrency": "CAD",
          "description": "12 classes per month, 30 min each, 1-on-1 live"
        },
        {
          "@type": "Offer",
          "name": "Silver Package — 4 Days/Week",
          "price": "40",
          "priceCurrency": "CAD",
          "description": "16 classes per month, 30 min each, 1-on-1 live"
        },
        {
          "@type": "Offer",
          "name": "Gold Package — 5 Days/Week",
          "price": "45",
          "priceCurrency": "CAD",
          "description": "20 classes per month, 30 min each, 1-on-1 live"
        }
      ]
    },
    faqSchema: [
      {
        "@type": "Question",
        "name": "Are online Quran classes available in all Canadian time zones?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We cover EST, CST, MST and PST — serving students across Toronto, Vancouver, Calgary, Ottawa, Montreal and all Canadian provinces with flexible morning, afternoon, and evening slots."
        }
      },
      {
        "@type": "Question",
        "name": "Is the monthly fee in CAD for Canadian students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Canadian students pay in CAD. Plans start from $35 CAD/month for 3 classes per week. No registration fee — the trial class is completely free."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer female Quran teachers for Canadian students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Certified female Quran tutors are available for female students and children. You can request a female teacher during registration — this preference is fully respected."
        }
      },
      {
        "@type": "Question",
        "name": "Can my child join as a complete Quran beginner from Canada?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We start with Noorani Qaida for complete beginners, covering Arabic letters, correct pronunciation (Makharij), and basic Tajweed rules. Suitable for kids from age 4 and adults."
        }
      },
      {
        "@type": "Question",
        "name": "What platform is used for online Quran classes in Canada?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All classes are conducted via Zoom. You only need a stable internet connection and a smartphone, tablet, or computer. Screen sharing and digital whiteboard are used for interactive learning."
        }
      },
      {
        "@type": "Question",
        "name": "How do I enroll in online Quran classes from Canada?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Send a WhatsApp message or fill in our registration form. We will contact you within 24 hours, assign a suitable tutor, and book your free trial class at your preferred Canadian time zone."
        }
      }
    ],
  },
  uae: {
    path: "/online-quran-classes-uae",
    title: "Online Quran Classes in UAE — Certified Tutors | HidayatulQuran Academy",
    description: "Join live 1-on-1 online Quran classes in UAE with certified male and female tutors. Tajweed, Hifz, Noorani Qaida for kids and adults in Dubai, Abu Dhabi, Sharjah and across the UAE. Free trial available.",
    keywords: "online Quran classes UAE, Quran tutor UAE, learn Quran online Dubai, online Quran teacher UAE, Quran classes for kids Dubai, Tajweed online UAE, Hifz classes Dubai, female Quran teacher UAE, one to one Quran classes UAE, Noorani Qaida UAE, Islamic education online Dubai",
    languages: {
      "en-ae": "/online-quran-classes-uae",
      "en-gb": "/online-quran-classes-uk",
      "en-us": "/online-quran-classes-usa",
      "en-ca": "/online-quran-classes-canada",
      "en-sa": "/online-quran-classes-saudi-arabia",
      "x-default": "/"
    },
    ogTitle: "Online Quran Classes in UAE — Certified Tutors | HidayatulQuran Academy",
    ogDescription: "Live 1-on-1 online Quran classes for UAE students in Dubai, Abu Dhabi, Sharjah. AED pricing, GST scheduling. Free trial class available.",
    ogLocale: "en_AE",
    twitterTitle: "Online Quran Classes in UAE | HidayatulQuran Academy",
    twitterDescription: "Live 1-on-1 Quran classes for UAE students. Certified tutors, AED pricing, GST time zone. Free trial available.",
    ogImage: "/assets/img/hidayatulquran1.png",
    name: "Online Quran Classes in UAE",
    breadcrumb: "Online Quran Classes UAE",
    breadcrumbSchema: "Online Quran Classes UAE",
    image: "/assets/img/hidayatulquran1.png",
    imageAlt: "Online Quran classes for UAE students with certified tutors",
    whatsapp: "https://wa.me/923365398542?text=Assalamu%20Alaikum%2C%20I%20am%20from%20the%20UAE%20and%20want%20to%20book%20a%20free%20trial%20Quran%20class.",
    introHeading: "Live 1-on-1 Online Quran Classes for Students in the UAE",
    intro: [
      <>
        HidayatulQuran Academy offers certified{" "}
        <strong>online Quran classes for students in the UAE</strong>
        {" "}— Dubai, Abu Dhabi, Sharjah, Ajman and across the Emirates. Our tutors are fully scheduled in{" "}
        <strong>Gulf Standard Time (GST, UTC+4)</strong>
        , with morning, afternoon, and evening slots available seven days a week.
      </>,
      <>
        All classes are live and one-to-one via Zoom. We teach{" "}
        <strong>Noorani Qaida, Quran Reading, Tajweed, Hifz, Tafseer</strong>
        {" "}and Quranic Arabic.{" "}
        <strong>Plans from AED 110/month.</strong>
        {" "}Free trial class — no payment required.
      </>,
    ],
    whyHeading: "Why UAE Students Choose HidayatulQuran",
    why: [
      <>
        <strong>Gulf Standard Time (GST)</strong>
        {" "}— tutors scheduled UTC+4
      </>,
      <>
        <strong>Certified male &amp; female Quran tutors</strong>
      </>,
      <>
        <strong>AED pricing</strong>
        {" "}— from AED 110/month
      </>,
      <>
        <strong>Available for expats and UAE nationals</strong>
      </>,
      <>
        <strong>Personalised 1-on-1 sessions</strong>
        {" "}— kids and adults
      </>,
      <>
        <strong>Monthly progress reports</strong>
        {" "}for parents
      </>,
      <>
        <strong>Free trial class</strong>
        {" "}— no commitment, no payment
      </>,
    ],
    coursesHeading: "Courses Available for UAE Students",
    courses: [
      <>
        <Link href="/noorani-qaida-online" style={{ color: "#082c4c" }}><strong>Noorani Qaida</strong></Link>
        {" "}— for complete Quran beginners
      </>,
      <>
        <Link href="/quran-reading-course-online" style={{ color: "#082c4c" }}><strong>Quran Reading Course</strong></Link>
        {" "}— fluent reading with Tajweed
      </>,
      <>
        <Link href="/quran-tajweed-course-online" style={{ color: "#082c4c" }}><strong>Quran with Tajweed</strong></Link>
        {" "}— master proper recitation rules
      </>,
      <>
        <Link href="/quran-memorization-hifz-online" style={{ color: "#082c4c" }}><strong>Quran Memorization (Hifz)</strong></Link>
        {" "}— structured Hifz programme
      </>,
      <>
        <Link href="/tafseer-quran-course-online" style={{ color: "#082c4c" }}><strong>Tafseer e Quran</strong></Link>
        {" "}— understand Quranic meaning
      </>,
      <>
        <Link href="/quranic-arabic-course-online" style={{ color: "#082c4c" }}><strong>Quranic Arabic</strong></Link>
        {" "}— read and understand Arabic
      </>,
    ],
    feeHeading: "Monthly Fee for UAE Students (AED)",
    packages: [
      {
        "name": "Bronze Package",
        "days": "3 Days Per Week",
        "price": "110",
        "per": "AED/month",
        "features": [
          "12 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=3"
      },
      {
        "name": "Silver Package",
        "days": "4 Days Per Week",
        "price": "140",
        "per": "AED/month",
        "features": [
          "16 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=4"
      },
      {
        "name": "Gold Package",
        "days": "5 Days Per Week",
        "price": "160",
        "per": "AED/month",
        "features": [
          "20 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=5"
      }
    ],
    perks: ["Certified Tutors","1-on-1 Live Classes","Free Trial Class","GST Time Zone","AED Pricing from 110"],
    ctaLabel: "Book Free Trial — No Payment Required",
    faqHeading: "Frequently Asked Questions — UAE Students",
    faqId: "faq-uae",
    faqs: [
      {
        "q": "Are classes available in Gulf Standard Time (GST)?",
        "a": "Yes. All UAE students are scheduled in GST (UTC+4). We offer morning, afternoon, and evening slots — 7 days a week — for students in Dubai, Abu Dhabi, Sharjah, Ajman and across the Emirates."
      },
      {
        "q": "Is the monthly fee in AED?",
        "a": "Yes. UAE students pay in AED. Plans start from AED 110/month for 3 classes per week. No registration fee — the trial class is completely free."
      },
      {
        "q": "Do you offer female Quran teachers?",
        "a": "Yes. Certified female Quran tutors are available for female students and children. Simply request a female teacher during registration."
      },
      {
        "q": "Are classes available for expats in the UAE?",
        "a": "Yes. Our online classes are open to everyone in the UAE — both UAE nationals and expats. Classes are taught in English, Urdu, and Arabic to accommodate all backgrounds."
      },
      {
        "q": "How long is each class?",
        "a": "Each class is 30 minutes, conducted live 1-on-1 via Zoom. You can choose 3, 4, or 5 sessions per week depending on your selected package."
      },
      {
        "q": "How do I enroll from the UAE?",
        "a": "Send a WhatsApp message or fill in our registration form. We will contact you within 24 hours, assign a tutor available in GST, and schedule your free trial at a convenient time."
      }
    ],
    serviceSchema: {
      "@type": "Service",
      "name": "Online Quran Classes in UAE",
      "description": "Live 1-on-1 online Quran classes for students in the UAE — Dubai, Abu Dhabi, Sharjah and beyond. Certified male and female tutors. Tajweed, Hifz, Noorani Qaida and more.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "HidayatulQuran Academy",
        "url": "https://www.hidayatulquran.com",
        "telephone": "+92-336-5398542"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United Arab Emirates"
      },
      "serviceType": "Online Quran Education",
      "offers": [
        {
          "@type": "Offer",
          "name": "Bronze Package — 3 Days/Week",
          "price": "110",
          "priceCurrency": "AED",
          "description": "12 classes per month, 30 min each, 1-on-1 live"
        },
        {
          "@type": "Offer",
          "name": "Silver Package — 4 Days/Week",
          "price": "140",
          "priceCurrency": "AED",
          "description": "16 classes per month, 30 min each, 1-on-1 live"
        },
        {
          "@type": "Offer",
          "name": "Gold Package — 5 Days/Week",
          "price": "160",
          "priceCurrency": "AED",
          "description": "20 classes per month, 30 min each, 1-on-1 live"
        }
      ]
    },
    faqSchema: [
      {
        "@type": "Question",
        "name": "Are online Quran classes available in Gulf Standard Time (GST)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All UAE students are scheduled in GST (UTC+4). We offer morning, afternoon, and evening slots — 7 days a week — for students in Dubai, Abu Dhabi, Sharjah, Ajman and across the Emirates."
        }
      },
      {
        "@type": "Question",
        "name": "Is the monthly fee in AED for UAE students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. UAE students pay in AED. Plans start from AED 110/month for 3 classes per week. No registration fee — the trial class is completely free."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer female Quran teachers for UAE students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Certified female Quran tutors are available for female students and children who prefer a female teacher. You can request this during registration."
        }
      },
      {
        "@type": "Question",
        "name": "Are classes available for expats living in the UAE?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our online classes are open to everyone in the UAE — both UAE nationals and expats. Classes are taught in English, Urdu, and Arabic to accommodate all backgrounds."
        }
      },
      {
        "@type": "Question",
        "name": "How long is each online Quran class for UAE students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Each class is 30 minutes, conducted live 1-on-1 via Zoom. You can choose 3, 4, or 5 sessions per week depending on your selected plan."
        }
      },
      {
        "@type": "Question",
        "name": "How do I enroll in online Quran classes from UAE?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Send a WhatsApp message or fill in our registration form. We will contact you within 24 hours, assign a tutor available in GST, and schedule your free trial class at a convenient time."
        }
      }
    ],
  },
  saudiArabia: {
    path: "/online-quran-classes-saudi-arabia",
    title: "Online Quran Classes in Saudi Arabia — Certified Tutors | HidayatulQuran Academy",
    description: "Join live 1-on-1 online Quran classes in Saudi Arabia with certified male and female tutors. Tajweed, Hifz, Noorani Qaida for kids and adults in Riyadh, Jeddah, Mecca and across KSA. Free trial available.",
    keywords: "online Quran classes Saudi Arabia, Quran tutor KSA, learn Quran online Riyadh, online Quran teacher Saudi Arabia, Quran classes for kids Riyadh, Tajweed online KSA, Hifz classes Saudi Arabia, female Quran teacher KSA, one to one Quran classes Jeddah, Noorani Qaida KSA, Islamic education online Saudi Arabia",
    languages: {
      "en-sa": "/online-quran-classes-saudi-arabia",
      "en-gb": "/online-quran-classes-uk",
      "en-us": "/online-quran-classes-usa",
      "en-ca": "/online-quran-classes-canada",
      "en-ae": "/online-quran-classes-uae",
      "x-default": "/"
    },
    ogTitle: "Online Quran Classes in Saudi Arabia — Certified Tutors | HidayatulQuran Academy",
    ogDescription: "Live 1-on-1 online Quran classes for students in Saudi Arabia. Certified tutors, SAR pricing, AST time zone scheduling. Free trial class available.",
    ogLocale: "en_SA",
    twitterTitle: "Online Quran Classes in Saudi Arabia | HidayatulQuran Academy",
    twitterDescription: "Live 1-on-1 Quran classes for KSA students. Certified tutors, SAR pricing, Arabia Standard Time. Free trial available.",
    ogImage: "/assets/img/hidayatulquran1.png",
    name: "Online Quran Classes in Saudi Arabia",
    breadcrumb: "Online Quran Classes Saudi Arabia",
    breadcrumbSchema: "Online Quran Classes Saudi Arabia",
    image: "/assets/img/hidayatulquran1.png",
    imageAlt: "Online Quran classes for Saudi Arabia students with certified tutors",
    whatsapp: "https://wa.me/923365398542?text=Assalamu%20Alaikum%2C%20I%20am%20from%20Saudi%20Arabia%20and%20want%20to%20book%20a%20free%20trial%20Quran%20class.",
    introHeading: "Live 1-on-1 Online Quran Classes for Students in Saudi Arabia",
    intro: [
      <>
        HidayatulQuran Academy offers certified{" "}
        <strong>online Quran classes for students across Saudi Arabia (KSA)</strong>
        {" "}— Riyadh, Jeddah, Mecca, Medina, Dammam and all cities. Our tutors are fully available in{" "}
        <strong>Arabia Standard Time (AST, UTC+3)</strong>
        {" "}with flexible morning, afternoon, and evening slots seven days a week — including after Maghrib and Isha times.
      </>,
      <>
        All classes are live and one-to-one via Zoom. We teach{" "}
        <strong>Noorani Qaida, Quran Reading, Tajweed, Hifz, Tafseer</strong>
        {" "}and Quranic Arabic.{" "}
        <strong>Plans from SAR 110/month.</strong>
        {" "}Free trial class — no payment required.
      </>,
    ],
    whyHeading: "Why KSA Students Choose HidayatulQuran",
    why: [
      <>
        <strong>Arabia Standard Time (AST)</strong>
        {" "}— tutors available UTC+3
      </>,
      <>
        <strong>Certified male &amp; female Quran tutors</strong>
        {" "}— Hafiz and Tajweed scholars
      </>,
      <>
        <strong>SAR pricing</strong>
        {" "}— from SAR 110/month, no hidden fees
      </>,
      <>
        <strong>Evening slots available</strong>
        {" "}— after Maghrib and Isha prayers
      </>,
      <>
        <strong>Personalised 1-on-1 sessions</strong>
        {" "}— kids and adults of all levels
      </>,
      <>
        <strong>Monthly progress reports</strong>
        {" "}sent to parents
      </>,
      <>
        <strong>Free trial class</strong>
        {" "}— no commitment, no payment required
      </>,
    ],
    coursesHeading: "Courses Available for KSA Students",
    courses: [
      <>
        <Link href="/noorani-qaida-online" style={{ color: "#082c4c" }}><strong>Noorani Qaida</strong></Link>
        {" "}— for complete Quran beginners
      </>,
      <>
        <Link href="/quran-reading-course-online" style={{ color: "#082c4c" }}><strong>Quran Reading Course</strong></Link>
        {" "}— fluent reading with Tajweed
      </>,
      <>
        <Link href="/quran-tajweed-course-online" style={{ color: "#082c4c" }}><strong>Quran with Tajweed</strong></Link>
        {" "}— master proper recitation rules
      </>,
      <>
        <Link href="/quran-memorization-hifz-online" style={{ color: "#082c4c" }}><strong>Quran Memorization (Hifz)</strong></Link>
        {" "}— structured Hifz programme
      </>,
      <>
        <Link href="/tafseer-quran-course-online" style={{ color: "#082c4c" }}><strong>Tafseer e Quran</strong></Link>
        {" "}— understand Quranic meaning
      </>,
      <>
        <Link href="/quranic-arabic-course-online" style={{ color: "#082c4c" }}><strong>Quranic Arabic</strong></Link>
        {" "}— read and understand Arabic directly
      </>,
    ],
    feeHeading: "Monthly Fee for Saudi Arabia Students (SAR)",
    packages: [
      {
        "name": "Bronze Package",
        "days": "3 Days Per Week",
        "price": "110",
        "per": "SAR/month",
        "features": [
          "12 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=3"
      },
      {
        "name": "Silver Package",
        "days": "4 Days Per Week",
        "price": "140",
        "per": "SAR/month",
        "features": [
          "16 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=4"
      },
      {
        "name": "Gold Package",
        "days": "5 Days Per Week",
        "price": "160",
        "per": "SAR/month",
        "features": [
          "20 Classes Per Month",
          "30 Minutes Each",
          "1-on-1 Live Session",
          "Free Registration"
        ],
        "href": "/registration?plan=5"
      }
    ],
    perks: ["Certified Tutors","1-on-1 Live Classes","Free Trial Class","Arabia Standard Time","SAR Pricing from 110"],
    ctaLabel: "Book Free Trial — No Payment Required",
    faqHeading: "Frequently Asked Questions — Saudi Arabia Students",
    faqId: "faq-ksa",
    faqs: [
      {
        "q": "Are classes available in Arabia Standard Time (AST)?",
        "a": "Yes. All our KSA students are scheduled in AST (UTC+3). We offer morning, afternoon, and evening slots — including after Maghrib and Isha prayers to fit your daily routine."
      },
      {
        "q": "Is the fee in Saudi Riyals (SAR)?",
        "a": "Yes. KSA students pay in SAR. Plans start from SAR 110/month for 3 classes per week. There is no registration fee and the trial class is completely free."
      },
      {
        "q": "Do you have female Quran tutors for sisters?",
        "a": "Yes. We have certified female Quran tutors available for female students and children. You can request a female teacher during registration — this is fully respected."
      },
      {
        "q": "Can my child join if they are a complete beginner?",
        "a": "Absolutely. We start with Noorani Qaida for complete beginners — covering Arabic letters, correct pronunciation (Makharij) and basic Tajweed before moving on to full Quran reading."
      },
      {
        "q": "What platform is used for online classes?",
        "a": "All classes are conducted via Zoom. You only need a stable internet connection and a smartphone, tablet, or computer. Our teachers use screen sharing and a digital whiteboard for interactive lessons."
      },
      {
        "q": "How do I enroll from Saudi Arabia?",
        "a": "Send us a WhatsApp message or fill in the registration form. We will contact you within 24 hours, assign a suitable tutor, and schedule your free trial class at a time that suits you in KSA."
      }
    ],
    serviceSchema: {
      "@type": "Service",
      "name": "Online Quran Classes in Saudi Arabia",
      "description": "Live 1-on-1 online Quran classes for students in Saudi Arabia — Riyadh, Jeddah, Mecca, Medina and beyond. Certified male and female tutors. Tajweed, Hifz, Noorani Qaida and more.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "HidayatulQuran Academy",
        "url": "https://www.hidayatulquran.com",
        "telephone": "+92-336-5398542"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Saudi Arabia"
      },
      "serviceType": "Online Quran Education",
      "offers": [
        {
          "@type": "Offer",
          "name": "Bronze Package — 3 Days/Week",
          "price": "110",
          "priceCurrency": "SAR",
          "description": "12 classes per month, 30 min each, 1-on-1 live"
        },
        {
          "@type": "Offer",
          "name": "Silver Package — 4 Days/Week",
          "price": "140",
          "priceCurrency": "SAR",
          "description": "16 classes per month, 30 min each, 1-on-1 live"
        },
        {
          "@type": "Offer",
          "name": "Gold Package — 5 Days/Week",
          "price": "160",
          "priceCurrency": "SAR",
          "description": "20 classes per month, 30 min each, 1-on-1 live"
        }
      ]
    },
    faqSchema: [
      {
        "@type": "Question",
        "name": "Are online Quran classes available in Arabia Standard Time (AST)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All KSA students are scheduled in AST (UTC+3). We offer morning, afternoon, and evening slots — including after Maghrib and Isha prayers — 7 days a week across Riyadh, Jeddah, Mecca, Medina and all Saudi cities."
        }
      },
      {
        "@type": "Question",
        "name": "Is the monthly fee in SAR for Saudi Arabia students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. KSA students pay in SAR. Plans start from SAR 110/month for 3 classes per week. No registration fee — the trial class is completely free."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer female Quran teachers for sisters in Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Certified female Quran tutors are available for female students and children. This preference is fully respected — simply request a female teacher during registration."
        }
      },
      {
        "@type": "Question",
        "name": "Can my child join as a complete Quran beginner from Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We start with Noorani Qaida for complete beginners — covering Arabic letter recognition, correct pronunciation (Makharij), and basic Tajweed rules. Suitable for kids from age 4 and adults."
        }
      },
      {
        "@type": "Question",
        "name": "What platform is used for online Quran classes in Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All classes are conducted via Zoom. You only need a stable internet connection and a smartphone, tablet, or computer. Teachers use screen sharing and a digital whiteboard for interactive lessons."
        }
      },
      {
        "@type": "Question",
        "name": "How do I enroll in online Quran classes from Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Send us a WhatsApp message or fill in our registration form. We will contact you within 24 hours, assign a suitable tutor available in AST, and schedule your free trial class at your preferred time."
        }
      }
    ],
  },
} satisfies Record<string, CountryContent>;

// Structured data (schema.org) published on the home page.

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "HidayatulQuran Academy",
  "description": "Online Quran Academy offering one-to-one live Quran classes with certified male and female tutors for kids and adults worldwide",
  "url": "https://www.hidayatulquran.com",
  "logo": "https://www.hidayatulquran.com/assets/img/hidayatulquran1.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shahfaisal Colony, Near Airport",
    "addressLocality": "Karachi",
    "addressRegion": "Sindh",
    "addressCountry": "PK"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+92-336-5398542",
      "contactType": "customer service",
      "availableLanguage": [
        "English",
        "Urdu",
        "Arabic"
      ]
    },
    {
      "@type": "ContactPoint",
      "telephone": "+44-7376282389",
      "contactType": "customer service",
      "areaServed": "GB",
      "availableLanguage": [
        "English"
      ]
    }
  ],
  "email": "info@hidayatulquran.com",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 5,
    "reviewCount": 50,
    "bestRating": 5,
    "worstRating": 1
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Online Quran Courses",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "Noorani Qaida Online",
          "url": "https://www.hidayatulquran.com/noorani-qaida-online"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "Quran Reading Course",
          "url": "https://www.hidayatulquran.com/quran-reading-course-online"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "Quran with Tajweed",
          "url": "https://www.hidayatulquran.com/quran-tajweed-course-online"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "Quran Memorization (Hifz)",
          "url": "https://www.hidayatulquran.com/quran-memorization-hifz-online"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "Tafseer e Quran",
          "url": "https://www.hidayatulquran.com/tafseer-quran-course-online"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "Quranic Arabic Course",
          "url": "https://www.hidayatulquran.com/quranic-arabic-course-online"
        }
      }
    ]
  },
  "sameAs": [
    "https://www.facebook.com/profile.php?id=61586928376019",
    "https://www.instagram.com/hidayatulquranofficiall/",
    "https://www.youtube.com/channel/UCDiUcDx4tqPCqvENApO9Gvg"
  ]
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who can join HidayatulQuran Academy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Anyone can join our academy, including children, adults, beginners, and advanced learners. We also welcome new Muslims who want to learn the Quran from scratch."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer a free trial online Quran class?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer a free trial class so students and parents can experience our teaching style before enrolling. No payment is required for the trial."
      }
    },
    {
      "@type": "Question",
      "name": "Are the Quran classes live or recorded?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All our classes are live, one-to-one online sessions conducted via Zoom or other online platforms for effective learning."
      }
    },
    {
      "@type": "Question",
      "name": "Do you have female Quran teachers online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we have certified female Quran tutors available for female students and children who prefer a female teacher."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer online Quran classes in the USA, UK, and Canada?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer flexible online Quran classes for students in the USA, UK, Canada, Australia, UAE, and worldwide. Our flexible scheduling accommodates all time zones."
      }
    },
    {
      "@type": "Question",
      "name": "What Quran courses do you offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer Noorani Qaida, Quran Reading Course, Quran with Tajweed, Quran Memorization (Hifz), Tafseer e Quran, and Quranic Arabic Course."
      }
    },
    {
      "@type": "Question",
      "name": "How long is each online Quran class?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Each class usually lasts 30 to 45 minutes, depending on the course and student's learning level."
      }
    },
    {
      "@type": "Question",
      "name": "How do I enroll in online Quran classes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can enroll by filling out our online registration form or contacting us via WhatsApp or email. Our support team will guide you through the process."
      }
    }
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "HidayatulQuran Academy",
  "url": "https://www.hidayatulquran.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.hidayatulquran.com/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

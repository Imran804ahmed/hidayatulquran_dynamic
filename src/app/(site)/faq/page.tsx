import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import FaqList, { type FaqEntry } from "@/components/ui/FaqList";
import { Reveal } from "@/components/motion/Reveal";
import { SITE, WHATSAPP_TRIAL } from "@/config/site";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  path: "/faq",
  title: "FAQ — Online Quran Classes Questions Answered | HidayatulQuran Academy",
  description: "Get answers to common questions about our online Quran classes. Free trial, female tutors, Tajweed, Hifz, fees, scheduling and more. HidayatulQuran Academy.",
  ogDescription: "Answers to common questions about our online Quran classes — free trial, female tutors, Tajweed, scheduling, fees and more.",
  twitterTitle: "FAQ — Online Quran Classes | HidayatulQuran Academy",
  twitterDescription: "Common questions about our 1-on-1 online Quran classes answered — free trial, female tutors, Tajweed, scheduling and more.",
});

/** Visible questions and answers (same wording as before the redesign). */
const ABOUT_CLASSES: FaqEntry[] = [
  { q: "Who can join Hidayat-ul-Quran Academy?", a: "Anyone can join our academy, including children, adults, beginners, and advanced learners. We also welcome new Muslims who want to learn the Quran from scratch." },
  { q: "Do you offer a free trial class?", a: "Yes, we offer a free trial class so students and parents can experience our teaching style before enrolling." },
  { q: "Are the classes live or recorded?", a: "All our classes are live, one-to-one online sessions conducted via Zoom or other online platforms for effective learning." },
  { q: "What languages are used for teaching?", a: "Our teachers teach in English, Urdu, and Arabic, making learning easy for students worldwide." },
  { q: "How long is each class?", a: "Each class usually lasts 30 to 45 minutes, depending on the course and student’s learning level." },
];

const ENROLMENT: FaqEntry[] = [
  { q: "How do I enroll?", a: "You can enroll by filling out our online registration form or contacting us via WhatsApp or email. Our support team will guide you through the process." },
  { q: "Do you monitor student progress?", a: "Yes, we regularly track student progress, provide feedback, and help students improve their Quran recitation and understanding." },
  { q: "What equipment is required for online classes?", a: "You only need a stable internet connection, a computer or mobile device, and Zoom or Microsoft Teams installed." },
  { q: "Is the learning environment safe and Islamic?", a: "Yes, we maintain a respectful, disciplined, and Islamic learning environment at all times. Parents are welcome to observe classes." },
  { q: "Can class schedules be changed later?", a: "Yes, class schedules can be adjusted with prior notice based on availability." },
];

export default function Page() {
  return (
    <div className="hq-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Who can join HidayatulQuran Academy?", "acceptedAnswer": { "@type": "Answer", "text": "Anyone can join our academy, including children, adults, beginners, and advanced learners. We also welcome new Muslims who want to learn the Quran from scratch." } },
          { "@type": "Question", "name": "Do you offer a free trial online Quran class?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer a free trial class so students and parents can experience our teaching style before enrolling. No payment is required." } },
          { "@type": "Question", "name": "Are the Quran classes live or recorded?", "acceptedAnswer": { "@type": "Answer", "text": "All our classes are live, one-to-one online sessions conducted via Zoom or other online platforms for effective learning." } },
          { "@type": "Question", "name": "Do you monitor student progress?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we regularly track student progress, provide feedback, and help students improve their Quran recitation and understanding." } },
          { "@type": "Question", "name": "What equipment is required for online Quran classes?", "acceptedAnswer": { "@type": "Answer", "text": "You only need a stable internet connection, a computer or mobile device, and Zoom or Microsoft Teams installed." } },
          { "@type": "Question", "name": "What languages are used for teaching?", "acceptedAnswer": { "@type": "Answer", "text": "Our teachers teach in English, Urdu, and Arabic, making learning easy for students worldwide." } },
          { "@type": "Question", "name": "How long is each class?", "acceptedAnswer": { "@type": "Answer", "text": "Each class usually lasts 30 to 45 minutes, depending on the course and student's learning level." } },
          { "@type": "Question", "name": "How do I enroll in online Quran classes?", "acceptedAnswer": { "@type": "Answer", "text": "You can enroll by filling out our online registration form or contacting us via WhatsApp or email. Our support team will guide you through the process." } },
          { "@type": "Question", "name": "Is the learning environment safe and Islamic?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we maintain a respectful, disciplined, and Islamic learning environment at all times. Parents are welcome to observe classes." } },
          { "@type": "Question", "name": "Can class schedules be changed later?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, class schedules can be adjusted with prior notice based on availability." } },
        ],
      }} />
      <main id="main">
        <section className={`hq-section hq-section--sand ${styles.head}`} aria-labelledby="page-heading">
          <div className="hq-container hq-enter">
            <nav aria-label="Breadcrumb" className="hq-breadcrumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li aria-current="page">FAQ</li>
              </ol>
            </nav>
            <p className="hq-eyebrow">FAQ</p>
            <h1 id="page-heading" className="hq-h1">Frequently asked questions</h1>
            <p className={`hq-lead ${styles.lead}`}>Online Quran classes — your questions answered.</p>
          </div>
        </section>

        <section id="faq" className="hq-section" aria-label="Questions and answers">
          <div className={`hq-container ${styles.columns}`}>
            <Reveal>
              <h2 className={`hq-h3 ${styles.groupTitle}`}>About the classes</h2>
              <FaqList items={ABOUT_CLASSES} />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className={`hq-h3 ${styles.groupTitle}`}>Enrolment and support</h2>
              <FaqList items={ENROLMENT} />
            </Reveal>
          </div>
        </section>

        <section className="hq-section hq-section--dark hq-band" aria-labelledby="help-heading">
          <Reveal className={`hq-container ${styles.help}`}>
            <h2 id="help-heading" className="hq-h2">Still have a question?</h2>
            <p className="hq-lead">
              Message us on WhatsApp or email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, or register and ask during your free trial class.
            </p>
            <div className={`hq-btn-row ${styles.helpButtons}`}>
              <Link href="/registration" className="hq-btn hq-btn--gold">Register for a free trial</Link>
              <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer" className="hq-btn hq-btn--ghost-light">
                <i className="bi bi-whatsapp" aria-hidden="true"></i> Ask on WhatsApp<span className="hq-visually-hidden"> (opens in a new tab)</span>
              </a>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}

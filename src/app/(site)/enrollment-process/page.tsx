import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import SiteImage from "@/components/ui/SiteImage";
import FaqList, { type FaqEntry } from "@/components/ui/FaqList";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { WHATSAPP_TRIAL } from "@/config/site";
import { CATALOG } from "@/content/course-catalog";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  path: "/enrollment-process",
  title: "Enrollment Process — How to Join Online Quran Classes | HidayatulQuran Academy",
  description: "Learn how to enroll in online Quran classes at HidayatulQuran Academy in 3 easy steps: Book a free demo class, complete registration, and set your class schedule. Start today!",
  ogDescription: "Join HidayatulQuran Academy in 3 simple steps. Book a free demo class, register with ease, and choose your preferred schedule. Free trial — no payment required.",
  image: "/assets/img/ProccessMethod_hidayatulquran_Academy.png",
});

const STEPS = [
  {
    icon: "bi-calendar2-check",
    title: "Book a free demo class",
    text: "Experience our teaching style before you commit. We offer a completely free, one-to-one live demo class so you can see how we teach, how we communicate, and what your child or you will experience in every session.",
    points: ["One-to-one live demo session", "Quran level assessment before class", "No obligation after demo", "Clear explanation of the learning plan", "Zero payment required"],
  },
  {
    icon: "bi-person-check",
    title: "Complete registration",
    text: "After the demo, if you are happy with the class, our team will walk you through a quick and easy registration. No complicated forms — just a short conversation on WhatsApp or via our website contact form.",
    points: ["Contact us via WhatsApp or website", "Student level evaluation", "Choose your preferred course", "Class time confirmation", "Quick enrollment with full guidance"],
  },
  {
    icon: "bi-clock",
    title: "Set your class schedule",
    text: "We work around your routine — not the other way around. Once enrolled, choose your preferred days and timings. Our classes are available 24/7 and cover all major time zones across the globe.",
    points: ["Choose days and timings yourself", "Weekday and weekend options", "Time-zone friendly scheduling", "Easy rescheduling support", "Classes 24/7 — 365 days a year"],
  },
];

const DEMO_POINTS = ["Real 1-on-1 session", "Level assessment", "Course recommendation", "No obligation", "Certified male or female tutor", "Via Zoom / Google Meet"];

const QUESTIONS: FaqEntry[] = [
  { q: "Is the demo class really free?", a: "Yes, 100% free. No credit card, no payment, no hidden charges. The demo class is our way of letting you experience the quality of our teaching before any commitment." },
  {
    q: "How do I contact you to book the demo?",
    a: <>The quickest way is via WhatsApp — click the &quot;Book Free Trial Class&quot; button on this page. You can also fill out the contact form on our website or email us at <a href="mailto:info@hidayatulquran.com">info@hidayatulquran.com</a>.</>,
  },
  { q: "Can I choose a male or female tutor?", a: "Yes. We have certified male and female Quran tutors. Just let us know your preference when you contact us and we will match you accordingly." },
  { q: "What if the demo timing doesn't suit me?", a: "No problem — we offer flexible demo timings to accommodate students in the USA, UK, Canada, UAE, Australia, and all other time zones. Just tell us your available time and we will find a slot." },
  { q: "How long does registration take?", a: "Registration is quick — usually done within the same WhatsApp conversation. Once you decide to enroll, our team confirms your course, tutor, and class timing in minutes." },
  { q: "Can I change my class schedule after enrolling?", a: "Yes. We provide flexible rescheduling support. If your routine changes, simply inform us in advance and we will adjust your class timings with no hassle." },
];

export default function Page() {
  return (
    <div className="hq-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Enroll in Online Quran Classes at HidayatulQuran Academy",
        "description": "Enroll in 3 easy steps: Book a free demo class, complete registration, and set your class schedule.",
        "step": [
          { "@type": "HowToStep", "name": "Book a Free Demo Class", "text": "Contact us via WhatsApp or website to book your free one-to-one demo class. No payment required." },
          { "@type": "HowToStep", "name": "Complete Registration", "text": "Share student details, choose a course, and confirm your preferred class time with our team." },
          { "@type": "HowToStep", "name": "Set Your Class Schedule", "text": "Pick the days and timings that suit your routine. Weekend and weekday options available for all time zones." },
        ],
      }} />
      <main id="main">
        <section className={`hq-section hq-section--sand ${styles.head}`} aria-labelledby="page-heading">
          <div className={`hq-container ${styles.headGrid}`}>
            <div className="hq-enter">
              <nav aria-label="Breadcrumb" className="hq-breadcrumb">
                <ol>
                  <li><Link href="/">Home</Link></li>
                  <li aria-current="page">How it works</li>
                </ol>
              </nav>
              <p className="hq-eyebrow">Enrollment process</p>
              <h1 id="page-heading" className="hq-h1">Join Hidayatul Quran Academy in 3 simple steps</h1>
              <p className={`hq-lead ${styles.lead}`}>
                Getting started with our <strong>online Quran classes</strong> is quick, simple, and completely free to try. We
                designed our enrollment process to be clear and stress-free for parents, students, and adults worldwide — from
                the <strong>USA, UK, Canada, UAE, Australia</strong>, and beyond.
              </p>
              <p className={styles.para}>
                No complex forms, no upfront fees. Just reach out on <strong>WhatsApp</strong>, book your{" "}
                <strong>free demo class</strong>, and start learning the Quran with a certified tutor at a time that suits you.
              </p>
              <div className={`hq-btn-row ${styles.ctas}`}>
                <Link href="/registration" className="hq-btn hq-btn--primary">Register for a free trial</Link>
                <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer" className="hq-btn hq-btn--secondary">
                  <i className="bi bi-whatsapp" aria-hidden="true"></i> Book Free Trial Class<span className="hq-visually-hidden"> on WhatsApp (opens in a new tab)</span>
                </a>
              </div>
            </div>
            <div className={`hq-enter-art ${styles.headArt}`}>
              <SiteImage src="/assets/img/ProccessMethod_hidayatulquran_Academy.png" alt="HidayatulQuran Academy enrollment process illustration" className={styles.headImage} loading="eager" sizes="(max-width: 992px) 100vw, 46vw" />
            </div>
          </div>
        </section>

        <section className="hq-section" aria-labelledby="steps-heading">
          <div className="hq-container">
            <Reveal className="hq-section-head">
              <p className="hq-eyebrow">How it works</p>
              <h2 id="steps-heading" className="hq-h2">Your 3-step path to learning the Quran online</h2>
            </Reveal>
            <RevealGroup as="ol" className={styles.steps}>
              {STEPS.map((s, i) => (
                <li key={s.title} className={styles.step}>
                  <div className={styles.stepTop}>
                    <span className={styles.stepNum} aria-hidden="true">{i + 1}</span>
                    <i className={`bi ${s.icon} ${styles.stepIcon}`} aria-hidden="true"></i>
                  </div>
                  <h3 className={styles.stepTitle}>
                    <span className="hq-visually-hidden">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className={styles.stepText}>{s.text}</p>
                  <ul className={`hq-checklist ${styles.stepList}`}>
                    {s.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                </li>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section className="hq-section hq-section--sand" aria-labelledby="demo-heading">
          <div className={`hq-container ${styles.demo}`}>
            <Reveal className={styles.demoArt}>
              <SiteImage src="/assets/img/Specialities1_hidayatulquran_Academy.png" alt="HidayatulQuran teaching specialities" className={styles.demoImage} sizes="(max-width: 992px) 100vw, 46vw" />
            </Reveal>
            <Reveal>
              <p className="hq-eyebrow">Free demo class</p>
              <h2 id="demo-heading" className="hq-h2">What happens in the free demo class?</h2>
              <p className={styles.para}>
                Our free demo class is a real class — not a sales pitch. A certified Quran tutor will conduct a proper one-to-one
                session and assess the student&apos;s current Quran level. By the end, you will have a clear picture of which course
                is the right fit, how the sessions work, and what progress to expect.
              </p>
              <ul className={`hq-checklist ${styles.demoPoints}`}>
                {DEMO_POINTS.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="hq-section" aria-labelledby="questions-heading">
          <div className={`hq-container ${styles.questions}`}>
            <Reveal className="hq-section-head">
              <p className="hq-eyebrow">Common questions</p>
              <h2 id="questions-heading" className="hq-h2">Everything you need to know before enrolling</h2>
            </Reveal>
            <Reveal>
              <FaqList items={QUESTIONS} className={styles.qList} />
            </Reveal>
            <p className={styles.more}>
              More answers on the <Link href="/faq" className="hq-link">FAQ page</Link>.
            </p>
          </div>
        </section>

        <section className="hq-section hq-section--dark hq-band" aria-labelledby="courses-heading">
          <Reveal className={`hq-container ${styles.coursesBlock}`}>
            <h2 id="courses-heading" className="hq-h2">Explore our online Quran courses</h2>
            <ul className={styles.courseLinks}>
              {CATALOG.map((c) => (
                <li key={c.slug}>
                  <Link href={c.path} className={styles.courseLink}>
                    <i className="bi bi-book" aria-hidden="true"></i> {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={`hq-btn-row ${styles.coursesCtas}`}>
              <Link href="/registration" className="hq-btn hq-btn--gold">Register for a free trial</Link>
              <Link href="/courses" className="hq-btn hq-btn--ghost-light">Compare all courses</Link>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}

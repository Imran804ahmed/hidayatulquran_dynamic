import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import RegistrationForm from "@/components/forms/RegistrationForm";
import NextSteps from "@/components/course/NextSteps";
import { SITE, WHATSAPP_TRIAL } from "@/config/site";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  path: "/registration",
  title: "Register for Online Quran Classes — Free Trial | HidayatulQuran Academy",
  description: "Register for live 1-on-1 online Quran classes at HidayatulQuran Academy. Choose your course, preferred time, and book your free trial class today. Kids and adults welcome — USA, UK, Canada, UAE.",
  ogTitle: "Register for Online Quran Classes | HidayatulQuran Academy",
  ogDescription: "Sign up for live 1-on-1 online Quran classes. Choose your course and time slot. Free trial available — no payment required.",
  twitterDescription: "Sign up for live 1-on-1 online Quran classes. Free trial — no payment required. Kids and adults welcome.",
});

export default function Page() {
  return (
    <div className={`hq-page ${styles.page}`}>
      <main id="main">
        <section className={`hq-section--sand ${styles.head}`} aria-labelledby="page-heading">
          <div className="hq-container hq-enter">
            <nav aria-label="Breadcrumb" className="hq-breadcrumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li aria-current="page">Registration</li>
              </ol>
            </nav>
            <h1 id="page-heading" className="hq-h1">Register for a free trial class</h1>
            <p className={`hq-lead ${styles.lead}`}>
              Tell us about the student and the course you are interested in. No payment is needed to register.
            </p>
          </div>
        </section>

        <div className={`hq-container ${styles.layout}`}>
          <div className={styles.formCol}>
            <h2 id="form-heading" className="hq-visually-hidden">Registration form</h2>
            <RegistrationForm />
          </div>
          <aside className={styles.aside} aria-labelledby="next-heading">
            <div className={styles.panel}>
              <h2 id="next-heading" className={styles.panelTitle}>What happens next</h2>
              <NextSteps compact />
            </div>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Need help?</h2>
              <ul className={styles.help}>
                <li>
                  <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-whatsapp" aria-hidden="true"></i> Message us on WhatsApp<span className="hq-visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`}>
                    <i className="bi bi-envelope" aria-hidden="true"></i> {SITE.email}
                  </a>
                </li>
                <li>
                  <Link href="/faq">
                    <i className="bi bi-question-circle" aria-hidden="true"></i> Read the FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

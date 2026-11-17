import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { WHATSAPP_TRIAL } from "@/config/site";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  path: "/registration",
  title: "Register for Online Quran Classes — Free Trial | HidayatulQuran Academy",
  description: "Register for live 1-on-1 online Quran classes at HidayatulQuran Academy. Choose your course, preferred time, and book your free trial class today. Kids and adults welcome — USA, UK, Canada, UAE.",
  keywords: "online Quran academy, Quran education, learn Quran, Tajweed, Quran classes, Quranic studies, Hidayatul Quran, Quran lessons, Quran online, Islamic studies, USA, UK, KSA, Germany, Canada, UAE, Expert Tutors, Personalized Attention, Student Progress Monitoring, Structured Learning Material, Flexible Class Scheduling, Monthly Progress Reports, 24/7 Availability, Reasonable Price, Noorani Qaida, Quran Reading Course, Quran with Tajweed, Quran Memorization, Tafseer e Quran Course, Quranic Arabic Course",
  ogTitle: "Register for Online Quran Classes | HidayatulQuran Academy",
  ogDescription: "Sign up for live 1-on-1 online Quran classes. Choose your course and time slot. Free trial available — no payment required.",
  twitterDescription: "Sign up for live 1-on-1 online Quran classes. Free trial — no payment required. Kids and adults welcome.",
});

export default function Page() {
  return (
    <>
      <main id="main" className={styles.page}>
        <section className="breadcrumbs" style={{ marginTop: "70px" }}>
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li>Registration</li>
            </ol>
            <h1 className={styles.pageTitle}><strong>Book a Free Trial Quran Class</strong></h1>
          </div>
        </section>
        <section id="blog" className="blog">
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="blog-comments">
                <div className="reply-form">
                  <h2 className="h4"><strong>Registration form</strong></h2>
                  <p>
                    Fill in this form and our team will contact you on WhatsApp or email to arrange your free trial class.
                    No payment is required. Fields marked <span className="form-req" aria-hidden="true">*</span> are required.
                  </p>
                  <p className="small">
                    Prefer to chat? <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer">Book your free trial on WhatsApp</a> instead.
                  </p>
                  <RegistrationForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

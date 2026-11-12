import Link from "next/link";
import { englishAlternates, pageMetadata } from "@/lib/seo";
import RegistrationForm from "@/components/forms/RegistrationForm";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  path: "/registration",
  title: "Register for Online Quran Classes — Free Trial | HidayatulQuran Academy",
  description: "Register for live 1-on-1 online Quran classes at HidayatulQuran Academy. Choose your course, preferred time, and book your free trial class today. Kids and adults welcome — USA, UK, Canada, UAE.",
  keywords: "online Quran academy, Quran education, learn Quran, Tajweed, Quran classes, Quranic studies, Hidayatul Quran, Quran lessons, Quran online, Islamic studies, USA, UK, KSA, Germany, Canada, UAE, Expert Tutors, Personalized Attention, Student Progress Monitoring, Structured Learning Material, Flexible Class Scheduling, Monthly Progress Reports, 24/7 Availability, Reasonable Price, Noorani Qaida, Quran Reading Course, Quran with Tajweed, Quran Memorization, Tafseer e Quran Course, Quranic Arabic Course",
  ogTitle: "Register for Online Quran Classes | HidayatulQuran Academy",
  ogDescription: "Sign up for live 1-on-1 online Quran classes. Choose your course and time slot. Free trial available — no payment required.",
  twitterDescription: "Sign up for live 1-on-1 online Quran classes. Free trial — no payment required. Kids and adults welcome.",
  languages: englishAlternates("/registration"),
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
            <h2><strong>Registration</strong></h2>
          </div>
        </section>
        <section id="blog" className="blog">
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="blog-comments">
                <div className="reply-form">
                  <h4><strong>REGISTRATION FORM</strong></h4>
                  <p>Your email address will not be published. Required fields are marked *</p>
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

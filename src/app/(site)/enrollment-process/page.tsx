import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import styles from "./page.module.css";
import SiteImage from "@/components/ui/SiteImage";

export const metadata = pageMetadata({
  path: "/enrollment-process",
  title: "Enrollment Process — How to Join Online Quran Classes | HidayatulQuran Academy",
  description: "Learn how to enroll in online Quran classes at HidayatulQuran Academy in 3 easy steps: Book a free demo class, complete registration, and set your class schedule. Start today!",
  ogDescription: "Join HidayatulQuran Academy in 3 simple steps. Book a free demo class, register with ease, and choose your preferred schedule. Free trial — no payment required.",
  image: "/assets/img/ProccessMethod_hidayatulquran_Academy.png",
});

export default function Page() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Enroll in Online Quran Classes at HidayatulQuran Academy",
        "description": "Enroll in 3 easy steps: Book a free demo class, complete registration, and set your class schedule.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Book a Free Demo Class",
            "text": "Contact us via WhatsApp or website to book your free one-to-one demo class. No payment required."
          },
          {
            "@type": "HowToStep",
            "name": "Complete Registration",
            "text": "Share student details, choose a course, and confirm your preferred class time with our team."
          },
          {
            "@type": "HowToStep",
            "name": "Set Your Class Schedule",
            "text": "Pick the days and timings that suit your routine. Weekend and weekday options available for all time zones."
          }
        ]
      }} />
      <main id="main" className={styles.page}>
        <section className="breadcrumbs" style={{ marginTop: "70px" }}>
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/#features">Services</Link></li>
              <li>Enrollment Process</li>
            </ol>
            <h1><strong>Enrollment Process</strong></h1>
          </div>
        </section>
        <section className="about" style={{ padding: "50px 0 30px" }}>
          <div className="container" data-aos="fade-up">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <SiteImage src="/assets/img/ProccessMethod_hidayatulquran_Academy.png" className="img-fluid" alt="HidayatulQuran Academy enrollment process illustration" style={{ borderRadius: "12px", width: "100%" }} loading="eager" sizes="(max-width: 992px) 100vw, 50vw" />
              </div>
              <div className="col-lg-6">
                <h2 style={{ color: "#082c4c" }}>Join HidayatulQuran Academy in 3 Simple Steps</h2>
                <p style={{ fontSize: "17px", marginTop: "15px", color: "#444" }}>
                  Getting started with our{" "}
                  <strong>online Quran classes</strong>
                  {" "}is quick, simple, and completely free to try. We designed our enrollment process to be clear and stress-free for parents, students, and adults worldwide — from the{" "}
                  <strong>USA, UK, Canada, UAE, Australia</strong>
                  , and beyond.
                </p>
                <p style={{ fontSize: "17px", color: "#444" }}>
                  No complex forms, no upfront fees. Just reach out on{" "}
                  <strong>WhatsApp</strong>
                  , book your{" "}
                  <strong>free demo class</strong>
                  , and start learning the Quran with a certified tutor at a time that suits you.
                </p>
                <a href="https://wa.me/923365398542?text=Assalamu%20Alaikum%2C%20I%20want%20to%20book%20a%20free%20trial%20Quran%20class." target="_blank" rel="noopener noreferrer" className="cta-btn-trial">
                  <i className="bi bi-whatsapp" style={{ fontSize: "20px" }}></i>
                  {" "}
                  <span>Book Free Trial Class</span>
                </a>
              </div>
            </div>
          </div>
        </section>
        <section style={{ padding: "50px 0" }} data-aos="fade-up">
          <div className="container">
            <header className="section-header">
              <h2 style={{ color: "#E1B152" }}><strong>How It Works</strong></h2>
              <p>Your 3-Step Path to Learning the Quran Online</p>
            </header>
            <div className="row align-items-start mt-4">
              <div className="col-lg-4 col-md-12 mb-4" data-aos="fade-up" data-aos-delay="100">
                <div className="ep-step-card">
                  <div className="ep-step-number">1</div>
                  <h3>
                    <i className="bi bi-calendar2-check me-2" style={{ color: "#25D366" }}></i>
                    Book a Free Demo Class
                  </h3>
                  <p>
                    Experience our teaching style before you commit. We offer a completely free, one-to-one live demo class so you can see how we teach, how we communicate, and what your child or you will experience in every session.
                  </p>
                  <ul>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}One-to-one live demo session
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Quran level assessment before class
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}No obligation after demo
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Clear explanation of the learning plan
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Zero payment required
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 mb-4" data-aos="fade-up" data-aos-delay="200">
                <div className="ep-step-card">
                  <div className="ep-step-number">2</div>
                  <h3>
                    <i className="bi bi-person-check me-2" style={{ color: "#25D366" }}></i>
                    Complete Registration
                  </h3>
                  <p>
                    After the demo, if you are happy with the class, our team will walk you through a quick and easy registration. No complicated forms — just a short conversation on WhatsApp or via our website contact form.
                  </p>
                  <ul>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Contact us via WhatsApp or website
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Student level evaluation
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Choose your preferred course
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Class time confirmation
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Quick enrollment with full guidance
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 mb-4" data-aos="fade-up" data-aos-delay="300">
                <div className="ep-step-card">
                  <div className="ep-step-number">3</div>
                  <h3>
                    <i className="bi bi-clock me-2" style={{ color: "#25D366" }}></i>
                    Set Your Class Schedule
                  </h3>
                  <p>
                    We work around your routine — not the other way around. Once enrolled, choose your preferred days and timings. Our classes are available 24/7 and cover all major time zones across the globe.
                  </p>
                  <ul>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Choose days and timings yourself
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Weekday and weekend options
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Time-zone friendly scheduling
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Easy rescheduling support
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Classes 24/7 — 365 days a year
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section style={{ padding: "30px 0 50px" }} data-aos="fade-up">
          <div className="container">
            <div className="row align-items-center gy-5">
              <div className="col-lg-6">
                <SiteImage src="/assets/img/Specialities1_hidayatulquran_Academy.png" className="img-fluid" alt="HidayatulQuran teaching specialities" style={{ borderRadius: "12px", width: "100%" }} sizes="(max-width: 992px) 100vw, 50vw" />
              </div>
              <div className="col-lg-6">
                <h2 style={{ color: "#082c4c", marginBottom: "20px" }}>What Happens in the Free Demo Class?</h2>
                <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.8" }}>
                  Our free demo class is a real class — not a sales pitch. A certified Quran tutor will conduct a proper one-to-one session and assess the student&apos;s current Quran level. By the end, you will have a clear picture of which course is the right fit, how the sessions work, and what progress to expect.
                </p>
                <div className="row gy-3 mt-2">
                  <div className="col-sm-6">
                    <div className="feature-box d-flex align-items-center" style={{ gap: "10px" }}>
                      <i className="bi bi-check" aria-hidden="true" style={{ fontSize: "24px", lineHeight: "1", flexShrink: "0" }}></i>
                      <h6 style={{ margin: "0", lineHeight: "1.3" }}><strong>Real 1-on-1 Session</strong></h6>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="feature-box d-flex align-items-center" style={{ gap: "10px" }}>
                      <i className="bi bi-check" aria-hidden="true" style={{ fontSize: "24px", lineHeight: "1", flexShrink: "0" }}></i>
                      <h6 style={{ margin: "0", lineHeight: "1.3" }}><strong>Level Assessment</strong></h6>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="feature-box d-flex align-items-center" style={{ gap: "10px" }}>
                      <i className="bi bi-check" aria-hidden="true" style={{ fontSize: "24px", lineHeight: "1", flexShrink: "0" }}></i>
                      <h6 style={{ margin: "0", lineHeight: "1.3" }}><strong>Course Recommendation</strong></h6>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="feature-box d-flex align-items-center" style={{ gap: "10px" }}>
                      <i className="bi bi-check" aria-hidden="true" style={{ fontSize: "24px", lineHeight: "1", flexShrink: "0" }}></i>
                      <h6 style={{ margin: "0", lineHeight: "1.3" }}><strong>No Obligation</strong></h6>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="feature-box d-flex align-items-center" style={{ gap: "10px" }}>
                      <i className="bi bi-check" aria-hidden="true" style={{ fontSize: "24px", lineHeight: "1", flexShrink: "0" }}></i>
                      <h6 style={{ margin: "0", lineHeight: "1.3" }}><strong>Certified Male or Female Tutor</strong></h6>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="feature-box d-flex align-items-center" style={{ gap: "10px" }}>
                      <i className="bi bi-check" aria-hidden="true" style={{ fontSize: "24px", lineHeight: "1", flexShrink: "0" }}></i>
                      <h6 style={{ margin: "0", lineHeight: "1.3" }}><strong>Via Zoom / Google Meet</strong></h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section style={{ padding: "30px 0 50px", background: "#f9f9f9" }} data-aos="fade-up">
          <div className="container">
            <header className="section-header">
              <h2 style={{ color: "#E1B152" }}><strong>Common Questions</strong></h2>
              <p>Everything You Need to Know Before Enrolling</p>
            </header>
            <div className="row gy-4 mt-2">
              <div className="col-lg-6">
                <div className="ep-faq-item">
                  <h4>Is the demo class really free?</h4>
                  <p>
                    Yes, 100% free. No credit card, no payment, no hidden charges. The demo class is our way of letting you experience the quality of our teaching before any commitment.
                  </p>
                </div>
                <div className="ep-faq-item">
                  <h4>How do I contact you to book the demo?</h4>
                  <p>
                    The quickest way is via WhatsApp — click the &quot;Book Free Trial Class&quot; button on this page. You can also fill out the contact form on our website or email us at{" "}
                    <a href="mailto:info@hidayatulquran.com">info@hidayatulquran.com</a>
                    .
                  </p>
                </div>
                <div className="ep-faq-item">
                  <h4>Can I choose a male or female tutor?</h4>
                  <p>
                    Yes. We have certified male and female Quran tutors. Just let us know your preference when you contact us and we will match you accordingly.
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="ep-faq-item">
                  <h4>What if the demo timing doesn&apos;t suit me?</h4>
                  <p>
                    No problem — we offer flexible demo timings to accommodate students in the USA, UK, Canada, UAE, Australia, and all other time zones. Just tell us your available time and we will find a slot.
                  </p>
                </div>
                <div className="ep-faq-item">
                  <h4>How long does registration take?</h4>
                  <p>
                    Registration is quick — usually done within the same WhatsApp conversation. Once you decide to enroll, our team confirms your course, tutor, and class timing in minutes.
                  </p>
                </div>
                <div className="ep-faq-item">
                  <h4>Can I change my class schedule after enrolling?</h4>
                  <p>
                    Yes. We provide flexible rescheduling support. If your routine changes, simply inform us in advance and we will adjust your class timings with no hassle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section style={{ padding: "30px 0 60px" }} data-aos="fade-up">
          <div className="container">
            <h2 style={{ color: "#082c4c", fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>Explore Our Online Quran Courses</h2>
            <div className="row gy-3">
              <div className="col-lg-4 col-md-6">
                <Link href="/noorani-qaida-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Noorani Qaida Online
                </Link>
              </div>
              <div className="col-lg-4 col-md-6">
                <Link href="/quran-reading-course-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Quran Reading Course Online
                </Link>
              </div>
              <div className="col-lg-4 col-md-6">
                <Link href="/quran-tajweed-course-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Quran with Tajweed Online
                </Link>
              </div>
              <div className="col-lg-4 col-md-6">
                <Link href="/quran-memorization-hifz-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Quran Memorization (Hifz)
                </Link>
              </div>
              <div className="col-lg-4 col-md-6">
                <Link href="/tafseer-quran-course-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Tafseer e Quran Course
                </Link>
              </div>
              <div className="col-lg-4 col-md-6">
                <Link href="/quranic-arabic-course-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Quranic Arabic Course
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

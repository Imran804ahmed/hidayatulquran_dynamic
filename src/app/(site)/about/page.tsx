import Link from "next/link";
import { englishAlternates, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import styles from "./page.module.css";
import SiteImage from "@/components/ui/SiteImage";

export const metadata = pageMetadata({
  path: "/about",
  title: "About HidayatulQuran Academy — Certified Online Quran Tutors",
  description: "Learn about HidayatulQuran Academy — a trusted online Quran academy with certified male and female tutors offering 1-on-1 live Quran classes for kids and adults worldwide.",
  ogDescription: "Learn about HidayatulQuran Academy — certified male and female Quran tutors offering live 1-on-1 online Quran classes for kids and adults in USA, UK, Canada and worldwide.",
  twitterDescription: "Certified male and female Quran tutors offering live 1-on-1 online Quran classes for kids and adults in USA, UK, Canada and worldwide.",
  languages: englishAlternates("/about"),
});

export default function Page() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About HidayatulQuran Academy",
        "url": "https://www.hidayatulquran.com/about",
        "description": "HidayatulQuran Academy is a certified online Quran academy offering 1-on-1 live Quran classes with qualified male and female tutors for kids and adults in USA, UK, Canada, UAE and worldwide.",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.hidayatulquran.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "About",
              "item": "https://www.hidayatulquran.com/about"
            }
          ]
        }
      }} />
      <main id="main" className={styles.page}>
        <section className="about-hero" style={{ marginTop: "70px" }}>
          <div className="container">
            <h1 data-aos="fade-down">About HidayatulQuran Academy</h1>
            <p data-aos="fade-up" data-aos-delay="100">
              A trusted online Quran academy connecting students worldwide with certified, experienced tutors — one class at a time.
            </p>
          </div>
        </section>
        <section className="about-story">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-7" data-aos="fade-right">
                <p className="section-label">Who We Are</p>
                <h2>Hidaya Tul Quran — Online Quran Academy</h2>
                <p className="lead-text">
                  <strong>Hidaya-tul-Quran Academy</strong>
                  {" "}is a trusted{" "}
                  <strong>online Quran academy</strong>
                  {" "}providing professional Quran learning services for students worldwide. Whether you are searching for a{" "}
                  <strong>Quran teacher online</strong>
                  {" "}or want to{" "}
                  <strong>learn Quran with Tajweed</strong>
                  {" "}from the comfort of your home, we offer structured and personalised learning programs for all ages.
                </p>
                <p className="lead-text">
                  Our academy connects students with experienced, qualified Quran tutors through live 1-on-1 online classes. Whether you are a complete beginner or looking to refine your recitation, we help you achieve fluency in reading the Holy Quran with proper pronunciation and Tajweed rules.
                </p>
                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Link href="/registration" className="btn-wa" style={{ background: "#082c4c", boxShadow: "0 4px 20px rgba(8,44,76,0.3)" }}>
                    <i className="bi bi-pencil-square"></i>
                    {" "}Register Now
                  </Link>
                  {" "}
                  <a href="https://wa.me/923365398542?text=Assalamu%20Alaikum%2C%20I%20want%20to%20book%20a%20free%20trial%20Quran%20class." target="_blank" rel="noopener noreferrer" className="btn-wa">
                    <i className="bi bi-whatsapp" style={{ fontSize: "1.1rem" }}></i>
                    {" "}Free Trial Class
                  </a>
                </div>
              </div>
              <div className="col-lg-5" data-aos="fade-left" data-aos-delay="100">
                <div className="logo-card">
                  <SiteImage src="/assets/img/hidayatulquran1.png" alt="HidayatulQuran Academy Logo" sizes="130px" />
                  <div className="divider"></div>
                  <h3>HidayatulQuran</h3>
                  <p>
                    Online Quran Academy
                    <br />
                    Serving students worldwide since day one
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="why-section">
          <div className="container">
            <div className="text-center" data-aos="fade-up">
              <p className="section-label">Our Advantages</p>
              <h2>Why Choose Our Online Quran Academy?</h2>
              <p className="subtitle">
                We combine qualified teaching, flexible scheduling, and personalised attention to make Quran learning effective for everyone.
              </p>
            </div>
            <div className="row g-4">
              <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
                <div className="feature-card">
                  <div className="icon-wrap"><i className="bi bi-patch-check-fill"></i></div>
                  <h4>Certified Quran Teachers</h4>
                  <p>Our tutors are Hafiz-e-Quran and Tajweed-certified with years of professional teaching experience.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="150">
                <div className="feature-card">
                  <div className="icon-wrap"><i className="bi bi-person-lines-fill"></i></div>
                  <h4>One-to-One Live Classes</h4>
                  <p>Personalised 1-on-1 sessions ensure better understanding and faster progress for every student.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">
                <div className="feature-card">
                  <div className="icon-wrap"><i className="bi bi-book-fill"></i></div>
                  <h4>Learn Quran with Tajweed</h4>
                  <p>Focus on correct Makharij (pronunciation) and proper Tajweed rules to perfect your recitation.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="250">
                <div className="feature-card">
                  <div className="icon-wrap"><i className="bi bi-people-fill"></i></div>
                  <h4>Courses for All Ages</h4>
                  <p>Programs for kids, adults, and new Muslims — Quran reading, Tajweed, Hifz, Tafseer, and Arabic.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="300">
                <div className="feature-card">
                  <div className="icon-wrap"><i className="bi bi-clock-fill"></i></div>
                  <h4>Flexible Timings</h4>
                  <p>Classes available across USA, UK, Canada, UAE, and all major time zones — at your convenience.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="350">
                <div className="feature-card">
                  <div className="icon-wrap"><i className="bi bi-graph-up"></i></div>
                  <h4>Progress Tracking</h4>
                  <p>Regular assessments, feedback, and monthly reports ensure continuous and measurable improvement.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mission-section">
          <div className="container" data-aos="fade-up">
            <div className="mission-card">
              <p className="section-label">Our Purpose</p>
              <h2>Our Mission</h2>
              <p>
                Our mission is to make{" "}
                <strong style={{ color: "#E1B152" }}>Quran learning online</strong>
                {" "}accessible, easy, and effective for students around the world. We aim to provide high-quality Islamic education that helps individuals understand and recite the Holy Quran correctly with Tajweed — empowering every Muslim to build a stronger connection with the Book of Allah from the comfort of their home.
              </p>
              <div className="mission-values">
                <span>
                  <i className="bi bi-check-circle me-1"></i>
                  Accessibility
                </span>
                {" "}
                <span>
                  <i className="bi bi-check-circle me-1"></i>
                  Quality Education
                </span>
                {" "}
                <span>
                  <i className="bi bi-check-circle me-1"></i>
                  Certified Tutors
                </span>
                {" "}
                <span>
                  <i className="bi bi-check-circle me-1"></i>
                  Global Reach
                </span>
                {" "}
                <span>
                  <i className="bi bi-check-circle me-1"></i>
                  Free Trial Class
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

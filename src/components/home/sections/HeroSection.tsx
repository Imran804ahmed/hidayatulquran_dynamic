import Link from "next/link";
import SiteImage from "@/components/ui/SiteImage";
export default function HeroSection() {
  return (
    <section id="hero" className="hero d-flex align-items-center" aria-labelledby="hero-heading">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 d-flex flex-column justify-content-center">
            <p className="hero-eyebrow" data-aos="fade-up">Welcome to</p>
            <h1 id="hero-heading" data-aos="fade-up">Online Quran Classes for Kids &amp; Adults</h1>
            <p className="hero-lead" data-aos="fade-up" data-aos-delay="400">
              Join live 1-on-1{" "}
              <strong>online Quran classes</strong>
              {" "}with certified male and female tutors from the comfort of your home in the{" "}
              <strong>
                <Link href="/online-quran-classes-uk" style={{ color: "inherit", textDecoration: "underline" }}>UK</Link>
                ,{" "}
                <Link href="/online-quran-classes-usa" style={{ color: "inherit", textDecoration: "underline" }}>USA</Link>
                ,{" "}
                <Link href="/online-quran-classes-uae" style={{ color: "inherit", textDecoration: "underline" }}>UAE</Link>
                ,{" "}
                <Link href="/online-quran-classes-canada" style={{ color: "inherit", textDecoration: "underline" }}>Canada</Link>
                {" "}or{" "}
                <Link href="/online-quran-classes-saudi-arabia" style={{ color: "inherit", textDecoration: "underline" }}>Saudi Arabia</Link>
              </strong>
              . Learn{" "}
              <Link href="/quran-tajweed-course-online" style={{ color: "inherit", textDecoration: "underline" }}>Tajweed</Link>
              ,{" "}
              <Link href="/quran-memorization-hifz-online" style={{ color: "inherit", textDecoration: "underline" }}>Hifz</Link>
              , and more.
            </p>
            <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="500">
              Book a{" "}
              <strong>free trial class</strong>
              {" "}today — no commitment, no payment required.
            </p>
            <div data-aos="fade-up" data-aos-delay="600">
              <div className="text-center text-lg-start">
                <a href="https://wa.me/923365398542?text=Assalamu%20Alaikum%2C%20I%20want%20to%20book%20a%20free%20trial%20Quran%20class." target="_blank" rel="noopener noreferrer" className="btn-get-started btn-whatsapp-trial d-inline-flex align-items-center justify-content-center align-self-center" aria-label="Book a free trial Quran class on WhatsApp">
                  <i className="bi bi-whatsapp" aria-hidden="true"></i>
                  {" "}
                  <span>Book Free Trial</span>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6 hero-img" data-aos="zoom-out" data-aos-delay="100">
            <SiteImage src="/assets/img/hidayatulquran1.png" className="img-fluid" alt="HidayatulQuran Academy - Online Quran learning with certified tutors" fetchPriority="high" sizes="(max-width: 768px) 100vw, 480px" />
          </div>
        </div>
      </div>
    </section>
  );
}

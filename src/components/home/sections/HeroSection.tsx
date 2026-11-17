import Link from "next/link";
import { Fragment } from "react";
import SiteImage from "@/components/ui/SiteImage";

const COUNTRY_LINKS: [string, string][] = [
  ["UK", "/online-quran-classes-uk"],
  ["USA", "/online-quran-classes-usa"],
  ["UAE", "/online-quran-classes-uae"],
  ["Canada", "/online-quran-classes-canada"],
  ["Saudi Arabia", "/online-quran-classes-saudi-arabia"],
  ["Australia", "/online-quran-classes-australia"],
  ["Pakistan", "/online-quran-classes-pakistan"],
  ["India", "/online-quran-classes-india"],
  ["Qatar", "/online-quran-classes-qatar"],
  ["Germany", "/online-quran-classes-germany"],
  ["France", "/online-quran-classes-france"],
  ["Russia", "/online-quran-classes-russia"],
  ["Brazil", "/online-quran-classes-brazil"],
  ["South Africa", "/online-quran-classes-south-africa"],
];

const COURSE_LINKS: [string, string][] = [
  ["Qaida", "/noorani-qaida-online"],
  ["Reading", "/quran-reading-course-online"],
  ["Tajweed", "/quran-tajweed-course-online"],
  ["Hifz", "/quran-memorization-hifz-online"],
  ["Tafseer", "/tafseer-quran-course-online"],
  ["Arabic", "/quranic-arabic-course-online"],
];

export default function HeroSection() {
  return (
    <section id="hero" className="hero d-flex align-items-center" aria-labelledby="hero-heading">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 d-flex flex-column justify-content-center">
            <p className="hero-eyebrow" data-aos="fade-up">Welcome to</p>
            <h1 id="hero-heading" data-aos="fade-up">Online Quran Classes for Kids &amp; Adults</h1>
            <p className="hero-lead" data-aos="fade-up" data-aos-delay="400">
              Live 1-on-1{" "}
              <strong>online Quran classes</strong>
              {" "}with certified male &amp; female tutors in the{" "}
              <strong>
                {COUNTRY_LINKS.map(([label, href], i) => (
                  <Fragment key={href}>
                    {i > 0 && (i === COUNTRY_LINKS.length - 1 ? " and " : ", ")}
                    <Link href={href} style={{ color: "inherit", textDecoration: "underline" }}>{label}</Link>
                  </Fragment>
                ))}
              </strong>
              .
              <br />
              Learn{" "}
              {COURSE_LINKS.map(([label, href], i) => (
                <Fragment key={href}>
                  {i > 0 && (i === COURSE_LINKS.length - 1 ? " and " : ", ")}
                  <Link href={href} style={{ color: "inherit", textDecoration: "underline" }}>{label}</Link>
                </Fragment>
              ))}
              .
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
                <Link href="/registration" className="hero-alt-link">
                  Or register online <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6 hero-img" data-aos="zoom-out" data-aos-delay="100">
            <SiteImage src="/assets/img/hidayatulquran1.png" className="img-fluid" alt="HidayatulQuran Academy - Online Quran learning with certified tutors" fetchPriority="high" loading="eager" sizes="(max-width: 768px) 100vw, 480px" />
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import CourseLinks from "@/components/course/CourseLinks";
import EnrollCta from "@/components/course/EnrollCta";
import JsonLd from "@/components/seo/JsonLd";
import FaqAccordion from "@/components/ui/FaqAccordion";
import { absoluteUrl } from "@/config/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import type { CountryContent } from "./types";
import styles from "./CountryPage.module.css";
import SiteImage from "@/components/ui/SiteImage";

export function countryMetadata(country: CountryContent): Metadata {
  return pageMetadata({
    path: country.path,
    title: country.title,
    description: country.description,
    keywords: country.keywords,
    languages: country.languages,
    ogTitle: country.ogTitle,
    ogDescription: country.ogDescription,
    twitterTitle: country.twitterTitle,
    twitterDescription: country.twitterDescription,
    locale: country.ogLocale,
    image: country.ogImage,
  });
}

/** Template for the country landing pages (UK, USA, Canada, UAE, Saudi Arabia). */
export default function CountryPage({ country }: { country: CountryContent }) {
  const half = Math.ceil(country.faqs.length / 2);
  const faqIds = country.faqs.map((_, i) => `${country.faqId}-${i + 1}`);

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...country.serviceSchema, url: absoluteUrl(country.path) }} />
      <JsonLd data={breadcrumbSchema([{ name: country.breadcrumbSchema, path: country.path }])} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: country.faqSchema }} />
      <main id="main">
        <section className={`breadcrumbs ${styles.breadcrumbs}`}>
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li>{country.breadcrumb}</li>
            </ol>
            <h1><strong>{country.name}</strong></h1>
          </div>
        </section>
        <section className={`about ${styles.detail}`}>
          <div className="container" data-aos="fade-up">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <SiteImage src={country.image} className={`img-fluid ${styles.image}`} alt={country.imageAlt} loading="eager" sizes="(max-width: 992px) 100vw, 50vw" />
              </div>
              <div className="col-lg-6">
                <h2>{country.introHeading}</h2>
                {country.intro.map((p, i) => (
                  <p key={i} className={i === 0 ? styles.lead : undefined}>{p}</p>
                ))}
                {country.contactLine && <p className={styles.contact}>{country.contactLine}</p>}
                <a href={country.whatsapp} target="_blank" rel="noopener noreferrer" className="cta-btn-trial">
                  <i className={`bi bi-whatsapp ${styles.trialIcon}`}></i> <span>Book Free Trial Class</span>
                </a>
              </div>
            </div>

            <div className="row mt-5" data-aos="fade-up">
              <div className="col-lg-6">
                <h2>{country.whyHeading}</h2>
                <ul>{country.why.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
              <div className="col-lg-6">
                <h2>{country.coursesHeading}</h2>
                <ul>{country.courses.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
            </div>

            <div className="row mt-5" data-aos="fade-up">
              <div className="col-12">
                <h2 className={styles.feeHeading}>{country.feeHeading}</h2>
              </div>
              {country.packages.map((pkg, i) => (
                <div className="col-lg-4 col-md-6 mb-4" key={pkg.name}>
                  <div className={`box ${styles.package} ${i === 1 ? styles.featured : ""}`}>
                    <h3>{pkg.name}</h3>
                    <p className={styles.days}>{pkg.days}</p>
                    <p className={styles.price}>
                      {pkg.price}
                      <span>{pkg.per}</span>
                    </p>
                    <ul className={styles.features}>
                      {pkg.features.map((f) => <li key={f}>✓ {f}</li>)}
                    </ul>
                    <Link href={pkg.href} className={`btn btn-register ${styles.register}`}>
                      Register Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="row mt-3" data-aos="fade-up">
              <div className="col-12">
                <EnrollCta href={country.whatsapp} perks={country.perks} label={country.ctaLabel} />
              </div>
            </div>

            <div className="row mt-5" data-aos="fade-up">
              <div className="col-12">
                <h2 className={styles.faqHeading}>{country.faqHeading}</h2>
              </div>
              <div className="col-lg-6">
                <FaqAccordion id={country.faqId} items={country.faqs.slice(0, half)} itemIds={faqIds.slice(0, half)} />
              </div>
              <div className="col-lg-6">
                <FaqAccordion id={`${country.faqId}-2col`} items={country.faqs.slice(half)} itemIds={faqIds.slice(half)} />
              </div>
            </div>

            <div className="row mt-5" data-aos="fade-up">
              <div className="col-12">
                <CourseLinks />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

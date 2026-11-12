import { englishAlternates, pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";
import SiteImage from "@/components/ui/SiteImage";

export const metadata = pageMetadata({
  path: "/social-platforms",
  title: "Follow HidayatulQuran Academy on Social Media | YouTube, Facebook, Instagram",
  description: "Follow HidayatulQuran Academy on YouTube, Facebook, and Instagram for Quran lessons, Islamic reminders, and live class updates. Stay connected with our growing community worldwide.",
  keywords: "HidayatulQuran social media, online Quran academy, Quran YouTube channel, Quran Facebook page, Quran Instagram, learn Quran online, Islamic education",
  ogTitle: "Follow HidayatulQuran Academy on Social Media",
  ogDescription: "Follow HidayatulQuran Academy on YouTube, Facebook, and Instagram for daily Quran lessons, Islamic reminders, and live class updates.",
  twitterDescription: "Stay connected with HidayatulQuran Academy on YouTube, Facebook, and Instagram for Quran lessons and updates.",
  languages: englishAlternates("/social-platforms"),
});

export default function Page() {
  return (
    <>
      <main id="main" className={styles.page}>
        <section className="social-hero" style={{ marginTop: "70px" }}>
          <div className="container">
            <h1 data-aos="fade-down">Follow Us &amp; Stay Connected</h1>
            <p data-aos="fade-up" data-aos-delay="100">
              Join our growing community across social platforms and receive daily Quranic reminders, class updates, and Islamic content.
            </p>
            <div className="badge-strip" data-aos="fade-up" data-aos-delay="200">
              <span>
                <i className="bi bi-youtube me-1"></i>
                {" "}YouTube
              </span>
              {" "}
              <span>
                <i className="bi bi-facebook me-1"></i>
                {" "}Facebook
              </span>
              {" "}
              <span>
                <i className="bi bi-instagram me-1"></i>
                {" "}Instagram
              </span>
            </div>
          </div>
        </section>
        <section className="platforms-section">
          <div className="container">
            <div className="text-center" data-aos="fade-up">
              <p className="section-label">Our Community</p>
              <h2 className="section-title">Connect on Social Media</h2>
              <p className="section-subtitle">Stay updated with our latest Quran lessons, student achievements, and Islamic content.</p>
            </div>
            <div className="row g-4 justify-content-center">
              <div className="col-12 col-md-6 col-lg-4 d-flex" data-aos="fade-up" data-aos-delay="100">
                <a href="https://www.youtube.com/channel/UCDiUcDx4tqPCqvENApO9Gvg" target="_blank" rel="noopener noreferrer" className="platform-card card-youtube w-100">
                  <div className="card-img-wrap">
                    <SiteImage src="/assets/img/hidayatulquran_youtubechannel.png" alt="HidayatulQuran YouTube Channel" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="overlay"><span>Watch Now</span></div>
                  </div>
                  <div className="card-footer-bar">
                    <div className="platform-info">
                      <div className="icon-wrap"><i className="bi bi-youtube"></i></div>
                      <div>
                        <h3>YouTube</h3>
                        <small>Subscribe to our channel</small>
                      </div>
                    </div>
                    <span className="follow-btn">Subscribe</span>
                  </div>
                </a>
              </div>
              <div className="col-12 col-md-6 col-lg-4 d-flex" data-aos="fade-up" data-aos-delay="200">
                <a href="https://www.facebook.com/profile.php?id=61586928376019" target="_blank" rel="noopener noreferrer" className="platform-card card-facebook w-100">
                  <div className="card-img-wrap">
                    <SiteImage src="/assets/img/hidayatulquran_facebookchannel.png" alt="HidayatulQuran Facebook Page" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="overlay"><span>Visit Page</span></div>
                  </div>
                  <div className="card-footer-bar">
                    <div className="platform-info">
                      <div className="icon-wrap"><i className="bi bi-facebook"></i></div>
                      <div>
                        <h3>Facebook</h3>
                        <small>Like &amp; follow our page</small>
                      </div>
                    </div>
                    <span className="follow-btn">Follow</span>
                  </div>
                </a>
              </div>
              <div className="col-12 col-md-6 col-lg-4 d-flex" data-aos="fade-up" data-aos-delay="300">
                <a href="https://www.instagram.com/hidayatulquranofficiall/" target="_blank" rel="noopener noreferrer" className="platform-card card-instagram w-100">
                  <div className="card-img-wrap">
                    <SiteImage src="/assets/img/hidayatulquran_instagramchannel.png" alt="HidayatulQuran Instagram Page" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="overlay"><span>View Profile</span></div>
                  </div>
                  <div className="card-footer-bar">
                    <div className="platform-info">
                      <div className="icon-wrap"><i className="bi bi-instagram"></i></div>
                      <div>
                        <h3>Instagram</h3>
                        <small>Follow for daily content</small>
                      </div>
                    </div>
                    <span className="follow-btn">Follow</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="cta-strip">
          <div className="container" data-aos="fade-up">
            <h2>Ready to Start Your Quran Journey?</h2>
            <p>Book a free trial class today — no commitment required.</p>
            <a href="https://wa.me/923365398542?text=Assalamu%20Alaikum%2C%20I%20want%20to%20book%20a%20free%20trial%20Quran%20class." target="_blank" rel="noopener noreferrer" className="btn-wa">
              <i className="bi bi-whatsapp" style={{ fontSize: "1.2rem" }}></i>
              {" "}Book Free Trial on WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

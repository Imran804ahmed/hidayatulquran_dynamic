import Carousel from "@/components/ui/Carousel";
import SiteImage from "@/components/ui/SiteImage";

export default function EnvironmentSection() {
  return (
    <section id="learning-environment" className="testimonials" aria-labelledby="environment-heading">
      <div className="container" data-aos="fade-up">
        <header className="section-header">
          <h2 id="environment-heading" style={{ color: "#E1B152" }}><strong>Environment</strong></h2>
          <p>Discover How Our Environment</p>
        </header>
        <Carousel preset="testimonials" className="testimonials-slider" data-aos="fade-up" data-aos-delay="200" role="region" aria-label="Online learning environment gallery">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <figure className="testimonial-item environment-card">
                <SiteImage src="/assets/img/team/hidayatulquran_Onlineclass2.jpeg" className="img-fluid" alt="Student attending a live online Quran class" sizes="(max-width: 1200px) 100vw, 33vw" />
              </figure>
            </div>
            <div className="swiper-slide">
              <figure className="testimonial-item environment-card">
                <SiteImage src="/assets/img/team/hidayatulquran_Onlineclass3.jpeg" className="img-fluid" alt="Teacher guiding an online Quran learning session" sizes="(max-width: 1200px) 100vw, 33vw" />
              </figure>
            </div>
            <div className="swiper-slide">
              <figure className="testimonial-item environment-card">
                <SiteImage src="/assets/img/team/hidayatulquran_Onlineclass4.jpeg" className="img-fluid" alt="Online Quran class environment for students" sizes="(max-width: 1200px) 100vw, 33vw" />
              </figure>
            </div>
            <div className="swiper-slide">
              <figure className="testimonial-item environment-card">
                <SiteImage src="/assets/img/team/hidayatulquran_Onlineclass5.jpeg" className="img-fluid" alt="One-to-one online Quran learning session" sizes="(max-width: 1200px) 100vw, 33vw" />
              </figure>
            </div>
            <div className="swiper-slide">
              <figure className="testimonial-item environment-card">
                <SiteImage src="/assets/img/team/hidayatulquran_Onlineclass6.jpeg" className="img-fluid" alt="Virtual Quran class with personal tutor support" sizes="(max-width: 1200px) 100vw, 33vw" />
              </figure>
            </div>
          </div>
          <div className="swiper-pagination" aria-hidden="true"></div>
        </Carousel>
      </div>
    </section>
  );
}

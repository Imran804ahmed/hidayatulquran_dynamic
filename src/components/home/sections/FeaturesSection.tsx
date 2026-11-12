import SiteImage from "@/components/ui/SiteImage";

export default function FeaturesSection() {
  return (
    <section id="features" className="features" style={{ paddingBottom: "0px" }} aria-labelledby="features-heading">
      <div className="container" data-aos="fade-up">
        <header className="section-header">
          <h2 id="features-heading" style={{ color: "#E1B152" }}><strong>Features</strong></h2>
          <p>Why Choose Our Online Quran Academy?</p>
        </header>
        <div className="row">
          <div className="col-lg-6">
            <SiteImage src="/assets/img/Specialities1_hidayatulquran_Academy.png" className="img-fluid" alt="HidayatulQuran teaching specialities and student support" style={{ width: "100%", height: "100%", objectFit: "cover" }} sizes="(max-width: 1200px) 100vw, 50vw" />
          </div>
          <div className="col-lg-6 mt-5 mt-lg-0 d-flex">
            <div className="row align-self-center gy-4">
              <div className="col-md-6" data-aos="zoom-out" data-aos-delay="200">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-check" aria-hidden="true"></i>
                  <h3>Expert Tutors</h3>
                </div>
              </div>
              <div className="col-md-6" data-aos="zoom-out" data-aos-delay="300">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-check" aria-hidden="true"></i>
                  <h3>Personalized Attention</h3>
                </div>
              </div>
              <div className="col-md-6" data-aos="zoom-out" data-aos-delay="400">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-check" aria-hidden="true"></i>
                  <h3>Student Progress Monitoring</h3>
                </div>
              </div>
              <div className="col-md-6" data-aos="zoom-out" data-aos-delay="500">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-check" aria-hidden="true"></i>
                  <h3>Structured Learning Material</h3>
                </div>
              </div>
              <div className="col-md-6" data-aos="zoom-out" data-aos-delay="600">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-check" aria-hidden="true"></i>
                  <h3>Flexible Class Scheduling</h3>
                </div>
              </div>
              <div className="col-md-6" data-aos="zoom-out" data-aos-delay="700">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-check" aria-hidden="true"></i>
                  <h3>Monthly Progress Reports</h3>
                </div>
              </div>
              <div className="col-md-6" data-aos="zoom-out" data-aos-delay="800">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-check" aria-hidden="true"></i>
                  <h3>24/7 Availability</h3>
                </div>
              </div>
              <div className="col-md-6" data-aos="zoom-out" data-aos-delay="900">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-check" aria-hidden="true"></i>
                  <h3>Reasonable Price</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

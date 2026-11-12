import ContactForm from "@/components/forms/ContactForm";

export default function ContactSection() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-heading">
      <div className="container" data-aos="fade-up">
        <header className="section-header">
          <h2 id="contact-heading" style={{ color: "#E1B152" }}><strong>Contact</strong></h2>
          <p>Contact Us</p>
        </header>
        <div className="row gy-4">
          <div className="col-lg-6">
            <div className="row gy-4">
              <div className="col-md-6">
                <div className="info-box">
                  <i className="bi bi-geo-alt" aria-hidden="true"></i>
                  <h3>Address</h3>
                  <address><strong style={{ fontWeight: "normal" }}>HIDAYA-TUL-QURAN ACADEMY SHAHFAISAL COLONY NEAR AIRPORT KARACHI,</strong></address>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-box">
                  <i className="bi bi-telephone" aria-hidden="true"></i>
                  <h3>Call Us</h3>
                  <p>
                    <a href="tel:+923365398542" aria-label="Call +92 336 5398542">+92 336 5398542</a>
                    <br />
                    <a href="tel:+447376282389" aria-label="Call +44 7376282389">+44 7376282389</a>
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-box">
                  <i className="bi bi-envelope" aria-hidden="true"></i>
                  <h3>Email Us</h3>
                  <p>
                    <strong style={{ fontWeight: "normal" }}>
                      <a href="mailto:info@hidayatulquran.com" aria-label="Email info@hidayatulquran.com">info@hidayatulquran.com</a>
                      <br />
                      <a href="mailto:hidayatulquranofficiall@gmail.com" aria-label="Email hidayatulquranofficiall@gmail.com">
                        hidayatulquranofficiall@gmail.com
                      </a>
                    </strong>
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-box">
                  <i className="bi bi-clock" aria-hidden="true"></i>
                  <h3>Open Hours</h3>
                  <p>
                    Monday - Sunday
                    <br />
                    Available 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

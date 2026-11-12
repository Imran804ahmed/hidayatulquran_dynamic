import Carousel from "@/components/ui/Carousel";
import SiteImage from "@/components/ui/SiteImage";

export default function PaymentsSection() {
  return (
    <section id="clients" style={{ padding: "50px", margin: "0px" }}>
      <div className="row feature-icons" data-aos="fade-up" style={{ margin: "0px" }}>
        <header className="section-header">
          <h2 style={{ color: "#E1B152" }}><strong>Payment Methods</strong></h2>
          <p>We Accept Payments</p>
        </header>
        <div className="row" style={{ padding: "0px", margin: "0px" }}>
          <div className="col-xl-4 text-center" data-aos="fade-right" data-aos-delay="100" style={{ padding: "0px", margin: "0px" }}>
            <SiteImage src="/assets/img/faysal-bank-hidayatulquran.png" className="img-fluid p-4" alt="Faysal Bank payment details for HidayatulQuran" style={{ width: "100%", height: "100%" }} sizes="(max-width: 1200px) 100vw, 33vw" />
          </div>
          <div className="col-xl-8 d-flex content" style={{ padding: "0px", margin: "0px", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="row align-self-center gy-4" style={{ padding: "0px", margin: "10px" }}>
              <div className="col-md-6 icon-box" data-aos="fade-up">
                <div>
                  <h6 style={{ color: "#444444", fontWeight: "700" }}>Bank Name:</h6>
                  <h5>Faysal Bank Limited</h5>
                </div>
              </div>
              <div className="col-md-6 icon-box" data-aos="fade-up" data-aos-delay="100">
                <div>
                  <h6 style={{ color: "#444444", fontWeight: "700" }}>Account Number:</h6>
                  <h5>3555499000016722</h5>
                </div>
              </div>
              <div className="col-md-6 icon-box" data-aos="fade-up" data-aos-delay="200">
                <div>
                  <h6 style={{ color: "#444444", fontWeight: "700" }}>IBAN:</h6>
                  <h5>PK11FAYS3555499000016722</h5>
                </div>
              </div>
              <div className="col-md-6 icon-box" data-aos="fade-up" data-aos-delay="300">
                <div>
                  <h6 style={{ color: "#444444", fontWeight: "700" }}>Account Holder Name:</h6>
                  <h5>Hidaya-tul-qur&apos;an Academy</h5>
                </div>
              </div>
              <div className="col-md-6 icon-box" data-aos="fade-up" data-aos-delay="400">
                <div>
                  <h6 style={{ color: "#444444", fontWeight: "700" }}>Country/City:</h6>
                  <h5>Pakistan/Karachi</h5>
                </div>
              </div>
              <div className="col-md-6 icon-box" data-aos="fade-up" data-aos-delay="500">
                <div>
                  <h6 style={{ color: "#444444", fontWeight: "700" }}>Email:</h6>
                  <h5>hidayatulquranofficiall@gmail.com</h5>
                </div>
              </div>
              <div className="col-md-6 icon-box" data-aos="fade-up" data-aos-delay="400">
                <div>
                  <h6 style={{ color: "#444444", fontWeight: "700" }}>Address:</h6>
                  <h5>16, Abdullah Haroon Road, Civil Lines, Karachi</h5>
                </div>
              </div>
              <div className="col-md-6 icon-box" data-aos="fade-up" data-aos-delay="500">
                <div>
                  <h6 style={{ color: "#444444", fontWeight: "700" }}>Mobile:</h6>
                  <h5>+92 336 5398542</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="payment-methods-slider" className="clients" style={{ paddingTop: "50px" }}>
        <div className="container" data-aos="fade-up">
          <Carousel preset="clients" className="clients-slider" style={{ backgroundColor: "transparent" }}>
            <div className="swiper-wrapper align-items-center">
              <div className="swiper-slide">
                <SiteImage src="/assets/img/clients/hidayatulquran_stripe.png" className="img-fluid" alt="Stripe payment method" />
              </div>
              <div className="swiper-slide"><SiteImage src="/assets/img/clients/hidayatulquran_wise.png" className="img-fluid" alt="Wise payment method" /></div>
              <div className="swiper-slide">
                <SiteImage src="/assets/img/clients/hidayatulquran_payoneer.png" className="img-fluid" alt="Payoneer payment method" />
              </div>
            </div>
            <div className="swiper-pagination"></div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

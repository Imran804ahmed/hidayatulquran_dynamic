export default function TeachingMethodSection() {
  return (
    <section id="OurTeachingMethod" className="services" aria-labelledby="services-heading">
      <div className="container" data-aos="fade-up">
        <header className="section-header">
          <h2 id="services-heading" style={{ color: "#E1B152" }}><strong>Services</strong></h2>
          <p>Our Teaching Method</p>
        </header>
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <article className="service-box blue" aria-labelledby="service-screen-sharing">
              <i className="ri-computer-line icon" aria-hidden="true"></i>
              <h3 id="service-screen-sharing">Screen Sharing</h3>
              <p>
                Teachers share lessons directly on screen for better understanding. Students clearly see Quran text, rules, and explanations in real time during class.
              </p>
            </article>
          </div>
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <article className="service-box orange" aria-labelledby="service-audio-video">
              <i className="ri-video-chat-line icon" aria-hidden="true"></i>
              <h3 id="service-audio-video">Audio/Video</h3>
              <p>
                Clear audio and video communication for smooth learning. Students and teachers interact live, ensuring correct pronunciation and focused attention.
              </p>
            </article>
          </div>
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
            <article className="service-box green" aria-labelledby="service-whiteboard">
              <i className="ri-artboard-line icon" aria-hidden="true"></i>
              <h3 id="service-whiteboard">Digital Whiteboard</h3>
              <p>
                Interactive whiteboard used for teaching and practice. Teachers write, explain rules, and highlight Quran text to make learning easy and engaging.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

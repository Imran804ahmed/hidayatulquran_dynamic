import Link from "next/link";
import { englishAlternates, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  path: "/faq",
  title: "FAQ — Online Quran Classes Questions Answered | HidayatulQuran Academy",
  description: "Get answers to common questions about our online Quran classes. Free trial, female tutors, Tajweed, Hifz, fees, scheduling and more. HidayatulQuran Academy.",
  ogDescription: "Answers to common questions about our online Quran classes — free trial, female tutors, Tajweed, scheduling, fees and more.",
  twitterTitle: "FAQ — Online Quran Classes | HidayatulQuran Academy",
  twitterDescription: "Common questions about our 1-on-1 online Quran classes answered — free trial, female tutors, Tajweed, scheduling and more.",
  languages: englishAlternates("/faq"),
});

export default function Page() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who can join HidayatulQuran Academy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Anyone can join our academy, including children, adults, beginners, and advanced learners. We also welcome new Muslims who want to learn the Quran from scratch."
            }
          },
          {
            "@type": "Question",
            "name": "Do you offer a free trial online Quran class?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we offer a free trial class so students and parents can experience our teaching style before enrolling. No payment is required."
            }
          },
          {
            "@type": "Question",
            "name": "Are the Quran classes live or recorded?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "All our classes are live, one-to-one online sessions conducted via Zoom or other online platforms for effective learning."
            }
          },
          {
            "@type": "Question",
            "name": "Do you monitor student progress?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we regularly track student progress, provide feedback, and help students improve their Quran recitation and understanding."
            }
          },
          {
            "@type": "Question",
            "name": "What equipment is required for online Quran classes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You only need a stable internet connection, a computer or mobile device, and Zoom or Microsoft Teams installed."
            }
          },
          {
            "@type": "Question",
            "name": "What languages are used for teaching?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our teachers teach in English, Urdu, and Arabic, making learning easy for students worldwide."
            }
          },
          {
            "@type": "Question",
            "name": "How long is each class?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Each class usually lasts 30 to 45 minutes, depending on the course and student's learning level."
            }
          },
          {
            "@type": "Question",
            "name": "How do I enroll in online Quran classes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can enroll by filling out our online registration form or contacting us via WhatsApp or email. Our support team will guide you through the process."
            }
          },
          {
            "@type": "Question",
            "name": "Is the learning environment safe and Islamic?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we maintain a respectful, disciplined, and Islamic learning environment at all times. Parents are welcome to observe classes."
            }
          },
          {
            "@type": "Question",
            "name": "Can class schedules be changed later?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, class schedules can be adjusted with prior notice based on availability."
            }
          }
        ]
      }} />
      <main id="main">
        <section className="breadcrumbs" style={{ marginTop: "70px" }}>
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li>F.A.Q</li>
            </ol>
            <h1><strong>Frequently Asked Questions — Online Quran Classes</strong></h1>
          </div>
        </section>
        <section id="faq" className="faq">
          <div className="container" data-aos="fade-up">
            <header className="section-header">
              <h2 style={{ color: "#E1B152" }}><strong>FAQ</strong></h2>
              <p>Online Quran Classes — Your Questions Answered</p>
            </header>
            <div className="row">
              <div className="col-lg-6">
                <div className="accordion accordion-flush" id="faqlist1">
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-1">
                        <strong>Who can join Hidayat-ul-Quran Academy?</strong>
                      </button>
                    </h3>
                    <div id="faq-content-1" className="accordion-collapse collapse" data-bs-parent="#faqlist1">
                      <div className="accordion-body">
                        Anyone can join our academy, including children, adults, beginners, and advanced learners. We also welcome new Muslims who want to learn the Quran from scratch.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-2">
                        <strong>Do you offer a free trial class?</strong>
                      </button>
                    </h3>
                    <div id="faq-content-2" className="accordion-collapse collapse" data-bs-parent="#faqlist1">
                      <div className="accordion-body">
                        Yes, we offer a free trial class so students and parents can experience our teaching style before enrolling.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-3">
                        <strong>Are the classes live or recorded?</strong>
                      </button>
                    </h3>
                    <div id="faq-content-3" className="accordion-collapse collapse" data-bs-parent="#faqlist1">
                      <div className="accordion-body">
                        All our classes are live, one-to-one online sessions conducted via Zoom or other online platforms for effective learning.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-4">
                        <strong>Do you monitor student progress?</strong>
                      </button>
                    </h3>
                    <div id="faq-content-4" className="accordion-collapse collapse" data-bs-parent="#faqlist1">
                      <div className="accordion-body">
                        Yes, we regularly track student progress, provide feedback, and help students improve their Quran recitation and understanding.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-5">
                        <strong>What equipment is required for online classes?</strong>
                      </button>
                    </h3>
                    <div id="faq-content-5" className="accordion-collapse collapse" data-bs-parent="#faqlist1">
                      <div className="accordion-body">
                        You only need a stable internet connection, a computer or mobile device, and Zoom or Microsoft Teams installed.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="accordion accordion-flush" id="faqlist2">
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2-content-1">
                        <strong>What languages are used for teaching?</strong>
                      </button>
                    </h3>
                    <div id="faq2-content-1" className="accordion-collapse collapse" data-bs-parent="#faqlist2">
                      <div className="accordion-body">Our teachers teach in English, Urdu, and Arabic, making learning easy for students worldwide.</div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2-content-2">
                        <strong>How long is each class?</strong>
                      </button>
                    </h3>
                    <div id="faq2-content-2" className="accordion-collapse collapse" data-bs-parent="#faqlist2">
                      <div className="accordion-body">Each class usually lasts 30 to 45 minutes, depending on the course and student’s learning level.</div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2-content-4">
                        <strong>How do I enroll?</strong>
                      </button>
                    </h3>
                    <div id="faq2-content-4" className="accordion-collapse collapse" data-bs-parent="#faqlist2">
                      <div className="accordion-body">
                        You can enroll by filling out our online registration form or contacting us via WhatsApp or email. Our support team will guide you through the process.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2-content-5">
                        <strong>Is the learning environment safe and Islamic?</strong>
                      </button>
                    </h3>
                    <div id="faq2-content-5" className="accordion-collapse collapse" data-bs-parent="#faqlist2">
                      <div className="accordion-body">
                        Yes, we maintain a respectful, disciplined, and Islamic learning environment at all times. Parents are welcome to observe classes.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2-content-6">
                        <strong>Can class schedules be changed later?</strong>
                      </button>
                    </h3>
                    <div id="faq2-content-6" className="accordion-collapse collapse" data-bs-parent="#faqlist2">
                      <div className="accordion-body">Yes, class schedules can be adjusted with prior notice based on availability.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

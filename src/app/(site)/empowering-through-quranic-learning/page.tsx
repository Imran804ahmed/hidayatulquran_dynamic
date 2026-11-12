import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import styles from "./page.module.css";
import SiteImage from "@/components/ui/SiteImage";

export const metadata = pageMetadata({
  path: "/empowering-through-quranic-learning",
  title: "Empowering Through Quranic Learning | HidayatulQuran Academy",
  description: "Discover how HidayatulQuran Academy empowers students through personalized Quranic learning — pace adaptation, error training, Tajweed concepts, parent involvement and spiritual growth.",
  ogDescription: "Personalized Quranic learning that adapts to every student — pace, Tajweed, error awareness, parent confidence and spiritual connection. Book a free trial today.",
  image: "/assets/img/hidayatulquran_benefits.png",
});

export default function Page() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "HidayatulQuran Academy",
        "description": "HidayatulQuran Academy empowers students through personalized Quranic learning with certified tutors, pace adaptation, Tajweed concepts, and spiritual connection building.",
        "url": "https://www.hidayatulquran.com"
      }} />
      <main id="main" className={styles.page}>
        <section className="breadcrumbs" style={{ marginTop: "70px" }}>
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/#features">Services</Link></li>
              <li>Empowering Through Quranic Learning</li>
            </ol>
            <h1><strong>Empowering Through Quranic Learning</strong></h1>
          </div>
        </section>
        <section className="about" style={{ padding: "50px 0 30px" }}>
          <div className="container" data-aos="fade-up">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <SiteImage src="/assets/img/hidayatulquran_benefits.png" className="img-fluid" alt="Personalized Quran learning benefits at HidayatulQuran Academy" style={{ borderRadius: "12px", width: "100%" }} loading="eager" sizes="(max-width: 992px) 100vw, 50vw" />
              </div>
              <div className="col-lg-6">
                <h2 style={{ color: "#082c4c" }}>Personalized Quranic Learning That Truly Empowers</h2>
                <p style={{ fontSize: "17px", marginTop: "15px", color: "#444" }}>
                  At{" "}
                  <strong>HidayatulQuran Academy</strong>
                  , we believe that every student learns differently. Our teaching approach is built around the individual — not a fixed pace or a one-size-fits-all method. From{" "}
                  <strong>learning pace adaptation</strong>
                  {" "}to{" "}
                  <strong>spiritual connection building</strong>
                  , every aspect of our curriculum is designed to nurture real, lasting Quranic growth.
                </p>
                <p style={{ fontSize: "17px", color: "#444" }}>
                  Whether you are a child starting Noorani Qaida or an adult perfecting Tajweed, our certified tutors apply six core principles to make your learning journey meaningful, consistent, and deeply connected to the Quran.
                </p>
                <a href="https://wa.me/923365398542?text=Assalamu%20Alaikum%2C%20I%20want%20to%20book%20a%20free%20trial%20Quran%20class." target="_blank" rel="noopener noreferrer" className="cta-btn-trial">
                  <i className="bi bi-whatsapp" style={{ fontSize: "20px" }}></i>
                  {" "}
                  <span>Book Free Trial Class</span>
                </a>
              </div>
            </div>
          </div>
        </section>
        <section style={{ padding: "50px 0" }} data-aos="fade-up">
          <div className="container">
            <header className="section-header">
              <h2 style={{ color: "#E1B152" }}><strong>Our Core Principles</strong></h2>
              <p>6 Ways We Empower Every Student Through Personalized Quranic Learning</p>
            </header>
            <div className="row gy-4 mt-2">
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="emp-card">
                  <div className="emp-card-icon"><i className="ri-line-chart-line"></i></div>
                  <h3>Learning Pace Adaptation</h3>
                  <p>
                    Teaching speed adjusts to the student, not the timetable. Our tutors carefully observe how quickly each student grasps new concepts and modify the lesson pace accordingly — ensuring no one feels rushed or left behind. Every student moves forward at their own confident speed.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div className="emp-card">
                  <div className="emp-card-icon"><i className="ri-error-warning-line"></i></div>
                  <h3>Error Awareness Training</h3>
                  <p>
                    Students are gently trained to recognize and correct their own mistakes. Rather than simply correcting errors for the student, our tutors teach them how to hear their own pronunciation, identify Tajweed mistakes, and self-correct — building independence and long-term accuracy in Quran recitation.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div className="emp-card">
                  <div className="emp-card-icon"><i className="ri-repeat-line"></i></div>
                  <h3>Consistency Over Intensity</h3>
                  <p>
                    Short, regular classes are designed to create long-term learning habits. We prioritize steady, daily or multi-weekly sessions over cramming. This approach embeds Quranic recitation into the student&apos;s routine naturally, producing measurable progress that lasts far beyond the classroom.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                <div className="emp-card">
                  <div className="emp-card-icon"><i className="ri-brush-4-line"></i></div>
                  <h3>Concept-Based Tajweed</h3>
                  <p>
                    Rules are taught as concepts, not memorized lists, making them easier to apply. Instead of requiring students to memorize rules by name alone, we explain the{" "}
                    <em>why</em>
                    {" "}behind each Tajweed rule — what it does to the sound, why it matters, and how to apply it naturally during recitation.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                <div className="emp-card">
                  <div className="emp-card-icon"><i className="ri-command-line"></i></div>
                  <h3>Parent Confidence System</h3>
                  <p>
                    Parents always know what is being taught and why it matters. We keep parents and guardians informed and involved at every stage — sharing progress updates, lesson summaries, and clear learning milestones so that families feel confident and reassured about their child&apos;s Quranic education.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                <div className="emp-card">
                  <div className="emp-card-icon"><i className="ri-stack-line"></i></div>
                  <h3>Spiritual Connection Building</h3>
                  <p>
                    Lessons encourage reflection and respect for the Quran, not just completion. We believe that reading the Quran is a spiritual act, not merely an academic task. Our tutors integrate short moments of reflection, meaning, and reverence into every lesson to nurture a genuine love for the Book of Allah.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section style={{ padding: "30px 0 50px", background: "#f9f9f9" }} data-aos="fade-up">
          <div className="container">
            <div className="row align-items-center gy-5">
              <div className="col-lg-6">
                <SiteImage src="/assets/img/hidayatulquran_benefits1.png" className="img-fluid" alt="HidayatulQuran Academy student benefits" style={{ borderRadius: "12px", width: "100%" }} sizes="(max-width: 992px) 100vw, 50vw" />
              </div>
              <div className="col-lg-6">
                <header className="section-header" style={{ textAlign: "left", paddingBottom: "10px" }}>
                  <h2 style={{ color: "#E1B152" }}><strong>Why Our Approach Works</strong></h2>
                  <p style={{ textAlign: "left" }}>Real Results from a Student-Centred Method</p>
                </header>
                <div className="emp-why-item">
                  <div className="emp-why-num">1</div>
                  <div>
                    <h4>No Two Students Are Taught the Same Way</h4>
                    <p>
                      Every session is tailored. A 7-year-old in the UK and an adult in Canada will receive different pacing, tone, and teaching style — because one method never fits all learners.
                    </p>
                  </div>
                </div>
                <div className="emp-why-item">
                  <div className="emp-why-num">2</div>
                  <div>
                    <h4>Progress You Can Measure</h4>
                    <p>
                      Our tutors track each student&apos;s milestones and share regular feedback with parents. You always know exactly where your child stands and what comes next.
                    </p>
                  </div>
                </div>
                <div className="emp-why-item">
                  <div className="emp-why-num">3</div>
                  <div>
                    <h4>Learning That Stays for Life</h4>
                    <p>
                      By building habits, not just lessons, our students retain and use what they learn. Consistent short sessions create Quranic literacy that stays with students throughout their lives.
                    </p>
                  </div>
                </div>
                <div className="emp-why-item">
                  <div className="emp-why-num">4</div>
                  <div>
                    <h4>Quran as a Way of Life, Not a Subject</h4>
                    <p>
                      Spiritual connection is woven into every class. Students leave not just with better recitation, but with a deeper relationship with Allah&apos;s words — which is the true purpose of Quranic education.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section style={{ padding: "30px 0 60px" }} data-aos="fade-up">
          <div className="container">
            <h2 style={{ color: "#082c4c", fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>Explore Our Online Quran Courses</h2>
            <div className="row gy-3">
              <div className="col-lg-4 col-md-6">
                <Link href="/noorani-qaida-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Noorani Qaida Online
                </Link>
              </div>
              <div className="col-lg-4 col-md-6">
                <Link href="/quran-reading-course-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Quran Reading Course Online
                </Link>
              </div>
              <div className="col-lg-4 col-md-6">
                <Link href="/quran-tajweed-course-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Quran with Tajweed Online
                </Link>
              </div>
              <div className="col-lg-4 col-md-6">
                <Link href="/quran-memorization-hifz-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Quran Memorization (Hifz)
                </Link>
              </div>
              <div className="col-lg-4 col-md-6">
                <Link href="/tafseer-quran-course-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Tafseer e Quran Course
                </Link>
              </div>
              <div className="col-lg-4 col-md-6">
                <Link href="/quranic-arabic-course-online" className="course-name-link">
                  <i className="bi bi-book"></i>
                  {" "}Quranic Arabic Course
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

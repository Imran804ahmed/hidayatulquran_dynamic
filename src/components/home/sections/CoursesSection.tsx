import CourseCardExtras from "@/components/home/CourseCardExtras";
import SiteImage from "@/components/ui/SiteImage";

export default function CoursesSection() {
  return (
    <section id="QuranCourses" className="courses" aria-labelledby="courses-heading">
      <div className="container" data-aos="fade-up">
        <header className="section-header">
          <h2 id="courses-heading" style={{ color: "#E1B152" }}><strong>Our Online Courses</strong></h2>
          <p>Learn Quran with Proper Tajweed</p>
        </header>
        <div className="row" id="coursesContainer" role="list">
          <div className="col-lg-4 col-md-6 mt-4">
            <article className="box course-card" data-aos="fade-up" data-aos-delay="400">
              <SiteImage src="/assets/img/NooraniQaida_hidayatulquran_Academy.jpg" className="img-fluid course-card-img" alt="Noorani Qaida online course for kids and Quran beginners" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <h3 className="course-card-title">Noorani Qaida</h3>
              <p className="course-card-description">
                Learn Arabic letters, correct pronunciation, proper joining, and enhanced fluency for Quran reading.
              </p>
              <CourseCardExtras n={1} benefits={["Seerat Nabi (S.A.W).","Multiple Duas.","Six kalimas.","Hadith."]} exploreHref="/noorani-qaida-online" />
            </article>
          </div>
          <div className="col-lg-4 col-md-6 mt-4">
            <article className="box course-card" data-aos="fade-up" data-aos-delay="400">
              <SiteImage src="/assets/img/QuranReadingCourse_hidayatulquran_Academy.jpeg" className="img-fluid course-card-img" alt="Quran reading course online with certified tutor guidance" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <h3 className="course-card-title">Quran Reading Course</h3>
              <p className="course-card-description">Progress from recognizing letters to reading full verses fluently with Tajweed accuracy.</p>
              <CourseCardExtras n={2} benefits={["The Method of ablution (Wazu), Its Rulings.","Seerat Nabi (S.A.W).","Multiple Duas.","Hadith."]} exploreHref="/quran-reading-course-online" />
            </article>
          </div>
          <div className="col-lg-4 col-md-6 mt-4">
            <article className="box course-card" data-aos="fade-up" data-aos-delay="600">
              <SiteImage src="/assets/img/QuranWithTajweed_hidayatulquran_Academy.jpeg" className="img-fluid course-card-img" alt="Quran with Tajweed course for accurate recitation" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <h3 className="course-card-title">Quran with Tajweed</h3>
              <p className="course-card-description">Master proper recitation rules such as Ghunna, Qalqalah, and Madd to beautify your Tilawat.</p>
              <CourseCardExtras n={3} benefits={["The Method of ablution (Wazu), Its Rulings.","The Method of Ghusal, Its Rulings.","Seerat Nabi (S.A.W).","Hadith."]} exploreHref="/quran-tajweed-course-online" />
            </article>
          </div>
          <div className="col-lg-4 col-md-6 mt-4">
            <article className="box course-card" data-aos="fade-up" data-aos-delay="800">
              <SiteImage src="/assets/img/QuranMemorization_hidayatulquran_Academy.jpeg" className="img-fluid course-card-img" alt="Quran memorization course with structured revision" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <h3 className="course-card-title">Quran Memorization</h3>
              <p className="course-card-description">
                Memorize short Surahs or the entire Quran with structured daily lessons and regular revision cycles.
              </p>
              <CourseCardExtras n={4} benefits={["The Method of Salah, Its Rulings, and Translation.","The Method of ablution (Wazu), Its Rulings.","The Method of Ghusal, Its Rulings.","Seerat Nabi (S.A.W)."]} exploreHref="/quran-memorization-hifz-online" />
            </article>
          </div>
          <div className="col-lg-4 col-md-6 mt-4">
            <article className="box course-card" data-aos="fade-up" data-aos-delay="1000">
              <SiteImage src="/assets/img/TafseerQuran_hidayatulquran_Academy.jpeg" className="img-fluid course-card-img" alt="Tafseer e Quran course for understanding Quranic meaning" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <h3 className="course-card-title">Tafseer e Quran Course</h3>
              <p className="course-card-description">Explore the translation and explanation of verses to apply Quranic wisdom in daily life.</p>
              <CourseCardExtras n={5} benefits={["The Method of Salah, Its Rulings, and Translation.","The Method of ablution (Wazu), Its Rulings.","The Method of Ghusal, Its Rulings.","Islamic Etiquette of Life."]} exploreHref="/tafseer-quran-course-online" />
            </article>
          </div>
          <div className="col-lg-4 col-md-6 mt-4">
            <article className="box course-card" data-aos="fade-up" data-aos-delay="1200">
              <SiteImage src="/assets/img/QuranicArabic_hidayatulquran_Academy.jpeg" className="img-fluid course-card-img" alt="Quranic Arabic course for understanding Quran vocabulary" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <h3 className="course-card-title">Quranic Arabic Course</h3>
              <p className="course-card-description">Understand Quranic grammar and meanings directly from Arabic without needing translation.</p>
              <CourseCardExtras n={6} benefits={["The Method of Salah, Its Rulings, and Translation.","The Method of ablution (Wazu), Its Rulings.","The Method of Ghusal, Its Rulings.","Rules of Purification (Tahārat)."]} exploreHref="/quranic-arabic-course-online" />
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { courses } from "@/content/explore-courses";
import SiteImage from "@/components/ui/SiteImage";

// The legacy script decoded the (already decoded) query value a second time.
function decodeName(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * Course catalogue. Without `?course=` every course is listed; with `?course=<title>` only that
 * course is shown (the page reads the parameter on the server).
 */
export default function ExploreMain({ course }: { course?: string }) {
  const courseName = course ? decodeName(course) : null;

  const filtered = courseName
    ? courses.filter((course) => course.title.trim().toLowerCase() === courseName.trim().toLowerCase())
    : courses;

  return (
    <main id="main">
      <section className="breadcrumbs" style={{ marginTop: "70px" }}>
        <div className="container">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li id="courseBreadcrumb">Our Online Courses</li>
          </ol>
          <h2><strong id="courseTitle">{courseName ?? "Learn Quran"}</strong></h2>
        </div>
      </section>
      <section id="QuranCourses" className="courses">
        <div className="container" data-aos="fade-up">
          <header className="section-header" style={{ padding: "0px", margin: "0px" }}>
            <h3 style={{ color: "#E1B152" }}><strong>Our Online Courses</strong></h3>
            <p id="courseDescription">{courseName ? `${courseName} with Hidaya Tul Quran` : "Learn Quran with Proper Tajweed"}</p>
          </header>
          <div className="row" id="coursesContainer">
            {filtered.length === 0 ? (
              <div style={{ width: "100%", textAlign: "center" }}>
                <h4 style={{ color: "#000" }}>Course not found</h4>
              </div>
            ) : (
              <div style={{ width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                {filtered.map((course) => (
                  <div key={course.title} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "24px" }}>
                    <div style={{ width: "90%", maxWidth: "900px" }}>
                      <div
                        className="box"
                        data-aos="fade-up"
                        data-aos-delay={course.aosDelay}
                        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", minHeight: "420px", padding: "20px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", margin: "0 auto" }}
                      >
                        <SiteImage src={course.image} className="img-fluid" alt={course.alt} style={{ width: "100%", height: "auto", minHeight: "220px", maxHeight: "450px", objectFit: "cover", borderRadius: "8px" }} sizes="(max-width: 992px) 100vw, 50vw" />
                        <h2 style={{ marginTop: "30px", color: "#000000", fontFamily: "var(--font-croissant-one), sans-serif" }}>{course.title}</h2>
                        <p style={{ flexGrow: "1", color: "#000000", fontSize: "16px" }}>{course.description}</p>
                        <div style={{ color: "#000000", fontSize: "12px", marginBottom: "15px" }}>
                          <p style={{ padding: "0", margin: "0 0 10px 0", fontWeight: "bold", fontSize: "16px" }}>You can choose one free course:</p>
                          <ul style={{ padding: "0", marginLeft: "30px", fontSize: "14px" }}>
                            {course.benefits.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

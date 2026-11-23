import SiteImage from "@/components/ui/SiteImage";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import styles from "./EnvironmentGallery.module.css";

/**
 * "Environment" section of the home page: the same five class photos as the live site's slider,
 * shown as a gallery so every photo is visible at once (no autoplay, nothing hidden).
 */
const PHOTOS = [
  { src: "/assets/img/team/hidayatulquran_Onlineclass2.jpeg", alt: "Student attending a live online Quran class" },
  { src: "/assets/img/team/hidayatulquran_Onlineclass3.jpeg", alt: "Teacher guiding an online Quran learning session" },
  { src: "/assets/img/team/hidayatulquran_Onlineclass4.jpeg", alt: "Online Quran class environment for students" },
  { src: "/assets/img/team/hidayatulquran_Onlineclass5.jpeg", alt: "One-to-one online Quran learning session" },
  { src: "/assets/img/team/hidayatulquran_Onlineclass6.jpeg", alt: "Virtual Quran class with personal tutor support" },
];

export default function EnvironmentGallery() {
  return (
    <section id="learning-environment" className="hq-section hq-section--sand" aria-labelledby="environment-heading">
      <div className="hq-container">
        <Reveal className="hq-section-head">
          <p className="hq-eyebrow">Environment</p>
          <h2 id="environment-heading" className="hq-h2">Discover our learning environment</h2>
          <p className="hq-lead">A look inside our live one-to-one online Quran classes.</p>
        </Reveal>
        <RevealGroup className={styles.gallery} aria-label="Online learning environment gallery">
          {PHOTOS.map((p) => (
            <li key={p.src} className={styles.item}>
              <figure className={styles.figure}>
                <SiteImage src={p.src} alt={p.alt} className={styles.image} sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 400px" />
              </figure>
            </li>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

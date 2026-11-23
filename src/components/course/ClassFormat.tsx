import { RevealGroup } from "@/components/motion/Reveal";
import styles from "./ClassFormat.module.css";

/**
 * "How classes work": facts the academy publishes for every course (course pages, fee cards,
 * teaching-method and features sections, enrolment process). Class length and the video
 * platform are left out on purpose: the site states them differently in different places
 * (see docs/REDESIGN.md, "Needs academy review").
 */
const ITEMS = [
  { icon: "bi-camera-video", title: "Live and one-to-one", text: "Every class is a live online session with a certified tutor, never a recording." },
  { icon: "bi-people", title: "Male or female tutor", text: "Certified male and female Quran tutors are available." },
  { icon: "bi-calendar-week", title: "3, 4 or 5 days a week", text: "Monthly plans of 3, 4 or 5 classes a week. Weekday and weekend times for all time zones." },
  { icon: "bi-easel", title: "Interactive lessons", text: "Screen sharing, clear audio and video, and a digital whiteboard to explain rules and Quran text." },
  { icon: "bi-graph-up", title: "Progress you can see", text: "Student progress is monitored, with monthly progress reports." },
  { icon: "bi-gift", title: "Free trial class", text: "Start with a free one-to-one trial class. No payment is required to register." },
];

export default function ClassFormat({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <RevealGroup className={styles.grid}>
      {ITEMS.map((item) => (
        <li key={item.title} className={styles.item}>
          <span className={styles.icon} aria-hidden="true">
            <i className={`bi ${item.icon}`}></i>
          </span>
          <div>
            <H className={styles.title}>{item.title}</H>
            <p className={styles.text}>{item.text}</p>
          </div>
        </li>
      ))}
    </RevealGroup>
  );
}

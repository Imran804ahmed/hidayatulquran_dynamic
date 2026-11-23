import { RevealGroup } from "@/components/motion/Reveal";
import styles from "./NextSteps.module.css";

/**
 * The academy's enrolment process (see /enrollment-process and the registration form's
 * "what happens next"). No response time is promised: none is published.
 */
export const STEPS = [
  { title: "Register online", text: "Choose a course and tell us about the student and the times that suit you." },
  { title: "We contact you", text: "Our team contacts you on WhatsApp or email to arrange your free trial class." },
  { title: "Start your classes", text: "After the free trial, confirm your monthly plan, days and class time." },
];

export default function NextSteps({ compact = false, headingLevel = 3 }: { compact?: boolean; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <RevealGroup as="ol" className={`${styles.steps} ${compact ? styles.compact : ""}`}>
      {STEPS.map((s, i) => (
        <li key={s.title} className={styles.step}>
          <span className={styles.num} aria-hidden="true">{i + 1}</span>
          <div>
            <H className={styles.title}>
              <span className="hq-visually-hidden">Step {i + 1}: </span>
              {s.title}
            </H>
            <p className={styles.text}>{s.text}</p>
          </div>
        </li>
      ))}
    </RevealGroup>
  );
}

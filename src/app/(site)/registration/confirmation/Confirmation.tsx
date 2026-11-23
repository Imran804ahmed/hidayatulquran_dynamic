"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { STEPS } from "@/components/course/NextSteps";
import { CONFIRMATION_KEY, type ConfirmationData } from "@/components/forms/registration-confirmation";
import { courseBySlug } from "@/content/course-catalog";
import { SITE, WHATSAPP_TRIAL } from "@/config/site";
import styles from "./page.module.css";

/** A confirmation is shown for up to 2 hours after the submission, in the same browser tab. */
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

function readConfirmation(): ConfirmationData | null {
  try {
    const raw = sessionStorage.getItem(CONFIRMATION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as ConfirmationData;
    return Date.now() - data.at < MAX_AGE_MS ? data : null;
  } catch {
    return null;
  }
}

/**
 * Confirmation is shown only when this tab just submitted a registration successfully (the form
 * stores a record in sessionStorage after the server confirms it was saved). Visiting the URL
 * directly shows a neutral page instead of a false confirmation.
 */
export default function Confirmation() {
  const [state, setState] = useState<{ ready: boolean; data: ConfirmationData | null }>({ ready: false, data: null });
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // sessionStorage is only available after hydration (the page is prerendered).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ ready: true, data: readConfirmation() });
  }, []);

  // Move focus to the heading so screen readers announce the result after the page change.
  useEffect(() => {
    if (state.ready) headingRef.current?.focus();
  }, [state.ready]);

  if (!state.ready) {
    return <section className={`hq-section ${styles.wrap}`} aria-busy="true"><div className="hq-container" /></section>;
  }

  const data = state.data;
  if (!data) {
    return (
      <section className={`hq-section hq-section--sand ${styles.wrap}`} aria-labelledby="none-heading">
        <div className={`hq-container ${styles.narrow}`}>
          <h1 id="none-heading" ref={headingRef} tabIndex={-1} className="hq-h1">No recent registration found</h1>
          <p className="hq-lead">
            We could not find a registration sent from this browser tab. If you registered earlier, our team will contact you on
            WhatsApp or email. Otherwise, you can register now.
          </p>
          <div className={`hq-btn-row ${styles.actions}`}>
            <Link href="/registration" className="hq-btn hq-btn--primary">Go to the registration form</Link>
            <Link href="/courses" className="hq-btn hq-btn--secondary">Explore courses</Link>
          </div>
        </div>
      </section>
    );
  }

  const course = courseBySlug(data.course);
  return (
    <section className={`hq-section hq-section--sand ${styles.wrap}`} aria-labelledby="done-heading">
      <div className={`hq-container ${styles.narrow}`}>
        <div className={styles.card}>
          <span className={styles.check} aria-hidden="true">
            <i className="bi bi-check-lg"></i>
          </span>
          <h1 id="done-heading" ref={headingRef} tabIndex={-1} className="hq-h1">
            Registration request received
          </h1>
          <p className="hq-lead">
            We have received your request for a free trial class. Your place is not confirmed yet: our team will contact you to arrange it.
          </p>

          <dl className={styles.details}>
            <div>
              <dt>Course</dt>
              <dd>{course ? <Link href={course.path} className="hq-link">{course.name}</Link> : "—"}</dd>
            </div>
            {data.plan && (
              <div>
                <dt>Monthly plan</dt>
                <dd>{data.plan}</dd>
              </div>
            )}
            {data.time && (
              <div>
                <dt>Preferred time</dt>
                <dd>{data.time} (your local time)</dd>
              </div>
            )}
          </dl>

          <h2 className={styles.subhead}>What happens next</h2>
          <ol className={styles.steps}>
            <li className={styles.stepDone}>
              <strong>Registration sent.</strong> Done — thank you.
            </li>
            {STEPS.slice(1).map((step) => (
              <li key={step.title}>
                <strong>{step.title}.</strong> {step.text}
              </li>
            ))}
          </ol>

          <p className={styles.help}>
            Questions in the meantime?{" "}
            <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp<span className="hq-visually-hidden"> (opens in a new tab)</span>
            </a>{" "}
            or email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
          <div className={`hq-btn-row ${styles.actions}`}>
            <Link href="/" className="hq-btn hq-btn--secondary">Back to home</Link>
            <Link href="/courses" className="hq-link">Explore other courses</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

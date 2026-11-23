"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { postForm } from "@/components/forms/SubmitOverlays";
import { NETWORK_ERROR, digitCount, fieldForServerMessage, isEmail, type FieldErrors } from "@/components/forms/FormFeedback";
import { CATALOG, courseBySlug } from "@/content/course-catalog";
import { COUNTRIES } from "@/lib/portal/lookups";
import { WHATSAPP_TRIAL } from "@/config/site";
import { CONFIRMATION_KEY, type ConfirmationData } from "./registration-confirmation";
import styles from "./RegistrationForm.module.css";


// Every country is offered the same 24 one-hour slots, in the visitor's own local time.
const HOURLY_SLOTS = Array.from({ length: 24 }, (_, h) => {
  const label = (hour: number) => {
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(h12).padStart(2, "0")}:00 ${hour % 24 < 12 ? "am" : "pm"}`;
  };
  return `${label(h)} - ${label(h + 1)}`;
});

/*
 * One "monthly plan" choice. Each package is tied to its number of class days (the fee cards sell
 * them together), so the form submits both of the original fields, `course` (package) and
 * `classes` (plan), from this single choice. ?plan=3|4|5 from the fee cards preselects it.
 */
const PLANS: Record<string, { course: string; classes: string; days: number; label: string }> = {
  3: { course: "BronzePackage", classes: "3days", days: 3, label: "Bronze — 3 days a week" },
  4: { course: "SilverPackage", classes: "4days", days: 4, label: "Silver — 4 days a week" },
  5: { course: "GoldPackage", classes: "5days", days: 5, label: "Gold — 5 days a week" },
};

const DAYS: [string, string][] = [
  ["mon", "Monday"], ["tue", "Tuesday"], ["wed", "Wednesday"], ["thu", "Thursday"], ["fri", "Friday"], ["sat", "Saturday"], ["sun", "Sunday"],
];

/** Field order = order of the error summary = keyboard order. */
const FIELD_ORDER = ["courseSlug", "fullName", "age", "country", "whatsappnumber", "email", "plan", "selectedtime", "days", "agree"];
/** Element to focus for each field from the error summary. */
const FOCUS_ID: Record<string, string> = { plan: "plan", days: "day-mon" };

function validate(form: HTMLFormElement, s: { courseSlug: string; plan: string; dayCount: number }): FieldErrors {
  const v = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? "";
  const e: FieldErrors = {};
  if (!courseBySlug(s.courseSlug)) e.courseSlug = "Choose a course.";
  if (!v("fullName")) e.fullName = "Enter the student's full name.";
  const age = v("age");
  if (!age) e.age = "Enter the student's age.";
  else if (!/^\d{1,3}$/.test(age) || Number(age) < 1 || Number(age) > 120) e.age = "Enter an age between 1 and 120, in whole years.";
  if (!v("country")) e.country = "Choose the country you live in.";
  const wa = v("whatsappnumber");
  if (!wa) e.whatsappnumber = "Enter a WhatsApp number so we can arrange the trial class.";
  else if (digitCount(wa) < 7) e.whatsappnumber = "Enter the full WhatsApp number, including the country code, like +44 7700 900123.";
  const email = v("email");
  if (!email) e.email = "Enter an email address.";
  else if (!isEmail(email)) e.email = "Enter an email address in the correct format, like name@example.com.";
  if (!PLANS[s.plan]) e.plan = "Choose a monthly plan.";
  if (!v("selectedtime")) e.selectedtime = "Choose a preferred class time.";
  const max = PLANS[s.plan]?.days;
  if (max && s.dayCount > max) e.days = `Your plan includes ${max} days a week. Untick ${s.dayCount - max} day${s.dayCount - max > 1 ? "s" : ""}.`;
  if (!(form.elements.namedItem("agree") as HTMLInputElement).checked) e.agree = "Tick the box to agree to the terms and conditions.";
  return e;
}

function Req() {
  return (
    <>
      <span className={styles.req} aria-hidden="true"> *</span>
      <span className="hq-visually-hidden"> (required)</span>
    </>
  );
}

function ErrorText({ errors, field }: { errors: FieldErrors; field: string }) {
  if (!errors[field]) return null;
  return (
    <p id={`${field}-error`} className={`hq-appear ${styles.error}`}>
      <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
      <span><span className="hq-visually-hidden">Error: </span>{errors[field]}</span>
    </p>
  );
}

/** aria-invalid + aria-describedby (error first, then the hint). */
function aria(errors: FieldErrors, field: string, hintId?: string) {
  const ids = [errors[field] ? `${field}-error` : null, hintId].filter(Boolean).join(" ");
  return { "aria-invalid": errors[field] ? (true as const) : undefined, "aria-describedby": ids || undefined };
}

type Problem = { kind: "validation"; errors: FieldErrors } | { kind: "server"; message: string };

export default function RegistrationForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const summaryHeadingId = useId();

  const [courseSlug, setCourseSlug] = useState("");
  const [courseFromPage, setCourseFromPage] = useState(false);
  const [plan, setPlan] = useState("");
  const [planFromFees, setPlanFromFees] = useState(false);
  const [country, setCountry] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [problem, setProblem] = useState<Problem | null>(null);
  const [problemKey, setProblemKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Preselect the course (?course=<slug>, from a course page) and plan (?plan=3|4|5, from a fee card).
  // Both stay changeable. Reading the URL is only possible after hydration (the page is prerendered).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get("course");
    const p = sp.get("plan") ?? "";
    /* eslint-disable react-hooks/set-state-in-effect */
    if (courseBySlug(c)) {
      setCourseSlug(c!);
      setCourseFromPage(true);
    }
    if (PLANS[p]) {
      setPlan(p);
      setPlanFromFees(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Move focus to the problem summary each time it is (re)shown, so it is read out.
  useEffect(() => {
    if (problem) summaryRef.current?.focus();
  }, [problem, problemKey]);

  const course = courseBySlug(courseSlug);
  const maxDays = PLANS[plan]?.days;

  const clearError = (field: string) => {
    if (!errors[field]) return;
    setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== field)));
  };

  const onDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.currentTarget;
    setDays((prev) => (checked ? [...prev, value] : prev.filter((d) => d !== value)));
    clearError("days");
  };

  const showProblem = (p: Problem) => {
    setProblem(p);
    setProblemKey((k) => k + 1);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return; // no duplicate submissions
    const form = e.currentTarget;

    const found = validate(form, { courseSlug, plan, dayCount: days.length });
    setErrors(found);
    if (Object.keys(found).length) {
      showProblem({ kind: "validation", errors: found });
      return;
    }

    setProblem(null);
    setSubmitting(true);
    try {
      const data = await postForm(form);
      if (data.success) {
        const confirmation: ConfirmationData = {
          course: courseSlug,
          plan: PLANS[plan]?.label ?? "",
          time: (form.elements.namedItem("selectedtime") as HTMLSelectElement).value,
          at: Date.now(),
        };
        try {
          sessionStorage.setItem(CONFIRMATION_KEY, JSON.stringify(confirmation));
        } catch {
          /* storage blocked: the confirmation page then shows a generic "sent" message */
        }
        router.push("/registration/confirmation");
        return; // keep the button disabled while the confirmation page loads
      }
      // The server answers with one message; attach it to the field it is about.
      const field = /course/i.test(data.message) ? "courseSlug" : fieldForServerMessage(data.message);
      if (field) setErrors({ [field]: data.message });
      showProblem({ kind: "server", message: data.message });
    } catch {
      showProblem({ kind: "server", message: NETWORK_ERROR });
    }
    setSubmitting(false);
  };

  const focusField = (field: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(FOCUS_ID[field] ?? field);
    el?.focus();
    el?.scrollIntoView({ block: "center" });
  };

  const timeZoneLabel = country && country !== "other" ? `${COUNTRIES[country]} time` : "your local time";
  const orderedErrors = problem?.kind === "validation" ? FIELD_ORDER.filter((f) => problem.errors[f]) : [];

  return (
    <form ref={formRef} action="/api/forms/registration" method="post" onSubmit={onSubmit} noValidate aria-labelledby="form-heading" className={styles.form}>
      <p className={styles.requiredNote}>
        Fields marked <span className={styles.req} aria-hidden="true">*</span>
        <span className="hq-visually-hidden">with an asterisk</span> are required.
      </p>

      {problem && (
        <div ref={summaryRef} className={`hq-appear ${styles.summary}`} role="alert" tabIndex={-1} aria-labelledby={summaryHeadingId}>
          {problem.kind === "validation" ? (
            <>
              <h2 id={summaryHeadingId} className={styles.summaryTitle}>
                Please correct {orderedErrors.length === 1 ? "1 answer" : `${orderedErrors.length} answers`}
              </h2>
              <ul className={styles.summaryList}>
                {orderedErrors.map((f) => (
                  <li key={f}>
                    <a href={`#${FOCUS_ID[f] ?? f}`} onClick={focusField(f)}>{problem.errors[f]}</a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2 id={summaryHeadingId} className={styles.summaryTitle}>Your registration was not sent</h2>
              <p>{problem.message}</p>
              <p>Your answers are still here. You can try again now.</p>
              <div className={styles.summaryActions}>
                <button type="submit" className="hq-btn hq-btn--primary hq-btn--sm" disabled={submitting}>Try again</button>
                <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer" className={styles.summaryLink}>
                  Or register on WhatsApp<span className="hq-visually-hidden"> (opens in a new tab)</span>
                </a>
              </div>
            </>
          )}
        </div>
      )}

      {/* 1. Course */}
      <fieldset className={styles.group}>
        <legend className={styles.legend}><span className={styles.stepNum} aria-hidden="true">1</span> Course</legend>
        <div className={styles.field}>
          <label htmlFor="courseSlug" className={styles.label}>Which course would you like?<Req /></label>
          <select id="courseSlug" name="courseSlug" className={styles.control} value={courseSlug}
            onChange={(e) => { setCourseSlug(e.target.value); setCourseFromPage(false); clearError("courseSlug"); }}
            {...aria(errors, "courseSlug", "course-hint")}>
            <option value="">Choose a course</option>
            {CATALOG.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <p id="course-hint" className={styles.hint}>
            {courseFromPage && course ? `Selected from the ${course.name} page. You can change it here.` : "Not sure? Choose the closest match. The tutor checks the student's level in the free trial class."}
          </p>
          <ErrorText errors={errors} field="courseSlug" />
          {course && (
            <div key={courseSlug} className={`hq-appear ${styles.coursePreview}`} aria-live="polite">
              <p className={styles.coursePreviewName}>
                {course.name} <span className="hq-badge">{course.level}</span>
              </p>
              <p className={styles.coursePreviewText}>{course.summary}</p>
              <Link href={course.path} className="hq-link" target="_blank">
                Course details<span className="hq-visually-hidden"> for {course.name} (opens in a new tab)</span>
              </Link>
            </div>
          )}
        </div>
      </fieldset>

      {/* 2. Student */}
      <fieldset className={styles.group}>
        <legend className={styles.legend}><span className={styles.stepNum} aria-hidden="true">2</span> Student details</legend>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="fullName" className={styles.label}>Student&apos;s full name<Req /></label>
            <input id="fullName" name="fullName" type="text" className={styles.control} autoComplete="name" maxLength={150}
              onInput={() => clearError("fullName")} {...aria(errors, "fullName")} />
            <ErrorText errors={errors} field="fullName" />
          </div>
          <div className={`${styles.field} ${styles.narrow}`}>
            <label htmlFor="age" className={styles.label}>Student&apos;s age<Req /></label>
            <input id="age" name="age" type="text" inputMode="numeric" pattern="[0-9]*" className={styles.control} maxLength={3}
              onInput={() => clearError("age")} {...aria(errors, "age", "age-hint")} />
            <p id="age-hint" className={styles.hint}>In years</p>
            <ErrorText errors={errors} field="age" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="country" className={styles.label}>Country you live in<Req /></label>
            <select id="country" name="country" className={styles.control} value={country}
              onChange={(e) => { setCountry(e.target.value); clearError("country"); }} {...aria(errors, "country")}>
              <option value="">Choose a country</option>
              {Object.entries(COUNTRIES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            </select>
            <ErrorText errors={errors} field="country" />
          </div>
          <div className={styles.field}>
            <label htmlFor="guardianName" className={styles.label}>Parent or guardian name <span className={styles.optional}>(optional)</span></label>
            <input id="guardianName" name="guardianName" type="text" className={styles.control} maxLength={150} aria-describedby="guardian-hint" />
            <p id="guardian-hint" className={styles.hint}>For students under 18</p>
          </div>
        </div>
      </fieldset>

      {/* 3. Contact */}
      <fieldset className={styles.group}>
        <legend className={styles.legend}><span className={styles.stepNum} aria-hidden="true">3</span> How we can reach you</legend>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="whatsappnumber" className={styles.label}>WhatsApp number<Req /></label>
            <input id="whatsappnumber" name="whatsappnumber" type="tel" className={styles.control} autoComplete="tel" maxLength={40}
              onInput={() => clearError("whatsappnumber")} {...aria(errors, "whatsappnumber", "whatsapp-hint")} />
            <p id="whatsapp-hint" className={styles.hint}>Include the country code, for example +44 7700 900123</p>
            <ErrorText errors={errors} field="whatsappnumber" />
          </div>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email address<Req /></label>
            <input id="email" name="email" type="email" className={styles.control} autoComplete="email" maxLength={190} spellCheck={false}
              onInput={() => clearError("email")} {...aria(errors, "email")} />
            <ErrorText errors={errors} field="email" />
          </div>
        </div>
      </fieldset>

      {/* 4. Plan and schedule */}
      <fieldset className={styles.group}>
        <legend className={styles.legend}><span className={styles.stepNum} aria-hidden="true">4</span> Plan and schedule</legend>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="plan" className={styles.label}>Monthly plan<Req /></label>
            <select id="plan" className={styles.control} value={plan}
              onChange={(e) => { setPlan(e.target.value); setPlanFromFees(false); clearError("plan"); clearError("days"); }}
              {...aria(errors, "plan", "plan-hint")}>
              <option value="">Choose a plan</option>
              {Object.entries(PLANS).map(([key, p]) => <option key={key} value={key}>{p.label}</option>)}
            </select>
            <p id="plan-hint" className={styles.hint}>
              {planFromFees ? "Selected from the fees section. You can change it here. " : "One-to-one classes. "}
              <Link href="/#fees" className="hq-link" target="_blank">
                See fees by country<span className="hq-visually-hidden"> (opens in a new tab)</span>
              </Link>
            </p>
            <ErrorText errors={errors} field="plan" />
            {/* The server expects the package and the class plan as two fields. */}
            <input type="hidden" name="course" value={PLANS[plan]?.course ?? ""} />
            <input type="hidden" name="classes" value={PLANS[plan]?.classes ?? ""} />
          </div>
          <div className={styles.field}>
            <label htmlFor="selectedtime" className={styles.label}>Preferred class time ({timeZoneLabel})<Req /></label>
            <select id="selectedtime" name="selectedtime" className={styles.control} defaultValue=""
              onChange={() => clearError("selectedtime")} {...aria(errors, "selectedtime")}>
              <option value="">Choose a time</option>
              {HOURLY_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ErrorText errors={errors} field="selectedtime" />
          </div>
        </div>
        <fieldset className={styles.days} aria-describedby={[errors.days && "days-error", "days-hint"].filter(Boolean).join(" ")}>
          <legend className={styles.label}>Preferred days <span className={styles.optional}>(optional)</span></legend>
          <p id="days-hint" className={styles.hint} aria-live="polite">
            {maxDays ? `Your plan includes ${maxDays} days a week: ${days.length} of ${maxDays} selected.` : "Choose the days that suit you. Your plan sets how many you can pick."}
          </p>
          <div className={styles.dayGrid}>
            {DAYS.map(([value, label]) => {
              const disabled = Boolean(maxDays) && days.length >= maxDays! && !days.includes(value);
              return (
                <label key={value} className={styles.day} data-disabled={disabled || undefined}>
                  <input id={`day-${value}`} type="checkbox" name="selecteddays[]" value={value} checked={days.includes(value)} onChange={onDayChange} disabled={disabled} />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
          <ErrorText errors={errors} field="days" />
        </fieldset>
      </fieldset>

      {/* 5. Notes and terms */}
      <fieldset className={styles.group}>
        <legend className={styles.legend}><span className={styles.stepNum} aria-hidden="true">5</span> Anything else</legend>
        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>Message or notes <span className={styles.optional}>(optional)</span></label>
          <textarea id="message" name="message" className={styles.control} rows={4} maxLength={4800} aria-describedby="message-hint" />
          <p id="message-hint" className={styles.hint}>For example, a preference for a male or female tutor.</p>
        </div>
        <details className={styles.terms}>
          <summary>Read the terms and conditions</summary>
          <p>
            By enrolling in our Online Quran Academy, you agree to respect and adhere to all rules and regulations outlined. You commit to maintaining respectful conduct during classes and engaging in all activities with sincerity. The Academy holds the right to terminate access to any participant who violates the guidelines. All content provided, including lessons, materials, and resources, remains the property of the Academy and is for personal, non-commercial use only. By accessing our services, you acknowledge and accept these terms.
          </p>
        </details>
        <div className={styles.field}>
          <label htmlFor="agree" className={styles.check}>
            <input id="agree" name="agree" type="checkbox" onChange={() => clearError("agree")} {...aria(errors, "agree")} />
            <span>I agree to the terms and conditions<Req /></span>
          </label>
          <ErrorText errors={errors} field="agree" />
        </div>
      </fieldset>

      <div className={styles.submitRow}>
        <button type="submit" className="hq-btn hq-btn--primary" disabled={submitting} aria-describedby="submit-note">
          {submitting ? (
            <>
              <span className={styles.spinner} aria-hidden="true"></span> Sending registration…
            </>
          ) : (
            "Send registration"
          )}
        </button>
        <p id="submit-note" className={styles.hint}>No payment is needed to register.</p>
      </div>
      <p className="hq-visually-hidden" role="status">{submitting ? "Sending your registration. Please wait." : ""}</p>
    </form>
  );
}

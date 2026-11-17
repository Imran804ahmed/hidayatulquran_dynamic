"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SubmitOverlays, postForm, useSubmitFlow } from "@/components/forms/SubmitOverlays";
import {
  FieldError,
  FormSummary,
  NETWORK_ERROR,
  Req,
  digitCount,
  fieldAria,
  fieldForServerMessage,
  focusFirstInvalid,
  isEmail,
  type FieldErrors,
} from "@/components/forms/FormFeedback";
import { WHATSAPP_TRIAL } from "@/config/site";
import styles from "./RegistrationForm.module.css";

const selectStyle = { position: "relative", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", paddingRight: "30px" } as const;

const COUNTRY_NAMES: Record<string, string> = {
  uk: "United Kingdom",
  usa: "United States",
  canada: "Canada",
  uae: "United Arab Emirates",
  ksa: "Kingdom of Saudi Arabia",
  ger: "Germany",
  other: "Other",
};

// Every country is offered the same 24 one-hour slots, in the visitor's own local time.
const HOURLY_SLOTS = Array.from({ length: 24 }, (_, h) => {
  const label = (hour: number) => {
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(h12).padStart(2, "0")}:00 ${hour % 24 < 12 ? "am" : "pm"}`;
  };
  return `${label(h)} - ${label(h + 1)}`;
});

/*
 * One "monthly plan" choice. Each package is tied to its number of class days (the pricing cards
 * sell them together), so the form submits both of the original fields, `course` (package) and
 * `classes` (plan), from this single choice. ?plan=3|4|5 from the pricing cards pre-selects it.
 */
const PLANS: Record<string, { course: string; classes: string; days: number; label: string }> = {
  3: { course: "BronzePackage", classes: "3days", days: 3, label: "Bronze Package — 3 days a week" },
  4: { course: "SilverPackage", classes: "4days", days: 4, label: "Silver Package — 4 days a week" },
  5: { course: "GoldPackage", classes: "5days", days: 5, label: "Gold Package — 5 days a week" },
};

const DAYS = [
  ["mon", "Monday"],
  ["tue", "Tuesday"],
  ["wed", "Wednesday"],
  ["thu", "Thursday"],
  ["fri", "Friday"],
  ["sat", "Saturday"],
  ["sun", "Sunday"],
];

function validate(form: HTMLFormElement, plan: string, dayCount: number): FieldErrors {
  const v = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? "";
  const e: FieldErrors = {};
  if (!v("fullName")) e.fullName = "Enter the student's full name.";
  const age = v("age");
  if (!age) e.age = "Enter the student's age.";
  else if (!/^\d{1,3}$/.test(age) || Number(age) < 1 || Number(age) > 120) e.age = "Enter an age between 1 and 120.";
  if (!v("country")) e.country = "Choose your country.";
  const wa = v("whatsappnumber");
  if (!wa) e.whatsappnumber = "Enter a WhatsApp number so we can arrange your classes.";
  else if (digitCount(wa) < 7) e.whatsappnumber = "Enter the full WhatsApp number, including the country code.";
  const email = v("email");
  if (!email) e.email = "Enter an email address.";
  else if (!isEmail(email)) e.email = "Enter a valid email address, like name@example.com.";
  if (!plan) e.plan = "Choose a monthly plan.";
  if (!v("selectedtime")) e.selectedtime = "Choose a preferred class time.";
  const max = PLANS[plan]?.days;
  if (max && dayCount > max) e.days = `Your plan includes ${max} days a week. Untick ${dayCount - max} day${dayCount - max > 1 ? "s" : ""}.`;
  if (!(form.elements.namedItem("agree") as HTMLInputElement).checked) e.agree = "Please agree to the terms and conditions to continue.";
  return e;
}

export default function RegistrationForm() {
  const flow = useSubmitFlow();
  const formRef = useRef<HTMLFormElement>(null);
  const [country, setCountry] = useState("");
  const [plan, setPlan] = useState("");
  const [fromPricing, setFromPricing] = useState(false);
  const [days, setDays] = useState<string[]>([]);
  const dayCount = days.length;
  const [errors, setErrors] = useState<FieldErrors>({});
  const [summary, setSummary] = useState<{ message: string; key: number } | null>(null);

  // Pre-select the plan chosen on a pricing card (?plan=3|4|5). It stays changeable.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("plan") ?? "";
    if (PLANS[fromUrl]) {
      // Reading the URL is only possible after hydration (the page is prerendered).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlan(fromUrl);
      setFromPricing(true);
    }
  }, []);

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (flow.loading) return;
    const form = e.currentTarget;

    const found = validate(form, plan, dayCount);
    setErrors(found);
    if (Object.keys(found).length) {
      const n = Object.keys(found).length;
      setSummary({ message: `Please check ${n === 1 ? "1 field" : `${n} fields`} marked below.`, key: 0 });
      focusFirstInvalid(form);
      return;
    }
    setSummary(null);

    flow.setLoading(true);
    try {
      const data = await postForm(form);
      flow.setLoading(false);
      if (data.success) {
        form.reset();
        setPlan("");
        setFromPricing(false);
        setDays([]);
        setCountry("");
        flow.showSuccess(data.message);
      } else {
        const field = fieldForServerMessage(data.message);
        if (field) setErrors({ [field]: data.message });
        setSummary({ message: data.message, key: Date.now() });
      }
    } catch {
      flow.setLoading(false);
      setSummary({ message: NETWORK_ERROR, key: Date.now() });
    }
  };

  const loading = flow.loading;
  const timeZoneLabel = country && country !== "other" ? `${COUNTRY_NAMES[country]} time` : "your local time";

  return (
    <>
      <form ref={formRef} action="/api/forms/registration" method="post" className="php-email-form" onSubmit={onSubmit} noValidate aria-label="Registration form">
        <h3 className={styles.groupHeading}>Student details</h3>
        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="fullName">Student full name<Req /></label>
            <input id="fullName" name="fullName" type="text" className="form-control" autoComplete="name" required maxLength={150}
              onInput={() => clearError("fullName")} {...fieldAria(errors, "fullName")} />
            <FieldError errors={errors} field="fullName" />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="age">Student age<Req /></label>
            <input id="age" name="age" type="number" inputMode="numeric" min={1} max={120} className="form-control" required
              onInput={() => clearError("age")} {...fieldAria(errors, "age")} />
            <FieldError errors={errors} field="age" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="country">Country<Req /></label>
            <select id="country" name="country" className="form-control" required style={selectStyle} defaultValue=""
              onChange={(e) => { setCountry(e.target.value); clearError("country"); }} {...fieldAria(errors, "country")}>
              <option value="" disabled>Select country</option>
              {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
            <FieldError errors={errors} field="country" />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="guardianName">Parent / guardian name <span className="form-hint d-inline">(optional, for students under 18)</span></label>
            <input id="guardianName" name="guardianName" type="text" className="form-control" maxLength={150} />
          </div>
        </div>

        <h3 className={styles.groupHeading}>How we can reach you</h3>
        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="whatsappnumber">WhatsApp number<Req /></label>
            <input id="whatsappnumber" name="whatsappnumber" type="tel" className="form-control" autoComplete="tel" required maxLength={40}
              placeholder="+44 7700 900123" onInput={() => clearError("whatsappnumber")} {...fieldAria(errors, "whatsappnumber", "whatsapp-hint")} />
            <span id="whatsapp-hint" className="form-hint">Include your country code. We use WhatsApp to arrange your free trial.</span>
            <FieldError errors={errors} field="whatsappnumber" />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="email">Email address<Req /></label>
            <input id="email" name="email" type="email" className="form-control" autoComplete="email" required maxLength={190}
              onInput={() => clearError("email")} {...fieldAria(errors, "email", "email-hint")} />
            <span id="email-hint" className="form-hint">We send your registration confirmation here.</span>
            <FieldError errors={errors} field="email" />
          </div>
        </div>

        <h3 className={styles.groupHeading}>Class plan and schedule</h3>
        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="plan">Monthly plan<Req /></label>
            <select id="plan" className="form-control" required style={selectStyle} value={plan}
              onChange={(e) => { setPlan(e.target.value); setFromPricing(false); clearError("plan"); clearError("days"); }}
              {...fieldAria(errors, "plan", "plan-hint")}>
              <option value="">Select a plan</option>
              {Object.entries(PLANS).map(([key, p]) => (
                <option key={key} value={key}>{p.label}</option>
              ))}
            </select>
            <span id="plan-hint" className="form-hint">
              {fromPricing ? "Selected from the plan you chose. You can change it here." : "30-minute one-to-one classes. "}
              {!fromPricing && <Link href="/#MonthlyFee">See fees by country</Link>}
            </span>
            <FieldError errors={errors} field="plan" />
            {/* The server expects the package and the class plan as two fields. */}
            <input type="hidden" name="course" value={PLANS[plan]?.course ?? ""} />
            <input type="hidden" name="classes" value={PLANS[plan]?.classes ?? ""} />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="selectedtime">Preferred class time ({timeZoneLabel})<Req /></label>
            <select id="selectedtime" name="selectedtime" className="form-control" required style={selectStyle} defaultValue=""
              onChange={() => clearError("selectedtime")} {...fieldAria(errors, "selectedtime")}>
              <option value="">Select a time</option>
              {HOURLY_SLOTS.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            <FieldError errors={errors} field="selectedtime" />
          </div>
        </div>
        <div className="row">
          <div className="col form-group">
            <fieldset className="form-fieldset" aria-describedby={[errors.days && "days-error", "days-hint"].filter(Boolean).join(" ")}>
              <legend>Preferred days <span className="form-hint d-inline">(optional)</span></legend>
              <div id="days-container" className="d-flex flex-wrap">
                {DAYS.map(([value, label]) => (
                  <label key={value} className="d-inline-block col-6 col-md-4 col-lg-3">
                    {/* At the plan's limit the remaining days are disabled, so the limit cannot be exceeded. */}
                    <input type="checkbox" name="selecteddays[]" value={value} checked={days.includes(value)} onChange={onDayChange}
                      disabled={Boolean(maxDays) && dayCount >= maxDays! && !days.includes(value)} /> <span>{label}</span>
                  </label>
                ))}
              </div>
              <span id="days-hint" className="form-hint" aria-live="polite">
                {maxDays ? `Your plan includes ${maxDays} days a week — ${dayCount} of ${maxDays} selected.` : "Choose the days that suit you. Your plan sets how many days you can pick."}
              </span>
              <FieldError errors={errors} field="days" />
            </fieldset>
          </div>
        </div>
        <div className="row">
          <div className="col form-group">
            <label htmlFor="message">Message or notes <span className="form-hint d-inline">(optional)</span></label>
            <textarea id="message" name="message" className="form-control" maxLength={5000}
              placeholder="For example: the course you are interested in, or a teacher preference" />
          </div>
        </div>
        <div className="form-group">
          <h3 className={styles.termsHeading}>Terms and conditions</h3>
          <div className={styles.termsText}>
            <p>
              By enrolling in our Online Quran Academy, you agree to respect and adhere to all rules and regulations outlined. You commit to maintaining respectful conduct during classes and engaging in all activities with sincerity. The Academy holds the right to terminate access to any participant who violates the guidelines. All content provided, including lessons, materials, and resources, remains the property of the Academy and is for personal, non-commercial use only. By accessing our services, you acknowledge and accept these terms.
            </p>
          </div>
          <label htmlFor="agree" className={styles.termsLabel}>
            <input id="agree" name="agree" type="checkbox" required onChange={() => clearError("agree")} {...fieldAria(errors, "agree")} /> I agree to the terms and conditions<Req />
          </label>
          <FieldError errors={errors} field="agree" />
        </div>
        <FormSummary message={summary?.message ?? null} focusKey={summary?.key ?? 0}>
          {summary && summary.key > 0 && (
            <p className="small fw-normal mt-1">
              Still having trouble? <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a> instead.
            </p>
          )}
        </FormSummary>
        <button type="submit" id="reg-submit-btn" className="btn btn-primary" style={{ minWidth: "160px", position: "relative" }} disabled={loading} aria-busy={loading}>
          <span id="reg-btn-text" style={loading ? { display: "none" } : undefined}>Submit Registration</span>{" "}
          <span id="reg-btn-loader" style={{ display: loading ? "flex" : "none", alignItems: "center", gap: "8px", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 38 38" stroke="#fff" aria-hidden="true" style={{ animation: "rSpin 0.8s linear infinite", flexShrink: "0" }}>
              <g fill="none">
                <g transform="translate(1 1)" strokeWidth="3">
                  <circle strokeOpacity=".35" cx="18" cy="18" r="18"></circle>
                  <path d="M36 18c0-9.94-8.06-18-18-18"></path>
                </g>
              </g>
            </svg>{" "}
            Submitting...
          </span>
        </button>
      </form>
      <SubmitOverlays
        flow={flow}
        idPrefix="reg"
        popupPrefix="rs"
        loadingText="Submitting your registration…"
        title="Registration Submitted!"
        defaultMessage="Thank you for registering. We have received your details and will contact you shortly."
        nextStep="What happens next: our team will contact you on WhatsApp or email to arrange your free trial class."
      />
    </>
  );
}

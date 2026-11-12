"use client";

import { useEffect, useRef, useState } from "react";
import { SubmitOverlays, postForm, useSubmitFlow } from "@/components/forms/SubmitOverlays";
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

// Every country offered the same 24 one-hour slots in the legacy page.
const HOURLY_SLOTS = Array.from({ length: 24 }, (_, h) => {
  const label = (hour: number) => {
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(h12).padStart(2, "0")}:00 ${hour % 24 < 12 ? "am" : "pm"}`;
  };
  return `${label(h)} - ${label(h + 1)}`;
});

// ?plan=3|4|5 (from the home-page pricing cards) locks the package and caps the number of days.
const PLANS: Record<string, { course: string; classes: string; maxDays: number }> = {
  3: { course: "BronzePackage", classes: "3days", maxDays: 3 },
  4: { course: "SilverPackage", classes: "4days", maxDays: 4 },
  5: { course: "GoldPackage", classes: "5days", maxDays: 5 },
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

export default function RegistrationForm() {
  const flow = useSubmitFlow();
  const [country, setCountry] = useState("");
  const courseRef = useRef<HTMLSelectElement>(null);
  const classesRef = useRef<HTMLSelectElement>(null);
  const agreeRef = useRef<HTMLInputElement>(null);
  const dayLimit = useRef<number | null>(null);
  const selectedPlan = useRef<(typeof PLANS)[string] | undefined>(undefined);

  // The package selects are server-rendered disabled and toggled imperatively, as in the legacy
  // script: disabled fields are not submitted, so they are briefly re-enabled around submission.
  const setPackageFieldsDisabled = (isDisabled: boolean) => {
    if (courseRef.current) courseRef.current.disabled = isDisabled;
    if (classesRef.current) classesRef.current.disabled = isDisabled;
  };

  useEffect(() => {
    const plan = PLANS[new URLSearchParams(window.location.search).get("plan") ?? ""];
    selectedPlan.current = plan;
    if (plan) {
      courseRef.current!.value = plan.course;
      classesRef.current!.value = plan.classes;
      setPackageFieldsDisabled(true);
      dayLimit.current = plan.maxDays;
    } else {
      // Direct registrations choose their own package and class plan.
      setPackageFieldsDisabled(false);
    }
  }, []);

  const onDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const box = e.currentTarget;
    const checked = box.form!.querySelectorAll('#days-container input[type="checkbox"]:checked').length;
    if (dayLimit.current && checked > dayLimit.current) {
      alert(`You can only select ${dayLimit.current} days.`);
      box.checked = false;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!agreeRef.current!.checked) {
      alert("You must agree to the terms & conditions.");
      return;
    }

    flow.setLoading(true);
    setPackageFieldsDisabled(false);
    try {
      const data = await postForm(form);
      flow.setLoading(false);
      setPackageFieldsDisabled(Boolean(selectedPlan.current));
      if (data.success) {
        form.reset();
        flow.showSuccess(data.message);
      } else {
        alert(data.message);
      }
    } catch {
      flow.setLoading(false);
      setPackageFieldsDisabled(Boolean(selectedPlan.current));
      alert("Something went wrong. Please try again.");
    }
  };

  const loading = flow.loading;

  return (
    <>
      <form action="/api/forms/registration" method="post" className="php-email-form" onSubmit={onSubmit}>
        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="fullName">Student Full Name:</label>{" "}
            <input id="fullName" name="fullName" type="text" className="form-control" placeholder="Student Full Name" required />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="age">Age:</label>{" "}
            <input id="age" name="age" type="number" className="form-control" placeholder="Age" required />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="country" className="font-weight-bold">Country:</label>
            <select id="country" name="country" className="form-control" required style={selectStyle} defaultValue="" onChange={(e) => setCountry(e.target.value)}>
              <option value="" disabled>Select Country</option>
              {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="guardianName">Parent/Guardian Name (optional)</label>{" "}
            <input id="guardianName" name="guardianName" type="text" className="form-control" placeholder="Parent/Guardian Name" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="whatsappnumber">WhatsApp Number:</label>{" "}
            <input id="whatsappnumber" name="whatsappnumber" type="tel" className="form-control" placeholder="WhatsApp Number" required />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="email">Email Address:</label>{" "}
            <input id="email" name="email" type="email" className="form-control" placeholder="Email Address" required />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="course">Select Package:</label>
            <select ref={courseRef} disabled id="course" name="course" className="form-control" required style={selectStyle}>
              <option value="">Select Package</option>
              <option value="BronzePackage">Bronze Package</option>
              <option value="SilverPackage">Silver Package</option>
              <option value="GoldPackage">Gold Package</option>
            </select>
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="classes">Classes plan:</label>
            <select
              ref={classesRef}
              disabled
              id="classes"
              name="classes"
              className="form-control"
              required
              style={selectStyle}
              onChange={(e) => {
                const maxDays = parseInt(e.target.value, 10);
                if (maxDays) dayLimit.current = maxDays;
              }}
            >
              <option value="">Select Classes plan</option>
              <option value="3days">3 days Plan</option>
              <option value="4days">4 days Plan</option>
              <option value="5days">5 days Plan</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="selectedtime" id="timeLabel">
              {country ? `Preferred Time (${COUNTRY_NAMES[country] ?? "Country"}):` : "Preferred Time:"}
            </label>
            <select id="selectedtime" name="selectedtime" className="form-control" required style={selectStyle}>
              <option value="">Select Preferred Time</option>
              {(country in COUNTRY_NAMES ? HOURLY_SLOTS : []).map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="days">Preferred days:</label>
            <div id="days-container" className="d-flex flex-wrap">
              {DAYS.map(([value, label]) => (
                <label key={value} className="d-inline-block col-6 col-md-4 col-lg-3">
                  <input type="checkbox" name="selecteddays[]" value={value} onChange={onDayChange} /> {label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col form-group">
            <label htmlFor="message">Message / Notes (optional)</label>
            <textarea id="message" name="message" className="form-control" placeholder="Your Message / Notes" />
          </div>
        </div>
        <div className="form-group">
          <h3 className={styles.termsHeading} style={{ marginBottom: "5px" }}>Terms and Conditions</h3>
          <div className={styles.termsText}>
            <p style={{ fontSize: "13px" }}>
              By enrolling in our Online Quran Academy, you agree to respect and adhere to all rules and regulations outlined. You commit to maintaining respectful conduct during classes and engaging in all activities with sincerity. The Academy holds the right to terminate access to any participant who violates the guidelines. All content provided, including lessons, materials, and resources, remains the property of the Academy and is for personal, non-commercial use only. By accessing our services, you acknowledge and accept these terms.
            </p>
          </div>
          <label htmlFor="agree" className={styles.termsLabel}>
            <input ref={agreeRef} id="agree" name="agree" type="checkbox" required /> I Agree to Terms &amp; Conditions
          </label>
        </div>
        <button type="submit" id="reg-submit-btn" className="btn btn-primary" style={{ minWidth: "160px", position: "relative" }} disabled={loading}>
          <span id="reg-btn-text" style={loading ? { display: "none" } : undefined}>Register</span>{" "}
          <span id="reg-btn-loader" style={{ display: loading ? "flex" : "none", alignItems: "center", gap: "8px", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 38 38" stroke="#fff" style={{ animation: "rSpin 0.8s linear infinite", flexShrink: "0" }}>
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
      />
    </>
  );
}

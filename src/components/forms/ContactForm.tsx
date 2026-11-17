"use client";

import { useState } from "react";
import { SubmitOverlays, postForm, useSubmitFlow } from "@/components/forms/SubmitOverlays";
import {
  FieldError,
  FormSummary,
  NETWORK_ERROR,
  Req,
  fieldAria,
  fieldForServerMessage,
  focusFirstInvalid,
  isEmail,
  type FieldErrors,
} from "@/components/forms/FormFeedback";

function validate(form: HTMLFormElement): FieldErrors {
  const v = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? "";
  const e: FieldErrors = {};
  if (!v("fullName")) e.fullName = "Enter your name.";
  const email = v("email");
  if (!email) e.email = "Enter your email address so we can reply.";
  else if (!isEmail(email)) e.email = "Enter a valid email address, like name@example.com.";
  if (!v("subject")) e.subject = "Enter a subject.";
  if (!v("message")) e.message = "Enter your message.";
  return e;
}

/** Home-page contact form, posting to /api/forms/contact (fields unchanged). */
export default function ContactForm() {
  const flow = useSubmitFlow();
  const loading = flow.loading;
  const [errors, setErrors] = useState<FieldErrors>({});
  const [summary, setSummary] = useState<{ message: string; key: number } | null>(null);

  const clearError = (field: string) => {
    if (errors[field]) setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== field)));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (flow.loading) return;
    const form = e.currentTarget;
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      setSummary(null);
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
        flow.showSuccess(data.message);
      } else {
        const field = fieldForServerMessage(data.message);
        if (field === "email") setErrors({ email: data.message });
        setSummary({ message: data.message, key: Date.now() });
      }
    } catch {
      flow.setLoading(false);
      setSummary({ message: NETWORK_ERROR, key: Date.now() });
    }
  };

  const onInput = (e: React.FormEvent<HTMLFormElement>) => clearError((e.target as HTMLInputElement).name);

  return (
    <>
      <div className="col-lg-6">
        <form action="/api/forms/contact" method="post" className="php-email-form" aria-label="Contact form" onSubmit={onSubmit} onInput={onInput} noValidate>
          <p className="small mb-3">Have a question? Send us a message and we will reply by email. Fields marked <span className="form-req" aria-hidden="true">*</span> are required.</p>
          <div className="row gy-3">
            <div className="col-md-6">
              <label htmlFor="fullName" className="form-label">Your name<Req /></label>
              <input type="text" name="fullName" className="form-control" id="fullName" autoComplete="name" maxLength={150} required {...fieldAria(errors, "fullName")} />
              <FieldError errors={errors} field="fullName" />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Your email<Req /></label>
              <input type="email" className="form-control" id="email" name="email" autoComplete="email" maxLength={190} required {...fieldAria(errors, "email")} />
              <FieldError errors={errors} field="email" />
            </div>
            <div className="col-md-12">
              <label htmlFor="subject" className="form-label">Subject<Req /></label>
              <input type="text" className="form-control" name="subject" id="subject" maxLength={255} required {...fieldAria(errors, "subject")} />
              <FieldError errors={errors} field="subject" />
            </div>
            <div className="col-md-12">
              <label htmlFor="message" className="form-label">Message<Req /></label>
              <textarea className="form-control" name="message" id="message" rows={6} maxLength={5000} required {...fieldAria(errors, "message")} />
              <FieldError errors={errors} field="message" />
            </div>
            <div className="col-md-12">
              <FormSummary message={summary?.message ?? null} focusKey={summary?.key ?? 0} />
            </div>
            <div className="col-md-12 text-center">
              <button type="submit" id="contact-submit-btn" style={{ minWidth: "160px", position: "relative" }} disabled={loading} aria-busy={loading}>
                <span id="contact-btn-text" style={loading ? { display: "none" } : undefined}>Send Message</span>{" "}
                <span id="contact-btn-loader" style={{ display: loading ? "flex" : "none", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                  {/* The legacy keyframe name really is "cSpин" (mixed Latin/Cyrillic); kept so it still matches. */}
                  <svg width="18" height="18" viewBox="0 0 38 38" stroke="#fff" aria-hidden="true" style={{ animation: "cSpин 0.8s linear infinite", flexShrink: "0" }}>
                    <g fill="none">
                      <g transform="translate(1 1)" strokeWidth="3">
                        <circle strokeOpacity=".35" cx="18" cy="18" r="18"></circle>
                        <path d="M36 18c0-9.94-8.06-18-18-18"></path>
                      </g>
                    </g>
                  </svg>{" "}
                  Sending...
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
      <SubmitOverlays
        flow={flow}
        idPrefix="contact"
        popupPrefix="cs"
        loadingText="Sending your message…"
        title="Message Sent!"
        defaultMessage="Thank you for reaching out. We have received your message and will get back to you shortly."
        nextStep="What happens next: our team will reply to the email address you entered."
      />
    </>
  );
}

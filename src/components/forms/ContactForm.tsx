"use client";

import { SubmitOverlays, postForm, useSubmitFlow } from "@/components/forms/SubmitOverlays";

/** Home-page contact form, posting to the existing forms/contact.php endpoint. */
export default function ContactForm() {
  const flow = useSubmitFlow();
  const loading = flow.loading;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    flow.setLoading(true);
    try {
      const data = await postForm(form);
      flow.setLoading(false);
      if (data.success) {
        form.reset();
        flow.showSuccess(data.message);
      } else {
        alert(data.message);
      }
    } catch {
      flow.setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="col-lg-6">
        <form action="/api/forms/contact" method="post" className="php-email-form" aria-label="Contact form" onSubmit={onSubmit}>
          <div className="row gy-4">
            <div className="col-md-6">
              <label htmlFor="fullName" className="visually-hidden">Your Full Name</label>{" "}
              <input type="text" name="fullName" className="form-control" id="fullName" placeholder="Your Full Name" required aria-required="true" />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="visually-hidden">Your Email</label>{" "}
              <input type="email" className="form-control" id="email" name="email" placeholder="Your Email" required aria-required="true" />
            </div>
            <div className="col-md-12">
              <label htmlFor="subject" className="visually-hidden">Subject</label>{" "}
              <input type="text" className="form-control" name="subject" id="subject" placeholder="Subject" required aria-required="true" />
            </div>
            <div className="col-md-12">
              <label htmlFor="message" className="visually-hidden">Message</label>
              <textarea className="form-control" name="message" id="message" rows={6} placeholder="Message" required aria-required="true" />
            </div>
            <div className="col-md-12 text-center">
              <button type="submit" id="contact-submit-btn" style={{ minWidth: "160px", position: "relative" }} disabled={loading}>
                <span id="contact-btn-text" style={loading ? { display: "none" } : undefined}>Send Message</span>{" "}
                <span id="contact-btn-loader" style={{ display: loading ? "flex" : "none", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                  {/* The legacy keyframe name really is "cSpин" (mixed Latin/Cyrillic); kept so it still matches. */}
                  <svg width="18" height="18" viewBox="0 0 38 38" stroke="#fff" style={{ animation: "cSpин 0.8s linear infinite", flexShrink: "0" }}>
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
      />
    </>
  );
}

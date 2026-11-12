import { Fragment } from "react";
import { WHATSAPP_TRIAL } from "@/config/site";
import styles from "./EnrollCta.module.css";

const DEFAULT_PERKS = ["Certified Tutors", "1-on-1 Live Classes", "Free Trial Class", "No Payment Required", "All Time Zones"];

/** "Enroll now" banner with the academy's key perks (course and country pages). */
export default function EnrollCta({
  href = WHATSAPP_TRIAL,
  perks = DEFAULT_PERKS,
  label = "Enroll Now — Free Trial Available",
}: {
  href?: string;
  perks?: string[];
  label?: string;
}) {
  return (
    <div className="cta-enroll-section">
      <div className="cta-enroll-perks">
        {perks.map((perk, i) => (
          <Fragment key={perk}>
            {i > 0 && " "}
            <span>✓ {perk}</span>
          </Fragment>
        ))}
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer" className="cta-btn-enroll">
        <i className={`bi bi-whatsapp ${styles.whatsapp}`}></i> <span>{label}</span>{" "}
        <i className={`bi bi-arrow-right-circle ${styles.arrow}`}></i>
      </a>
    </div>
  );
}

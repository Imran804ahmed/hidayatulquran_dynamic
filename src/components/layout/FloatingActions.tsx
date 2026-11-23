"use client";

import { usePathname } from "next/navigation";
import { WHATSAPP_TRIAL } from "@/config/site";
import { useScrolledPast } from "@/hooks/useScrolledPast";
import styles from "./FloatingActions.module.css";

/** Bottom-right WhatsApp + back-to-top buttons; shown once the page is scrolled. */
export default function FloatingActions() {
  const visible = useScrolledPast(100);
  // Hidden on the registration pages, where it would cover form controls on small screens
  // (the form has its own WhatsApp link).
  const pathname = usePathname();
  if (pathname.startsWith("/registration")) return null;
  return (
    <div className={`back-to-top d-flex align-items-center ${styles.stack} ${visible ? "active" : ""}`}>
      <div className={styles.whatsapp}>
        <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp">
          <i className="bi bi-whatsapp"></i>
        </a>
      </div>
      <div className={styles.top}>
        <a
          href="#"
          aria-label="Back to top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <i className="bi bi-arrow-up-short"></i>
        </a>
      </div>
    </div>
  );
}

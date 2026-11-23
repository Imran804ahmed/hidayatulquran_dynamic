import type { ReactNode } from "react";
import styles from "./FaqList.module.css";

export type FaqEntry = { q: ReactNode; a: ReactNode };

/**
 * Questions and answers for the redesigned pages, built on native <details>/<summary>:
 * opens with mouse, touch, Enter or Space, works without JavaScript, and every answer is in the
 * server HTML for search engines. Opening fades the answer in and turns the chevron.
 */
export default function FaqList({ items, className }: { items: FaqEntry[]; className?: string }) {
  return (
    <div className={`${styles.list} ${className ?? ""}`}>
      {items.map((item, i) => (
        <details key={i} className={styles.item}>
          <summary className={styles.question}>
            <span>{item.q}</span>
            <i className={`bi bi-chevron-down ${styles.chevron}`} aria-hidden="true"></i>
          </summary>
          <div className={styles.answer}>{item.a}</div>
        </details>
      ))}
    </div>
  );
}

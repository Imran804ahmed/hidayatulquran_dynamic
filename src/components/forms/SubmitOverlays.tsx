"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SubmitOverlays.module.css";

/** Loader / success-popup state shared by the contact and registration forms. */
export function useSubmitFlow() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ message: string; shownAt: number } | null>(null);
  const autoClose = useRef<ReturnType<typeof setTimeout>>(undefined);

  const closeSuccess = useCallback(() => {
    setSuccess(null);
    clearTimeout(autoClose.current);
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      clearTimeout(autoClose.current);
      setSuccess({ message, shownAt: Date.now() }); // new key restarts the progress-bar animation
      autoClose.current = setTimeout(closeSuccess, 5000);
    },
    [closeSuccess],
  );

  useEffect(() => () => clearTimeout(autoClose.current), []);

  return { loading, setLoading, success, showSuccess, closeSuccess };
}

type Props = {
  flow: ReturnType<typeof useSubmitFlow>;
  /** DOM id prefix: "contact" / "reg". */
  idPrefix: string;
  /** Popup id prefix: "cs" / "rs". */
  popupPrefix: string;
  loadingText: string;
  title: string;
  defaultMessage: string;
};

/** Full-screen "sending…" loader and the auto-dismissing success dialog. */
export function SubmitOverlays({ flow, idPrefix, popupPrefix, loadingText, title, defaultMessage }: Props) {
  return (
    <>
      <div id={`${idPrefix}-loader`} className={`${styles.overlay} ${styles.loader}`} hidden={!flow.loading}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>{loadingText}</p>
      </div>
      <div
        id={`${idPrefix}-success`}
        className={`${styles.overlay} ${styles.success}`}
        hidden={!flow.success}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${popupPrefix}-title`}
      >
        <div key={flow.success?.shownAt} className={styles.card}>
          <div className={styles.check}>
            <svg width="42" height="42" viewBox="0 0 52 52" fill="none" aria-hidden="true">
              <path d="M14 27l8 8 16-16" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="42" strokeDashoffset="42" className={styles.checkPath}></path>
            </svg>
          </div>
          <h3 id={`${popupPrefix}-title`} className={styles.title}>{title}</h3>
          <p id={`${popupPrefix}-msg`} className={styles.message}>{flow.success?.message ?? defaultMessage}</p>
          <div className={styles.progress}>
            <div id={`${popupPrefix}-bar`} className={styles.bar}></div>
          </div>
          <button type="button" onClick={flow.closeSuccess} className={styles.done}>
            Done
          </button>
        </div>
      </div>
    </>
  );
}

function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * POST the form to its API endpoint, which answers `{ success, message }` as JSON.
 * A submission id is kept on the form until the server confirms success, so retrying after a
 * network error cannot store the same submission twice (the server ignores a repeated id).
 */
export async function postForm(form: HTMLFormElement): Promise<{ success: boolean; message: string }> {
  form.dataset.submissionId ||= newSubmissionId();
  const body = new FormData(form);
  body.set("submission_id", form.dataset.submissionId);
  const r = await fetch(form.action, { method: "POST", body });
  const data = (await r.json()) as { success: boolean; message: string };
  if (data.success) delete form.dataset.submissionId;
  return data;
}

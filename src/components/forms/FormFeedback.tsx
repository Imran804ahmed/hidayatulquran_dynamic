"use client";

import { useEffect, useRef } from "react";

/*
 * Inline validation feedback for the public website forms (registration, contact).
 * Errors are shown beside the affected field and in a summary above the submit button,
 * instead of blocking alert() dialogs. Entered values are never cleared on an error.
 */

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isEmail = (v: string) => EMAIL_RE.test(v.trim());
export const digitCount = (v: string) => v.replace(/\D/g, "").length;

/** Visible "*" plus a screen-reader "(required)". */
export function Req() {
  return (
    <>
      <span className="form-req" aria-hidden="true">*</span>
      <span className="visually-hidden"> (required)</span>
    </>
  );
}

export const errorId = (field: string) => `${field}-error`;

/** ARIA wiring for a field: aria-invalid and aria-describedby (error first, then any hint). */
export function fieldAria(errors: FieldErrors, field: string, hintId?: string) {
  const ids = [errors[field] ? errorId(field) : null, hintId].filter(Boolean).join(" ");
  return {
    "aria-invalid": errors[field] ? (true as const) : undefined,
    "aria-describedby": ids || undefined,
  };
}

export function FieldError({ errors, field }: { errors: FieldErrors; field: string }) {
  if (!errors[field]) return null;
  return (
    <span id={errorId(field)} className="form-field-error">
      <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
      <span>{errors[field]}</span>
    </span>
  );
}

/**
 * Error summary shown above the submit button. It is focused when it appears for a server or
 * network problem, so keyboard and screen-reader users hear what went wrong.
 */
export function FormSummary({ message, focusKey, children }: { message: string | null; focusKey: number; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (message && focusKey > 0) ref.current?.focus();
  }, [message, focusKey]);
  if (!message) return null;
  return (
    <div ref={ref} className="form-summary" role="alert" tabIndex={-1}>
      <i className="bi bi-exclamation-octagon-fill" aria-hidden="true"></i>
      <div>
        <p>{message}</p>
        {children}
      </div>
    </div>
  );
}

/** Move focus to the first field marked invalid (after React has rendered the errors). */
export function focusFirstInvalid(form: HTMLFormElement | null) {
  requestAnimationFrame(() => form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
}

/**
 * The form endpoints answer with a single message. Attach the known ones to the field they are
 * about, so the visitor sees the problem where it needs fixing.
 */
export function fieldForServerMessage(message: string): string | null {
  if (/email/i.test(message) && !/too many/i.test(message)) return "email";
  if (/\bage\b/i.test(message)) return "age";
  if (/whatsapp/i.test(message)) return "whatsappnumber";
  if (/\bdays?\b/i.test(message)) return "days";
  return null;
}

export const NETWORK_ERROR =
  "We could not send the form because the connection failed. Your answers are still here — please check your internet connection and try again.";

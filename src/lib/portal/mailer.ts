import "server-only";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * Outgoing email via SMTP (Hostinger: smtp.hostinger.com, port 587 STARTTLS or 465 TLS).
 * Configuration comes only from environment variables. In development, MAIL_MODE=log prints
 * emails to the server console instead of sending them.
 *
 * Returns { ok: true } when the SMTP server ACCEPTED the message. Acceptance is not proof of
 * delivery to the recipient's inbox; the portal labels this state "Sent", never "Delivered".
 */

let transporter: Transporter | null = null;

export function mailConfigured(): boolean {
  return process.env.MAIL_MODE === "log" || Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function getTransport(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
}

export type MailResult = { ok: true } | { ok: false; error: string };

export async function sendMail(to: string, toName: string, subject: string, html: string): Promise<MailResult> {
  if (process.env.MAIL_MODE === "log") {
    console.info(`[mail:log] to=${to} subject=${JSON.stringify(subject)} bytes=${html.length}`);
    return { ok: true };
  }
  if (!mailConfigured()) return { ok: false, error: "Email is not configured (SMTP_HOST, SMTP_USER, SMTP_PASSWORD)." };
  try {
    await getTransport().sendMail({
      from: { name: process.env.MAIL_FROM_NAME ?? "Hidayatul Quran", address: process.env.MAIL_FROM ?? process.env.SMTP_USER! },
      to: toName ? { name: toName, address: to } : to,
      subject,
      html,
    });
    return { ok: true };
  } catch (err) {
    const code = (err as { code?: string; responseCode?: number }).code ?? "";
    const responseCode = (err as { responseCode?: number }).responseCode;
    // Never include credentials; nodemailer errors do not contain the password.
    return { ok: false, error: `Mail server error${code ? ` ${code}` : ""}${responseCode ? ` (${responseCode})` : ""}` };
  }
}

export function escapeHtml(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Same layout as the original PHP confirmation emails. */
export function emailShell(intro: string, rows: Record<string, string>, outro: string, phone: string): string {
  const table = Object.entries(rows)
    .map(([k, v]) => `<tr><td style='padding:8px; border:1px solid #ddd; background:#f9f9f9;'><strong>${escapeHtml(k)}</strong></td><td style='padding:8px; border:1px solid #ddd;'>${escapeHtml(v)}</td></tr>`)
    .join("");
  return `<html><body style='font-family:Arial,sans-serif; color:#333;'>${intro}
    <table style='border-collapse:collapse; width:100%; max-width:500px;'>${table}</table>
    <p>${outro}</p>
    <p>Best regards,<br><strong>Hidayatul Quran</strong><br>Phone/WhatsApp: ${escapeHtml(phone)}</p>
    <p><a href='https://www.youtube.com/channel/UCDiUcDx4tqPCqvENApO9Gvg'>YouTube</a> &nbsp;|&nbsp;
    <a href='https://www.facebook.com/profile.php?id=61586928376019'>Facebook</a> &nbsp;|&nbsp;
    <a href='https://www.instagram.com/hidayatulquranofficiall/'>Instagram</a></p></body></html>`;
}

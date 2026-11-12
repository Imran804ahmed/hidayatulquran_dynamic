import "server-only";
import * as db from "./db";
import { statusHistory } from "./audit";
import { assignRef } from "./refs";
import { getSettings } from "./settings";
import { emailShell, escapeHtml, sendMail } from "./mailer";
import { isRateLimited, recordRate } from "./request";
import { DAYS, PLANS, countryName, daysLabel, digitsOnly, packageName } from "./lookups";

/*
 * Backend for the public website forms, replacing forms/contact.php and forms/registration.php.
 * The request/response contract is unchanged: same field names, JSON { success, message }, and
 * the same user-facing messages. Differences:
 *  - credentials come from environment variables, not source code;
 *  - success is returned only after the database write commits;
 *  - emails are sent after storage; their outcome is recorded and never turns a stored
 *    submission into an error;
 *  - an optional `submission_id` makes network retries idempotent;
 *  - basic per-email / per-IP rate limiting.
 */

export type FormReply = { success: boolean; message: string; status?: number };

const s = (fd: FormData, k: string, max: number) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
};
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 190;
const submissionKey = (fd: FormData) => {
  const k = s(fd, "submission_id", 64);
  return /^[A-Za-z0-9-]{16,64}$/.test(k) ? k : null;
};

async function legacyTableHasEmail(email: string): Promise<boolean> {
  const exists = await db.count("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'registration'");
  if (!exists) return false;
  return (await db.count("SELECT COUNT(*) FROM `registration` WHERE email = ?", [email])) > 0;
}

async function deliver(table: "hq_registrations" | "hq_enquiries", id: number, send: () => Promise<{ ok: boolean }>): Promise<void> {
  await db.exec(`UPDATE ${table} SET confirmation_email = 'pending' WHERE id = ?`, [id]);
  const res = await send();
  await db.exec(`UPDATE ${table} SET confirmation_email = ? WHERE id = ?`, [res.ok ? "sent" : "failed", id]);
}

async function notifyStaff(subject: string, html: string, list: string): Promise<void> {
  for (const addr of list.split(",").map((a) => a.trim()).filter(isEmail)) {
    const r = await sendMail(addr, "", subject, html);
    if (!r.ok) console.error(`[public form] staff notification failed: ${r.error}`);
  }
}

function portalLink(path: string): string {
  return `${(process.env.PUBLIC_SITE_URL ?? "https://www.hidayatulquran.com").replace(/\/$/, "")}/adminportal/${path}`;
}

export async function submitRegistration(fd: FormData): Promise<FormReply> {
  const fullName = s(fd, "fullName", 150);
  const ageRaw = s(fd, "age", 5);
  const country = s(fd, "country", 80);
  const guardian = s(fd, "guardianName", 150);
  const whatsapp = s(fd, "whatsappnumber", 40);
  const email = s(fd, "email", 190).toLowerCase();
  const pkg = s(fd, "course", 40);
  const plan = s(fd, "classes", 20);
  const time = s(fd, "selectedtime", 60);
  const message = s(fd, "message", 5000);
  const days = fd.getAll("selecteddays[]").concat(fd.getAll("selecteddays")).filter((d): d is string => typeof d === "string" && d in DAYS);

  if (!fullName || !ageRaw || !country || !whatsapp || !email || !pkg || !plan || !time) {
    return { success: false, message: "Please fill in all required fields." };
  }
  if (!isEmail(email)) return { success: false, message: "Invalid email address." };
  if (!/^\d{1,3}$/.test(ageRaw) || Number(ageRaw) < 1 || Number(ageRaw) > 120) return { success: false, message: "Please enter a valid age." };
  if (digitsOnly(whatsapp).length < 7) return { success: false, message: "Please enter a valid WhatsApp number, including the country code." };
  const maxDays = parseInt(plan, 10);
  if (maxDays > 0 && days.length > maxDays) return { success: false, message: `You can only select ${maxDays} days.` };

  const key = submissionKey(fd);
  if (key && (await db.value("SELECT id FROM hq_registrations WHERE submission_key = ?", [key]))) {
    return { success: true, message: "Your registration has been submitted. Thank you!" }; // retry of a stored submission
  }
  if (await isRateLimited("form", email, { perSubject: 5, perIp: 15, windowSec: 600 })) {
    return { success: false, message: "Too many submissions. Please wait a few minutes and try again.", status: 429 };
  }
  const settings = await getSettings();
  if (settings.reject_duplicate_registration_email === "1") {
    const dup = (await db.count("SELECT COUNT(*) FROM hq_registrations WHERE email = ? AND status <> 'rejected'", [email])) > 0 || (await legacyTableHasEmail(email));
    if (dup) return { success: false, message: "This email is already registered. Please use a different email." };
  }

  let id: number;
  try {
    id = await db.transaction(async (conn) => {
      const now = db.nowUtc();
      const newId = await db.insert("hq_registrations", {
        submission_key: key, source_form: "registration.html", full_name: fullName, age: Number(ageRaw), country,
        guardian_name: guardian || null, whatsapp, whatsapp_digits: digitsOnly(whatsapp), email, package: pkg, classes_plan: plan,
        preferred_days: days.join(",") || null, preferred_time: time, message: message || null, status: "new",
        confirmation_email: "skipped", submitted_at: now, updated_at: now,
      }, conn);
      await assignRef("hq_registrations", newId, conn);
      await statusHistory("registration", newId, null, "new", "Submitted on the website", null, conn);
      return newId;
    });
  } catch (err) {
    if (db.isDuplicateKey(err) && key) return { success: true, message: "Your registration has been submitted. Thank you!" };
    console.error("[public form] registration storage failed:", err);
    return { success: false, message: "Failed to save registration. Please try again.", status: 500 };
  }
  await recordRate("form", email, false);

  // Stored. Email problems are recorded but do not change the visitor's result.
  try {
    const rows = { Course: packageName(pkg), Classes: PLANS[plan] ?? plan, "Selected Days": daysLabel(days.join(",")), "Preferred Time": time };
    if (settings.send_confirmations === "1") {
      await deliver("hq_registrations", id, () => sendMail(email, fullName, "Thank you for registering with Hidayatul Quran", emailShell(
        `<p>Dear ${escapeHtml(fullName)},</p><p>Thank you for registering with us. We have successfully received your registration details:</p>`,
        rows, "If you have any questions, feel free to reach out to us.", settings.academy_phone)));
    }
    if (settings.notify_emails) {
      await notifyStaff(`New registration: ${fullName}`, emailShell("<p>A new registration was submitted on the website.</p>",
        { Name: fullName, Country: countryName(country), ...rows }, `Review it in the admin portal: ${escapeHtml(portalLink(`registrations/${id}`))}`, settings.academy_phone), settings.notify_emails);
    }
  } catch (err) {
    console.error("[public form] registration notification error:", err);
  }
  return { success: true, message: "Your registration has been submitted. Thank you!" };
}

export async function submitContact(fd: FormData): Promise<FormReply> {
  const fullName = s(fd, "fullName", 150);
  const email = s(fd, "email", 190).toLowerCase();
  const subject = s(fd, "subject", 255);
  const message = s(fd, "message", 5000);
  if (!fullName || !email || !subject || !message) return { success: false, message: "All fields are required." };
  if (!isEmail(email)) return { success: false, message: "Invalid email address." };

  const key = submissionKey(fd);
  if (key && (await db.value("SELECT id FROM hq_enquiries WHERE submission_key = ?", [key]))) {
    return { success: true, message: "Your message has been sent. Thank you!" };
  }
  if (await isRateLimited("form", email, { perSubject: 5, perIp: 15, windowSec: 600 })) {
    return { success: false, message: "Too many messages. Please wait a few minutes and try again.", status: 429 };
  }
  let id: number;
  try {
    id = await db.transaction(async (conn) => {
      const now = db.nowUtc();
      const newId = await db.insert("hq_enquiries", {
        submission_key: key, source_form: "Contact form (home page)", full_name: fullName, email, subject, message,
        status: "new", confirmation_email: "skipped", submitted_at: now, updated_at: now,
      }, conn);
      await assignRef("hq_enquiries", newId, conn);
      await statusHistory("enquiry", newId, null, "new", "Submitted on the website", null, conn);
      return newId;
    });
  } catch (err) {
    if (db.isDuplicateKey(err) && key) return { success: true, message: "Your message has been sent. Thank you!" };
    console.error("[public form] enquiry storage failed:", err);
    return { success: false, message: "Failed to send message", status: 500 };
  }
  await recordRate("form", email, false);

  try {
    const settings = await getSettings();
    const rows = { Subject: subject, Message: message };
    if (settings.send_confirmations === "1") {
      await deliver("hq_enquiries", id, () => sendMail(email, fullName, "Thank you for contacting Hidayatul Quran", emailShell(
        `<p>Dear ${escapeHtml(fullName)},</p><p>Thank you for reaching out. We have received your message:</p>`,
        rows, "Our team will get back to you shortly.", settings.academy_phone)));
    }
    if (settings.notify_emails) {
      await notifyStaff(`New enquiry: ${subject}`, emailShell("<p>A new enquiry was sent from the website contact form.</p>",
        { Name: fullName, Email: email, ...rows }, `Open it in the admin portal: ${escapeHtml(portalLink(`enquiries/${id}`))}`, settings.academy_phone), settings.notify_emails);
    }
  } catch (err) {
    console.error("[public form] enquiry notification error:", err);
  }
  return { success: true, message: "Your message has been sent. Thank you!" };
}


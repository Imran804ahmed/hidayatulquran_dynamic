/** Fixed vocabularies, taken from the public website forms where they exist. Safe on client and server. */

/** Country codes used by registration.html. */
export const COUNTRIES: Record<string, string> = {
  uk: "United Kingdom",
  usa: "United States",
  canada: "Canada",
  uae: "United Arab Emirates",
  ksa: "Kingdom of Saudi Arabia",
  ger: "Germany",
  other: "Other",
};

/** Packages from the home-page pricing table / registration.html `course` select. */
export const PACKAGES: Record<string, string> = {
  BronzePackage: "Bronze (3 days/week)",
  SilverPackage: "Silver (4 days/week)",
  GoldPackage: "Gold (5 days/week)",
};

export const PLANS: Record<string, string> = { "3days": "3 days plan", "4days": "4 days plan", "5days": "5 days plan" };

export const DAYS: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
export const WEEKDAYS: Record<number, string> = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday" };

export const RECORD_STATUS = { active: "Active", inactive: "Inactive", archived: "Archived" } as const;
export type RecordStatus = keyof typeof RECORD_STATUS;

export const REG_STATUS = {
  new: "New",
  under_review: "Under review",
  contacted: "Contacted",
  approved: "Approved",
  enrolled: "Enrolled",
  rejected: "Rejected",
} as const;
export type RegStatus = keyof typeof REG_STATUS;
export const REG_OPEN: RegStatus[] = ["new", "under_review", "contacted", "approved"];

export const ENQ_STATUS = { new: "New", in_progress: "In progress", resolved: "Resolved", archived: "Archived" } as const;
export type EnqStatus = keyof typeof ENQ_STATUS;
export const ENQ_OPEN: EnqStatus[] = ["new", "in_progress"];

export const ENROL_STATUS = {
  pending: "Pending start",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  withdrawn: "Withdrawn",
} as const;
export type EnrolStatus = keyof typeof ENROL_STATUS;
/** Enrolments that still occupy a teacher / count as current participation. */
export const ENROL_LIVE: EnrolStatus[] = ["pending", "active", "paused"];

export type Tone = "success" | "success-strong" | "warning" | "danger" | "info" | "brand" | "neutral" | "muted";

export const TONES: Record<string, Tone> = {
  active: "success", inactive: "neutral", archived: "muted",
  new: "info", under_review: "warning", contacted: "brand", approved: "success", enrolled: "success-strong", rejected: "danger",
  in_progress: "warning", resolved: "success",
  pending: "info", paused: "warning", completed: "muted", withdrawn: "neutral",
  scheduled: "success", cancelled: "neutral",
  sent: "success", failed: "danger", skipped: "muted",
  disabled: "neutral", super_admin: "brand", admin: "info",
};

const ALL_LABELS: Record<string, string> = {
  ...RECORD_STATUS, ...ENROL_STATUS, ...ENQ_STATUS, ...REG_STATUS,
  scheduled: "Scheduled", cancelled: "Cancelled", sent: "Sent", failed: "Failed", skipped: "Not sent", disabled: "Disabled",
  super_admin: "Super Admin", admin: "Admin / Coordinator",
};

export function statusLabel(status: string): string {
  return ALL_LABELS[status] ?? status.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

export function countryName(code: string | null | undefined): string {
  return code ? COUNTRIES[code] ?? code : "";
}

export function packageName(code: string | null | undefined): string {
  return code ? PACKAGES[code] ?? code : "";
}

export function daysLabel(csv: string | null | undefined): string {
  if (!csv) return "";
  return csv.split(",").map((d) => DAYS[d.trim()] ?? d.trim()).filter(Boolean).join(", ");
}

/** Timezone suggestion for single-zone countries offered on the website. */
export function suggestedTimezone(country: string | null | undefined): string | null {
  return ({ uk: "Europe/London", uae: "Asia/Dubai", ksa: "Asia/Riyadh", ger: "Europe/Berlin" } as Record<string, string>)[country ?? ""] ?? null;
}

export function digitsOnly(v: string | null | undefined): string {
  return (v ?? "").replace(/\D+/g, "");
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

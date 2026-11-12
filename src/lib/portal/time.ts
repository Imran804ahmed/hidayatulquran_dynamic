import "server-only";

/**
 * Timezone-aware formatting. Storage is UTC; display uses the academy timezone from settings
 * (passed in explicitly so these helpers stay pure). Uses Intl, which applies DST rules.
 */

export function isValidTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function allTimezones(): string[] {
  return typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : ["UTC"];
}

function asDate(utc: string | Date): Date {
  return utc instanceof Date ? utc : new Date(utc.replace(" ", "T") + "Z");
}

export function fmtDateTime(utc: string | null | undefined, tz: string): string {
  if (!utc) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(asDate(utc));
}

export function fmtDay(utc: string | null | undefined, tz: string): string {
  if (!utc) return "";
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, day: "numeric", month: "short", year: "numeric" }).format(asDate(utc));
}

/** Formats a plain calendar date (YYYY-MM-DD), no timezone shift. */
export function fmtDate(ymd: string | null | undefined): string {
  if (!ymd) return "";
  const [y, m, d] = ymd.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }).format(Date.UTC(y, m - 1, d));
}

/** Calendar parts of an instant in a timezone. */
export function zonedParts(date: Date, tz: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", hourCycle: "h23",
    }).formatToParts(date).map((p) => [p.type, p.value]),
  );
  const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(parts.weekday) + 1;
  return {
    year: Number(parts.year), month: Number(parts.month), day: Number(parts.day),
    hour: Number(parts.hour), minute: Number(parts.minute), second: Number(parts.second), weekday,
  };
}

/** YYYY-MM-DD of an instant (default now) in a timezone. */
export function localYmd(tz: string, date: Date = new Date()): string {
  const p = zonedParts(date, tz);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/** Offset (minutes) of tz from UTC at a given instant. */
function offsetMinutes(date: Date, tz: string): number {
  const p = zonedParts(date, tz);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - date.getTime()) / 60000);
}

/** The UTC instant for a wall-clock time in tz (DST-aware; gaps resolve forward). */
export function zonedToUtc(ymd: string, hhmm: string, tz: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let ts = guess - offsetMinutes(new Date(guess), tz) * 60000;
  ts = guess - offsetMinutes(new Date(ts), tz) * 60000; // second pass settles DST boundaries
  return new Date(ts);
}

export function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** UTC DATETIME string of local midnight starting `ymd` in tz. */
export function localDayStartUtc(ymd: string, tz: string): string {
  return zonedToUtc(ymd, "00:00", tz).toISOString().slice(0, 19).replace("T", " ");
}

export function isYmd(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y, m, d] = v.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function relativeTime(utc: string | null | undefined, tz: string): string {
  if (!utc) return "";
  const diff = (Date.now() - asDate(utc).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d ago`;
  return fmtDay(utc, tz);
}

/** Wall-clock HH:MM of a UTC instant in tz. */
export function fmtTime(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

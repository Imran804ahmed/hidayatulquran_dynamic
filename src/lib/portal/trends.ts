import "server-only";
import * as db from "./db";
import { addDays, isYmd, localDayStartUtc, localYmd } from "./time";
import type { Bucket } from "@/components/portal/charts";

export type Range = { from: string; to: string; preset: string };

/** Resolves ?range=7|30|90 or ?from=&to= (local dates in the academy timezone), max 366 days. */
export function resolveRange(sp: Record<string, string | undefined>, tz: string): Range {
  const today = localYmd(tz);
  if (sp.from && sp.to && isYmd(sp.from) && isYmd(sp.to) && sp.from <= sp.to && sp.to <= addDays(today, 1)) {
    const span = (Date.parse(sp.to) - Date.parse(sp.from)) / 86400000;
    if (span <= 366) return { from: sp.from, to: sp.to, preset: "custom" };
  }
  const days = ["7", "30", "90"].includes(sp.range ?? "") ? Number(sp.range) : 30;
  return { from: addDays(today, -(days - 1)), to: today, preset: String(days) };
}

function mondayOf(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const wd = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
  return addDays(ymd, -wd);
}

const fmt = (ymd: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short" }).format(new Date(ymd + "T00:00:00Z"));

/** Daily buckets (weekly above 62 days) of registrations and enquiries, by local submission date. */
export async function trend(range: Range, tz: string): Promise<{ buckets: Bucket[]; unit: "day" | "week"; unknownTimes: number }> {
  const days = (Date.parse(range.to) - Date.parse(range.from)) / 86400000 + 1;
  const unit = days > 62 ? "week" : "day";
  const buckets = new Map<string, Bucket>();
  for (let d = unit === "week" ? mondayOf(range.from) : range.from; d <= range.to; d = addDays(d, unit === "week" ? 7 : 1)) {
    buckets.set(d, { key: d, label: unit === "week" ? `w/c ${fmt(d)}` : fmt(d), reg: 0, enq: 0 });
  }
  const start = localDayStartUtc(range.from, tz);
  const end = localDayStartUtc(addDays(range.to, 1), tz);
  let unknownTimes = 0;
  for (const [k, table] of [["reg", "hq_registrations"], ["enq", "hq_enquiries"]] as const) {
    const rows = await db.all<{ submitted_at: string }>(`SELECT submitted_at FROM ${table} WHERE submitted_at >= ? AND submitted_at < ? AND submitted_at_known = 1`, [start, end]);
    for (const r of rows) {
      const local = localYmd(tz, new Date(r.submitted_at.replace(" ", "T") + "Z"));
      const b = buckets.get(unit === "week" ? mondayOf(local) : local);
      if (b) b[k]++;
    }
    unknownTimes += await db.count(`SELECT COUNT(*) FROM ${table} WHERE submitted_at_known = 0`);
  }
  return { buckets: [...buckets.values()], unit, unknownTimes };
}

import "server-only";
import * as db from "./db";
import { addDays, localYmd, zonedParts, zonedToUtc } from "./time";

export type SlotRow = {
  id: number; enrolment_id: number; weekday: number; start_time: string; duration_min: number; timezone: string;
  status: string; meeting_url: string | null;
  student_id: number; student_name: string; teacher_id: number | null; teacher_name: string | null; course_name: string;
};

const SLOT_SELECT = `SELECT cs.id, cs.enrolment_id, cs.weekday, cs.start_time, cs.duration_min, cs.timezone, cs.status, cs.meeting_url,
  e.student_id, s.full_name AS student_name, e.teacher_id, t.full_name AS teacher_name, c.name AS course_name
  FROM hq_class_slots cs
  JOIN hq_enrolments e ON e.id = cs.enrolment_id
  JOIN hq_students s ON s.id = e.student_id
  JOIN hq_courses c ON c.id = e.course_id
  LEFT JOIN hq_teachers t ON t.id = e.teacher_id`;

/** Scheduled slots of current enrolments (pending/active; paused enrolments have no classes). */
export function liveSlots(where = "", params: db.Param[] = []) {
  return db.all<SlotRow>(
    `${SLOT_SELECT} WHERE cs.status = 'scheduled' AND e.status IN ('pending','active') AND s.status = 'active' ${where}
     ORDER BY cs.weekday, cs.start_time`,
    params,
  );
}

export function slotsForEnrolment(enrolmentId: number) {
  return db.all<SlotRow>(`${SLOT_SELECT} WHERE cs.enrolment_id = ? ORDER BY cs.status DESC, cs.weekday, cs.start_time`, [enrolmentId]);
}

/** Occurrence start instants of a weekly slot between now and `days` ahead, in the slot's own timezone. */
export function occurrences(slot: { weekday: number; start_time: string; timezone: string }, days: number, from = new Date()): Date[] {
  const out: Date[] = [];
  const startYmd = localYmd(slot.timezone, from);
  for (let i = 0; i <= days; i++) {
    const ymd = addDays(startYmd, i);
    const [y, m, d] = ymd.split("-").map(Number);
    const wd = ((new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7) + 1; // 1=Mon..7=Sun
    if (wd !== slot.weekday) continue;
    const at = zonedToUtc(ymd, slot.start_time.slice(0, 5), slot.timezone);
    if (at.getTime() >= from.getTime() - 3600_000) out.push(at);
  }
  return out;
}

export type Upcoming = SlotRow & { at: Date };

export async function upcomingClasses(hours: number, limit = 10): Promise<Upcoming[]> {
  const slots = await liveSlots();
  const now = new Date();
  const until = now.getTime() + hours * 3600_000;
  const list: Upcoming[] = [];
  for (const s of slots) {
    for (const at of occurrences(s, Math.ceil(hours / 24) + 1, now)) {
      if (at.getTime() >= now.getTime() - s.duration_min * 60_000 && at.getTime() <= until) list.push({ ...s, at });
    }
  }
  return list.sort((a, b) => a.at.getTime() - b.at.getTime()).slice(0, limit);
}

/**
 * Teacher double-booking check. Both the candidate and existing slots are expanded to real
 * instants for the next 8 weeks and for a week ~6 months out (so slots in different timezones
 * are also compared across a daylight-saving change), then checked for overlap.
 */
export async function teacherConflicts(
  teacherId: number,
  candidate: { weekday: number; start_time: string; duration_min: number; timezone: string },
  excludeSlotId: number | null,
): Promise<SlotRow[]> {
  const others = (await liveSlots("AND e.teacher_id = ?", [teacherId])).filter((s) => s.id !== excludeSlotId);
  if (!others.length) return [];
  const windows = [new Date(), new Date(Date.now() + 182 * 86400_000)];
  const spans = (s: { weekday: number; start_time: string; duration_min: number; timezone: string }) =>
    windows.flatMap((w) => occurrences(s, w === windows[0] ? 56 : 7, w)).map((at) => [at.getTime(), at.getTime() + s.duration_min * 60_000] as const);
  const mine = spans(candidate);
  return others.filter((o) => spans(o).some(([a1, a2]) => mine.some(([b1, b2]) => a1 < b2 && b1 < a2)));
}

/** Wall-clock label of an instant in another timezone, e.g. for showing the student's local time. */
export function wallClock(at: Date, tz: string): { day: number; time: string } {
  const p = zonedParts(at, tz);
  return { day: p.weekday, time: `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}` };
}

import type { Metadata } from "next";
import Link from "next/link";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import { academyTimezone } from "@/lib/portal/settings";
import { liveSlots, occurrences } from "@/lib/portal/schedule";
import { activeCourses, teacherOptions } from "@/lib/portal/students";
import { addDays, fmtTime, localYmd, zonedToUtc } from "@/lib/portal/time";
import { WEEKDAYS } from "@/lib/portal/lookups";
import { Icon, PageHeader, hrefWith, type Params } from "@/components/portal/ui";
import { AutoSubmit } from "@/components/portal/shell";

export const metadata: Metadata = { title: "Timetable" };
const BASE = `${PORTAL}/timetable`;

export default async function TimetablePage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requirePage("courses.view", BASE);
  const sp = await searchParams;
  const tz = await academyTimezone();
  const weekOffset = Math.max(-52, Math.min(52, Number.parseInt(sp.week ?? "0", 10) || 0));
  const today = localYmd(tz);
  const [y, m, d] = today.split("-").map(Number);
  const todayWd = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
  const monday = addDays(addDays(today, -todayWd), weekOffset * 7);
  const weekStart = zonedToUtc(monday, "00:00", tz);
  const weekEnd = zonedToUtc(addDays(monday, 7), "00:00", tz);

  const where: string[] = [];
  const params: (number | string)[] = [];
  if (sp.teacher && /^\d+$/.test(sp.teacher)) { where.push("AND e.teacher_id = ?"); params.push(Number(sp.teacher)); }
  if (sp.course && /^\d+$/.test(sp.course)) { where.push("AND e.course_id = ?"); params.push(Number(sp.course)); }
  const slots = await liveSlots(where.join(" "), params);
  const days: { ymd: string; items: { key: string; at: Date; slot: (typeof slots)[number] }[] }[] = Array.from({ length: 7 }, (_, i) => ({ ymd: addDays(monday, i), items: [] }));
  for (const s of slots) {
    for (const at of occurrences(s, 9, new Date(weekStart.getTime() - 86400000))) {
      if (at < weekStart || at >= weekEnd) continue;
      const idx = days.findIndex((dd) => dd.ymd === localYmd(tz, at));
      if (idx >= 0) days[idx].items.push({ key: `${s.id}-${at.getTime()}`, at, slot: s });
    }
  }
  days.forEach((dd) => dd.items.sort((a, b) => a.at.getTime() - b.at.getTime()));
  const [courses, teachers] = await Promise.all([activeCourses(), teacherOptions(true)]);
  const filters: Params = { teacher: sp.teacher, course: sp.course };
  const fmtRange = (ymd: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short" }).format(new Date(ymd + "T00:00:00Z"));
  const total = days.reduce((n, dd) => n + dd.items.length, 0);

  return (
    <>
      <PageHeader eyebrow="Academics" title="Timetable" subtitle={`Weekly classes of active students with current enrolments, shown in the academy timezone (${tz}).`}
        actions={can(user, "enrolments.manage") ? <Link className="btn btn-primary" href={`${PORTAL}/enrolments`}><Icon name="journal-check" /> Manage enrolments</Link> : undefined} />
      <div className="card">
        <form className="filters" method="get" action={BASE} aria-label="Filter timetable">
          <input type="hidden" name="week" value={weekOffset || ""} />
          <AutoSubmit>
            <div className="field"><label htmlFor="teacher">Teacher</label><select className="input" id="teacher" name="teacher" defaultValue={sp.teacher ?? ""}><option value="">All teachers</option>{teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}</select></div>
            <div className="field"><label htmlFor="course">Course</label><select className="input" id="course" name="course" defaultValue={sp.course ?? ""}><option value="">All courses</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          </AutoSubmit>
          <div className="filter-actions"><button className="btn btn-secondary" type="submit"><Icon name="funnel" /> Apply</button></div>
          <div className="spacer" />
          <div className="row-gap" role="group" aria-label="Week">
            <Link className="btn btn-secondary btn-sm" href={hrefWith(BASE, { ...filters, week: String(weekOffset - 1) })}><Icon name="chevron-left" /><span className="sr-only">Previous week</span></Link>
            <strong className="nowrap">{fmtRange(monday)} – {fmtRange(addDays(monday, 6))}</strong>
            <Link className="btn btn-secondary btn-sm" href={hrefWith(BASE, { ...filters, week: String(weekOffset + 1) })}><Icon name="chevron-right" /><span className="sr-only">Next week</span></Link>
            {weekOffset !== 0 && <Link className="btn btn-ghost btn-sm" href={hrefWith(BASE, filters)}>This week</Link>}
          </div>
        </form>
        <div className="card-body">
          {total === 0 && <p className="muted">No classes this week{filters.teacher || filters.course ? " for these filters" : ""}. Add weekly class times on an enrolment.</p>}
          <div className="tt">
            {days.map((dd, i) => (
              <div key={dd.ymd} className={`tt-day${dd.ymd === today ? " is-today" : ""}`}>
                <h3>{WEEKDAYS[i + 1]} <span className="muted">{fmtRange(dd.ymd)}</span></h3>
                {dd.items.length === 0 ? <div className="tt-empty">No classes</div> : dd.items.map(({ key, at, slot }) => (
                  <Link key={key} className="tt-slot" href={`${PORTAL}/enrolments/${slot.enrolment_id}`}>
                    <span className="tt-time">{fmtTime(at, tz)}</span> <span className="muted">· {slot.duration_min} min</span>
                    <strong>{slot.student_name}</strong>
                    <span className="muted">{slot.course_name}</span><br />
                    <span className="small">{slot.teacher_name ?? "No teacher"}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { getEntityAudit } from "@/lib/portal/audit";
import { academyTimezone } from "@/lib/portal/settings";
import { slotsForEnrolment, occurrences, wallClock } from "@/lib/portal/schedule";
import { activeCourses, teacherOptions } from "@/lib/portal/students";
import { allTimezones, fmtDateTime } from "@/lib/portal/time";
import { WEEKDAYS } from "@/lib/portal/lookups";
import { Badge, DefinitionList, Icon, PageHeader } from "@/components/portal/ui";
import { CancelSlotButton, EnrolmentForm, SlotForm } from "@/components/portal/academic-forms";
import { HistoryCard } from "@/components/portal/record-parts";

export const metadata: Metadata = { title: "Enrolment" };

export default async function EnrolmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requirePage("courses.view", `${PORTAL}/enrolments/${id}`);
  const e = /^\d+$/.test(id) ? await db.one<{ id: number; version: number; student_id: number; course_id: number; teacher_id: number | null; package: string | null; classes_per_week: number | null; status: string; start_date: string | null; end_date: string | null; notes: string | null; student_name: string; student_ref: string; student_status: string; student_tz: string | null; course_name: string; teacher_name: string | null; teacher_tz: string | null; created_at: string }>(
    `SELECT e.*, s.full_name AS student_name, s.ref_no AS student_ref, s.status AS student_status, s.timezone AS student_tz, c.name AS course_name, t.full_name AS teacher_name, t.timezone AS teacher_tz
       FROM hq_enrolments e JOIN hq_students s ON s.id = e.student_id JOIN hq_courses c ON c.id = e.course_id LEFT JOIN hq_teachers t ON t.id = e.teacher_id WHERE e.id = ?`, [Number(id)]) : null;
  if (!e) notFound();
  const tz = await academyTimezone();
  const manage = can(user, "enrolments.manage");
  const [slots, auditRows, courses, teachers] = await Promise.all([
    slotsForEnrolment(e.id), getEntityAudit("enrolment", e.id, 40), activeCourses(), teacherOptions(true),
  ]);
  const scheduled = slots.filter((s) => s.status === "scheduled");
  const zoneLabel = (s: (typeof slots)[number], other: string | null, who: string) => {
    if (!other || other === s.timezone) return null;
    const next = occurrences(s, 7)[0];
    if (!next) return null;
    const w = wallClock(next, other);
    return `${who}: ${WEEKDAYS[w.day]} ${w.time} (${other})`;
  };
  return (
    <>
      <PageHeader crumbs={[{ href: `${PORTAL}/students/${e.student_id}`, label: e.student_name }]} eyebrow="Enrolment"
        title={<>{e.course_name} <Badge status={e.status} /></>}
        subtitle={<>{e.student_name} <span className="mono">{e.student_ref}</span> · Teacher: {e.teacher_name ?? "not assigned"} · Created {fmtDateTime(e.created_at, tz)}</>} />
      {e.student_status !== "active" && <div className="alert alert-warning"><Icon name="exclamation-triangle-fill" /><p>The student record is {e.student_status}. Their classes are hidden from the timetable until the student is active again.</p></div>}
      <div className="grid grid-main-side">
        <div className="stack">
          {manage ? (
            <EnrolmentForm e={e} students={[]} courses={courses} teachers={teachers} studentLocked={`${e.student_name} (${e.student_ref})`} />
          ) : (
            <section className="card"><div className="card-body tight"><DefinitionList items={[["Course", e.course_name], ["Teacher", e.teacher_name ?? ""], ["Status", <Badge key="s" status={e.status} />], ["Package", e.package ?? ""], ["Notes", e.notes ?? ""]]} /></div></section>
          )}
          <section className="card" id="classes">
            <div className="card-head"><h2><Icon name="calendar-week" /> Weekly classes</h2><span className="small muted">Times are fixed in the timezone shown</span></div>
            {slots.length === 0 ? <div className="empty-inline">No weekly classes scheduled yet.</div> : (
              <ul className="list-plain">{slots.map((s) => {
                const label = `${WEEKDAYS[s.weekday]} ${s.start_time.slice(0, 5)}`;
                return (
                  <li key={s.id} className="list-row">
                    <div className="list-row-main">
                      <div className="list-row-title">{label} <span className="muted small">{s.timezone} · {s.duration_min} min</span> {s.status === "cancelled" && <Badge status="cancelled" label="Stopped" />}</div>
                      <div className="list-row-sub">{[zoneLabel(s, e.student_tz, "Student"), zoneLabel(s, e.teacher_tz, "Teacher"), zoneLabel(s, tz, "Academy")].filter(Boolean).join(" · ") || "Same timezone for everyone"}</div>
                      {manage && s.meeting_url && <div className="small"><a href={s.meeting_url} target="_blank" rel="noopener noreferrer"><Icon name="camera-video" /> Meeting link</a></div>}
                    </div>
                    {manage && s.status === "scheduled" && <div className="list-row-end"><CancelSlotButton slotId={s.id} label={label} /></div>}
                  </li>
                );
              })}</ul>
            )}
            {manage && ["pending", "active"].includes(e.status) && e.student_status === "active" && (
              <div className="card-foot"><h3 style={{ margin: "8px 0 12px" }}>Add a weekly class</h3><SlotForm enrolmentId={e.id} defaultTz={e.teacher_tz ?? tz} zones={allTimezones()} /></div>
            )}
            {!manage && scheduled.length > 0 && <div className="card-foot muted">Meeting links are visible only to staff who manage enrolments.</div>}
          </section>
        </div>
        <div className="stack">
          <section className="card"><div className="card-body"><p className="small muted">The student&apos;s record status and this enrolment&apos;s status are separate. Attendance is not recorded in the portal.</p>
            <Link className="btn btn-secondary btn-sm" href={`${PORTAL}/students/${e.student_id}`}><Icon name="person" /> Open student</Link></div></section>
          <HistoryCard history={[]} audit={auditRows} tz={tz} />
        </div>
      </div>
    </>
  );
}

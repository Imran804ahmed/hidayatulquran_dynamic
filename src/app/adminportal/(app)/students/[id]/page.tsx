import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { getEntityAudit, getHistory } from "@/lib/portal/audit";
import { academyTimezone } from "@/lib/portal/settings";
import { fmtDate, fmtDay, fmtDateTime } from "@/lib/portal/time";
import { countryName, daysLabel, packageName } from "@/lib/portal/lookups";
import { enrolmentsFor, notesFor, type StudentRow } from "@/lib/portal/students";
import { Avatar, Badge, DefinitionList, EmptyState, Icon, whatsappHref } from "@/components/portal/ui";
import { BackToList } from "@/components/portal/shell";
import { StudentStatusPanel, type StatusOption } from "@/components/portal/records";
import { HistoryCard, NotesCard } from "@/components/portal/record-parts";

export const metadata: Metadata = { title: "Student" };

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const user = await requirePage("students.view", `${PORTAL}/students/${idParam}`);
  const s = /^\d+$/.test(idParam) ? await db.one<StudentRow>("SELECT * FROM hq_students WHERE id = ?", [Number(idParam)]) : null;
  if (!s) notFound();
  const tz = await academyTimezone();
  const [enrolments, notes, history, auditRows, source] = await Promise.all([
    enrolmentsFor("WHERE e.student_id = ?", [s.id]),
    notesFor("student", s.id),
    getHistory("student", s.id),
    getEntityAudit("student", s.id),
    s.source_registration_id ? db.one<{ id: number; ref_no: string; submitted_at: string }>("SELECT id, ref_no, submitted_at FROM hq_registrations WHERE id = ?", [s.source_registration_id]) : null,
  ]);
  const live = enrolments.filter((e) => ["pending", "active", "paused"].includes(e.status));
  const liveSlots = live.reduce((n, e) => n + Number(e.slot_count), 0);
  const wa = whatsappHref(s.whatsapp);

  const options: StatusOption[] = [];
  if (s.status !== "active" && (s.status !== "archived" || can(user, "students.archive")) && can(user, "students.edit")) {
    options.push({ to: "active", label: s.status === "archived" ? "Restore as active" : "Activate", icon: "person-check", variant: "primary" });
  }
  if (s.status === "active" && can(user, "students.edit")) {
    options.push({ to: "inactive", label: "Deactivate", icon: "pause-circle", variant: "secondary",
      confirm: `Deactivate ${s.full_name}? ${liveSlots ? `${liveSlots} weekly class slot(s) will stop appearing in the timetable. ` : ""}Enrolments and history are kept and return when the student is reactivated.` });
  }
  if (s.status !== "archived" && can(user, "students.archive")) {
    options.push({ to: "archived", label: "Archive", icon: "archive", variant: "danger", needsReason: true,
      confirm: `Archive ${s.full_name}? The record is hidden from the default list but kept with its full history. It can be restored later.` });
  }
  const impact = s.status === "active"
    ? `Impact of deactivating or archiving: ${live.length} current enrolment(s) and ${liveSlots} weekly class slot(s). Records are never deleted; class slots of inactive or archived students are hidden from the timetable and no new enrolments can be added until the student is active again.`
    : `This student is ${s.status}. Their classes are not shown in the timetable. Activate the record to resume.`;

  return (
    <>
      <BackToList module="students" fallback={`${PORTAL}/students`} label="Students" />
      <div className="page-head">
        <div className="detail-head">
          <Avatar name={s.full_name} tone="green" large />
          <div>
            <h1>{s.full_name}</h1>
            <div className="detail-meta"><span className="mono">{s.ref_no}</span><Badge status={s.status} /><span>Registered {fmtDay(s.registered_at ?? s.created_at, tz)}</span></div>
          </div>
        </div>
        <div className="page-actions">
          {wa && <a className="btn btn-secondary" href={wa} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" /> WhatsApp</a>}
          {s.email && <a className="btn btn-secondary" href={`mailto:${s.email}`}><Icon name="envelope" /> Email</a>}
          {can(user, "students.edit") && <Link className="btn btn-primary" href={`${PORTAL}/students/${s.id}/edit`}><Icon name="pencil-square" /> Edit</Link>}
        </div>
      </div>

      <div className="grid grid-main-side">
        <div className="stack">
          <section className="card" aria-labelledby="profile-title">
            <div className="card-head"><h2 id="profile-title"><Icon name="person-lines-fill" /> Profile</h2></div>
            <div className="card-body tight">
              <DefinitionList items={[
                ["Age", s.age ?? ""],
                ["Parent / guardian", s.guardian_name ?? ""],
                ["WhatsApp", s.whatsapp ? (wa ? <a href={wa} target="_blank" rel="noopener noreferrer">{s.whatsapp}</a> : s.whatsapp) : ""],
                ["Email", s.email ? <a href={`mailto:${s.email}`}>{s.email}</a> : ""],
                ["Country", countryName(s.country)],
                ["Timezone", s.timezone ?? ""],
                ["Preferred days", daysLabel(s.preferred_days)],
                ["Preferred time", s.preferred_time ?? ""],
                ["Source", source ? <Link href={`${PORTAL}/registrations/${source.id}`}>Registration {source.ref_no} ({fmtDay(source.submitted_at, tz)})</Link> : "Added in the portal"],
                ["Last updated", fmtDateTime(s.updated_at, tz)],
              ]} />
            </div>
          </section>

          <section className="card" aria-labelledby="enrol-title">
            <div className="card-head">
              <h2 id="enrol-title"><Icon name="journal-check" /> Course enrolments</h2>
              {can(user, "enrolments.manage") && s.status === "active" && <Link className="btn btn-secondary btn-sm" href={`${PORTAL}/enrolments/new?student=${s.id}`}><Icon name="plus-lg" /> Enrol in a course</Link>}
            </div>
            {enrolments.length === 0 ? (
              <EmptyState icon="journal-plus" title="Not enrolled in any course" text={s.status === "active" ? "Enrol this student in a course and assign a teacher." : "Activate the student to add an enrolment."} />
            ) : (
              <div className="table-wrap">
                <table className="table responsive">
                  <thead><tr><th scope="col">Course</th><th scope="col">Teacher</th><th scope="col">Package</th><th scope="col">Dates</th><th scope="col">Weekly classes</th><th scope="col">Enrolment status</th></tr></thead>
                  <tbody>
                    {enrolments.map((e) => (
                      <tr key={e.id}>
                        <td className="cell-primary">{can(user, "courses.view") ? <Link className="row-link" href={`${PORTAL}/enrolments/${e.id}`}>{e.course_name}</Link> : e.course_name}</td>
                        <td data-label="Teacher">{e.teacher_id ? <>{e.teacher_name}{e.teacher_status !== "active" && <span className="pill pill-warn" style={{ marginLeft: 6 }}>Teacher {e.teacher_status}</span>}</> : <span className="muted">Not assigned</span>}</td>
                        <td data-label="Package">{packageName(e.package) || "—"}</td>
                        <td data-label="Dates" className="small">{e.start_date ? fmtDate(e.start_date) : "—"}{e.end_date ? ` → ${fmtDate(e.end_date)}` : ""}</td>
                        <td data-label="Weekly classes" className="num">{e.slot_count}</td>
                        <td data-label="Status"><Badge status={e.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="card-foot muted">Enrolment status is per course. Attendance is not tracked in this portal, so an active student or enrolment does not mean classes were attended.</div>
          </section>

          <NotesCard type="student" id={s.id} notes={notes} canAdd={can(user, "students.edit")} tz={tz} />
        </div>

        <div className="stack">
          {(can(user, "students.edit") || can(user, "students.archive")) && (
            <section className="card" aria-labelledby="status-title">
              <div className="card-head"><h2 id="status-title"><Icon name="toggle-on" /> Record status</h2><Badge status={s.status} /></div>
              <div className="card-body"><StudentStatusPanel id={s.id} from={s.status} options={options} impact={impact} /></div>
            </section>
          )}
          <HistoryCard history={history} audit={auditRows} tz={tz} />
        </div>
      </div>
    </>
  );
}

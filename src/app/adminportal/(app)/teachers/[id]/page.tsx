import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { getEntityAudit, getHistory } from "@/lib/portal/audit";
import { academyTimezone } from "@/lib/portal/settings";
import { fmtDateTime, fmtDay } from "@/lib/portal/time";
import { WEEKDAYS } from "@/lib/portal/lookups";
import { enrolmentsFor, notesFor } from "@/lib/portal/students";
import type { TeacherRow } from "@/lib/portal/teachers";
import { liveSlots } from "@/lib/portal/schedule";
import { Avatar, Badge, DefinitionList, EmptyState, Icon, whatsappHref } from "@/components/portal/ui";
import { BackToList } from "@/components/portal/shell";
import { TeacherStatusPanel } from "@/components/portal/teacher-forms";
import { HistoryCard, NotesCard } from "@/components/portal/record-parts";

export const metadata: Metadata = { title: "Teacher" };

export default async function TeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const user = await requirePage("teachers.view", `${PORTAL}/teachers/${idParam}`);
  const t = /^\d+$/.test(idParam) ? await db.one<TeacherRow>("SELECT * FROM hq_teachers WHERE id = ?", [Number(idParam)]) : null;
  if (!t) notFound();
  const tz = await academyTimezone();
  const [enrolments, slots, notes, history, auditRows] = await Promise.all([
    enrolmentsFor("WHERE e.teacher_id = ?", [t.id]),
    liveSlots("AND e.teacher_id = ?", [t.id]),
    notesFor("teacher", t.id),
    getHistory("teacher", t.id),
    getEntityAudit("teacher", t.id),
  ]);
  const live = enrolments.filter((e) => ["pending", "active", "paused"].includes(e.status));
  const wa = whatsappHref(t.phone);
  const canEdit = can(user, "teachers.edit");
  const canArchive = can(user, "teachers.archive");

  return (
    <>
      <BackToList module="teachers" fallback={`${PORTAL}/teachers`} label="Teachers" />
      <div className="page-head">
        <div className="detail-head">
          <Avatar name={t.full_name} tone="blue" large />
          <div>
            <h1>{t.full_name}</h1>
            <div className="detail-meta"><span className="mono">{t.ref_no}</span><Badge status={t.status} /><span>{live.length} current enrolment(s) · {slots.length} weekly class(es)</span></div>
          </div>
        </div>
        <div className="page-actions">
          {wa && <a className="btn btn-secondary" href={wa} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" /> WhatsApp</a>}
          {t.email && <a className="btn btn-secondary" href={`mailto:${t.email}`}><Icon name="envelope" /> Email</a>}
          {canEdit && <Link className="btn btn-primary" href={`${PORTAL}/teachers/${t.id}/edit`}><Icon name="pencil-square" /> Edit</Link>}
        </div>
      </div>
      <div className="grid grid-main-side">
        <div className="stack">
          <section className="card">
            <div className="card-head"><h2><Icon name="person-lines-fill" /> Profile</h2></div>
            <div className="card-body tight">
              <DefinitionList items={[
                ["Email", t.email ? <a href={`mailto:${t.email}`}>{t.email}</a> : ""],
                ["Phone / WhatsApp", t.phone ?? ""],
                ["Country / city", t.country ?? ""],
                ["Timezone", t.timezone ?? ""],
                ["Specialisations", t.specialisations ? <span className="pre-wrap">{t.specialisations}</span> : ""],
                ["Qualifications", t.qualifications ? <span className="pre-wrap">{t.qualifications}</span> : ""],
                ["Availability", t.availability ? <span className="pre-wrap">{t.availability}</span> : ""],
                ["Added", fmtDay(t.created_at, tz)],
                ["Last updated", fmtDateTime(t.updated_at, tz)],
              ]} />
            </div>
          </section>

          <section className="card">
            <div className="card-head"><h2><Icon name="journal-check" /> Assigned students &amp; courses</h2></div>
            {enrolments.length === 0 ? <EmptyState icon="people" title="No assignments yet" text={t.status === "active" ? "Assign this teacher on a student's course enrolment." : "Activate this teacher before assigning students."} /> : (
              <div className="table-wrap">
                <table className="table responsive">
                  <thead><tr><th scope="col">Student</th><th scope="col">Course</th><th scope="col">Weekly classes</th><th scope="col">Enrolment status</th></tr></thead>
                  <tbody>{enrolments.map((e) => (
                    <tr key={e.id}>
                      <td className="cell-primary"><Link className="row-link" href={`${PORTAL}/students/${e.student_id}`}>{e.student_name}</Link> <span className="mono muted small">{e.student_ref}</span></td>
                      <td data-label="Course">{can(user, "courses.view") ? <Link href={`${PORTAL}/enrolments/${e.id}`}>{e.course_name}</Link> : e.course_name}</td>
                      <td data-label="Weekly classes" className="num">{e.slot_count}</td>
                      <td data-label="Status"><Badge status={e.status} /></td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card">
            <div className="card-head"><h2><Icon name="calendar-week" /> Weekly classes</h2>{can(user, "courses.view") && <Link className="small" href={`${PORTAL}/timetable?teacher=${t.id}`}>Open in timetable</Link>}</div>
            {slots.length === 0 ? <div className="empty-inline">No scheduled classes.</div> : (
              <ul className="list-plain">{slots.map((s) => (
                <li key={s.id} className="list-row">
                  <div className="list-row-main"><div className="list-row-title">{WEEKDAYS[s.weekday]} {s.start_time.slice(0, 5)} <span className="muted small">({s.timezone}, {s.duration_min} min)</span></div><div className="list-row-sub">{s.student_name} · {s.course_name}</div></div>
                </li>))}
              </ul>
            )}
          </section>

          <NotesCard type="teacher" id={t.id} notes={notes} canAdd={canEdit} tz={tz} />
        </div>
        <div className="stack">
          {(canEdit || canArchive) && (
            <section className="card">
              <div className="card-head"><h2><Icon name="toggle-on" /> Record status</h2><Badge status={t.status} /></div>
              <div className="card-body">
                {t.status === "active" ? (
                  <>
                    <p className="small muted">{live.length ? `${live.length} current enrolment(s) are assigned. You will choose a new teacher for each before the change is applied.` : "No current enrolments are assigned to this teacher."}</p>
                    <div className="row-gap">
                      {canEdit && <Link className="btn btn-secondary btn-sm" href={`${PORTAL}/teachers/${t.id}/status?to=inactive`}><Icon name="pause-circle" /> Deactivate…</Link>}
                      {canArchive && <Link className="btn btn-danger btn-sm" href={`${PORTAL}/teachers/${t.id}/status?to=archived`}><Icon name="archive" /> Archive…</Link>}
                    </div>
                  </>
                ) : (
                  <>
                    <TeacherStatusPanel id={t.id} from={t.status} options={[
                      ...(canEdit && (t.status !== "archived" || canArchive) ? [{ to: "active", label: t.status === "archived" ? "Restore as active" : "Activate", icon: "person-check", variant: "primary" as const }] : []),
                    ]} impact={`This teacher is ${t.status} and cannot receive new assignments.`} />
                    {t.status === "inactive" && canArchive && <p className="mt-3"><Link className="btn btn-danger btn-sm" href={`${PORTAL}/teachers/${t.id}/status?to=archived`}><Icon name="archive" /> Archive…</Link></p>}
                  </>
                )}
              </div>
            </section>
          )}
          <HistoryCard history={history} audit={auditRows} tz={tz} />
        </div>
      </div>
    </>
  );
}

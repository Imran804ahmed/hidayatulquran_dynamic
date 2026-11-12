import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { getEntityAudit, getHistory } from "@/lib/portal/audit";
import { academyTimezone } from "@/lib/portal/settings";
import { fmtDateTime, localYmd } from "@/lib/portal/time";
import { PLANS, REG_OPEN, countryName, daysLabel, packageName } from "@/lib/portal/lookups";
import { registrationDuplicates, type RegistrationRow } from "@/lib/portal/registrations";
import { notesFor } from "@/lib/portal/students";
import { Badge, DefinitionList, FollowUp, Icon, whatsappHref } from "@/components/portal/ui";
import { BackToList } from "@/components/portal/shell";
import { RegistrationReviewForm } from "@/components/portal/registration-forms";
import { HistoryCard, NotesCard } from "@/components/portal/record-parts";

export const metadata: Metadata = { title: "Registration" };

export default async function RegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const user = await requirePage("registrations.view", `${PORTAL}/registrations/${idParam}`);
  const r = /^\d+$/.test(idParam) ? await db.one<RegistrationRow>("SELECT * FROM hq_registrations WHERE id = ?", [Number(idParam)]) : null;
  if (!r) notFound();
  const tz = await academyTimezone();
  const [dups, notes, history, auditRows, users, student, assignee, converter] = await Promise.all([
    registrationDuplicates(r),
    notesFor("registration", r.id),
    getHistory("registration", r.id),
    getEntityAudit("registration", r.id),
    db.all<{ id: number; name: string }>("SELECT id, name FROM hq_users WHERE status = 'active' ORDER BY name"),
    r.student_id ? db.one<{ id: number; ref_no: string; full_name: string; status: string }>("SELECT id, ref_no, full_name, status FROM hq_students WHERE id = ?", [r.student_id]) : null,
    r.assigned_to ? db.value<string>("SELECT name FROM hq_users WHERE id = ?", [r.assigned_to]) : null,
    r.converted_by ? db.value<string>("SELECT name FROM hq_users WHERE id = ?", [r.converted_by]) : null,
  ]);
  const wa = whatsappHref(r.whatsapp);
  const open = REG_OPEN.includes(r.status as never);
  const statusOptions =
    r.status === "enrolled" ? ["enrolled"]
    : r.student_id ? ["approved", "enrolled"]
    : r.status === "rejected" ? ["rejected", "new", "under_review", "contacted", "approved"]
    : ["new", "under_review", "contacted", "approved", "rejected"];
  const canConvert = can(user, "registrations.convert") && !r.student_id && r.status === "approved";
  const waText = encodeURIComponent(`Assalamu alaikum ${r.guardian_name || r.full_name}, this is Hidayatul Quran Academy about your registration ${r.ref_no}.`);

  return (
    <>
      <BackToList module="registrations" fallback={`${PORTAL}/registrations`} label="Registration requests" />
      <div className="page-head">
        <div>
          <div className="eyebrow">Registration request</div>
          <h1>{r.full_name}</h1>
          <div className="detail-meta">
            <span className="mono">{r.ref_no}</span><Badge status={r.status} />
            <span>{r.submitted_at_known ? `Submitted ${fmtDateTime(r.submitted_at, tz)}` : "Imported from the old website table (submission time unknown)"}</span>
            <span>via {r.source_form}</span>
          </div>
        </div>
        <div className="page-actions">
          {wa && <a className="btn btn-secondary" href={`${wa}?text=${waText}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" /> WhatsApp</a>}
          {r.email && <a className="btn btn-secondary" href={`mailto:${r.email}?subject=${encodeURIComponent(`Your Hidayatul Quran registration ${r.ref_no}`)}`}><Icon name="envelope" /> Email</a>}
          {canConvert && <Link className="btn btn-gold" href={`${PORTAL}/registrations/${r.id}/convert`}><Icon name="person-check" /> Convert to student</Link>}
        </div>
      </div>

      {student && (
        <div className="alert alert-success"><Icon name="link-45deg" /><p>Converted {fmtDateTime(r.converted_at, tz)}{converter ? ` by ${converter}` : ""}. Linked student: <Link href={`${PORTAL}/students/${student.id}`}><strong>{student.ref_no} {student.full_name}</strong></Link> ({student.status}). The original submission below is preserved unchanged.</p></div>
      )}
      {!student && r.status === "approved" && !can(user, "registrations.convert") && (
        <div className="alert alert-info"><Icon name="info-circle-fill" /><p>Approved. A user with the convert permission can now create the student record.</p></div>
      )}
      {!student && r.status !== "approved" && r.status !== "rejected" && (
        <div className="alert alert-info"><Icon name="info-circle-fill" /><p>Next step: review and contact the applicant, then set the status to <strong>Approved</strong>. Converting to a student is a separate, explicit step.</p></div>
      )}
      {r.status === "rejected" && r.rejection_reason && (
        <div className="alert alert-error"><Icon name="x-octagon-fill" /><p><strong>Rejected (internal reason):</strong> {r.rejection_reason}</p></div>
      )}
      {(dups.otherRegs.length > 0 || dups.students.length > 0) && (
        <div className="alert alert-warning" role="note">
          <Icon name="people-fill" />
          <div>
            <p><strong>Possible duplicates — please review:</strong></p>
            <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
              {dups.students.map((s) => <li key={`s${s.id}`}>Student <Link href={`${PORTAL}/students/${s.id}`}>{s.ref_no} {s.full_name}</Link> ({s.reason || "similar"}, {s.status})</li>)}
              {dups.otherRegs.map((o) => <li key={`r${o.id}`}>Registration <Link href={`${PORTAL}/registrations/${o.id}`}>{o.ref_no} {o.full_name}</Link> ({o.status}, {fmtDateTime(o.submitted_at, tz)})</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-main-side">
        <div className="stack">
          <section className="card">
            <div className="card-head"><h2><Icon name="file-earmark-text" /> Submitted information</h2><span className="small muted">Exactly as received</span></div>
            <div className="card-body tight">
              <DefinitionList items={[
                ["Student name", r.full_name],
                ["Age", r.age ?? ""],
                ["Country", countryName(r.country)],
                ["Parent / guardian", r.guardian_name ?? ""],
                ["WhatsApp", r.whatsapp ? (wa ? <a href={wa} target="_blank" rel="noopener noreferrer">{r.whatsapp}</a> : r.whatsapp) : ""],
                ["Email", r.email ? <a href={`mailto:${r.email}`}>{r.email}</a> : ""],
                ["Package", packageName(r.package)],
                ["Classes plan", r.classes_plan ? PLANS[r.classes_plan] ?? r.classes_plan : ""],
                ["Preferred days", daysLabel(r.preferred_days)],
                ["Preferred time", r.preferred_time ? `${r.preferred_time}${r.country ? ` (${countryName(r.country)} time)` : ""}` : ""],
                ["Confirmation email", <Badge key="ce" status={r.confirmation_email} label={{ sent: "Accepted by mail server", failed: "Failed to send", pending: "Sending", skipped: "Not sent" }[r.confirmation_email]} />],
              ]} />
              {r.message && <><h3 className="mt-4" style={{ marginBottom: 8 }}>Message / notes from applicant</h3><div className="message-box mb-4">{r.message}</div></>}
            </div>
          </section>
          <NotesCard type="registration" id={r.id} notes={notes} canAdd={can(user, "registrations.edit")} tz={tz} />
        </div>
        <div className="stack">
          <section className="card">
            <div className="card-head"><h2><Icon name="clipboard-check" /> Review</h2></div>
            <div className="card-body">
              {can(user, "registrations.edit") ? (
                <RegistrationReviewForm r={r} users={users} statusOptions={statusOptions} />
              ) : (
                <DefinitionList items={[["Status", <Badge key="s" status={r.status} />], ["Assigned to", assignee ?? "Unassigned"], ["Follow-up", <FollowUp key="f" date={r.follow_up_on} open={open} today={localYmd(tz)} />]]} />
              )}
            </div>
          </section>
          <HistoryCard history={history} audit={auditRows} tz={tz} />
        </div>
      </div>
    </>
  );
}

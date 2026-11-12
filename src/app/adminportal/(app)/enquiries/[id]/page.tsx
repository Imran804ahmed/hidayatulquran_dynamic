import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PORTAL, can, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { getEntityAudit, getHistory } from "@/lib/portal/audit";
import { academyTimezone } from "@/lib/portal/settings";
import { fmtDateTime, localYmd } from "@/lib/portal/time";
import { ENQ_OPEN } from "@/lib/portal/lookups";
import { notesFor } from "@/lib/portal/students";
import type { EnquiryRow } from "@/lib/portal/enquiries";
import { Badge, DefinitionList, FollowUp, Icon } from "@/components/portal/ui";
import { BackToList } from "@/components/portal/shell";
import { EnquiryReviewForm, MarkUnreadButton } from "@/components/portal/enquiry-forms";
import { HistoryCard, NotesCard } from "@/components/portal/record-parts";

export const metadata: Metadata = { title: "Enquiry" };

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const user = await requirePage("enquiries.view", `${PORTAL}/enquiries/${idParam}`);
  const e = /^\d+$/.test(idParam) ? await db.one<EnquiryRow>("SELECT * FROM hq_enquiries WHERE id = ?", [Number(idParam)]) : null;
  if (!e) notFound();
  // Opening the enquiry marks it as read (the first time).
  if (!e.read_at) await db.exec("UPDATE hq_enquiries SET read_at = ? WHERE id = ? AND read_at IS NULL", [db.nowUtc(), e.id]);
  const tz = await academyTimezone();
  const [notes, history, auditRows, users, assignee, related] = await Promise.all([
    notesFor("enquiry", e.id), getHistory("enquiry", e.id), getEntityAudit("enquiry", e.id),
    db.all<{ id: number; name: string }>("SELECT id, name FROM hq_users WHERE status = 'active' ORDER BY name"),
    e.assigned_to ? db.value<string>("SELECT name FROM hq_users WHERE id = ?", [e.assigned_to]) : null,
    e.email ? db.all<{ kind: string; id: number; ref_no: string; label: string }>(
      `SELECT 'registrations' AS kind, id, ref_no, full_name AS label FROM hq_registrations WHERE email = ?
       UNION ALL SELECT 'students', id, ref_no, full_name FROM hq_students WHERE email = ?
       UNION ALL SELECT 'enquiries', id, ref_no, subject FROM hq_enquiries WHERE email = ? AND id <> ? LIMIT 10`, [e.email, e.email, e.email, e.id]) : [],
  ]);
  const replySubject = encodeURIComponent(`Re: ${e.subject ?? "Your enquiry"} [${e.ref_no}]`);
  return (
    <>
      <BackToList module="enquiries" fallback={`${PORTAL}/enquiries`} label="Enquiries" />
      <div className="page-head">
        <div>
          <div className="eyebrow">Enquiry</div>
          <h1>{e.subject || "(no subject)"}</h1>
          <div className="detail-meta"><span className="mono">{e.ref_no}</span><Badge status={e.status} /><span>From {e.full_name}</span>
            <span>{e.submitted_at_known ? fmtDateTime(e.submitted_at, tz) : "Imported (time unknown)"}</span><span>via {e.source_form}</span></div>
        </div>
        <div className="page-actions">
          {e.email && <a className="btn btn-primary" href={`mailto:${e.email}?subject=${replySubject}`}><Icon name="reply" /> Reply by email</a>}
          {can(user, "enquiries.edit") && <MarkUnreadButton id={e.id} />}
        </div>
      </div>
      <div className="grid grid-main-side">
        <div className="stack">
          <section className="card">
            <div className="card-head"><h2><Icon name="chat-left-text" /> Message</h2></div>
            <div className="card-body">
              <DefinitionList items={[["Name", e.full_name], ["Email", e.email ? <a href={`mailto:${e.email}`}>{e.email}</a> : ""], ["Subject", e.subject ?? ""],
                ["Confirmation email", <Badge key="c" status={e.confirmation_email} label={{ sent: "Accepted by mail server", failed: "Failed to send", pending: "Sending", skipped: "Not sent" }[e.confirmation_email]} />]]} />
              <div className="message-box mt-4">{e.message}</div>
              <p className="hint mt-3">“Reply by email” opens your own email app. Replies are not sent or tracked by the portal; record what was agreed as a note.</p>
            </div>
          </section>
          {related.length > 0 && (
            <section className="card">
              <div className="card-head"><h2><Icon name="link-45deg" /> Related records (same email)</h2></div>
              <ul className="list-plain">{related.map((r) => (
                <li key={`${r.kind}${r.id}`}><a className="list-row" href={`${PORTAL}/${r.kind}/${r.id}`}><div className="list-row-main"><div className="list-row-title">{r.label}</div><div className="list-row-sub">{r.kind === "students" ? "Student" : r.kind === "registrations" ? "Registration" : "Enquiry"} {r.ref_no}</div></div></a></li>
              ))}</ul>
            </section>
          )}
          <NotesCard type="enquiry" id={e.id} notes={notes} canAdd={can(user, "enquiries.edit")} tz={tz} />
        </div>
        <div className="stack">
          <section className="card">
            <div className="card-head"><h2><Icon name="clipboard-check" /> Handling</h2></div>
            <div className="card-body">
              {can(user, "enquiries.edit") ? <EnquiryReviewForm e={e} users={users} /> : (
                <DefinitionList items={[["Status", <Badge key="s" status={e.status} />], ["Assigned to", assignee ?? "Unassigned"], ["Follow-up", <FollowUp key="f" date={e.follow_up_on} open={ENQ_OPEN.includes(e.status as never)} today={localYmd(tz)} />]]} />
              )}
            </div>
          </section>
          <HistoryCard history={history} audit={auditRows} tz={tz} />
        </div>
      </div>
    </>
  );
}

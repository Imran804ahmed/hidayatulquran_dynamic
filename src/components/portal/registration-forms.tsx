"use client";

import Link from "next/link";
import { useState } from "react";
import { ActionForm, Checkbox, FormError, Hidden, SelectField, ShowWhen, SubmitButton, TextArea, TextField, useFormCtx } from "./forms";
import { convertRegistrationAction, updateRegistrationAction } from "@/server/actions/registrations";
import { REG_STATUS } from "@/lib/portal/lookups";

const PORTAL = "/adminportal";

export function RegistrationReviewForm({ r, users, statusOptions }: {
  r: { id: number; version: number; status: string; assigned_to: number | null; follow_up_on: string | null; rejection_reason: string | null };
  users: { id: number; name: string }[];
  statusOptions: string[];
}) {
  return (
    <ActionForm action={updateRegistrationAction}>
      <Hidden name="id" value={r.id} />
      <Hidden name="version" value={r.version} />
      <SelectField name="status" label="Status" defaultValue={r.status} options={statusOptions.map((s) => [s, REG_STATUS[s as keyof typeof REG_STATUS]])} />
      <ShowWhen field="status" values={r.status === "rejected" ? ["new", "under_review", "contacted", "approved"] : ["rejected"]} initial={r.status}>
        <TextArea name="status_reason" label={r.status === "rejected" ? "Reason for reopening" : "Internal rejection reason"} required rows={2} maxLength={500}
          hint="Internal only. Never sent to the applicant." />
      </ShowWhen>
      <SelectField name="assigned_to" label="Assigned to" optional defaultValue={r.assigned_to ?? ""} placeholder="Unassigned" options={users.map((u) => [String(u.id), u.name])} />
      <TextField name="follow_up_on" label="Follow-up date" optional type="date" defaultValue={r.follow_up_on?.slice(0, 10)} />
      <div className="row-gap"><SubmitButton icon="check2-circle" size="sm">Save review</SubmitButton></div>
    </ActionForm>
  );
}

type Candidate = { id: number; ref_no: string; full_name: string; status: string; reason: string };

function ModeChooser({ candidates }: { candidates: Candidate[] }) {
  const { state } = useFormCtx();
  const initialMode = state.values?.mode ?? "new";
  const [mode, setMode] = useState(initialMode);
  const linkable = candidates.filter((c) => c.status !== "archived");
  return (
    <fieldset className="field fieldset-plain">
      <legend className="label">Student record<span className="req" aria-hidden="true">*</span></legend>
      <label className="radio-card">
        <input type="radio" name="mode" value="new" defaultChecked={initialMode === "new"} onChange={() => setMode("new")} />
        <span><strong>Create a new student</strong><br /><span className="small muted">Copies the name, age, guardian, contact details, country and preferences from the registration.</span></span>
      </label>
      {linkable.length > 0 && (
        <label className="radio-card">
          <input type="radio" name="mode" value="link" defaultChecked={initialMode === "link"} onChange={() => setMode("link")} />
          <span><strong>Link to an existing student</strong><br /><span className="small muted">Use when this person is already a student. Only empty fields on the student are filled in.</span></span>
        </label>
      )}
      {mode === "link" && (
        <SelectField name="link_student_id" label="Existing student" required options={linkable.map((c) => [String(c.id), `${c.ref_no} ${c.full_name} (${c.reason || "possible match"})`])} placeholder="Choose student" />
      )}
      <FormError name="mode" />
    </fieldset>
  );
}

export function ConvertForm({ id, candidates, courses, teachers, canAssignTeacher }: {
  id: number; candidates: Candidate[]; courses: { id: number; name: string }[]; teachers: { id: number; full_name: string }[]; canAssignTeacher: boolean;
}) {
  return (
    <ActionForm action={convertRegistrationAction} className="card">
      <div className="card-body">
        <Hidden name="id" value={id} />
        <div className="form-section"><ModeChooser candidates={candidates} /></div>
        <div className="form-section">
          <h3>Course enrolment</h3>
          <Checkbox name="enrol" label="Also enrol the student in a course now (marks the registration Enrolled)" />
          <ShowWhen field="enrol" values={["1"]} initial="">
            <div className="form-grid">
              <SelectField name="course_id" label="Course" required options={courses.map((c) => [String(c.id), c.name])} placeholder="Choose course" hint="The website registration form does not ask for a course, so choose it here." />
              {canAssignTeacher && <SelectField name="teacher_id" label="Teacher" optional options={teachers.map((t) => [String(t.id), t.full_name])} placeholder="Assign later" hint="Only active teachers are listed." />}
              <TextField name="start_date" label="Start date" optional type="date" />
              <SelectField name="enrol_status" label="Enrolment status" defaultValue="pending" options={[["pending", "Pending start"], ["active", "Active"]]} />
            </div>
          </ShowWhen>
          <p className="hint">Leave unticked to create the student only; you can enrol them later. No message is sent and no login is created.</p>
        </div>
        <div className="form-actions">
          <Link className="btn btn-ghost" href={`${PORTAL}/registrations/${id}`}>Cancel</Link>
          <SubmitButton icon="person-check" pendingLabel="Converting…" confirm="Convert this registration now? This is recorded in the history and can only be done once." confirmOk="Convert">Convert to student</SubmitButton>
        </div>
      </div>
    </ActionForm>
  );
}

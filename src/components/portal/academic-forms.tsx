"use client";

import Link from "next/link";
import { ActionForm, Hidden, SelectField, SubmitButton, TextArea, TextField } from "./forms";
import { TimezoneField } from "./records";
import { addSlotAction, cancelSlotAction, saveCourseAction, saveEnrolmentAction } from "@/server/actions/academics";
import { ENROL_STATUS, PACKAGES, WEEKDAYS } from "@/lib/portal/lookups";

const PORTAL = "/adminportal";

export function CourseForm({ course }: { course?: { id: number; version: number; name: string; summary: string | null; public_url: string | null; status: string; sort_order: number } }) {
  const c = course;
  return (
    <ActionForm action={saveCourseAction} className="card">
      <div className="card-body">
        {c && <><Hidden name="id" value={c.id} /><Hidden name="version" value={c.version} /></>}
        <div className="alert alert-info"><i className="bi bi-info-circle-fill" aria-hidden="true" /><p>This updates the course list used inside the portal only. Course pages on the public website are part of the site&apos;s code and do not change when you save here.</p></div>
        <div className="form-grid">
          <TextField name="name" label="Course name" required defaultValue={c?.name} maxLength={150} />
          <SelectField name="status" label="Status" defaultValue={c?.status ?? "active"} options={[["active", "Active (open for enrolment)"], ["inactive", "Inactive (no new enrolments)"]]} />
          <TextArea name="summary" label="Short description" optional defaultValue={c?.summary} rows={3} maxLength={500} className="span-2" />
          <TextField name="public_url" label="Public page" optional defaultValue={c?.public_url} placeholder="/quran-tajweed-course-online.html" maxLength={255} />
          <TextField name="sort_order" label="Display order" optional type="number" defaultValue={c?.sort_order ?? 0} />
        </div>
        <div className="form-actions">
          <Link className="btn btn-ghost" href={c ? `${PORTAL}/courses/${c.id}` : `${PORTAL}/courses`}>Cancel</Link>
          <SubmitButton icon="check2-circle">{c ? "Save course" : "Add course"}</SubmitButton>
        </div>
      </div>
    </ActionForm>
  );
}

export type EnrolmentFormValues = {
  id?: number; version?: number; student_id?: number; course_id?: number; teacher_id?: number | null; package?: string | null; classes_per_week?: number | null;
  status?: string; start_date?: string | null; end_date?: string | null; notes?: string | null;
};

export function EnrolmentForm({ e, students, courses, teachers, studentLocked }: {
  e?: EnrolmentFormValues; students: { id: number; ref_no: string; full_name: string }[]; courses: { id: number; name: string; status: string }[];
  teachers: { id: number; full_name: string; status: string }[]; studentLocked?: string;
}) {
  const v = e ?? {};
  return (
    <ActionForm action={saveEnrolmentAction} className="card">
      <div className="card-body">
        {v.id && <><Hidden name="id" value={v.id} /><Hidden name="version" value={v.version ?? 0} /></>}
        <div className="form-grid">
          {studentLocked ? (
            <div className="field"><span className="label">Student</span><div className="input" aria-readonly="true">{studentLocked}</div>{!v.id && <Hidden name="student_id" value={v.student_id ?? ""} />}</div>
          ) : (
            <SelectField name="student_id" label="Student" required defaultValue={v.student_id} placeholder="Choose an active student" options={students.map((s) => [String(s.id), `${s.full_name} (${s.ref_no})`])} />
          )}
          <SelectField name="course_id" label="Course" required defaultValue={v.course_id} placeholder="Choose course"
            options={courses.filter((c) => c.status === "active" || c.id === v.course_id).map((c) => [String(c.id), c.name + (c.status !== "active" ? " (inactive)" : "")])} />
          <SelectField name="teacher_id" label="Teacher" optional defaultValue={v.teacher_id ?? ""} placeholder="Not assigned yet"
            options={teachers.filter((t) => t.status === "active" || t.id === v.teacher_id).map((t) => [String(t.id), t.full_name + (t.status !== "active" ? ` (${t.status} – keep or change)` : "")])}
            hint="Only active teachers can be newly assigned. Existing class times are checked for clashes." />
          <SelectField name="status" label="Enrolment status" defaultValue={v.status ?? "pending"} options={Object.entries(ENROL_STATUS)} hint="Participation in this course. It does not record attendance." />
          <SelectField name="package" label="Package" optional defaultValue={v.package ?? ""} placeholder="None" options={Object.entries(PACKAGES)} />
          <TextField name="classes_per_week" label="Classes per week" optional type="number" min={1} max={7} defaultValue={v.classes_per_week} />
          <TextField name="start_date" label="Start date" optional type="date" defaultValue={v.start_date?.slice(0, 10)} />
          <TextField name="end_date" label="End date" optional type="date" defaultValue={v.end_date?.slice(0, 10)} />
          <TextArea name="notes" label="Enrolment notes" optional defaultValue={v.notes} rows={3} maxLength={2000} className="span-2" />
        </div>
        <div className="form-actions">
          <Link className="btn btn-ghost" href={v.id ? `${PORTAL}/enrolments/${v.id}` : `${PORTAL}/enrolments`}>Cancel</Link>
          <SubmitButton icon="check2-circle">{v.id ? "Save enrolment" : "Create enrolment"}</SubmitButton>
        </div>
      </div>
    </ActionForm>
  );
}

export function SlotForm({ enrolmentId, defaultTz, zones }: { enrolmentId: number; defaultTz: string; zones: string[] }) {
  return (
    <ActionForm action={addSlotAction}>
      <Hidden name="enrolment_id" value={enrolmentId} />
      <div className="form-grid">
        <SelectField name="weekday" label="Day" required placeholder="Choose day" options={Object.entries(WEEKDAYS)} />
        <TextField name="start_time" label="Start time" required type="time" />
        <TextField name="duration_min" label="Duration (minutes)" required type="number" min={10} max={240} defaultValue={30} hint="Website classes are 30 minutes." />
        <TimezoneField defaultValue={defaultTz} zones={zones} hint="The day and time are fixed in this timezone, so daylight-saving changes are handled." />
        <TextField name="meeting_url" label="Meeting link" optional type="url" placeholder="https://…" className="span-2" hint="Visible only to staff with the enrolments permission." />
      </div>
      <div className="row-gap"><SubmitButton icon="calendar-plus" size="sm">Add weekly class</SubmitButton></div>
    </ActionForm>
  );
}

export function CancelSlotButton({ slotId, label }: { slotId: number; label: string }) {
  return (
    <ActionForm action={cancelSlotAction} guard={false}>
      <Hidden name="slot_id" value={slotId} />
      <SubmitButton variant="danger" size="sm" icon="x-circle" danger confirm={`Stop the weekly class on ${label}? It is kept in the history.`} confirmOk="Stop class" pendingLabel="…">Stop</SubmitButton>
    </ActionForm>
  );
}

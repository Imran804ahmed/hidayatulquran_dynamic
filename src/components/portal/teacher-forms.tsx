"use client";

import Link from "next/link";
import { ActionForm, Hidden, SelectField, SubmitButton, TextArea, TextField } from "./forms";
import { DuplicateConfirm, StatusPanel, TimezoneField, type StatusOption } from "./records";
import { saveTeacherAction, teacherStatusAction } from "@/server/actions/teachers";

const PORTAL = "/adminportal";

export type TeacherFormValues = {
  id?: number; version?: number; full_name?: string; email?: string | null; phone?: string | null; country?: string | null; timezone?: string | null;
  qualifications?: string | null; specialisations?: string | null; availability?: string | null;
};

export function TeacherForm({ teacher, zones }: { teacher?: TeacherFormValues; zones: string[] }) {
  const t = teacher ?? {};
  return (
    <ActionForm action={saveTeacherAction} className="card">
      <div className="card-body">
        {t.id && <><Hidden name="id" value={t.id} /><Hidden name="version" value={t.version ?? 0} /></>}
        <DuplicateConfirm label="Save anyway" />
        <div className="form-section">
          <h3>Teacher</h3>
          <div className="form-grid">
            <TextField name="full_name" label="Full name" required defaultValue={t.full_name} maxLength={150} autoComplete="off" />
            <TextField name="country" label="Country / city" optional defaultValue={t.country} maxLength={80} />
            <TextField name="email" label="Email address" type="email" defaultValue={t.email} hint="Email or phone is required." maxLength={190} />
            <TextField name="phone" label="Phone / WhatsApp" type="tel" defaultValue={t.phone} hint="Include the country code." maxLength={40} />
            <TimezoneField defaultValue={t.timezone} zones={zones} hint="Used to show class times in the teacher's local time." />
          </div>
        </div>
        <div className="form-section">
          <h3>Teaching profile</h3>
          <div className="form-grid">
            <TextArea name="specialisations" label="Specialisations" optional defaultValue={t.specialisations} rows={3} maxLength={1000} hint="e.g. Tajweed, Hifz, Noorani Qaida, female students." />
            <TextArea name="qualifications" label="Qualifications" optional defaultValue={t.qualifications} rows={3} maxLength={2000} hint="e.g. Ijazah, Alimiyyah, years of experience." />
            <TextArea name="availability" label="Availability" optional defaultValue={t.availability} rows={3} maxLength={2000} className="span-2" hint="General availability, e.g. Mon–Fri 14:00–22:00 PKT. Actual classes are scheduled on enrolments." />
          </div>
        </div>
        <div className="form-actions">
          <Link className="btn btn-ghost" href={t.id ? `${PORTAL}/teachers/${t.id}` : `${PORTAL}/teachers`}>Cancel</Link>
          <SubmitButton icon="check2-circle">{t.id ? "Save changes" : "Add teacher"}</SubmitButton>
        </div>
      </div>
    </ActionForm>
  );
}

export function TeacherStatusPanel(props: { id: number; from: string; options: StatusOption[]; impact?: string }) {
  return <StatusPanel action={teacherStatusAction} {...props} />;
}

export type Assignment = { id: number; student_name: string; student_ref: string; course_name: string; status: string; slot_count: number };

/** Deactivate / archive with a decision for every current enrolment. */
export function ReassignForm({ teacherId, teacherName, from, to, assignments, teachers }: {
  teacherId: number; teacherName: string; from: string; to: "inactive" | "archived"; assignments: Assignment[]; teachers: { id: number; full_name: string }[];
}) {
  const options: [string, string][] = [["none", "Leave unassigned (choose later)"], ...teachers.filter((t) => t.id !== teacherId).map((t) => [String(t.id), t.full_name] as [string, string])];
  return (
    <ActionForm action={teacherStatusAction}>
      <Hidden name="id" value={teacherId} />
      <Hidden name="from" value={from} />
      <Hidden name="to" value={to} />
      {assignments.length > 0 && (
        <div className="table-wrap mb-4">
          <table className="table responsive">
            <thead><tr><th scope="col">Student</th><th scope="col">Course</th><th scope="col">Weekly classes</th><th scope="col">New teacher</th></tr></thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td className="cell-primary"><strong>{a.student_name}</strong> <span className="mono muted">{a.student_ref}</span></td>
                  <td data-label="Course">{a.course_name}</td>
                  <td data-label="Weekly classes" className="num">{a.slot_count}</td>
                  <td data-label="New teacher" style={{ minWidth: 240 }}>
                    <SelectField name={`reassign_${a.id}`} label={<span className="sr-only">New teacher for {a.student_name}</span>} options={options} placeholder="Choose…" required />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <TextArea name="reason" label="Reason" optional={to !== "archived"} rows={2} maxLength={500} hint="Kept in the teacher's history." />
      <div className="form-actions">
        <Link className="btn btn-ghost" href={`${PORTAL}/teachers/${teacherId}`}>Cancel</Link>
        <SubmitButton variant="danger" icon={to === "archived" ? "archive" : "pause-circle"} danger confirm={`${to === "archived" ? "Archive" : "Deactivate"} ${teacherName}${assignments.length ? ` and apply the ${assignments.length} enrolment change(s)` : ""}?`} confirmOk={to === "archived" ? "Archive" : "Deactivate"}>
          {to === "archived" ? "Archive teacher" : "Deactivate teacher"}
        </SubmitButton>
      </div>
    </ActionForm>
  );
}

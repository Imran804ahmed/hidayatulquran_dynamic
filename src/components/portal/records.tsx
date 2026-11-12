"use client";

import Link from "next/link";
import { ActionForm, Checkbox, CheckboxGroup, Hidden, SelectField, SubmitButton, TextArea, TextField, useFormCtx } from "./forms";
import { saveStudentAction, studentStatusAction } from "@/server/actions/students";
import { addNoteAction } from "@/server/actions/notes";
import { COUNTRIES, DAYS } from "@/lib/portal/lookups";
import type { ActionState } from "@/lib/portal/form-types";

const PORTAL = "/adminportal";

/** Shown only after the server reports a possible duplicate: requires an explicit decision. */
export function DuplicateConfirm({ label = "Save anyway: this is a different person" }: { label?: string }) {
  const { state } = useFormCtx();
  if (!state.errors.duplicate) return null;
  return (
    <div className="alert alert-warning" role="alert">
      <i className="bi bi-people-fill" aria-hidden="true" />
      <div>
        <p>{state.errors.duplicate}</p>
        <label className="check mt-3"><input type="checkbox" name="confirm_duplicate" value="1" /> {label}</label>
      </div>
    </div>
  );
}

export function TimezoneField({ name = "timezone", defaultValue, zones, hint }: { name?: string; defaultValue?: string | null; zones: string[]; hint?: string }) {
  const { state } = useFormCtx();
  const value = state.values?.[name] ?? defaultValue ?? "";
  const error = state.errors[name];
  return (
    <div className="field">
      <label htmlFor={`f-${name}`}>Timezone<span className="opt">(optional)</span></label>
      <input className="input" id={`f-${name}`} name={name} list={`tz-${name}`} defaultValue={value} placeholder="e.g. Europe/London" autoComplete="off"
        {...(error ? { "aria-invalid": true, "aria-describedby": `err-${name}` } : {})} />
      <datalist id={`tz-${name}`}>{zones.map((z) => <option key={z} value={z} />)}</datalist>
      {hint && <p className="hint">{hint}</p>}
      {error && <p className="field-error" id={`err-${name}`}><i className="bi bi-exclamation-circle" aria-hidden="true" /> {error}</p>}
    </div>
  );
}

export type StudentFormValues = {
  id?: number; version?: number; full_name?: string; age?: number | null; guardian_name?: string | null; email?: string | null; whatsapp?: string | null;
  country?: string | null; timezone?: string | null; preferred_days?: string | null; preferred_time?: string | null; registered_on?: string | null;
};

export function StudentForm({ student, zones }: { student?: StudentFormValues; zones: string[] }) {
  const s = student ?? {};
  const cancel = s.id ? `${PORTAL}/students/${s.id}` : `${PORTAL}/students`;
  return (
    <ActionForm action={saveStudentAction} className="card">
      <div className="card-body">
        {s.id && <><Hidden name="id" value={s.id} /><Hidden name="version" value={s.version ?? 0} /></>}
        <DuplicateConfirm />
        <div className="form-section">
          <h3>Student</h3>
          <div className="form-grid">
            <TextField name="full_name" label="Full name" required defaultValue={s.full_name} maxLength={150} autoComplete="off" />
            <TextField name="age" label="Age" optional type="number" min={1} max={120} inputMode="numeric" defaultValue={s.age} />
            <SelectField name="country" label="Country" optional defaultValue={s.country} placeholder="Select country" options={Object.entries(COUNTRIES)} />
            <TimezoneField defaultValue={s.timezone} zones={zones} hint="Used to show class times in the student's local time." />
          </div>
        </div>
        <div className="form-section">
          <h3>Contact &amp; guardian</h3>
          <div className="form-grid">
            <TextField name="guardian_name" label="Parent / guardian name" optional defaultValue={s.guardian_name} maxLength={150} />
            <TextField name="whatsapp" label="WhatsApp number" type="tel" defaultValue={s.whatsapp} hint="Include the country code." maxLength={40} />
            <TextField name="email" label="Email address" type="email" defaultValue={s.email} hint="Email or WhatsApp is required." maxLength={190} />
          </div>
        </div>
        <div className="form-section">
          <h3>Preferences</h3>
          <div className="form-grid">
            <CheckboxGroup name="preferred_days" label="Preferred days" optional options={Object.entries(DAYS)} defaultValue={s.preferred_days?.split(",") ?? []} />
            <TextField name="preferred_time" label="Preferred time" optional defaultValue={s.preferred_time} placeholder="e.g. 05:00 pm - 06:00 pm" maxLength={60} />
            <TextField name="registered_on" label="Registration date" optional type="date" defaultValue={s.registered_on} hint="Leave empty to use the date this record is created." />
          </div>
        </div>
        <div className="form-actions">
          <Link className="btn btn-ghost" href={cancel}>Cancel</Link>
          <SubmitButton icon="check2-circle">{s.id ? "Save changes" : "Add student"}</SubmitButton>
        </div>
      </div>
    </ActionForm>
  );
}

export type StatusOption = { to: string; label: string; icon: string; variant: "primary" | "secondary" | "danger" | "gold"; confirm?: string; needsReason?: boolean };

/** Status change buttons with an optional reason, impact text and confirmation. */
export function StatusPanel({ action, id, from, version, options, impact }: {
  action: (s: ActionState, fd: FormData) => Promise<ActionState>; id: number; from: string; version?: number; options: StatusOption[]; impact?: string;
}) {
  if (!options.length) return null;
  const needsReason = options.some((o) => o.needsReason);
  return (
    <ActionForm action={action} guard={false}>
      <Hidden name="id" value={id} />
      <Hidden name="from" value={from} />
      {version !== undefined && <Hidden name="version" value={version} />}
      {impact && <p className="small muted">{impact}</p>}
      <TextArea name="reason" label="Reason" optional={!needsReason} rows={2} maxLength={500} hint={needsReason ? "Required when archiving. Kept in the record history." : "Kept in the record history."} />
      <div className="row-gap">
        {options.map((o) => (
          <SubmitButton key={o.to} name="to" value={o.to} variant={o.variant} icon={o.icon} size="sm" confirm={o.confirm} danger={o.variant === "danger"} confirmOk={o.label}>{o.label}</SubmitButton>
        ))}
      </div>
    </ActionForm>
  );
}

export function StudentStatusPanel(props: { id: number; from: string; options: StatusOption[]; impact?: string }) {
  return <StatusPanel action={studentStatusAction} {...props} />;
}

export function NoteForm({ type, id }: { type: string; id: number }) {
  return (
    <ActionForm action={addNoteAction}>
      <Hidden name="entity_type" value={type} />
      <Hidden name="entity_id" value={id} />
      <TextArea name="body" label="Add a private note" rows={3} maxLength={5000} hint="Visible to portal staff only. Never sent to the student or shown on the website." />
      <div className="row-gap"><SubmitButton icon="sticky" size="sm" variant="secondary">Save note</SubmitButton></div>
    </ActionForm>
  );
}

export { Checkbox };

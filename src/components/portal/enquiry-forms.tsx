"use client";

import { ActionForm, Hidden, SelectField, SubmitButton, TextField } from "./forms";
import { markEnquiryUnreadAction, updateEnquiryAction } from "@/server/actions/enquiries";
import { ENQ_STATUS } from "@/lib/portal/lookups";

export function EnquiryReviewForm({ e, users }: { e: { id: number; version: number; status: string; assigned_to: number | null; follow_up_on: string | null }; users: { id: number; name: string }[] }) {
  return (
    <ActionForm action={updateEnquiryAction}>
      <Hidden name="id" value={e.id} />
      <Hidden name="version" value={e.version} />
      <SelectField name="status" label="Status" defaultValue={e.status} options={Object.entries(ENQ_STATUS)} />
      <SelectField name="assigned_to" label="Assigned to" optional defaultValue={e.assigned_to ?? ""} placeholder="Unassigned" options={users.map((u) => [String(u.id), u.name])} />
      <TextField name="follow_up_on" label="Follow-up date" optional type="date" defaultValue={e.follow_up_on?.slice(0, 10)} />
      <div className="row-gap"><SubmitButton icon="check2-circle" size="sm">Save</SubmitButton></div>
    </ActionForm>
  );
}

export function MarkUnreadButton({ id }: { id: number }) {
  return (
    <ActionForm action={markEnquiryUnreadAction} guard={false}>
      <Hidden name="id" value={id} />
      <SubmitButton variant="ghost" size="sm" icon="envelope" pendingLabel="…">Mark as unread</SubmitButton>
    </ActionForm>
  );
}

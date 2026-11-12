"use client";

import { ActionForm, Hidden, PasswordField, SubmitButton, TextField } from "./forms";
import { forgotAction, loginAction, resetAction } from "@/server/actions/auth";

export function LoginForm({ next }: { next: string }) {
  return (
    <ActionForm action={loginAction} guard={false}>
      <Hidden name="next" value={next} />
      <TextField name="email" label="Email address" type="email" autoComplete="username" required />
      <PasswordField name="password" label="Password" autoComplete="current-password" />
      <SubmitButton icon="box-arrow-in-right" className="btn-block" pendingLabel="Signing in…">Sign in</SubmitButton>
    </ActionForm>
  );
}

export function ForgotForm() {
  return (
    <ActionForm action={forgotAction} guard={false}>
      <TextField name="email" label="Email address" type="email" autoComplete="username" required />
      <SubmitButton icon="envelope" className="btn-block" pendingLabel="Sending…">Send reset link</SubmitButton>
    </ActionForm>
  );
}

export function ResetForm({ token }: { token: string }) {
  return (
    <ActionForm action={resetAction} guard={false}>
      <Hidden name="token" value={token} />
      <PasswordField name="password" label="New password" autoComplete="new-password" hint="At least 10 characters. A short phrase is easier to remember." />
      <PasswordField name="password_confirm" label="Repeat new password" autoComplete="new-password" />
      <SubmitButton icon="check2-circle" className="btn-block">Save new password</SubmitButton>
    </ActionForm>
  );
}

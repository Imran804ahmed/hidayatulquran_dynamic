import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/portal/auth-shell";
import { ResetForm } from "@/components/portal/auth-forms";
import { PORTAL } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { sha256 } from "@/lib/portal/request";

export const metadata: Metadata = { title: "Choose a new password", referrer: "no-referrer" };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const valid = /^[A-Za-z0-9_-]{20,100}$/.test(token)
    ? await db.one<{ email: string }>(
        `SELECT u.email FROM hq_password_resets r JOIN hq_users u ON u.id = r.user_id
          WHERE r.token_hash = ? AND r.used_at IS NULL AND r.expires_at > ? AND u.status = 'active'`,
        [sha256(token), db.nowUtc()],
      )
    : null;
  return (
    <AuthShell>
      {valid ? (
        <>
          <h1>Choose a new password</h1>
          <p className="lead">For <strong>{valid.email}</strong>. Other devices will be signed out.</p>
          <ResetForm token={token} />
        </>
      ) : (
        <>
          <h1>This link has expired</h1>
          <p className="lead">Reset links work once and only for 60 minutes. Request a new one to continue.</p>
          <Link className="btn btn-primary btn-block" href={`${PORTAL}/forgot-password`}><i className="bi bi-arrow-repeat" aria-hidden="true" /> Request a new link</Link>
          <div className="auth-foot"><Link href={`${PORTAL}/login`}><i className="bi bi-arrow-left" aria-hidden="true" /> Back to sign in</Link></div>
        </>
      )}
    </AuthShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/portal/auth-shell";
import { ForgotForm } from "@/components/portal/auth-forms";
import { PORTAL } from "@/lib/portal/auth";
import { mailConfigured } from "@/lib/portal/mailer";

export const metadata: Metadata = { title: "Reset password" };

export default async function ForgotPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;
  return (
    <AuthShell>
      <h1>Reset your password</h1>
      {sent === "1" ? (
        <>
          <div className="alert alert-success mt-4" role="status">
            <i className="bi bi-envelope-fill" aria-hidden="true" />
            <p>If an active portal account uses that address, a reset link is on its way. It works once and expires in 60 minutes. Check the spam folder if it does not arrive.</p>
          </div>
          <Link className="btn btn-secondary btn-block" href={`${PORTAL}/login`}><i className="bi bi-arrow-left" aria-hidden="true" /> Back to sign in</Link>
        </>
      ) : (
        <>
          <p className="lead">Enter your account email and we will send you a link to choose a new password.</p>
          {!mailConfigured() && (
            <div className="alert alert-warning"><i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /><p>Email sending is not configured on this server, so reset emails cannot be delivered. A Super Admin can set a new password for you in Users &amp; roles.</p></div>
          )}
          <ForgotForm />
          <div className="auth-foot"><Link href={`${PORTAL}/login`}><i className="bi bi-arrow-left" aria-hidden="true" /> Back to sign in</Link></div>
        </>
      )}
    </AuthShell>
  );
}

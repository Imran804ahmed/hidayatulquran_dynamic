import Link from "next/link";
import { AuthShell } from "./auth-shell";
import { LoginForm } from "./auth-forms";
import { PORTAL } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";

export async function LoginScreen({ next, expired }: { next: string | null; expired: boolean }) {
  let noUsers = false;
  let dbDown = false;
  try {
    noUsers = (await db.count("SELECT COUNT(*) FROM hq_users")) === 0;
  } catch {
    dbDown = true;
  }
  return (
    <AuthShell>
      <h1>Assalamu alaikum</h1>
      <p className="lead">Sign in to the Hidayatul Quran admin portal.</p>
      {expired && (
        <div className="alert alert-info" role="status"><i className="bi bi-clock-history" aria-hidden="true" /><p>Your session ended after a period of inactivity. Please sign in again.</p></div>
      )}
      {dbDown && (
        <div className="alert alert-error" role="alert"><i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /><p>The portal cannot reach its database right now, so sign-in will not work. Check the DB_* settings or try again shortly.</p></div>
      )}
      {noUsers && (
        <div className="alert alert-info"><i className="bi bi-info-circle-fill" aria-hidden="true" /><p>No administrator account exists yet. Create the first Super Admin with <span className="mono">npm run portal -- create-admin</span> (see the portal README).</p></div>
      )}
      <LoginForm next={next ?? ""} />
      <div className="auth-foot">
        <Link href={`${PORTAL}/forgot-password`}>Forgot your password?</Link>
        <Link href="/"><i className="bi bi-arrow-left" aria-hidden="true" /> Back to website</Link>
      </div>
    </AuthShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PORTAL, requirePage } from "@/lib/portal/auth";

export const metadata: Metadata = { title: "No access" };

export default async function NoAccessPage({ searchParams }: { searchParams: Promise<{ permission?: string }> }) {
  await requirePage();
  const { permission } = await searchParams;
  return (
    <div className="error-page">
      <div className="error-code">403</div>
      <h1>You do not have access to this</h1>
      <p className="page-sub">
        Your account does not include {permission ? <>the <span className="mono">{permission.replace(/[^a-z._]/g, "")}</span> permission</> : "this permission"}.
        Ask a Super Admin if you need it.
      </p>
      <p className="mt-4"><Link className="btn btn-primary" href={`${PORTAL}/dashboard`}><i className="bi bi-grid-1x2" aria-hidden="true" /> Go to dashboard</Link></p>
    </div>
  );
}

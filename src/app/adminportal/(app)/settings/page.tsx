import type { Metadata } from "next";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import { getSettings } from "@/lib/portal/settings";
import { mailConfigured } from "@/lib/portal/mailer";
import { allTimezones } from "@/lib/portal/time";
import { PageHeader } from "@/components/portal/ui";
import { SettingsForm } from "@/components/portal/admin-forms";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requirePage("settings.manage", `${PORTAL}/settings`);
  const s = await getSettings();
  return (
    <>
      <PageHeader eyebrow="Administration" title="Settings" subtitle="Each section says whether it affects the public website. Every change is recorded in the audit history." />
      {!mailConfigured() && (
        <div className="alert alert-warning"><i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /><p>Email is not configured on this server (SMTP_HOST / SMTP_USER / SMTP_PASSWORD). Website submissions are still saved, but confirmation emails, staff notifications and password-reset emails cannot be sent.</p></div>
      )}
      <SettingsForm s={s} zones={allTimezones()} />
    </>
  );
}

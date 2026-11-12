import type { ReactNode } from "react";
import { FlashMessages } from "./shell";
import { Suspense } from "react";
import Image from "next/image";

/** Split-screen sign-in layout echoing the public website hero (logo, gradient, gold eyebrow). */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth">
      <section className="auth-brand" aria-hidden="true">
        <Image className="auth-logo" src="/assets/img/hidayatulquran1.png" alt="" width={300} height={300} />
        <div className="auth-eyebrow">Hidayatul Quran Academy</div>
        <h2>Administration portal</h2>
        <p>Registrations, enquiries, students, teachers and classes in one place.</p>
      </section>
      <main className="auth-panel" id="main">
        <div className="auth-card">
          <Image className="auth-mobile-logo" src="/assets/img/hidayatulquran1.png" alt="Hidayatul Quran Academy" width={96} height={96} />
          <Suspense fallback={null}><FlashMessages /></Suspense>
          {children}
          <p className="auth-secure"><i className="bi bi-shield-lock-fill" aria-hidden="true" /> Restricted area for authorised academy staff. Activity is logged.</p>
        </div>
      </main>
    </div>
  );
}

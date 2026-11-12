import type { Metadata, Viewport } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";
import "aos/dist/aos.css";
import "swiper/swiper-bundle.min.css";
import "@/styles/site.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import FloatingActions from "@/components/layout/FloatingActions";
import SiteEffects from "@/components/layout/SiteEffects";
import { SITE } from "@/config/site";
import { fontVariables } from "@/styles/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: SITE.logo, type: "image/png" }],
    apple: SITE.logo,
  },
};

export const viewport: Viewport = { themeColor: "#082c4c" };

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. Grammarly) add attributes to <html>/<body>
    // before React hydrates. It only ignores attribute differences on these two elements.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingActions />
        <SiteEffects />
      </body>
    </html>
  );
}

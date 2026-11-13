import type { Metadata, Viewport } from "next";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./portal.css";
import { portalNunito, portalOpenSans } from "@/styles/fonts";
import { SITE_ICONS } from "@/config/site";

// Root layout for /adminportal. Separate from the public site's layout: no public CSS/JS is loaded.
export const metadata: Metadata = {
  title: { default: "Admin portal · Hidayatul Quran", template: "%s · Hidayatul Quran Admin" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: SITE_ICONS,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#082c4c" };

export default function PortalRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${portalNunito.variable} ${portalOpenSans.variable}`} suppressHydrationWarning>
      <body className="portal" suppressHydrationWarning>{children}</body>
    </html>
  );
}

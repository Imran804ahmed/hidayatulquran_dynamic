import type { Metadata } from "next";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import { SITE, SITE_ICONS } from "@/config/site";
import { fontVariables } from "@/styles/fonts";
import styles from "./global-not-found.module.css";
import Image from "next/image";

// Shown for any URL that matches no route (public site or portal).
export const metadata: Metadata = {
  title: `Page not found | ${SITE.name}`,
  robots: { index: false, follow: true },
  icons: SITE_ICONS,
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <main className={styles.main}>
          <div>
            <Link href="/" aria-label={`${SITE.name} home`}>
              <Image src={SITE.logo} alt={`${SITE.name} logo`} width={140} height={140} />
            </Link>
            <p className={styles.code}>Error 404</p>
            <h1 className={styles.title}>Page not found</h1>
            <p className={styles.text}>The page you are looking for does not exist or has moved.</p>
            <Link href="/" className={`btn ${styles.home}`}>
              Go to the home page
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

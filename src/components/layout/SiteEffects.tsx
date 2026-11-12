"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Aos = typeof import("aos").default;
let aos: Promise<Aos> | undefined;

/**
 * Browser-only behaviour shared by all public pages:
 *  - AOS scroll animations (re-scanned after every client-side navigation),
 *  - Bootstrap's data-api (accordions / collapse), which listens on `document` once.
 */
export default function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    import("bootstrap");
    aos ??= import("aos").then(({ default: AOS }) => {
      AOS.init({ duration: 1000, easing: "ease-in-out", once: true, mirror: false });
      return AOS;
    });
  }, []);

  useEffect(() => {
    aos?.then((AOS) => AOS.refreshHard());
  }, [pathname]);

  return null;
}

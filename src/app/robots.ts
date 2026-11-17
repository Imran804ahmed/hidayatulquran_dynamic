import type { MetadataRoute } from "next";
import { IS_STAGING, absoluteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Staging builds (SITE_ENV=staging) block everything and advertise no sitemap. The host must
  // also be password-protected: robots.txt is a crawl hint, not access control.
  if (IS_STAGING) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /explore is not blocked: it carries a noindex that crawlers must be able to read.
        disallow: ["/adminportal", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

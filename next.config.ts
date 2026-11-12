import os from "node:os";
import type { NextConfig } from "next";
import { legacyRedirects } from "./src/config/redirects";

// Build parallelism. By default Next.js spawns (CPU count - 1) workers for "Collecting page data" /
// static generation, and each worker starts its own native (Rust/Tokio) thread pool. On large
// shared/containerised build hosts (e.g. 64 reported cores, low pids/thread limit) that exceeds the
// OS thread limit and the build aborts with "OS can't spawn worker thread ... (os error 11)".
// Cap the worker count (override with NEXT_BUILD_CPUS) and the per-process Tokio pool size.
const buildCpus = Math.max(
  1,
  Number(process.env.NEXT_BUILD_CPUS) || Math.min(4, Math.max(1, (os.cpus()?.length ?? 2) - 1)),
);
process.env.TOKIO_WORKER_THREADS ??= "2";

const nextConfig: NextConfig = {
  // Runs as a Node.js server (`next start`): needed for the admin portal, its sessions and the
  // public form endpoints. Public pages are still prerendered to static HTML at build time.
  // BUILD_STANDALONE=1 produces .next/standalone (self-contained `node server.js`) for zip deployment.
  output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Only the site's own images are optimized (resized + WebP); see components/ui/SiteImage.
    localPatterns: [{ pathname: "/assets/img/**", search: "" }],
    qualities: [75],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    // Two root layouts (public site, admin portal) need a single global 404 page.
    globalNotFound: true,
    // See buildCpus above: keeps the build within thread limits on shared hosts.
    cpus: buildCpus,
  },

  async redirects() {
    return legacyRedirects;
  },

  async rewrites() {
    return {
      beforeFiles: [
        // The website forms historically posted to PHP scripts; the URLs are kept for old cached pages.
        { source: "/forms/contact.php", destination: "/api/forms/contact" },
        { source: "/forms/registration.php", destination: "/api/forms/registration" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  async headers() {
    const portalSecurity = [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "same-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/adminportal", headers: portalSecurity },
      { source: "/adminportal/:path*", headers: portalSecurity },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }, { key: "Cache-Control", value: "no-store" }] },
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Runs before routing:
 *  1. Canonical host / HTTPS redirect (replaces the Apache .htaccess rule) when CANONICAL_HOST is set.
 *  2. Defence-in-depth CSRF check for portal and form POSTs: browsers send Sec-Fetch-Site / Origin;
 *     cross-site POSTs are rejected before reaching any Server Action or route handler
 *     (Server Actions also verify Origin against Host themselves).
 * Authentication is NOT decided here; every portal page and action checks the session itself.
 */
export function proxy(request: NextRequest) {
  const canonicalHost = process.env.CANONICAL_HOST; // e.g. www.hidayatulquran.com
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  if (canonicalHost && (host !== canonicalHost || proto !== "https")) {
    const url = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${canonicalHost}`);
    return NextResponse.redirect(url, 301);
  }

  if (request.method === "POST") {
    const site = request.headers.get("sec-fetch-site");
    const origin = request.headers.get("origin");
    let crossOrigin = site === "cross-site";
    if (!crossOrigin && origin && origin !== "null") {
      try {
        crossOrigin = new URL(origin).host !== host;
      } catch {
        crossOrigin = true;
      }
    }
    if (crossOrigin) {
      return new NextResponse(JSON.stringify({ success: false, message: "Cross-site request blocked." }), {
        status: 403,
        headers: { "content-type": "application/json" },
      });
    }
  }
  if (request.nextUrl.pathname.startsWith("/adminportal")) {
    // Lets the portal layout send signed-out users to /login?next=<this page>.
    const headers = new Headers(request.headers);
    headers.set("x-hq-path", (request.nextUrl.pathname + request.nextUrl.search).slice(0, 500));
    return NextResponse.next({ request: { headers } });
  }
  return NextResponse.next();
}

export const config = {
  // Everything except static build output and public assets (those never need either check
  // unless a canonical host is configured, which the host-level redirect covers for documents).
  matcher: ["/((?!_next/static|_next/image|assets/|favicon).*)"],
};

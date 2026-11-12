import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PORTAL, currentUser } from "@/lib/portal/auth";
import { LoginScreen } from "@/components/portal/login-screen";

export const metadata: Metadata = { title: "Sign in" };

/** /adminportal: the dashboard for signed-in staff, otherwise the sign-in screen. */
export default async function PortalHome() {
  if (await currentUser().catch(() => null)) redirect(`${PORTAL}/dashboard`);
  return <LoginScreen next={null} expired={false} />;
}

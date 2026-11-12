import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginScreen } from "@/components/portal/login-screen";
import { PORTAL, currentUser, safeNext } from "@/lib/portal/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await currentUser().catch(() => null)) redirect(next ?? `${PORTAL}/dashboard`);
  return <LoginScreen next={next} expired={sp.expired === "1"} />;
}

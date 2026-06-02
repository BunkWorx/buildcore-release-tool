export const dynamic = "force-dynamic";

import { AppShell } from "@/components/layout/AppShell";
import { getReleaseToolUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getReleaseToolUser();
  if (!user) {
    redirect("/login");
  }
  return <AppShell user={user}>{children}</AppShell>;
}

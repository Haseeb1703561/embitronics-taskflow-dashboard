import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getAuthSession } from "@/lib/auth";

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardLayout email={session.user.email ?? "User account"}>
      {children}
    </DashboardLayout>
  );
}

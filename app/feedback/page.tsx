import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { UserTopBar } from "@/components/dashboard/user-topbar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import FeedbackForm from "./feedback-form";

export default async function FeedbackPage() {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    redirect("/signin?reason=auth_error");
  }

  if (!session) {
    redirect("/signin");
  }

  let dbUser: {
    id: string; name: string; email: string; image: string | null;
    class: string | null; role: string;
    progress: { level: number; experience: number } | null;
  } | null = null;
  let userSquad: { id: string } | null = null;

  try {
    [dbUser, userSquad] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          class: true,
          role: true,
          progress: { select: { level: true, experience: true } },
        }
      }),
      prisma.member.findFirst({ where: { userId: session.user.id }, select: { id: true } }),
    ]);
  } catch {
    redirect("/signin?reason=db_error");
  }

  if (!dbUser) {
    redirect("/signin");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={dbUser} hasSquad={!!userSquad} />
      <SidebarInset className="bg-background">
        <UserTopBar user={dbUser} />
        <main className="flex-1 p-4 md:p-8 pb-32 md:pb-8 overflow-y-auto scrollbar-none">
          <FeedbackForm />
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}

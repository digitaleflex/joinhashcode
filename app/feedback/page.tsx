import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { UserTopBar } from "@/components/dashboard/user-topbar";
import FeedbackForm from "./feedback-form";

export default async function FeedbackPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      level: true,
      experience: true,
      class: true,
      role: true,
    }
  });

  if (!dbUser) {
    redirect("/signin");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={dbUser} />
      <SidebarInset className="bg-background">
        <UserTopBar user={dbUser} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto scrollbar-none">
          <FeedbackForm />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

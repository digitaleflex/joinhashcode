import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  // Fetch quiz results if any
  const quizResult = await prisma.quizResult.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Nav />
      <div className="flex-1 pt-24 pb-32 md:pb-12">
        <DashboardShell 
          user={dbUser || session.user} 
          quizResult={quizResult} 
        />
      </div>
      <Footer />
    </main>
  );
}

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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

  // Fetch submissions
  const submissions = await prisma.missionSubmission.findMany({
    where: { userId: session.user.id },
    select: { missionId: true, status: true }
  });

  const submissionsMap = submissions.reduce((acc, s) => {
    acc[s.missionId] = s.status;
    return acc;
  }, {} as Record<string, string>);

  return (
    <DashboardShell 
      user={dbUser || session.user} 
      quizResult={quizResult} 
      submissions={submissionsMap}
    />
  );
}

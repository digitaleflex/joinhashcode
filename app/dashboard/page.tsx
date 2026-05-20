import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { prisma } from "@/lib/prisma";

import { getRecommendedMissions } from "@/lib/recommendation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  // Fetch all required data in parallel
  const [dbUser, quizResult, submissions, guildMember] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        level: true,
        experience: true,
        class: true,
        builderScore: true,
        creatorScore: true,
        strategistScore: true,
        catalystScore: true,
        missionsCompletedCount: true,
        lastCheckinAt: true,
        behavioralVibrancy: true,
        currentStreak: true,
        confidenceScore: true,
      }
    }),
    prisma.quizResult.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.missionSubmission.findMany({
      where: { userId: session.user.id },
      select: { missionId: true, status: true }
    }),
    prisma.guildMember.findFirst({
      where: { userId: session.user.id },
      include: {
        guild: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    pseudo: true,
                    image: true,
                    class: true,
                  }
                }
              }
            }
          }
        }
      }
    })
  ]);

  const submissionsMap = submissions.reduce((acc, s) => {
    acc[s.missionId] = s.status;
    return acc;
  }, {} as Record<string, string>);

  // Calculate recommendations (FYP Algorithm)
  const completedIds = submissions
    .filter(s => s.status === "APPROVED" || s.status === "PENDING")
    .map(s => s.missionId);

  const recommendedMissions = getRecommendedMissions(
    dbUser?.behavioralVibrancy as any,
    dbUser?.class || quizResult?.profileType || null,
    dbUser?.level || 1,
    completedIds,
    3
  );

  return (
    <DashboardShell 
      user={dbUser || (session.user as any)} 
      quizResult={quizResult} 
      submissions={submissionsMap}
      squad={guildMember?.guild || null}
      recommendedMissions={recommendedMissions}
    />
  );
}

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

  // Fetch all required data in parallel — wrap so DB errors go to error.tsx with a log
  let dbUser: Awaited<ReturnType<typeof prisma.user.findUnique>> | undefined
  let quizResult: Awaited<ReturnType<typeof prisma.quizResult.findFirst>> | undefined
  let submissions: Awaited<ReturnType<typeof prisma.missionSubmission.findMany>>
  let guildMember: Awaited<ReturnType<typeof prisma.guildMember.findFirst>> | undefined

  try {
    ;[dbUser, quizResult, submissions, guildMember] = await Promise.all([
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
        profileDrift: true,
        pseudo: true,
      }
    }),
    prisma.quizResult.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.missionSubmission.findMany({
      where: { userId: session.user.id },
      select: { missionId: true, status: true },
      take: 200,
    }),
    prisma.guildMember.findFirst({
      where: { userId: session.user.id },
      include: {
        guild: {
          include: {
            members: {
              take: 5,
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
  ])
  } catch (err) {
    console.error("[DASHBOARD_PAGE] DB fetch failed:", err)
    throw err // propagates to app/dashboard/error.tsx
  }

  const submissionsMap = (submissions ?? []).reduce((acc, s) => {
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

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
  let dbUser: any = null;
  let quizResult: any = null;
  let submissions: any[] = [];
  let member: any = null;

  try {
    ;[dbUser, quizResult, submissions, member] = await Promise.all([
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
          pseudo: true,
        }
      }),
      prisma.quizResult.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.missionSubmission.findMany({
        where: { userId: session.user.id },
        select: {
          missionId: true,
          status: true,
          mission: { select: { slug: true } },
        },
        take: 200,
      }),
      prisma.member.findFirst({
        where: { userId: session.user.id },
        include: {
          organization: {
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
    ]);
  } catch (err) {
    console.error("[DASHBOARD_PAGE] DB fetch failed:", err)
    throw err // propagates to app/dashboard/error.tsx
  }

  const submissionsMap = (submissions ?? []).reduce((acc: any, s: any) => {
    const slug = s.mission?.slug ?? s.missionId;
    acc[slug] = s.status;
    return acc;
  }, {} as Record<string, string>);

  // Calculate recommendations (FYP Algorithm) — use slugs to match MISSIONS[n].id
  const completedIds = (submissions ?? [])
    .filter((s: any) => s.status === "APPROVED" || s.status === "PENDING")
    .map((s: any) => s.mission?.slug ?? s.missionId);

  const recommendedMissions = getRecommendedMissions(
    dbUser?.behavioralVibrancy as any,
    dbUser?.class || quizResult?.profileType || null,
    dbUser?.level || 1,
    completedIds,
    3
  );

  // Map Organization to the legacy "squad" format for compatibility with UI components
  const squad = member?.organization ? {
    ...member.organization,
    members: member.organization.members.map((m: any) => ({
      ...m,
      role: m.role === "owner" ? "LEADER" : "MEMBER",
      user: {
        ...m.user,
        pseudo: m.user.pseudo || m.user.name,
      }
    }))
  } : null;

  return (
    <DashboardShell 
      user={dbUser || (session.user as any)} 
      quizResult={quizResult} 
      submissions={submissionsMap}
      squad={squad}
      recommendedMissions={recommendedMissions}
    />
  );
}

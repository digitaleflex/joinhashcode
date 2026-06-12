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
          referralCode: true,
          referralCount: true,
        }
      }),
      prisma.quizResult.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.missionSubmission.findMany({
        where: { userId: session.user.id },
        include: {
          mission: {
            select: {
              title: true,
              slug: true,
              xp: true,
              missionLevel: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
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

  // Pass Organization data directly to UI — roles are already correct ("owner" / "member")
  const squad = member?.organization ? {
    ...member.organization,
    members: member.organization.members.map((m: any) => ({
      ...m,
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
      fullSubmissions={submissions}
      squad={squad}
      memberRole={member?.role ?? undefined}
      recommendedMissions={recommendedMissions}
    />
  );
}

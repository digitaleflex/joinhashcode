import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { getRecommendedMissions } from "@/lib/recommendation";
import { UserProfile, DetailedMissionSubmission } from "@/lib/types";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  // Fetch all required data in parallel
  let dbUser: UserProfile | null = null;
  let quizResult: any = null;
  let submissions: DetailedMissionSubmission[] = [];
  let member: any = null;

  try {
    const [userRes, quizRes, subRes, memRes] = await Promise.all([
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
          missionsCompletedCount: true,
          behavioralVibrancy: true,
          pseudo: true,
          referralCode: true,
          referralCount: true,
          role: true,
          language: true,
          memberNumber: true,
          createdAt: true,
          domains: true,
          tools: true,
          badges: true,
          bio: true,
          currentSituation: true,
          technicalLevel: true,
          mainObjective: true,
          country: true,
          city: true,
          psychometrics: {
            select: {
              builderScore: true,
              creatorScore: true,
              strategistScore: true,
              catalystScore: true,
              confidenceScore: true,
            }
          },
          stats: {
            select: {
              lastCheckinAt: true,
              currentStreak: true,
            }
          }
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
              category: true,
              slug: true,
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

    dbUser = userRes ? {
      ...userRes,
      builderScore: userRes.psychometrics?.builderScore ?? 0,
      creatorScore: userRes.psychometrics?.creatorScore ?? 0,
      strategistScore: userRes.psychometrics?.strategistScore ?? 0,
      catalystScore: userRes.psychometrics?.catalystScore ?? 0,
      confidenceScore: userRes.psychometrics?.confidenceScore ?? 0.25,
      lastCheckin: userRes.stats?.lastCheckinAt ?? null,
      currentStreak: userRes.stats?.currentStreak ?? 0,
      badges: userRes.badges || [],
      domains: userRes.domains || [],
      tools: userRes.tools || [],
    } : null;
    quizResult = quizRes;
    submissions = subRes as any;
    member = memRes;
  } catch (err) {
    console.error("[DASHBOARD_PAGE] DB fetch failed:", err)
    throw err
  }

  const submissionsMap = (submissions ?? []).reduce((acc, s) => {
    const slug = s.mission?.slug ?? s.missionId;
    acc[slug] = s.status;
    return acc;
  }, {} as Record<string, string>);

  const completedIds = (submissions ?? [])
    .filter((s) => s.status === "APPROVED" || s.status === "PENDING")
    .map((s) => s.mission?.slug ?? s.missionId);

  const recommendedMissions = getRecommendedMissions(
    dbUser?.behavioralVibrancy as any,
    dbUser?.class || quizResult?.profileType || null,
    dbUser?.level || 1,
    completedIds,
    3
  );

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

  if (!dbUser) {
    redirect("/signin");
  }

  return (
    <DashboardShell
      user={dbUser}
      quizResult={quizResult}
      submissions={submissionsMap}
      fullSubmissions={submissions}
      squad={squad}
      memberRole={member?.role ?? undefined}
      recommendedMissions={recommendedMissions}
    />
  );
}

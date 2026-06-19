import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { UserProfile, DetailedMissionSubmission } from "@/lib/types";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  // Single consolidated query to reduce connection pressure on remote DB
  let dbUser: UserProfile | null = null;
  let quizResult: any = null;
  let submissions: DetailedMissionSubmission[] = [];
  let member: any = null;

  try {
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        psychometrics: {
          select: { builderScore: true, creatorScore: true, strategistScore: true, catalystScore: true, confidenceScore: true },
        },
        stats: {
          select: { lastCheckinAt: true, currentStreak: true },
        },
        progress: {
          select: { level: true, experience: true, missionsCompletedCount: true },
        },
        referral: {
          select: { referralCode: true, referralCount: true },
        },
        quizResults: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        missionSubmissions: {
          include: { mission: { select: { title: true, category: true, slug: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        members: {
          take: 1,
          include: {
            organization: {
              include: {
                members: {
                  take: 5,
                  include: {
                    user: { select: { id: true, name: true, pseudo: true, image: true, class: true } },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!userData) {
      redirect("/signin")
    }

    dbUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
      level: userData.progress?.level ?? 1,
      experience: userData.progress?.experience ?? 0,
      class: userData.class,
      missionsCompletedCount: userData.progress?.missionsCompletedCount ?? 0,
      behavioralVibrancy: userData.behavioralVibrancy,
      pseudo: userData.pseudo,
      referralCode: userData.referral?.referralCode ?? null,
      referralCount: userData.referral?.referralCount ?? 0,
      role: userData.role,
      language: userData.language,
      memberNumber: userData.memberNumber,
      createdAt: userData.createdAt,
      domains: userData.domains || [],
      tools: userData.tools || [],
      badges: userData.badges || [],
      bio: userData.bio,
      currentSituation: userData.currentSituation,
      technicalLevel: userData.technicalLevel,
      mainObjective: userData.mainObjective,
      country: userData.country,
      city: userData.city,
      builderScore: userData.psychometrics?.builderScore ?? 0,
      creatorScore: userData.psychometrics?.creatorScore ?? 0,
      strategistScore: userData.psychometrics?.strategistScore ?? 0,
      catalystScore: userData.psychometrics?.catalystScore ?? 0,
      confidenceScore: userData.psychometrics?.confidenceScore ?? 0.25,
      lastCheckin: userData.stats?.lastCheckinAt ?? null,
      currentStreak: userData.stats?.currentStreak ?? 0,
    } as UserProfile
    quizResult = userData.quizResults[0] ?? null
    submissions = userData.missionSubmissions as any
    member = userData.members[0] ?? null
  } catch (error: unknown) {
    console.error("[DASHBOARD_PAGE] DB fetch failed:", error)
    throw error
  }

  const submissionsMap = (submissions ?? []).reduce((acc, s) => {
    const slug = s.mission?.slug ?? s.missionId;
    acc[slug] = s.status;
    return acc;
  }, {} as Record<string, string>);

  const completedIds = (submissions ?? [])
    .filter((s) => s.status === "APPROVED" || s.status === "PENDING")
    .map((s) => s.mission?.slug ?? s.missionId);

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
      recommendedMissions={[]}
    />
  );
}

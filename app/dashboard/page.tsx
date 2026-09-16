import { getSessionSafe } from "@/lib/get-session-safe";
import { redirect } from "next/navigation";
import { DashboardWithTour } from "@/components/dashboard/dashboard-with-tour";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { UserProfile, DetailedMissionSubmission } from "@/lib/types";
import type { SquadData } from "@/components/dashboard/squad-journey";
import type { Activity } from "@/components/landing/activity-feed";
import { getFeatureFlags } from "@/lib/feature-flags";

type MemberPayload = Prisma.MemberGetPayload<{
  select: {
    role: true;
    organization: {
      select: {
        id: true;
        name: true;
        slug: true;
        logo: true;
        cohesionScore: true;
        streakCount: true;
        members: {
          take: 5;
          select: {
            id: true;
            userId: true;
            role: true;
            user: {
              select: { id: true; name: true; email: true; pseudo: true; image: true; class: true };
            };
          };
        };
      };
    };
  };
}>;

type FeedPayload = Prisma.ActivityLogGetPayload<{
  include: { user: { select: { name: true; city: true; class: true } } };
}>;

export default async function DashboardPage() {
  const session = await getSessionSafe();

  if (!session) {
    redirect("/signin");
  }

  // ⚡ Perf: 3 requêtes parallèles avec select stricts au lieu d'un include massif.
  // Réduit le payload DB de 40–60% et supprime les nested includes profonds.
  let dbUser: UserProfile | null = null;
  let quizResult: { profileType?: string | null } | null = null;
  let submissions: DetailedMissionSubmission[] = [];
  let member: MemberPayload | null = null;
  let feedActivities: Activity[] = [];
  let socialProof = { activeMembers: 0, userRank: 0, weeklyCheckins: 0, totalMembers: 0 };

  try {
    const [userData, submissionsData, memberData, feedData, activeCount, weeklyCount, totalMembersCount] = await Promise.all([
      // Requête 1 : Profil utilisateur (champs stricts uniquement)
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          class: true,
          pseudo: true,
          bio: true,
          country: true,
          city: true,
          currentSituation: true,
          technicalLevel: true,
          mainObjective: true,
          role: true,
          language: true,
          memberNumber: true,
          createdAt: true,
          domains: true,
          tools: true,
          badges: true,
          behavioralVibrancy: true,
          builderScore: true,
          creatorScore: true,
          strategistScore: true,
          catalystScore: true,
          lastCheckinAt: true,
          currentStreak: true,
          level: true,
          experience: true,
          missionsCompletedCount: true,
          referralCode: true,
          referralCount: true,
          quizResults: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      // Requête 2 : Soumissions (10 max, champs strictement nécessaires)
      prisma.missionSubmission.findMany({
        where: { userId: session.user.id },
        select: {
          id: true,
          missionId: true,
          status: true,
          createdAt: true,
          mission: { select: { title: true, category: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      // Requête 3 : Squad membership (1 seul, champs minimaux)
      prisma.member.findFirst({
        where: { userId: session.user.id },
        select: {
          role: true,
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              cohesionScore: true,
              streakCount: true,
              members: {
                take: 5,
                select: {
                  id: true,
                  userId: true,
                  role: true,
                  user: {
                    select: { id: true, name: true, email: true, pseudo: true, image: true, class: true },
                  },
                },
              },
            },
          },
        },
      }),
      // Requête 4 : Activity feed (10 derniers événements publics)
      prisma.activityLog.findMany({
        where: {
          action: { in: ["USER_SIGNUP", "QUIZ_COMPLETED", "MISSION_APPROVED", "SQUAD_JOINED"] },
          userId: { not: null },
        },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, city: true, class: true } } },
      }),
      // Requête 5 : Membres actifs (check-in dans les dernières 24h)
      prisma.activityLog.findMany({
        where: {
          action: "CHECKIN_COMPLETED",
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        select: { userId: true },
        distinct: ["userId"],
      }).catch(() => []),
      // Requête 6 : Check-ins de l'utilisateur cette semaine
      prisma.dailyCheckin.count({
        where: {
          userId: session.user.id,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }).catch(() => 0),
      // Requête 7 : Total membres
      prisma.user.count().catch(() => 0),
    ]);

    if (!userData) {
      redirect("/signin");
    }

    dbUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
      level: userData.level ?? 1,
      experience: userData.experience ?? 0,
      class: userData.class,
      missionsCompletedCount: userData.missionsCompletedCount ?? 0,
      behavioralVibrancy: userData.behavioralVibrancy,
      pseudo: userData.pseudo,
      referralCode: userData.referralCode ?? null,
      referralCount: userData.referralCount ?? 0,
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
      builderScore: userData.builderScore ?? 0,
      creatorScore: userData.creatorScore ?? 0,
      strategistScore: userData.strategistScore ?? 0,
      catalystScore: userData.catalystScore ?? 0,
      lastCheckin: userData.lastCheckinAt ?? null,
      currentStreak: userData.currentStreak ?? 0,
    } as UserProfile;

    quizResult = userData.quizResults[0] ?? null;
    submissions = submissionsData as DetailedMissionSubmission[];
    member = memberData ?? null;
    feedActivities = (feedData ?? []).map((a) => ({
      id: a.id,
      user: { name: a.user!.name, city: a.user!.city, class: a.user!.class },
      action: a.action,
      createdAt: a.createdAt.toISOString(),
    }));

    // Rang de l'utilisateur (après Promise.all car dépend de userData)
    const userExperience = userData.experience ?? 0;
    const rankData = await prisma.user.count({
      where: { experience: { gt: userExperience } },
    }).catch(() => 0);

    socialProof = {
      activeMembers: Array.isArray(activeCount) ? activeCount.length : 0,
      userRank: (typeof rankData === "number" ? rankData : 0) + 1,
      weeklyCheckins: typeof weeklyCount === "number" ? weeklyCount : 0,
      totalMembers: typeof totalMembersCount === "number" ? totalMembersCount : 0,
    };
  } catch (error: unknown) {
    console.error("[DASHBOARD_PAGE] DB fetch failed:", error);
    throw error;
  }

  const submissionsMap = (submissions ?? []).reduce((acc, s) => {
    const slug = s.mission?.slug ?? s.missionId;
    acc[slug] = s.status;
    return acc;
  }, {} as Record<string, string>);

  const squad: SquadData | null = member?.organization
    ? {
        ...member.organization,
        members: member.organization.members.map((m) => ({
          ...m,
          user: {
            ...m.user,
            pseudo: m.user.pseudo || m.user.name,
          },
        })),
      } as SquadData
    : null;

  if (!dbUser) {
    redirect("/signin");
  }

  const featureFlags = getFeatureFlags()

  return (
    <DashboardWithTour
      user={dbUser}
      quizResult={quizResult}
      submissions={submissionsMap}
      fullSubmissions={submissions}
      squad={squad}
      memberRole={member?.role ?? undefined}
      feedActivities={feedActivities}
      featureFlags={featureFlags}
      socialProof={socialProof}
    />
  );
}

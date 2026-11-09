import { getSessionSafe } from "@/lib/get-session-safe";
import { redirect } from "next/navigation";
import { DashboardWithTour } from "@/components/dashboard/dashboard-with-tour";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { UserProfile, DetailedMissionSubmission } from "@/lib/types";
import type { Activity } from "@/components/landing/activity-feed";
import { getFeatureFlags } from "@/lib/feature-flags";
import { getFirstAction } from "@/lib/first-action";

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
  let feedActivities: Activity[] = [];
  let firstActionStatus: "not_started" | "started" | "completed" = "not_started";

  try {
    const [userData, submissionsData, feedData] = await Promise.all([
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
          primaryDomain: true,
          firstActionStartedAt: true,
          firstActionCompletedAt: true,
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
      // Requête 4 : Activity feed (10 derniers événements publics)
      prisma.activityLog.findMany({
        where: {
          action: { in: ["USER_SIGNUP", "QUIZ_COMPLETED", "MISSION_APPROVED"] },
          userId: { not: null },
        },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, city: true, class: true } } },
      }),
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
      primaryDomain: userData.primaryDomain ?? null,
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
    firstActionStatus = userData.firstActionCompletedAt
      ? "completed"
      : userData.firstActionStartedAt
        ? "started"
        : "not_started";
    submissions = submissionsData as DetailedMissionSubmission[];
    feedActivities = (feedData ?? []).map((a) => ({
      id: a.id,
      user: { name: a.user!.name, city: a.user!.city, class: a.user!.class },
      action: a.action,
      createdAt: a.createdAt.toISOString(),
    }));

  } catch (error: unknown) {
    console.error("[DASHBOARD_PAGE] DB fetch failed:", error);
    throw error;
  }

  const submissionsMap = (submissions ?? []).reduce((acc, s) => {
    const slug = s.mission?.slug ?? s.missionId;
    acc[slug] = s.status;
    return acc;
  }, {} as Record<string, string>);

  if (!dbUser) {
    redirect("/signin");
  }

  const featureFlags = getFeatureFlags()
  const firstAction = getFirstAction(dbUser.primaryDomain)

  return (
    <DashboardWithTour
      user={dbUser}
      firstAction={firstAction}
      firstActionStatus={firstActionStatus}
      quizResult={quizResult}
      submissions={submissionsMap}
      fullSubmissions={submissions}
      feedActivities={feedActivities}
      featureFlags={featureFlags}
    />
  );
}

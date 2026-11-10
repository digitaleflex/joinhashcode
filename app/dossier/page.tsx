import { getSessionSafe } from "@/lib/get-session-safe";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";


import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { UserTopBar } from "@/components/dashboard/user-topbar";
import { DossierView } from "@/components/dossier/dossier-view";
import { UserProfile, DetailedMissionSubmission } from "@/lib/types";
import { getFeatureFlags, isFeatureEnabled } from "@/lib/feature-flags";
import { TourProvider } from "@/components/tour/tour-provider";

interface PageProps {
  searchParams: Promise<{ userId?: string }>
}

export default async function DossierPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await getSessionSafe();

  if (!session) {
    redirect("/signin");
  }

  // Fetch session user first to verify role
  const sessionUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true }
  });

  // Let any authenticated user view another user's profile, set isInspecting for Admins/Mods
  let targetUserId = session.user.id;
  let isInspecting = false;
  let isUnauthorizedDossierAccess = false;

  if (params.userId && params.userId !== session.user.id) {
    targetUserId = params.userId;
    if (sessionUser && ["ADMIN", "MODERATOR"].includes(sessionUser.role)) {
      isInspecting = true;
    } else {
      // User is trying to access another user's private dossier without being Admin/Modo
      isUnauthorizedDossierAccess = true;
    }
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      class: true,
      behavioralVibrancy: true,
      pseudo: true,
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
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { profileType: true, createdAt: true },
      },
      missionSubmissions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          mission: true
        }
      },
      activityLogs: {
        orderBy: { createdAt: 'desc' },
        take: 50
      },
    },
  }) as {
    id: string;
    name: string;
    email: string;
    image: string | null;
    class: string | null;
    behavioralVibrancy: unknown;
    pseudo: string | null;
    role: string;
    language: string;
    memberNumber: number;
    createdAt: Date;
    domains: string[];
    tools: string[];
    badges: string[];
    bio: string | null;
    currentSituation: string | null;
    technicalLevel: string | null;
    mainObjective: string | null;
    country: string | null;
    city: string | null;
    builderScore: number;
    creatorScore: number;
    strategistScore: number;
    catalystScore: number;
    lastCheckinAt: Date | null;
    currentStreak: number;
    level: number;
    experience: number;
    missionsCompletedCount: number;
    referralCode: string | null;
    referralCount: number;
    quizResults: { createdAt: Date }[];
    missionSubmissions: any[];
    activityLogs: { id: string; action: string; createdAt: Date }[];
  };

  if (!dbUser) return null;

  // Security Redirect: If not authorized for full dossier, send to public profile
  if (isUnauthorizedDossierAccess) {
    redirect(`/u/${dbUser.pseudo || dbUser.id}`);
  }

  const user: UserProfile & { missionSubmissions: DetailedMissionSubmission[], activityLogs: Array<{ id: string; action: string; createdAt: Date }> } = {
    ...dbUser,
    bio: dbUser.bio,
    level: dbUser.level ?? 1,
    experience: dbUser.experience ?? 0,
    missionsCompletedCount: dbUser.missionsCompletedCount ?? 0,
    referralCode: dbUser.referralCode ?? null,
    referralCount: dbUser.referralCount ?? 0,
      builderScore: dbUser.builderScore ?? 0,
      creatorScore: dbUser.creatorScore ?? 0,
      strategistScore: dbUser.strategistScore ?? 0,
      catalystScore: dbUser.catalystScore ?? 0,
      lastCheckin: dbUser.lastCheckinAt ?? null,
    currentStreak: dbUser.currentStreak ?? 0,
    j7Activated: false,
    missionSubmissions: dbUser.missionSubmissions as DetailedMissionSubmission[],
    activityLogs: dbUser.activityLogs,
  };

  const quizResult = dbUser.quizResults?.[0] as { profileType?: string | null; createdAt: Date } | undefined;

  const featureFlags = getFeatureFlags();

  return (
    <TourProvider userId={session.user.id} featureFlag={isFeatureEnabled("tour")}>
    <SidebarProvider>
      <AppSidebar user={user} />
      <BottomNav />
      
      <SidebarInset className="bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="scanline opacity-20" />

        <UserTopBar user={user} />
        
        <main className="flex-1 p-3 sm:p-6 md:p-10 pb-40 md:pb-12 overflow-y-auto scrollbar-none relative z-[var(--z-content)]">
          <DossierView 
            user={user}
            quizResult={quizResult}
            isInspecting={isInspecting}
            isPublic={targetUserId !== session.user.id}
            featureFlags={featureFlags}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
    </TourProvider>
  );
}

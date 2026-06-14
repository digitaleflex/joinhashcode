import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { UserTopBar } from "@/components/dashboard/user-topbar";
import { DossierView } from "@/components/dossier/dossier-view";
import { UserProfile, DetailedMissionSubmission } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ userId?: string }>
}

export default async function DossierPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  // Fetch session user first to verify role
  const sessionUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true }
  });

  // Admin / Moderator bypass for public/private portfolio inspection
  let targetUserId = session.user.id;
  let isInspecting = false;

  if (params.userId && params.userId !== session.user.id) {
    if (sessionUser && ["ADMIN", "MODERATOR"].includes(sessionUser.role)) {
      targetUserId = params.userId;
      isInspecting = true;
    }
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: targetUserId },
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
      },
      quizResults: {
        orderBy: { createdAt: 'desc' },
        take: 1
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
      members: {
        include: {
          organization: {
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
                      level: true,
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
  });

  if (!dbUser) return null;

  const user: UserProfile & { missionSubmissions: DetailedMissionSubmission[], activityLogs: any[] } = {
    ...dbUser,
    builderScore: dbUser.psychometrics?.builderScore ?? 0,
    creatorScore: dbUser.psychometrics?.creatorScore ?? 0,
    strategistScore: dbUser.psychometrics?.strategistScore ?? 0,
    catalystScore: dbUser.psychometrics?.catalystScore ?? 0,
    confidenceScore: dbUser.psychometrics?.confidenceScore ?? 0.25,
    lastCheckin: dbUser.stats?.lastCheckinAt ?? null,
    currentStreak: dbUser.stats?.currentStreak ?? 0,
    missionSubmissions: dbUser.missionSubmissions as any,
    activityLogs: dbUser.activityLogs,
  };

  const activeOrg = dbUser.members[0]?.organization ?? null;
  const quizResult = dbUser.quizResults?.[0];

  // Fetch squad activity logs if in a squad
  let squadMembersLogs: any[] = [];
  if (activeOrg) {
    const squadMemberIds = activeOrg.members.map((m) => m.userId);
    squadMembersLogs = await prisma.activityLog.findMany({
      where: {
        userId: { in: squadMemberIds },
        action: {
          in: ["MISSION_SUBMITTED", "MISSION_APPROVED", "SQUAD_CREATED", "SQUAD_JOINED", "LEVEL_UP", "CHECKIN_COMPLETED"],
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            pseudo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  }

  // Neural Loop Logic: Engagement tips based on stats (MOVED TO DossierView)

  return (
    <SidebarProvider>
      <AppSidebar user={user} hasSquad={!!activeOrg} />
      <BottomNav />
      
      <SidebarInset className="bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="scanline opacity-20" />

        <UserTopBar user={user} />
        
        <main className="flex-1 p-3 sm:p-6 md:p-10 pb-40 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <DossierView 
            user={user}
            activeOrg={activeOrg}
            quizResult={quizResult}
            isInspecting={isInspecting}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

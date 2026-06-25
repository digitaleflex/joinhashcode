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
import { getFeatureFlags } from "@/lib/feature-flags";

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
      confidenceScore: true,
      stats: {
        select: {
          lastCheckinAt: true,
          currentStreak: true,
        }
      },
      progress: {
        select: {
          level: true,
          experience: true,
          missionsCompletedCount: true,
        }
      },
      referral: {
        select: {
          referralCode: true,
          referralCount: true,
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
                      progress: { select: { level: true } },
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

  // Security Redirect: If not authorized for full dossier, send to public profile
  if (isUnauthorizedDossierAccess) {
    redirect(`/u/${dbUser.pseudo || dbUser.id}`);
  }

  const user: UserProfile & { missionSubmissions: DetailedMissionSubmission[], activityLogs: Array<{ id: string; action: string; createdAt: Date }> } = {
    ...dbUser,
    level: dbUser.progress?.level ?? 1,
    experience: dbUser.progress?.experience ?? 0,
    missionsCompletedCount: dbUser.progress?.missionsCompletedCount ?? 0,
    referralCode: dbUser.referral?.referralCode ?? null,
    referralCount: dbUser.referral?.referralCount ?? 0,
    builderScore: dbUser.builderScore ?? 0,
    creatorScore: dbUser.creatorScore ?? 0,
    strategistScore: dbUser.strategistScore ?? 0,
    catalystScore: dbUser.catalystScore ?? 0,
    confidenceScore: dbUser.confidenceScore ?? 0.25,
    lastCheckin: dbUser.stats?.lastCheckinAt ?? null,
    currentStreak: dbUser.stats?.currentStreak ?? 0,
    missionSubmissions: dbUser.missionSubmissions as DetailedMissionSubmission[],
    activityLogs: dbUser.activityLogs,
  };

  const activeOrg = dbUser.members[0]?.organization ?? null;
  const quizResult = dbUser.quizResults?.[0];

  // Fetch squad activity logs if in a squad
  let squadMembersLogs: Array<{ id: string; action: string; createdAt: Date; user: { name: string; image: string | null; pseudo: string | null } | null }> = [];
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
      take: 50,
    });
  }

  // Fetch viewer's own organization membership to allow direct invitation
  let viewerSquad = null;
  let hasSentInvitation = false;
  if (session && session.user.id !== targetUserId) {
    const viewerMember = await prisma.member.findFirst({
      where: { userId: session.user.id },
      include: {
        organization: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    class: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (viewerMember && ["owner", "admin"].includes(viewerMember.role)) {
      viewerSquad = {
        id: viewerMember.organization.id,
        name: viewerMember.organization.name,
        role: viewerMember.role,
        members: viewerMember.organization.members.map((m) => ({
          userId: m.userId,
          class: m.user.class
        }))
      };

      // Check if invitation has already been sent to this user
      const existingInvite = await prisma.invitation.findFirst({
        where: {
          organizationId: viewerMember.organizationId,
          email: dbUser.email,
          status: "pending"
        }
      });
      hasSentInvitation = !!existingInvite;
    }
  }

  const featureFlags = getFeatureFlags();

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
            isPublic={targetUserId !== session.user.id}
            viewerSquad={viewerSquad}
            hasSentInvitation={hasSentInvitation}
            featureFlags={featureFlags}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

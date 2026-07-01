import { getSessionSafe } from "@/lib/get-session-safe"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { TalentsClient } from "./talents-client"
import { UserProfile } from "@/lib/types"

export default async function TalentsPage() {
  const session = await getSessionSafe()

  if (!session) {
    redirect("/signin")
  }

  // Fetch session user first to verify and pass to sidebar
  const dbSessionUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      class: true,
      pseudo: true,
      role: true,
      createdAt: true,
      memberNumber: true,
      bio: true,
      tools: true,
      domains: true,
      country: true,
      city: true,
      language: true,
      badges: true,
      builderScore: true,
      creatorScore: true,
      strategistScore: true,
      catalystScore: true,
      confidenceScore: true,
      stats: {
        select: {
          lastCheckinAt: true,
          currentStreak: true,
        },
      },
      progress: {
        select: { level: true, experience: true, missionsCompletedCount: true },
      },
      referral: {
        select: { referralCount: true },
      },
      members: {
        include: {
          organization: true,
        },
      },
    },
  })

  if (!dbSessionUser) return null

  const sessionUser: UserProfile = {
    ...dbSessionUser,
    level: dbSessionUser.progress?.level ?? 1,
    experience: dbSessionUser.progress?.experience ?? 0,
    missionsCompletedCount: dbSessionUser.progress?.missionsCompletedCount ?? 0,
    referralCount: dbSessionUser.referral?.referralCount ?? 0,
    builderScore: dbSessionUser.builderScore ?? 0,
    creatorScore: dbSessionUser.creatorScore ?? 0,
    strategistScore: dbSessionUser.strategistScore ?? 0,
    catalystScore: dbSessionUser.catalystScore ?? 0,
    confidenceScore: dbSessionUser.confidenceScore ?? 0.25,
    lastCheckin: dbSessionUser.stats?.lastCheckinAt ?? null,
    currentStreak: dbSessionUser.stats?.currentStreak ?? 0,
  }

  const activeOrg = dbSessionUser.members[0]?.organization ?? null

  // Fetch viewer's squad membership for invite capabilities
  const viewerMember = await prisma.member.findFirst({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  class: true,
                  tools: true,
                  builderScore: true,
                  creatorScore: true,
                  strategistScore: true,
                  catalystScore: true,
                  progress: { select: { level: true, experience: true } },
                }
              }
            }
          }
        }
      }
    }
  });

  const viewerSquad = viewerMember && ["owner", "admin"].includes(viewerMember.role) ? {
    id: viewerMember.organization.id,
    name: viewerMember.organization.name,
    role: viewerMember.role,
    cohesionScore: viewerMember.organization.cohesionScore,
    memberCount: viewerMember.organization.members.length,
    members: viewerMember.organization.members.map((m) => ({
      userId: m.userId,
      name: m.user.name,
      class: m.user.class,
      tools: m.user.tools ?? [],
      level: m.user.progress?.level ?? 1,
      scores: {
        builderScore: m.user.builderScore,
        creatorScore: m.user.creatorScore,
        strategistScore: m.user.strategistScore,
        catalystScore: m.user.catalystScore,
      }
    }))
  } : null;

  // Fetch all active, non-banned users in the directory
  const talentsRaw = await prisma.user.findMany({
    where: {
      OR: [{ security: null }, { security: { banned: { not: true } } }],
    },
    select: {
      id: true,
      name: true,
      pseudo: true,
      image: true,
      class: true,
      city: true,
      country: true,
      bio: true,
      tools: true,
      builderScore: true,
      creatorScore: true,
      strategistScore: true,
      catalystScore: true,
      progress: { select: { level: true, experience: true } },
      members: { select: { id: true } },
    },
    orderBy: [{ progress: { experience: "desc" } }, { progress: { level: "desc" } }],
  })

  const talents = talentsRaw.map((t) => ({
    ...t,
    tools: t.tools ?? [],
    level: t.progress?.level ?? 1,
    experience: t.progress?.experience ?? 0,
    inSquad: t.members.length > 0,
  }))

  return (
    <SidebarProvider>
      <AppSidebar user={sessionUser} hasSquad={!!activeOrg} />
      <BottomNav />

      <SidebarInset className="bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="scanline opacity-20" />

        <UserTopBar user={sessionUser} />

        <main className="flex-1 p-3 sm:p-6 md:p-10 pb-40 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <TalentsClient talents={talents} viewerSquad={viewerSquad} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

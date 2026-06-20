import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { TalentsClient } from "./talents-client"
import { UserProfile } from "@/lib/types"

export default async function TalentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

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
      psychometrics: {
        select: {
          builderScore: true,
          creatorScore: true,
          strategistScore: true,
          catalystScore: true,
          confidenceScore: true,
        },
      },
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
    builderScore: dbSessionUser.psychometrics?.builderScore ?? 0,
    creatorScore: dbSessionUser.psychometrics?.creatorScore ?? 0,
    strategistScore: dbSessionUser.psychometrics?.strategistScore ?? 0,
    catalystScore: dbSessionUser.psychometrics?.catalystScore ?? 0,
    confidenceScore: dbSessionUser.psychometrics?.confidenceScore ?? 0.25,
    lastCheckin: dbSessionUser.stats?.lastCheckinAt ?? null,
    currentStreak: dbSessionUser.stats?.currentStreak ?? 0,
  }

  const activeOrg = dbSessionUser.members[0]?.organization ?? null

  // Fetch all active, non-banned users in the directory
  const talentsRaw = await prisma.user.findMany({
    where: {
      security: { banned: { not: true } },
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
      psychometrics: {
        select: {
          builderScore: true,
          creatorScore: true,
          strategistScore: true,
          catalystScore: true,
        },
      },
      progress: { select: { level: true, experience: true } },
    },
    orderBy: [{ progress: { experience: "desc" } }, { progress: { level: "desc" } }],
  })

  const talents = talentsRaw.map((t) => ({
    ...t,
    level: t.progress?.level ?? 1,
    experience: t.progress?.experience ?? 0,
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
          <TalentsClient talents={talents} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

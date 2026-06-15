import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { GuideClient } from "./guide-client"
import { UserProfile } from "@/lib/types"

export default async function GuidePage() {
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
      level: true,
      experience: true,
      class: true,
      missionsCompletedCount: true,
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
      referralCount: true,
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
    builderScore: dbSessionUser.psychometrics?.builderScore ?? 0,
    creatorScore: dbSessionUser.psychometrics?.creatorScore ?? 0,
    strategistScore: dbSessionUser.psychometrics?.strategistScore ?? 0,
    catalystScore: dbSessionUser.psychometrics?.catalystScore ?? 0,
    confidenceScore: dbSessionUser.psychometrics?.confidenceScore ?? 0.25,
    lastCheckin: dbSessionUser.stats?.lastCheckinAt ?? null,
    currentStreak: dbSessionUser.stats?.currentStreak ?? 0,
  }

  const activeOrg = dbSessionUser.members[0]?.organization ?? null

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
          <GuideClient />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

import { getSessionSafe } from "@/lib/get-session-safe"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { GuideClient } from "@/app/guide/guide-client"
import { UserProfile } from "@/lib/types"

export default async function GuidePage() {
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
      profile: { select: { bio: true } },
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
      lastCheckinAt: true,
      currentStreak: true,
      level: true,
      experience: true,
      missionsCompletedCount: true,
      referralCount: true,
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
    bio: dbSessionUser.profile?.bio,
    level: dbSessionUser.level ?? 1,
    experience: dbSessionUser.experience ?? 0,
    missionsCompletedCount: dbSessionUser.missionsCompletedCount ?? 0,
    referralCount: dbSessionUser.referralCount ?? 0,
    builderScore: dbSessionUser.builderScore ?? 0,
    creatorScore: dbSessionUser.creatorScore ?? 0,
    strategistScore: dbSessionUser.strategistScore ?? 0,
    catalystScore: dbSessionUser.catalystScore ?? 0,
    lastCheckin: dbSessionUser.lastCheckinAt ?? null,
    currentStreak: dbSessionUser.currentStreak ?? 0,
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

        <main className="flex-1 p-3 sm:p-6 md:p-10 pb-40 md:pb-12 overflow-y-auto scrollbar-none relative z-[var(--z-content)]">
          <GuideClient />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

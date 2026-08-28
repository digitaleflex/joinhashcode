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
    id: dbSessionUser.id,
    name: dbSessionUser.name,
    pseudo: dbSessionUser.pseudo,
    email: dbSessionUser.email,
    image: dbSessionUser.image,
    role: dbSessionUser.role,
    country: dbSessionUser.country ?? null,
    city: dbSessionUser.city ?? null,
    language: dbSessionUser.language,
    currentSituation: null,
    technicalLevel: null,
    domains: dbSessionUser.domains ?? [],
    tools: dbSessionUser.tools ?? [],
    githubUrl: null,
    portfolioUrl: null,
    linkedinUrl: null,
    twitterUrl: null,
    mainObjective: null,
    primaryDomain: null,
    subDomain: null,
    learningTools: [],
    practiceMode: null,
    certifications: [],
    specializationAt: null,
    class: dbSessionUser.class,
    experience: dbSessionUser.experience ?? 0,
    level: dbSessionUser.level ?? 1,
    missionsCompletedCount: dbSessionUser.missionsCompletedCount ?? 0,
    builderScore: dbSessionUser.builderScore ?? 0,
    creatorScore: dbSessionUser.creatorScore ?? 0,
    strategistScore: dbSessionUser.strategistScore ?? 0,
    catalystScore: dbSessionUser.catalystScore ?? 0,
    j7Activated: false,
    behavioralVibrancy: null,
    lastCheckin: dbSessionUser.lastCheckinAt ?? null,
    currentStreak: dbSessionUser.currentStreak ?? 0,
    memberNumber: dbSessionUser.memberNumber ?? 0,
    createdAt: dbSessionUser.createdAt,
    referralCode: null,
    referralCount: dbSessionUser.referralCount ?? 0,
    betaKeyId: null,
    twoFactorEnabled: false,
    badges: dbSessionUser.badges ?? [],
    bio: dbSessionUser.bio ?? null,
    secondaryObjectives: [],
    currentFocus: [],
    dreamStatement: null,
    mainBlocker: null,
    members: dbSessionUser.members as unknown as UserProfile['members'],
    quizResults: [],
  };

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

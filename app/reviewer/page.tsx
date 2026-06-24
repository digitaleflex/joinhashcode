import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { isEligibleReviewer, LEVEL_REQUIREMENT } from "@/lib/acceptance-criteria"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { ReviewerQueue, type Submission } from "./reviewer-queue"

export default async function ReviewerPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/signin")

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      pseudo: true,
      image: true,
      role: true,
      class: true,
      badges: true,
      currentSituation: true,
      progress: { select: { level: true, experience: true, missionsCompletedCount: true } },
      stats: { select: { currentStreak: true, lastCheckinAt: true } },
      members: { select: { organization: { select: { id: true, name: true, slug: true } } } },
    },
  })
  if (!dbUser) redirect("/signin")

  const activeOrg = dbUser.members[0]?.organization ?? null

  const sessionUser = {
    id: dbUser.id,
    name: dbUser.name,
    pseudo: dbUser.pseudo,
    image: dbUser.image,
    role: dbUser.role,
    class: dbUser.class,
    level: dbUser.progress?.level ?? 1,
    experience: dbUser.progress?.experience ?? 0,
    missionsCompletedCount: dbUser.progress?.missionsCompletedCount ?? 0,
    badges: dbUser.badges,
    currentSituation: dbUser.currentSituation,
    lastCheckin: dbUser.stats?.lastCheckinAt ?? null,
    currentStreak: dbUser.stats?.currentStreak ?? 0,
  }

  const pendingSubmissions = await prisma.missionSubmission.findMany({
    where: { status: "PENDING" },
    include: {
      mission: { select: { id: true, title: true, category: true, xp: true, missionLevel: true, targetProfiles: true } },
      user: { select: { id: true, name: true, pseudo: true, image: true, progress: { select: { level: true } } } },
    },
    orderBy: { createdAt: "asc" },
  })

  const eligible: Submission[] = pendingSubmissions
    .filter((sub) => {
      const missionRequiredLevel = LEVEL_REQUIREMENT[sub.mission.missionLevel ?? "INIT"] ?? 1
      return isEligibleReviewer({
        reviewerClass: dbUser.class,
        reviewerLevel: dbUser.progress?.level ?? 1,
        reviewerMissionsCompleted: dbUser.progress?.missionsCompletedCount ?? 0,
        reviewerId: dbUser.id,
        submissionUserId: sub.userId,
        missionTargetProfiles: sub.mission.targetProfiles,
        missionRequiredLevel,
      })
    })
    .map((sub) => ({
      id: sub.id,
      mission: sub.mission,
      user: sub.user,
      createdAt: sub.createdAt.toISOString(),
    }))

  return (
    <SidebarProvider>
      <AppSidebar user={sessionUser} hasSquad={!!activeOrg} />
      <BottomNav />
      <SidebarInset className="bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="scanline opacity-20" />
        <UserTopBar user={sessionUser} />
        <main className="flex-1 p-3 sm:p-6 md:p-10 pb-40 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <ReviewerQueue submissions={eligible} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

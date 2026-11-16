import { getSessionSafe } from "@/lib/get-session-safe"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getClaimDecision } from "@/lib/review-access"
import { getReviewCriteria } from "@/lib/acceptance-criteria"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { ReviewClient } from "./review-client"

interface PageProps {
  params: Promise<{ submissionId: string }>
}

export default async function ReviewerSubmissionPage({ params }: PageProps) {
  const { submissionId } = await params

  const session = await getSessionSafe()
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
      level: true,
      experience: true,
      missionsCompletedCount: true,
      currentStreak: true,
      lastCheckinAt: true,
    },
  })
  if (!dbUser) redirect("/signin")

  const submission = await prisma.missionSubmission.findUnique({
    where: { id: submissionId },
    include: {
      mission: true,
      user: { select: { id: true, name: true, pseudo: true, image: true, level: true } },
      artifacts: true,
      reviews: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  })

  if (!submission) notFound()

  const decision = getClaimDecision({ reviewer: dbUser, submission })
  // Allow viewing even if not claimable (already reviewed, etc.) — claim button handled client-side
  const canClaim = decision.ok

  const sessionUser = {
    id: dbUser.id,
    name: dbUser.name,
    pseudo: dbUser.pseudo,
    image: dbUser.image,
    role: dbUser.role,
    class: dbUser.class,
    level: dbUser.level ?? 1,
    experience: dbUser.experience ?? 0,
    missionsCompletedCount: dbUser.missionsCompletedCount ?? 0,
    badges: dbUser.badges,
    currentSituation: dbUser.currentSituation,
    lastCheckin: dbUser.lastCheckinAt ?? null,
    currentStreak: dbUser.currentStreak ?? 0,
  }

  const criteria = getReviewCriteria(submission.mission)

  return (
    <SidebarProvider>
      <AppSidebar user={sessionUser} />
      <BottomNav />
      <SidebarInset className="bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="scanline opacity-20" />
        <UserTopBar user={sessionUser} />
        <main className="flex-1 p-3 sm:p-6 md:p-10 pb-40 md:pb-12 overflow-y-auto scrollbar-none relative z-[var(--z-content)]">
          <ReviewClient
            submission={submission as any}
            criteria={criteria}
            canClaim={canClaim}
            reviewerId={dbUser.id}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
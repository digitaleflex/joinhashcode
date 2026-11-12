import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getSessionSafe } from "@/lib/get-session-safe"
import { prisma } from "@/lib/prisma"
import { getReviewCriteria } from "@/lib/acceptance-criteria"
import { getClaimDecision } from "@/lib/review-access"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { ClaimButton } from "@/components/reviewer/claim-button"
import { ReviewForm } from "@/components/reviewer/review-form"
import { SubmissionDetails } from "@/components/reviewer/submission-details"

export const dynamic = "force-dynamic"

export default async function ReviewSubmissionPage({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await params

  const session = await getSessionSafe()
  if (!session) redirect("/signin")

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, pseudo: true, image: true, role: true, missionsCompletedCount: true },
  })
  if (!me) redirect("/signin")

  const submission = await prisma.missionSubmission.findUnique({
    where: { id: submissionId },
    include: {
      mission: {
        select: {
          title: true,
          description: true,
          category: true,
          missionLevel: true,
          deliverables: true,
          acceptanceCriteria: true,
        },
      },
      // Jamais d'email : le relecteur ne voit que le pseudo (ou le prénom).
      user: { select: { pseudo: true, name: true } },
      artifacts: {
        orderBy: { createdAt: "asc" },
        select: { key: true, type: true, label: true, value: true, fileUrl: true, fileName: true },
      },
    },
  })
  if (!submission) notFound()

  // On ne relit jamais sa propre soumission.
  if (submission.userId === me.id) redirect("/reviewer")

  const isAssigned = submission.reviewerId === me.id && submission.status === "IN_REVIEW"
  const decision = getClaimDecision({ reviewer: me, submission })
  const canSeeContent = isAssigned || decision.ok

  const unavailableMessage = isAssigned
    ? null
    : decision.ok
      ? null
      : submission.status === "PENDING"
        ? decision.message
        : "Cette soumission n'est plus disponible pour toi."

  const submitterName = submission.user.pseudo ? `@${submission.user.pseudo}` : (submission.user.name.split(" ")[0] ?? "un membre")

  return (
    <SidebarProvider>
      <AppSidebar user={me} />
      <BottomNav />
      <SidebarInset className="bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <UserTopBar user={me} />
        <main className="flex-1 p-3 sm:p-6 md:p-10 pb-40 md:pb-12 overflow-y-auto scrollbar-none relative z-[var(--z-content)]">
          <div className="mx-auto max-w-3xl space-y-8">
            <Link href="/reviewer" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-primary">
              <ArrowLeft className="size-3" aria-hidden /> File d&apos;évaluation
            </Link>

            {canSeeContent ? (
              <>
                <SubmissionDetails
                  submitterName={submitterName}
                  mission={{
                    title: submission.mission.title,
                    description: submission.mission.description,
                    category: submission.mission.category,
                    deliverables: submission.mission.deliverables,
                  }}
                  content={submission.content}
                  projectDescription={submission.projectDescription}
                  artifacts={submission.artifacts}
                />
                {isAssigned ? (
                  <ReviewForm submissionId={submission.id} criteria={getReviewCriteria(submission.mission)} />
                ) : (
                  <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="text-sm text-zinc-300">
                      Prends cette soumission en charge pour la relire. Tu seras le seul relecteur assigné.
                    </p>
                    <ClaimButton submissionId={submission.id} />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="text-sm text-zinc-300">{unavailableMessage}</p>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

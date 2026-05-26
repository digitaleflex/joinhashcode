import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import {
  ChevronLeft, CheckCircle2, Award, Shield, Rocket,
  Clock, Layers, GitBranch, Lock, Info
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { MissionSubmissionForm } from "./mission-submission-form"
import { MissionBriefing } from "@/components/missions/mission-briefing"
import { SubmissionTimeline } from "@/components/missions/submission-timeline"

export default async function MissionBriefingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) redirect("/signin")

  const [dbUser, mission] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        missionSubmissions: {
          where: { missionId: id },
          include: {
            reviewer: {
              select: {
                id: true,
                pseudo: true,
                image: true,
              }
            }
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.mission.findUnique({ where: { id } }),
  ])

  if (!dbUser) redirect("/signin")
  if (!mission) notFound()

  const submission = dbUser.missionSubmissions[0]
  const isCompleted = submission?.status === "APPROVED"
  const isPending = submission?.status === "PENDING"
  const isNeedsRevision = submission?.status === "NEEDS_REVISION"
  const isInReview = submission?.status === "IN_REVIEW"

  const briefingContent = mission.fullBriefing || mission.description

  const methodIcon = {
    GITHUB_LINK: <GitBranch className="w-3.5 h-3.5" />,
    LIVE_URL: <Rocket className="w-3.5 h-3.5" />,
    TEXT_RESPONSE: <Layers className="w-3.5 h-3.5" />,
  }[mission.submissionMethod] ?? <Layers className="w-3.5 h-3.5" />

  return (
    <SidebarProvider>
      <AppSidebar user={dbUser} />
      <BottomNav />

      <SidebarInset className="bg-background">
        <UserTopBar user={dbUser} />

        <main className="flex-1 overflow-y-auto pb-(--bottom-nav-height) md:pb-0">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">

            {/* Back */}
            <Link
              href="/missions"
              className="inline-flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors mb-10 group"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              RETOUR AUX MISSIONS
            </Link>

            {/* ── Hero Header ── */}
            <div className="relative mb-10 pb-10 border-b border-border/40">
              {/* Mission ID watermark */}
              <span className="absolute top-0 right-0 text-[80px] md:text-[120px] font-black font-mono text-primary/[0.04] leading-none select-none pointer-events-none uppercase tracking-tighter">
                {mission.category.slice(0, 3)}
              </span>

              <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-8">
                {/* Left: title + badges */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-primary/50 uppercase">
                      MISSION // {id.toUpperCase().replace(/-/g, "_")}
                    </span>
                  </div>

                  <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-[1.1]">
                    {mission.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge className="bg-primary/10 text-primary border-primary/20 uppercase font-mono tracking-wider text-[10px] rounded-md px-2 py-0.5">
                      {mission.category}
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground border-border/60 font-mono text-[10px] rounded-md px-2 py-0.5">
                      NIV. {mission.difficulty}
                    </Badge>
                    {isCompleted && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-mono text-[10px] rounded-md px-2 py-0.5">
                        ✓ VALIDÉE
                      </Badge>
                    )}
                    {isPending && (
                      <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-mono text-[10px] rounded-md px-2 py-0.5">
                        ● EN REVUE
                      </Badge>
                    )}
                    {isNeedsRevision && (
                      <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-mono text-[10px] rounded-md px-2 py-0.5">
                        ↻ RÉVISION REQUISE
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Right: XP reward */}
                <div className="shrink-0 flex flex-col items-end justify-start">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
                    Récompense
                  </div>
                  <div className="text-6xl md:text-7xl font-black font-mono text-primary leading-none">
                    +{mission.xp}
                  </div>
                  <div className="text-xs font-mono text-primary/60 uppercase mt-1">
                    XP
                  </div>
                </div>
              </div>

              {/* Meta strip */}
              <div className="relative flex flex-wrap gap-6 mt-8">
                {mission.duration && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <Clock className="w-3.5 h-3.5 text-primary/40" />
                    <span className="uppercase tracking-wider text-[10px]">Durée</span>
                    <span className="text-zinc-300">{mission.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  {methodIcon}
                  <span className="uppercase tracking-wider text-[10px]">Méthode</span>
                  <span className="text-zinc-300">{mission.submissionMethod.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Layers className="w-3.5 h-3.5 text-primary/40" />
                  <span className="uppercase tracking-wider text-[10px]">Livrables</span>
                  <span className="text-zinc-300">{mission.deliverables.length} élément{mission.deliverables.length > 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">

              {/* ── Left Column ── */}
              <div className="space-y-12">

                {/* 01 — Briefing */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-mono text-primary/40">01</span>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <h2 className="text-xs font-mono uppercase text-primary">Briefing</h2>
                    </div>
                    <div className="flex-1 h-px bg-border/30" />
                  </div>

                  <div className="pl-8">
                    <MissionBriefing content={briefingContent} />
                  </div>
                </section>

                {/* 02 — Livrables */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-mono text-primary/40">02</span>
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-primary" />
                      <h2 className="text-xs font-mono uppercase text-primary">Livrables attendus</h2>
                    </div>
                    <div className="flex-1 h-px bg-border/30" />
                  </div>

                  <div className="pl-8 space-y-3">
                    {mission.deliverables.map((deliverable, index) => (
                      <div
                        key={index}
                        className="group flex items-start gap-4 p-4 rounded-xl border border-border/30 bg-card/20 hover:border-primary/25 hover:bg-primary/[0.03] transition-all duration-200"
                      >
                        <div className="shrink-0 w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-zinc-300 leading-relaxed">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* GitHub note */}
                <div className="pl-8">
                  <div className="flex gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                    <Info className="w-4 h-4 text-blue-400/70 shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Si ton dépôt GitHub est privé, invite le compte{" "}
                      <span className="font-mono text-blue-400">joinhashcode</span>{" "}
                      comme collaborateur afin que nous puissions valider ton travail.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Right Column ── */}
              <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">

                {/* Submission / Status card */}
                <div className="rounded-2xl border border-border/40 bg-card/30 overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-mono uppercase text-muted-foreground">
                        Statut de la mission
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    {isCompleted ? (
                      <div className="flex flex-col items-center text-center py-8 gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-emerald-400 font-mono text-sm uppercase tracking-wide">Mission validée</h3>
                          {submission?.qualityLevel && submission.qualityLevel !== "STANDARD" && (
                            <p className="text-xs text-emerald-400/60 mt-1 font-mono">
                              {submission.qualityLevel === "EXEMPLARY" ? "⭐ Travail exemplaire" : "✦ Très bon travail"}
                              {" · "}+{submission.xpAwarded} XP
                            </p>
                          )}
                        </div>
                      </div>
                    ) : isInReview ? (
                      <div className="flex flex-col items-center text-center py-8 gap-4">
                        <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                          <Rocket className="w-7 h-7 text-blue-400 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-bold text-blue-400 font-mono text-sm uppercase tracking-wide">En cours de revue</h3>
                          <p className="text-xs text-zinc-500 mt-2">Un reviewer analyse ta soumission.</p>
                        </div>
                      </div>
                    ) : isPending ? (
                      <div className="flex flex-col items-center text-center py-8 gap-4">
                        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                          <Rocket className="w-7 h-7 text-amber-400 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-bold text-amber-400 font-mono text-sm uppercase tracking-wide">En attente de revue</h3>
                          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Nos opérateurs analysent ta transmission.</p>
                        </div>
                      </div>
                    ) : (
                      <MissionSubmissionForm
                        missionId={mission.id}
                        submissionMethod={mission.submissionMethod}
                        revisionNotes={isNeedsRevision ? (submission?.revisionNotes ?? null) : null}
                        reviewerFeedback={isNeedsRevision ? (submission?.adminFeedback ?? null) : null}
                        revisionCount={submission?.revisionCount ?? 0}
                      />
                    )}
                  </div>
                </div>

                {submission && submission.status !== "APPROVED" && (
                  <div className="mt-6 p-5 bg-zinc-950/40 border border-white/5 rounded-[1.5rem]">
                    <SubmissionTimeline submission={submission as any} />
                  </div>
                )}

                {/* Requirements card */}
                {mission.requirements.length > 0 && (
                  <div className="rounded-2xl border border-border/40 bg-card/20 overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/30">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-muted-foreground/60" />
                        <span className="text-[10px] font-mono uppercase text-muted-foreground">
                          Pré-requis
                        </span>
                      </div>
                    </div>
                    <ul className="p-5 space-y-3">
                      {mission.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs text-zinc-400 leading-relaxed">
                          <span className="text-primary/40 font-mono mt-0.5">—</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

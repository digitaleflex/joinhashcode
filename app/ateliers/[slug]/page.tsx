import { notFound, redirect } from "next/navigation"
import { GraduationCap, Clock, Zap, Target, ArrowLeft, ChevronRight, CheckCircle2, BookOpen, Video } from "lucide-react"
import Link from "next/link"
import { getSessionSafe } from "@/lib/get-session-safe"
import { prisma } from "@/lib/prisma"
import { getAtelier } from "@/lib/ateliers"
import { MISSIONS } from "@/lib/missions"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { AtelierActions } from "@/components/ateliers/atelier-actions"

const PROFILE_COLORS: Record<string, string> = {
  builder: "#B8FF3B",
  creator: "#A855F7",
  strategist: "#22D3EE",
  catalyst: "#F97316",
}
const PROFILE_LABELS: Record<string, string> = {
  builder: "Builder",
  creator: "Créateur",
  strategist: "Stratège",
  catalyst: "Catalyst",
}

export default async function AtelierDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSessionSafe()
  if (!session) redirect("/signin")

  const [user, userSquad] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, pseudo: true, class: true, role: true, progress: { select: { level: true, experience: true } } },
    }),
    prisma.member.findFirst({ where: { userId: session.user.id }, select: { id: true } }),
  ])
  if (!user) redirect("/signin")

  const atelier = getAtelier(slug)
  if (!atelier) notFound()

  const [dbMissions, atelierProgress] = await Promise.all([
    prisma.mission.findMany({
      where: { slug: { in: atelier.missionSlugs } },
      select: { id: true, slug: true, title: true, xp: true, shortDesc: true, difficulty: true },
    }),
    prisma.atelierProgress.findUnique({
      where: { userId_atelierSlug: { userId: session.user.id, atelierSlug: slug } },
    }),
  ])
  const staticMissions = MISSIONS.filter((m) => atelier.missionSlugs.includes(m.id))

  const missions = dbMissions.map((m) => {
    const staticMatch = staticMissions.find((s) => s.id === m.slug)
    return {
      id: m.id,
      slug: m.slug,
      title: m.title,
      xp: m.xp,
      shortDesc: m.shortDesc || staticMatch?.shortDesc || "",
      difficulty: m.difficulty,
    }
  })

  const color = PROFILE_COLORS[atelier.profile] || "#c5f441"
  const profileLabel = PROFILE_LABELS[atelier.profile] || atelier.profile
  const progressStatus = atelierProgress?.status ?? "NOT_STARTED"

  return (
    <SidebarProvider>
      <AppSidebar user={user} hasSquad={!!userSquad} />
      <SidebarInset>
        <UserTopBar user={user} />
        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12">
          <div className="max-w-4xl mx-auto">
            <Link href="/ateliers" className="inline-flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors mb-8 group">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              TOUS LES ATELIERS
            </Link>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <GraduationCap className="w-5 h-5" style={{ color }} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>
                    Guild {profileLabel}
                  </span>
                  {progressStatus === "COMPLETED" && (
                    <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Terminé</span>
                  )}
                  {progressStatus === "IN_PROGRESS" && (
                    <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">En cours</span>
                  )}
                </div>

                <h1 className="text-2xl md:text-4xl font-black text-white mb-4">{atelier.title}</h1>
                <p className="text-sm text-zinc-400 leading-relaxed mb-8">{atelier.description}</p>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-mono text-zinc-400">{atelier.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <Zap className="w-3.5 h-3.5" style={{ color }} />
                    <span className="text-xs font-mono" style={{ color }}>+{atelier.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <Target className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-mono text-zinc-400">{atelier.specializationLabel}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-8">
                  <p className="text-xs text-zinc-500 italic leading-relaxed">
                    &ldquo;{atelier.pourquoi}&rdquo;
                  </p>
                </div>

                {/* Resources */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  <a
                    href={atelier.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.03] transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white group-hover:text-primary transition-colors truncate">Vidéo de l&apos;atelier</p>
                      <p className="text-[10px] font-mono text-zinc-600 truncate">Regarder le tutoriel</p>
                    </div>
                  </a>
                  <a
                    href={atelier.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.03] transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white group-hover:text-primary transition-colors truncate">{atelier.mediaLabel}</p>
                      <p className="text-[10px] font-mono text-zinc-600 truncate">Documentation & outils</p>
                    </div>
                  </a>
                </div>

                {/* Progress actions */}
                <AtelierActions atelierSlug={slug} initialStatus={progressStatus} xpReward={atelier.xpReward} />
              </div>
            </div>

            {missions.length > 0 ? (
              <section className="mt-10">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-mono uppercase text-primary tracking-wider">Missions associées</h2>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                <div className="space-y-3">
                  {missions.map((mission) => (
                    <Link
                      key={mission.id}
                      href={`/missions/${mission.slug || mission.id}`}
                      className="group flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.03] transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-zinc-700 group-hover:text-primary transition-colors shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-primary transition-colors truncate">{mission.title}</p>
                          {mission.shortDesc && (
                            <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{mission.shortDesc}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span className="text-xs font-mono" style={{ color }}>+{mission.xp} XP</span>
                        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <Link
                    href={`/missions/${missions[0]?.slug || atelier.missionSlugs[0]}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black transition-all hover:-translate-y-0.5"
                    style={{ background: color }}
                  >
                    Commencer la mission associée
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            ) : (
              <div className="mt-10 p-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] text-center">
                <p className="text-sm text-zinc-500">Les missions pour cet atelier arrivent bientôt.</p>
                <Link
                  href="/ateliers"
                  className="inline-flex items-center gap-2 mt-3 text-xs font-mono text-primary hover:text-primary/80 transition-colors"
                >
                  ← Explorer d'autres ateliers
                </Link>
              </div>
            )}
          </div>
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}

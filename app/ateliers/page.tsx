import { GraduationCap, Clock, Zap, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getSessionSafe } from "@/lib/get-session-safe"
import { redirect } from "next/navigation"
import { getAllAteliers } from "@/lib/ateliers"
import { prisma } from "@/lib/prisma"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"

const PROFILE_ORDER = ["builder", "creator", "strategist", "catalyst"] as const
const PROFILE_LABELS: Record<string, string> = {
  builder: "Builder",
  creator: "Créateur",
  strategist: "Stratège",
  catalyst: "Catalyst",
}
const PROFILE_COLORS: Record<string, string> = {
  builder: "text-[#B8FF3B] border-[#B8FF3B]/30 bg-[#B8FF3B]/5",
  creator: "text-[#A855F7] border-[#A855F7]/30 bg-[#A855F7]/5",
  strategist: "text-[#22D3EE] border-[#22D3EE]/30 bg-[#22D3EE]/5",
  catalyst: "text-[#F97316] border-[#F97316]/30 bg-[#F97316]/5",
}

export default async function AteliersPage() {
  const session = await getSessionSafe()
  if (!session) redirect("/signin")

  const [user, userSquad] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, pseudo: true, class: true, role: true, level: true, experience: true },
    }),
    prisma.member.findFirst({ where: { userId: session.user.id }, select: { id: true } }),
  ])
  if (!user) redirect("/signin")

  const allAteliers = getAllAteliers()
  const userClass = user?.class?.toLowerCase() || ""

  return (
    <SidebarProvider>
      <AppSidebar user={user} hasSquad={!!userSquad} />
      <SidebarInset>
        <UserTopBar user={user} />
        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12">
          <div className="max-w-6xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors mb-8 group">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              RETOUR AU TABLEAU DE BORD
            </Link>

            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Ateliers</h1>
                <p className="text-sm text-zinc-400 mt-1">{allAteliers.length} ateliers disponibles pour démarrer ta spécialisation</p>
              </div>
            </div>

            {PROFILE_ORDER.map((profile) => {
              const profileAteliers = allAteliers.filter((a) => a.profile === profile)
              if (profileAteliers.length === 0) return null
              const isUserProfile = profile === userClass
              const colorClasses = PROFILE_COLORS[profile]

              return (
                <section key={profile} className="mb-12">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-wider mb-5 ${colorClasses} ${isUserProfile ? "ring-1 ring-[var(--color)]/30" : ""}`}>
                    {isUserProfile && <Zap className="w-3 h-3" />}
                    Guild {PROFILE_LABELS[profile]} {isUserProfile ? "· Ton profil" : ""}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profileAteliers.map((atelier) => (
                      <Link
                        key={atelier.slug}
                        href={`/ateliers/${atelier.slug}`}
                        className="group block p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.03] transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{atelier.title}</h3>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-4">{atelier.description}</p>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{atelier.duration}</span>
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3" />+{atelier.xpReward} XP</span>
                          <span className="ml-auto text-zinc-700">{atelier.specializationLabel}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })}

            {allAteliers.length === 0 && (
              <div className="text-center py-20">
                <GraduationCap className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">Aucun atelier disponible pour le moment.</p>
              </div>
            )}
          </div>
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}

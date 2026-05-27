import { Zap, ChevronLeft, TrendingUp } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"
import { MISSIONS, getCurrentWeeklyChallenge } from "@/lib/missions"
import { MissionsList } from "@/components/missions/missions-list"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { WeeklyChallengeBanner } from "@/components/missions/weekly-challenge-banner"

const getMissionsEnrichment = unstable_cache(
  async () => {
    const [completionsRaw, ratingsRaw] = await Promise.all([
      prisma.missionSubmission.groupBy({
        by: ["missionId"],
        where: { status: "APPROVED" },
        _count: { _all: true },
      }),
      prisma.missionSubmission.groupBy({
        by: ["missionId"],
        where: { status: "APPROVED", userRating: { not: null } },
        _avg: { userRating: true },
        _count: { userRating: true },
      }),
    ])
    return {
      completionsMap: Object.fromEntries(completionsRaw.map(c => [c.missionId, c._count._all])),
      ratingsMap: Object.fromEntries(ratingsRaw.map(r => [r.missionId, { avg: r._avg.userRating, count: r._count.userRating }])),
    }
  },
  ["missions-enrichment"],
  { revalidate: 300 }
)

function daysUntilMonday(): number {
  const today = new Date()
  const day = today.getDay() // 0=dim, 1=lun, ...
  return day === 0 ? 1 : 8 - day
}

function getWeekStart(): Date {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

export default async function MissionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  const finalDbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      level: true,
      experience: true,
      class: true,
      role: true,
      missionSubmissions: {
        select: {
          missionId: true,
          status: true,
        }
      }
    }
  });

  if (!finalDbUser) {
    redirect("/signin");
  }

  // Convert array to Record<missionId, status>
  const submissionsMap: Record<string, string> = {};
  finalDbUser.missionSubmissions.forEach(sub => {
    submissionsMap[sub.missionId] = sub.status;
  });

  // --- WEEKLY CHALLENGE LOGIC (Roadmap P9) ---
  const currentWeeklyChallenge = getCurrentWeeklyChallenge();
  const weeklyMission = await prisma.mission.findUnique({
    where: { slug: currentWeeklyChallenge.id }
  });

  const weekStart = getWeekStart();
  const weeklySubmission = weeklyMission ? await prisma.missionSubmission.findFirst({
    where: {
      userId: session.user.id,
      missionId: weeklyMission.id,
      createdAt: { gte: weekStart },
    }
  }) : null;
  // --- END WEEKLY ---

  // --- START ENRICHMENT (Roadmap P5) ---
  // Cached for 5 min — this data is shared across all users
  const { completionsMap, ratingsMap } = await getMissionsEnrichment()

  // Enrich MISSIONS
  const enrichedMissions = MISSIONS.map(m => ({
    ...m,
    completionsCount: completionsMap[m.id] || 0,
    avgRating: ratingsMap[m.id]?.avg || null,
    ratingsCount: ratingsMap[m.id]?.count || 0,
  }));
  // --- END ENRICHMENT ---

  return (
    <SidebarProvider>
      <AppSidebar user={finalDbUser} />
      <BottomNav />
      
      <SidebarInset className="bg-background relative overflow-hidden">
        {/* Reinforced Background Effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="scanline opacity-20" />
        
        <UserTopBar user={finalDbUser} />
        
        <main className="flex-1 p-4 md:p-10 pb-(--bottom-nav-height) md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <div className="max-w-6xl mx-auto space-y-10">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-muted-foreground hover:text-primary transition-all mb-4 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              RETOUR_AU_TERMINAL
            </Link>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="size-3.5 text-primary animate-pulse" />
                <span className="text-[10px] font-mono font-black uppercase text-primary">Centre de Commandement</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                Arsenal des <span className="text-primary">Missions</span>
              </h1>
              <p className="text-zinc-500 max-w-2xl font-light text-sm md:base leading-relaxed">
                Chaque objectif rempli renforce ton signal et ton autorité dans l&apos;écosystème HASHCODE.
              </p>
            </div>

            {weeklyMission && (
              <div className="max-w-3xl">
                <WeeklyChallengeBanner 
                  mission={weeklyMission} 
                  isCompleted={!!weeklySubmission && weeklySubmission.status === "APPROVED"} 
                  daysLeft={daysUntilMonday()} 
                />
              </div>
            )}
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-8 rounded-4xl glass-card border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp className="size-12 text-primary" />
                </div>
                <div className="flex justify-between items-end mb-6">
                   <div className="space-y-1">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">Données_D_Évolution</div>
                      <div className="text-sm font-bold text-white uppercase tracking-tight">Expérience Globale Accumulée</div>
                   </div>
                   <div className="text-4xl font-black text-primary font-mono italic">{finalDbUser.experience} <span className="text-xs not-italic text-zinc-600">XP</span></div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-primary shadow-[0_0_20px_#C5F441] transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (finalDbUser.experience % 1000) / 10)}%` }}
                    />
                </div>
                <div className="text-[10px] text-zinc-500 mt-4 font-mono uppercase tracking-wider flex items-center gap-2">
                   <span className="size-1 rounded-full bg-primary animate-pulse" />
                   Status: Synchronisation de ton habilitation niveau {finalDbUser.level} en cours...
                </div>
              </div>
              
              <div className="hidden md:flex p-8 rounded-4xl border border-dashed border-white/5 bg-white/1 items-center justify-center text-center">
                 <p className="text-[9px] font-mono text-zinc-700 uppercase leading-relaxed">
                   [ Accès_Prioritaire ]<br/>
                   Prêt pour le déploiement<br/>
                   tactique_v2.0
                 </p>
              </div>
            </div>

            <MissionsList 
              userLevel={finalDbUser.level} 
              userXp={finalDbUser.experience} 
              submissions={submissionsMap} 
              userClass={finalDbUser.class}
              missions={enrichedMissions}
            />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

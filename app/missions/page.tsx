import { Zap, ChevronLeft, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getSessionSafe } from "@/lib/get-session-safe"
import { redirect } from "next/navigation"
import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"
import { MISSIONS, getCurrentWeeklyChallenge } from "@/lib/missions"
import { getFeatureFlags, isFeatureEnabled } from "@/lib/feature-flags"
import { daysUntilMonday, getWeekStart } from "@/lib/dates"
import { MissionsList } from "@/components/missions/missions-list"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { WeeklyChallengeBanner } from "@/components/missions/weekly-challenge-banner"
import { Prisma } from "@/generated/prisma/client"
import { TourProvider } from "@/components/tour/tour-provider"

type MissionsUserPayload = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    image: true;
    class: true;
    role: true;
    missionSubmissions: {
      select: {
        missionId: true;
        status: true;
        mission: { select: { slug: true } };
      };
    };
    level: true;
    experience: true;
  };
 }>;

const getMissionsEnrichment = unstable_cache(
  async () => {
    const [completionsRaw, ratingsRaw, delaysRaw, missionSlugs] = await Promise.all([
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
      prisma.missionSubmission.findMany({
        where: { status: "APPROVED" },
        select: { missionId: true, createdAt: true, updatedAt: true },
      }),
      prisma.mission.findMany({ select: { id: true, slug: true } }),
    ])
    const idToSlug = Object.fromEntries(missionSlugs.map(m => [m.id, m.slug]))

    // Calcul des délais moyens par mission
    const delaysByMission: Record<string, number[]> = {}
    delaysRaw.forEach(d => {
      const delayHours = (d.updatedAt.getTime() - d.createdAt.getTime()) / (1000 * 60 * 60)
      if (!delaysByMission[d.missionId]) delaysByMission[d.missionId] = []
      delaysByMission[d.missionId].push(delayHours)
    })

    const avgDelayMap: Record<string, number> = {}
    Object.entries(delaysByMission).forEach(([mId, delays]) => {
      const avg = delays.reduce((a, b) => a + b, 0) / delays.length
      const slug = idToSlug[mId] ?? mId
      avgDelayMap[slug] = Math.round(avg) || 14
    })

    return {
      completionsMap: Object.fromEntries(completionsRaw.map(c => [idToSlug[c.missionId] ?? c.missionId, c._count._all])),
      ratingsMap: Object.fromEntries(ratingsRaw.map(r => [idToSlug[r.missionId] ?? r.missionId, { avg: r._avg.userRating, count: r._count.userRating }])),
      avgDelayMap,
    }
  },
  ["missions-enrichment"],
  { revalidate: 300 }
)

export default async function MissionsPage() {
  const session = await getSessionSafe();

  if (!session) {
    redirect("/signin");
  }

  const currentWeeklyChallenge = getCurrentWeeklyChallenge();
  const weekStart = getWeekStart();

  const weeklyMissionQuery = currentWeeklyChallenge
    ? prisma.mission.findUnique({ where: { slug: currentWeeklyChallenge.id } })
    : Promise.resolve(null);
  const weeklySubmissionQuery = currentWeeklyChallenge
    ? prisma.missionSubmission.findFirst({
        where: {
          userId: session.user.id,
          mission: { slug: currentWeeklyChallenge.id },
          createdAt: { gte: weekStart },
        }
      })
    : Promise.resolve(null);

  // Fetch user data, weekly mission, weekly submission and cached enrichment in parallel
  let finalDbUser: MissionsUserPayload | null = null
  let weeklyMission: Prisma.MissionGetPayload<object> | null = null
  let completionsMap: Record<string, number> = {}
  let ratingsMap: Record<string, { avg: number | null; count: number }> = {}
  let avgDelayMap: Record<string, number> = {}
  let userSquad: { id: string } | null = null
  let weeklySubmission: Prisma.MissionSubmissionGetPayload<object> | null = null

  try {
    ;[
      finalDbUser,
      weeklyMission,
      { completionsMap, ratingsMap, avgDelayMap },
      userSquad,
      weeklySubmission
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          class: true,
          role: true,
          missionSubmissions: {
            select: {
              missionId: true,
              status: true,
              mission: { select: { slug: true } },
            },
          },
          level: true,
          experience: true,
        }
      }),
      weeklyMissionQuery,
      getMissionsEnrichment(),
      prisma.member.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      }),
      weeklySubmissionQuery,
    ])
  } catch (error: unknown) {
    console.error("[MISSIONS_PAGE] DB fetch failed:", error)
    throw error // propagates to app/missions/error.tsx
  }

  if (!finalDbUser) {
    redirect("/signin");
  }

  const featureFlags = getFeatureFlags();

  // Key by slug so MissionsList can look up by MISSIONS[n].id (which equals the slug)
  const submissionsMap: Record<string, string> = {};
  finalDbUser.missionSubmissions.forEach((sub) => {
    const slug = sub.mission?.slug ?? sub.missionId;
    submissionsMap[slug] = sub.status;
  });

  // Users already in a squad get squad-genesis marked as completed (display only)
  if (userSquad && !submissionsMap["squad-genesis"]) {
    submissionsMap["squad-genesis"] = "APPROVED";
  }

  // Enrich MISSIONS
  const enrichedMissions = MISSIONS.map(m => ({
    ...m,
    completionsCount: completionsMap[m.id] || 0,
    avgRating: ratingsMap[m.id]?.avg || null,
    ratingsCount: ratingsMap[m.id]?.count || 0,
    avgDelay: avgDelayMap[m.id] || 12, // Default global delay reassurance
  }));
  // --- END ENRICHMENT ---

  return (
    <TourProvider userId={finalDbUser.id} featureFlag={isFeatureEnabled("tour")}>
    <SidebarProvider>
      <AppSidebar user={finalDbUser} hasSquad={!!userSquad} />
      <BottomNav />
      
      <SidebarInset className="bg-background relative overflow-hidden">
        {/* Reinforced Background Effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="scanline opacity-20" />
        
        <UserTopBar user={finalDbUser} />
        
        <main className="flex-1 p-4 md:p-10 pb-(--bottom-nav-height) md:pb-12 overflow-y-auto scrollbar-none relative z-[var(--z-content)]">
          <div className="max-w-6xl mx-auto space-y-10">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground hover:text-primary transition-all mb-4 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              RETOUR AU TABLEAU DE BORD
            </Link>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="size-3.5 text-primary animate-pulse" />
                <span className="text-xs font-mono font-black uppercase text-primary">Centre de Commandement</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                Mes <span className="text-primary">Missions</span>
              </h1>
              <p className="text-zinc-500 max-w-2xl font-light text-sm md:base leading-relaxed">
                Chaque mission complétée renforce ton signal. Commence par la première — le reste suivra.
              </p>
            </div>

            {featureFlags.weekly_challenges !== false && weeklyMission && (
              <div className="max-w-3xl" id="tour-weekly-challenge">
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
                      <div className="text-xs font-mono text-zinc-500 uppercase">Données d'évolution</div>
                      <div className="text-sm font-bold text-white uppercase tracking-tight">Expérience Globale Accumulée</div>
                   </div>
                     <div className="text-4xl font-black text-primary font-mono italic">{finalDbUser.experience ?? 0} <span className="text-xs not-italic text-zinc-600">XP</span></div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-primary shadow-[0_0_20px_#C5F441] transition-all duration-1000" 
                         style={{ width: `${Math.min(100, ((finalDbUser.experience ?? 0) % 1000) / 10)}%` }}
                    />
                </div>
                <div className="text-xs text-zinc-500 mt-4 font-mono uppercase tracking-wider flex items-center gap-2">
                   <span className="size-1 rounded-full bg-primary animate-pulse" />
                   Status: Mise à jour de ton niveau {finalDbUser.level ?? 1} en cours...
                </div>
              </div>
              
              <div className="hidden md:flex p-8 rounded-4xl border border-dashed border-white/5 bg-white/1 items-center justify-center text-center">
                 <p className="text-3xs font-mono text-zinc-700 uppercase leading-relaxed">
                   [ Accès prioritaire ]<br/>
                   Prêt pour la prochaine<br/>
                   mission à venir
                 </p>
              </div>
            </div>

            <div id="tour-missions-list">
              <MissionsList 
                userLevel={finalDbUser.level ?? 1} 
                userXp={finalDbUser.experience ?? 0} 
                submissions={submissionsMap} 
                userClass={finalDbUser.class}
                missions={enrichedMissions}
              />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
    </TourProvider>
  )
}

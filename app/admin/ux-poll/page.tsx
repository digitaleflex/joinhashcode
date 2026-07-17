import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getUxPollStats } from "@/lib/admin/ux-poll-stats"
import { BarChart3, Moon, Star, MessageSquareText, TrendingUp, Users } from "lucide-react"
import { formatRelativeTime } from "@/lib/dates"

export const dynamic = "force-dynamic"

export default async function AdminUxPollPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/signin")

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
    redirect("/dashboard")
  }

  const stats = await getUxPollStats()
  const darkModeTotal = stats.darkMode.yes + stats.darkMode.no
  const darkModePct = darkModeTotal > 0 ? Math.round((stats.darkMode.yes / darkModeTotal) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-lg font-bold tracking-tight text-white">Sondage UX</h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
            Résultats du mini-sondage expérience utilisateur
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-primary">{stats.total}</div>
          <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">réponses</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-3">
            <Users className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Total réponses</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-3">
            <Star className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Note moyenne</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.modernity.average}<span className="text-zinc-600 text-base">/5</span></div>
          <div className="text-[10px] text-zinc-600 mt-1">min {stats.modernity.min} · max {stats.modernity.max}</div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-3">
            <Moon className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Mode sombre</span>
          </div>
          <div className="text-2xl font-bold text-white">{darkModePct}%</div>
          <div className="text-[10px] text-zinc-600 mt-1">{stats.darkMode.yes} oui · {stats.darkMode.no} non</div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-3">
            <TrendingUp className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Tendance</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.dailyTrend.length}</div>
          <div className="text-[10px] text-zinc-600 mt-1">jours avec réponses</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating distribution */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <BarChart3 className="size-4 text-primary" />
            <h2 className="text-sm font-bold tracking-tight">Répartition des notes de modernité</h2>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((rating) => {
              const count = stats.modernity.distribution[rating] || 0
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-500 w-6">{rating}</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-400 w-10 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Daily trend */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <TrendingUp className="size-4 text-primary" />
            <h2 className="text-sm font-bold tracking-tight">Réponses par jour</h2>
          </div>

          {stats.dailyTrend.length === 0 ? (
            <p className="text-zinc-500 text-sm">Aucune donnée temporelle disponible.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {stats.dailyTrend.map((day) => (
                <div key={day.date} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-xs font-mono text-zinc-400">{day.date}</span>
                  <span className="text-xs font-bold text-white">{day.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Readability issues */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2 text-white">
          <MessageSquareText className="size-4 text-primary" />
          <h2 className="text-sm font-bold tracking-tight">Retours sur la lisibilité</h2>
          <span className="ml-auto text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            {stats.issues.length} commentaire{stats.issues.length > 1 ? "s" : ""}
          </span>
        </div>

        {stats.issues.length === 0 ? (
          <p className="text-zinc-500 text-sm">Aucun retour texte pour le moment.</p>
        ) : (
          <div className="grid gap-3">
            {stats.issues.map((issue, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-zinc-950/50 p-4 transition-all hover:border-white/10"
              >
                <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap text-sm">
                  &quot;{issue.text}&quot;
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] font-mono text-zinc-500">
                  {issue.user && (
                    <span className="text-zinc-400">
                      {issue.user.name} ({issue.user.email})
                    </span>
                  )}
                  <span>{formatRelativeTime(issue.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

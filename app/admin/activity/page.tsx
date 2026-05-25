import { prisma } from "@/lib/prisma"
import { ScrollText, User, Clock, Filter } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { fr } from "date-fns/locale"

const ACTION_COLORS: Record<string, { bg: string; color: string; hex: string }> = {
  USER_SIGNIN:                { bg: "bg-zinc-700/40 border-zinc-600/30",       color: "text-zinc-300",   hex: "#a1a1aa" },
  USER_SIGNUP:                { bg: "bg-emerald-400/10 border-emerald-400/20", color: "text-emerald-400", hex: "#34d399" },
  ONBOARDING_COMPLETED:       { bg: "bg-cyan-400/10 border-cyan-400/20",       color: "text-cyan-400",   hex: "#22d3ee" },
  QUIZ_COMPLETED:             { bg: "bg-cyan-400/10 border-cyan-400/20",       color: "text-cyan-400",   hex: "#22d3ee" },
  POST_QUIZ_COMPLETED:        { bg: "bg-cyan-400/10 border-cyan-400/20",       color: "text-cyan-400",   hex: "#22d3ee" },
  SQUAD_CREATED:              { bg: "bg-primary/10 border-primary/20",         color: "text-primary",    hex: "#C5F441" },
  SQUAD_JOINED:               { bg: "bg-primary/10 border-primary/20",         color: "text-primary",    hex: "#C5F441" },
  SQUAD_UPDATED:              { bg: "bg-primary/10 border-primary/20",         color: "text-primary",    hex: "#C5F441" },
  SQUAD_INVITE_SENT:          { bg: "bg-primary/10 border-primary/20",         color: "text-primary",    hex: "#C5F441" },
  MISSION_VIEWED:             { bg: "bg-zinc-700/40 border-zinc-600/30",       color: "text-zinc-400",   hex: "#71717a" },
  MISSION_CLAIMED:            { bg: "bg-amber-400/10 border-amber-400/20",     color: "text-amber-400",  hex: "#fbbf24" },
  MISSION_SUBMITTED:          { bg: "bg-amber-400/10 border-amber-400/20",     color: "text-amber-400",  hex: "#fbbf24" },
  MISSION_APPROVED:           { bg: "bg-emerald-400/10 border-emerald-400/20", color: "text-emerald-400", hex: "#34d399" },
  MISSION_REJECTED:           { bg: "bg-red-400/10 border-red-400/20",         color: "text-red-400",    hex: "#f87171" },
  MISSION_REVISION_REQUESTED: { bg: "bg-orange-400/10 border-orange-400/20",   color: "text-orange-400", hex: "#fb923c" },
  CHECKIN_COMPLETED:          { bg: "bg-violet-400/10 border-violet-400/20",   color: "text-violet-400", hex: "#a78bfa" },
  PROFILE_UPDATED:            { bg: "bg-zinc-700/40 border-zinc-600/30",       color: "text-zinc-300",   hex: "#a1a1aa" },
  ADMIN_SUBMISSION_REVIEWED:  { bg: "bg-rose-400/10 border-rose-400/20",       color: "text-rose-400",   hex: "#fb7185" },
  ADMIN_USER_BANNED:          { bg: "bg-red-400/10 border-red-400/20",         color: "text-red-400",    hex: "#f87171" },
  ADMIN_USER_UNBANNED:        { bg: "bg-emerald-400/10 border-emerald-400/20", color: "text-emerald-400", hex: "#34d399" },
  ACCOUNT_DELETED:            { bg: "bg-red-400/10 border-red-400/20",         color: "text-red-400",    hex: "#f87171" },
}

const ACTION_LABELS: Record<string, string> = {
  USER_SIGNIN:                "Connexion",
  USER_SIGNUP:                "Inscription",
  ONBOARDING_COMPLETED:       "Onboarding OK",
  QUIZ_COMPLETED:             "Quiz terminé",
  POST_QUIZ_COMPLETED:        "Post-quiz OK",
  SQUAD_CREATED:              "Escouade créée",
  SQUAD_JOINED:               "Escouade rejointe",
  SQUAD_UPDATED:              "Escouade modifiée",
  SQUAD_INVITE_SENT:          "Invite envoyée",
  MISSION_VIEWED:             "Mission vue",
  MISSION_CLAIMED:            "Mission réclamée",
  MISSION_SUBMITTED:          "Mission soumise",
  MISSION_APPROVED:           "Mission validée",
  MISSION_REJECTED:           "Mission refusée",
  MISSION_REVISION_REQUESTED: "Révision demandée",
  CHECKIN_COMPLETED:          "Check-in",
  PROFILE_UPDATED:            "Profil modifié",
  ADMIN_SUBMISSION_REVIEWED:  "Soumission révisée",
  ADMIN_USER_BANNED:          "Utilisateur banni",
  ADMIN_USER_UNBANNED:        "Ban levé",
  ACCOUNT_DELETED:            "Compte supprimé",
}

function ActionBadge({ action }: { action: string }) {
  const style = ACTION_COLORS[action] ?? { bg: "bg-zinc-700/40 border-zinc-600/30", color: "text-zinc-400", hex: "#71717a" }
  const label = ACTION_LABELS[action] ?? action
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider w-fit ${style.bg} ${style.color}`}>
      {label}
    </span>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MetadataCell({ metadata }: { metadata: any }) {
  if (!metadata || typeof metadata !== "object") return <span className="text-zinc-700">—</span>

  const entries = Object.entries(metadata as Record<string, unknown>)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .slice(0, 4)

  if (entries.length === 0) return <span className="text-zinc-700">—</span>

  return (
    <div className="flex flex-wrap gap-1">
      {entries.map(([k, v]) => (
        <span key={k} className="text-[9px] font-mono text-zinc-500">
          <span className="text-zinc-600">{k}:</span>{" "}
          <span className="text-zinc-400">{String(v).slice(0, 30)}</span>
        </span>
      ))}
    </div>
  )
}

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>
}) {
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page ?? "1", 10))
  const pageSize = 50
  const skip = (page - 1) * pageSize
  const filterAction = sp.action ?? ""

  const where = filterAction ? { action: filterAction } : {}

  const [logs, total, actionCounts] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, pseudo: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip,
    }),
    prisma.activityLog.count({ where }),
    prisma.activityLog.groupBy({
      by: ["action"],
      _count: { action: true },
      orderBy: { _count: { action: "desc" } },
    }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-3">
          <ScrollText className="h-6 w-6 text-primary" />
          Journal d&apos;activité
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          {total} événement{total !== 1 ? "s" : ""}{filterAction ? ` · filtre : ${filterAction}` : ""}
        </p>
      </div>

      {/* Action filters */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider text-zinc-500">
          <Filter className="h-3 w-3" />
          Filtrer par action
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/activity"
            className={`px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
              !filterAction
                ? "bg-primary/20 border-primary/40 text-primary"
                : "bg-zinc-800 border-white/5 text-zinc-400 hover:text-white hover:border-white/20"
            }`}
          >
            Toutes ({(actionCounts as Array<{ action: string; _count: { action: number } }>).reduce((a, b) => a + b._count.action, 0)})
          </a>
          {(actionCounts as Array<{ action: string; _count: { action: number } }>).map((ac) => {
            const style = ACTION_COLORS[ac.action] ?? { bg: "bg-zinc-700/40 border-zinc-600/30", color: "text-zinc-400" }
            const label = ACTION_LABELS[ac.action] ?? ac.action
            const isActive = filterAction === ac.action
            return (
              <a
                key={ac.action}
                href={`/admin/activity?action=${encodeURIComponent(ac.action)}`}
                className={`px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                  isActive ? `${style.bg} ${style.color}` : "bg-zinc-800 border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/20"
                }`}
              >
                {label} ({ac._count.action})
              </a>
            )
          })}
        </div>
      </div>

      {/* Log table */}
      {logs.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-12 text-center">
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-wide">Aucun événement</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
          <div className="grid grid-cols-[120px_1fr_160px_1fr_120px] gap-0 px-6 py-3 border-b border-white/5">
            {["Heure", "Utilisateur", "Action", "Détails", "IP"].map(h => (
              <span key={h} className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{h}</span>
            ))}
          </div>

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(logs as any[]).map((log) => (
            <div
              key={log.id}
              className="grid grid-cols-[120px_1fr_160px_1fr_120px] gap-0 px-6 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.015] transition-colors items-start"
            >
              {/* Timestamp */}
              <div className="space-y-0.5">
                <p className="text-[10px] font-mono text-zinc-400">
                  {formatDistanceToNow(new Date(log.createdAt), { locale: fr, addSuffix: true })}
                </p>
                <p className="text-[9px] font-mono text-zinc-700">
                  {format(new Date(log.createdAt), "dd/MM HH:mm:ss")}
                </p>
              </div>

              {/* User */}
              <div className="min-w-0 pr-4">
                {log.user ? (
                  <div>
                    <p className="text-xs font-medium text-white truncate">
                      {log.user.pseudo || log.user.name || "—"}
                    </p>
                    <p className="text-[9px] font-mono text-zinc-600 truncate">{log.user.email}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-zinc-700">
                    <User className="h-3 w-3" />
                    <span className="text-[9px] font-mono">Anonyme</span>
                  </div>
                )}
              </div>

              {/* Action badge */}
              <div>
                <ActionBadge action={log.action} />
              </div>

              {/* Metadata */}
              <MetadataCell metadata={log.metadata} />

              {/* IP */}
              <span className="text-[9px] font-mono text-zinc-700 truncate">{log.ip ?? "—"}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono text-zinc-600">
            Page {page} / {totalPages} · {total} entrées
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/admin/activity?${filterAction ? `action=${encodeURIComponent(filterAction)}&` : ""}page=${page - 1}`}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-white hover:bg-white/5 transition-colors"
              >
                ← Précédent
              </a>
            )}
            {page < totalPages && (
              <a
                href={`/admin/activity?${filterAction ? `action=${encodeURIComponent(filterAction)}&` : ""}page=${page + 1}`}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-white hover:bg-white/5 transition-colors"
              >
                Suivant →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-4">
        <h2 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-2">
          <Clock className="h-3 w-3" /> Répartition par événement
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(actionCounts as Array<{ action: string; _count: { action: number } }>).slice(0, 8).map((ac) => {
            const style = ACTION_COLORS[ac.action] ?? { bg: "bg-zinc-700/40 border-zinc-600/30", color: "text-zinc-400", hex: "#71717a" }
            const label = ACTION_LABELS[ac.action] ?? ac.action
            const grandTotal = (actionCounts as Array<{ action: string; _count: { action: number } }>).reduce((a, b) => a + b._count.action, 0) || 1
            const pct = Math.round((ac._count.action / grandTotal) * 100)
            return (
              <div key={ac.action} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${style.color}`}>{label}</span>
                  <span className="text-[9px] font-mono text-zinc-500">{ac._count.action}</span>
                </div>
                <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: style.hex }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

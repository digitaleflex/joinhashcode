import { prisma } from "@/lib/prisma"
import { ShieldBan, AlertTriangle, Ban, RotateCcw, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export default async function AdminFraudPage() {
  const [bannedUsers, suspiciousLogs] = await Promise.all([
    prisma.userSecurity.findMany({
      where: { banned: true },
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            id: true, name: true, email: true, pseudo: true,
            progress: { select: { level: true } },
          },
        },
      },
    }),
    prisma.activityLog.findMany({
      where: { action: { in: ["ADMIN_USER_BANNED", "ADMIN_USER_UNBANNED", "ADMIN_USER_IMPERSONATED"] } },
      orderBy: { createdAt: "desc" },
      take: 30,
      include: {
        user: { select: { id: true, name: true, pseudo: true, email: true } },
      },
    }),
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-3">
          <ShieldBan className="h-6 w-6 text-rose-400" />
          Anti-Fraude
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          {bannedUsers.length} utilisateur{bannedUsers.length > 1 ? "s" : ""} banni{bannedUsers.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-rose-400">
            <Ban className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Bannis</span>
          </div>
          <p className="text-2xl font-bold text-white">{bannedUsers.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-orange-400">
            <RotateCcw className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Révisions</span>
          </div>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Alertes (7j)</span>
          </div>
          <p className="text-2xl font-bold text-white">{suspiciousLogs.length}</p>
        </div>
      </div>

      {/* Banned users */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Utilisateurs bannis</h2>
        </div>
        {bannedUsers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-mono text-zinc-600">Aucun utilisateur banni</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {bannedUsers.map((sec) => {
              const u = sec.user
              return (
              <div key={sec.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.015] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-rose-400/10 border border-rose-400/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-rose-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{u.pseudo || u.name || "—"}</p>
                    <p className="text-[10px] font-mono text-zinc-600 truncate">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-rose-400/60 uppercase tracking-wider">Banni</p>
                  <p className="text-[9px] font-mono text-zinc-700">
                    {formatDistanceToNow(new Date(sec.updatedAt), { locale: fr, addSuffix: true })}
                  </p>
                </div>
              </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Audit log */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Journal de modération</h2>
        </div>
        {suspiciousLogs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-mono text-zinc-600">Aucune activité de modération</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {suspiciousLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between px-6 py-3 hover:bg-white/[0.015] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                    log.action === "ADMIN_USER_BANNED"
                      ? "bg-rose-400/10 border-rose-400/20 text-rose-400"
                      : log.action === "ADMIN_USER_UNBANNED"
                      ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
                      : "bg-orange-400/10 border-orange-400/20 text-orange-400"
                  }`}>
                    {log.action === "ADMIN_USER_BANNED" ? "Bannissement" :
                     log.action === "ADMIN_USER_UNBANNED" ? "Ban levé" :
                     "Impersonation"}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    par {log.user?.pseudo || log.user?.name || "Admin"}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-700">
                  {formatDistanceToNow(new Date(log.createdAt), { locale: fr, addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

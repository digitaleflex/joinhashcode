import { prisma } from "@/lib/prisma"
import { getFraudLevel } from "@/lib/fraud-score"
import { Shield, ShieldAlert, ShieldBan, Fingerprint, Globe, AlertTriangle, Eye, UserX, ChevronRight } from "lucide-react"
import Link from "next/link"

const FRAUD_LEVEL_CONFIG = {
  NORMAL: { label: "Normal", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: Shield },
  SURVEILLANCE: { label: "Surveillance", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Eye },
  MANUAL_REVIEW: { label: "Revue Manuelle", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: AlertTriangle },
  BLOCKED: { label: "Bloqué", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: ShieldBan },
} as const

const ACTION_LABELS: Record<string, string> = {
  VPN_DETECTED: "VPN détecté",
  PROXY_DETECTED: "Proxy détecté",
  TOR_DETECTED: "TOR détecté",
  DATACENTER_IP: "IP datacenter",
  FINGERPRINT_SHARED: "Empreinte partagée",
  EMAIL_TEMPORARY: "Email temporaire",
  MULTI_ACCOUNT_SAME_IP: "Multi-comptes même IP",
  SUSPICIOUS_ACTIVITY: "Activité suspecte",
  IP_BLACKLISTED: "IP blacklistée",
  IP_HIGH_RISK: "IP haut risque",
  BEHAVIOR_ANOMALY: "Anomalie comportementale",
  MULTIPLE_RISK_FLAGS: "Drapeaux de risque multiples",
}

export default async function AdminFraudPage() {
  const [
    fraudEvents,
    flaggedUsers,
    byLevel,
    byAction,
    summary,
  ] = await Promise.all([
    prisma.fraudEvent.findMany({
      include: {
        user: { select: { id: true, name: true, pseudo: true, email: true, image: true, fraudRiskScore: true, banned: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.user.findMany({
      where: { fraudRiskScore: { gte: 1 } },
      select: { id: true, name: true, pseudo: true, email: true, image: true, fraudRiskScore: true, banned: true, visitorId: true },
      orderBy: { fraudRiskScore: "desc" },
      take: 50,
    }),
    prisma.fraudEvent.groupBy({ by: ["action"], _count: { action: true } }),
    null as null,
    null as null,
  ])

  const totalScore = flaggedUsers.reduce((a, u) => a + u.fraudRiskScore, 0)
  const blockedCount = flaggedUsers.filter(u => getFraudLevel(u.fraudRiskScore) === "BLOCKED").length
  const manualReviewCount = flaggedUsers.filter(u => getFraudLevel(u.fraudRiskScore) === "MANUAL_REVIEW").length
  const surveillanceCount = flaggedUsers.filter(u => getFraudLevel(u.fraudRiskScore) === "SURVEILLANCE").length

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white">Anti-Fraude</h1>
        <p className="text-sm text-muted-foreground font-mono">
          Surveillance des événements de fraude, utilisateurs signalés et actions de modération.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Événements de fraude", value: fraudEvents.length, icon: Shield, color: "text-primary" },
          { label: "Score total", value: totalScore, icon: AlertTriangle, color: "text-amber-400" },
          { label: "En revue manuelle", value: manualReviewCount, icon: Eye, color: "text-orange-400" },
          { label: "Comptes bloqués", value: blockedCount, icon: ShieldBan, color: "text-red-400" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-3 shadow-sm hover:border-white/10 transition-colors">
            <div className={`flex items-center gap-2 ${kpi.color}`}>
              <kpi.icon className="h-4 w-4" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
            </div>
            <div className="text-4xl font-bold text-white tracking-tight">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Distribution par niveau */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <ShieldAlert className="h-3 w-3" /> Distribution par niveau de risque
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {(["NORMAL", "SURVEILLANCE", "MANUAL_REVIEW", "BLOCKED"] as const).map((level) => {
            const cfg = FRAUD_LEVEL_CONFIG[level]
            const Icon = cfg.icon
            const count = level === "NORMAL"
              ? flaggedUsers.filter(u => getFraudLevel(u.fraudRiskScore) === "NORMAL").length
              : level === "SURVEILLANCE" ? surveillanceCount
              : level === "MANUAL_REVIEW" ? manualReviewCount
              : blockedCount
            return (
              <div key={level} className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg} space-y-2`}>
                <div className={`flex items-center gap-2 ${cfg.color}`}>
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] font-mono uppercase font-bold">{cfg.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{count}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Utilisateurs signalés */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <UserX className="h-3 w-3 text-amber-400" /> Utilisateurs signalés ({flaggedUsers.length})
        </h2>
        <div className="space-y-2">
          {flaggedUsers.map((u) => {
            const level = getFraudLevel(u.fraudRiskScore)
            const cfg = FRAUD_LEVEL_CONFIG[level]
            return (
              <Link
                key={u.id}
                href={`/admin/users/${u.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center font-mono font-bold text-xs uppercase text-zinc-500">
                    {(u.pseudo || u.name).charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                      {u.pseudo || u.name}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {u.banned && <span className="text-[9px] font-mono text-red-400 uppercase font-bold">Banni</span>}
                  <span className={`text-sm font-bold font-mono ${cfg.color}`}>{u.fraudRiskScore}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {cfg.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            )
          })}
          {flaggedUsers.length === 0 && (
            <p className="text-sm text-zinc-600 font-mono py-8 text-center italic">Aucun utilisateur signalé</p>
          )}
        </div>
      </div>

      {/* Derniers événements */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Fingerprint className="h-3 w-3" /> Derniers événements ({fraudEvents.length})
        </h2>
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
          {fraudEvents.map((e) => {
            const level = getFraudLevel(e.riskDelta)
            const cfg = FRAUD_LEVEL_CONFIG[level]
            return (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="size-8 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center shrink-0">
                    <Globe className="size-3.5 text-zinc-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/admin/users/${e.userId}`} className="text-xs font-bold text-white hover:text-primary transition-colors">
                        {e.user?.pseudo || e.user?.name || "Inconnu"}
                      </Link>
                      <span className={`text-[9px] font-mono font-bold uppercase ${cfg.color}`}>
                        {ACTION_LABELS[e.action] || e.action}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                      {e.details && e.details.length > 80 ? e.details.slice(0, 80) + "…" : e.details}
                      <span className="text-zinc-700 ml-2">· {new Date(e.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className={`text-xs font-bold font-mono ${e.riskDelta >= 30 ? "text-red-400" : e.riskDelta >= 15 ? "text-amber-400" : "text-zinc-500"}`}>
                    +{e.riskDelta}
                  </span>
                  {e.ip && <span className="text-[9px] font-mono text-zinc-700">{e.ip}</span>}
                </div>
              </div>
            )
          })}
          {fraudEvents.length === 0 && (
            <p className="text-sm text-zinc-600 font-mono py-8 text-center italic">Aucun événement de fraude</p>
          )}
        </div>
      </div>
    </div>
  )
}

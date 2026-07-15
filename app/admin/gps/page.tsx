import { prisma } from "@/lib/prisma"
import { MapPin, Users, Database, Activity } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export default async function AdminGpsPage() {
  const [locationCount, consentCount, recentLocations, userCount] = await Promise.all([
    prisma.userLocation.count(),
    prisma.user.count({ where: { consentLocation: true } }),
    prisma.userLocation.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: {
        user: { select: { id: true, pseudo: true, name: true, email: true } },
      },
    }),
    prisma.user.count(),
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-3">
          <MapPin className="h-6 w-6 text-primary" />
          Données GPS
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          {locationCount} points de géolocalisation · {consentCount} utilisateurs consentants
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Database className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Points GPS</span>
          </div>
          <p className="text-2xl font-bold text-white">{locationCount.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Users className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Consentants</span>
          </div>
          <p className="text-2xl font-bold text-white">{consentCount}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Activity className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Taux consentement</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {userCount > 0 ? `${Math.round((consentCount / userCount) * 100)}%` : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-violet-400">
            <MapPin className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Moy. par user</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {consentCount > 0 ? Math.round(locationCount / consentCount).toLocaleString() : "—"}
          </p>
        </div>
      </div>

      {/* Recent locations */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Dernières localisations</h2>
          <span className="text-[9px] font-mono text-zinc-700">{recentLocations.length} entrées</span>
        </div>
        {recentLocations.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm font-mono text-zinc-600">Aucune donnée de localisation</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentLocations.map((loc) => (
              <div key={loc.id} className="flex items-center justify-between px-6 py-3 hover:bg-white/[0.015] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {loc.user?.pseudo || loc.user?.name || "Anonyme"}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-600 truncate">
                      {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                      {loc.accuracy ? ` (±${loc.accuracy.toFixed(0)}m)` : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-mono text-zinc-500">
                    {formatDistanceToNow(new Date(loc.createdAt), { locale: fr, addSuffix: true })}
                  </p>
                  {loc.ip && (
                    <p className="text-[9px] font-mono text-zinc-700 truncate max-w-[120px]">{loc.ip}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Users with consent */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6">
        <h2 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-4">Utilisateurs avec consentement GPS</h2>
        <p className="text-sm font-mono text-zinc-600">
          {consentCount} utilisateur{consentCount > 1 ? "s" : ""} sur {userCount} ont activé le partage de position ({userCount > 0 ? Math.round((consentCount / userCount) * 100) : 0}%).
          Les données sont conservées 90 jours avant purge automatique.
        </p>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Gift, Share2, MapPin } from "lucide-react"

interface SecondaryStatsSectionProps {
  referralCount: number
  referrers: number
  userCount: number
  passkeyCount: number
  passkeyUsers: number
  gpsCount: number
  gpsConsentCount: number
}

export function SecondaryStatsSection({
  referralCount,
  referrers,
  userCount,
  passkeyCount,
  passkeyUsers,
  gpsCount,
  gpsConsentCount,
}: SecondaryStatsSectionProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Parrainage */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Gift className="h-3 w-3 text-indigo-400" /> Parrainage
        </h2>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold text-white">{referralCount}</div>
            <p className="text-[10px] font-mono text-zinc-500">Parrainages réussis</p>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-400">Parrains actifs</span>
            <span className="text-white font-bold">{referrers}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-400">Conversion</span>
            <span className="text-white font-bold">{userCount > 0 ? Math.round((referralCount / userCount) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Passkey */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Share2 className="h-3 w-3 text-emerald-400" /> Passkeys
        </h2>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold text-white">{passkeyCount}</div>
            <p className="text-[10px] font-mono text-zinc-500">Passkeys enregistrées</p>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-400">Utilisateurs équipés</span>
            <span className="text-white font-bold">{passkeyUsers}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-400">Adoption</span>
            <span className="text-emerald-400 font-bold">{userCount > 0 ? Math.round((passkeyUsers / userCount) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* GPS */}
      <Link href="/admin/gps" className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5 hover:border-white/10 hover:bg-zinc-900/80 transition-all group">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <MapPin className="h-3 w-3 text-cyan-400" /> Données GPS
        </h2>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold text-white group-hover:text-primary transition-colors">{gpsCount}</div>
            <p className="text-[10px] font-mono text-zinc-500">Coordonnées collectées</p>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-400">Consentement</span>
            <span className="text-white font-bold">{userCount > 0 ? Math.round((gpsConsentCount / userCount) * 100) : 0}%</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-400">Dernière</span>
            <span className="text-white font-bold">{new Date().toLocaleDateString("fr-FR")}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

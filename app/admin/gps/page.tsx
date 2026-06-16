import { prisma } from "@/lib/prisma"
import { MapPin, User, Clock, Download } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminGpsPage() {
  const [locations, total] = await Promise.all([
    prisma.userLocation.findMany({
      include: {
        user: { select: { id: true, name: true, pseudo: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.userLocation.count(),
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-bold tracking-tight text-white">Données GPS</h1>
          <p className="text-sm text-muted-foreground font-mono">
            {total} coordonnées collectées — affichage des 200 dernières
          </p>
        </div>
        <a
          href={`/api/admin/users/export?format=json`}
          download
          className="h-8 px-3 inline-flex items-center text-[9px] font-mono font-black uppercase tracking-wider border border-zinc-700 text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-colors rounded"
        >
          <Download className="h-3 w-3 mr-1.5" /> Export
        </a>
      </div>

      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left p-4 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Utilisateur</th>
                <th className="text-left p-4 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Latitude</th>
                <th className="text-left p-4 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Longitude</th>
                <th className="text-left p-4 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Précision</th>
                <th className="text-left p-4 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">IP</th>
                <th className="text-left p-4 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Date</th>
                <th className="text-left p-4 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Lien</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/users/${loc.userId}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                      <User className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="text-sm font-medium text-white">{loc.user?.pseudo || loc.user?.name || "Inconnu"}</span>
                    </Link>
                  </td>
                  <td className="p-4 font-mono text-xs text-zinc-300">{loc.latitude.toFixed(6)}</td>
                  <td className="p-4 font-mono text-xs text-zinc-300">{loc.longitude.toFixed(6)}</td>
                  <td className="p-4">
                    <span className="text-xs text-zinc-500">{loc.accuracy ? `${loc.accuracy.toFixed(0)}m` : "—"}</span>
                  </td>
                  <td className="p-4 font-mono text-[10px] text-zinc-600">{loc.ip || "—"}</td>
                  <td className="p-4">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(loc.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>
                  <td className="p-4">
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${loc.latitude}&mlon=${loc.longitude}&zoom=13`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono text-primary hover:text-primary/80 transition-colors uppercase tracking-wider font-bold"
                    >
                      Carte
                    </a>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MapPin className="h-8 w-8 text-zinc-700" />
                      <p className="text-sm font-mono text-zinc-600 italic">Aucune donnée GPS collectée</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

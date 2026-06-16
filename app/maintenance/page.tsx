import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Maintenance • HASHCODE",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
          <div className="size-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Maintenance en cours</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white uppercase tracking-tighter">
          Bientôt de retour
        </h1>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Nous effectuons des améliorations sur la plateforme. Reviens dans quelques instants.
        </p>
        <div className="flex items-center justify-center gap-1.5 text-zinc-700 text-xs font-mono">
          <span className="size-1.5 rounded-full bg-zinc-700 animate-bounce" style={{ animationDelay: "0s" }} />
          <span className="size-1.5 rounded-full bg-zinc-700 animate-bounce" style={{ animationDelay: "0.15s" }} />
          <span className="size-1.5 rounded-full bg-zinc-700 animate-bounce" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    </div>
  )
}

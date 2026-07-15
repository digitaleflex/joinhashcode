"use client"

import { WifiOff, RotateCcw } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,244,65,0.03),transparent_50%)]" />
      <div className="max-w-xl w-full text-center relative z-10">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800">
          <WifiOff className="w-12 h-12 text-zinc-500" />
        </div>

        <h1 className="text-5xl font-black tracking-tighter mb-4">
          Connexion perdue
        </h1>

        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          Tu es hors ligne. HASHCODE a besoin d&apos;une connexion internet pour fonctionner.
          Rétablis ta connexion et réessaie.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Réessayer
        </button>

        <div className="mt-16 pt-8 border-t border-border/40 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Hors ligne
          </div>
          <div className="w-px h-3 bg-border/40" />
          <div className="text-[10px] font-mono text-muted-foreground uppercase">
            HASHCODE
          </div>
        </div>
      </div>
    </div>
  )
}

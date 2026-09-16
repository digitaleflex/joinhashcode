import { Wrench } from "lucide-react"

export const metadata = {
  title: "Maintenance — HASHCODE",
  description: "HASHCODE est momentanément en maintenance.",
}

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(197,244,65,0.06),transparent_55%)] pointer-events-none" />
      <div className="scanline pointer-events-none" />

      <div className="relative z-[var(--z-content)] max-w-xl w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20">
          <Wrench className="w-9 h-9 text-primary animate-pulse" />
        </div>

        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            [ MAINTENANCE_EN_COURS ]
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter italic">
            Le réseau est en{" "}
            <span className="text-primary">maintenance</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Nous améliorons la plateforme pour une meilleure expérience. Le service
            sera rétabli sous peu.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground/60 uppercase tracking-wider">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          Réessaie dans quelques minutes
        </div>
      </div>
    </main>
  )
}

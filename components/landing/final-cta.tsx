import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Background grid + radial fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-3xl px-4 py-28 text-center sm:px-6 sm:py-36 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 backdrop-blur">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Prêt ?
          </span>
        </div>

        <h2 className="mt-6 text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Découvre ton profil.
          <br />
          <span className="text-primary">Maintenant.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Le profilage prend 5 minutes. Tes réponses définissent ton parcours.
        </p>

        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="group h-12 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_0_0_1px_rgba(197,244,65,0.2),0_8px_40px_-8px_rgba(197,244,65,0.5)] hover:bg-primary/90"
          >
            <Link href="/quiz">
              Commencer mon profilage
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground/70">
          Gratuit · Sans engagement · 5 minutes
        </p>
      </div>
    </section>
  )
}

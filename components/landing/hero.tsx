import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Subtle dot grid background with radial fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-60"
      />

      {/* Top accent line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-linear-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-36">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Eyebrow badge */}

          {/* H1 */}
          <h1 className="mt-8 text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Décode ton potentiel.
            <br />
            <span className="text-muted-foreground">Intègre ta communauté.</span>
          </h1>

          {/* Sub */}
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Une plateforme de profilage qui détecte ton profil, t&apos;oriente vers la bonne
            communauté, et t&apos;accompagne dans un parcours sur mesure.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[0_0_0_1px_rgba(197,244,65,0.2),0_8px_32px_-8px_rgba(197,244,65,0.4)] hover:bg-primary/90"
            >
              <Link href="/quiz">
                Commencer mon profilage
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-11 rounded-md px-4 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground"
            >
              <Link href="#how">Comment ça marche ?</Link>
            </Button>
          </div>

          {/* Meta line */}
          <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground/70">
            <span>5 minutes</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>20 questions</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Gratuit</span>
          </div>
        </div>

        {/* Visual proof block — terminal-like card */}
        <div className="mx-auto mt-20 max-w-3xl">
          <div className="relative rounded-xl border border-border bg-card/80 shadow-2xl shadow-black/40 backdrop-blur">
            {/* Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-xl bg-linear-to-b from-primary/20 to-transparent opacity-30 blur-sm"
            />
            {/* Header */}
            <div className="relative flex items-center gap-2 border-b border-border px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
              </div>
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                joinhashcode.com/profile
              </span>
            </div>
            {/* Body */}
            <div className="relative grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 sm:p-6">
              <ProfileStat label="Profil" value="CORE" mono />
              <ProfileStat label="Score" value="78/100" mono />
              <ProfileStat label="Niveau" value="03" mono />
              <ProfileStat label="Communauté" value="Builders" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProfileStat({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      <span
        className={`text-base font-medium text-foreground ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  )
}

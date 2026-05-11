import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Premium Background Image */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 scale-110"
          style={{ 
            backgroundImage: "url('/images/hero-bg-v2.png')",
            filter: "blur(10px)"
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 [background:radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_80%)]" />
      </div>

      {/* Subtle dot grid background with radial fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-40 z-10"
      />

      {/* Top accent line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-linear-to-r from-transparent via-primary/40 to-transparent z-20"
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
            Réponds à 13 questions ciblées en 3 minutes. Identité, parcours, objectifs, engagement.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="btn-primary-glow group h-12 rounded-xl px-6 text-sm font-bold"
            >
              <Link href="/quiz">
                Commencer mon profilage
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
            <span>3 minutes</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>13 questions</span>
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
              <ProfileStat label="Profil" value="BUILDER" mono />
              <ProfileStat label="Score" value="72/100" mono />
              <ProfileStat label="Niveau" value="02 [CORE]" mono />
              <ProfileStat label="Certitude" value="25%" mono />
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

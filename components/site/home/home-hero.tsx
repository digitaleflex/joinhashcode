import Link from "next/link"
import { ArrowRight } from "lucide-react"

const STEPS = ["Discover", "Learn", "Practice", "Demonstrate", "Grow"]

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">The technology ecosystem</p>
          <h1 className="mt-4 font-syne text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Build skills. Prove expertise. Create opportunities.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Technology is constantly evolving. So should your skills.
          </p>
          <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
            HASHCODE is a space to learn, experiment, build meaningful projects
            and turn your knowledge into demonstrated expertise.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Explore HASHCODE <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:border-primary/50"
            >
              Join the community
            </Link>
          </div>
        </div>
        {/* Abstract composition: the learning cycle, no fake code, no clichés */}
        <div className="relative mx-auto w-full max-w-md" aria-hidden>
          <svg viewBox="0 0 400 340" className="h-auto w-full" role="presentation">
            <defs>
              <linearGradient id="hc-flow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--primary)" stopOpacity="0.7" />
                <stop offset="1" stopColor="var(--primary)" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="170" r="120" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="5 7" />
            <circle cx="200" cy="170" r="78" fill="none" stroke="var(--border)" strokeWidth="1" />
            <ellipse cx="200" cy="170" rx="120" ry="44" fill="none" stroke="url(#hc-flow)" strokeWidth="1.5" transform="rotate(-18 200 170)" />
            {STEPS.map((_, i) => {
              const angle = (i / STEPS.length) * Math.PI * 2 - Math.PI / 2
              const x = 200 + 120 * Math.cos(angle)
              const y = 170 + 120 * Math.sin(angle)
              return <circle key={i} cx={x} cy={y} r="7" fill="var(--primary)" opacity={0.35 + (i / STEPS.length) * 0.65} />
            })}
            <circle cx="200" cy="170" r="26" fill="var(--primary)" opacity="0.12" />
            <circle cx="200" cy="170" r="12" fill="var(--primary)" opacity="0.85" />
          </svg>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {STEPS.map((s) => (
              <span key={s} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

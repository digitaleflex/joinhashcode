import Link from "next/link"
import { ArrowRight, ArrowUpRight, BrainCircuit, Code2, ShieldCheck } from "lucide-react"

const DOMAINS = [
  { icon: Code2, label: "Développement web" },
  { icon: ShieldCheck, label: "Cybersécurité" },
  { icon: BrainCircuit, label: "IA appliquée" },
]

const STEPS = ["Découvrir", "Apprendre", "Pratiquer", "Démontrer", "Évoluer"]

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-48 -top-40 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute -left-40 bottom-[-18rem] h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            L'écosystème technologique HashCode
          </div>

          <h1 className="mt-7 max-w-3xl font-syne text-4xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-[4.15rem]">
            Tes compétences méritent <span className="text-primary">plus qu'un CV.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Apprends, construis des projets concrets et démontre ce que tu sais faire.
            HashCode t'accompagne dans ton évolution numérique, de la découverte aux premières preuves de compétence.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signin"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Rejoindre HashCode <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/programs"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-6 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/50 hover:bg-card"
            >
              Découvrir les domaines <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden />
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            <span>Pour débutants et profils en progression</span>
            <span className="hidden h-1 w-1 self-center rounded-full bg-border sm:block" />
            <span>Apprentissage par la pratique</span>
            <span className="hidden h-1 w-1 self-center rounded-full bg-border sm:block" />
            <span>Communauté francophone</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-5 rounded-[2rem] bg-primary/5 blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Ton évolution</p>
                <p className="mt-1 font-syne text-lg font-bold text-foreground">Un parcours. Des preuves. Des possibilités.</p>
              </div>
              <span className="rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-bold text-primary">HASHCODE</span>
            </div>

            <div className="mt-5 space-y-3">
              {DOMAINS.map((domain, index) => (
                <div key={domain.label} className="flex items-center gap-3 rounded-xl border border-border bg-background/70 p-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <domain.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">{domain.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Domaine d'exploration et de progression</p>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-border bg-background/60 p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">La boucle de progression</p>
              <div className="flex flex-wrap items-center gap-2">
                {STEPS.map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold ${index === 3 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                      {step}
                    </span>
                    {index < STEPS.length - 1 && <span className="text-muted-foreground/50">→</span>}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              Les contenus et activités disponibles évoluent progressivement. Seules les réalisations réellement accessibles sont présentées comme telles.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

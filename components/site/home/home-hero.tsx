import Link from "next/link"
import { ArrowRight, CheckCircle2, FileSearch, FlaskConical, ShieldCheck, Users } from "lucide-react"

const STEPS = [
  { icon: FlaskConical, label: "Un lab" },
  { icon: FileSearch, label: "Ta soumission" },
  { icon: Users, label: "Une relecture" },
  { icon: ShieldCheck, label: "Une preuve publique" },
]

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-48 -top-40 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Cybersécurité · francophone · débutants
          </div>
          <h1 className="mt-7 max-w-3xl font-syne text-4xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-[4.15rem]">
            Prouve que tu peux devenir <span className="text-primary">analyste SOC junior.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Fais des labs de cybersécurité, fais relire ton travail, et construis un profil public
            où chaque preuve a été vérifiée. Un recruteur voit ce que tu sais faire, pas ce que tu déclares.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signin" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
              Faire mon premier lab <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/talents" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-6 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/50 hover:bg-card">
              Voir des preuves
            </Link>
          </div>
          <p className="mt-9 text-xs font-medium text-muted-foreground">
            Gratuit · Sans niveau requis · Ton profil reste privé tant que tu ne le rends pas public
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-5 shadow-2xl shadow-black/20 sm:p-7">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">Comment ça marche</p>
            <ol className="mt-5 space-y-3">
              {STEPS.map((step, index) => (
                <li key={step.label} className="flex items-center gap-3 rounded-xl border border-border bg-background/70 p-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <p className="flex-1 text-sm font-bold text-foreground">{step.label}</p>
                  <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              Une preuve n'apparaît sur ton profil qu'après validation de ta soumission.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

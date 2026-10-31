import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, FlaskConical } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { ACTIVE_PROGRAMS } from "@/lib/site-programs"

export const metadata: Metadata = {
  title: "Domaines",
  description: "Explore les trois domaines actifs de HashCode : développement web, cybersécurité et intelligence artificielle appliquée.",
}

export default function ProgramsPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <SectionHeading
          kicker="Nos domaines"
          title="Trois domaines. Une même ambition : progresser par la pratique."
          description="Choisis le domaine qui t'intéresse. HashCode rassemble l'orientation, les ressources, les activités pratiques et la communauté dans une expérience unifiée."
        />
        <div className="mt-7 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-1.5">Développement web</span>
          <span className="rounded-full border border-border px-3 py-1.5">Cybersécurité</span>
          <span className="rounded-full border border-border px-3 py-1.5">IA appliquée</span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {ACTIVE_PROGRAMS.map((domain, index) => (
            <article id={domain.slug} key={domain.slug} className="flex flex-col rounded-3xl border border-border bg-card p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">DOMAINE 0{index + 1}</span>
                <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-primary">Actif</span>
              </div>
              <h2 className="mt-7 font-syne text-2xl font-bold text-foreground">{domain.title}</h2>
              <p className="mt-3 min-h-24 text-sm leading-relaxed text-muted-foreground">{domain.text}</p>
              <div className="mt-7 border-t border-border pt-5">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Axes d'exploration</h3>
                <ul className="mt-4 space-y-3">
                  {domain.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto flex flex-wrap gap-2 pt-8">
                <Link href="/labs" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
                  <FlaskConical className="h-3.5 w-3.5" aria-hidden /> Voir les activités
                </Link>
                <Link href="/academy" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-bold text-foreground transition-colors hover:border-primary/50">
                  <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden /> Academy
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Une progression unifiée</p>
            <h2 className="mt-3 max-w-2xl font-syne text-2xl font-bold text-foreground sm:text-3xl">Pas trois plateformes. Un seul espace pour évoluer.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Tu conserves un compte, un profil et un parcours cohérent. Les ressources et activités concrètement publiées sont accessibles depuis l'Academy et les Labs ; leur disponibilité varie selon les domaines et les étapes de développement.
            </p>
          </div>
          <Link href="/signin" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground">
            Commencer <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  )
}

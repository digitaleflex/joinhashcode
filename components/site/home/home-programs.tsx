import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { ACTIVE_PROGRAMS } from "@/lib/site-programs"

export function HomePrograms() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading kicker="Trois domaines actifs" title="Choisis ton terrain de progression." description="Le numérique est vaste. HashCode structure son expérience autour de trois domaines complémentaires, avec un même espace membre et une progression unifiée." />
        <div className="mt-11 grid gap-4 lg:grid-cols-3">
          {ACTIVE_PROGRAMS.map((domain, index) => (
            <article key={domain.slug} className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs font-bold text-primary">0{index + 1} / 03</span>
                <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-primary">Domaine actif</span>
              </div>
              <h3 className="mt-7 font-syne text-2xl font-bold text-foreground">{domain.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{domain.text}</p>
              <ul className="mt-6 space-y-2 border-t border-border pt-5">
                {domain.topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {topic}
                  </li>
                ))}
              </ul>
              <Link href={`/programs#${domain.slug}`} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                Explorer ce domaine <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-background/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">Les trois domaines font partie de la vision active. Les ressources, missions et activités concrètement disponibles sont publiées au fur et à mesure dans les espaces dédiés.</p>
          <Link href="/labs" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-foreground hover:text-primary">
            Consulter les activités <ArrowRight className="h-4 w-4 text-primary" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}

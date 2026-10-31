import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

const VALUES = [
  ["Apprendre ensemble", "Partager des ressources, des explications et des retours d'expérience."],
  ["Progresser par l'entraide", "Échanger des retours constructifs sur les exercices et les réalisations."],
  ["Construire en public", "Choisir de rendre visibles ses travaux et les compétences démontrées."],
  ["Accueillir les débutants", "Avancer à son rythme, quel que soit son point de départ."],
]

export function HomeCommunity() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <SectionHeading kicker="La communauté" title="On progresse mieux quand on construit ensemble." description="HashCode rassemble des personnes curieuses du numérique qui apprennent, expérimentent, partagent leurs connaissances et s'entraident." />
            <Link href="/community" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/50">
              Découvrir la communauté <ArrowRight className="h-4 w-4 text-primary" aria-hidden />
            </Link>
          </div>
          <ul className="grid content-center gap-px bg-border sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {VALUES.map(([title, description]) => (
              <li key={title} className="bg-card p-6 sm:p-8">
                <p className="font-syne text-base font-bold text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { ArrowUpRight, BadgeCheck, BookOpen, Compass, FlaskConical } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

const STEPS = [
  { icon: Compass, title: "Trouver sa direction", text: "Explore les domaines du numérique et identifie une direction cohérente avec tes intérêts.", href: "/programs", label: "Explorer les domaines" },
  { icon: BookOpen, title: "Apprendre avec méthode", text: "Construis tes bases à travers des ressources, des contenus et des parcours structurés.", href: "/academy", label: "Voir l'Academy" },
  { icon: FlaskConical, title: "Passer à la pratique", text: "Mets tes connaissances à l'épreuve avec des missions, des défis et des projets.", href: "/labs", label: "Découvrir les Labs" },
  { icon: BadgeCheck, title: "Montrer ce que tu sais faire", text: "Conserve tes réalisations et fais reconnaître les compétences effectivement démontrées.", href: "/talents", label: "Voir les talents" },
]

export function HomeWhatWeDo() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading kicker="Comment ça fonctionne" title="De la curiosité à la compétence démontrée." description="HashCode relie les étapes qui sont souvent dispersées : choisir une direction, apprendre, pratiquer et rendre ses progrès visibles." />
      <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <article key={step.title} className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
              <step.icon className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <h3 className="mt-6 font-syne text-xl font-bold text-foreground">{step.title}</h3>
            <p className="mt-3 min-h-[5.25rem] text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            <Link href={step.href} className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
              {step.label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

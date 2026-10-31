import Link from "next/link"
import { ArrowRight, CalendarClock, FlaskConical, ListChecks } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

const FORMATS = [
  { icon: ListChecks, title: "Missions guidées", text: "Des défis structurés pour avancer étape par étape, produire un livrable et apprendre à expliquer sa démarche." },
  { icon: CalendarClock, title: "Défis et activités", text: "Des exercices ponctuels pour explorer un outil, résoudre un problème et garder une pratique régulière." },
  { icon: FlaskConical, title: "Apprentissage par projet", text: "Transforme une idée en réalisation concrète : cadrage, conception, construction, documentation et présentation." },
]

export function HomeLabs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          <SectionHeading kicker="Apprendre en faisant" title="La connaissance prend de la valeur quand tu la mets en pratique." description="Les Labs donnent un cadre pour expérimenter, résoudre des problèmes et transformer les notions apprises en réalisations concrètes." />
          <Link href="/labs" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/50">
            Explorer les Labs <ArrowRight className="h-4 w-4 text-primary" aria-hidden />
          </Link>
        </div>
        <div className="space-y-3 lg:col-span-3">
          {FORMATS.map((format, index) => (
            <div key={format.title} className="flex gap-5 rounded-2xl border border-border bg-card p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <format.icon className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">Format 0{index + 1}</p>
                <h3 className="mt-1 font-syne text-lg font-bold text-foreground">{format.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{format.text}</p>
              </div>
            </div>
          ))}
          <p className="px-1 text-xs leading-relaxed text-muted-foreground">Le catalogue des activités évolue. La page Labs affiche les missions, défis et ateliers effectivement publiés.</p>
        </div>
      </div>
    </section>
  )
}

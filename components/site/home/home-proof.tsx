import Link from "next/link"
import { ArrowRight, Award, FileCheck2, UserCheck } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

const FORMS = [
  { icon: FileCheck2, title: "Réalisations examinées", text: "Les travaux soumis peuvent être relus et évalués selon les critères de l'activité concernée." },
  { icon: UserCheck, title: "Profils publics volontaires", text: "Les membres qui le souhaitent peuvent rendre visibles leur profil et leurs réalisations validées." },
  { icon: Award, title: "Certificats vérifiables", text: "Les certificats sont liés aux parcours et validations officiellement délivrés par l'Academy." },
]

export function HomeProof() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading align="center" kicker="La preuve avant la promesse" title="Ne te contente pas de dire ce que tu sais faire. Montre-le." description="Une compétence devient plus lisible lorsqu'elle s'appuie sur une réalisation concrète, un travail documenté et, lorsque le dispositif le prévoit, une validation." />
        <div className="mx-auto mt-11 grid max-w-4xl gap-4 md:grid-cols-3">
          {FORMS.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-background p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <h3 className="mt-4 font-syne text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/talents" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
            Découvrir les profils publics <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}

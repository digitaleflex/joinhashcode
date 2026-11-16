import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, FileCheck2, Lock, Users } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

export const metadata: Metadata = {
  title: "Pour les recruteurs",
  description: "Comment lire une preuve HashCode : un lab de cybersécurité réalisé, relu et validé avant d'apparaître sur un profil public.",
  alternates: { canonical: "/recruteurs" },
}

const GUARANTEES = [
  { icon: FileCheck2, title: "Une preuve = un lab validé", text: "Seules les soumissions validées après relecture apparaissent sur un profil. Une soumission refusée ou en attente n'est jamais affichée." },
  { icon: Users, title: "Relue par un pair ou l'équipe", text: "Le relecteur est soit un membre ayant déjà fait valider au moins 3 labs, soit l'équipe HashCode. Le retour de relecture est joint à la preuve." },
  { icon: Lock, title: "Visible seulement si le membre le décide", text: "Un profil est privé par défaut. Ce que vous voyez a été rendu public volontairement par la personne." },
]

const READING = [
  "Le titre du lab et son niveau : ce qui a été demandé.",
  "Le livrable : ce que la personne a produit (rapport, analyse, captures).",
  "Le retour du relecteur : ce qui a été jugé correct, ou à améliorer.",
  "La date de validation : la preuve est datée.",
]

export default function RecruteursPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <SectionHeading
          level={1}
          kicker="Pour les recruteurs"
          title="Lire une preuve HashCode en une minute."
          description="Nous formons des profils juniors francophones en cybersécurité (analyste SOC niveau 1). Chaque profil public liste des labs réalisés et validés, pas des compétences déclarées."
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {GUARANTEES.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <h2 className="mt-4 font-syne text-lg font-bold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-syne text-2xl font-bold text-foreground">Ce que contient une preuve</h2>
            <ul className="mt-5 space-y-3">
              {READING.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <figure className="rounded-2xl border border-dashed border-border bg-card p-6" aria-label="Exemple illustratif de preuve">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Exemple fictif, à titre d'illustration
            </p>
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-foreground">Analyser une alerte SOC</p>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-primary">Validé</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Niveau débutant · validé le 12/03/2027</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Livrable : rapport de triage d'une alerte (faux positif ou incident), avec la chronologie et les éléments qui justifient la décision.
              </p>
              <p className="mt-3 border-l-2 border-primary/40 pl-3 text-xs italic leading-relaxed text-muted-foreground">
                Retour du relecteur : « Décision justifiée et chronologie claire. À améliorer : citer la source de chaque indicateur. »
              </p>
            </div>
            <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Cet exemple n'est pas celui d'un vrai membre. Les profils réels sont sur la page{" "}
              <Link href="/talents" className="font-semibold text-primary hover:underline">Preuves</Link>.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="font-syne text-2xl font-bold text-foreground">Vous recrutez des analystes juniors ?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Dites-nous ce que vous cherchez. Nous voulons savoir si ces preuves vous aideraient à présélectionner des candidats.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
              Nous écrire <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/talents" className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-bold text-foreground hover:border-primary/50">
              Voir les profils publics
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

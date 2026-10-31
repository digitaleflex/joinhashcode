import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BadgeCheck, BookOpen, Compass, FlaskConical, Users } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvre la mission, la vision et les principes de HashCode, un écosystème communautaire dédié à l'évolution des talents numériques.",
}

const PRINCIPLES = [
  { title: "Curiosité", text: "Chaque progression commence par une question et l'envie de comprendre." },
  { title: "Pratique", text: "Comprendre un concept et savoir l'appliquer sont deux étapes différentes." },
  { title: "Preuve", text: "Les réalisations et les compétences démontrées comptent davantage que les déclarations." },
  { title: "Collaboration", text: "Le partage de connaissances et l'entraide font progresser tout le monde." },
  { title: "Progression", text: "L'expertise se construit dans la durée, par l'apprentissage et l'expérimentation." },
]

const ECOSYSTEM = [
  { icon: Compass, title: "Orientation", text: "Explorer les domaines et clarifier sa direction.", href: "/programs" },
  { icon: BookOpen, title: "Academy", text: "Accéder aux ressources et contenus pédagogiques publiés.", href: "/academy" },
  { icon: FlaskConical, title: "Labs", text: "Pratiquer à travers les missions, défis et ateliers disponibles.", href: "/labs" },
  { icon: BadgeCheck, title: "Réalisations", text: "Conserver ses travaux et rendre visibles les compétences validées.", href: "/talents" },
  { icon: Users, title: "Communauté", text: "Échanger, apprendre ensemble et contribuer à l'écosystème.", href: "/community" },
]

export default function AboutPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">À propos de HashCode</p>
        <h1 className="mt-4 max-w-4xl font-syne text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
          Faire grandir les talents par la pratique et le partage.
        </h1>
        <div className="mt-7 grid gap-8 lg:grid-cols-2">
          <p className="text-lg leading-relaxed text-muted-foreground">
            HashCode est un écosystème communautaire et numérique qui aide les personnes à découvrir leur voie, développer leurs compétences et construire des réalisations concrètes.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Nous partons d'une conviction simple : apprendre ne consiste pas seulement à consommer des contenus. Il faut expérimenter, résoudre des problèmes, documenter son travail et pouvoir montrer ce que l'on sait faire.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading kicker="Notre mission" title="Rendre l'évolution numérique plus concrète." />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Donner aux talents un cadre pour apprendre, pratiquer, partager leurs connaissances et rendre leurs compétences plus visibles, quel que soit leur point de départ.
            </p>
          </div>
          <div>
            <SectionHeading kicker="Notre vision" title="Des compétences qui se voient dans les réalisations." />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Construire un écosystème où les personnes progressent dans le développement web, la cybersécurité et l'intelligence artificielle appliquée, puis peuvent présenter des preuves concrètes de leur travail.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading kicker="Notre approche" title="Un chemin simple, de la découverte à la réalisation." description="La plateforme relie les étapes essentielles sans multiplier les comptes, les espaces ou les systèmes parallèles." />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["01", "Découvrir", "Explorer les domaines et ses intérêts."],
            ["02", "Apprendre", "Construire des bases solides."],
            ["03", "Pratiquer", "Résoudre des problèmes et réaliser des projets."],
            ["04", "Démontrer", "Documenter son travail et obtenir des retours."],
            ["05", "Évoluer", "Partager ses progrès et découvrir la suite."],
          ].map(([number, title, description]) => (
            <article key={number} className="rounded-2xl border border-border bg-card p-5">
              <span className="font-mono text-xs font-bold text-primary">{number}</span>
              <h3 className="mt-4 font-syne text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading kicker="Nos principes" title="Ce qui guide nos choix." description="Cinq principes orientent la conception du produit et la vie de la communauté." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((principle, index) => (
              <article key={principle.title} className="rounded-2xl border border-border bg-background p-6">
                <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
                <h3 className="mt-3 font-syne text-lg font-bold text-foreground">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading kicker="L'écosystème" title="Des espaces complémentaires, une expérience cohérente." description="Chaque espace répond à un besoin précis. Les contenus et fonctionnalités disponibles sont consultables directement, sans promesse artificielle." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-6">
              <item.icon className="h-6 w-6 text-primary" aria-hidden />
              <h3 className="mt-4 font-syne text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              <Link href={item.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                Découvrir <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

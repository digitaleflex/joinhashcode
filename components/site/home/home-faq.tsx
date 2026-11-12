const FAQS = [
  {
    question: "À qui s'adresse HashCode ?",
    answer: "Aux débutants, aux autodidactes, aux étudiants et aux profils qui souhaitent développer ou réorienter leurs compétences dans le numérique. Tu peux commencer par explorer les domaines et choisir une première étape adaptée à ton niveau.",
  },
  {
    question: "Quels domaines sont couverts ?",
    answer: "La vision active de HashCode couvre le développement web, la cybersécurité et l'intelligence artificielle appliquée. Les ressources et activités publiées peuvent avoir des niveaux de disponibilité différents selon le domaine.",
  },
  {
    question: "Faut-il déjà savoir coder ?",
    answer: "Non. L'objectif est aussi d'aider les personnes qui découvrent ces sujets à trouver un point de départ. Certaines activités peuvent toutefois demander des prérequis : ils doivent être indiqués sur leur fiche.",
  },
  {
    question: "Comment se déroule la progression ?",
    answer: "Tu explores un domaine, apprends à partir des ressources disponibles, pratiques avec des activités ou des projets, puis conserves tes réalisations. Lorsqu'une activité prévoit une évaluation, les critères et le statut de validation doivent être clairement indiqués.",
  },
  {
    question: "L'accès est-il payant ?",
    answer: "L'accès communautaire et les parcours proposés par HashCode restent gratuits selon les règles actuelles du projet. Les éventuelles prestations humaines spécifiques sont distinctes et leurs conditions sont communiquées avant tout engagement.",
  },
  {
    question: "HashCode remplace-t-il les groupes communautaires ?",
    answer: "Non. La plateforme structure les parcours, les ressources et les réalisations. Les espaces communautaires restent complémentaires pour les échanges, l'entraide et les rendez-vous.",
  },
]

export function HomeFaq() {
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">Questions fréquentes</p>
          <h2 className="mt-3 font-syne text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Avant de commencer.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Quelques repères pour comprendre le fonctionnement de HashCode et savoir à quoi t'attendre.
          </p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {FAQS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground marker:content-none">
                {item.question}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="max-w-2xl pt-3 pr-10 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

const FAQS = [
  {
    question: "À qui s'adresse HashCode ?",
    answer: "Aux débutants, autodidactes, étudiants et personnes en reconversion qui visent un premier poste en cybersécurité, par exemple analyste SOC junior, et qui veulent une preuve concrète de ce qu'ils savent faire.",
  },
  {
    question: "Qu'est-ce qu'une preuve ?",
    answer: "C'est un lab que tu as réalisé, soumis et fait valider après relecture. Elle apparaît sur ton profil public, avec ce que tu as produit. Une soumission non validée n'est jamais affichée.",
  },
  {
    question: "Qui relit mon travail ?",
    answer: "Un membre qui a déjà fait valider au moins 3 labs, ou l'équipe HashCode. Tu peux à ton tour relire les autres une fois ce seuil atteint.",
  },
  {
    question: "Mon profil est-il public ?",
    answer: "Non, pas par défaut. Tu choisis de le rendre visible dans tes paramètres, et tu peux revenir en arrière à tout moment.",
  },
  {
    question: "Faut-il déjà savoir faire de la cybersécurité ?",
    answer: "Non. Les premiers labs sont pensés pour les débutants. Les prérequis éventuels sont indiqués sur chaque fiche.",
  },
  {
    question: "Et le développement web ou l'IA ?",
    answer: "Le focus actuel est la cybersécurité. Les autres domaines restent consultables, mais ce sont les labs cyber qui mènent à une preuve publique.",
  },
  {
    question: "L'accès est-il payant ?",
    answer: "Non. L'accès aux labs et à la relecture est gratuit.",
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

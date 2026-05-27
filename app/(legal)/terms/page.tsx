import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Les règles d'utilisation de la plateforme HASHCODE Community.",
}

const LAST_UPDATED = "27 mai 2026"
const CONTACT_EMAIL = "legal@joinhashcode.com"
const COMPANY = "HASHCODE"

export default function TermsPage() {
  return (
    <article className="prose prose-invert prose-sm max-w-none space-y-10">
      <header className="space-y-3 border-b border-white/5 pb-8">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Document légal</p>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
          Conditions Générales <span className="text-primary">d'Utilisation</span>
        </h1>
        <p className="text-zinc-500 text-sm">Dernière mise à jour : {LAST_UPDATED}</p>
      </header>

      <Section title="1. Objet">
        <p>
          Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation
          de la plateforme {COMPANY} (ci-après « la Plateforme »), accessible à l'adresse joinhashcode.com.
          En créant un compte ou en utilisant la Plateforme, vous acceptez sans réserve les présentes CGU.
        </p>
      </Section>

      <Section title="2. Accès à la plateforme">
        <p>
          L'accès à la Plateforme est réservé aux personnes physiques majeures (18 ans ou plus) ou mineures
          avec l'accord de leur représentant légal. L'inscription est actuellement soumise à un système de
          clé d'accès bêta (Beta Key). {COMPANY} se réserve le droit de modifier les conditions d'accès à tout moment.
        </p>
        <p>
          Vous êtes responsable de la confidentialité de vos identifiants de connexion. Tout accès à votre
          compte avec vos identifiants est présumé effectué par vous.
        </p>
      </Section>

      <Section title="3. Compte utilisateur">
        <ul>
          <li>Vous vous engagez à fournir des informations exactes lors de la création de votre compte.</li>
          <li>Un seul compte par personne est autorisé.</li>
          <li>Vous pouvez supprimer votre compte à tout moment depuis les Paramètres.</li>
          <li>
            {COMPANY} se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU,
            comportement abusif, ou activité frauduleuse.
          </li>
        </ul>
      </Section>

      <Section title="4. Règles de conduite">
        <p>En utilisant la Plateforme, vous vous engagez à :</p>
        <ul>
          <li>Respecter les autres membres de la communauté.</li>
          <li>Ne pas publier de contenu illégal, diffamatoire, haineux, obscène ou portant atteinte aux droits de tiers.</li>
          <li>Ne pas tenter d'accéder à des comptes ou données qui ne vous appartiennent pas.</li>
          <li>Ne pas utiliser de robots, scripts ou tout autre moyen automatisé pour interagir avec la Plateforme sans autorisation préalable.</li>
          <li>Ne pas perturber le fonctionnement de la Plateforme (attaques DoS, injection, etc.).</li>
          <li>Ne pas usurper l'identité d'une autre personne ou organisation.</li>
        </ul>
      </Section>

      <Section title="5. Contenu et propriété intellectuelle">
        <p>
          Tout contenu publié sur la Plateforme (missions, textes, éléments visuels) est la propriété de {COMPANY}
          ou de ses partenaires, protégé par le droit de la propriété intellectuelle. Toute reproduction
          sans autorisation écrite est interdite.
        </p>
        <p>
          En soumettant du contenu sur la Plateforme (notamment les soumissions de missions), vous accordez à {COMPANY}
          une licence non-exclusive, mondiale et gratuite pour utiliser, afficher et reproduire ce contenu
          dans le cadre du service.
        </p>
      </Section>

      <Section title="6. Système de progression et récompenses">
        <p>
          Les points d'expérience (XP), niveaux, badges et scores affichés sur votre profil sont des éléments
          virtuels propres à la Plateforme. Ils n'ont aucune valeur monétaire et ne peuvent être échangés,
          transférés ou convertis. {COMPANY} se réserve le droit de modifier le système de progression à tout moment.
        </p>
      </Section>

      <Section title="7. Escouades (Squads)">
        <p>
          Les Squads sont des groupes de 5 membres maximum. Le créateur d'une Squad en devient automatiquement
          le Leader. {COMPANY} n'est pas responsable des relations entre membres au sein d'une Squad.
          Tout membre peut quitter une Squad à tout moment.
        </p>
      </Section>

      <Section title="8. Disponibilité du service">
        <p>
          {COMPANY} fait ses meilleurs efforts pour assurer la disponibilité de la Plateforme 24h/24 et 7j/7.
          Cependant, des interruptions pour maintenance, mise à jour ou incidents techniques peuvent survenir.
          {COMPANY} ne saurait être tenu responsable de pertes liées à une indisponibilité du service.
        </p>
      </Section>

      <Section title="9. Limitation de responsabilité">
        <p>
          La Plateforme est fournie « en l'état ». Dans les limites autorisées par la loi applicable, {COMPANY}
          décline toute garantie implicite de qualité marchande ou d'adéquation à un usage particulier.
          {COMPANY} ne saurait être tenu responsable de dommages indirects, pertes de données ou manque à gagner
          résultant de l'utilisation ou de l'impossibilité d'utiliser la Plateforme.
        </p>
      </Section>

      <Section title="10. Modification des CGU">
        <p>
          {COMPANY} se réserve le droit de modifier les présentes CGU à tout moment. En cas de modification
          substantielle, les utilisateurs seront informés par e-mail ou notification sur la Plateforme au moins
          15 jours avant l'entrée en vigueur des nouvelles conditions. La poursuite de l'utilisation du service
          après ce délai vaut acceptation des nouvelles CGU.
        </p>
      </Section>

      <Section title="11. Résiliation">
        <p>
          Chaque partie peut mettre fin à la relation contractuelle à tout moment : vous en supprimant votre compte,
          {COMPANY} en suspendant ou supprimant votre accès en cas de violation des présentes CGU.
        </p>
      </Section>

      <Section title="12. Droit applicable et juridiction">
        <p>
          Les présentes CGU sont régies par le droit français. En cas de litige, les parties s'engagent à
          rechercher une solution amiable avant tout recours judiciaire. À défaut, les tribunaux compétents
          seront ceux du ressort du siège social de {COMPANY}.
        </p>
      </Section>

      <Section title="13. Contact">
        <p>
          Pour toute question relative aux présentes CGU, contactez-nous à :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">{CONTACT_EMAIL}</a>
        </p>
      </Section>

      <footer className="border-t border-white/5 pt-8 text-zinc-600 text-[11px] font-mono">
        © {new Date().getFullYear()} {COMPANY} — Tous droits réservés ·{" "}
        <a href="/privacy" className="hover:text-primary transition-colors">Politique de confidentialité</a>
      </footer>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-black uppercase tracking-tight text-white">{title}</h2>
      <div className="text-zinc-400 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

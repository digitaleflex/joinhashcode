import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: "Comment HASHCODE collecte, utilise et protège vos données personnelles.",
}

const LAST_UPDATED = "27 mai 2026"
const CONTACT_EMAIL = "privacy@joinhashcode.com"
const COMPANY = "HASHCODE"

export default function PrivacyPage() {
  return (
    <article className="prose prose-invert prose-sm max-w-none space-y-10">
      <header className="space-y-3 border-b border-white/5 pb-8">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Document légal</p>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
          Politique de <span className="text-primary">Confidentialité</span>
        </h1>
        <p className="text-zinc-500 text-sm">Dernière mise à jour : {LAST_UPDATED}</p>
      </header>

      <Section title="1. Qui sommes-nous ?">
        <p>
          {COMPANY} (ci-après « nous » ou « la Plateforme ») est une communauté en ligne dédiée à l'évolution des talents
          technologiques. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons
          vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD – UE 2016/679)
          et aux législations locales applicables.
        </p>
        <p>
          Pour toute question relative à vos données, contactez-nous à :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">{CONTACT_EMAIL}</a>
        </p>
      </Section>

      <Section title="2. Données collectées">
        <p>Nous collectons les catégories de données suivantes :</p>
        <ul>
          <li><strong>Données d'identité :</strong> nom, pseudo, adresse e-mail, photo de profil.</li>
          <li><strong>Données de localisation :</strong> pays, ville (renseignés volontairement).</li>
          <li><strong>Données de profil professionnel :</strong> niveau technique, domaines d'expertise, stack technologique, URL GitHub/portfolio, situation professionnelle actuelle.</li>
          <li><strong>Données comportementales (psychométriques) :</strong> scores Builder, Créateur, Stratège, Catalyseur issus du quiz d'onboarding. Ces données sont utilisées pour vous orienter vers la communauté la plus adaptée.</li>
          <li><strong>Données de progression :</strong> niveau XP, missions complétées, badges, activité quotidienne (check-ins).</li>
          <li><strong>Données de navigation :</strong> logs d'activité (actions effectuées sur la plateforme, adresses IP, user-agent) conservés à des fins de sécurité et d'amélioration du service.</li>
          <li><strong>Données de paiement :</strong> nous ne stockons aucune donnée bancaire — tout paiement éventuel est géré par un prestataire tiers certifié PCI-DSS.</li>
        </ul>
      </Section>

      <Section title="3. Finalités et bases légales du traitement">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 pr-4 text-zinc-400 font-mono text-[10px] uppercase">Finalité</th>
              <th className="text-left py-2 text-zinc-400 font-mono text-[10px] uppercase">Base légale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-400">
            <tr><td className="py-2 pr-4">Création et gestion du compte</td><td className="py-2">Exécution du contrat</td></tr>
            <tr><td className="py-2 pr-4">Orientation vers une classe de profil</td><td className="py-2">Consentement (quiz)</td></tr>
            <tr><td className="py-2 pr-4">Envoi d'e-mails transactionnels (OTP, magic link)</td><td className="py-2">Exécution du contrat</td></tr>
            <tr><td className="py-2 pr-4">Envoi de rappels et notifications d'engagement</td><td className="py-2">Intérêt légitime</td></tr>
            <tr><td className="py-2 pr-4">Amélioration de la plateforme (analytics)</td><td className="py-2">Consentement (bandeau cookies)</td></tr>
            <tr><td className="py-2 pr-4">Sécurité et prévention des abus</td><td className="py-2">Obligation légale / intérêt légitime</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="4. Durée de conservation">
        <ul>
          <li><strong>Données de compte actif :</strong> conservées tant que le compte est actif.</li>
          <li><strong>Logs d'activité :</strong> supprimés automatiquement après 90 jours.</li>
          <li><strong>Compte supprimé :</strong> toutes les données personnelles sont effacées dans un délai de 30 jours suivant la suppression du compte, sauf obligation légale de conservation.</li>
          <li><strong>Invitations expirées :</strong> supprimées automatiquement à l'expiration.</li>
        </ul>
      </Section>

      <Section title="5. Partage des données">
        <p>Nous ne vendons jamais vos données. Elles peuvent être partagées avec :</p>
        <ul>
          <li><strong>Prestataires techniques :</strong> hébergement (VPS Hostinger), envoi d'e-mails (Resend), file de messages (Upstash QStash), authentification sociale (Google, GitHub).</li>
          <li><strong>Autorités légales :</strong> uniquement en cas d'obligation légale ou d'injonction judiciaire.</li>
        </ul>
        <p>Tous nos sous-traitants sont contractuellement engagés à respecter la confidentialité et la sécurité de vos données.</p>
      </Section>

      <Section title="6. Vos droits (RGPD)">
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles.</li>
          <li><strong>Droit de rectification :</strong> corriger des données inexactes (via Paramètres).</li>
          <li><strong>Droit à l'effacement :</strong> supprimer votre compte et toutes vos données (via Paramètres → Supprimer mon compte).</li>
          <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré.</li>
          <li><strong>Droit d'opposition :</strong> vous opposer au traitement basé sur l'intérêt légitime.</li>
          <li><strong>Droit au retrait du consentement :</strong> à tout moment, sans conséquence sur les traitements antérieurs.</li>
        </ul>
        <p>
          Pour exercer ces droits, envoyez un e-mail à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">{CONTACT_EMAIL}</a>.
          Nous répondons dans un délai maximum de 30 jours.
        </p>
        <p>
          Vous disposez également du droit d'introduire une réclamation auprès de l'autorité de protection des données
          compétente dans votre pays de résidence.
        </p>
      </Section>

      <Section title="7. Sécurité">
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles adaptées : chiffrement HTTPS (HSTS),
          cookies sécurisés (HttpOnly, SameSite), rate limiting sur les endpoints d'authentification,
          Content Security Policy, et accès à la base de données restreint au réseau interne.
        </p>
      </Section>

      <Section title="8. Cookies">
        <p>
          Nous utilisons uniquement des cookies strictement nécessaires au fonctionnement de la session (authentification).
          Les cookies d'analyse sont déposés uniquement après votre consentement explicite via le bandeau dédié.
          Vous pouvez retirer ce consentement à tout moment depuis le bandeau ou les paramètres de votre navigateur.
        </p>
      </Section>

      <Section title="9. Modifications">
        <p>
          Nous pouvons mettre à jour cette politique à tout moment. En cas de modification substantielle,
          nous vous en informerons par e-mail ou via une notification sur la plateforme.
          La date de dernière mise à jour est indiquée en haut de ce document.
        </p>
      </Section>

      <footer className="border-t border-white/5 pt-8 text-zinc-600 text-[11px] font-mono">
        © {new Date().getFullYear()} {COMPANY} — Tous droits réservés ·{" "}
        <a href="/terms" className="hover:text-primary transition-colors">Conditions d'utilisation</a>
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

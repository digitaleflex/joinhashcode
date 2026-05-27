"use client"

import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Nav />

      <div className="pt-8 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-6 sm:mb-8">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase text-primary text-glow">
              Service_Protocol_v1.2
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-8 sm:mb-12">
            Conditions <span className="text-primary">Générales</span>.
          </h1>

          <div className="prose prose-invert prose-zinc max-w-none space-y-12 text-zinc-400">

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">01.</span>
                Objet & Acceptation
              </h2>
              <p className="leading-relaxed">
                Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation
                de la plateforme HASHCODE, accessible à l&apos;adresse joinhashcode.com. En créant un compte ou en
                utilisant la Plateforme, vous acceptez sans réserve les présentes CGU.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">02.</span>
                Accès à la Plateforme
              </h2>
              <p className="leading-relaxed">
                L&apos;accès est réservé aux personnes majeures (18 ans ou plus) ou mineures avec accord parental.
                L&apos;inscription est actuellement soumise à un système de clé d&apos;accès bêta. HASHCODE se réserve le
                droit de modifier les conditions d&apos;accès à tout moment.
              </p>
              <p className="leading-relaxed">
                Vous êtes responsable de la confidentialité de vos identifiants. Tout accès avec vos credentials
                est présumé effectué par vous.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">03.</span>
                Règles de Conduite
              </h2>
              <p className="leading-relaxed">En utilisant la Plateforme, vous vous engagez à :</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Respecter les autres membres de la communauté.</li>
                <li>Ne pas publier de contenu illégal, diffamatoire ou haineux.</li>
                <li>Ne pas utiliser de robots, scripts ou tout moyen automatisé sans autorisation (automation, scripts de triche) — tout comportement de ce type entraînera une suspension immédiate.</li>
                <li>Ne pas tenter d&apos;accéder à des comptes ou données qui ne vous appartiennent pas.</li>
                <li>Ne pas perturber le fonctionnement de la Plateforme (DoS, injection, etc.).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">04.</span>
                Propriété Intellectuelle
              </h2>
              <p className="leading-relaxed">
                Le code que vous soumettez lors des missions reste votre propriété. HASHCODE détient la propriété
                exclusive des algorithmes d&apos;évaluation, des designs de l&apos;interface, du concept de &quot;Confidence Score&quot;
                et de l&apos;ensemble du contenu éditorial de la Plateforme. Toute reproduction sans autorisation écrite est interdite.
              </p>
              <p className="leading-relaxed">
                En soumettant du contenu (notamment les soumissions de missions), vous accordez à HASHCODE une
                licence non-exclusive et gratuite pour l&apos;utiliser dans le cadre du service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">05.</span>
                Système de Progression & Récompenses
              </h2>
              <p className="leading-relaxed">
                Les points d&apos;expérience (XP), niveaux, badges et scores sont des éléments virtuels sans valeur
                monétaire — ils ne peuvent être ni échangés, ni transférés, ni convertis. HASHCODE se réserve le
                droit de modifier le système de progression et les conditions d&apos;accès aux Guildes pour garantir
                l&apos;excellence de la communauté.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">06.</span>
                Escouades (Squads)
              </h2>
              <p className="leading-relaxed">
                Les Squads sont des groupes de 5 membres maximum. Le créateur en devient le Leader. HASHCODE
                n&apos;est pas responsable des relations entre membres. Tout membre peut quitter une Squad à tout moment.
                Le Leader peut personnaliser le nom et le lien d&apos;invitation dans les limites définies par la Plateforme.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">07.</span>
                Disponibilité du Service
              </h2>
              <p className="leading-relaxed">
                HASHCODE fait ses meilleurs efforts pour assurer la disponibilité 24h/24. Des interruptions pour
                maintenance ou incidents techniques peuvent survenir sans préavis. HASHCODE ne saurait être tenu
                responsable de pertes liées à une indisponibilité.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">08.</span>
                Limitation de Responsabilité
              </h2>
              <p className="leading-relaxed">
                La Plateforme est fournie &quot;en l&apos;état&quot;. Dans les limites autorisées par la loi, HASHCODE décline
                toute garantie implicite et ne saurait être tenu responsable de dommages indirects, perte de données
                ou manque à gagner résultant de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser la Plateforme.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">09.</span>
                Modification des CGU
              </h2>
              <p className="leading-relaxed">
                HASHCODE se réserve le droit de modifier les présentes CGU à tout moment. En cas de modification
                substantielle, les utilisateurs seront informés par e-mail au moins 15 jours avant l&apos;entrée en vigueur.
                La poursuite de l&apos;utilisation du service vaut acceptation des nouvelles CGU.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">10.</span>
                Droit Applicable
              </h2>
              <p className="leading-relaxed">
                Les présentes CGU sont régies par le droit français. En cas de litige, les parties s&apos;engagent
                à rechercher une solution amiable avant tout recours judiciaire.
              </p>
            </section>

            <section className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 border-dashed space-y-2">
              <p className="text-sm italic">
                Dernière mise à jour : 27 mai 2026.
              </p>
              <p className="text-sm">
                Contact :{" "}
                <a href="mailto:legal@joinhashcode.com" className="text-primary hover:underline">
                  legal@joinhashcode.com
                </a>
                {" · "}
                <a href="/privacy" className="text-primary hover:underline">
                  Politique de confidentialité
                </a>
              </p>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

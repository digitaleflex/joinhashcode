"use client"

import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Nav />
      
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary text-glow">
              Service_Protocol_v1.0
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-12">
            Conditions <span className="text-primary">Générales</span>.
          </h1>

          <div className="prose prose-invert prose-zinc max-w-none space-y-12 text-zinc-400">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">01.</span>
                Acceptation du Protocole
              </h2>
              <p className="leading-relaxed">
                En accédant à HASHCODE, vous acceptez de vous soumettre à nos règles de fonctionnement. La plateforme est un environnement d'apprentissage et de validation technique. Tout comportement visant à fausser les résultats du profilage (automatisation, scripts de triche) entraînera une suspension immédiate.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">02.</span>
                Accès et Sécurité
              </h2>
              <p className="leading-relaxed">
                Vous êtes responsable de la sécurité de votre compte et de vos clés d'accès. HASHCODE fournit l'infrastructure, mais la protection de votre identité de Builder repose sur votre vigilance.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">03.</span>
                Propriété Intellectuelle
              </h2>
              <p className="leading-relaxed">
                Le code que vous soumettez lors des missions reste votre propriété. HASHCODE détient la propriété exclusive des algorithmes de profilage, des designs de l'interface et du concept de "Confidence Score".
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">04.</span>
                Évolutivité du Système
              </h2>
              <p className="leading-relaxed">
                HASHCODE est un organisme vivant. Nous nous réservons le droit de modifier les paramètres du système de progression et les conditions d'accès aux Guildes pour garantir l'excellence technique globale de la communauté.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

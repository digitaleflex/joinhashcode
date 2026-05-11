"use client"

import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Nav />
      
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary text-glow">
              Privacy_Protocol_v1.0
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-12">
            Politique de <span className="text-primary">Confidentialité</span>.
          </h1>

          <div className="prose prose-invert prose-zinc max-w-none space-y-12 text-zinc-400">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">01.</span>
                Collecte des Données
              </h2>
              <p className="leading-relaxed">
                HASHCODE collecte des données nécessaires à la personnalisation de votre expérience technique. Cela inclut vos informations d'identification (email, nom), mais également des **données comportementales spécifiques** : temps de réponse lors du quiz initial, choix d'arbitrage dans les missions, et fréquence d'activité sur le dashboard.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">02.</span>
                Finalité du Profilage
              </h2>
              <p className="leading-relaxed">
                Vos données ne sont jamais vendues à des tiers. Elles sont exclusivement utilisées par notre moteur d'évolution pour calculer votre **Confidence Score** et votre **Profile Drift**. L'objectif est de vous proposer des missions et des opportunités au sein des Guildes qui correspondent réellement à votre niveau de compétence et à votre profil de Builder.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">03.</span>
                Sécurité et Stockage
              </h2>
              <p className="leading-relaxed">
                Toutes les données sont stockées de manière sécurisée via des protocoles de chiffrement de pointe. L'accès à vos données sensibles est protégé par un système de Row-Level Security (RLS) strict, garantissant que vous seul pouvez accéder à vos vecteurs comportementaux détaillés.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-primary font-mono text-sm">04.</span>
                Vos Droits (Droit à l'Oubli)
              </h2>
              <p className="leading-relaxed">
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. À tout moment, vous pouvez demander la clôture de votre compte et la purge complète de vos données de profilage depuis vos paramètres ou via notre Hub de Transmission.
              </p>
            </section>

            <section className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 border-dashed">
              <p className="text-sm italic">
                Dernière mise à jour du protocole : 11 Mai 2026. HASHCODE s'engage à une transparence totale sur l'utilisation de l'intelligence artificielle dans le traitement de vos données.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

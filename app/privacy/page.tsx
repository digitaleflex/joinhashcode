"use client"

import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { motion } from "framer-motion"
import { Shield, Database, Fingerprint, Lock, Trash2, Mail } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Nav />
      
      <div className="pt-8 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-6 sm:mb-8"
          >
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase text-primary text-glow">
              Politique de confidentialité
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight mb-8 sm:mb-12"
          >
            Politique de <span className="text-primary">Confidentialité</span>.
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert prose-zinc max-w-none space-y-16 text-zinc-400"
          >
            {/* 1. Introduction */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                1. Introduction & Vision
              </h2>
              <p className="leading-relaxed">
                Chez HASHCODE, la confiance est le socle de notre écosystème. Nous croyons en une transparence totale sur la manière dont nous traitons vos données. Cette politique détaille nos engagements pour protéger votre vie privée tout en vous offrant l&apos;infrastructure nécessaire à votre évolution technologique.
              </p>
            </section>

            {/* 2. Données collectées */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Database className="w-5 h-5 text-primary" />
                2. Données Collectées
              </h2>
              <p className="leading-relaxed">
                Nous collectons uniquement les informations nécessaires à la fourniture de nos services :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-zinc-200">Identification :</strong> Email, nom et informations provenant de vos fournisseurs d&apos;authentification (GitHub, Google).</li>
                <li><strong className="text-zinc-200">Activité :</strong> Progression dans les missions, interactions avec la plateforme et utilisation des outils.</li>
                <li><strong className="text-zinc-200">Comportementales :</strong> Réponses au quiz d&apos;entrée, temps de réflexion et signaux d&apos;engagement.</li>
              </ul>
            </section>

            {/* 3. Utilisation des données */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-primary" />
                3. Système de Personnalisation Pédagogique
              </h2>
              <p className="leading-relaxed">
                HASHCODE utilise vos signaux comportementaux et vos interactions produit exclusivement pour :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-zinc-200">Personnaliser votre expérience d&apos;apprentissage</strong> en adaptant le contenu à votre rythme.</li>
                <li><strong className="text-zinc-200">Recommander des parcours</strong> et des guildes alignés avec vos objectifs de Builder.</li>
                <li><strong className="text-zinc-200">Calculer votre progression technique</strong> via des indicateurs comme le Confidence Score.</li>
              </ul>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary/90 italic">
                  Note : Nous n&apos;analysons pas votre psychologie. Nous analysons vos interactions produit pour optimiser votre orientation pédagogique.
                </p>
              </div>
            </section>

            {/* 4. Cookies */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Database className="w-5 h-5 text-primary" />
                4. Utilisation des Cookies
              </h2>
              <p className="leading-relaxed">
                HASHCODE utilise des cookies pour assurer le bon fonctionnement technique de l&apos;infrastructure :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-zinc-200">Cookies Essentiels :</strong> Nécessaires à l&apos;authentification (maintien de votre session sécurisée). Ils ne peuvent pas être désactivés.</li>
                <li><strong className="text-zinc-200">Cookies Analytiques :</strong> Utilisés pour comprendre comment les bâtisseurs utilisent la plateforme et identifier les bugs potentiels.</li>
              </ul>
              <p className="text-sm">
                Vous pouvez gérer vos préférences de cookies à tout moment via la bannière de consentement présente lors de votre première visite.
              </p>
            </section>

            {/* 5. Sécurité */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                5. Sécurité & Infrastructure
              </h2>
              <p className="leading-relaxed">
                Vos données sont stockées sur une infrastructure privée et souveraine (Serveur Privé Virtuel - VPS) utilisant une base de données PostgreSQL sécurisée. L&apos;infrastructure est protégée par des pare-feux, des protocoles de chiffrement de pointe et des sauvegardes régulières. L&apos;accès est restreint au personnel autorisé et aux systèmes automatisés de personnalisation.
              </p>
            </section>

            {/* 6. Droits utilisateur */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-primary" />
                6. Vos Droits & Contrôle
              </h2>
              <p className="leading-relaxed">
                Vous restez maître de vos données à tout moment :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-zinc-200">Droit à l&apos;Oubli :</strong> Vous pouvez demander la suppression complète de votre compte et de toutes les données associées.</li>
                <li><strong className="text-zinc-200">Droit d&apos;Export :</strong> Vous pouvez demander une copie de vos données d&apos;activité et d&apos;évaluation.</li>
                <li><strong className="text-zinc-200">Analytics :</strong> Vous pouvez choisir de limiter la collecte de données analytiques via vos réglages.</li>
              </ul>
            </section>

            {/* 7. Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                7. Contact & Transmission
              </h2>
              <p className="leading-relaxed">
                Pour toute question concernant le traitement de vos données ou pour exercer vos droits, contactez-nous via le Hub de Transmission : <a href="mailto:privacy@joinhashcode.com" className="text-primary hover:underline">privacy@joinhashcode.com</a>
              </p>
            </section>

            <section className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 border-dashed">
              <p className="text-sm italic">
                Dernière mise à jour : 25 Mai 2026. HASHCODE s&apos;engage à maintenir une documentation humaine, lisible et premium, à l&apos;image de sa plateforme.
              </p>
            </section>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

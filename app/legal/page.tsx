"use client"

import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { motion } from "framer-motion"
import { Scale, MapPin, Globe, ShieldCheck } from "lucide-react"

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Nav />
      
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary text-glow">
              Legal_Notice_v1.0
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-12"
          >
            Mentions <span className="text-primary">Légales</span>.
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert prose-zinc max-w-none space-y-16 text-zinc-400"
          >
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Scale className="w-5 h-5 text-primary" />
                Édition du site
              </h2>
              <p className="leading-relaxed">
                Le site <span className="text-zinc-200">joinhashcode.com</span> est édité par l&apos;organisation HASHCODE, opérant en tant qu&apos;infrastructure de progression technologique dématérialisée.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                Hébergement
              </h2>
              <p className="leading-relaxed">
                Le site est hébergé par <span className="text-zinc-200">Vercel Inc.</span>, situé au 340 S Lemon Ave #4133 Walnut, CA 91789, États-Unis.
                Les bases de données sont opérées par <span className="text-zinc-200">Supabase Inc.</span>, garantissant une haute disponibilité et une sécurité des données par défaut.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Propriété Intellectuelle
              </h2>
              <p className="leading-relaxed">
                L&apos;ensemble des éléments constituant le site (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, noms, logos, marques, créations et œuvres protégeables diverses, bases de données, etc.) ainsi que le site lui-même relèvent des législations internationales sur le droit d&apos;auteur et la propriété intellectuelle.
              </p>
            </section>

            <section className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 border-dashed">
              <p className="text-sm italic">
                HASHCODE est un projet tourné vers l&apos;avenir. Nous nous efforçons de maintenir ces informations à jour pour garantir une transparence totale envers nos Builders.
              </p>
            </section>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

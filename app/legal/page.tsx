"use client"

import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { motion } from "framer-motion"
import { Info, Globe, Mail, Landmark } from "lucide-react"

export default function LegalPage() {
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
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary text-glow">
              Legal_Notice_v1.0
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight mb-8 sm:mb-12"
          >
            Mentions <span className="text-primary">Légales</span>.
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert prose-zinc max-w-none space-y-16 text-zinc-400"
          >
            {/* 1. Éditeur du site */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Landmark className="w-5 h-5 text-primary" />
                1. Éditeur du Site
              </h2>
              <p className="leading-relaxed">
                Le site HASHCODE est édité par :
                <br />
                <strong className="text-zinc-200">Hashcode Community</strong>
                <br />
                Adresse : Cotonou, Bénin
                <br />
                Directeur de la publication : Eurin HASH
              </p>
            </section>

            {/* 2. Hébergement */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                2. Hébergement
              </h2>
              <p className="leading-relaxed">
                Le site est hébergé par :
                <br />
                <strong className="text-zinc-200">Vercel Inc.</strong>
                <br />
                340 S Lemon Ave #1107, Walnut, CA 91789, États-Unis.
                <br />
                Site web : https://vercel.com
              </p>
            </section>

            {/* 3. Propriété Intellectuelle */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Info className="w-5 h-5 text-primary" />
                3. Propriété Intellectuelle
              </h2>
              <p className="leading-relaxed">
                L&apos;ensemble de ce site relève de la législation française et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
            </section>

            {/* 4. Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                4. Contact
              </h2>
              <p className="leading-relaxed">
                Pour toute demande d&apos;information ou signalement, vous pouvez nous contacter à l&apos;adresse suivante : 
                <br />
                <a href="mailto:legal@joinhashcode.com" className="text-primary hover:underline font-mono">legal@joinhashcode.com</a>
              </p>
            </section>

            <section className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 border-dashed">
              <p className="text-sm italic">
                En utilisant HASHCODE, vous reconnaissez avoir pris connaissance de ces mentions et vous engagez à les respecter. HASHCODE est une marque déposée.
              </p>
            </section>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

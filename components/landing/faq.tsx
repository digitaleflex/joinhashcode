"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "C'est quoi exactement HASHCODE ?",
    answer: "HASHCODE est une infrastructure de progression pour Builders. Ce n'est pas juste une communauté, c'est un système qui profile tes compétences réelles via des missions concrètes et t'oriente vers des écosystèmes (Guildes) où tu peux avoir un impact immédiat."
  },
  {
    question: "Comment fonctionne le profilage par l'action ?",
    answer: "Contrairement aux tests classiques, HASHCODE utilise une boucle comportementale. Ton profil initial (Quiz) n'est qu'une hypothèse. Elle est validée ou corrigée au fil de tes soumissions de code et de tes interactions dans le système."
  },
  {
    question: "Est-ce que l'accès est gratuit ?",
    answer: "L'accès au profilage et aux premières missions de validation est gratuit. Les accès aux Guildes Elite et aux ressources avancées dépendent de ton niveau d'évolution (INIT, CORE, PRO, ELITE) et de ta contribution au réseau."
  },
  {
    question: "Quels sont les prérequis techniques ?",
    answer: "HASHCODE s'adresse à ceux qui veulent construire. Que tu sois débutant (INIT) ou expert (ELITE), le système s'adapte. Nous mettons l'accent sur la stack moderne : Next.js, AI Agents, Cloud Infrastructure et Product Design."
  },
  {
    question: "Puis-je changer de 'Classe' plus tard ?",
    answer: "Absolument. Ton 'Profile Drift' mesure justement tes changements de direction. Si tu commences comme Builder mais que tes actions montrent des capacités de Stratège, le système te proposera naturellement une transition de classe."
  }
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative border-b border-border/60 bg-zinc-950/20 py-24 sm:py-32 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-64 h-64 text-white/5"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.1" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.1" />
          </svg>
        </motion.div>
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              System_FAQ
            </span>
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Des questions ? <span className="text-primary">On a les réponses.</span>
          </h2>
          <p className="text-zinc-400 text-base">
            Tout ce que tu dois savoir sur l'infrastructure et ton futur parcours.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="border border-white/5 rounded-2xl bg-zinc-900/40 overflow-hidden transition-colors hover:border-primary/20"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-sm font-medium text-white">{faq.question}</span>
                <div className="shrink-0 ml-4">
                  {openIndex === i ? (
                    <Minus className="h-4 w-4 text-primary" />
                  ) : (
                    <Plus className="h-4 w-4 text-zinc-500" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-2xl border border-dashed border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-zinc-900 border border-white/5">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Encore un doute ?</p>
              <p className="text-xs text-zinc-500">Pose ta question directement à la communauté.</p>
            </div>
          </div>
          <button className="text-xs font-mono uppercase tracking-widest text-primary hover:underline">
            Contact_Support
          </button>
        </div>
      </div>
    </section>
  )
}

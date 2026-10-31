"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "C'est quoi exactement HASHCODE ?",
    answer: "Tu commences par un quiz rapide. HASHCODE t'identifie parmi 4 profils : Builder, Créateur, Stratège ou Catalyseur. Ensuite, tu reçois des missions adaptées à ton niveau, des pairs au même niveau que toi, et un chemin concret pour évoluer dans la tech africaine."
  },
  {
    question: "Comment fonctionne le diagnostic ?",
    answer: "Contrairement aux tests classiques, HASHCODE observe tes actions réelles pour affiner ton profil. Ton résultat initial n'est qu'un point de départ. Il se précise au fil de tes missions et de tes interactions."
  },
  {
    question: "Est-ce que l'accès est gratuit ?",
    answer: "L'accès à l'évaluation et aux premières missions est gratuit. Les accès aux ressources avancées dépendent de ton niveau d'évolution et de ta contribution au réseau."
  },
  {
    question: "Quels sont les prérequis techniques ?",
    answer: "HASHCODE s'adresse à ceux qui veulent construire. Que tu sois débutant ou expert, le système s'adapte. Nous mettons l'accent sur la stack moderne : Next.js, AI Agents, Cloud Infrastructure et Product Design."
  },
  {
    question: "Puis-je changer de profil plus tard ?",
    answer: "Absolument. Ton profil peut évoluer. Si tu commences comme Builder mais que tes actions montrent des capacités de Stratège, le système te proposera naturellement une transition."
  }
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative border-b border-border bg-background py-24 sm:py-32 overflow-hidden">
      {/* Cyber Glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-primary/3 blur-[100px] pointer-events-none" />

      <div className="relative z-[var(--z-content)] mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs font-black uppercase tracking-widest text-primary">
              Questions fréquentes
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl uppercase italic leading-none">
            Des questions ?<br />
            <span className="text-muted-foreground font-bold">On a les réponses.</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="border border-border bg-muted overflow-hidden transition-all duration-300 hover:border-primary/20 hover:bg-muted"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 sm:p-8 text-left group"
              >
                <span className="text-sm sm:text-base font-black text-foreground uppercase italic tracking-tight group-hover:text-foreground transition-colors">
                  {faq.question}
                </span>
                <div className="shrink-0 ml-4 h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center transition-all group-hover:border-primary/30 group-hover:bg-primary/10">
                  {openIndex === i ? (
                    <Minus className="h-3 w-3 text-primary" />
                  ) : (
                    <Plus className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 sm:px-8 pb-8 text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
                      <div className="h-px w-full bg-border mb-6" />
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-[2rem] border border-dashed border-border bg-muted">
          <div className="flex items-center gap-5">
            <div className="h-12 w-12 rounded-2xl bg-muted border-border flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-foreground uppercase italic">Encore un doute ?</p>
              <p className="text-xs text-muted-foreground font-medium">Pose ta question directement à l'équipe.</p>
            </div>
          </div>
          <a 
            href="/contact" 
            className="text-xs font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors py-2 px-4 border border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/20"
          >
            Contact_Support
          </a>
        </div>
      </div>
    </section>
  )
}

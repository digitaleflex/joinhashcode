"use client"

import Image from "next/image"
import { Quote, Shield, Award, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Alex_Code",
    class: "Builder",
    level: "ELITE",
    image: "/images/avatars/builder.png",
    log: "HASHCODE a transformé ma stack. Passer de simple dev à Builder certifié avec des missions Master m'a ouvert des portes inespérées.",
    color: "text-blue-500",
    border: "border-blue-500/20"
  },
  {
    name: "Sarah_Strat",
    class: "Strategist",
    level: "PRO",
    image: "/images/avatars/strategist.png",
    log: "L'alignement entre mon profil et la guilde est effrayant de précision. On ne perd plus de temps en social, on bâtit des systèmes.",
    color: "text-emerald-500",
    border: "border-emerald-500/20"
  },
  {
    name: "Neo_Create",
    class: "Creator",
    level: "CORE",
    image: "/images/avatars/creator.png",
    log: "Le Studio HASHCODE est mon nouvel espace de jeu. Mon workflow créatif est maintenant multiplié par 10 grâce à l'IA collaborative.",
    color: "text-purple-500",
    border: "border-purple-500/20"
  },
  {
    name: "Mika_Catalyst",
    class: "Catalyst",
    level: "PRO",
    image: "/images/avatars/catalyst.png",
    log: "Connecter les bonnes intelligences au bon moment. HASHCODE est le moteur de mise en relation le plus puissant que j'ai testé.",
    color: "text-orange-500",
    border: "border-orange-500/20"
  },
  {
    name: "Dave_Cloud",
    class: "Builder",
    level: "ELITE",
    image: "/images/avatars/cloud.png",
    log: "L'infrastructure Zero-Trust proposée dans les missions Master est du pur génie. Ma vision du cloud a totalement pivoté.",
    color: "text-blue-400",
    border: "border-blue-400/20"
  },
  {
    name: "Elena_Scale",
    class: "Strategist",
    level: "ELITE",
    image: "/images/avatars/scale.png",
    log: "Passer de 10k à 1M d'utilisateurs demande une structure mentale. HASHCODE te donne le blueprint pour scaler sans casser.",
    color: "text-amber-500",
    border: "border-amber-500/20"
  }
]

export function Testimonials() {
  // Triple the array to ensure seamless infinite loop
  const marqueeItems = [...testimonials, ...testimonials, ...testimonials]

  return (
    <section id="community" className="border-b border-border/60 bg-black py-24 sm:py-32 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] opacity-30" />
        {/* Geometric Shapes */}
        <svg className="absolute top-10 right-10 w-64 h-64 text-primary/10 opacity-20" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="currentColor" fill="none" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
        <svg className="absolute bottom-20 left-10 w-48 h-48 text-white/10 opacity-10 rotate-12" viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" stroke="currentColor" fill="none" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Rapports de Terrain
            </span>
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
            L'Intelligence <span className="text-primary text-glow">Collective</span> en Action.
          </h2>
          <p className="max-w-2xl text-zinc-400 text-lg">
            Découvrez les logs de nos membres. Un flux continu de réussite et de collaboration technique.
          </p>
        </div>
      </div>

      {/* Marquee Carousel Container */}
      <div className="relative flex overflow-hidden">
        <motion.div
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
          className="flex gap-6 whitespace-nowrap py-4 hover:paused"
        >
          {marqueeItems.map((t, i) => (
            <Card 
              key={i} 
              className={`inline-block w-[350px] shrink-0 bg-zinc-900/40 backdrop-blur-md border ${t.border} group hover:border-primary/50 transition-all duration-500 select-none`}
            >
              <CardContent className="p-6 whitespace-normal">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/10 ring-2 ring-primary/5">
                    <Image 
                      src={t.image} 
                      alt={t.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      {t.name}
                      <Shield className="h-3 w-3 text-primary" />
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${t.color}`}>
                        {t.class}
                      </span>
                      <span className="text-[9px] text-zinc-700 font-mono">|</span>
                      <span className="text-[9px] text-zinc-500 font-mono tracking-widest">
                        LVL_{t.level}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-3 -left-3 h-6 w-6 text-white/5" />
                  <p className="text-xs leading-relaxed text-zinc-300 italic relative z-10">
                    "{t.log}"
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(star => (
                      <div key={star} className="w-0.5 h-0.5 rounded-full bg-primary/40" />
                    ))}
                  </div>
                  <span className="font-mono text-[8px] text-zinc-600 uppercase tracking-[0.2em]">Validated_Log</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

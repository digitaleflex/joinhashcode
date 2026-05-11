"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function Vision() {
  return (
    <section id="vision" className="relative overflow-hidden border-b border-border/60 bg-zinc-950 py-24 sm:py-32">
      {/* Geometric Background Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 text-primary/5 opacity-20"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M10,10 L90,90 M90,10 L10,90" stroke="currentColor" strokeWidth="0.1" />
          </svg>
        </motion.div>
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-24 w-64 h-64 text-white/5 opacity-10 -translate-y-1/2"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,10 90,90 10,90" stroke="currentColor" fill="none" strokeWidth="0.2" />
          </svg>
        </motion.div>
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image 
          src="/hashcode_hero_bg_1778511835902.png" 
          alt="Vision Background" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-8 bg-primary shadow-[0_0_10px_rgba(197,244,65,0.5)]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                Manifeste
              </span>
            </div>
            
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]">
              Redéfinir la <span className="text-primary">connexion</span> humaine par le <span className="font-mono italic">code</span>.
            </h2>
            
            <div className="mt-8 space-y-6">
              <p className="max-w-2xl text-pretty text-lg leading-relaxed text-zinc-400 sm:text-xl">
                HASHCODE n&apos;est pas une plateforme de plus. C&apos;est un sanctuaire technologique où chaque ambition est décodée pour trouver son écho parfait.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                <div className="space-y-3">
                  <h3 className="text-primary font-mono text-sm uppercase tracking-widest">01. Précision</h3>
                  <p className="text-zinc-500 text-sm">Un profilage algorithmique qui va au-delà des compétences pour toucher l&apos;essence de ton talent.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-primary font-mono text-sm uppercase tracking-widest">02. Synergie</h3>
                  <p className="text-zinc-500 text-sm">Rejoins des cercles qui partagent non seulement ton code, mais ta vision du monde.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual: Premium Card */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-50" />
              
              <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">H</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 rotate-90 origin-right">PROTOCOL_V.4.2</span>
                </div>
                
                <div className="space-y-4">
                  <div className="h-1 w-24 bg-primary/40 rounded-full" />
                  <div className="h-12 w-full border border-white/10 rounded-lg flex items-center px-4">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-primary/50" />)}
                    </div>
                  </div>
                  <p className="text-2xl font-medium text-white">Une identité unique.</p>
                </div>
              </div>

              {/* Decorative pulse */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


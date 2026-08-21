"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const TESTIMONIALS = [
  { text: "Ce que j'apprécie chez HashCode, c'est qu'on ne se contente pas d'apprendre de la théorie. On doit réellement pratiquer, chercher, se tromper et améliorer son travail. Les feedbacks m'aident à comprendre mes erreurs et surtout à progresser.", theme: "feedback" },
  { text: "HashCode m'a permis de mieux comprendre mes centres d'intérêt et les domaines dans lesquels je pourrais réellement évoluer. Je ne suis pas encore arrivé au bout du chemin, mais j'ai maintenant une direction et surtout l'envie de continuer à apprendre.", theme: "direction" },
  { text: "Ce que je trouve intéressant chez HashCode, c'est l'esprit de communauté. On ne travaille pas simplement chacun de son côté. On échange, on partage nos difficultés et on apprend aussi du travail des autres.", theme: "communauté" },
  { text: "Au début, je pensais que réussir une mission signifiait simplement terminer le travail demandé. HashCode m'a appris à aller plus loin : comprendre pourquoi je fais quelque chose, recevoir du feedback et améliorer ma manière de travailler.", theme: "mission" },
  { text: "J'ai beaucoup appris en regardant des cours et des tutoriels, mais HashCode m'a fait comprendre l'importance de mettre réellement ses connaissances en pratique. Les missions et les projets donnent une autre dimension à l'apprentissage.", theme: "pratique" },
  { text: "Ce que j'aime chez HashCode, c'est la sensation de progresser étape par étape. On commence avec ce qu'on sait déjà, puis les missions nous poussent progressivement à apprendre de nouvelles choses.", theme: "progression" },
  { text: "HashCode ne m'apprend pas seulement des technologies. Cela m'apprend surtout à réfléchir face à un problème, à chercher une solution, à expliquer mes choix et à accepter les corrections.", theme: "réflexion" },
  { text: "Ce n'est pas toujours facile, et c'est justement ce que j'apprécie. Les missions demandent de réfléchir et parfois de sortir de sa zone de confort. Mais lorsqu'on réussit après avoir rencontré des difficultés, la satisfaction est beaucoup plus grande.", theme: "défi" },
  { text: "L'un des aspects que je trouve particulièrement intéressant est de pouvoir transformer ce que j'apprends en réalisations concrètes. Au lieu de simplement dire que je connais une technologie, je peux progressivement montrer ce que je suis capable de construire.", theme: "portfolio" },
  { text: "HashCode m'a fait comprendre qu'apprendre dans la tech ne signifie pas seulement accumuler des technologies. Il faut apprendre à résoudre des problèmes, collaborer, documenter son travail et construire des choses utiles.", theme: "vision" },
]

const MEMBERS = [
  { name: "Nelkaël T.", profile: "Builder", city: "Bénin", member: 5 },
  { name: "Steve E.", profile: "Strategist", city: "Akassato", member: 6 },
  { name: "José D.", profile: "Catalyst", city: "Cotonou", member: 7 },
  { name: "Malick R.", profile: "Strategist", city: "Cotonou", member: 8 },
  { name: "Pricilia K.", profile: "Strategist", city: "Bénin", member: 10 },
  { name: "Danie D.", profile: "Strategist", city: "Bénin", member: 11 },
  { name: "Joanice A.", profile: "Strategist", city: "Bénin", member: 13 },
]

const PROFILE_COLORS: Record<string, string> = {
  Builder: "text-emerald-400",
  Strategist: "text-amber-400",
  Catalyst: "text-sky-400",
}

function MemberCard({ m }: { m: typeof MEMBERS[number] }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 min-w-[200px] shrink-0">
      <div className="h-12 w-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
        <span className="font-mono text-xs font-black text-primary">#{m.member}</span>
      </div>
      <div className="text-center">
        <p className="text-sm font-black text-white">{m.name}</p>
        <p className={`text-[10px] font-bold uppercase tracking-tight mt-1 ${PROFILE_COLORS[m.profile] ?? "text-zinc-400"}`}>
          {m.profile}
        </p>
        <p className="text-[10px] text-zinc-600 mt-1">{m.city}</p>
      </div>
    </div>
  )
}

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [memberOffset, setMemberOffset] = useState(0)
  const [memberPaused, setMemberPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % TESTIMONIALS.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  // Continuous scroll for members: advance by 1 card width every 2s
  const CARD_WIDTH = 216 // 200px + 16px gap

  useEffect(() => {
    if (memberPaused) return
    const id = setInterval(() => {
      setMemberOffset((prev) => prev + CARD_WIDTH)
    }, 2000)
    return () => clearInterval(id)
  }, [memberPaused])

  // Reset offset when it reaches the end (loop back)
  useEffect(() => {
    const totalWidth = MEMBERS.length * CARD_WIDTH
    if (memberOffset >= totalWidth) {
      setMemberOffset(0)
    }
  }, [memberOffset])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next])

  // Duplicate members for seamless infinite scroll
  const infiniteMembers = [...MEMBERS, ...MEMBERS, ...MEMBERS]

  return (
    <section className="border-b border-border/60 bg-zinc-950 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Testimonials Carousel */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase text-primary">La voix de la cohorte</span>
            <span className="h-px w-8 bg-primary/50" />
          </div>

          <div
            className="relative w-full max-w-3xl min-h-[220px] flex items-center justify-center"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <Quote className="absolute -top-2 left-0 h-8 w-8 text-primary/20" />

            <blockquote className="px-8 sm:px-16">
              <p className="text-lg sm:text-xl text-zinc-300 font-medium leading-relaxed italic">
                &ldquo;{TESTIMONIALS[current].text}&rdquo;
              </p>
              <p className="mt-5 text-xs font-bold text-zinc-600 uppercase tracking-widest">
                Membre de la Cohorte 01
              </p>
            </blockquote>

            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-primary/30 transition-colors"
              aria-label="Précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-primary/30 transition-colors"
              aria-label="Suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-primary" : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                }`}
                aria-label={`Témoignage ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Members Continuous Carousel — 3 visible */}
        <div className="border-t border-white/5 pt-12">
          <p className="text-center text-[10px] font-mono font-bold text-zinc-700 uppercase tracking-widest mb-8">
            7 membres fondateurs — tous réels, tous au Bénin
          </p>

          <div
            className="relative overflow-hidden mx-auto max-w-4xl"
            onMouseEnter={() => setMemberPaused(true)}
            onMouseLeave={() => setMemberPaused(false)}
          >
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

            {/* Track */}
            <div
              ref={trackRef}
              className="flex gap-4 transition-transform duration-500 ease-linear"
              style={{ transform: `translateX(-${memberOffset}px)` }}
            >
              {infiniteMembers.map((m, i) => (
                <MemberCard key={`${m.member}-${i}`} m={m} />
              ))}
            </div>
          </div>

          {/* Manual arrows */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setMemberOffset((p) => Math.max(0, p - CARD_WIDTH))}
              className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-primary/30 transition-colors"
              aria-label="Membres précédents"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMemberOffset((p) => p + CARD_WIDTH)}
              className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-primary/30 transition-colors"
              aria-label="Membres suivants"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}

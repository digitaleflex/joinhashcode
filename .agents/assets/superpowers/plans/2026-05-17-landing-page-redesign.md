# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the landing page from 12 sections to 6 — Nav, Hero (shuffle animation), ActivityFeed, Les 4 Profils (interactive hover), Témoignages (cleaner cards), FinalCTA+Footer — with a universal, typography-led aesthetic anchored by the 4 profile colors.

**Architecture:** Remove Vision, BrandIdentity, HowItWorks, Ecosystem from page.tsx. Rewrite Hero with a word-shuffle animation cycling through the 4 profile names in their colors. Redesign the Profils section with a two-column hover interaction. Clean up Nav (remove links to deleted sections). Simplify Testimonial cards.

**Tech Stack:** Next.js 15 App Router, React, TailwindCSS v4, Framer Motion, Lucide React, TypeScript

---

## File Map

| Action | File | What changes |
|---|---|---|
| Modify | `app/page.tsx` | Remove 4 sections, reorder remaining |
| Rewrite | `components/landing/hero.tsx` | Shuffle animation, new layout |
| Modify | `components/landing/nav.tsx` | Remove dead section links + scroll spy |
| Rewrite | `components/landing/missions-preview.tsx` | Two-column hover interaction |
| Rewrite | `components/landing/testimonials.tsx` | Cleaner human cards, less mono |
| Modify | `components/landing/final-cta.tsx` | Copy update |
| Keep | `components/landing/activity-feed.tsx` | No change needed |
| Keep | `components/landing/footer.tsx` | No change needed |

---

## Task 1: Simplify page.tsx — remove 4 dead sections

**Files:**
- Modify: `app/page.tsx`

- [ ] **Replace the full content of `app/page.tsx`:**

```tsx
import { Suspense } from "react"
import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { ActivityFeed } from "@/components/landing/activity-feed"
import { MissionsPreview } from "@/components/landing/missions-preview"
import { Testimonials } from "@/components/landing/testimonials"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Suspense fallback={<div className="h-12 w-full" />}>
        <ActivityFeed />
      </Suspense>
      <MissionsPreview />
      <Suspense fallback={<div className="h-48 w-full" />}>
        <Testimonials />
      </Suspense>
      <FinalCta />
      <Footer />
    </main>
  )
}
```

- [ ] **TypeScript check:**

```bash
npx tsc --noEmit
```

Expected: no output (zero errors)

- [ ] **Commit:**

```bash
git add app/page.tsx
git commit -m "feat(landing): reduce to 6 sections, remove Vision/BrandIdentity/HowItWorks/Ecosystem"
```

---

## Task 2: Rewrite Hero — shuffle animation + pure CSS background

**Files:**
- Rewrite: `components/landing/hero.tsx`

The Hero cycles through the 4 profile names in their brand colors using a word-shuffle animation. Every 2.2 seconds the current word fades out and the next fades in. Background: pure black + dot grid + single radial lime glow. No image file dependency.

- [ ] **Replace the full content of `components/landing/hero.tsx`:**

```tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const PROFILES = [
  { label: "Builder",    color: "#B8FF3B" },
  { label: "Créateur",   color: "#A855F7" },
  { label: "Stratège",   color: "#22D3EE" },
  { label: "Catalyseur", color: "#F97316" },
] as const

export function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % PROFILES.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  const current = PROFILES[index]

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-b border-border/60">
      {/* Pure CSS background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/7 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-primary/4 blur-[100px]" />
      </div>

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-35 z-10"
      />

      {/* Top accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-linear-to-r from-transparent via-primary/40 to-transparent z-20"
      />

      <div className="relative z-20 mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-sm mb-10">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Profilage tech · Ouvert à tous
            </span>
          </div>

          {/* H1 with shuffle */}
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05]">
            Tu es
            <br />
            <span className="inline-flex items-center justify-center min-w-[280px] sm:min-w-[380px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.label}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ color: current.color }}
                >
                  {current.label}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <p className="mt-4 text-lg text-zinc-500 font-light tracking-wide">
            Ou peut-être autre chose. <span className="text-zinc-400">3 minutes pour le savoir.</span>
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="btn-primary-glow group h-13 rounded-xl px-8 text-sm font-bold"
            >
              <Link href="/quiz">
                Découvrir mon profil
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-12 rounded-xl px-5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              <Link href="/signin">Déjà membre ? Connexion</Link>
            </Button>
          </div>

          {/* Meta */}
          <div className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50">
            <span>Gratuit</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>3 minutes</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Sans engagement</span>
          </div>
        </div>

        {/* Profile result card */}
        <div className="mx-auto mt-20 max-w-2xl">
          <div className="relative rounded-2xl border border-border bg-card/60 shadow-2xl shadow-black/60 backdrop-blur-md overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-b from-primary/15 to-transparent opacity-40"
            />
            {/* Fake browser bar */}
            <div className="relative flex items-center gap-2 border-b border-border/60 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>
              <span className="ml-2 font-mono text-[11px] text-muted-foreground/60">
                joinhashcode.com/dossier
              </span>
            </div>
            {/* Result body */}
            <div className="relative p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Résultat · Ibrahima S.</p>
                  <p
                    className="text-2xl font-bold mt-1 font-mono"
                    style={{ color: "#22D3EE" }}
                  >
                    STRATÈGE
                  </p>
                </div>
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
                  style={{ color: "#22D3EE", background: "#22D3EE15", border: "1px solid #22D3EE30" }}
                >
                  CORE
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Stratège",   pct: 68, color: "#22D3EE" },
                  { label: "Builder",    pct: 22, color: "#B8FF3B" },
                  { label: "Catalyseur", pct:  7, color: "#F97316" },
                  { label: "Créateur",   pct:  3, color: "#A855F7" },
                ].map(bar => (
                  <div key={bar.label} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-zinc-500 w-20 shrink-0 uppercase tracking-wider">{bar.label}</span>
                    <div className="flex-1 h-1 rounded-full bg-white/5">
                      <div
                        className="h-1 rounded-full"
                        style={{ width: `${bar.pct}%`, background: bar.color, opacity: 0.75 }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-zinc-600 w-8 text-right">{bar.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Confiance algorithmique</span>
                <span className="font-mono text-[11px] font-bold" style={{ color: "#22D3EE" }}>91%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **TypeScript check:**

```bash
npx tsc --noEmit
```

Expected: no output

- [ ] **Commit:**

```bash
git add components/landing/hero.tsx
git commit -m "feat(hero): word-shuffle animation + pure CSS background + profile result card"
```

---

## Task 3: Simplify Nav — remove dead section links

**Files:**
- Modify: `components/landing/nav.tsx`

The nav links (Vision, Missions, Fonctionnement, Écosystème) point to sections that no longer exist. Remove them and the scroll-spy logic. Keep logo + connexion + CTA. Mobile menu simplifies to logo + CTA only.

- [ ] **Replace the full content of `components/landing/nav.tsx`:**

```tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { BottomNav } from "@/components/dashboard/bottom-nav"

export function Nav() {
  const { data: session } = authClient.useSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-border/60 py-2"
            : "bg-transparent border-transparent py-4"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="relative flex items-center gap-1.5 group">
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/hashcodejoin.png"
              alt="HASHCODE"
              width={160}
              height={40}
              className="h-8 w-auto object-contain relative z-10"
              priority
            />
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:flex text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors items-center gap-2"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
                <div className="h-8 w-8 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/5">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-mono text-primary font-bold">
                      {session.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Link href="/signin">Connexion</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="h-9 rounded-full bg-primary px-4 sm:px-5 text-[10px] sm:text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Link href="/quiz" className="flex items-center gap-1.5">
                    Se profiler
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      {session && <BottomNav />}
    </>
  )
}
```

- [ ] **TypeScript check:**

```bash
npx tsc --noEmit
```

Expected: no output

- [ ] **Commit:**

```bash
git add components/landing/nav.tsx
git commit -m "feat(nav): remove dead section links, keep logo + connexion + CTA"
```

---

## Task 4: Rewrite Les 4 Profils — two-column interactive hover

**Files:**
- Rewrite: `components/landing/missions-preview.tsx`

Two columns. Left: sticky header explaining the concept + the selected profile's detail. Right: 4 stacked profile rows. On hover (desktop) or tap (mobile), the left side updates to show that profile's full description. On mobile: 4 cards stacked, each fully expanded.

- [ ] **Replace the full content of `components/landing/missions-preview.tsx`:**

```tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const PROFILES = [
  {
    id: "builder",
    label: "Builder",
    tagline: "Tu construis.",
    color: "#B8FF3B",
    desc: "Code, systèmes, produits. Tu t'épanouis quand une idée tourne en production. Le débogage ne te décourage pas — il t'intrigue.",
    traits: ["Développeur", "Ingénieur", "Maker", "Architecte"],
  },
  {
    id: "creator",
    label: "Créateur",
    tagline: "Tu imagines.",
    color: "#A855F7",
    desc: "Design, contenu, narration. Tu crées ce que les autres n'ont pas encore eu l'idée de voir. L'esthétique n'est pas un détail pour toi.",
    traits: ["Designer", "UI/UX", "Rédacteur", "Vidéaste"],
  },
  {
    id: "strategist",
    label: "Stratège",
    tagline: "Tu structures.",
    color: "#22D3EE",
    desc: "Business, produit, croissance. Tu vois les systèmes derrière les événements et tu construis pour durer. Les chiffres parlent avant les intuitions.",
    traits: ["Product", "Growth", "Business Dev", "Analyste"],
  },
  {
    id: "catalyst",
    label: "Catalyseur",
    tagline: "Tu connectes.",
    color: "#F97316",
    desc: "Réseau, communauté, impact. Tu amplifies ce qui existe autour de toi — les gens, les idées, les projets. Sans toi, l'énergie ne circule pas.",
    traits: ["Community", "Mentor", "Ambassadeur", "Networker"],
  },
] as const

export function MissionsPreview() {
  const [active, setActive] = useState(0)
  const profile = PROFILES[active]

  return (
    <section id="profils" className="border-b border-border/60 bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Les 4 profils</span>
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Qui es-tu dans la tech ?
          </h2>
          <p className="max-w-xl text-zinc-400 text-base leading-relaxed">
            L'algorithme identifie ta tendance dominante. Beaucoup de membres sont hybrides — c'est la norme, pas l'exception.
          </p>
        </div>

        {/* Desktop: two columns */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 items-start">

          {/* Left — active profile detail */}
          <div className="sticky top-24">
            <div
              className="rounded-2xl border p-8 transition-all duration-500"
              style={{ borderColor: `${profile.color}25`, background: `${profile.color}06` }}
            >
              <div
                className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-md inline-block mb-6"
                style={{ color: profile.color, background: `${profile.color}15`, border: `1px solid ${profile.color}30` }}
              >
                {profile.label}
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">{profile.tagline}</h3>
              <p className="text-zinc-400 text-base leading-relaxed mb-6">{profile.desc}</p>
              <div className="flex flex-wrap gap-2">
                {profile.traits.map(t => (
                  <span
                    key={t}
                    className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md"
                    style={{ color: `${profile.color}90`, background: `${profile.color}0d`, border: `1px solid ${profile.color}20` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              {/* Color accent bar */}
              <div
                className="mt-8 h-px w-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${profile.color}60, transparent)` }}
              />
            </div>
          </div>

          {/* Right — profile list */}
          <div className="space-y-2">
            {PROFILES.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className="w-full text-left group rounded-xl border px-6 py-5 transition-all duration-300 cursor-pointer"
                style={{
                  borderColor: active === i ? `${p.color}40` : "transparent",
                  background: active === i ? `${p.color}08` : "transparent",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        background: p.color,
                        opacity: active === i ? 1 : 0.3,
                        boxShadow: active === i ? `0 0 8px ${p.color}` : "none",
                      }}
                    />
                    <span
                      className="text-2xl font-bold tracking-tight transition-colors duration-300"
                      style={{ color: active === i ? p.color : "#71717A" }}
                    >
                      {p.label}
                    </span>
                  </div>
                  <span
                    className="font-mono text-sm transition-colors duration-300"
                    style={{ color: active === i ? p.color : "#3F3F46" }}
                  >
                    {p.tagline}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: 4 stacked cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROFILES.map(p => (
            <div
              key={p.id}
              className="rounded-2xl border p-6 space-y-4"
              style={{ borderColor: `${p.color}20`, background: `${p.color}06` }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-md"
                  style={{ color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}30` }}
                >
                  {p.label}
                </div>
                <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: p.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-white mb-2">{p.tagline}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.traits.map(t => (
                  <span
                    key={t}
                    className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ color: `${p.color}80`, background: `${p.color}0d`, border: `1px solid ${p.color}15` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-14">
          <Link
            href="/quiz"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Découvrir mon profil en 3 minutes
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **TypeScript check:**

```bash
npx tsc --noEmit
```

Expected: no output

- [ ] **Commit:**

```bash
git add components/landing/missions-preview.tsx
git commit -m "feat(profils): two-column hover interaction + mobile card grid"
```

---

## Task 5: Rewrite Testimonials — human cards, less terminal

**Files:**
- Rewrite: `components/landing/testimonials.tsx`

Remove the mono-font overload and `LVL_CORE` labels. Bigger quote text, profile color as card left border, clean name + location. Keep the marquee carousel.

- [ ] **Replace the full content of `components/landing/testimonials.tsx`:**

```tsx
"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

const TESTIMONIALS = [
  {
    name: "Kofi A.",
    location: "Accra, GH",
    profile: "Builder",
    color: "#B8FF3B",
    quote: "En 3 minutes j'ai su exactement où je me situais. Les missions débloquées correspondaient à ce que je cherchais depuis des semaines.",
  },
  {
    name: "Aminata D.",
    location: "Dakar, SN",
    profile: "Catalyseur",
    color: "#F97316",
    quote: "Mon profil Catalyseur a été reconnu comme aussi valide que celui d'un dev. Le réseau que j'ai construit en 2 semaines est réel.",
  },
  {
    name: "Ibrahima S.",
    location: "Abidjan, CI",
    profile: "Stratège",
    color: "#22D3EE",
    quote: "L'algorithme m'a catégorisé Stratège. J'étais sceptique. Puis j'ai vu les ressources débloquées. Ça colle parfaitement.",
  },
  {
    name: "Chloé M.",
    location: "Douala, CM",
    profile: "Créatrice",
    color: "#A855F7",
    quote: "Le fait que le quiz soit une hypothèse et non une étiquette m'a rassurée. Le profil hybride Créateur × Stratège, c'est exactement moi.",
  },
  {
    name: "Yacine B.",
    location: "Tunis, TN",
    profile: "Builder",
    color: "#B8FF3B",
    quote: "J'ai complété ma première mission en 48h. Le feedback de la guilde Builder était direct et technique. C'est ce dont j'avais besoin.",
  },
  {
    name: "Fatoumata C.",
    location: "Bamako, ML",
    profile: "Catalyseur",
    color: "#F97316",
    quote: "Première fois que je vois une plateforme tech qui valorise autant les profils non-techniques. Mon rôle de connectrice est enfin reconnu.",
  },
] as const

export function Testimonials() {
  const items = useMemo(() => [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS], [])

  return (
    <section className="border-b border-border/60 bg-black py-24 sm:py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-14">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Retours terrain</span>
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-3">
            Ce qu'ils ont vécu.
          </h2>
          <p className="text-zinc-500 text-base">
            Des membres de 20 pays — Afrique et diaspora.
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative flex overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: [0, -1 * 380 * TESTIMONIALS.length] }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 50, ease: "linear" }}
          className="flex gap-5 py-3"
        >
          {items.map((t, i) => (
            <div
              key={i}
              className="inline-flex flex-col gap-5 w-[360px] shrink-0 rounded-2xl bg-zinc-900/60 p-6 select-none border-l-2"
              style={{ borderColor: t.color, borderTop: "1px solid #ffffff10", borderRight: "1px solid #ffffff08", borderBottom: "1px solid #ffffff08" }}
            >
              {/* Quote */}
              <p className="text-[15px] text-zinc-300 leading-relaxed flex-1">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{t.location}</p>
                </div>
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded"
                  style={{ color: t.color, background: `${t.color}12`, border: `1px solid ${t.color}25` }}
                >
                  {t.profile}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **TypeScript check:**

```bash
npx tsc --noEmit
```

Expected: no output

- [ ] **Commit:**

```bash
git add components/landing/testimonials.tsx
git commit -m "feat(testimonials): clean human cards with profile color border + bigger quotes"
```

---

## Task 6: Update FinalCTA copy

**Files:**
- Modify: `components/landing/final-cta.tsx`

Update the copy to match the new tone (universal, not Africa-only). The CTA button text should match the Hero.

- [ ] **Edit the h2 and supporting copy in `components/landing/final-cta.tsx`:**

```tsx
// Replace the h2 block:
<h2 className="mt-6 text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
  Prêt à savoir
  <br />
  <span className="text-primary">qui tu es ?</span>
</h2>

// Replace the p below it:
<p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
  3 minutes. 13 questions. Un profil précis — et une communauté qui correspond.
</p>

// Replace the Button label:
Découvrir mon profil
```

- [ ] **TypeScript check:**

```bash
npx tsc --noEmit
```

Expected: no output

- [ ] **Commit:**

```bash
git add components/landing/final-cta.tsx
git commit -m "feat(cta): update copy to match universal tone"
```

---

## Task 7: Final build check + push

- [ ] **Full build:**

```bash
npm run build 2>&1
```

Expected: `✓ Compiled successfully`, 0 errors, pages generated without warning.

- [ ] **Push:**

```bash
git push origin main
```

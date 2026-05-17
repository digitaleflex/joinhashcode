# Quiz Result Revelation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refonte de la page résultat du quiz en 3 étapes émotionnelles + diagnostic pré-quiz, zéro IA, tout algorithmique et statique.

**Architecture:** Le contenu statique de chaque profil est isolé dans `lib/profile-content.ts`. L'algorithme existant (`lib/analysis.ts`) détermine le profil et route vers le bon contenu. La page résultat est composée de 3 composants indépendants (`ResultRevelation`, `ResultScores`, `ResultLocked`) assemblés par `ResultPage`. Un composant `PreQuizDiagnostic` affiche 5 questions avant le quiz et stocke les réponses en localStorage pour les transmettre à l'API.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, TailwindCSS v4, Framer Motion, Vitest + React Testing Library

---

## Carte des fichiers

| Action | Fichier | Responsabilité |
|--------|---------|----------------|
| Créer | `lib/profile-content.ts` | Tout le contenu statique par profil (douleur, vérités, missions, preuves sociales) |
| Créer | `components/quiz/pre-quiz-diagnostic.tsx` | 5 questions pré-quiz, localStorage, callback onComplete |
| Créer | `components/quiz/result-revelation.tsx` | Étape 1 : révélation émotionnelle plein écran |
| Créer | `components/quiz/result-scores.tsx` | Étape 2 : scores + carte membre + partage WhatsApp |
| Créer | `components/quiz/result-locked.tsx` | Étape 3 : missions verrouillées + preuve sociale + CTA |
| Créer | `components/quiz/result-page.tsx` | Orchestrateur des 3 étapes |
| Créer | `__tests__/profile-content.test.ts` | Tests du contenu statique et du routing |
| Créer | `__tests__/pre-quiz-diagnostic.test.tsx` | Tests du flux de diagnostic |
| Modifier | `components/quiz/quiz.tsx` | Remplacer bloc résultat (lignes 240–440) par `<ResultPage>` |
| Modifier | `app/quiz/page.tsx` | Insérer `<PreQuizDiagnostic>` avant le quiz |
| Modifier | `app/api/quiz/route.ts` | Accepter et stocker `diagnosticAnswers` |
| Modifier | `prisma/schema.prisma` | Ajouter `diagnosticAnswers Json?` sur `QuizResult` |

---

## Task 1 : Contenu statique des profils

**Files:**
- Create: `lib/profile-content.ts`
- Create: `__tests__/profile-content.test.ts`

- [ ] **Étape 1.1 : Écrire les tests**

```ts
// __tests__/profile-content.test.ts
import { describe, it, expect } from 'vitest'
import {
  PROFILE_CONTENT,
  PROFILE_COLORS,
  getProfileContent,
  getHybridContent,
  type ProfileType,
} from '../lib/profile-content'

describe('PROFILE_CONTENT', () => {
  const profiles: ProfileType[] = ['builder', 'creator', 'strategist', 'catalyst']

  it('contient les 4 profils', () => {
    profiles.forEach(p => expect(PROFILE_CONTENT[p]).toBeDefined())
  })

  it('chaque profil a 3 vérités', () => {
    profiles.forEach(p => {
      expect(PROFILE_CONTENT[p].truths).toHaveLength(3)
    })
  })

  it('chaque profil a 2 missions déverrouillées et au moins 3 verrouillées', () => {
    profiles.forEach(p => {
      const { unlockedMissions, lockedMissions } = PROFILE_CONTENT[p]
      expect(unlockedMissions).toHaveLength(2)
      expect(lockedMissions.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('getProfileContent retourne le bon contenu', () => {
    expect(getProfileContent('builder').name).toBe('Builder')
    expect(getProfileContent('creator').name).toBe('Créateur')
  })

  it('getHybridContent combine 2 vérités du primaire et 1 du secondaire', () => {
    const hybrid = getHybridContent('builder', 'creator')
    expect(hybrid.truths).toHaveLength(3)
    expect(hybrid.truths[0]).toEqual(PROFILE_CONTENT['builder'].truths[0])
    expect(hybrid.truths[1]).toEqual(PROFILE_CONTENT['builder'].truths[1])
    expect(hybrid.truths[2]).toEqual(PROFILE_CONTENT['creator'].truths[0])
  })

  it('PROFILE_COLORS contient une couleur hex pour chaque profil', () => {
    profiles.forEach(p => {
      expect(PROFILE_COLORS[p]).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })
})
```

- [ ] **Étape 1.2 : Lancer les tests (doivent échouer)**

```bash
npx vitest run __tests__/profile-content.test.ts
```
Résultat attendu : FAIL — `Cannot find module '../lib/profile-content'`

- [ ] **Étape 1.3 : Créer `lib/profile-content.ts`**

```ts
export type ProfileType = 'builder' | 'creator' | 'strategist' | 'catalyst'

export interface Truth {
  icon: string
  bold: string
  rest: string
}

export interface Mission {
  title: string
  xp: number
}

export interface ProfileContent {
  name: string
  pain: string
  painBold: string
  truths: [Truth, Truth, Truth]
  unlockedMissions: [Mission, Mission]
  lockedMissions: Mission[]
  socialProof: string
  whatsappText: string
  ctaLabel: string
}

export const PROFILE_COLORS: Record<ProfileType, string> = {
  builder: '#B8FF3B',
  creator: '#A855F7',
  strategist: '#22D3EE',
  catalyst: '#F97316',
}

export const PROFILE_CONTENT: Record<ProfileType, ProfileContent> = {
  builder: {
    name: 'Builder',
    pain: "Tu sais construire. Le problème, c'est que tu construis seul, dans le vide — sans savoir si ce que tu fais vaut quelque chose.",
    painBold: 'seul, dans le vide',
    truths: [
      {
        icon: '🔁',
        bold: 'Tu recommences souvent de zéro.',
        rest: " Pas parce que tu es instable — parce que personne ne t'a montré comment avancer étape par étape.",
      },
      {
        icon: '🔇',
        bold: 'Ton entourage ne comprend pas ce que tu fais.',
        rest: " Ni ta famille, ni tes amis. Tu construis quelque chose qu'ils ne voient pas encore.",
      },
      {
        icon: '🧱',
        bold: 'Tu accumules des projets non terminés.',
        rest: " Chacun t'a appris quelque chose — mais aucun ne te représente encore. Ça, ça change ici.",
      },
    ],
    unlockedMissions: [
      { title: 'Construire et livrer un projet en 48h', xp: 50 },
      { title: 'Documenter et publier ton code sur GitHub', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Collaborer avec un Stratège du Guild', xp: 60 },
      { title: 'Présenter ton travail à la communauté', xp: 40 },
      { title: 'Mentorer un Builder débutant', xp: 80 },
    ],
    socialProof:
      "Des Builders comme toi ont livré leurs premiers projets et décroché leurs premiers clients depuis ce Guild.",
    whatsappText:
      "Je viens de découvrir mon profil HASHCODE : Builder 🧱\nFais le quiz et découvre le tien → joinhashcode.com",
    ctaLabel: 'Rejoindre le Guild Builder →',
  },

  creator: {
    name: 'Créateur',
    pain: "Tu as des idées que les autres n'ont pas encore. Mais tu passes plus de temps à tout imaginer tout seul qu'à créer vraiment.",
    painBold: 'tout imaginer tout seul',
    truths: [
      {
        icon: '🎨',
        bold: 'Tu crées, puis tu effaces.',
        rest: " Pas parce que c'est mauvais — parce que tu n'as personne à qui montrer avant que ce soit parfait.",
      },
      {
        icon: '🔦',
        bold: 'Tu te perds dans les détails.',
        rest: " Une idée en entraîne une autre, et tu n'arrives jamais à la ligne d'arrivée.",
      },
      {
        icon: '🪟',
        bold: 'Tu manques d\'une scène.',
        rest: " Pas de talent — tu n'as juste jamais eu le bon endroit pour montrer ce que tu fais vraiment.",
      },
    ],
    unlockedMissions: [
      { title: 'Publier un projet personnel en public', xp: 50 },
      { title: 'Créer et partager ton premier design system', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Co-créer avec un Builder du Guild', xp: 60 },
      { title: 'Pitcher ta vision à la communauté', xp: 40 },
      { title: 'Produire un projet de A à Z en 7 jours', xp: 80 },
    ],
    socialProof:
      "Des Créateurs du Guild ont publié leurs projets pour la première fois — et reçu des retours vrais, pas des likes vides.",
    whatsappText:
      "Je viens de découvrir mon profil HASHCODE : Créateur 🎨\nFais le quiz et découvre le tien →",
    ctaLabel: 'Rejoindre le Guild Créateur →',
  },

  strategist: {
    name: 'Stratège',
    pain: "Tu vois tout plus loin que les autres. Le problème, c'est que pendant que tu analyses, les autres agissent — et toi tu regardes.",
    painBold: 'les autres agissent — et toi tu regardes',
    truths: [
      {
        icon: '🧠',
        bold: 'Tu penses beaucoup, tu livres peu.',
        rest: " Pas par paresse — tu veux que ce soit bien fait avant de commencer. Ça t'immobilise.",
      },
      {
        icon: '📐',
        bold: 'Personne ne te demande ton avis.',
        rest: " Pourtant tu vois des choses que les autres ratent. Il te manque un cadre où ta profondeur est valorisée.",
      },
      {
        icon: '🔗',
        bold: 'Tu travailles seul sur des idées qui méritent une équipe.',
        rest: " Ici tu trouves les personnes qui ont besoin exactement de ce que tu sais faire.",
      },
    ],
    unlockedMissions: [
      { title: 'Produire une analyse produit complète', xp: 50 },
      { title: 'Rédiger une roadmap pour un vrai projet', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Mentorer un Builder du Guild', xp: 60 },
      { title: 'Présenter ta stratégie à la communauté', xp: 40 },
      { title: 'Diriger un projet de Guild de A à Z', xp: 100 },
    ],
    socialProof:
      "Des Stratèges du Guild ont rejoint des équipes qui avaient besoin exactement de leur façon de penser.",
    whatsappText:
      "Je viens de découvrir mon profil HASHCODE : Stratège 🧠\nFais le quiz et découvre le tien →",
    ctaLabel: 'Rejoindre le Guild Stratège →',
  },

  catalyst: {
    name: 'Catalyst',
    pain: "Tu motives tout le monde autour de toi. Mais à la fin de la journée, qui te motive, toi ?",
    painBold: 'qui te motive, toi ?',
    truths: [
      {
        icon: '🔥',
        bold: 'Tu donnes beaucoup, tu reçois peu.',
        rest: " Tu portes des groupes entiers sans structure pour toi-même. Tu t'épuises.",
      },
      {
        icon: '🌀',
        bold: "Ton énergie part dans tous les sens.",
        rest: " Pas par manque de sérieux — tu n'as pas encore trouvé le cadre qui concentre ce que tu apportes.",
      },
      {
        icon: '🤝',
        bold: 'Tu es fait pour bâtir des communautés.',
        rest: " Ici on t'en donne une vraie — avec des gens aussi engagés que toi.",
      },
    ],
    unlockedMissions: [
      { title: 'Animer ta première session communautaire', xp: 50 },
      { title: 'Recruter 3 membres actifs pour ton Guild', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Co-organiser un événement avec un Stratège', xp: 60 },
      { title: "Lancer ton propre cercle d'apprentissage", xp: 40 },
      { title: 'Fédérer une équipe autour d\'un projet commun', xp: 100 },
    ],
    socialProof:
      "Des Catalysts du Guild ont lancé leurs propres cercles d'apprentissage dans leurs villes.",
    whatsappText:
      "Je viens de découvrir mon profil HASHCODE : Catalyst 🔥\nFais le quiz et découvre le tien →",
    ctaLabel: 'Rejoindre le Guild Catalyst →',
  },
}

export function getProfileContent(profile: ProfileType): ProfileContent {
  return PROFILE_CONTENT[profile]
}

export function getHybridContent(
  primary: ProfileType,
  secondary: ProfileType
): Omit<ProfileContent, 'name' | 'ctaLabel'> & { name: string; ctaLabel: string } {
  const p = PROFILE_CONTENT[primary]
  const s = PROFILE_CONTENT[secondary]
  return {
    ...p,
    name: `${p.name} × ${s.name}`,
    truths: [p.truths[0], p.truths[1], s.truths[0]],
    ctaLabel: `Rejoindre le Guild ${p.name} →`,
  }
}
```

- [ ] **Étape 1.4 : Lancer les tests (doivent passer)**

```bash
npx vitest run __tests__/profile-content.test.ts
```
Résultat attendu : PASS — 5 tests passés

- [ ] **Étape 1.5 : Commit**

```bash
git add lib/profile-content.ts __tests__/profile-content.test.ts
git commit -m "feat(content): add static profile content for all 4 profiles"
```

---

## Task 2 : Diagnostic pré-quiz

**Files:**
- Create: `components/quiz/pre-quiz-diagnostic.tsx`
- Create: `__tests__/pre-quiz-diagnostic.test.tsx`

- [ ] **Étape 2.1 : Écrire les tests**

```tsx
// __tests__/pre-quiz-diagnostic.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PreQuizDiagnostic } from '../components/quiz/pre-quiz-diagnostic'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

beforeEach(() => localStorageMock.clear())

describe('PreQuizDiagnostic', () => {
  it('affiche la première question au chargement', () => {
    render(<PreQuizDiagnostic onComplete={vi.fn()} />)
    expect(screen.getByText(/As-tu un projet informatique terminé/i)).toBeDefined()
  })

  it('avance à la question suivante après un choix', () => {
    render(<PreQuizDiagnostic onComplete={vi.fn()} />)
    fireEvent.click(screen.getByText('Pas encore'))
    expect(screen.getByText(/dans quel métier tu veux travailler/i)).toBeDefined()
  })

  it('appelle onComplete avec les réponses après la dernière question', () => {
    const onComplete = vi.fn()
    render(<PreQuizDiagnostic onComplete={onComplete} />)
    // Répondre aux 5 questions
    fireEvent.click(screen.getByText('Pas encore'))
    fireEvent.click(screen.getByText('Pas vraiment'))
    fireEvent.click(screen.getByText('4+'))
    fireEvent.click(screen.getByText('Non'))
    fireEvent.click(screen.getByText('Souvent'))
    expect(onComplete).toHaveBeenCalledOnce()
    expect(onComplete).toHaveBeenCalledWith({
      project: 'no',
      direction: 'no',
      languages: 'many',
      mentor: 'no',
      lost: 'often',
    })
  })

  it('stocke les réponses dans localStorage à la fin', () => {
    render(<PreQuizDiagnostic onComplete={vi.fn()} />)
    fireEvent.click(screen.getByText('Pas encore'))
    fireEvent.click(screen.getByText('Pas vraiment'))
    fireEvent.click(screen.getByText('4+'))
    fireEvent.click(screen.getByText('Non'))
    fireEvent.click(screen.getByText('Souvent'))
    expect(localStorageMock.getItem('hashcode_diagnostic_done')).toBe('true')
  })
})
```

- [ ] **Étape 2.2 : Lancer les tests (doivent échouer)**

```bash
npx vitest run __tests__/pre-quiz-diagnostic.test.tsx
```
Résultat attendu : FAIL — `Cannot find module`

- [ ] **Étape 2.3 : Créer `components/quiz/pre-quiz-diagnostic.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type DiagnosticAnswers = {
  project: 'yes' | 'no'
  direction: 'yes' | 'no'
  languages: 'few' | 'some' | 'many'
  mentor: 'yes' | 'no'
  lost: 'rarely' | 'sometimes' | 'often'
}

interface Question {
  id: keyof DiagnosticAnswers
  text: string
  options: { label: string; value: string }[]
}

const QUESTIONS: Question[] = [
  {
    id: 'project',
    text: "As-tu un projet informatique terminé que tu peux montrer aujourd'hui ?",
    options: [
      { label: 'Oui', value: 'yes' },
      { label: 'Pas encore', value: 'no' },
    ],
  },
  {
    id: 'direction',
    text: 'Sais-tu exactement dans quel métier tu veux travailler dans 2 ans ?',
    options: [
      { label: 'Oui', value: 'yes' },
      { label: 'Pas vraiment', value: 'no' },
    ],
  },
  {
    id: 'languages',
    text: "Combien de langages ou frameworks as-tu commencé sans aller au bout ?",
    options: [
      { label: '0 – 1', value: 'few' },
      { label: '2 – 3', value: 'some' },
      { label: '4+', value: 'many' },
    ],
  },
  {
    id: 'mentor',
    text: 'As-tu un mentor ou quelqu\'un qui guide ta progression ?',
    options: [
      { label: 'Oui', value: 'yes' },
      { label: 'Non', value: 'no' },
    ],
  },
  {
    id: 'lost',
    text: 'Te sens-tu souvent perdu sur quoi apprendre ensuite ?',
    options: [
      { label: 'Rarement', value: 'rarely' },
      { label: 'Parfois', value: 'sometimes' },
      { label: 'Souvent', value: 'often' },
    ],
  },
]

interface Props {
  onComplete: (answers: DiagnosticAnswers) => void
}

export function PreQuizDiagnostic({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<DiagnosticAnswers>>({})

  function handleChoice(value: string) {
    const question = QUESTIONS[step]
    const updated = { ...answers, [question.id]: value } as Partial<DiagnosticAnswers>
    setAnswers(updated)

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      const final = updated as DiagnosticAnswers
      localStorage.setItem('hashcode_diagnostic_done', 'true')
      localStorage.setItem('hashcode_diagnostic_answers', JSON.stringify(final))
      onComplete(final)
    }
  }

  const question = QUESTIONS[step]
  const progress = ((step) / QUESTIONS.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      {/* Barre de progression */}
      <div className="w-full max-w-md mb-12">
        <div className="h-px bg-border w-full overflow-hidden rounded-full">
          <div
            className="h-full bg-foreground transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">
          {step + 1} / {QUESTIONS.length}
        </p>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <h2 className="text-xl font-semibold text-foreground mb-10 leading-snug text-center">
            {question.text}
          </h2>

          <div className="flex flex-col gap-3">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChoice(opt.value)}
                className="w-full py-4 px-6 rounded-2xl border border-border bg-card text-foreground font-medium text-left hover:border-foreground/40 hover:bg-card/80 transition-all duration-200 active:scale-[0.98]"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Étape 2.4 : Lancer les tests (doivent passer)**

```bash
npx vitest run __tests__/pre-quiz-diagnostic.test.tsx
```
Résultat attendu : PASS — 4 tests passés

- [ ] **Étape 2.5 : Commit**

```bash
git add components/quiz/pre-quiz-diagnostic.tsx __tests__/pre-quiz-diagnostic.test.tsx
git commit -m "feat(quiz): add pre-quiz diagnostic (5 questions, localStorage)"
```

---

## Task 3 : Prisma schema + API update

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `app/api/quiz/route.ts`

- [ ] **Étape 3.1 : Ajouter `diagnosticAnswers` au modèle `QuizResult`**

Dans `prisma/schema.prisma`, trouver le modèle `QuizResult` et ajouter le champ après `detailedResponseTimes` :

```prisma
model QuizResult {
  id                    String   @id @default(cuid())
  userId                String?
  user                  User?    @relation(fields: [userId], references: [id])
  profileType           String
  score                 Int?
  answers               Json
  averageResponseTime   Int?     @map("average_response_time")
  detailedResponseTimes Json?    @map("detailed_response_times")
  diagnosticAnswers     Json?    @map("diagnostic_answers")   // <-- AJOUTER
  createdAt             DateTime @default(now())

  @@index([profileType])
  @@map("quiz_result")
}
```

- [ ] **Étape 3.2 : Pousser le schema sur la base de dev**

```bash
npx prisma db push
```
Résultat attendu : `Your database is now in sync with your Prisma schema.`

- [ ] **Étape 3.3 : Régénérer le client Prisma**

```bash
npx prisma generate
```

- [ ] **Étape 3.4 : Mettre à jour `app/api/quiz/route.ts`**

Trouver la ligne qui parse le body et ajouter `diagnosticAnswers` :

```ts
// Avant (exemple du pattern existant)
const { answers, responseTimes } = await req.json()

// Après
const { answers, responseTimes, diagnosticAnswers } = await req.json()
```

Trouver la création du `QuizResult` dans Prisma et ajouter le champ :

```ts
await prisma.quizResult.create({
  data: {
    userId: session.user.id,
    profileType: analysis.primary,
    answers: answers,
    averageResponseTime: avgTime,
    detailedResponseTimes: responseTimes ?? [],
    diagnosticAnswers: diagnosticAnswers ?? null,  // <-- AJOUTER
  },
})
```

- [ ] **Étape 3.5 : Commit**

```bash
git add prisma/schema.prisma app/api/quiz/route.ts
git commit -m "feat(api): store diagnostic answers in QuizResult"
```

---

## Task 4 : ResultRevelation — Étape 1

**Files:**
- Create: `components/quiz/result-revelation.tsx`

- [ ] **Étape 4.1 : Créer `components/quiz/result-revelation.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { type AnalysisResult } from '@/lib/analysis'
import {
  PROFILE_COLORS,
  getProfileContent,
  getHybridContent,
  type ProfileType,
} from '@/lib/profile-content'

interface Props {
  analysis: AnalysisResult
  onScrollToScores: () => void
}

export function ResultRevelation({ analysis, onScrollToScores }: Props) {
  const primary = analysis.primary as ProfileType
  const secondary = analysis.secondary as ProfileType
  const color = PROFILE_COLORS[primary]

  const content = analysis.isHybrid
    ? getHybridContent(primary, secondary)
    : getProfileContent(primary)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Halo de couleur en arrière-plan */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: 0.05,
          top: '-200px',
        }}
      />

      {/* Badge profil */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase mb-8"
        style={{ borderColor: color, color }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: color }}
        />
        Profil identifié
      </motion.div>

      {/* Nom du profil */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-extrabold leading-none mb-6"
        style={{
          fontSize: 'clamp(52px, 9vw, 84px)',
          letterSpacing: '-2px',
          color,
        }}
      >
        {content.name}
      </motion.h1>

      {/* Déclaration de douleur */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-zinc-300 max-w-[580px] mb-12 leading-relaxed"
        style={{ fontSize: 'clamp(17px, 2.5vw, 21px)' }}
      >
        {content.pain}
      </motion.p>

      {/* Les 3 vérités */}
      <div className="flex flex-col gap-3 w-full max-w-[540px] mb-14">
        {content.truths.map((truth, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            className="flex items-start gap-4 bg-zinc-900/60 border rounded-xl px-5 py-4 text-left"
            style={{ borderColor: `${color}33`, borderLeftColor: color, borderLeftWidth: '3px' }}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{truth.icon}</span>
            <p className="text-sm text-zinc-300 leading-relaxed">
              <strong className="text-white">{truth.bold}</strong>
              {truth.rest}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Scroll hint */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onScrollToScores}
        className="flex flex-col items-center gap-2 text-zinc-500 text-xs hover:text-zinc-400 transition-colors"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-lg"
        >
          ⌄
        </motion.span>
        Voir mon analyse détaillée
      </motion.button>
    </div>
  )
}
```

- [ ] **Étape 4.2 : Vérification visuelle**

```bash
npm run dev
```
Naviguer manuellement sur `/quiz`, compléter le quiz et vérifier que le composant s'affiche correctement. (Le composant n'est pas encore branché — vérification à la Task 8.)

- [ ] **Étape 4.3 : Commit**

```bash
git add components/quiz/result-revelation.tsx
git commit -m "feat(quiz): add ResultRevelation step 1 emotional full-screen"
```

---

## Task 5 : ResultScores — Étape 2

**Files:**
- Create: `components/quiz/result-scores.tsx`

- [ ] **Étape 5.1 : Créer `components/quiz/result-scores.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { type AnalysisResult } from '@/lib/analysis'
import { PROFILE_COLORS, type ProfileType } from '@/lib/profile-content'

const PROFILE_LABELS: Record<ProfileType, string> = {
  builder: 'Builder',
  creator: 'Créateur',
  strategist: 'Stratège',
  catalyst: 'Catalyst',
}

interface UserData {
  pseudo?: string | null
  name?: string | null
  memberNumber?: number | null
  class?: string | null
  level?: number | null
  experience?: number | null
}

interface Props {
  analysis: AnalysisResult
  user: UserData
}

export function ResultScores({ analysis, user }: Props) {
  const primary = analysis.primary as ProfileType
  const color = PROFILE_COLORS[primary]
  const displayName = user.pseudo ?? user.name ?? 'Membre'
  const initial = displayName.charAt(0).toUpperCase()

  const profileEntries = Object.entries(analysis.percentages) as [ProfileType, number][]

  const whatsappMessage = encodeURIComponent(
    `Je viens de découvrir mon profil HASHCODE : ${PROFILE_LABELS[primary]} 🎯\nFais le quiz et découvre le tien → https://joinhashcode.com`
  )
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`

  return (
    <section className="px-6 py-16 max-w-2xl mx-auto">
      {/* Label section */}
      <p className="text-[11px] tracking-[0.25em] uppercase text-zinc-500 text-center mb-8">
        Analyse psychométrique
      </p>

      {/* Grille des scores */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        {profileEntries.map(([type, percent], i) => {
          const isPrimary = type === primary
          const typeColor = PROFILE_COLORS[type]
          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border p-5"
              style={{
                borderColor: isPrimary ? color : '#1a1a1a',
                background: isPrimary ? `${color}08` : '#0f0f0f',
              }}
            >
              <p
                className="text-[11px] tracking-widest uppercase mb-2"
                style={{ color: isPrimary ? color : '#555' }}
              >
                {PROFILE_LABELS[type]}
              </p>
              <p
                className="text-4xl font-extrabold leading-none mb-3"
                style={{ color: isPrimary ? color : '#2a2a2a' }}
              >
                {percent}%
              </p>
              <div className="h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${percent}%`,
                    background: isPrimary ? color : '#2a2a2a',
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Carte membre */}
      <div className="flex items-center gap-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl px-6 py-5 mb-6">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-black flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}66)` }}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{displayName}</p>
          <p className="text-sm text-zinc-500">
            Membre {user.memberNumber ? `#${String(user.memberNumber).padStart(4, '0')}` : ''} · Niveau {user.level ?? 1} · {user.experience ?? 0} XP
          </p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase flex-shrink-0"
          style={{ background: `${color}18`, color }}
        >
          {PROFILE_LABELS[primary]}
        </span>
      </div>

      {/* Partage WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <span>↗</span>
        Partager ma carte profil sur WhatsApp
      </a>
    </section>
  )
}
```

- [ ] **Étape 5.2 : Commit**

```bash
git add components/quiz/result-scores.tsx
git commit -m "feat(quiz): add ResultScores step 2 with WhatsApp share"
```

---

## Task 6 : ResultLocked — Étape 3

**Files:**
- Create: `components/quiz/result-locked.tsx`

- [ ] **Étape 6.1 : Créer `components/quiz/result-locked.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { type AnalysisResult } from '@/lib/analysis'
import { PROFILE_COLORS, getProfileContent, type ProfileType } from '@/lib/profile-content'

interface Props {
  analysis: AnalysisResult
}

export function ResultLocked({ analysis }: Props) {
  const primary = analysis.primary as ProfileType
  const color = PROFILE_COLORS[primary]
  const content = getProfileContent(primary)

  return (
    <section className="px-6 py-16 max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Ton parcours {content.name} t&apos;attend
        </h2>
        <p className="text-sm text-zinc-500">
          2 missions accessibles maintenant · reste disponible avec un accès membre
        </p>
      </div>

      {/* Liste des missions */}
      <div className="flex flex-col gap-2.5 mb-10">
        {/* Missions déverrouillées */}
        {content.unlockedMissions.map((mission, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span className="text-sm font-medium text-white">{mission.title}</span>
            </div>
            <span className="text-xs font-semibold flex-shrink-0" style={{ color }}>
              +{mission.xp} XP
            </span>
          </motion.div>
        ))}

        {/* Missions verrouillées */}
        {content.lockedMissions.map((mission, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl px-5 py-4 opacity-40"
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-zinc-600 flex-shrink-0" />
              <span className="text-sm text-zinc-400">{mission.title}</span>
            </div>
            <span className="text-sm">🔒</span>
          </div>
        ))}

        {/* Ligne "et plus" */}
        <div className="flex items-center gap-3 px-5 py-3 opacity-25">
          <span className="w-2 h-2 rounded-full bg-zinc-700 flex-shrink-0" />
          <span className="text-sm text-zinc-600">Et bien d&apos;autres missions...</span>
        </div>
      </div>

      {/* Preuve sociale */}
      <div className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl px-6 py-5 mb-10">
        {/* Avatars fictifs */}
        <div className="flex flex-shrink-0">
          {['K', 'A', 'M'].map((letter, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-black"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}55)`,
                marginLeft: i === 0 ? 0 : '-8px',
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">{content.socialProof}</p>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4">
        <Link
          href={`/community/${primary}`}
          className="w-full max-w-sm text-center py-4 px-8 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5"
          style={{
            background: color,
            boxShadow: `0 8px 30px -8px ${color}55`,
          }}
        >
          {content.ctaLabel}
        </Link>
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
          Retourner à l&apos;accueil
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Étape 6.2 : Commit**

```bash
git add components/quiz/result-locked.tsx
git commit -m "feat(quiz): add ResultLocked step 3 with missions and CTA"
```

---

## Task 7 : ResultPage — Orchestrateur

**Files:**
- Create: `components/quiz/result-page.tsx`

- [ ] **Étape 7.1 : Créer `components/quiz/result-page.tsx`**

```tsx
'use client'

import { useRef } from 'react'
import { type AnalysisResult } from '@/lib/analysis'
import { ResultRevelation } from './result-revelation'
import { ResultScores } from './result-scores'
import { ResultLocked } from './result-locked'

interface UserData {
  pseudo?: string | null
  name?: string | null
  memberNumber?: number | null
  class?: string | null
  level?: number | null
  experience?: number | null
}

interface Props {
  analysis: AnalysisResult
  user: UserData
}

export function ResultPage({ analysis, user }: Props) {
  const scoresRef = useRef<HTMLDivElement>(null)

  function scrollToScores() {
    scoresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      {/* Étape 1 : Révélation émotionnelle */}
      <ResultRevelation analysis={analysis} onScrollToScores={scrollToScores} />

      {/* Séparateur */}
      <div ref={scoresRef} className="flex items-center gap-4 px-6 max-w-2xl mx-auto py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] text-zinc-600 tracking-[0.2em] uppercase whitespace-nowrap">
          Analyse psychométrique
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Étape 2 : Scores */}
      <ResultScores analysis={analysis} user={user} />

      {/* Séparateur */}
      <div className="flex items-center gap-4 px-6 max-w-2xl mx-auto py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] text-zinc-600 tracking-[0.2em] uppercase whitespace-nowrap">
          Ton parcours t&apos;attend
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Étape 3 : Missions verrouillées */}
      <ResultLocked analysis={analysis} />
    </div>
  )
}
```

- [ ] **Étape 7.2 : Commit**

```bash
git add components/quiz/result-page.tsx
git commit -m "feat(quiz): add ResultPage orchestrator composing 3 steps"
```

---

## Task 8 : Branchement dans quiz.tsx

**Files:**
- Modify: `components/quiz/quiz.tsx`

- [ ] **Étape 8.1 : Ajouter l'import de ResultPage**

En haut de `components/quiz/quiz.tsx`, ajouter :

```tsx
import { ResultPage } from './result-page'
```

- [ ] **Étape 8.2 : Remplacer le bloc résultat**

Dans `components/quiz/quiz.tsx`, trouver le bloc qui rend les résultats (contient les scores en grille 2×4, la MemberCard, les canaux recommandés et le CTA "Prêt à hacker ton futur ?"). Remplacer **tout ce bloc** par :

```tsx
{/* Résultat du quiz */}
<ResultPage analysis={analysis} user={user} />
```

Le `user` prop est déjà disponible dans le composant Quiz (passé depuis `app/quiz/page.tsx`).

- [ ] **Étape 8.3 : Vérifier que le build compile**

```bash
npm run build
```
Résultat attendu : build sans erreur TypeScript.

- [ ] **Étape 8.4 : Test visuel**

```bash
npm run dev
```
Compléter le quiz en entier et vérifier :
- Étape 1 s'affiche plein écran avec la bonne couleur de profil
- Le scroll hint fonctionne
- Étape 2 s'affiche avec les bons scores
- Le lien WhatsApp s'ouvre avec le bon texte
- Étape 3 s'affiche avec les bonnes missions et le bon CTA

- [ ] **Étape 8.5 : Commit**

```bash
git add components/quiz/quiz.tsx
git commit -m "feat(quiz): wire ResultPage into quiz result display"
```

---

## Task 9 : Branchement du diagnostic pré-quiz

**Files:**
- Modify: `app/quiz/page.tsx`

- [ ] **Étape 9.1 : Modifier `app/quiz/page.tsx` pour insérer le diagnostic**

`app/quiz/page.tsx` est un Server Component — le diagnostic (qui lit localStorage) doit être dans un Client Component wrapper. Créer d'abord le wrapper :

```tsx
// components/quiz/quiz-with-diagnostic.tsx
'use client'

import { useState, useEffect } from 'react'
import { PreQuizDiagnostic, type DiagnosticAnswers } from './pre-quiz-diagnostic'
import { Quiz } from './quiz'

interface UserData {
  id: string
  pseudo?: string | null
  name?: string | null
  memberNumber?: number | null
  class?: string | null
  level?: number | null
  experience?: number | null
  createdAt: Date
}

interface Props {
  user: UserData
}

export function QuizWithDiagnostic({ user }: Props) {
  const [diagnosticDone, setDiagnosticDone] = useState(false)
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticAnswers | null>(null)

  useEffect(() => {
    const done = localStorage.getItem('hashcode_diagnostic_done')
    if (done === 'true') setDiagnosticDone(true)
  }, [])

  function handleDiagnosticComplete(answers: DiagnosticAnswers) {
    setDiagnosticAnswers(answers)
    setDiagnosticDone(true)
  }

  if (!diagnosticDone) {
    return <PreQuizDiagnostic onComplete={handleDiagnosticComplete} />
  }

  return <Quiz user={user} diagnosticAnswers={diagnosticAnswers} />
}
```

- [ ] **Étape 9.2 : Mettre à jour la prop de Quiz pour accepter diagnosticAnswers**

Dans `components/quiz/quiz.tsx`, ajouter `diagnosticAnswers` aux props du composant :

```tsx
interface QuizProps {
  user: { ... }  // props existantes inchangées
  diagnosticAnswers?: DiagnosticAnswers | null
}
```

Passer `diagnosticAnswers` dans le payload de la soumission à l'API :

```ts
// Dans la fonction de soumission du quiz, trouver le fetch vers /api/quiz
const response = await fetch('/api/quiz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    answers,
    responseTimes,
    diagnosticAnswers: props.diagnosticAnswers ?? null,  // <-- AJOUTER
  }),
})
```

- [ ] **Étape 9.3 : Remplacer l'usage de `Quiz` dans `app/quiz/page.tsx`**

```tsx
// Avant
import { Quiz } from '@/components/quiz/quiz'
// ...
<Quiz user={user} />

// Après
import { QuizWithDiagnostic } from '@/components/quiz/quiz-with-diagnostic'
// ...
<QuizWithDiagnostic user={user} />
```

- [ ] **Étape 9.4 : Vérifier le build**

```bash
npm run build
```
Résultat attendu : build sans erreur.

- [ ] **Étape 9.5 : Test visuel du flux complet**

```bash
npm run dev
```
Vérifier le flux end-to-end :
1. Naviguer sur `/quiz` (session active) → le diagnostic apparaît
2. Répondre aux 5 questions → le quiz démarre
3. Compléter le quiz → la page résultat en 3 étapes s'affiche
4. Recharger `/quiz` → le diagnostic n'apparaît plus (localStorage)

- [ ] **Étape 9.6 : Commit final**

```bash
git add components/quiz/quiz-with-diagnostic.tsx components/quiz/quiz.tsx app/quiz/page.tsx
git commit -m "feat(quiz): add pre-quiz diagnostic flow with localStorage guard"
```

---

## Task 10 : Tests de régression

**Files:**
- Run: tous les tests existants

- [ ] **Étape 10.1 : Lancer la suite complète**

```bash
npm run test
```
Résultat attendu : tous les tests passent, aucune régression.

- [ ] **Étape 10.2 : Build de production final**

```bash
npm run build
```
Résultat attendu : build propre sans erreur ni warning TypeScript critique.

- [ ] **Étape 10.3 : Commit de clôture**

```bash
git add .
git commit -m "test(quiz): verify full test suite passes after revelation refactor"
```

---

## Auto-review du plan

**Couverture de la spec :**
- ✅ Zéro IA, tout statique → `lib/profile-content.ts` avec contenu écrit à la main
- ✅ Diagnostic pré-quiz 5 questions → Task 2
- ✅ Étape 1 révélation émotionnelle → Task 4
- ✅ Étape 2 scores + carte membre + WhatsApp → Task 5
- ✅ Étape 3 missions verrouillées + preuve sociale + CTA → Task 6
- ✅ Prisma schema + API update → Task 3
- ✅ Profils hybrides → `getHybridContent()` dans Task 1, utilisé dans Task 4
- ✅ Mobile-first (clamp, max-w, px-6) → présent dans chaque composant
- ✅ LocalStorage guard pour diagnostic → Task 9

**Cohérence des types :**
- `ProfileType` défini dans `lib/profile-content.ts`, réutilisé dans tous les composants
- `AnalysisResult` importé de `lib/analysis` (existant, inchangé)
- `DiagnosticAnswers` défini dans `pre-quiz-diagnostic.tsx`, importé dans `quiz-with-diagnostic.tsx` et `quiz.tsx`
- `UserData` interface cohérente entre `result-scores.tsx`, `result-page.tsx` et `quiz-with-diagnostic.tsx`

**Placeholders :** aucun TBD, aucun TODO.

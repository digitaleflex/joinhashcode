# P9 — Missions hebdomadaires légères (Daily Challenges)

**Priorité :** 🟢 Long terme  
**Effort estimé :** ~6h  
**Pourquoi c'est important :** Avec seulement 5 missions actives, un utilisateur n'a aucune raison de revenir après les avoir faites. Les "daily/weekly challenges" sont la mécanique de rétention la plus efficace dans les apps de gamification. Faible barrière, forte fréquence.

---

## Concept

Des missions légères qui se **renouvellent chaque semaine** (lundi à minuit UTC). Elles prennent 2–5 minutes à compléter. Exemples :

- "Partage une ressource qui t'a aidé cette semaine" (TEXT_RESPONSE)
- "Nomme un problème tech que tu veux résoudre" (TEXT_RESPONSE)
- "Complète ton profil avec une info manquante" (auto-validé)
- "Fais un check-in avec ton squad" (auto-validé)
- "Partage le lien de ton dernier projet ou commit" (GITHUB_LINK / LIVE_URL)

XP : petit (20–40 XP par challenge), mais accumulable avec le streak hebdomadaire.

---

## Ce qu'il faut faire

### Étape 1 — Modifier le modèle Prisma

Ajouter deux champs au modèle `Mission` :

```prisma
// prisma/schema.prisma — dans le modèle Mission
isWeeklyChallenge Boolean @default(false)
weeklySlot        Int?    // 1–52 (numéro de semaine de l'année)
```

Appliquer :

```bash
npx prisma db push
```

### Étape 2 — Créer le pool de challenges dans `lib/missions.ts`

Ajouter un tableau de challenges hebdomadaires statiques :

```ts
// lib/missions.ts — ajouter à la suite
export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: "weekly-share-resource",
    title: "Partage une ressource",
    shortDesc:
      "Un article, une vidéo, un outil qui t'a été utile cette semaine.",
    xp: 30,
    type: "GENERAL",
    submissionMethod: "TEXT_RESPONSE",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    weeklySlot: null, // null = peut apparaître n'importe quelle semaine
  },
  {
    id: "weekly-tech-problem",
    title: "Un problème, une idée",
    shortDesc:
      "Décris un problème tech que tu observes dans ton environnement.",
    xp: 25,
    type: "GENERAL",
    submissionMethod: "TEXT_RESPONSE",
    targetProfiles: ["builder", "strategist"],
    weeklySlot: null,
  },
  {
    id: "weekly-share-project",
    title: "Montre ton travail",
    shortDesc:
      "Partage le lien d'un projet ou commit récent. Peu importe la taille.",
    xp: 35,
    type: "CODE",
    submissionMethod: "GITHUB_LINK",
    targetProfiles: ["builder", "creator"],
    weeklySlot: null,
  },
  {
    id: "weekly-squad-checkin",
    title: "Check-in squad",
    shortDesc:
      "Fais un check-in quotidien avec ton squad pour maintenir la cohésion.",
    xp: 20,
    type: "GENERAL",
    submissionMethod: "TEXT_RESPONSE", // auto-validé (voir étape 5)
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    weeklySlot: null,
  },
  // Ajouter d'autres challenges ici au fil du temps
];

// Helper : retourne le challenge de la semaine courante
export function getCurrentWeeklyChallenge(): WeeklyChallenge {
  const weekNumber = getWeekNumber(new Date());
  return WEEKLY_CHALLENGES[weekNumber % WEEKLY_CHALLENGES.length];
}

// Helper : numéro de semaine ISO
function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
```

### Étape 3 — Seed les challenges en DB

Dans `prisma/seed.ts`, ajouter après le seed des missions normales :

```ts
// Dans prisma/seed.ts
import { WEEKLY_CHALLENGES } from "../lib/missions";

for (const challenge of WEEKLY_CHALLENGES) {
  await prisma.mission.upsert({
    where: { slug: challenge.id },
    update: {
      title: challenge.title,
      shortDesc: challenge.shortDesc,
      xp: challenge.xp,
      category: challenge.type,
      isWeeklyChallenge: true,
      targetProfiles: challenge.targetProfiles,
      submissionMethod: challenge.submissionMethod,
      missionLevel: "INIT",
      difficulty: 1,
    },
    create: {
      slug: challenge.id,
      title: challenge.title,
      shortDesc: challenge.shortDesc,
      xp: challenge.xp,
      category: challenge.type,
      isWeeklyChallenge: true,
      targetProfiles: challenge.targetProfiles,
      submissionMethod: challenge.submissionMethod,
      missionLevel: "INIT",
      difficulty: 1,
    },
  });
}
```

### Étape 4 — Créer la section "Challenge de la Semaine" sur la page missions

Dans `app/missions/page.tsx`, récupérer le challenge courant :

```ts
// Dans le server component
import { getCurrentWeeklyChallenge } from "@/lib/missions";

const currentWeeklySlug = getCurrentWeeklyChallenge().id;
const weeklyMission = await db.mission.findUnique({
  where: { slug: currentWeeklySlug },
});

// Vérifier si l'utilisateur a déjà complété le challenge cette semaine
const weekStart = getWeekStart(); // lundi de la semaine en cours
const weeklySubmission = weeklyMission
  ? await db.missionSubmission.findFirst({
      where: {
        userId: session.user.id,
        missionId: weeklyMission.id,
        createdAt: { gte: weekStart },
      },
    })
  : null;
```

### Étape 5 — Composant `WeeklyChallengeBanner`

Créer : `components/missions/weekly-challenge-banner.tsx`

```tsx
// components/missions/weekly-challenge-banner.tsx
"use client";

import { motion } from "framer-motion";
import { Zap, Check, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface WeeklyChallengeBannerProps {
  mission: any;
  isCompleted: boolean;
  daysLeft: number; // jours restants avant reset (lundi prochain)
}

export function WeeklyChallengeBanner({
  mission,
  isCompleted,
  daysLeft,
}: WeeklyChallengeBannerProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative p-5 rounded-[1.75rem] border overflow-hidden cursor-pointer group/weekly transition-all duration-500",
        isCompleted
          ? "bg-emerald-950/10 border-emerald-500/20"
          : "bg-primary/5 border-primary/20 hover:bg-primary/10",
      )}
      onClick={() => !isCompleted && router.push(`/missions/${mission.slug}`)}
    >
      {/* Fond animé subtil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,255,59,0.04),transparent_60%)] pointer-events-none" />

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          {/* Icône */}
          <div
            className={cn(
              "size-10 rounded-xl border flex items-center justify-center shrink-0",
              isCompleted
                ? "bg-emerald-950/40 border-emerald-500/30"
                : "bg-primary/10 border-primary/30",
            )}
          >
            {isCompleted ? (
              <Check className="size-5 text-emerald-400" />
            ) : (
              <Zap className="size-5 text-primary" />
            )}
          </div>

          {/* Texte */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono font-black uppercase tracking-widest text-primary">
                Challenge de la semaine
              </span>
              <span className="text-[7px] font-mono text-zinc-600">
                {isCompleted ? "Complété" : `Reset dans ${daysLeft}j`}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">{mission.title}</p>
            <p className="text-[10px] text-zinc-400 font-light">
              {mission.shortDesc}
            </p>
          </div>
        </div>

        {/* XP + flèche */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[8px] font-mono text-zinc-600 block">
              Récompense
            </span>
            <span className="text-sm font-black text-primary">
              +{mission.xp} XP
            </span>
          </div>
          {!isCompleted && (
            <ChevronRight className="size-4 text-zinc-600 group-hover/weekly:text-primary group-hover/weekly:translate-x-1 transition-all" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
```

### Étape 6 — Intégrer le banner dans la page missions

Dans `app/missions/page.tsx`, passer les données au composant. Dans `components/missions/missions-list.tsx` ou directement dans la page, afficher le banner en haut, juste avant la liste :

```tsx
{
  weeklyMission && (
    <WeeklyChallengeBanner
      mission={weeklyMission}
      isCompleted={
        !!weeklySubmission && weeklySubmission.status !== "NEEDS_REVISION"
      }
      daysLeft={daysUntilMonday()}
    />
  );
}
```

Helper `daysUntilMonday()` :

```ts
function daysUntilMonday(): number {
  const today = new Date();
  const day = today.getDay(); // 0=dim, 1=lun, ...
  return day === 0 ? 1 : 8 - day;
}
```

### Étape 7 — Validation automatique (optionnelle pour les challenges simples)

Pour les challenges de type "check-in squad" ou "compléter le profil", la validation peut être automatique (pas de peer review). Dans l'API `POST /api/missions`, si `mission.isWeeklyChallenge && mission.category === "GENERAL"`, passer directement au statut `APPROVED` et awardi les XP sans passer par la file de review.

```ts
// Dans app/api/missions/route.ts — après création de la soumission
if (mission.isWeeklyChallenge) {
  // Auto-approbation pour les challenges hebdomadaires
  await db.missionSubmission.update({
    where: { id: submission.id },
    data: { status: "APPROVED", xpAwarded: mission.xp },
  });
  await db.user.update({
    where: { id: userId },
    data: { experience: { increment: mission.xp } },
  });
  return NextResponse.json({
    submission: { ...submission, status: "APPROVED" },
    bonusXp: mission.xp,
  });
}
```

---

## Résultat attendu

- Chaque semaine (lundi), un nouveau challenge apparaît en haut de la page missions
- L'utilisateur peut le compléter en 2–5 minutes
- Auto-validé → XP crédités immédiatement
- Un fois fait, badge "Complété" sur le banner jusqu'au lundi suivant
- Raison de revenir sur la plateforme chaque semaine

---

## Fichiers touchés

- `prisma/schema.prisma` — ajouter `isWeeklyChallenge` et `weeklySlot`
- `lib/missions.ts` — ajouter `WEEKLY_CHALLENGES`, `getCurrentWeeklyChallenge()`, `getWeekNumber()`
- `prisma/seed.ts` — seed les challenges
- `app/missions/page.tsx` — query + passage des props
- `components/missions/weekly-challenge-banner.tsx` — créer
- `app/api/missions/route.ts` — logique d'auto-approbation

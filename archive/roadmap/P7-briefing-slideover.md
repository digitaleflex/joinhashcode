# P7 — Panneau slide-over pour lire un briefing sans quitter la liste

**Priorité :** 🟢 Amélioration  
**Effort estimé :** ~3h  
**Pourquoi c'est utile :** Pour vérifier si une mission convient, l'utilisateur doit naviguer vers `/missions/[id]`, lire, puis revenir. C'est 2 navigations pour ce qui est souvent juste une curiosité. Un panneau latéral (slide-over) réduit cette friction à un seul clic sans quitter la liste.

---

## Contexte

- **Composant liste :** `components/missions/missions-list.tsx`
- **Page détail :** `app/missions/[id]/page.tsx`
- shadcn/ui a un composant `Sheet` (panneau latéral) déjà disponible dans `components/ui/sheet.tsx`
- La navigation complète vers la page détail reste utile pour : commencer la mission, voir sa soumission en cours, accéder au formulaire

---

## Ce qu'il faut faire

### Étape 1 — Vérifier que `Sheet` est disponible

```bash
# Vérifier que components/ui/sheet.tsx existe
ls components/ui/sheet.tsx
```

Si absent, l'ajouter via shadcn :

```bash
npx shadcn@latest add sheet
```

### Étape 2 — Créer le composant `MissionSlideOver`

Créer : `components/missions/mission-slideover.tsx`

```tsx
// components/missions/mission-slideover.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MissionBriefing } from "@/components/missions/mission-briefing";
import { useRouter } from "next/navigation";
import { Zap, Clock, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionSlideOverProps {
  mission: any | null; // Utiliser le type Mission correct de lib/missions.ts
  isOpen: boolean;
  onClose: () => void;
  userLevel: number;
  hasSubmission?: boolean;
  submissionStatus?: string | null;
}

const DIFFICULTY_LABEL = ["", "Initié", "Apprenti", "Confirmé", "Expert"];
const TYPE_COLORS: Record<string, string> = {
  CODE: "text-cyan-400 bg-cyan-950/40 border-cyan-500/30",
  DESIGN: "text-purple-400 bg-purple-950/40 border-purple-500/30",
  BUSINESS: "text-amber-400 bg-amber-950/40 border-amber-500/30",
  NETWORK: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
  GENERAL: "text-zinc-400 bg-zinc-900/40 border-zinc-500/30",
  INTRO: "text-primary bg-primary/10 border-primary/30",
};

export function MissionSlideOver({
  mission,
  isOpen,
  onClose,
  userLevel,
  hasSubmission,
  submissionStatus,
}: MissionSlideOverProps) {
  const router = useRouter();

  if (!mission) return null;

  const isLocked = userLevel < (mission.requiredLevel ?? 1);
  const isApproved = submissionStatus === "APPROVED";

  const handleCommencer = () => {
    onClose();
    router.push(`/missions/${mission.id}`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-zinc-950 border-l border-white/5 overflow-y-auto scrollbar-none p-0"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                    TYPE_COLORS[mission.type] || TYPE_COLORS.GENERAL,
                  )}
                >
                  {mission.type}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded-full">
                  {DIFFICULTY_LABEL[mission.level] || ""}
                </span>
                {isApproved && (
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    ✓ Complété
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-white leading-tight truncate">
                {mission.title}
              </h2>

              {/* Meta */}
              <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Zap className="size-2.5 text-primary" />+{mission.xp} XP
                </span>
                {mission.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-2.5" />
                    {mission.duration}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Corps */}
        <div className="p-6 space-y-6">
          {/* Description courte */}
          <p className="text-sm text-zinc-400 font-light leading-relaxed">
            {mission.shortDesc || mission.description}
          </p>

          {/* Livrables */}
          {mission.deliverables?.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">
                Livrables attendus
              </p>
              <ul className="space-y-1.5">
                {mission.deliverables.map((d: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-zinc-400"
                  >
                    <span className="text-primary mt-0.5 shrink-0">›</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Briefing complet si disponible */}
          {mission.fullBriefing && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">
                Briefing
              </p>
              <div className="prose-sm max-h-60 overflow-y-auto scrollbar-none">
                <MissionBriefing content={mission.fullBriefing} />
              </div>
            </div>
          )}
        </div>

        {/* Footer avec CTA */}
        <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-xl border-t border-white/5 p-6">
          {isLocked ? (
            <div className="flex items-center gap-3 p-4 bg-zinc-900/60 rounded-2xl border border-white/5">
              <Lock className="size-4 text-zinc-600 shrink-0" />
              <p className="text-xs text-zinc-500">
                Niveau {mission.requiredLevel} requis pour accéder à cette
                mission.
              </p>
            </div>
          ) : isApproved ? (
            <div className="flex items-center gap-3 p-4 bg-emerald-950/20 rounded-2xl border border-emerald-500/20">
              <span className="text-emerald-400 text-sm font-bold">
                Mission complétée ✓
              </span>
            </div>
          ) : (
            <Button
              onClick={handleCommencer}
              className="w-full btn-primary-glow h-12 rounded-xl text-[11px] uppercase font-black tracking-wider gap-2"
            >
              {hasSubmission ? "Voir ma soumission" : "Commencer la mission"}
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

### Étape 3 — Intégrer dans `missions-list.tsx`

Dans `components/missions/missions-list.tsx` :

```tsx
"use client"

import { useState } from "react"
import { MissionSlideOver } from "./mission-slideover"

// Dans le composant MissionsList :
const [selectedMission, setSelectedMission] = useState<any | null>(null)

// Sur chaque carte de mission, ajouter un bouton "Aperçu" discret :
<button
  onClick={() => setSelectedMission(mission)}
  className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
>
  Voir le briefing
</button>

// Et en dehors de la liste, le slide-over :
<MissionSlideOver
  mission={selectedMission}
  isOpen={!!selectedMission}
  onClose={() => setSelectedMission(null)}
  userLevel={userLevel}         // prop à passer depuis la page
  hasSubmission={/* vérifier si l'user a déjà soumis */}
  submissionStatus={/* status de la soumission si elle existe */}
/>
```

### Étape 4 — Passer les données de soumission au composant liste

Pour que le slide-over sache si l'utilisateur a déjà une soumission, passer les soumissions de l'utilisateur en prop :

```ts
// Dans app/missions/page.tsx
const userSubmissions = await db.missionSubmission.findMany({
  where: { userId: session.user.id },
  select: { missionId: true, status: true }
})

// Passer à MissionsList comme prop
<MissionsList
  missions={enrichedMissions}
  userLevel={session.user.level}
  userSubmissions={userSubmissions}  // nouveau
/>
```

---

## Résultat attendu

Sur chaque carte : lien "Voir le briefing" → panneau latéral s'ouvre avec description + livrables + briefing + bouton "Commencer" en bas. La page liste reste visible derrière.

---

## Fichiers touchés

- `components/missions/mission-slideover.tsx` — créer
- `components/missions/missions-list.tsx` — ajouter le state + le composant
- `app/missions/page.tsx` — passer `userSubmissions` en prop
- `components/ui/sheet.tsx` — vérifier qu'il existe (ajouter via shadcn si absent)

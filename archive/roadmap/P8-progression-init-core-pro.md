# P8 — Organisation visuelle INIT → CORE → PRO

**Priorité :** 🟢 Amélioration  
**Effort estimé :** ~2h  
**Pourquoi c'est utile :** Actuellement la liste des missions ne donne pas de sens de progression. Un nouvel utilisateur ne sait pas par où commencer. Organiser les missions en 3 étapes (INIT / CORE / PRO) avec un indicateur visuel de l'étape en cours crée un "parcours" clair qui motive à avancer.

---

## Contexte

- **Fichier :** `components/missions/missions-list.tsx`
- Les missions ont un champ `missionLevel` : `"INIT" | "CORE" | "PRO"` (ou `progressionLevel` dans `lib/missions.ts`)
- Le modèle Prisma `Mission` a un champ `missionLevel` (string)
- L'utilisateur a un `level` (1–4) et des `experience` (XP)
- Mapping niveau → étape :
  - INIT = level 1 (0–99 XP)
  - CORE = level 2–3 (100–1399 XP)
  - PRO = level 4+ (1400+ XP)

---

## Ce qu'il faut faire

### Étape 1 — Définir les étapes et leur état

Dans `missions-list.tsx`, créer un helper pour déterminer l'étape de l'utilisateur :

```ts
type ProgressionStage = "INIT" | "CORE" | "PRO";

function getUserStage(userLevel: number): ProgressionStage {
  if (userLevel <= 1) return "INIT";
  if (userLevel <= 3) return "CORE";
  return "PRO";
}

const STAGE_CONFIG: Record<
  ProgressionStage,
  {
    label: string;
    sublabel: string;
    color: string;
    bgColor: string;
    borderColor: string;
    requiredLevel: number;
  }
> = {
  INIT: {
    label: "INIT",
    sublabel: "Missions de départ",
    color: "#10B981",
    bgColor: "bg-emerald-950/20",
    borderColor: "border-emerald-500/20",
    requiredLevel: 1,
  },
  CORE: {
    label: "CORE",
    sublabel: "Missions intermédiaires",
    color: "#06B6D4",
    bgColor: "bg-cyan-950/20",
    borderColor: "border-cyan-500/20",
    requiredLevel: 2,
  },
  PRO: {
    label: "PRO",
    sublabel: "Missions avancées",
    color: "#A855F7",
    bgColor: "bg-purple-950/20",
    borderColor: "border-purple-500/20",
    requiredLevel: 4,
  },
};
```

### Étape 2 — Regrouper les missions par étape

Remplacer le tri actuel (Disponibles / Verrouillées / ComingSoon) par un groupement par `missionLevel` :

```ts
// Dans le composant — remplacer la logique de tri existante
const missionsByStage = {
  INIT: availableMissions.filter((m) => m.missionLevel === "INIT"),
  CORE: availableMissions.filter((m) => m.missionLevel === "CORE"),
  PRO: availableMissions.filter((m) => m.missionLevel === "PRO"),
};
```

### Étape 3 — Nouveau rendu : barre de progression + sections

Remplacer le rendu en liste plate par ce layout :

```tsx
const userStage = getUserStage(userLevel);
const stages: ProgressionStage[] = ["INIT", "CORE", "PRO"];

return (
  <div className="space-y-10">
    {/* Barre de progression des étapes */}
    <div className="flex items-center gap-0">
      {stages.map((stage, i) => {
        const config = STAGE_CONFIG[stage];
        const isActive = stage === userStage;
        const isDone = stages.indexOf(userStage) > i;
        const isLocked = stages.indexOf(userStage) < i;

        return (
          <div key={stage} className="flex items-center flex-1">
            {/* Étape */}
            <div
              className={cn(
                "flex-1 py-3 px-4 flex flex-col items-center gap-0.5 rounded-2xl border transition-all duration-500",
                isActive
                  ? `${config.bgColor} ${config.borderColor}`
                  : isDone
                    ? "bg-zinc-900/30 border-white/5"
                    : "bg-transparent border-transparent",
              )}
            >
              <span
                className="text-[8px] font-mono font-black uppercase tracking-widest"
                style={{
                  color: isActive
                    ? config.color
                    : isDone
                      ? "#6b7280"
                      : "#374151",
                }}
              >
                {config.label}
              </span>
              <span className="text-[7px] text-zinc-600 font-mono">
                {config.sublabel}
              </span>
              {isDone && (
                <span className="text-[7px] text-emerald-500 font-mono mt-0.5">
                  ✓ Complété
                </span>
              )}
              {isActive && (
                <div
                  className="size-1.5 rounded-full mt-0.5 animate-pulse"
                  style={{ backgroundColor: config.color }}
                />
              )}
            </div>

            {/* Connecteur entre étapes */}
            {i < 2 && (
              <div
                className={cn(
                  "h-px w-4 shrink-0",
                  isDone || isActive ? "bg-white/10" : "bg-zinc-900",
                )}
              />
            )}
          </div>
        );
      })}
    </div>

    {/* Sections par étape */}
    {stages.map((stage) => {
      const config = STAGE_CONFIG[stage];
      const stageMissions = missionsByStage[stage];
      const isLocked = STAGE_CONFIG[stage].requiredLevel > userLevel;
      const isCurrentStage = stage === userStage;

      if (stageMissions.length === 0) return null;

      return (
        <section key={stage} className="space-y-4">
          {/* Header de section */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/5" />
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full border"
              style={{
                borderColor: `${config.color}30`,
                backgroundColor: `${config.color}08`,
              }}
            >
              <div
                className="size-1.5 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span
                className="text-[9px] font-mono font-black uppercase tracking-widest"
                style={{ color: config.color }}
              >
                {config.label}
              </span>
              <span className="text-[8px] text-zinc-600 font-mono">
                — {stageMissions.length} missions
              </span>
            </div>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Message si étape verrouillée */}
          {isLocked && (
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/40 rounded-xl border border-white/5">
              <Lock className="size-3 text-zinc-600" />
              <span className="text-[9px] text-zinc-600 font-mono">
                Niveau {config.requiredLevel} requis pour débloquer cette étape
              </span>
            </div>
          )}

          {/* Grille des missions de cette étape */}
          <div
            className={cn(
              "grid gap-4",
              isLocked && "opacity-40 pointer-events-none",
            )}
          >
            {stageMissions.map((mission) => (
              // Rendu de carte existant — sans changement
              <MissionCard
                key={mission.id}
                mission={mission}
                userLevel={userLevel}
              />
            ))}
          </div>
        </section>
      );
    })}

    {/* Coming soon en bas — version compacte (voir P2) */}
    {/* ... */}
  </div>
);
```

**Import à ajouter :**

```ts
import { Lock } from "lucide-react";
```

### Étape 4 — Extraire `MissionCard` en sous-composant

Pour simplifier le code, extraire le rendu de chaque carte en composant séparé dans le même fichier :

```tsx
function MissionCard({
  mission,
  userLevel,
}: {
  mission: any;
  userLevel: number;
}) {
  // Contenu de la carte existant — copier-coller depuis le map actuel
}
```

---

## Résultat attendu

La page missions affiche :

1. **Barre de progression** en haut : `[INIT ✓] ——— [CORE ●] ——— [PRO 🔒]`
2. **Section INIT** avec ses missions (débloquées)
3. **Section CORE** avec ses missions (débloquées ou verrouillées selon le niveau)
4. **Section PRO** avec ses missions (verrouillées en dessous du niveau 4)
5. **Chips coming soon** tout en bas (voir P2)

---

## Fichiers touchés

- `components/missions/missions-list.tsx` — restructuration du rendu

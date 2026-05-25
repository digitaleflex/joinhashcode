# P5 — Preuve sociale sur les cartes de mission

**Priorité :** 🟡 Important  
**Effort estimé :** ~2h  
**Pourquoi c'est important :** Les utilisateurs ne savent pas si une mission est populaire, difficile, ou bien notée. Les données existent déjà dans la DB (`MissionSubmission.userRating`, comptage des APPROVED). Les afficher crée de la confiance et encourage les complétions.

---

## Contexte

- **Composant cible :** `components/missions/missions-list.tsx`
- **Page liste :** `app/missions/page.tsx` — récupère les missions et les passe au composant
- **Données disponibles dans la DB :**
  - `MissionSubmission.status === "APPROVED"` → nombre de complétions
  - `MissionSubmission.userRating` (int 1–5) → rating moyen
- Ces données ne sont actuellement pas jointes dans la query de la liste

---

## Ce qu'il faut faire

### Étape 1 — Enrichir la query dans `app/missions/page.tsx`

Trouver la query qui récupère les missions et ajouter le comptage des soumissions approuvées et le rating moyen.

**Option A — Query avec agrégation Prisma (recommandée) :**

```ts
// Dans app/missions/page.tsx (server component)
const missions = await db.mission.findMany({
  include: {
    _count: {
      select: {
        submissions: {
          where: { status: "APPROVED" }
        }
      }
    },
    // Pour le rating moyen, une query séparée est plus lisible
  }
})

// Rating moyen par mission en une query groupée
const ratingsRaw = await db.missionSubmission.groupBy({
  by: ["missionId"],
  where: {
    status: "APPROVED",
    userRating: { not: null },
  },
  _avg: { userRating: true },
  _count: { userRating: true },
})

// Construire un map pour accès rapide
const ratingsMap = Object.fromEntries(
  ratingsRaw.map(r => [r.missionId, {
    avg: r._avg.userRating,
    count: r._count.userRating,
  }])
)

// Enrichir les missions
const enrichedMissions = missions.map(m => ({
  ...m,
  completionsCount: m._count.submissions,
  avgRating: ratingsMap[m.id]?.avg ?? null,
  ratingsCount: ratingsMap[m.id]?.count ?? 0,
}))
```

Passer `enrichedMissions` au composant `MissionsList`.

### Étape 2 — Mettre à jour les types dans `MissionsList`

Dans `components/missions/missions-list.tsx`, mettre à jour le type de prop :

```ts
interface MissionWithStats {
  // ... champs Mission existants ...
  completionsCount: number
  avgRating: number | null
  ratingsCount: number
}
```

### Étape 3 — Afficher sur chaque carte

Dans le rendu de chaque carte de mission, ajouter un bloc discret en bas de carte :

```tsx
{/* Bloc preuve sociale — à placer en bas de chaque carte, avant le bouton d'action */}
<div className="flex items-center gap-4 pt-3 border-t border-white/5 mt-3">
  {/* Nombre de complétions */}
  <div className="flex items-center gap-1.5">
    <div className="size-1.5 rounded-full bg-emerald-500/60" />
    <span className="text-[9px] font-mono text-zinc-500">
      {mission.completionsCount > 0
        ? `${mission.completionsCount} complét${mission.completionsCount > 1 ? "ions" : "ion"}`
        : "Sois le premier"}
    </span>
  </div>

  {/* Rating moyen — seulement si assez de données (min 3 ratings) */}
  {mission.avgRating !== null && mission.ratingsCount >= 3 && (
    <div className="flex items-center gap-1">
      <span className="text-[9px] font-mono text-amber-400">
        {"★".repeat(Math.round(mission.avgRating))}{"☆".repeat(5 - Math.round(mission.avgRating))}
      </span>
      <span className="text-[8px] text-zinc-600 font-mono">
        {mission.avgRating.toFixed(1)}
      </span>
    </div>
  )}
</div>
```

---

## Règles d'affichage

| Condition | Affichage |
|---|---|
| 0 complétions | "Sois le premier" |
| 1–2 complétions | "1 complétion" / "2 complétions" |
| 3+ complétions | nombre + étoiles si ratings suffisants |
| Moins de 3 ratings | étoiles masquées (évite la notation biaisée) |

---

## Performance

Ne pas faire cette query côté client. La page missions est un **Server Component** — les queries s'exécutent côté serveur au moment du rendu. Pas d'API supplémentaire nécessaire.

---

## Fichiers touchés
- `app/missions/page.tsx` — enrichir la query (2 requêtes ajoutées)
- `components/missions/missions-list.tsx` — ajouter le bloc social proof dans les cartes + mettre à jour les types

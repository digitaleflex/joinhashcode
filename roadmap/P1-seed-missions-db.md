# P1 — Seed des missions en base de données

**Priorité :** 🔴 Critique  
**Effort estimé :** ~2h  
**Pourquoi c'est bloquant :** Le fichier `lib/missions.ts` contient les données statiques des missions. Le schéma Prisma a bien un modèle `Mission`. Mais le step de seed a été retiré du `deploy.yml`. Résultat probable : la base de données de production ne contient **aucune mission**. Toute l'UI qui lit les missions depuis la DB est donc vide ou en erreur.

---

## Contexte

- **Source statique :** `lib/missions.ts` — exporte un tableau `MISSIONS` avec toutes les missions définies
- **Modèle DB :** `prisma/schema.prisma` — modèle `Mission` avec tous les champs correspondants
- **Seed file :** `prisma/seed.ts` (ou `.js`) — à vérifier s'il existe, à créer ou compléter sinon
- **Script manquant dans deploy.yml :** le `prisma db seed` a été retiré pour éviter les doublons, mais sans seed initial les missions n'existent pas

---

## Ce qu'il faut faire

### Étape 1 — Vérifier / créer `prisma/seed.ts`

Ouvrir `prisma/seed.ts`. S'il n'existe pas, le créer.

Le seed doit :
1. Importer `MISSIONS` depuis `lib/missions.ts`
2. Pour chaque mission, faire un `upsert` (créer si absent, mettre à jour si présent) basé sur le champ `slug` (unique)
3. Ne jamais faire de `deleteMany` en début de seed — dangereux en production

```ts
// prisma/seed.ts
import { PrismaClient } from "../generated/prisma"
import { MISSIONS } from "../lib/missions"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding missions...")

  for (const mission of MISSIONS) {
    // Mapper les champs de lib/missions.ts vers le modèle Prisma Mission
    await prisma.mission.upsert({
      where: { slug: mission.id }, // mission.id dans lib/missions.ts = slug dans la DB
      update: {
        title: mission.title,
        shortDesc: mission.shortDesc ?? "",
        description: mission.description ?? "",
        category: mission.type,             // "CODE" | "DESIGN" | "BUSINESS" etc.
        difficulty: mission.level ?? 1,
        xp: mission.xp,
        missionLevel: mission.progressionLevel ?? "INIT", // "INIT" | "CORE" | "PRO"
        targetProfiles: mission.targetProfiles ?? [],
        requirements: mission.requirements ?? [],
        deliverables: mission.deliverables ?? [],
        fullBriefing: mission.fullBriefing ?? "",
        submissionMethod: mission.submissionMethod ?? "ANY_LINK",
        weightBuilder: mission.weightBuilder ?? 0.25,
        weightCreator: mission.weightCreator ?? 0.25,
        weightStrategist: mission.weightStrategist ?? 0.25,
        weightCatalyst: mission.weightCatalyst ?? 0.25,
      },
      create: {
        slug: mission.id,
        title: mission.title,
        shortDesc: mission.shortDesc ?? "",
        description: mission.description ?? "",
        category: mission.type,
        difficulty: mission.level ?? 1,
        xp: mission.xp,
        missionLevel: mission.progressionLevel ?? "INIT",
        targetProfiles: mission.targetProfiles ?? [],
        requirements: mission.requirements ?? [],
        deliverables: mission.deliverables ?? [],
        fullBriefing: mission.fullBriefing ?? "",
        submissionMethod: mission.submissionMethod ?? "ANY_LINK",
        weightBuilder: mission.weightBuilder ?? 0.25,
        weightCreator: mission.weightCreator ?? 0.25,
        weightStrategist: mission.weightStrategist ?? 0.25,
        weightCatalyst: mission.weightCatalyst ?? 0.25,
      },
    })
    console.log(`  ✓ ${mission.id}`)
  }

  console.log(`Seed terminé — ${MISSIONS.length} missions traitées.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
```

### Étape 2 — Vérifier `package.json`

S'assurer que le script seed est bien configuré :

```json
// package.json — dans la section "scripts"
"db:seed": "tsx prisma/seed.ts"

// ET dans la section "prisma" (requis par Prisma)
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Si `tsx` n'est pas installé :
```bash
pnpm add -D tsx
```

### Étape 3 — Lancer le seed manuellement une fois

```bash
pnpm prisma db seed
```

Vérifier dans Prisma Studio que les missions apparaissent :
```bash
npx prisma studio
```

### Étape 4 — Ajouter le seed dans `deploy.yml` de manière sécurisée

Dans `.github/workflows/deploy.yml`, après `prisma db push`, ajouter :

```yaml
# Seed initial des missions (idempotent — upsert safe)
docker compose exec -T web npx prisma db seed
```

Ceci est **safe** car le seed utilise des `upsert` — pas de doublons possibles.

---

## Vérification finale

Après implémentation, tester :
1. `pnpm prisma db seed` tourne sans erreur
2. `GET /api/missions` retourne des données
3. La page `/missions` affiche les missions
4. Relancer le seed une 2e fois → pas de doublons, pas d'erreur

---

## Fichiers touchés
- `prisma/seed.ts` — créer ou réécrire
- `package.json` — ajouter section `"prisma"` si absente
- `.github/workflows/deploy.yml` — ré-ajouter le seed step

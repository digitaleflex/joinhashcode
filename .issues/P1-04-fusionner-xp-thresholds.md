---
title: "[P1] Fusionner XP_THRESHOLDS et LEVEL_THRESHOLDS"
labels: ["priority: P1", "type: refactor", "area: gamification"]
assignees: []
---

## Problème

Les mêmes valeurs `[0, 100, 400, 1400]` sont définies à **2 endroits** :

- `lib/missions.ts` → `XP_THRESHOLDS = {1: 0, 2: 100, 3: 400, 4: 1400}`
- `lib/level-utils.ts` → `LEVEL_THRESHOLDS = [0, 100, 400, 1400]`

## Action

- [ ] Déplacer la définition dans un fichier unique (ex: `lib/level-utils.ts`)
- [ ] Importer depuis ce fichier dans `lib/missions.ts`
- [ ] Supprimer la définition dupliquée
- [ ] Vérifier qu'aucun autre fichier n'a de définition similaire

---
title: "[P1] Migrer les missions statiques (841 lignes) vers la DB avec seed"
labels: ["priority: P1", "type: refactor", "area: missions"]
assignees: []
---

## Problème

`lib/missions.ts` fait **841 lignes** avec 15 missions hardcodées en TypeScript, incluant des `fullBriefing` en HTML string. Parallèlement, une table `Mission` existe en base mais n'est pas la source de vérité.

## Impact

- 2 sources de vérité qui se désynchronisent
- Impossible de modifier les missions sans redéployer
- Les briefings en string sont impossibles à éditer proprement
- 841 lignes pour ce qui devrait être des données, pas du code

## Action

- [ ] Créer un script `prisma/seed.ts` avec 5 missions pour le MVP (pas 15)
- [ ] Supprimer les missions hardcodées de `lib/missions.ts` (garder seulement les types + helpers)
- [ ] Modifier les routes API pour lire les missions depuis la DB
- [ ] Adapter `getCurrentWeeklyChallenge()` si gardé (via DB)
- [ ] Exécuter `npx prisma db seed`

## Critères de succès

- `lib/missions.ts` passe sous 100 lignes
- Les missions sont chargées depuis la DB
- `prisma/seed.ts` existe et fonctionne

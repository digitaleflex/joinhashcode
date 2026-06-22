---
title: "[P2] Supprimer les abstractions triviales (after.ts, cache.ts)"
labels: ["priority: P2", "type: cleanup", "area: tech-debt"]
assignees: []
---

## Problème

- `lib/after.ts` (23 lignes) : wrapper trivial autour de `next/server` `after()`. Le comportement test peut être géré ailleurs.
- `lib/cache.ts` (19 lignes) : get/set Redis basique. Les 2 appels peuvent importer `redis` directement.

Ces abstractions ajoutent une couche mentale sans valeur réelle.

## Action

- [ ] Remplacer chaque `safeAfter(...)` par `after(...)` directement (importer depuis `next/server`)
- [ ] Déplacer la logique test dans un helper de test dédié si nécessaire
- [ ] Remplacer `getCache`/`setCache` par des appels directs à `redis.get`/`redis.set`
- [ ] Supprimer `lib/after.ts` et `lib/cache.ts`
- [ ] Mettre à jour tous les imports

## Critères de succès

- Les fichiers `after.ts` et `cache.ts` n'existent plus
- Tous les imports sont mis à jour
- Les tests passent

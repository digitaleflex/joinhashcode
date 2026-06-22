---
title: "[P0] Supprimer les feature flags morts du code (guilds, badges, weekly challenges, retrospectives)"
labels: ["priority: P0", "type: cleanup", "area: tech-debt"]
assignees: []
---

## Problème

6 feature flags sur 7 sont **OFF par défaut** (`guilds`, `squads`, `streaks`, `weeklyChallenges`, `badges`, `retrospectives`). Pourtant :

- Le code de routage, les composants UI, les imports référencent ces features partout
- Personne ne sait si ce code fonctionne encore
- Il masque la vraie complexité du projet

## Impact

- Dead code toxique qui s'accumule
- Taille du bundle artificiellement gonflée
- Confusion pour les nouveaux développeurs
- Maintenance fantôme (mettre à jour du code qui ne sert à rien)

## Action

- [ ] **Supprimer** tout le code lié aux features OFF, pas seulement le cacher
- [ ] Supprimer le fichier `lib/features.ts`
- [ ] Supprimer tous les `isFeatureEnabled(...)` et leurs branches mortes
- [ ] Supprimer les composants, routes, models associés :
  - Guilds → toute la logique `Guild`, `GuildMember`
  - Badges → `badge-engine.ts`
  - Weekly challenges → `getCurrentWeeklyChallenge()` et dérivés
  - Retrospectives → route, composants
- [ ] Nettoyer les dépendances de package.json devenues inutiles

## Critères de succès

- `lib/features.ts` supprimé
- Aucune occurrence de `isFeatureEnabled` dans le code
- Les composants morts ne sont plus importés nulle part
- Le build passe sans warning

---
title: "[P1] Réduire User model (fusionner les petits models dans User)"
labels: ["priority: P1", "type: refactor", "area: database"]
assignees: []
---

## Problème

Le modèle `User` a 55+ champs. En plus, 5 petits models satellites (`UserSecurity`, `UserReferral`, `EngagementStats`, `UserProgress`, `UserSocials`) pourraient être fusionnés directement dans `User`.

## Impact

- Fragilité : 55 champs à gérer dans un seul `findUnique`
- Requêtes moins performantes (SELECT \* ramène tout)
- Complexité inutile : 5 models pour 15 champs au total

## Action

- [ ] Fusionner dans `User` :
  - `UserSecurity` → `banned`, `twoFactorEnabled`
  - `UserReferral` → `referralCode`, `referredBy`
  - `EngagementStats` → `streak`, `lastCheckinAt`, `totalCheckins`
  - `UserProgress` → `level`, `experience`, `missionsCompleted`
  - `UserSocials` → `github`, `linkedin`, `twitter`, `website` (nullable)
- [ ] Supprimer les 5 models du schéma Prisma
- [ ] Mettre à jour les imports et requêtes
- [ ] Créer une migration Prisma (`npx prisma migrate dev --name merge-user-models`)

## Critères de succès

- User a 40-45 champs (au lieu de 55+)
- 5 models supprimés du schéma
- Tous les tests passent

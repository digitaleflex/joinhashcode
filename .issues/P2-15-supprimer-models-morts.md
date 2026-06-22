---
title: "[P2] Supprimer les modèles Prisma morts"
labels: ["priority: P2", "type: cleanup", "area: database"]
assignees: []
---

## Problème

Plusieurs modèles Prisma ne sont plus utilisés ou ont été remplacés :

- `SquadMessage` — chat squad prématuré
- `JoinRequest` — squads privés, V2+
- `XpTransaction` — redondant avec `UserProgress.experience` + `ActivityLog`
- `TwoFactor` — 2FA pas avant V2/V3
- `Guild`, `GuildMember` — feature flag OFF depuis toujours
- `TeamApplication` — dead code, jamais utilisé
- `Psychometric` — fusionné dans User (issue P1-10)

## Action

- [ ] Supprimer tous ces models du `prisma/schema.prisma`
- [ ] Supprimer les types TS associés
- [ ] Créer une migration Prisma (`npx prisma migrate dev --name remove-dead-models`)
- [ ] Vérifier qu'aucun import ne référence ces models

## Critères de succès

- 7 models supprimés du schéma
- Aucune référence dans le code TypeScript
- Migration Prisma créée

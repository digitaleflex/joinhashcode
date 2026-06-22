---
title: "[P1] Simplifier le système Squad (5 routes, 2 models)"
labels: ["priority: P1", "type: refactor", "area: squad"]
assignees: []
---

## Problème

Le système Squad a **16 routes API** et une complexité disproportionnée par rapport à son usage réel (feature flag OFF, quelques utilisateurs).

## Action

- [ ] Réduire les routes Squad à 5 :
  - `POST /api/squad/create`
  - `POST /api/squad/join`
  - `POST /api/squad/invite`
  - `GET /api/squad/members`
  - `GET /api/squad/public`
- [ ] Geler/supprimer toutes les autres routes Squad (les fichiers peuvent rester mais ne pas être importés)
- [ ] Réduire le modèle Squad à :
  ```prisma
  model Squad {
    id          String @id @default(cuid())
    name        String
    description String?
    ownerId     String
    owner       User   @relation(fields: [ownerId], references: [id])
    members     SquadMember[]
    createdAt   DateTime @default(now())
  }
  ```
- [ ] Supprimer les modèles inutiles : `SquadMessage`, `JoinRequest`, champs superflus sur `Organization`

## Critères de succès

- Seulement 5 routes Squad exposées
- Le modèle Squad tient en 10 lignes de Prisma
- Aucune référence à `SquadMessage`, `JoinRequest` dans le code actif

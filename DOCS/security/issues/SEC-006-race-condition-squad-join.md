# SEC-006 — Race condition join squad (TOCTOU)

- **Gravité** : 🟠 Élevée · **Priorité** : P1 · **Statut** : 🔴 OPEN
- **Catégorie** : Logique métier / concurrence
- **Fichier** : `app/api/squad/join/route.ts:57-80`

## Description

Les vérifications « squad pleine (≤5) » et « déjà membre » puis le `member.create` ne sont **pas atomiques**. Des requêtes concurrentes passent toutes les vérifications avant qu'aucune n'écrive.

```ts
if (squad.members.length >= 5) { /* refus */ }     // check
const existingMember = await prisma.member.findFirst({ where: { userId } }); // check
if (existingMember) { /* refus */ }
await prisma.member.create({ /* ... */ });          // act — fenêtre de course
```

## Impact

- Dépassement de la limite de 5 membres par squad.
- Appartenance à plusieurs squads simultanément (contourne `organizationLimit: 1`).
- Amplifie le farming `squad-genesis` (voir SEC-002).

## Correctif recommandé

1. **Contrainte unique** sur `member.userId` au niveau schéma (un utilisateur = au plus une squad) :

```prisma
model Member {
  // ...
  userId String @unique
}
```

2. Effectuer le contrôle de capacité **et** l'insertion dans une transaction sérialisée, et compter à l'intérieur :

```ts
await prisma.$transaction(async (tx) => {
  const count = await tx.member.count({ where: { organizationId: squad.id } });
  if (count >= 5) throw new Error("FULL");
  await tx.member.create({ data: { id: crypto.randomUUID(), userId, organizationId: squad.id, role: "member", createdAt: new Date() } });
}, { isolationLevel: "Serializable" });
```

Gérer l'erreur d'unicité `P2002` (déjà membre) proprement.

> ⚠️ Changement de schéma → suivre la règle CLAUDE.md : `npx prisma migrate dev --name member_user_unique` puis `npx prisma db push`. Vérifier au préalable l'absence de doublons existants en base avant d'ajouter la contrainte.

## Critères d'acceptation

- [ ] Contrainte unique `userId` sur `Member` (après nettoyage des doublons).
- [ ] Capacité contrôlée dans la transaction.
- [ ] Test de concurrence : 10 joins simultanés sur une squad à 4 membres → au plus 1 réussit.

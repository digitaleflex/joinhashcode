# SEC-002 — Farming XP via join/leave de squad

- **Gravité** : 🔴 Critique · **Priorité** : P0 · **Statut** : 🔴 OPEN
- **Catégorie** : Logique métier (OWASP A04 Insecure Design)
- **Fichiers** : `app/api/squad/join/route.ts:92-116`, `app/api/squad/create/route.ts:113-138`

## Description

La mission `squad-genesis` est upsertée avec `update: { status: "APPROVED" }`, **puis** `experience` est incrémenté de `mission.xp` **sans vérifier si la récompense a déjà été versée** :

```ts
await prisma.missionSubmission.upsert({
  where: { userId_missionId_cycleKey: { userId, missionId, cycleKey: "PERMANENT" } },
  update: { status: "APPROVED" },
  create: { /* ... */ status: "APPROVED", xpAwarded: mission.xp },
}).catch(() => {});

await prisma.user.update({                      // ⚠️ versé à CHAQUE join, même répété
  where: { id: userId },
  data: { experience: { increment: mission.xp } },
}).catch(() => {});
```

## Impact

XP illimitée par boucle **rejoindre → quitter → rejoindre**. Même schéma à la création de squad. Corruption de l'économie de jeu.

## Scénario d'exploitation

1. Rejoindre une squad publique → +`xp`.
2. Quitter la squad (`/api/squad/leave`).
3. Rejoindre à nouveau → +`xp` re-versé. Boucle.

## Correctif recommandé

Ne créditer l'XP que si la soumission **n'existait pas encore** (transition réelle `→ APPROVED`). Tout passer dans une transaction et lire le résultat de l'upsert :

```ts
await prisma.$transaction(async (tx) => {
  const existing = await tx.missionSubmission.findUnique({
    where: { userId_missionId_cycleKey: { userId, missionId: squadGenesisMission.id, cycleKey: "PERMANENT" } },
    select: { status: true },
  });

  // Ne créditer qu'une seule fois, jamais si déjà APPROVED auparavant
  const alreadyAwarded = existing?.status === "APPROVED";

  await tx.missionSubmission.upsert({
    where: { userId_missionId_cycleKey: { userId, missionId: squadGenesisMission.id, cycleKey: "PERMANENT" } },
    update: { status: "APPROVED" },
    create: { userId, missionId: squadGenesisMission.id, cycleKey: "PERMANENT", status: "APPROVED", content: "...", xpAwarded: squadGenesisMission.xp },
  });

  if (!alreadyAwarded) {
    await tx.user.update({
      where: { id: userId },
      data: { experience: { increment: squadGenesisMission.xp } },
    });
  }
});
```

Appliquer le même correctif dans `squad/create/route.ts`.

## Critères d'acceptation

- [ ] Quitter puis rejoindre une squad ne re-crédite jamais l'XP `squad-genesis`.
- [ ] Le crédit a lieu exactement une fois par utilisateur (1re fois).
- [ ] Idem pour la création de squad.
- [ ] Test de régression boucle join/leave.

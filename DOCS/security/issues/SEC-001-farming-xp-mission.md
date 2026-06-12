# SEC-001 — Farming XP via re-soumission de mission

- **Gravité** : 🔴 Critique · **Priorité** : P0 · **Statut** : 🔴 OPEN
- **Catégorie** : Logique métier (OWASP A04 Insecure Design)
- **Fichier** : `app/api/missions/route.ts:148-153`

## Description

À chaque `upsert` d'une soumission de mission (y compris re-soumission d'une mission en `NEEDS_REVISION`), l'utilisateur reçoit `SYNC_BONUS_XP` (+5/+6) **inconditionnellement** :

```ts
await tx.user.update({
  where: { id: session.user.id },
  data: {
    experience: { increment: SYNC_BONUS_XP + xpToAward }, // ⚠️ versé à chaque appel
    ...
  }
});
```

## Impact

XP illimitée → niveaux falsifiés → déblocage de missions/squads de haut niveau → corruption de l'économie de jeu et des classements. Exploitable par tout utilisateur authentifié, sans outil particulier.

## Scénario d'exploitation

1. Soumettre une mission INIT → +5 XP (bonus de sync).
2. La soumission passe `PENDING` ; après revue `NEEDS_REVISION`, re-soumettre.
3. Chaque re-soumission verse à nouveau le bonus. Répéter sur N missions / N révisions.

## Correctif recommandé

Ne verser le `SYNC_BONUS_XP` que lors de la **création** de la soumission, pas sur l'`update`. Découpler le bonus de l'upsert :

```ts
const existed = !!existingSubmission;

const result = await prisma.$transaction(async (tx) => {
  const submission = await tx.missionSubmission.upsert({ /* ... */ });

  // Bonus de sync : uniquement à la 1re soumission de ce cycle
  const bonusToGrant = existed ? 0 : SYNC_BONUS_XP;

  await tx.user.update({
    where: { id: session.user.id },
    data: {
      experience: { increment: bonusToGrant + xpToAward },
      missionsCompletedCount: isAutoApproved ? { increment: 1 } : undefined,
    },
  });
  return submission;
});
```

> Note : `existingSubmission` est déjà chargé en amont (ligne 86). Réutiliser ce booléen évite une requête supplémentaire.

## Critères d'acceptation

- [ ] Re-soumettre la même mission (même `cycleKey`) ne crédite **aucun** XP de bonus supplémentaire.
- [ ] La 1re soumission d'un nouveau cycle crédite le bonus une seule fois.
- [ ] Test de régression sur le flux `NEEDS_REVISION → re-submit`.
- [ ] `npm run test` + `npm run build` verts.

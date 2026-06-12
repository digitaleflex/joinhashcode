# SEC-007 — Boucles O(n) globales non batchées

- **Gravité** : 🟠 Élevée · **Priorité** : P1 · **Statut** : 🔴 OPEN
- **Catégorie** : Disponibilité (OWASP API4)
- **Fichiers** : `app/api/admin/notifications/broadcast/route.ts`, `app/api/internal/cron/check-activity/route.ts`, `app/api/internal/cron/squad-decay/route.ts`

## Description

Plusieurs opérations chargent **toute la base** et bouclent sans pagination ni traitement par lots :

- `check-activity` : `findMany` de tous les inactifs + boucle **séquentielle** `await triggerNotification` → rafale QStash, timeout probable à l'échelle.
- `squad-decay` : boucle `update` une-par-une dans **une seule transaction** → transaction longue, verrous.
- `broadcast` : `findMany` de tous les users (OK pour `createMany`, mais à surveiller mémoire).

## Impact

À plusieurs milliers d'utilisateurs : timeouts cron, épuisement mémoire/connexions DB, dégradation de service.

## Correctif recommandé

1. **Pagination par curseur** (lots de 500-1000) au lieu de tout charger.
2. Remplacer les `update` en boucle par des `updateMany` quand possible :

```ts
// squad-decay : remplacer la boucle par 2 updateMany
await prisma.organization.updateMany({
  data: { cohesionScore: { decrement: 0.1 } },
});
await prisma.organization.updateMany({
  where: { cohesionScore: { lt: 0.9 } },
  data: { streakCount: 0 },
});
// (clamp min 0 via une 2e passe ou contrainte applicative)
```

3. `check-activity` : traiter par lots et envoyer les notifications en file (QStash batch) plutôt qu'en boucle bloquante.

## Critères d'acceptation

- [ ] Aucune route ne charge l'intégralité d'une table sans pagination.
- [ ] `squad-decay` utilise `updateMany` (pas de boucle par squad).
- [ ] `check-activity` traite par lots avec curseur.
- [ ] Test de charge simulé (≥ 10k users) sans timeout.

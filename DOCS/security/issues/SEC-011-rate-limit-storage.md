# SEC-011 — Rate-limit en mémoire (non partagé)

- **Gravité** : 🟡 Moyenne · **Priorité** : P2 · **Statut** : 🔴 OPEN
- **Catégorie** : Authentication Failures (OWASP A07) / Disponibilité
- **Fichiers** : `lib/auth.ts:155-169` (Better Auth), `app/api/contact/route.ts:18-33`

## Description

- Le rate-limit Better Auth n'a **pas de `storage` configuré** → stockage mémoire par défaut, non partagé entre réplicas et perdu au redémarrage.
- `contact` utilise une `Map` en mémoire **sans purge** (fuite mémoire lente) et non partagée.

## Impact

En multi-réplicas / redémarrages fréquents (Docker), la limite réelle est multipliée par le nombre d'instances → brute-force et spam moins contraints qu'attendu.

## Correctif recommandé

1. Configurer le **storage Redis** de Better Auth (réutiliser Upstash) :

```ts
rateLimit: {
  enabled: true,
  storage: "secondary-storage", // + fournir secondaryStorage (Redis) à betterAuth
  window: 60,
  max: 50,
  customRules: { /* ... */ },
},
```

2. `contact` : utiliser le limiteur Upstash partagé (cf. SEC-005) au lieu de la `Map`. Si la `Map` est conservée temporairement, ajouter une purge des entrées expirées.

## Critères d'acceptation

- [ ] Rate-limit Better Auth adossé à Redis (compteurs partagés).
- [ ] `contact` n'utilise plus de `Map` non bornée.
- [ ] Compteurs cohérents entre plusieurs instances.

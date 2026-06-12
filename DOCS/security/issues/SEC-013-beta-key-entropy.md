# SEC-013 — Clés bêta 32 bits + énumérables

- **Gravité** : 🟡 Moyenne · **Priorité** : P2 · **Statut** : 🔴 OPEN
- **Catégorie** : API Security / Cryptographic Failures
- **Fichiers** : `app/api/admin/keys/route.ts:56`, `app/api/auth/beta-verify/route.ts`

## Description

- Les clés bêta utilisent `randomBytes(4)` = **32 bits seulement** d'entropie.
- `beta-verify` n'a **aucun rate-limit** et distingue les réponses (`invalide` / `déjà utilisée` / `expirée`) → énumération facilitée.

## Impact

Combinés, ces deux points rendent le brute-force/énumération des clés réaliste → activation non autorisée d'accès bêta + déclenchement de récompenses de parrainage.

## Correctif recommandé

1. Augmenter l'entropie : `randomBytes(16)` (128 bits).
2. Ajouter un rate-limit sur `beta-verify` (cf. SEC-005), par userId et par IP fiable.
3. Uniformiser/temporiser les réponses d'erreur pour limiter l'oracle d'énumération.

```ts
key: `${prefix}${randomBytes(16).toString("hex").toUpperCase()}`,
```

## Critères d'acceptation

- [ ] Clés ≥ 128 bits d'entropie.
- [ ] `beta-verify` rate-limité.
- [ ] Réponses d'erreur ne facilitant pas l'énumération.

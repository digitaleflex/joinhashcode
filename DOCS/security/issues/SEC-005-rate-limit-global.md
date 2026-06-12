# SEC-005 — Pas de rate-limit généralisé / fail-open

- **Gravité** : 🟠 Élevée · **Priorité** : P1 · **Statut** : 🔴 OPEN
- **Catégorie** : API Security (OWASP API4 Unrestricted Resource Consumption)
- **Fichiers** : `lib/ratelimit.ts:7-16`, routes mutantes sans limiteur

## Description

Seules les routes Better Auth + 3 endpoints (`checkin`, `claim`, `squad/join`) ont un limiteur Upstash. Ce limiteur est **`null` si Redis non configuré**, et `checkRateLimit` retourne alors `{ limited: false }` → **fail-open silencieux** :

```ts
const configured = !!restUrl && !!restToken
function makeRatelimit(...) { if (!configured) return null /* ... */ }

export async function checkRateLimit(limiter, id) {
  if (!limiter) return { limited: false }   // ⚠️ aucune limite si non configuré
  ...
}
```

Routes sans aucune protection : `missions/` (POST), `quiz` (action), `feedback/`, `ux-poll/`, `squad/create`, `squad/leave`, `squad/transfer`, etc.

## Impact

Spam, abus, énumération, amplification du farming XP (SEC-001/002), pression DB. À l'échelle de milliers d'utilisateurs : dégradation de service.

## Correctif recommandé

1. Rendre Redis **obligatoire en production** (l'absence doit être une erreur de démarrage, pas un fail-open).
2. Ajouter un limiteur par défaut à **toutes les routes mutantes** (POST/PATCH/DELETE), clé = userId (ou IP fiable pour routes publiques).
3. Optionnel : middleware/wrapper commun `withRateLimit(handler, limiter)` pour ne pas répéter le code.

```ts
// lib/ratelimit.ts — échouer fermé en prod si non configuré
if (!configured && process.env.NODE_ENV === "production") {
  throw new Error("Rate limiting backend (Upstash Redis) requis en production");
}

export const defaultMutationLimiter = makeRatelimit(30, "1 m");
```

## Critères d'acceptation

- [ ] Démarrage prod sans Redis = échec explicite (pas de fail-open).
- [ ] Chaque route POST/PATCH/DELETE applique un limiteur.
- [ ] Dépassement → 429 avec en-tête `Retry-After`.
- [ ] Test : rafale > seuil sur `missions` POST = bloquée.

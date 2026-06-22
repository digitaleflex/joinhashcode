---
title: "[P0] Remplacer Upstash/Redis par un MemoryLimiter in-process"
labels: ["priority: P0", "type: refactor", "area: infrastructure"]
assignees: []
---

## Problème

Le rate limiting actuel utilise `@upstash/ratelimit` + Redis. C'est **fail-closed** : si Redis est inaccessible, l'app est morte.

## Impact

- Dépendance externe critique pour une fonctionnalité non-critique
- Impossible d'utiliser le rate limiting sans Redis (dev, CI, preview deployments)
- Surcoût de maintenance (Redis = un service à opérer)

## Action

- [ ] Créer une **interface `RateLimiter`** commune :

```typescript
interface RateLimiter {
  check(
    key: string,
    limit: number,
    window: number,
  ): Promise<{ success: boolean; remaining: number }>;
}
```

- [ ] Implémenter **`MemoryLimiter`** (token bucket in-process, Map avec TTL)
- [ ] Conserver `RedisLimiter` existant mais le mettre en veille (non importé tant que non nécessaire)
- [ ] Garantir que le défaut est **fail-open** : si le limiter plante, on laisse passer la requête
- [ ] Supprimer `@upstash/ratelimit` des dépendances immédiates (le garder commenté ou en dev)

## Critères de succès

- `npm run dev` fonctionne sans Redis
- Le rate limiting est actif en mémoire
- Si le limiter jette une erreur, la requête passe (pas de blocage)

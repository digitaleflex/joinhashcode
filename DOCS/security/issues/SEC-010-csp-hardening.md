# SEC-010 — CSP `unsafe-inline` / `unsafe-eval`

- **Gravité** : 🟡 Moyenne · **Priorité** : P2 · **Statut** : 🔴 OPEN
- **Catégorie** : Security Misconfiguration (OWASP A05)
- **Fichier** : `next.config.mjs:37`

## Description

La directive `script-src` contient à la fois `'unsafe-inline'` et `'unsafe-eval'`, ce qui annule l'essentiel de la protection anti-XSS apportée par la CSP.

```
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com ...
```

## Impact

En cas de XSS (injection de script), la CSP ne bloque pas l'exécution. Réduit fortement la défense en profondeur.

## Correctif recommandé

1. Migrer vers une CSP basée sur **nonce** (généré par requête, injecté dans le middleware) ou **hash** des scripts inline.
2. Supprimer `'unsafe-eval'` (rarement nécessaire ; vérifier les libs qui l'exigent).
3. `style-src` : viser à retirer `'unsafe-inline'` à terme (Tailwind v4 le permet en grande partie).

```ts
// Exemple : nonce par requête posé dans le proxy/middleware
const nonce = crypto.randomUUID();
// script-src 'self' 'nonce-<nonce>' ...
```

> Note : migration potentiellement intrusive (Next.js inline certains scripts). À tester sur preview avant prod.

## Critères d'acceptation

- [ ] `'unsafe-eval'` retiré de `script-src`.
- [ ] `'unsafe-inline'` remplacé par nonce/hash sur `script-src`.
- [ ] Aucune régression fonctionnelle (analytics, toploader, etc.).
- [ ] Rapport CSP testé via en-tête `Content-Security-Policy-Report-Only` d'abord.

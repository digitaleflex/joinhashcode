# SEC-019 — `ignoreBuildErrors: true`

- **Gravité** : 🔵 Faible · **Priorité** : P3 · **Statut** : 🔴 OPEN
- **Catégorie** : Insecure Design (OWASP A04)
- **Fichier** : `next.config.mjs:4-6`

## Description

```ts
typescript: { ignoreBuildErrors: true },
```

Les erreurs TypeScript sont ignorées au build, ce qui peut masquer des bugs (y compris de sécurité : mauvais typage d'inputs, null-safety, contrôles d'accès contournés par un type incorrect).

## Impact

Régressions silencieuses, bugs de logique non détectés en CI/CD.

## Correctif recommandé

1. Corriger les erreurs TS existantes progressivement.
2. Repasser `ignoreBuildErrors: false` (au moins en CI).
3. Ajouter `tsc --noEmit` à la pipeline.

## Critères d'acceptation

- [ ] Build sans `ignoreBuildErrors` passe.
- [ ] `tsc --noEmit` en CI.

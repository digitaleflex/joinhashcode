---
title: "[P1] Supprimer les Passkeys (WebAuthn)"
labels: ["priority: P1", "type: cleanup", "area: auth"]
assignees: []
---

## Problème

Le plugin `@better-auth/passkey` est installé, le composant `PasskeySetup` existe dans les paramètres, mais :

- 0 utilisateur utilise cette fonctionnalité
- La majorité des utilisateurs ne comprend pas ce que c'est
- Google OAuth + Magic Link + OTP est largement suffisant pour le MVP

## Action

- [ ] Supprimer le plugin passkey de `lib/auth.ts`
- [ ] Supprimer `@better-auth/passkey` de `package.json`
- [ ] Supprimer le composant `PasskeySetup.tsx`
- [ ] Supprimer l'onglet/la section passkey dans les paramètres
- [ ] Supprimer le model `Passkey` du schéma Prisma

## Critères de succès

- Aucune référence à `passkey` dans le code
- `@better-auth/passkey` retiré des dépendances
- Le model `Passkey` supprimé de Prisma

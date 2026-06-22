---
title: "[P1] Supprimer GitHub OAuth"
labels: ["priority: P1", "type: cleanup", "area: auth"]
assignees: []
---

## Problème

GitHub OAuth est configuré dans Better Auth mais :

- Moins de 5 % des inscriptions l'utilisent (estimation)
- La communauté n'est pas encore orientée open source
- Aucune feature liée à GitHub (portfolio, contributions, repos, badges)

Chaque provider OAuth ajoute du code, des tests, des cas d'erreur et de la maintenance.

## Action

- [ ] Supprimer le provider GitHub de `lib/auth.ts`
- [ ] Supprimer les variables d'environnement associées (`.env`)
- [ ] Supprimer le bouton GitHub de `components/auth/signin-form.tsx`
- [ ] Mettre à jour les tests si nécessaire

## Critères de succès

- Aucune référence à `github` dans la config auth
- Le formulaire de connexion n'affiche plus le bouton GitHub
- `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` ne sont plus requis

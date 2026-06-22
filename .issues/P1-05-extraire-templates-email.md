---
title: "[P1] Extraire les templates email de email.ts (828 lignes)"
labels: ["priority: P1", "type: refactor", "area: email"]
assignees: []
---

## Problème

`lib/email.ts` fait **828 lignes** avec 20+ templates HTML en template strings. C'est :

- Impossible à tester (pas de type-check sur les variables interpolées)
- Impossible à maintenir (toucher à un template = risquer de casser les autres)
- Impossible à traduire
- Un enfer de relecture

## Action

- [ ] Créer un dossier `lib/emails/`
- [ ] Extraire chaque template dans son propre fichier `.tsx` ou `.mjml`
- [ ] Utiliser une approche de composants React pour les emails (compatible Resend)
- [ ] Réduire à 5-6 templates maks pour le MVP :
  1. `magic-link`
  2. `welcome`
  3. `quiz-results`
  4. `notification`
  5. `contact-confirmation`
- [ ] Supprimer les templates non utilisés

## Critères de succès

- `email.ts` passe sous 200 lignes
- Chaque template est dans un fichier dédié
- Les templates sont type-safe (props typées)

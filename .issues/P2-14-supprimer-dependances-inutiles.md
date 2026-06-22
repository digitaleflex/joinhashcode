---
title: "[P2] Supprimer les dépendances inutiles (react-use, fingerprintjs)"
labels: ["priority: P2", "type: cleanup", "area: dependencies"]
assignees: []
---

## Problème

- **`react-use`** (17.6.1) : grosse lib de hooks. Next.js 16 + React 19 couvre la plupart des cas nativement.
- **`@fingerprintjs/fingerprintjs`** : browser fingerprinting. Aucun signe d'utilisation pour anti-fraude ou sécurité.

Ces dépendances ajoutent du poids au bundle sans bénéfice démontré.

## Action

- [ ] Vérifier si `react-use` est utilisé quelque part (via grep) :
  - Si oui, remplacer les hooks spécifiques par des alternatives natives ou légères
  - Si non, supprimer directement
- [ ] Vérifier si `@fingerprintjs/fingerprintjs` est utilisé :
  - Si oui, évaluer si la feature est critique
  - Si non, supprimer directement
- [ ] Supprimer les packages de `package.json`
- [ ] Exécuter `pnpm install` pour nettoyer

## Critères de succès

- `react-use` retiré de package.json
- `@fingerprintjs/fingerprintjs` retiré de package.json
- `pnpm audit` sans warning
- Le build passe

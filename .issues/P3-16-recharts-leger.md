---
title: "[P3] Remplacer recharts par une solution plus légère"
labels: ["priority: P3", "type: optimization", "area: ui"]
assignees: []
---

## Problème

`recharts` (2.15.0) est une lib lourde utilisée pour quelques graphiques simples (radar chart du quiz, croissance XP). Le ratio « poids de la lib / surface d'utilisation » est défavorable.

## Action

- [ ] Évaluer les alternatives : Chart.js (plus léger), SVG pur, ou `lucide-react` pour des indicateurs visuels simples
- [ ] Remplacer les graphiques recharts par l'alternative choisie
- [ ] Supprimer `recharts` de `package.json`

## Critères de succès

- `recharts` retiré de package.json
- Les graphiques existants sont remplacés sans perte fonctionnelle
- Réduction mesurable du bundle JS

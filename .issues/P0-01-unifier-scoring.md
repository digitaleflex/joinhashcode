---
title: "[P0] Unifier les 3 systèmes de scoring en 1 pipeline"
labels: ["priority: P0", "type: refactor", "area: scoring"]
assignees: []
---

## Problème

Il existe **3 systèmes qui font la même chose** (classer un utilisateur sur 4 axes : builder/creator/strategist/catalyst) avec des noms et des mécanismes différents :

1. **`analysis.ts`** — calcule le profil à partir des réponses du quiz
2. **Model `Psychometric`** — stocke `builderScore`, `creatorScore`, etc. en base
3. **`behavioralVibrancy` (JSON sur User)** + **`BehaviouralVitality`** (`evolution.ts`, `evolution-engine.ts`, `evolution-utils.ts`) — système d'évolution comportementale

## Impact

- Toute modification du scoring doit être répercutée à 3 endroits
- Risque de désynchronisation élevé
- Tests insuffisants — impossible de savoir quel système fait autorité
- Confusion pour les nouveaux développeurs

## Action

- [ ] Définir un seul pipeline de scoring dans `lib/analysis.ts`
- [ ] Supprimer le model `Psychometric` (fusionner ses champs dans `User` ou les calculer à la volée depuis `QuizResult`)
- [ ] Supprimer `evolution.ts`, `evolution-engine.ts`, `evolution-utils.ts` ou les fusionner dans le pipeline unique
- [ ] Écrire des tests Vitest qui valident le scoring (input → output attendu)
- [ ] Vérifier que tous les appels aux 3 anciens systèmes pointent vers le nouveau pipeline

## Critères de succès

- Un seul fichier `lib/analysis.ts` fait autorité pour le scoring
- Tous les tests passent avec les mêmes inputs/outputs qu'avant
- Plus aucune référence à `evolution-engine`, `Psychometric` model, `behavioralVibrancy`

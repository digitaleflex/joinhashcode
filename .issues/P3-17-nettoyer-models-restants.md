---
title: "[P3] Nettoyer les modèles restants (UserBeta, BetaKey, BetaFeedback)"
labels: ["priority: P3", "type: cleanup", "area: database"]
assignees: []
---

## Problème

Les modèles `UserBeta`, `BetaKey`, `BetaFeedback` ne sont plus utiles une fois la beta fermée. Ils ajoutent du bruit au schéma.

## Action

- [ ] Vérifier que la beta est bien terminée
- [ ] Supprimer les 3 models du schéma Prisma
- [ ] Supprimer les routes API associées (beta-verify, beta-access)
- [ ] Supprimer les pages associées (`app/(auth)/beta-access/`)
- [ ] Créer une migration Prisma

## Critères de succès

- `UserBeta`, `BetaKey`, `BetaFeedback` supprimés du schéma
- Page beta-access supprimée
- Routes API beta supprimées

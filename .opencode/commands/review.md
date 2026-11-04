---
description: Revue de code en lecture seule, findings par sévérité
agent: reviewer
---

Review $ARGUMENTS.

Organise la réponse par sévérité :
1. **Critique** — bug, sécurité, perte de données, régression.
2. **Élevé** — logique incorrecte, cas d'échec non géré.
3. **Moyen** — maintenabilité, performance, cohérence.
4. **Faible** — style, nommage, documentation.

Pour chaque finding : fichier, ligne, problème, correctif proposé, test manquant.
Ne modifie aucun fichier.

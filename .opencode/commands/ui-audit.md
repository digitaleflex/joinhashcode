---
description: Audit UI desktop/mobile avec Playwright
agent: ui-auditor
---

Audite l'UI de : $ARGUMENTS.

Pour chaque page :
1. Capture en **390 px** et **1440 px**.
2. Vérifie la navbar (position, état actif, menu mobile).
3. Détecte le débordement horizontal (`scrollWidth > innerWidth`).
4. Vérifie les chevauchements, contrastes faibles, textes trop petits.
5. Vérifie les états vides, chargements et erreurs.
6. Vérifie la cohérence des couleurs de statut et des CTA.

Rends un tableau : page, viewport, problème, sévérité, correctif proposé.
Ne modifie aucun fichier sans demande explicite.

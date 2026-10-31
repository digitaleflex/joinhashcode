# 06 — Changeset proposé (aucune opération fonctionnelle exécutée)

## Principe
Cette branche contient uniquement le dossier de revue. Les fichiers canoniques et le backlog ne sont pas encore modifiés. Les changements ci-dessous sont des propositions soumises à confrontation au code.

## Fichiers canoniques candidats — à réviser après P0
- `PRODUCT_VISION.md` : préciser les trois domaines comme parcours produits effectifs.
- `DOCS/DECISIONS.md` : ajouter la décision multi-domaines au prochain ID libre ; préserver D-014, D-015 et D-023 avec leur historique.
- `DOCS/PIVOT_CYBER.md` : marquer comme décision historique/supersédée seulement après arbitrage formel.
- `ABSORPTION.md` : remplacer les directives devenues obsolètes par une matrice actuelle.
- `ROADMAP.md` et `README.md` : aligner la feuille de route et la présentation publique après validation.

## Issues candidates — ne pas modifier avant revue du contenu actuel
- #372 : EPIC pivot cyber ; réviser ou superséder en préservant l'historique.
- #397 : tâches d'alignement cyber ; redistribuer les tâches encore utiles.
- #394 : contrat AcquisitionContext ; étendre seulement si le contrat actuel ne couvre pas les cas nécessaires.
- #361 : réévaluer l'absorption administrative ; rouvrir ou créer une nouvelle issue de remplacement.
- #368 : réévaluer le handoff vers la première action.
- #347 : conserver comme historique.

## Reboot
Ne pas modifier le dépôt Reboot pendant cette phase. Les issues #209, #212, #142, #158, #153, #103, #174 et #156 restent des références à relire.

## Pull requests et branches
- JoinHashCode #371 et Reboot #274 : inspection séparée ; aucune fusion automatique.
- Ne pas fusionner toute la branche Reboot `development` ; extraire uniquement des commits identifiés, si nécessaire, après revue.

## Exclusions
Pas de changement de code, schéma, secret, variable d'environnement, déploiement, migration, fermeture d'issue/PR, suppression de branche ou archivage de dépôt dans ce dossier.

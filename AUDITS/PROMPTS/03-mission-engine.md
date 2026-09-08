# Audit — Mission Engine

Audite le Mission Management System de bout en bout.

## Vérifier
Catalogue, publication, disponibilité, claim/release, prérequis, niveaux, XP, étapes, autosave, soumission, preuves, historique, review, revision, rejection, approval, peer review et CORE validation.

## Lifecycle
Reconstruis le lifecycle réel:
DRAFT → PUBLISHED → AVAILABLE → CLAIMED → IN_PROGRESS → SUBMITTED → IN_REVIEW → REVISION_REQUIRED → RESUBMITTED → APPROVED/REJECTED.

## Scénarios critiques
- double claim
- double submit
- mission expirée
- accès à une tentative d'un autre utilisateur
- manipulation de statut côté client
- modification concurrente/autosave
- XP attribué deux fois
- mission approuvée sans effets secondaires attendus

## Exigence transverse
Trace chaque flux:
UI → event → route/API → validation → DB → side effects → UI update.

Produis un diagramme de dépendances avec XP, badges, notifications, profil, spécialisation et admin review.

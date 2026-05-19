# HASHCODE — Spécification : Mission System V2 & Admin Panel

## Vision
Passer d'une liste de missions générique à un système de "Briefings Opérationnels" où chaque mission est un projet guidé, validé manuellement par l'élite HASHCODE.

## 1. Évolution du Schéma (Prisma)

### Modèle `Mission`
- `fullBriefing`: `String @db.Text` — Instructions complètes et ressources.
- `submissionMethod`: `String` — `GITHUB_PR`, `GOOGLE_DRIVE`, `ANY_LINK`.
- `deliverables`: `String[]` — Checklist des éléments à fournir.

### Modèle `MissionSubmission`
- `status`: Changement de comportement. Par défaut `PENDING` (au lieu de `APPROVED`).
- `adminFeedback`: `String?` — Commentaire en cas de rejet.
- `reviewerId`: `String?` — ID de l'admin qui a validé.

## 2. Pages Utilisateur (`/missions/[id]`)

### Interface de Briefing
- **Header Dynamique** : Affiche les badges de difficulté et les XP.
- **Section Instructions** : Rendu Markdown du `fullBriefing`.
- **Workflow GitHub** : Instructions spécifiques pour le Fork de l'organisation officielle HASHCODE.
- **Formulaire de Soumission** : 
  - Champ URL unique.
  - Case à cocher "J'ai invité admin@joinhashcode.com" (si Google Drive).
  - Bouton "Transmettre pour validation".

## 3. Panneau Admin (`/admin/missions`)

### Dashboard de Validation
- **Filtres** : Par Guilde et par Ancienneté.
- **Vue Détail** : Lien vers le livrable, description du projet par l'utilisateur.
- **Actions** :
  - `APPROVE` : Crédite les XP, envoie l'email de succès.
  - `REJECT` : Ouvre une modale pour saisir le motif, envoie un email de relance.

## 4. Workflow GitHub (Organisation HASHCODE)
1. L'utilisateur clique sur "Lancer la mission".
2. Il est dirigé vers le repo template sur le GitHub HASHCODE.
3. Il Fork, Build, et soumet le lien de sa PR (ou de son fork).

## Plan d'implémentation
1. **Schema** : Mise à jour de `Mission` et `MissionSubmission`.
2. **Seed** : Enrichir les missions existantes avec des briefings réels.
3. **Frontend** : Créer la page de détail dynamique.
4. **Admin** : Créer la route `/admin/missions` (protégée par le rôle `ADMIN`).
5. **Logic** : Désactiver l'auto-approbation dans `/api/missions`.

---
*Spécification rédigée le 17 Mai 2026 — Prête pour implémentation.*

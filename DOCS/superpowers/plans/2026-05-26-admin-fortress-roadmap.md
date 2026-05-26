# Roadmap : Opération Admin Fortress 🛡️

Ce document définit la stratégie de montée en puissance de l'arsenal administratif de HASHCODE avant le lancement public.

## 🎯 Objectif
Transformer le mode "Concierge" manuel en un système autonome, pilotable par l'admin sans toucher au code ou à la base de données.

---

## 📅 Sprints & Estimations

### Sprint 1 : Mission Control (Cœur du Système)
*   **Fonctionnalité :** CRUD complet des Missions (`/admin/missions`).
*   **Agents :** `generalist` (UI), `codebase_investigator` (API/Prisma).
*   **Livrables :** Dashboard de gestion, Formulaire de création/édition, API de modification temps réel.
*   **Estimation :** 1h30.

### Sprint 2 : Access & Broadcast (Croissance)
*   **Fonctionnalités :** 
    1.  Gestionnaire de Beta Keys (Codes d'accès).
    2.  Notification Center (Annonces globales).
*   **Agents :** `architect` (Schema BetaKey), `generalist` (Forms).
*   **Livrables :** Générateur de codes, Interface d'envoi d'annonces.
*   **Estimation :** 2h.

### Sprint 3 : Support & Intel (Opérations)
*   **Fonctionnalités :** 
    1.  Support Impersonation ("View As").
    2.  Export Global CSV (Analytics).
*   **Agents :** `architect` (Security Auth), `generalist` (UI).
*   **Livrables :** Mode visionneuse, Bouton d'export analytique.
*   **Estimation :** 1h30.

### Sprint 4 : Governance (Sécurité)
*   **Fonctionnalité :** Admin Audit Log.
*   **Agents :** `codebase_investigator` (Tracking logic).
*   **Livrables :** Journal des actions admin (qui a validé quoi).
*   **Estimation :** 1h.

---

## 🛠️ Orchestration
*   **Branche :** `feat/admin-fortress`
*   **Validation :** Tests unitaires sur les API routes + Peer review par l'agent `code-reviewer`.

**TOTAL ESTIMÉ : ~6 heures de build intensif.**

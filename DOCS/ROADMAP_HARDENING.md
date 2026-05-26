# 🛡️ Roadmap : Hardening & Modération Bêta

Ce document définit les travaux de sécurisation et de modération nécessaires pour protéger HASHCODE contre les abus lors du lancement public.

## 🏁 Sprint A : Hardening & Modération (Priorité Rouge)

### Issue #A1 : Anti-Spam Recrutement
*   **Problème :** Un utilisateur peut spammer des dizaines de demandes de candidature.
*   **Action :** 
    *   Limiter à 3 demandes de candidature `PENDING` simultanées par utilisateur.
    *   Ajouter un rate-limit strict sur `POST /api/squad/join-request`.
*   **Fichiers :** `app/api/squad/join-request/route.ts`

### Issue #A2 : Filtre de Contenu Offensif
*   **Problème :** Noms d'escouades inappropriés sur la page publique.
*   **Action :**
    *   Intégrer une bibliothèque de filtrage de contenu (profanity filter).
    *   Bloquer la création/mise à jour si le nom ou le slug contient des mots interdits.
*   **Fichiers :** `app/api/squad/create/route.ts`, `app/api/squad/update/route.ts`

### Issue #A3 : Protection Anti-Sybil (Multi-comptes)
*   **Problème :** Un utilisateur crée plusieurs comptes pour booster son XP.
*   **Action :**
    *   Enregistrer l'adresse IP et le User-Agent lors d'une candidature.
    *   Alerter ou bloquer si plus de 2 comptes utilisent la même IP dans une même escouade.
*   **Fichiers :** `prisma/schema.prisma`, `app/api/squad/join-request/route.ts`

### Issue #A4 : Validation du Daily Check-in
*   **Problème :** Notes de check-in vides ou inutiles pour farmer l'XP.
*   **Action :**
    *   Imposer un minimum de 20 caractères pour la note de check-in.
    *   Vérifier que la note n'est pas une simple répétition de la veille.
*   **Fichiers :** `app/api/user/checkin/route.ts`

---

## ✅ Sprint B : Fiabilité & Infrastructure (Terminé)

### Issue #B1 : Sauvegardes Automatisées
*   **Action :** Création d"un workflow GitHub Action qui effectue un `pg_dump` quotidien à 04:00 UTC.
*   **Fichiers :** `.github/workflows/backup-db.yml`

### Issue #B2 : Centre d"Alerting Discord
*   **Action :** Centralisation des erreurs via `lib/logger.ts` et envoi vers un Webhook Discord.
*   **Fichiers :** `lib/logger.ts`, tous les crons mis à jour.

### Issue #B3 : Pagination de la Découverte
*   **Action :** API supportant `cursor` et `limit` pour une scalabilité infinie.
*   **Fichiers :** `app/api/squad/public/route.ts`

### Issue #B4 : Cron de Nettoyage
*   **Action :** Tâche hebdomadaire pour purger les invitations expirées et les vieux logs.
*   **Fichiers :** `app/api/internal/cron/cleanup/route.ts`

---

## ✅ Sprint C : Optimisation & Analytics (Terminé)

### Issue #C1 : Funnel Analytics
*   **Action :** Création de `lib/analytics.ts` et intégration des événements clés (Onboarding, Première Mission, MFA).
*   **Fichiers :** `lib/analytics.ts`, `app/api/onboarding/route.ts`, `app/api/missions/route.ts`.

### Issue #C2 : Gestion des Email Bounces
*   **Action :** Webhook pour Resend qui marque les emails invalides ou signalés comme spam pour protéger la réputation du domaine.
*   **Fichiers :** `app/api/webhooks/resend/route.ts`, schéma Prisma mis à jour.

### Issue #C3 : Optimisation du Cache
*   **Action :** Implémentation d"une couche de cache en mémoire (`lib/cache.ts`) pour les requêtes de découverte des escouades.
*   **Fichiers :** `lib/cache.ts`, `app/api/squad/public/route.ts`.

---

## 🏆 Statut Final : Plateforme Hardened & Ready
Le backlog de sécurisation et de fiabilisation est désormais **entièrement complété**. HASHCODE dispose d"une infrastructure de niveau industriel, prête pour une montée en charge sécurisée.

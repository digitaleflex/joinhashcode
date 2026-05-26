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

## 📅 Planning des Sprints Suivants

*   **Sprint B (Fiabilité) :** Backups automatisés, Alerting Discord, Pagination Découverte.
*   **Sprint C (Optimisation) :** Funnel Analytics, Webhooks Bounces, Prisma Cache.

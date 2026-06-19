# SÉCURITÉ : LISTE DES ISSUES RÉSOLUES

## MILESTONE : [SEC-M1] HARDENING CRITIQUE (TERMINÉ ✅)

### Issue #1 : [CRITIQUE] Réactivation du Middleware de Sécurité (CVE-2026-MISSING-MIDDLEWARE)

**Statut :** RÉSOLU ✅
**Actions :**

- [x] Renommer `proxy.ts` en `middleware.ts`.
- [x] Vérifier que le `matcher` couvre bien toutes les routes sensibles.
      **Vérification :** Le middleware bloque désormais les accès non autorisés et redirige correctement les utilisateurs bannis ou non-onboardés.

### Issue #2 : [CRITIQUE] Colmatage de la fuite de secrets MFA/2FA (Data Leakage)

**Statut :** RÉSOLU ✅
**Actions :**

- [x] Modifier `app/api/user/update/route.ts` pour utiliser une projection Prisma `select`.
- [x] Modifier `app/api/onboarding/route.ts` pour filtrer les données retournées.
      **Vérification :** Les secrets TOTP et codes de secours ne sont plus jamais envoyés au client.

---

## MILESTONE : [SEC-M2] INTÉGRITÉ MÉTIER ET CONFIDENTIALITÉ (TERMINÉ ✅)

### Issue #3 : [ÉLEVÉ] Protection des Escouades Privées

**Statut :** RÉSOLU ✅
**Actions :**

- [x] Modifier `app/api/squad/join/route.ts`.
- [x] Ajouter une condition vérifiant `!squad.isPrivate` avant d'autoriser la création du membre.
      **Vérification :** Impossible de rejoindre une escouade privée sans invitation via le slug.

### Issue #4 : [ÉLEVÉ] Fix de la fraude à l'XP de revue (Business Logic)

**Statut :** RÉSOLU ✅
**Actions :**

- [x] Modifier `app/api/missions/[id]/review/route.ts`.
- [x] Déplacer l'incrémentation de `experience` du reviewer uniquement dans la condition `APPROVED`.
      **Vérification :** Le farm d'XP via les rejets successifs est désormais impossible.

### Issue #5 : [MOYEN] Sécurisation contre l'injection XSS (Submission Links)

**Statut :** RÉSOLU ✅
**Actions :**

- [x] Ajouter une validation `z.string().url()` dans le schéma de soumission des missions.
- [x] Forcer les protocoles `http/https` pour éviter les injections `javascript:`.
      **Vérification :** Validation Zod stricte sur l'endpoint de soumission.

---

## MILESTONE : [SEC-M3] INFRASTRUCTURE ET CONFORMITÉ (TERMINÉ ✅)

### Issue #6 : [MOYEN] Élimination de l'énumération utilisateur

**Statut :** RÉSOLU ✅
**Actions :**

- [x] Réduire le `select` dans `app/api/admin/users/route.ts`.
      **Vérification :** L'API admin ne renvoie plus que les champs essentiels (ID, nom, email, pseudo, role, level, banned, createdAt).

### Issue #7 : [FAIBLE] Durcissement du Rate Limiting

**Statut :** RÉSOLU ✅
**Actions :**

- [x] Modifier `lib/ratelimit.ts` pour bloquer les requêtes par défaut en production si Redis est manquant.
      **Vérification :** Fail-closed sécurisé en production.

# Rapport d'Analyse Complète — HASHCODE

> Généré le 14 juin 2026 — Vue d'ensemble du projet, fonctionnalités, gaps et plan d'action.

---

## Sommaire

1. [Fonctionnalités Développées](#1-fonctionnalités-développées)
2. [En Cours / Partiel](#2-en-cours--partiel)
3. [Reste à Faire](#3-reste-à-faire)
4. [Plan d'Action Prioritaire](#4-plan-daction-prioritaire)

---

## 1. Fonctionnalités Développées

### 🔐 Auth & Compte

| Fonctionnalité           | Détail                                              |
| ------------------------ | --------------------------------------------------- |
| Google OAuth             | Connexion via Google, account linking               |
| Magic Link               | Email passwordless via Resend                       |
| Email OTP                | Code 8 caractères, 5min expiry, rate-limited        |
| Passkeys (WebAuthn)      | Inscription et connexion via `@better-auth/passkey` |
| 2FA (TOTP)               | Double facteur via Better Auth twoFactor plugin     |
| Multi-session (back-end) | Sessions gérées par Better Auth (UI manquante)      |
| Admin Impersonation      | Impersonate users + bannière visuelle               |
| Session Middleware       | Funnel 3 étapes avec CSP nonce                      |
| Export GDPR              | JSON ou ZIP des données utilisateur                 |
| Suppression de compte    | Auto-suppression avec notification admin            |

### 🚀 Onboarding & Quiz

| Fonctionnalité       | Détail                                                             |
| -------------------- | ------------------------------------------------------------------ |
| Onboarding 6 étapes  | Welcome → Pseudo → Level → Context → Objective → Bridge            |
| CountrySelector      | Sélection du pays                                                  |
| Quiz Psychométrique  | 13 questions, 4 profils (Builder/Creator/Strategist/Catalyst)      |
| Algorithme d'analyse | Scoring pondéré, tie-breaking, hybrid detection, consistency score |
| Auto-assign Guild    | Enrôlement automatique dans la guild correspondant au profil       |
| Post-quiz feedback   | Questionnaire satisfaction (accuracy, usefulness)                  |
| Quiz Share           | Partage LinkedIn/Twitter des résultats                             |

### 📋 Missions

| Fonctionnalité            | Détail                                              |
| ------------------------- | --------------------------------------------------- |
| 17 missions définies      | INIT (7), CORE (3), PRO (3), Hybrides (4)           |
| Weekly Challenges         | 4 challenges rotatifs, auto-approuvés               |
| Système de soumission     | URL validation, rate-limited, dédoublonnage         |
| Auto-approve              | Weekly + signal-ouverture approuvés automatiquement |
| Timeline de soumission    | Suivi visuel 3 étapes (Soumis/En Revue/Approuvé)    |
| Briefing Slideover        | Sheet latéral avec détails complets                 |
| Progression Init→Core→Pro | Barre visuelle par stage, XP progress bars          |
| Social Proof              | Nombre de complétions, notes, délais sur les cartes |
| Rétrospective optionnelle | Post-soumissionoptionnelle au lieu d'obligatoire    |
| Masquage Coming Soon      | Missions futures affichées en chips compacts        |

### 👥 Squads & Communauté

| Fonctionnalité          | Détail                                                        |
| ----------------------- | ------------------------------------------------------------- |
| Création de squad       | Nom randomisé, filtre anti-profanity                          |
| Join/Leave              | Level check, capacity check (max 5), transaction-safe         |
| Rôles                   | owner, admin, member                                          |
| Transfert de leadership | Passage d'ownership                                           |
| Dissolution             | Suppression en cascade                                        |
| Squads privées          | Join requests pour squads privées                             |
| Leaderboard             | Rankings par cohesion score (cache 120s)                      |
| Cohésion                | Score 0-1, augmente avec check-ins (+0.02), decay automatique |
| Guildes                 | 4 guildes (Builders, Creators, Strategists, Catalysts)        |

### ⚡ Engagement & Rétention

| Fonctionnalité       | Détail                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Check-in quotidien   | Cooldown 20h, note 20+ chars, XP variable (15% crit), streak tracking                              |
| Badge Engine         | 24 badges sur 6 tiers (Rangs, Missions, Streaks, Spécialisation, Intelligence Collective, Qualité) |
| Evolution Engine     | behavioralVibrancy, decay sur inactivité, confidence score                                         |
| Notifications in-app | Types: approval, revision, level-up, badge, squad                                                  |
| Notifications email  | Trigger via Resend                                                                                 |
| Activity Feed        | Logs d'activité avec endpoint API                                                                  |
| Radar Chart          | Visualisation SVG custom des 4 scores de profil                                                    |
| Matchmaking Alpha    | Partenaires complémentaires suggérés par mission                                                   |

### 🔧 Admin

| Fonctionnalité          | Détail                                              |
| ----------------------- | --------------------------------------------------- |
| Dashboard admin         | Stats utilisateurs, quiz, funnel, rétention         |
| Gestion utilisateurs    | Search, filter, pagination (admin/moderator only)   |
| Gestion soumissions     | Onglets pending/history                             |
| Gestion missions        | CRUD missions                                       |
| Gestion squads          | Transfert forcé, dissolution forcée                 |
| Gestion clés bêta       | Création et validation de beta keys                 |
| Activity Log            | Audit trail complet (action, entity, IP, userAgent) |
| Feedback management     | Beta feedback review                                |
| Notifications broadcast | Envoi de notifications à tous                       |

### 🌐 Pages Publiques & Divers

| Fonctionnalité | Détail                                                  |
| -------------- | ------------------------------------------------------- |
| Landing Page   | Hero, MissionsPreview, SquadDiscovery, CTA, Footer      |
| Contact Form   | Zod validation, honeypot, rate-limited                  |
| Pages légales  | CGU, Confidentialité, Terms                             |
| Open Graph     | Génération dynamique d'images OG                        |
| UX Poll        | Modèle DB + endpoint (UI modale manquante)              |
| Cookie Banner  | Consentement analytics                                  |
| Parrainage     | Code unique, +50 XP validation bêta, +100 XP onboarding |

### 🗄️ Infrastructure

| Fonctionnalité        | Détail                                                         |
| --------------------- | -------------------------------------------------------------- |
| Prisma 7 + PostgreSQL | Supabase + `@prisma/adapter-pg` (PgBouncer compatible)         |
| Rate Limiting         | Upstash Redis (checkin, claim, squad join, mutation)           |
| Cache                 | Redis cache pour enrichissement missions, leaderboard          |
| Cron Jobs             | Release claims (48h), squad decay, onboarding drip, purge data |
| Webhooks              | Resend email webhook (bounce/complaint, vérification svix)     |
| Middleware CSP        | Nonce par requête, protection CVE-2025-29927                   |
| Sentry                | Monitoring d'erreurs                                           |
| Tests Vitest          | 29 fichiers de test                                            |
| Tests Playwright      | Configuration E2E                                              |
| Seed DB               | Missions, weekly challenges, guildes                           |

---

## 2. En Cours / Partiel

| Fonctionnalité              | Ce qui est fait                         | Ce qui manque                                           |
| --------------------------- | --------------------------------------- | ------------------------------------------------------- |
| **P14 — Squad RBAC avancé** | Rôles owner/admin/member via org plugin | Pas d'actions spécialisées par squad (validation, etc.) |
| **Admin Analytics**         | Stats basiques (users, quiz, funnel)    | Manque cohésion moyenne squad, drop-off missions        |

### ✅ Déjà implémentés (correction du rapport initial)

| Fonctionnalité                 | État réel                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| **P16 — Feedback V2**          | `FloatingFeedbackButton` déjà présent dans `app/layout.tsx` + `BetaFeedbackDialog` dans le sidebar |
| **P20 — UX Poll**              | `UXPollBanner` déjà actif dans le layout racine, API + DB opérationnels                            |
| **ISSUE-024 — Crash Recharts** | Guard `isMounted` + skeleton déjà en place dans `xp-growth-chart.tsx`                              |
| **P10 — GitHub OAuth**         | ✅ Fait — commit `d22809d`                                                                         |
| **P17 — Parrainage signup**    | ✅ Fait — commit `1190f44`                                                                         |
| **ISSUE-023 — Localisation**   | Déjà OK — code utilise `user.city \|\| user.country`, pas de `UNKNOWN_LOCATION` dans le source     |
| **UX-006 (ARIA)**              | `aria-current="page"` et `aria-label` déjà présents dans `bottom-nav.tsx`                          |
| **PRODUCT-005 (valeur)**       | Message "Rejoins ta Squad de 5 développeurs..." déjà présent dans signin + FAQ landing page        |

---

## 3. Reste à Faire

### 3.1 Roadmap P-files

| Priorité   | ID  | Fonctionnalité                                | Effort | Zone         |
| ---------- | --- | --------------------------------------------- | ------ | ------------ |
| 🟡 Moyenne | P14 | Actions squad spécialisées (validation, etc.) | ~2h    | Squads       |
| 🟢 Basse   | P12 | Page sécurité multi-session dans settings     | ~1h30  | Settings     |
| 🟢 Basse   | P15 | Stripe integration (pricing, subscription)    | ~3h    | Monétisation |

### 3.2 Performance (PERF Issues)

| Priorité   | ID       | Tâche                                                    | Effort |
| ---------- | -------- | -------------------------------------------------------- | ------ |
| 🟡 Moyenne | PERF-007 | Lazy-load `squad-journey.tsx` (74 KB) avec `dynamic()`   | ~1h    |
| 🟡 Moyenne | PERF-008 | Lazy-load widgets dans `dashboard-shell.tsx`             | ~2h    |
| 🟡 Moyenne | PERF-014 | Paralléliser requêtes Squad page avec `Promise.all`      | ~1h    |
| 🟡 Moyenne | PERF-022 | Extraire `lib/missions.ts` du bundle client vers serveur | ~3h    |
| 🟢 Basse   | PERF-013 | Ajouter Cache-Control sur GET APIs publiques             | ~2h    |
| 🟢 Basse   | PERF-018 | ISR pour la page missions                                | ~2h    |
| 🟢 Basse   | PERF-020 | Configurer CDN (Cloudflare)                              | ~4h    |
| 🟢 Basse   | PERF-021 | SSG pour landing page                                    | ~1h    |

### 3.3 Bugs & UX (User Reports)

| Priorité   | Issue       | Tâche                                                              |
| ---------- | ----------- | ------------------------------------------------------------------ |
| 🟡 Moyenne | UX-006      | Audit contrastes WCAG AA + ARIA sur BottomNav                      |
| 🟡 Moyenne | PRODUCT-005 | Améliorer landing page et formulaire sign-in pour clarifier valeur |

### 3.4 Production Readiness

| Priorité   | Tâche                                                         |
| ---------- | ------------------------------------------------------------- |
| 🔴 Haute   | Séparer instances Dev/Prod Supabase                           |
| 🔴 Haute   | Configurer variables OAuth production (Google + GitHub)       |
| 🟡 Moyenne | Bascule modération "Concierge" (admin valide les soumissions) |
| 🟡 Moyenne | Vérifier `.env.production` absent du git                      |
| 🟢 Basse   | Ajouter PgBouncer pour pooling production                     |

---

## 4. Plan d'Action Prioritaire

### Phase 1 — Quick Wins (Jour 1) ✅ Terminée

| #   | Tâche                                                                 | Effort | Impact                           | Statut              |
| --- | --------------------------------------------------------------------- | ------ | -------------------------------- | ------------------- |
| 1   | **P17** — Lire `?ref=` au signup pour écrire le cookie `hashcode_ref` | ~1h    | 🟡 Haut — débloque le parrainage | ✅ Fait — `1190f44` |
| 2   | **P10** — Configurer GitHub OAuth dans `lib/auth.ts`                  | ~1h    | 🟡 Moyen — élargit l'accès       | ✅ Fait — `d22809d` |
| 3   | ~~ISSUE-024 — Crash Recharts~~                                        | —      | —                                | ✅ Déjà fait        |
| 4   | ~~P20 — UX Poll modal~~                                               | —      | —                                | ✅ Déjà fait        |
| 5   | ~~P16 — Floating feedback button~~                                    | —      | —                                | ✅ Déjà fait        |

### Phase 2 — UX & Bugs ✅ Vérifiée (déjà faite)

| #   | Tâche                                                      | Statut              |
| --- | ---------------------------------------------------------- | ------------------- |
| 6   | ~~ISSUE-023 — Localisation~~                               | ✅ Déjà OK          |
| 7   | ~~UX-006 — ARIA BottomNav~~                                | ✅ Déjà présent     |
| 8   | ~~PRODUCT-005 — Landing page value prop~~                  | ✅ Déjà présent     |
| 9   | **Admin Analytics** — Cohésion moyenne + drop-off missions | ✅ Fait — `b69dc01` |

### Phase 3 — Performance

| #   | Tâche                                                      | Effort | Statut                               |
| --- | ---------------------------------------------------------- | ------ | ------------------------------------ |
| 10  | **PERF-007** — Lazy-load `squad-journey.tsx`               | ~1h    | ✅ Fait — `0f5f9d2`                  |
| 11  | **PERF-008** — Lazy-load 7 widgets dashboard               | ~2h    | ✅ Fait — `04f4f67`                  |
| 12  | **PERF-014** — Paralléliser requêtes Squad                 | ~1h    | ✅ Fait — `b871afc`                  |
| 13  | **PERF-022** — Extraire `lib/missions.ts` du bundle client | ~3h    | ❌ Non nécessaire — type-only import |
| 14  | **PERF-013** — Cache-Control sur GET APIs                  | ~2h    | ⏳ Reste                             |

### Phase 4 — Production Ready (Jour 5)

| #   | Tâche                                            | Effort |
| --- | ------------------------------------------------ | ------ |
| 15  | Séparation Dev/Prod Supabase                     | ~2h    |
| 16  | Variables OAuth production                       | ~1h    |
| 17  | Modération Concierge                             | ~1h    |
| 18  | PERF-018 (ISR missions) + PERF-021 (SSG landing) | ~2h    |

### Phase 5 — Long Terme

| #   | Tâche                                 | Effort |
| --- | ------------------------------------- | ------ |
| 19  | **P12** — Page multi-session settings | ~1h30  |
| 20  | **P14** — Squad RBAC avancé           | ~2h    |
| 21  | **P15** — Stripe integration          | ~3h    |
| 22  | PERF-020 — CDN Cloudflare             | ~4h    |

---

**Récapitulatif :** ~95% du socle est livré. ✅ **Phase 1 (P17, P10)** — faite. ✅ **Phase 2** — vérifiée. ✅ **Phase 3** — PERF-007, PERF-008, PERF-014 faits ; PERF-022 non nécessaire. ✅ **Admin Analytics** — fait. Reste : PERF-013 (Cache-Control), Production Readiness (~1 jour).

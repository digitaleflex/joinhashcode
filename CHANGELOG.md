# Changelog

All notable changes to HASHCODE are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [2.6.0] — 2026-06-14

### 🚀 Stabilisation Production & Neuro-Engagement (Sprint Final)

Cette version marque le rétablissement complet des services de production et l'intégration des principes de neuro-marketing pour transformer l'expérience utilisateur.

#### 🔧 Correctifs Critiques (Production)

- **Rétablissement Middleware** — Correction des erreurs 503 sur Vercel en supprimant les appels réseau locaux (loopback) et en sécurisant la validation par cookie (timeout 3s).
- **Sécurité Proxy & CSRF** — Activation de `trustedProxyHeaders` par défaut pour assurer la compatibilité avec l'infrastructure Vercel (fix 403 Forbidden).
- **Passkeys & 2FA** — Alignement total avec le SDK Better Auth v1. Correction des routes 404 sur les passkeys et des erreurs 400 sur l'activation 2FA pour les comptes OAuth.

#### 🧠 Roadmap Neuro-Pédagogique (Phases 1-4)

- **Focus Flow (Phase 1)** — Implémentation d'un tunnel attentionnel pour les nouveaux utilisateurs : estompage des sections secondaires tant que la première mission n'est pas validée.
- **Mission "Signal d'Ouverture"** — Création d'une micro-mission d'initialisation à succès immédiat (auto-approuvée) pour déclencher la boucle d'engagement.
- **Valorisation du Statut (Phase 2)** — Transformation de la Carte de Membre en artefact social. Système de génération d'image HD et textes de partage prestigieux pour LinkedIn/X.
- **Boucle Dopaminergique (Phase 3)** — Introduction de récompenses variables sur le Check-in quotidien (15% de chance de "Coup Critique" +15 XP) et messages de succès rares.
- **Mindset de Croissance (Phase 4)** — Recadrage de la "Dérive" en "Potentiel d'Alignement" et célébrations de montée en grade massives avec titres honorifiques (Opérateur, Architecte, Commandant, Légende).

#### 🛡️ Authentification Sociale

- **Google OAuth v1** — Activation officielle de la connexion Google avec **Account Linking**. Les utilisateurs peuvent désormais fusionner leurs comptes Email et Google de manière transparente.
- **Bouton Cyber-UI** — Nouveau bouton "Continuer avec Google" intégré avec l'esthétique terminal du projet.

#### UX & Humanisation

- **Nettoyage Jargon** — Traduction et humanisation des étiquettes techniques (Vitalité, Confiance, Bâtisseur, Stratège).
- **Pédagogie Interactive** — Déploiement d'icônes `(i)` et tooltips sur toutes les métriques clés, visibles sur desktop et mobile.
- **Glossaire Tactique** — Ajout d'un glossaire des concepts fondamentaux directement dans le Dossier utilisateur.

---

## [2.5.0] — 2026-06-13

### 🛡️ Solidification & Gamification Elite (Opération Phoenix)

Cette release marque la fin du cycle de consolidation technique et l'explosion du système de récompenses.

#### Dette Technique & Performance

- **Éradication des types `as any`** — Nettoyage en profondeur du client d'authentification et du moteur d'évolution pour une sécurité de type totale (TSC Green).
- **Zéro Rechargement Brutal** — Remplacement des `window.location.reload()` par des `router.refresh()` pour une fluidité SPA parfaite.
- **Middleware Optimisé** — Intégration du cache Redis dans le middleware de session, réduisant les hits DB de 50%.

#### Gamification Elite

- **Expansion Massive des Badges** — Passage de 5 à **32 badges originaux** (Rangs, Missions, Discipline, Spécialisation, Social, Qualité).
- **Moteur de Célébration (Wow Effect)** — Nouvelle séquence de révélation neurale après le quiz et modal de montée en grade avec effets de confettis.

#### UX & Cohérence

- **Dossier Tactique Unifié** — Refonte des vues publiques et privées avec typage strict et suppression des dépendances inutilisées.
- **Accessibilité Mobile Initiale** — Harmonisation de la navigation mobile sur les pages critiques.

---

## [2.4.0] — 2026-06-13

### 🧠 Expérience Utilisateur & Pédagogie (Sprint Clarté)

Cette release transforme l'application en un environnement auto-documenté, garantissant qu'aucun talent n'est laissé sans guide, quel que soit son support.

#### Onboarding & Activation

- **Checklist d'Activation (J+0)** — Nouveau guide visuel interactif en haut du Dashboard pour transformer les nouveaux inscrits en membres actifs (Profil, Squad, Mission).
- **Auto-Onboarding** — Déclenchement automatique de la visite guidée interactive pour tout nouvel utilisateur (XP=0) avec persistance via `localStorage`.
- **Campagne d'E-mails Stratégique** — Automatisation d'une série de 4 e-mails "Drip" (J0, J1, J3, J7) pour guider l'évolution du talent (Vibrance, Missions, Squad, Réputation).
- **Calibration Neurale** — Introduction enrichie du Quiz de profilage et explications détaillées sur les résultats (Builder, Creator, Strategist, Catalyst).

#### Accessibilité & Aide Contextuelle

- **Omniprésence Documentaire** — Déploiement massif de tooltips pédagogiques expliquant le "Pourquoi" stratégique de chaque métrique (Niveau, XP, Série, Confiance, Activité).
- **Mobile-First Help** — Ajout d'icônes d'information `(i)` intelligentes (`md:hidden`) sur mobile pour permettre l'ouverture des aides contextuelles au toucher.
- **Réécriture Stratégique** — Refonte des textes d'aide pour passer d'une simple navigation à un véritable conseil tactique pour l'évolution de carrière.

#### Sécurité & Fiabilité (Maintenance)

- **Patch de Sécurité Dépendances** — Mise à jour critique de `vitest` (v3.2.6), `hono`, `vite` et `esbuild` pour corriger les vulnérabilités de lecture de fichiers et contournement CORS.
- **Correction build Docker** — Optimisation des permissions `public/uploads` et support des URLs relatives pour les avatars utilisateur.
- **Harnais de Test UX** — Mise en place de tests automatisés (Vitest) validant les moteurs d'onboarding et de campagne drip.

#### Documentation

- **UX Cockpit** — Création de `DOCS/UX_COCKPIT.md` définissant les nouveaux standards d'aide contextuelle et d'accessibilité mobile.
- **Guide des E-mails** — Création de `DOCS/EMAIL_GUIDES.md` pour le pilotage de la communication sortante.

---

## [2.3.0] — 2026-06-12

### 🛡️ Sécurité (Plan de Remédiation 20/20)

Cette release marque la complétion du plan de remédiation de sécurité suite à l'audit complet du système.

#### Authentification & Autorisation

- **MFA Obligatoire** — La double authentification est désormais requise pour tout accès au panel `/admin` (SEC-012).
- **Rôles Staff** — Séparation stricte des privilèges ; les `MODERATOR` n'ont plus accès aux fonctions critiques d'administration (SEC-003).
- **Hardening Bêta** — Entropie des clés bêta passée de 32 à 128 bits pour bloquer l'énumération ; rate-limit et uniformisation des erreurs (SEC-013).

#### Infrastructure & Rate-Limiting

- **Global Redis Limiter** — Migration de tous les compteurs de sécurité vers Redis (partagé entre instances) avec politique "Fail-Closed" en production (SEC-005, SEC-011).
- **IP Trust** — Extraction fiable de l'IP réelle du client via proxy de confiance, bloquant l'usurpation d'identité (SEC-004).
- **Nonce-based CSP** — Implémentation d'une Content Security Policy dynamique avec nonces par requête, supprimant `unsafe-eval` et protégeant contre le XSS (SEC-010).

#### Intégrité des Données & Métier

- **Anti-Farming XP** — Blocage des gains d'XP multiples via resoumission de mission ou manipulation de squad (SEC-001, SEC-002).
- **Anti-Race Condition** — Sécurisation de la jonction de squad par transactions atomiques (SEC-006).
- **CSV Injection** — Neutralisation des formules malicieuses dans les exports administratifs (SEC-009).
- **Quiz Validation** — Validation algorithmique des réponses pour empêcher la falsification de profil (SEC-017).
- **Avatar Security** — Validation des magic bytes (JPEG/PNG/WEBP) et anonymisation des noms de fichiers (SEC-014, SEC-016).

#### Conformité & Pipeline

- **GDPR Retention** — Cron de purge automatique des logs et messages après 6-24 mois (SEC-018).
- **Security CI** — Pipeline de scan SAST (Semgrep) et audit de dépendances (SEC-020).
- **TS Safety** — Désactivation de `ignoreBuildErrors` pour garantir l'intégrité du code (SEC-019).

#### Corrections Techniques

- **Fix Build** — Renommage `proxy` → `middleware` et correction des erreurs de syntaxe dans les routes API.

---

## [Unreleased] — PRs en attente de merge

### fix(deps): patch Dependabot security vulnerabilities — PR #48

- `vitest` upgraded `^2.1.8` → `^3.2.6` (critical: arbitrary file read via UI server)
- `hono` pnpm override `^4.12.25` (cookie injection, IP bypass, JWT, mount prefix)
- `vite` pnpm override `^6.4.2` (path traversal in `.map` handling)
- `esbuild` pnpm override `^0.25.0` (CORS bypass on dev server)
- `ws`, `postcss`, `better-auth` — lock file refresh picks up patched versions

### fix(avatar): relative upload URL + Docker permissions — PR #49

- `lib/upload.ts` retourne une URL relative `/uploads/...` au lieu d'une URL absolue dépendant de `NEXT_PUBLIC_APP_URL` (fallback `localhost:3000` → image inaccessible)
- `Dockerfile` : `mkdir -p public/uploads && chown nextjs:nodejs` déplacé APRÈS le `COPY --from=builder /app/public` pour ne pas écraser les permissions
- `app/api/user/update` : schema Zod accepte désormais les chemins relatifs `/uploads/...` en plus des URLs complètes

---

## [2.1.0] — 2026-06-11

### Auth & Sécurité

- **Passkeys (WebAuthn)** — inscription et connexion biométrique/clé matérielle via `@better-auth/passkey`
- **Multi-session** — gestion de plusieurs sessions actives simultanément
- **Correction CVE-2025-29927** — header `x-middleware-subrequest` bloqué dans le proxy middleware
- **Fix SSR 2FA redirect** — redirection correcte après authentification deux facteurs côté serveur
- **Fix poll guests** — le polling de session est désormais ignoré pour les visiteurs non authentifiés
- **localStorage dismissal** — les bandeaux d'information peuvent être fermés définitivement

### Referral & Growth

- **Système de referral** — lien d'invitation personnalisé, 50 XP accordés au referrer à la conversion
- **Migration Prisma** — tables `referral` et `passkey` ajoutées au schéma

### Infrastructure

- **Suppression `shadowDatabaseUrl`** de la config Prisma pour corriger la génération en prod

---

## [2.0.0] — 2026-06-09 / 2026-06-10

### Landing & Performance

- **LCP optimisé** — images `priority`, `fetchpriority="high"`, suppression du chargement bloquant
- **Hydration mismatches résolus** — composants `ThemeToggle`, `UserPresence`, animations conditionnelles
- **OG Images dynamiques** — cartes Open Graph générées à la volée par profil (`/api/og/profile`)

### UX & Navigation

- **Tour interactif driver.js** — guide visuel complet sur tous les onglets principaux du dashboard (dashboard, missions, squad, dossier, settings)
- **Sidebar restructurée** — nouvelle hiérarchie de navigation, action check-in rapide en accès direct
- **Bouton gestion squad** — déplacé dans la top bar pour accès immédiat
- **Fix id dossier tour** — attribut `id="tour-dossier-tips"` manquant ajouté

### Squads — Management V2

- **Page `/squad/manage`** — interface complète pour leaders : gestion membres, demandes d'adhésion, annonces
- **Transfert de leadership** — le leader peut céder son rôle à un membre
- **Dissolution de squad** — suppression complète avec confirmation destructive
- **Visibilité & clearance** — contrôles tactiques (public/privé, niveau d'accès requis)
- **Journal d'activité squad** — actions de gestion tracées dans l'`ActivityLog`
- **Rapport cohésion** — intégré dans le dossier utilisateur et la vue admin

### Missions

- **Timeline de soumission** — historique complet intégré dans la carte de statut mission (P4)
- **Concierge Moderation Mode** — claim, review multi-étapes, timeline visible par les reviewers
- **Vue admin enrichie** — contexte projet, cartes visuelles dans la review de soumissions
- **Rendu TEXT_RESPONSE** — affichage texte formaté (corrige l'affichage en liens cassés)

### Auth

- **2FA optionnelle** — la 2FA n'est plus bloquante pour les admins, rendue opt-in

### Corrections

- Résolution ISSUE-023, ISSUE-024, UX-006, PRODUCT-005 (audit QA sprint correctif)
- 7 fichiers TypeScript corrigés (erreurs de types)
- Fix soumissions peer-review bloquées → libération automatique via cron
- Fix boucle infinie onboarding/quiz → refresh session forcé avant navigation
- Fix join-request accept/reject API squad

---

## [1.5.0] — 2026-05-27 / 2026-06-02

### Profil & Paramètres

- **Profils publics** — page `/u/[pseudo]` partageable publiquement avec carte profil, scores, badges
- **Settings modulaires** — refactoring du monolithe settings en onglets séparés : Profil, Spécialisation, Liens, Coffre-fort, Sécurité
- **Upload avatar local** — migration Supabase Storage → stockage VPS local (`public/uploads/`)
- **Sauvegarde langue** — champ `language` correctement persisté
- **Hardening upload** — protection path traversal dans `saveFile` via `realpath` check

### Sécurité

- **Rate limiting** — Upstash Redis sur check-in, squad join, mission claim
- **Headers sécurité** — durcissement CSP, HSTS, X-Frame-Options, Referrer-Policy
- **Fix 3 vulnérabilités** — profil public et upload feedback sécurisés
- **Audit limites Better Auth** — script `check-auth-limits.ts` exécuté automatiquement avant chaque déploiement

### Infrastructure & CI/CD

- **Middleware renommé `proxy.ts`** — compatibilité Next.js 16 (le fichier `middleware.ts` à la racine est réservé)
- **Deploy pipeline robuste** — séquence : migration Prisma → audit → seed → start → health check (30 tentatives × 5s) → rollback automatique sur échec
- **SSH single connection** — toutes les étapes de déploiement dans une seule session SSH pour éviter les timeouts port 22
- **Cron jobs** — squad cohesion decay, release stale claims, rappels utilisateurs inactifs
- **PR Labeler** — étiquetage automatique des PRs selon les fichiers modifiés
- **Stale issues** — fermeture automatique des issues inactives après 30 jours
- **Dependabot auto-merge** — workflow intelligent avec conditions de sécurité

---

## [1.0.0] — 2026-05-09 / 2026-05-25

### Lancement public

- Mise en ligne initiale de la plateforme HASHCODE
- Onboarding complet en 3 étapes (situation, pays, objectif)
- Quiz psychométrique → classification Builder / Creator / Strategist / Catalyst
- Dashboard utilisateur avec XP, niveaux, streaks, missions
- Système de squads avec cohésion, crons de decay, milestones
- Peer-review de missions entre membres
- Admin panel avec gestion soumissions et feedback bêta
- Auth multi-providers : Google, GitHub, Magic Link (OTP Resend)
- Dossier utilisateur — carte membre, scores, badges, rapport squad
- Feedback bêta enrichi avec catégorisation et suivi admin

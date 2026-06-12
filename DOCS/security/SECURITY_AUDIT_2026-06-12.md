# 🛡️ Audit de sécurité — JoinHashcode

- **Date** : 2026-06-12
- **Périmètre** : analyse statique du code (auth, middleware, ~53 routes API, upload, rate-limiting, infra Docker/CSP)
- **Score global** : **58 / 100**
- **Suivi des correctifs** : voir [`issues/INDEX.md`](./issues/INDEX.md)

---

## Résumé exécutif

Fondations correctes (Better Auth, cookies httpOnly/secure, anti-CSRF `trustedOrigins`, en-têtes de sécurité, anti CVE-2025-29927, path-traversal protégé, IDOR maîtrisé). **Non prête pour plusieurs milliers d'utilisateurs** : logique métier exploitable (farming XP), séparation des privilèges staff absente (MODERATOR = ADMIN), rate-limiting contournable/optionnel, disponibilité non dimensionnée (boucles O(n) globales).

| Gravité | Nombre |
|---|---|
| 🔴 Critique | 2 |
| 🟠 Élevée | 5 |
| 🟡 Moyenne | 8 |
| 🔵 Faible | 4 |

---

## Tableau de synthèse des vulnérabilités

| ID | Titre | Gravité | Priorité | Issue |
|---|---|---|---|---|
| BIZ-1 | Farming XP via re-soumission de mission | 🔴 Critique | P0 | [SEC-001](./issues/SEC-001-farming-xp-mission.md) |
| BIZ-2 | Farming XP via join/leave de squad | 🔴 Critique | P0 | [SEC-002](./issues/SEC-002-farming-xp-squad.md) |
| AUTZ-1 | MODERATOR possède tous les droits ADMIN | 🟠 Élevée | P0 | [SEC-003](./issues/SEC-003-moderator-admin-privesc.md) |
| AUTH-1 | IP spoofable (`trustedProxyHeaders`) | 🟠 Élevée | P1 | [SEC-004](./issues/SEC-004-trusted-proxy-headers.md) |
| API-1 | Pas de rate-limit généralisé / fail-open | 🟠 Élevée | P1 | [SEC-005](./issues/SEC-005-rate-limit-global.md) |
| BIZ-3 | Race condition join squad (TOCTOU) | 🟠 Élevée | P1 | [SEC-006](./issues/SEC-006-race-condition-squad-join.md) |
| DISPO-1 | Boucles O(n) globales non batchées | 🟠 Élevée | P1 | [SEC-007](./issues/SEC-007-bulk-loops-dos.md) |
| INFRA-2 | Webhook Resend : secret en URL, pas de signature | 🟡 Moyenne | P2 | [SEC-008](./issues/SEC-008-webhook-signature.md) |
| A03 | CSV/formula injection (export admin) | 🟡 Moyenne | P2 | [SEC-009](./issues/SEC-009-csv-injection.md) |
| INFRA-1 | CSP `unsafe-inline` / `unsafe-eval` | 🟡 Moyenne | P2 | [SEC-010](./issues/SEC-010-csp-hardening.md) |
| AUTH-2 | Rate-limit en mémoire (non partagé) | 🟡 Moyenne | P2 | [SEC-011](./issues/SEC-011-rate-limit-storage.md) |
| AUTH-3 | MFA non imposée (notamment staff) | 🟡 Moyenne | P2 | [SEC-012](./issues/SEC-012-mfa-enforcement.md) |
| INFRA-3 | Clés bêta 32 bits + énumérables | 🟡 Moyenne | P2 | [SEC-013](./issues/SEC-013-beta-key-entropy.md) |
| RGPD-2 | Avatars publics exposant l'userId | 🟡 Moyenne | P2 | [SEC-014](./issues/SEC-014-avatar-userid-exposure.md) |
| AUTZ-2 | `forceApprove` ignore les critères | 🟡 Moyenne | P2 | [SEC-015](./issues/SEC-015-force-approve.md) |
| DISPO-2 | Avatar bufferisé avant contrôle taille | 🟡 Moyenne | P2 | [SEC-016](./issues/SEC-016-avatar-buffer-validation.md) |
| BIZ-5 | Réponses quiz non validées | 🔵 Faible | P3 | [SEC-017](./issues/SEC-017-quiz-answer-validation.md) |
| RGPD-3 | Pas de politique de rétention | 🔵 Faible | P3 | [SEC-018](./issues/SEC-018-data-retention.md) |
| A04 | `ignoreBuildErrors: true` | 🔵 Faible | P3 | [SEC-019](./issues/SEC-019-ts-build-errors.md) |
| A06 | Scan de dépendances en CI | 🔵 Faible | P3 | [SEC-020](./issues/SEC-020-dependency-scanning.md) |

---

## Détails par phase

### Phase 1 — Cartographie

- **Framework** : Next.js 16.2.6 (App Router, `output: standalone`), React 19
- **Auth** : Better Auth 1.6.15 (Google/GitHub OAuth, Magic Link, Email OTP 8 car., 2FA, Passkey)
- **Rôles app** : `MEMBER` / `MODERATOR` / `ADMIN` ; **squad** : `owner` / `admin` / `member`
- **DB** : PostgreSQL (VPS Hostinger Docker), Prisma 7 + `@prisma/adapter-pg`
- **Stockage** : `public/uploads/` statique (volume Docker)
- **Externe** : Resend, Upstash QStash, Upstash Redis (optionnel), Discord webhook
- **Paiement** : aucun

### Phase 2 — Authentification

Positif : cookies httpOnly/secure/lax, OTP `crypto.randomInt` 8 car., rate-limit OTP dédié, ban vérifié. Failles : AUTH-1, AUTH-2, AUTH-3. **Score auth : 6/10.**

### Phase 3 — Autorisations

Positif : IDOR maîtrisé (écritures sur `session.user.id`), `update-role` squad robuste. Failles : AUTZ-1 (escalade staff), AUTZ-2 (`forceApprove`).

### Phase 4 — OWASP Top 10

A01 (AUTZ-1/2), A02 (webhook secret), A03 (CSV), A04 (farming + ignoreBuildErrors), A05 (CSP), A07 (proxy headers/MFA), A08 (signature webhook). A06/A09/A10 : risque faible.

### Phase 5 — API

API-1 (rate-limit absent/fail-open), API-2 (contact `Map` mémoire spoofable), énumération `beta-verify`.

### Phase 6 — Données (RGPD)

RGPD-1 (pas de chiffrement applicatif), RGPD-2 (avatars publics → userId), RGPD-3 (rétention). Positif : export + suppression utilisateur présents.

### Phase 7 — Infrastructure

Positif : `.env*` jamais committés (historique git vérifié), Docker non-root, secrets de build = placeholders. Failles : INFRA-1 (CSP), INFRA-2 (webhook), INFRA-3 (clés bêta).

### Phase 8 — Logique métier

BIZ-1, BIZ-2 (farming XP **critique**), BIZ-3 (race join), BIZ-4 (multi-comptes — atténuation via parade anti-abus), BIZ-5 (quiz).

### Phase 9 — Disponibilité

DISPO-1 (boucles globales), DISPO-2 (buffer avatar), DISPO-3 (rate-limit mémoire multi-réplicas).

---

## Plan de remédiation priorisé

1. **P0 (immédiat)** : SEC-001, SEC-002, SEC-003
2. **P1 (avant montée en charge)** : SEC-004, SEC-005, SEC-006, SEC-007
3. **P2 (durcissement)** : SEC-008 → SEC-016
4. **P3 (amélioration continue)** : SEC-017 → SEC-020

---

## Limites de l'audit

Non couvert (hors accès code) : contenu réel des `.env`, force des secrets prod, config reverse-proxy/firewall VPS, exposition réseau du conteneur PostgreSQL, DNS/TLS. Un pentest dynamique est recommandé pour confirmer AUTH-1 et BIZ-3.

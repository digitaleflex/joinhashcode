# 🔖 Suivi des correctifs de sécurité — JoinHashcode

Issues locales générées depuis l'[audit du 2026-06-12](../SECURITY_AUDIT_2026-06-12.md).

**Statut** : `🔴 OPEN` · `🟡 IN PROGRESS` · `✅ DONE` · `⚪ WONTFIX`

## P0 — Immédiat (bloquant)

| ID | Titre | Gravité | Statut |
|---|---|---|---|
| [SEC-001](./SEC-001-farming-xp-mission.md) | Farming XP via re-soumission de mission | 🔴 Critique | ✅ DONE |
| [SEC-002](./SEC-002-farming-xp-squad.md) | Farming XP via join/leave de squad | 🔴 Critique | ✅ DONE |
| [SEC-003](./SEC-003-moderator-admin-privesc.md) | MODERATOR possède tous les droits ADMIN | 🟠 Élevée | ✅ DONE |

## P1 — Avant montée en charge

| ID | Titre | Gravité | Statut |
|---|---|---|---|
| [SEC-004](./SEC-004-trusted-proxy-headers.md) | IP spoofable (`trustedProxyHeaders`) | 🟠 Élevée | ✅ DONE |
| [SEC-005](./SEC-005-rate-limit-global.md) | Pas de rate-limit généralisé / fail-open | 🟠 Élevée | ✅ DONE |
| [SEC-006](./SEC-006-race-condition-squad-join.md) | Race condition join squad (TOCTOU) | 🟠 Élevée | ✅ DONE |
| [SEC-007](./SEC-007-bulk-loops-dos.md) | Boucles O(n) globales non batchées | 🟠 Élevée | ✅ DONE |

## P2 — Durcissement

| ID | Titre | Gravité | Statut |
|---|---|---|---|
| [SEC-008](./SEC-008-webhook-signature.md) | Webhook Resend : secret en URL, pas de signature | 🟡 Moyenne | ✅ DONE |
| [SEC-009](./SEC-009-csv-injection.md) | CSV/formula injection (export admin) | 🟡 Moyenne | ✅ DONE |
| [SEC-010](./SEC-010-csp-hardening.md) | CSP `unsafe-inline` / `unsafe-eval` | 🟡 Moyenne | 🟡 IN PROGRESS |
| [SEC-011](./SEC-011-rate-limit-storage.md) | Rate-limit en mémoire (non partagé) | 🟡 Moyenne | 🔴 OPEN |
| [SEC-012](./SEC-012-mfa-enforcement.md) | MFA non imposée (staff) | 🟡 Moyenne | 🔴 OPEN |
| [SEC-013](./SEC-013-beta-key-entropy.md) | Clés bêta 32 bits + énumérables | 🟡 Moyenne | ✅ DONE |
| [SEC-014](./SEC-014-avatar-userid-exposure.md) | Avatars publics exposant l'userId | 🟡 Moyenne | ✅ DONE |
| [SEC-015](./SEC-015-force-approve.md) | `forceApprove` ignore les critères | 🟡 Moyenne | ✅ DONE |
| [SEC-016](./SEC-016-avatar-buffer-validation.md) | Avatar bufferisé avant contrôle taille | 🟡 Moyenne | ✅ DONE |

## P3 — Amélioration continue

| ID | Titre | Gravité | Statut |
|---|---|---|---|
| [SEC-017](./SEC-017-quiz-answer-validation.md) | Réponses quiz non validées | 🔵 Faible | 🔴 OPEN |
| [SEC-018](./SEC-018-data-retention.md) | Pas de politique de rétention | 🔵 Faible | 🔴 OPEN |
| [SEC-019](./SEC-019-ts-build-errors.md) | `ignoreBuildErrors: true` | 🔵 Faible | 🔴 OPEN |
| [SEC-020](./SEC-020-dependency-scanning.md) | Scan de dépendances en CI | 🔵 Faible | 🔴 OPEN |

---

**Progression** : 14 / 20 résolues · 1 en cours (SEC-010)

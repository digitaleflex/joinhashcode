# ABSORPTION.md — Suivi du décommissionnement des 4 codebases

> ⚠️ **AMENDEMENT PIVOT (17/09/2026 — D-014)** : le périmètre d'absorption est
> **réduit au pipeline cyber**. Ne plus absorber le contenu multi-domaines.
> Priorité d'absorption : les contenus qui servent la filière SOC/OSINT
> (labs, fiches méthode, exercices). Le reste passe en réserve. Référence : `DOCS/PIVOT_CYBER.md`.

> **But :** dire, item par item, ce qui est **réellement** porté dans `hashcode-community`
> avant d'archiver les 3 dépôts sources. Tant que ce document n'est pas intégralement
> en ✅ / 🔁 / 🗑️, **aucun dépôt source ne doit être supprimé**.
>
> **Dernière vérification :** 2026-09-16, commit `831e8e1`
> **Méthode :** analyse statique du code de `hashcode-community` (recherche d'équivalents
> par glob/grep + lecture ciblée). Chaque ligne est falsifiable : la colonne *Preuve*
> donne le fichier de référence ou l'absence constatée.
>
> **Références :** `VISION_UNIFIEE.md` §2 et §6 (architecture cible, règles anti-dispersion),
> `ROADMAP.md` §0.11 (fusion des schemas)

## Légende des statuts

| Statut | Signification |
|---|---|
| ✅ **PORTÉ** | équivalent fonctionnel présent et câblé dans `hashcode-community` |
| 🔁 **REMPLACÉ** | fonctionnalité couverte par un autre mécanisme du monolithe (better-auth, dashboard, XP…) |
| 🟡 **PARTIEL** | données/schéma présents, mais code incomplet ou non consommé |
| ⛔ **MANQUANT** | aucun équivalent → **à porter avant archivage** |
| 🗑️ **ABANDON VOLONTAIRE** | décision assumée, cohérente avec la vision — à ne PAS porter |

---

## 1. Les 4 dépôts

| # | Dépôt | Rôle | Répertoire local | Branche | Dernier commit | Commits | Modèles |
|---|---|---|---|---|---|---|---|
| 1 | `hashcode-community` | **BASE / cible** | `C:\Users\PC\Documents\GitHub\hashcode-community` | `main` | 2026-09-16 | — | **75** (Prisma) |
| 2 | `hashskills` | Academy / LMS | `C:\Users\PC\Documents\GitHub\hashskills` | `main` | 2026-08-15 | 56 | 31 (Prisma) |
| 3 | `hashcode_reboot` | Funnel / acquisition | `C:\Users\PC\Documents\hashcode_reboot` | **`development`** | 2026-09-14 | 183 | 12 (Prisma) |
| 4 | `hashcode-community-portal` | Admin / pôles | `C:\Users\PC\Documents\hashcode-community-portal` | `master` | 2026-09-04 | 31 | 5 tables (**Drizzle**) |

> ⚠️ Les dépôts 3 et 4 ne sont **pas** dans `Documents\GitHub\` mais dans `Documents\`.
> ⚠️ `hashcode_reboot` travaille sur `development` : toute comparaison doit viser cette branche.
> ⚠️ `hashcode-community-portal` n'a **pas de Prisma** (Drizzle) → c'est la cause du blocage #350.

---

## 2. `hashskills` — Academy / LMS

### 2.1 Modèles Prisma (31 → 26 absorbés, 5 écartés)

| Modèle source | Statut | Destination / preuve |
|---|---|---|
| `User`, `Session`, `Account`, `Verification` | 🗑️ ABANDON | doublons better-auth — écartés volontairement (`lib/auth.ts`) |
| `Notification` | 🔁 REMPLACÉ | `Notification` + `components/dashboard/notification-bell.tsx` |
| `AuditLog` | 🟡 PARTIEL | absorbé sous `LearningAuditLog` → **0 usage** |
| `Course`, `Category`, `Tag` | ✅ PORTÉ | `app/academy/courses/*`, `app/academy/courses/[slug]/page.tsx` |
| `Program`, `ProgramPhase`, `Pillar` | ✅ PORTÉ | `app/academy/programme/*`, `lib/academy/` |
| `Section`, `Content` | ✅ PORTÉ | consommés par relation dans `app/academy/my-courses/[id]/page.tsx` |
| `Enrollment` | ✅ PORTÉ | `enrollInCourse` (#349) |
| `Certificate` | ✅ PORTÉ | `app/academy/certificates/page.tsx` |
| `Badge`, `UserBadge` | ✅ PORTÉ | `lib/badge-engine.ts` |
| `Forum`, `ForumTopic`, `ForumPost`, `ForumLike` | ✅ PORTÉ | `app/academy/my-courses/[id]/forum/[topicId]/page.tsx` |
| **`Progress`** | 🟡 **SCHÉMA SEUL** | **0 usage** → aucun suivi de progression apprenant |
| **`Quiz`, `Question`, `Option`, `QuizAttempt`** | 🟡 **SCHÉMA SEUL** | **0 usage** → quiz de cours absents (le Quiz community est un autre système) |
| **`Resource`** | 🟡 **SCHÉMA SEUL** | **0 usage** → ressources de cours absentes |
| **`AIConversation`, `AIMessage`** | 🟡 **SCHÉMA SEUL** | **0 usage** → tuteur IA absent |
| **`BlogPost`** | 🟡 **SCHÉMA SEUL** | **0 usage** + aucune route `/blog` |

### 2.2 Pages (43)

| Pages source | Statut | Preuve dans community |
|---|---|---|
| `(auth)/login`, `signup`, `forgot-password`, `reset-password` | 🔁 REMPLACÉ | better-auth |
| `(public)/`, `courses`, `courses/[slug]`, `diplomas`, `paths`, `programme`, `programme/[slug]`, `contact` | ✅ PORTÉ | les 12 routes `/academy/*` + `/contact` |
| `(public)/about`, `(public)/business` | ⛔ MANQUANT | aucune route équivalente |
| **`(public)/blog`, `(public)/blog/[slug]`** | ⛔ **MANQUANT** | pas de route `/blog` |
| `(platform)/dashboard`, `notifications`, `profile`, `settings` | 🔁 REMPLACÉ | `/dashboard`, `/settings` |
| `(platform)/dashboard/certificates` | ✅ PORTÉ | `/academy/certificates` |
| `(platform)/dashboard/courses`, `courses/[id]` | ✅ PORTÉ | `/academy/my-courses`, `/academy/my-courses/[id]` |
| `(platform)/dashboard/courses/[id]/forum*` | ✅ PORTÉ | `/academy/my-courses/[id]/forum/[topicId]` |
| **`(platform)/dashboard/courses/[id]/viewer`** | ⛔ **MANQUANT** | pas de lecteur de leçon |
| `(platform)/dashboard/courses/new` | ✅ PORTÉ | `/academy/my-courses/new` |
| `onboarding` | 🔁 REMPLACÉ | `/onboarding` community |
| `(admin)/admin/users` | ✅ PORTÉ | `/admin/users` |
| **`(admin)/admin/courses` + `courses/[id]/builder`** | ⛔ **MANQUANT** | **éditeur de cours absent** |
| **`(admin)/admin/catalogs`, `programme`** | ⛔ **MANQUANT** | pas d'admin academy |
| **`(admin)/admin/maintenance`, `system/logs`, `logs`, `settings`** | ⛔ **MANQUANT** | — |
| `(admin)/admin/finance/revenues`, `finance/transactions`, `transactions`, `revenue`, `subscriptions` | 🗑️ ABANDON | monétisation **B2C** refusée par la vision (« jamais de paiement membre ») — et **aucun Stripe** dans le `package.json` source |

### 2.3 Server actions & lib

| Source | Statut | Preuve |
|---|---|---|
| `app/actions/course.ts`, `program.ts`, `content.ts`, `certificate.ts`, `contact.ts` | ✅ PORTÉ (partiel) | `app/actions/academy/` |
| **`app/actions/progress.ts`** | ⛔ MANQUANT | — |
| **`app/actions/quiz.ts`** (quiz de cours) | ⛔ MANQUANT | — |
| **`app/actions/resources.ts`** | ⛔ MANQUANT | — |
| **`app/actions/ai.ts`, `ai-tutor.ts`** | ⛔ MANQUANT | pas de `lib/ai.ts` dans community |
| **`app/actions/blog.ts`** | ⛔ MANQUANT | — |
| **`app/actions/builder.ts`** | ⛔ MANQUANT | éditeur de cours |
| `app/actions/notifications.ts`, `onboarding.ts`, `admin.ts`, `seo.ts`, `forum*` | 🔁 REMPLACÉ / partiel | mécanismes community |
| **`lib/ai.ts`** | ⛔ MANQUANT | tuteur IA (#364) |
| **`lib/google-drive.ts`, `media-utils.ts`** | ⛔ MANQUANT | médias (#363) |
| `lib/arcjet.ts` | 🗑️ ABANDON | community a son propre `lib/ratelimit.ts` (#365) |
| `lib/guards.ts`, `security.ts`, `auth.ts`, `auth-client.ts` | 🔁 REMPLACÉ | `lib/auth-guard.ts`, better-auth |

---

## 3. `hashcode_reboot` — Funnel / acquisition

### 3.1 Modèles Prisma (12)

| Modèle source | Statut | Preuve |
|---|---|---|
| `Member` | 🔁 REMPLACÉ | fusionné dans `User` + `Organization`/`Member` |
| `AnalyticsEvent` | ✅ PORTÉ **et utilisé** | `app/actions/acquisition/prospect.ts:144`, `consent.ts:54` |
| `AdminKey` | 🟡 SCHÉMA SEUL | **0 usage** — community gère ses clés via `BetaKey` (`app/api/admin/keys/route.ts`) |
| `AuditLog` | 🟡 SCHÉMA SEUL | absorbé sous `AdminAuditLog` → **0 usage** |
| `EmailEvent`, `MemberEmailLog` | 🟡 SCHÉMA SEUL | **0 usage** |
| `ProfilingDraft` | 🟡 SCHÉMA SEUL | **0 usage** — `/acquisition` a sa propre persistance (`app/actions/acquisition/*`) |
| `MemberSession` | 🟡 SCHÉMA SEUL | **0 usage** — à **supprimer du schéma** (prévu par `ROADMAP.md`) |
| `MemberBlacklist` | 🟡 SCHÉMA SEUL | **0 usage** |
| `Event`, `EventRsvp` | 🟡 SCHÉMA SEUL | **0 usage** + **aucune route `/events`** |
| `EmailProviderMetric` | 🟡 SCHÉMA SEUL | **0 usage** |

### 3.2 Pages (22)

| Pages source | Statut | Preuve |
|---|---|---|
| `/` (landing funnel) | ✅ PORTÉ | `app/acquisition/page.tsx` |
| `/login`, `/verify-email`, `/verify-otp` | 🔁 REMPLACÉ | better-auth |
| `/dashboard`, `/dashboard/profile`, `/dashboard/settings`, `/account` | 🔁 REMPLACÉ | `/dashboard`, `/settings` |
| `/profile/[id]` | 🔁 REMPLACÉ | `/u/[pseudo]`, `/talents` |
| **`/admin/*` (14 pages)** | ⛔ **MANQUANT** | #361 — voir détail ci-dessous |
| **`/dashboard/agenda`** | ⛔ MANQUANT | — |

Détail des 14 pages admin reboot : `admin`, `admin/activity`, `admin/audit-log`, `admin/blacklist`,
`admin/email-deliverability`, `admin/events`, `admin/exports`, `admin/invitations`,
`admin/marketing`, `admin/members`, `admin/settings`, `admin/stats`.

### 3.3 Routes API (~50) — ce qui manque

| Routes source | Statut |
|---|---|
| `auth/*`, `verify-email*`, `check-email`, `account/*` | 🔁 REMPLACÉ (better-auth) |
| `invite/accept`, `invite/refuse`, `invite/relance` | 🟡 PARTIEL — `app/invite/*` + `app/api/squad/invite` |
| `webhooks/resend` | ✅ PORTÉ — `app/api/webhooks/resend/` |
| `health` | ✅ PORTÉ — `app/api/status/` |
| **`cron/relance`, `cron/collect-metrics`, `cron/email-alerts`, `cron/keepalive`** | ⛔ **MANQUANT** (community a 10 autres crons) |
| **`admin/*` (≈15 routes : activity, audit-log, blacklist, cron-health, email-deliverability, invitations, keys, login, member-emails, stats, test-email, verify…)** | ⛔ **MANQUANT** |
| **`members`, `members/bulk`, `members/import`, `members/[id]/invite`, `members/[id]/share`** | ⛔ **MANQUANT** (pas d'import/bulk de membres) |
| **`profiling/draft`** | ⛔ MANQUANT |
| **`stats`, `stats/cohort`, `analytics`, `export`, `export/json`, `email-stats`** | ⛔ MANQUANT (community a `/api/admin/analytics/*`) |
| **`events`, `events/[id]`, `events/[id]/rsvp`, `events/notify-count`** | ⛔ MANQUANT |
| **`webhooks/brevo`** | ⛔ MANQUANT (seul Resend est câblé) |

### 3.4 `src/lib` (30 fichiers) — ce qui manque

| Source | Statut |
|---|---|
| **`sentry.ts` + dépendance `@sentry/nextjs` + `instrumentation.ts`** | ⛔ **MANQUANT** — reboot avait Sentry, **community non** (cf. `ROADMAP_PRODUCTION.md` §1.3) |
| `logging.ts`, `logging-client.ts` | 🔁 REMPLACÉ — `lib/logger.ts` |
| **`blacklist.ts`, `email-alerts.ts`, `email-metrics.ts`, `member-email-log.ts`** | ⛔ MANQUANT |
| **`events-validation.ts`** | ⛔ MANQUANT |
| **`storage-crypto.ts`** | ⛔ MANQUANT |
| `admin-auth.ts`, `admin-passcode.ts`, `admin-roles.ts`, `account-auth.ts`, `account-otp.ts` | 🔁 REMPLACÉ — better-auth + rôle `ADMIN`/`MODERATOR` |
| `rate-limit.ts`, `rate-limit-key.ts`, `body-limit.ts` | 🔁 REMPLACÉ — `lib/ratelimit.ts` |
| `mail.ts`, `verify-email.ts` | 🔁 REMPLACÉ — `lib/email.ts` |
| `analytics.ts`, `admin-audit.ts`, `account-data.ts`, `member-email-log.ts`, `profiling/` | 🟡 PARTIEL |
| `test-guard.ts`, `prisma-extensions.ts`, `health.ts`, `utils.ts`, `db.ts` | 🔁 REMPLACÉ |

---

## 4. `hashcode-community-portal` — Admin / pôles

> **Bloqué (#350)** : stack **Drizzle**, pas Prisma → aucune absorption directe possible.

### 4.1 Tables Drizzle (5)

| Table source | Statut | Destination Prisma |
|---|---|---|
| `users` | ✅ PORTÉ | `User` |
| `member_profiles` | ✅ PORTÉ | champs profil de `User` |
| `interests` | ✅ PORTÉ | `User.interests String[]` (`schema.prisma:196`) |
| `poles` | 🟡 PARTIEL | `Specialization` — concept voisin, mapping à valider |
| `communication_preferences` | 🟡 PARTIEL | `app/actions/acquisition/consent.ts` (consentement) |

### 4.2 Pages (14) et routes API (22)

| Source | Statut | Preuve / manque |
|---|---|---|
| `/auth/*` (magic-link, verify, verify-otp) | 🔁 REMPLACÉ | better-auth |
| `/members`, `/m/[id]` | 🔁 REMPLACÉ | `/admin/users`, `/u/[pseudo]` |
| `/onboarding` | ✅ PORTÉ | `/onboarding` |
| `/profile` | 🔁 REMPLACÉ | `/settings` |
| `/admin`, `/admin/analytics` | ✅ PORTÉ | `/admin`, `/admin/analytics` |
| `/admin/leaderboard` | 🔁 REMPLACÉ | `/leaderboard`, `/admin/squads` |
| **`/admin/points`** | ⛔ MANQUANT | pas de système de points dédié (XP community ≠ points portal) |
| **`/admin/trends`** | ⛔ MANQUANT | — |
| **`/admin/import`** | ⛔ MANQUANT | — |
| **`/admin/verify-identity`** | ⛔ MANQUANT | — |
| **`api/admin/poles`** | 🟡 PARTIEL | `app/api/admin/specializations/` |
| **`api/admin/members/[id]/poles`** | ⛔ MANQUANT | — |

---

## 5. Dette : 11 modèles absorbés mais **morts** (0 usage runtime)

Vérifié par recherche `prisma.<model>` dans `app/`, `lib/`, `components/` :

| Modèle | Origine | Usage | Décision à prendre |
|---|---|---|---|
| `MemberSession` | reboot | 0 | 🗑️ **supprimer du schéma** (déjà prévu par `ROADMAP.md` §0.11) |
| `AdminAuditLog` | reboot | 0 | à câbler (#305) ou supprimer |
| `LearningAuditLog` | hashskills | 0 | à câbler ou supprimer |
| `EmailProviderMetric` | reboot | 0 | 🗑️ supprimer (Resend seul est utilisé) |
| `MemberBlacklist` | reboot | 0 | à câbler ou supprimer |
| `ProfilingDraft` | reboot | 0 | à câbler ou supprimer |
| `Event`, `EventRsvp` | reboot | 0 | à câbler ou supprimer (aucune route `/events`) |
| `EmailEvent`, `MemberEmailLog` | reboot | 0 | à câbler ou supprimer |
| `AdminKey` | reboot | 0 | 🗑️ supprimer (`BetaKey` fait le job) |
| `Progress`, `Quiz`/`Question`/`Option`/`QuizAttempt`, `Resource`, `AIConversation`/`AIMessage`, `BlogPost` | hashskills | 0 | **à porter** (cf. §2) |

> **Règle :** un modèle en base sans consommateur = dette. Soit on le câble, soit on le supprime
> du `schema.prisma`. Le laisser « au cas où » est exactement le scénario que
> `VISION_UNIFIEE.md` §7 nomme « dispersion codebase ».

---

## 6. Checklist de décommissionnement

### Étape 0 — Prérequis (FAIT)
- [x] `hashcode-community` est la base unique (75 modèles, 1 auth, 1 déploiement)
- [x] Funnel reboot absorbé (`/acquisition`) — issue #368 fermée
- [x] Academy hashskills absorbée en lecture (`/academy`) — #349 fermée

### Étape 1 — Porter `hashskills` (≈1,5-2 semaines)
- [ ] Moteur de progression (`Progress`) — #: à créer
- [ ] Quiz de cours (`Quiz`/`Question`/`Option`/`QuizAttempt`)
- [ ] Ressources de cours (`Resource`)
- [ ] Lecteur de leçon (`dashboard/courses/[id]/viewer`)
- [ ] Admin academy : course builder + catalogs + programme
- [ ] Tuteur IA (`lib/ai.ts` + `AIConversation`/`AIMessage`) — #364
- [ ] Médias (`lib/google-drive.ts`) — #363
- [ ] Décider du sort de `BlogPost` + `/blog`

### Étape 2 — Porter `hashcode_reboot` admin (≈1 semaine)
- [ ] Admin missions/membres : invitations, import CSV, bulk — #361
- [ ] Blacklist, email-deliverability, audit-log, events, exports, stats
- [ ] Crons : `relance`, `collect-metrics`, `email-alerts`, `keepalive`
- [ ] **Sentry** (`@sentry/nextjs`) — `ROADMAP_PRODUCTION.md` §1.3
- [ ] Webhook Brevo (ou décider de rester Resend-only)

### Étape 3 — Débloquer `hashcode-community-portal` (≈1 semaine)
- [ ] Traduire les 5 tables Drizzle → Prisma (#350)
- [ ] Trancher `poles` vs `Specialization`
- [ ] Implémenter les 3 stubs « Module en construction » : ateliers, knowledge-hub, mentorat
- [ ] Décider du sort de `points`, `trends`, `import`, `verify-identity`

### Étape 4 — Nettoyage du schéma
- [ ] Supprimer ou câbler les 11 modèles morts (§5)

### Étape 5 — Archivage (UNIQUEMENT quand 1-4 sont clos)
- [ ] `hashskills` → GitHub **Archive repository** (jamais supprimer)
- [ ] `hashcode_reboot` → Archive
- [ ] `hashcode-community-portal` → Archive
- [ ] Ajouter au `README.md` de chaque source archivée un lien vers ce document

---

## 7. Abandons volontaires (décisions assumées, à ne PAS porter)

| Élément abandonné | Source | Raison |
|---|---|---|
| `finance/*`, `transactions`, `revenue`, `subscriptions` | hashskills | monétisation **B2C** — `VISION_UNIFIEE.md` §5 : « jamais de paiement membre » |
| `User`/`Session`/`Account`/`Verification`/`Notification` | hashskills | doublons better-auth |
| `Member` | reboot | fusionné dans `User` + `Organization`/`Member` |
| `admin-passcode`, `account-otp`, `account-auth` | reboot | remplacés par better-auth |
| `rate-limit*`, `body-limit` | reboot | remplacés par `lib/ratelimit.ts` |
| `arcjet` | hashskills | #365 — un seul système de rate limiting |
| `auth/*` (magic-link, OTP) | portal | remplacés par better-auth |
| `members`, `m/[id]`, `profile`, `admin/leaderboard` | portal | déjà couverts par `/admin/users`, `/u/[pseudo]`, `/settings`, `/leaderboard` |
| `frontend`/`backend` de profilage | — | hors périmètre (repos séparés non comptés dans les 4) |

---

## 8. Comment revérifier ce document

```bash
# 1. Un modèle est-il consommé ?
grep -rl "prisma\.<model>" app lib components | wc -l        # 0 = mort

# 2. Un modèle est-il consommé par relation (include) ?
grep -rn "include:" -A5 app/academy | grep -i "<relation>"

# 3. Inventaire des pages d'un dépôt source
cd /chemin/vers/source && find app -name "page.tsx" | sort

# 4. Inventaire des routes API d'un dépôt source
cd /chemin/vers/source && find app -name "route.ts" | sort

# 5. Le gate doit rester vert après tout portage
cd hashcode-community && npm run verify
```

## 9. Limites de cette vérification

- Analyse **statique** uniquement : aucun des 3 dépôts sources n'a été exécuté.
  Un statut ⛔ signifie « **aucun équivalent trouvé** », pas une preuve d'inexistence.
- Les modèles dits « morts » sont détectés par recherche de `prisma.<model>`. Un accès
  via relation (`include`) ou via SQL brut échapperait au test — vérifié manuellement
  pour `Content` et `Section` (faux positifs corrigés), pas pour les 11 autres.
- `ROADMAP_PRODUCTION.md` affirme que `Guild`/`GuildMember` existent dans le schéma :
  **c'est faux** (aucun modèle `Guild` dans les 75). Ne pas s'y fier.
- `ROADMAP.md` contient une section « 🟡 EN COURS (NOW) » périmée qui contredit
  ses propres tableaux « ✅ Terminé ».

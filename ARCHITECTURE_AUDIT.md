# Analyse Architecturale — JoinHashCode

> **Rôle :** Staff Engineer  
> **Périmètre :** Architecture complète (Next.js 16, Prisma 7, PostgreSQL, Better Auth, Redis)  
> **Date :** 22 juin 2026  
> **Version cible :** 2.6.3

---

## 1. Analyse de Nécessité par Composant

### 1.1 Infrastructure / Base

| Composant             | Auj. | 100 |       1 000        | 10 000 | Note                                                                |
| --------------------- | :--: | :-: | :----------------: | :----: | ------------------------------------------------------------------- |
| Next.js 16 App Router | Oui  | Oui |        Oui         |  Oui   | Choix standard                                                      |
| Prisma 7 + PostgreSQL | Oui  | Oui |        Oui         |  Oui   | PostgreSQL bien indexé tient plusieurs milliers d'utilisateurs seul |
| TailwindCSS v4        | Oui  | Oui |        Oui         |  Oui   | —                                                                   |
| Redis (Upstash)       | Non  | Non | Cache + rate limit |  Oui   | Inutile avant d'avoir identifié un goulet d'étranglement précis     |
| Docker (VPS)          | Oui  | Oui |        Oui         |  Oui   | —                                                                   |
| Resend + Storage      | Oui  | Oui |        Oui         |  Oui   | Seules dépendances externes critiques                               |

**Principe :** PostgreSQL bien architecturé (index, requêtes optimisées, cache HTTP) tient plusieurs milliers d'utilisateurs. Le problème n'est jamais le nombre d'utilisateurs — ce sont les N+1, les cron mal conçus, les calculs synchrones, les dashboards à 15 jointures. Tant qu'on n'a pas identifié un goulet précis, on n'ajoute pas Redis.

### 1.2 Auth Layer (Better Auth)

| Composant                        |  Auj.   |   100   |  1 000  |  10 000   | Note                                                                                                                                                                               |
| -------------------------------- | :-----: | :-----: | :-----: | :-------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google OAuth                     |   Oui   |   Oui   |   Oui   |    Oui    | —                                                                                                                                                                                  |
| GitHub OAuth                     | **Non** | **Non** | **Non** |  **Non**  | < 5 % des inscriptions ? Pas de features GitHub (portfolio, contributions, repos). Chaque provider OAuth = code + tests + cas d'erreur + maintenance.                              |
| Magic Link (Resend)              |   Oui   |   Oui   |   Oui   |    Oui    | —                                                                                                                                                                                  |
| Email OTP                        |   Oui   |   Oui   |   Oui   |    Oui    | —                                                                                                                                                                                  |
| **Passkeys (WebAuthn)**          | **Non** | **Non** | **Non** |  **Non**  | Technologie excellente mais que la majorité des utilisateurs ne comprend pas. Complexifie l'auth sans valeur pour le MVP. Google OAuth + Magic Link + OTP est largement suffisant. |
| **2FA (TOTP)**                   | **Non** | **Non** | **Non** | **V2/V3** | Pertinent pour admins et modérateurs, pas pour l'utilisateur standard. Coût cognitif > bénéfice.                                                                                   |
| Middleware session cache (Redis) |   Non   |   Non   |   Non   |    Oui    | Cache JWE de 5 min déjà suffisant jusqu'à preuve du contraire                                                                                                                      |

**Décisions immédiates :**

- GitHub OAuth → supprimer maintenant. Réintroduire si l'usage le justifie.
- Passkeys → supprimer maintenant. Pas de valeur MVP.
- 2FA → déplacer en V2/V3.

### 1.3 Rate Limiting

| Approche                     | Auj. | 100 | 1 000 | 10 000 | Note                                                           |
| ---------------------------- | :--: | :-: | :---: | :----: | -------------------------------------------------------------- |
| In-memory (MemoryLimiter)    | Oui  | Oui |  Non  |  Non   | Suffisant jusqu'à plusieurs milliers de req/s                  |
| Upstash/Redis (RedisLimiter) | Non  | Non |  Oui  |  Oui   | Ne pas supprimer — mettre en veille avec une interface commune |

**Architecture recommandée :**

```text
RateLimiter Interface
      ↓
MemoryLimiter (maintenant)
      ↓
RedisLimiter (plus tard, quand le besoin est prouvé)
```

On conserve l'extensibilité sans maintenir Redis aujourd'hui. Le rate limiting ne doit jamais être fail-closed — au pire, on laisse passer.

### 1.4 API Routes

| Route                                                                             |  Auj.   | 100  | 1 000 | 10 000 | Note                                |
| --------------------------------------------------------------------------------- | :-----: | :--: | :---: | :----: | ----------------------------------- |
| **User (8 routes)**                                                               |         |      |       |        |                                     |
| `GET /api/user/me`                                                                |   Oui   | Oui  |  Oui  |  Oui   |                                     |
| `PATCH /api/user/update`                                                          |   Oui   | Oui  |  Oui  |  Oui   |                                     |
| `POST /api/user/checkin`                                                          |   Oui   | Oui  |  Oui  |  Oui   | Heartbeat                           |
| `DELETE /api/user/delete`                                                         |   Oui   | Oui  |  Oui  |  Oui   | GDPR                                |
| `POST /api/user/avatar`                                                           |   Oui   | Oui  |  Oui  |  Oui   |                                     |
| `GET /api/user/export`                                                            |   Oui   | Oui  |  Oui  |  Oui   | GDPR                                |
| `GET /api/user/notifications`                                                     |   Non   | Oui  |  Oui  |  Oui   | Notifications simples               |
| `GET /api/user/quiz-status`                                                       |   Oui   | Oui  |  Oui  |  Oui   |                                     |
| **Squad (16 routes → 5 gardées)**                                                 |         |      |       |        |                                     |
| `POST /api/squad/create`                                                          | **Oui** | Oui  |  Oui  |  Oui   | ★ Gardé                             |
| `POST /api/squad/join`                                                            | **Oui** | Oui  |  Oui  |  Oui   | ★ Gardé                             |
| `POST /api/squad/invite`                                                          | **Oui** | Oui  |  Oui  |  Oui   | ★ Gardé                             |
| `GET /api/squad/members`                                                          | **Oui** | Oui  |  Oui  |  Oui   | ★ Gardé                             |
| `GET /api/squad/public`                                                           | **Oui** | Oui  |  Oui  |  Oui   | ★ Gardé                             |
| `POST /api/squad/leave`                                                           |   Non   | Gelé | Gelé  |  Oui   |                                     |
| `POST /api/squad/disband`                                                         |   Non   | Gelé | Gelé  |  Gelé  | Admin seulement                     |
| `PATCH /api/squad/update`                                                         |   Oui   | Gelé | Gelé  |  Oui   |                                     |
| `POST /api/squad/transfer`                                                        |   Non   | Gelé | Gelé  |  Gelé  |                                     |
| `POST /api/squad/join-request`                                                    |   Non   | Gelé | Gelé  |  Gelé  |                                     |
| `POST /api/squad/join-request/respond`                                            |   Non   | Gelé | Gelé  |  Gelé  |                                     |
| `PATCH /api/squad/member/update-role`                                             |   Non   | Gelé | Gelé  |  Gelé  |                                     |
| `POST/GET /api/squad/message`                                                     |   Non   | Gelé | Gelé  |  Gelé  | Chat squad = websocket, pas REST    |
| `GET /api/squad/leaderboard`                                                      |   Non   | Gelé | Gelé  |  Gelé  |                                     |
| `POST /api/squad/suggest-move`                                                    |   Non   | Gelé | Gelé  |  Gelé  | Jamais utilisé                      |
| `GET /api/squad/activity`                                                         |   Oui   | Gelé | Gelé  |  Oui   |                                     |
| **Missions (5 routes)**                                                           |         |      |       |        |                                     |
| `GET /api/missions`                                                               |   Oui   | Oui  |  Oui  |  Oui   |                                     |
| `POST /api/missions`                                                              |   Oui   | Oui  |  Oui  |  Oui   |                                     |
| `POST /api/missions/[id]/review`                                                  |   Oui   | Oui  |  Oui  |  Oui   | Validation admin pour l'instant     |
| `POST /api/missions/[id]/claim`                                                   |   Oui   | Oui  |  Oui  |  Oui   |                                     |
| `GET /api/missions/[id]/retrospective`                                            |   Non   | Non  |  Non  |  Oui   | Feature flag OFF. Dead code.        |
| **Cron (5 routes → 0 maintenant)**                                                |         |      |       |        |                                     |
| squad-decay                                                                       |   Non   | Non  |  Non  |  Oui   | Pas de squads actifs → pas de decay |
| release-claims                                                                    |   Non   | Non  |  Non  |  Oui   |                                     |
| check-activity                                                                    |   Non   | Non  |  Non  |  Oui   |                                     |
| onboarding-drip                                                                   |   Non   | Non  |  Non  |  Oui   | Email marketing trop tôt            |
| purge-data                                                                        |   Non   | Non  |  Non  |  Oui   |                                     |
| **Admin (14 routes)**                                                             |         |      |       |        |                                     |
| Garder : users (list/export), submissions (list/approve/reject), feedback, status |   Oui   | Oui  |  Oui  |  Oui   |                                     |
| Geler : squads/transfer, squads/disband, broadcast, keys, log avancé              |   Non   | Non  |  Oui  |  Oui   |                                     |

### 1.5 Modèles de Données

| Modèle                                         | Décision                              | Raison                                                                                     |
| ---------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| User (55+ champs)                              | **Refactor avant 500**                | Trop large. Extraire Psychometric + EngagementStats + UserSocials en relations ou en JSON. |
| Psychometric                                   | **Fusionner dans User ou QuizResult** | Les scores sont un instantané du quiz, pas une entité séparée.                             |
| UserProgress                                   | **Fusionner dans User**               | level + experience = 2 champs, pas un model.                                               |
| UserSecurity                                   | **Fusionner dans User**               | banned (boolean) + 2FA (nullable). 3 champs ≠ un model.                                    |
| UserReferral                                   | **Fusionner dans User**               | referralCode + referrerId.                                                                 |
| EngagementStats                                | **Fusionner dans User**               | 5 champs de streak.                                                                        |
| UserBeta, BetaKey, BetaFeedback                | **Supprimer après launch**            | Beta fermée.                                                                               |
| SquadMessage                                   | **Supprimer/Geler**                   | Chat squad prématuré.                                                                      |
| JoinRequest                                    | **Supprimer/Geler**                   | Squads privés pas avant la V2.                                                             |
| XpTransaction                                  | **Supprimer**                         | UserProgress.experience + ActivityLog suffisent.                                           |
| TwoFactor                                      | **Supprimer (V2)**                    | Pas avant modération à taille.                                                             |
| Passkey                                        | **Supprimer**                         | Jamais utilisé.                                                                            |
| Guild, GuildMember                             | **Supprimer**                         | Feature flag OFF depuis le début.                                                          |
| TeamApplication                                | **Supprimer**                         | Dead code.                                                                                 |
| **Squad simplifié**                            |                                       |                                                                                            |
| `Squad` → `{ id, name, description, ownerId }` | **Réduire immédiatement**             | On n'a pas besoin de plus aujourd'hui.                                                     |
| `SquadMember` → `{ userId, squadId, role }`    | **Garder**                            | role = "leader" ou "member".                                                               |

---

## 2. Les Trois Maladies de Croissance de HashCode

### 2.1 Feature Inflation

On construit :

```text
Guilds
Squads (complets avec chat, leaderboard, rôles, requests)
Founder Lab
Academy
Labs
Knowledge Hub
Portfolio
Missions (15 avec briefings de 100 lignes)
Analytics
IA
Recommandations
Peer review distribué
Badges (22 définitions)
Weekly challenges
Rétrospectives
Évolution comportementale
```

avant d'avoir validé :

> **Pourquoi un utilisateur revient-il chaque semaine ?**

### 2.2 Architecture Inflation

On prépare déjà :

```text
Redis
QStash / Upstash
Cron complexes (5 crons différents)
Caches multiples (middleware cache, user-cache, feature flags)
Pipelines de scoring
Système d'évolution comportementale
Service layer séparé
```

alors que :

```text
2 vCPU
8 Go RAM
quelques dizaines de bêta-testeurs
```

ne l'exigent absolument pas.

### 2.3 Process Inflation

On crée des workflows pensés pour :

```text
5 000 utilisateurs
```

alors que le vrai défi est encore :

```text
faire revenir 50 utilisateurs demain.
```

---

## 3. Périmètre Produit Réel

### Must Have (maintenant)

- Onboarding (situation, pays, objectif)
- Quiz psychométrique + archétypes (Builder, Creator, Strategist, Catalyst)
- Missions (soumettre, validation admin)
- Dossier public (profil visible)
- Notifications simples (in-app)
- Squads minimalistes (create, join, invite, members, public)

### Should Have (bientôt)

- Badges essentiels
- Cartes de profil
- Invitations / referral basique

### Future (V2 / V3)

- Peer-review distribué
- Analytics avancées
- IA / recommandations
- Chat temps réel
- Scoring comportemental complexe
- Weekly challenges
- Guildes thématiques

---

## 4. La Question Avant Chaque PR

```
Cette fonctionnalité aide-t-elle un utilisateur
à apprendre,
à accomplir une mission,
ou à partager son dossier ?

Si la réponse est non,
elle n'entre probablement pas dans le MVP.
```

Cette seule règle éliminerait la moitié de la complexité actuelle.

---

## 5. Architecture Minimale Viable (MVA) — Launch

```
Next.js
    ↓
Prisma
    ↓
PostgreSQL
    ↓
Resend
    ↓
Storage
```

**Et c'est tout.**

Pas de :

- Redis obligatoire
- Microservices
- Queue distribuée
- Websocket
- Graph database
- Machine learning
- Caches multiples
- Crons programmés
- Feature flags dynamiques

### Stack MVA

| Technologie            | Rôle                     |
| ---------------------- | ------------------------ |
| Next.js 16             | Framework fullstack      |
| Prisma 7               | ORM + migrations         |
| PostgreSQL             | Base de données unique   |
| Resend                 | Emails transactionnels   |
| Docker                 | Déploiement VPS          |
| In-memory rate limiter | Anti-brute-force basique |

### Modèles MVA

```
User (30 champs — fusionner UserProgress, EngagementStats, UserSocials dedans)
Session, Account, Verification (Better Auth)
QuizResult
Mission (seed DB, 5 missions max)
MissionSubmission
Squad (id, name, description, ownerId)
SquadMember (userId, squadId, role)
ActivityLog
ContactMessage
Notification
```

### Routes API MVA

```
POST /api/auth/[...all]        ★ Better Auth
GET  /api/user/me              ★ Profil
PATCH /api/user/update         ★ Édition profil
POST /api/user/checkin         ★ Daily check-in
POST /api/onboarding           ★ Onboarding
GET  /api/missions             ★ Lister missions
POST /api/missions             ★ Soumettre mission
POST /api/missions/[id]/claim  ★ Claim submission
POST /api/squad/create         ★ Créer squad
POST /api/squad/join           ★ Rejoindre squad
POST /api/squad/invite         ★ Inviter membre
GET  /api/squad/members        ★ Liste membres
GET  /api/squad/public         ★ Infos publiques squad
GET  /api/user/notifications   ★ Notifications
POST /api/contact              ★ Formulaire contact
GET  /api/status               ★ Health check
```

### Pages MVA

```
/ (landing)
/signin
/onboarding (multi-step)
/quiz
/dashboard (accueil post-quiz + missions)
/u/[pseudo] (dossier public)
/settings (profil)
/squad (page squad simplifiée)
```

---

## 6. Architecture Recommandée à 1 000 Membres

```
Next.js
    ↓
PostgreSQL (toujours)
    ↓
Redis (cache + rate limit — uniquement si besoin prouvé)
    ↓
Resend
    ↓
Storage
```

**Ajouts :**

- Redis pour cache de session + rate limit distribué (seulement si un goulet est identifié)
- Cache HTTP (CDN ou Cache-Control) pour pages publiques
- Indexation PostgreSQL supplémentaires
- Un cron (check-activity)
- Notifications enrichies
- Squad update + leave

**Refactoring requis avant 1 000 :**

- Splitter User model (extraire progression + engagement)
- Extraire les templates email de `email.ts` (828 lignes) vers des fichiers `.tsx` séparés
- Décomposer AppSidebar (361 lignes)
- Décomposer AdminDashboard (489 lignes)
- Unifier XP_THRESHOLDS / LEVEL_THRESHOLDS

---

## 7. Architecture Recommandée à 10 000 Membres

```
Next.js
    ↓
Redis (cache + rate limit + sessions)
    ↓
PostgreSQL (read replicas)
    ↓
Background Jobs (queue)
    ↓
Observability (logging, tracing, metrics)
    ↓
CDN (assets, pages statiques)
    ↓
Resend
    ↓
Storage
```

**Ajouts :**

- Background jobs pour les opérations lourdes
- Observabilité structurée (logs, métriques, tracing)
- CDN pour assets statiques
- Read replicas PostgreSQL
- Rate limiting Redis obligatoire
- Cache distribué
- Crons programmés (decay, purge, reminders)
- 2FA pour admins/mods
- Peer review distribué
- Chat temps réel (websocket)
- Analytics produit

---

## 8. Synthèse des Actions Immédiates

### Supprimer maintenant (dead code / zéro valeur)

| Élément                                                                 | Fichiers impactés                                                         |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| GitHub OAuth                                                            | `auth.ts`, `auth-client.ts`                                               |
| Passkeys (plugin + composant)                                           | `package.json`, auth plugins, `PasskeySetup.tsx`                          |
| Guild, GuildMember (models + code)                                      | `schema.prisma`, tous les `isFeatureEnabled("guilds")`                    |
| Feature flags morts (guilds, badges, weekly challenges, retrospectives) | `features.ts`, tous les appels -- pas juste les cacher, supprimer le code |
| `SquadMessage` (model + routes)                                         | `schema.prisma`, route files, composants                                  |
| `JoinRequest` (model + routes)                                          | `schema.prisma`, route files                                              |
| `XpTransaction` (model)                                                 | `schema.prisma`                                                           |
| `TeamApplication` (model)                                               | `schema.prisma`                                                           |
| `TwoFactor` (model)                                                     | `schema.prisma`                                                           |
| `Psychometric` (model)                                                  | `schema.prisma` -- fusionner les champs dans User                         |
| `UserSecurity` (model)                                                  | `schema.prisma` -- fusionner dans User                                    |
| `UserReferral` (model)                                                  | `schema.prisma` -- fusionner dans User                                    |
| `UserBeta`, `BetaKey`, `BetaFeedback` (models)                          | `schema.prisma` -- après launch                                           |
| `@fingerprintjs/fingerprintjs`                                          | `package.json`                                                            |
| `react-use`                                                             | `package.json`                                                            |

### Geler / Mettre en veille

| Élément                                       | Condition de dégel                  |
| --------------------------------------------- | ----------------------------------- |
| Redis / Upstash                               | Goulet d'étranglement prouvé        |
| Crons (5 routes)                              | Squads actifs + volume significatif |
| Squad : leave, disband, transfer, update-role | Demande utilisateur                 |
| Squad : join-request, respond                 | Squads privés nécessaires           |
| Squad : leaderboard                           | Assez de squads concurrents         |
| Squad : message                               | Besoin de chat prouvé               |
| Squad : activity                              | Demande utilisateur                 |
| Squad : suggest-move                          | Jamais -- supprimer                 |
| Weekly challenges                             | Feature validée                     |
| Badges engine                                 | Feature validée                     |
| Rétrospectives                                | Feature validée                     |
| Peer review distribué                         | Scale nécessaire                    |
| AI / recommandations                          | Scale + data nécessaires            |
| Chat temps réel                               | Besoin prouvé                       |
| 2FA                                           | V2/V3 produit                       |

### Refactorer rapidement

| Action                                                    | Priorité |
| --------------------------------------------------------- | :------: |
| Unifier les 3 systèmes de scoring en 1 pipeline           |    P0    |
| Remplacer rate-limiting Upstash/Redis par MemoryLimiter   |    P0    |
| Fusionner XP_THRESHOLDS / LEVEL_THRESHOLDS                |    P1    |
| Extraire templates email de `email.ts` (828 lignes)       |    P1    |
| Décomposer AppSidebar (361 lignes)                        |    P1    |
| Décomposer AdminDashboard (489 lignes)                    |    P1    |
| Réduire missions statiques à 5, seed en DB                |    P1    |
| Simplifier squad (5 routes, 2 models)                     |    P1    |
| Réduire User model (fusionner petits models)              |    P1    |
| Supprimer `after.ts`, `cache.ts` (abstractions triviales) |    P2    |
| Supprimer `recharts` si remplacement léger trouvé         |    P3    |

---

## 9. Résumé Chiffré

| Métrique           |  Actuel   |  MVA  | Économie |
| ------------------ | :-------: | :---: | :------: |
| Routes API         |    58     |  16   |  −72 %   |
| Modèles Prisma     |    23     |  11   |  −52 %   |
| Composants         |    149    | −50 % |  −50 %   |
| Dépendances prod   |    73     |  ~50  |  −30 %   |
| Feature flags      | 7 (6 OFF) |   0   |  100 %   |
| Lignes email.ts    |    828    | ~150  |  −82 %   |
| Lignes missions.ts |    841    | ~100  |  −88 %   |
| Crons              |     5     |   0   |  100 %   |
| Redis obligatoire  |    Oui    |  Non  | Éliminé  |

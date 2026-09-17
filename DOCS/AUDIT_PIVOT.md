# AUDIT_PIVOT.md — Audit code vs nouvelle vision « Pipeline Cyber »

> **Date :** 17 septembre 2026 — double audit parallèle (routes/actions/API + schéma/libs)
> **Méthode :** inventaire statique falsifiable (comptages réels, chemins réels), lecture seule
> **Références :** `DOCS/PIVOT_CYBER.md` (la vision), EPIC #372, Vague 1 #373, Vague 5 #377
> **Résumé chiffré :** 264 fichiers sous `app/` (~38 700 lignes) + 64 modèles Prisma + 71 libs

---

## 0. Verdict global

| Bac | Verdict |
|---|---|
| 🟢 **NOYAU à garder** | ~24 modèles Prisma · missions/reviewer/academy/dossier/talents/quiz-réduit + INFRA complète |
| 🟡 **GELER** (données conservées) | ~30 modèles · squads/gamification/multi-domaines/admin générique |
| 🔴 **DROP-CANDIDAT (0 usage prod)** | 10 modèles (mais **7 bloqués par des FK depuis le noyau**) |

**Le point le plus important de l'audit : il n'existe PAS de séparation propre aujourd'hui.**
Le code de la vieille vision est ** cousu dans le noyau** à 8 endroits. Toute suppression
commence par du **découplage**, pas de la suppression.

---

## 1. ⚠️ Les 8 dépendances croisées bloquantes (l'ordre de bataille)

| # | Couplage | Où | Traitement en Vague 1 |
|---|---|---|---|
| **D1** | `app/api/missions/[id]/review/route.ts` (**PIPELINE**) importe `updateSquadCohesion` (`lib/squad-logic` — GELER) | review de mission récompense la cohésion de squad | Retirer l'appel + le bloc cohésion |
| **D2** | `lib/experience.ts` (`awardXp`, **GELER**) appelé par **missions ×4, admin submissions, admin attempts** (PIPELINE) + `api/onboarding` (INFRA) | XP au submit/approve | Découpler : retirer `awardXp` des flows pipeline (le scoring par critères `criteria-score.ts` reste), remplacer par log d'activité |
| **D3** | `lib/evolution-engine.ts` (**GELER**) importé par `api/admin/submissions/[id]`, `api/missions/[id]/review`, `admin/core`, `admin/feedback` | vectors comportementaux | Retirer les imports + l'UPDATE du champ `behavioralVibrancy` |
| **D4** | `components/dashboard/xp-growth-chart.tsx` (**GELER**) importé par `dossier-view.tsx` (**PIPELINE**) | portfolio | Remplacer par une carte "evidences" (brique V3) |
| **D5** | `dashboard-shell.tsx` importe `SquadBanner`, `WeeklyChallengeWidget`, `AmbassadorGoal`, `ReferralCard`, `level-utils`, type `Mission` | shell INFRA | Purger les imports gamification du shell (garde `MissionHistory`, réutilisable Labs) |
| **D6** | `app-sidebar.tsx` (**INFRA**) importe `SidebarSquad` + nav vers `/ateliers`, `/guide` (GELER) | nav | Retirer entrées gelées ; nav : Parcours → Labs → Portfolio → Vivier |
| **D7** | `components/settings/expertise-diagnostic.tsx` (**INFRA**) importe `TECH_TREE`/`SPECIALIZATION_QUIZ` (`lib/tech-tree*` — GELER, 12 domaines) | settings | Remplacer par le choix de voie SOC/OSINT (2 voies) |
| **D8** | `lib/auth.ts` active le **plugin `organization` de better-auth** → active `Organization/Member/Invitation/JoinRequest` | si squads meurent, plugin à désactiver **ou** convertir en "promotions" | **Décision à trancher** (voir §5) |

---

## 2. SCHÉMA PRISMA — 64 modèles → cible ~25

### 🟢 NOYAU conservé (24)
`User, Session, Account, Verification` (better-auth) · `Mission→Lab, MissionSubmission, MissionStep, MissionAttempt, MissionStepResponse` (**précurseur direct d'Evidence**), `MissionReviewLog` (→ fusionnable ActivityLog) · `Course, Section, Content, Enrollment, Progress, Certificate` (parcours — Section/Content/Progress accédés via `include`, **ne pas classifier 0-usage trop vite**) · `Program, ProgramPhase, Pillar` (préfiguration Path/PathLevel) · `Badge` · `Notification, ActivityLog, AnalyticsEvent`

### 🟡 GELER — données conservées, code retiré (30)
- **Bloc better-auth org (⚠️ D8)** : `Organization (43 refs/22 fichiers), Member (50 refs/32), Invitation, JoinRequest, SquadMessage` — **bloqués par le plugin better-auth actif**
- Gamification : `DailyCheckin, XpTransaction, QuizResult+QuizFeedback` (câblés à `User.class` — geler les données, re-cibler le contenu), `MissionReview` (ancien système, FK depuis MissionSubmission → **geler sans dropper**), `MissionSnapshot, MissionWebhook, MissionAssignment, ProfileV1` (FK depuis Mission/Attempt — SetNull, droppables moyennant migration)
- Hors vision : `BetaFeedback, BetaKey, ContactMessage, XPollResponse, Atelier, ProfileContent, Specialization, KnowledgeArticle, Intervention+Attendee, MentorProfile+MentorMatch, Forum/Topic/Post/Like` (forum câblé — geler, FK depuis Course)

### 🔴 DROP-CANDIDATS (10, tous 0 usage prod) — avec leurs FK bloquantes
`AIConversation` (FK **depuis Course**) + `AIMessage` · `BlogPost` (rel. **User**) · `CourseQuiz` (FK **Content @unique**) + `CourseQuestion` + `CourseOption` + `CourseQuizAttempt` · `Resource` (FK **Course**) · `Category` (FK **Course**) + `Tag` (m2m **Course**)

> 7/10 exigent **une édition du côté noyau** (Course/Content/User) avant drop — c'est un
> travail de schéma réel, pas un simple `db push`.

### Champs User — verdict par groupe
| Groupe | Champs | Verdict |
|---|---|---|
| Psychométrie | `builderScore`…`catalystScore` (48 refs chacun) | GELER — produisent `User.class` (qui **reste NOYAU**, 515 refs) → remplacer par scoring cyber unique |
| Gamification | `currentStreak, longestStreak, lastCheckinAt, lastStreakDate, xp, missionsCompletedCount, badges[]` | GELER (câblés partout — découplage D2 d'abord) |
| Referral/J7 | `referralCode/Count, referrerId, j7Activated` | GELER (câblés funnel + dossier + talents) |
| Carte | `behavioralVibrancy, cardSignature/Tier/IssuedAt` | GELER |
| **0 usage → DROP direct** | `interests, experienceLevel, onboarded` | drop sans risque |
| NOYAU conservé | identité, `class, role, city, country, pseudo, bio, domains, primaryDomain, technicalLevel, memberNumber, talentVisible, github/portfolio/linkedin/twitter URLs, beta*, twoFactor*, language…` | — |

---

## 3. ROUTES & CODE par bac (l'audit routes en résumé)

### 🟢 PIPELINE confirmé (déjà en place, plus gros qu'attendu — bonne surprise)
`app/missions/*` (1 268 l.) + `app/api/missions/*` (1 204 l.) + `app/admin/missions/*` (4 300 l.) + `app/api/admin/missions/*` (3 300 l.) — **le moteur Labs existe déjà à ~80 %** · `app/reviewer/*` · `app/academy/*` (2 290 l.) · `app/dossier` · `app/talents` + `app/u/[pseudo]` · quiz (`lib/questions`+`analysis`+`profile-content` réutilisables pour le mini-diagnostic) · 5 crons Labs (deadlines, SLA, publication)

### 🟢 INFRA conservé
auth complet, `acquisition/*` (funnel, autonome), `settings`, `api/user/*` (12 routes), feedback, contact, SEO/OG/sitemap, webhooks, status, reactivate, offline/maintenance, `admin/{users,activity,feedback,notifications,analytics}`, crons `onboarding-drip/check-activity/purge-data`

### 🟡 GELER (~14 000 lignes)
`app/squad/*` (1 206) + `api/squad/*` (1 149) + 13 composants squad · `leaderboard` (169) · `guide` (1 920) · `specialization` + `lib/tech-tree*` · `lib/experience/badge-engine/level-utils/evolution-engine/activation-funnel/ateliers` · widgets dashboard (check-in, streak, challenge, radar, welcome-modal, first-day) · `admin/{squads,core,fraud,mentorat,interventions,knowledge-hub}` + APIs · 7 templates email gamification · crons `squad-decay/reset-streaks` · `checkin` API

### 🟠 INCERTAIN — à trancher en Vague 1
`/invite/[slug]` (funnel OK mais **destination = join squad** — rediriger vers le parcours sans squads) · `api/feed` (consommé par AdminLiveFeed + landing hero) · `admin/contenus` (édite `lib/profile-content` PIPELINE — **garder si le mini-diagnostic garde les pages-résultat**) · `admin/parcours` (potentiel pilotage pipeline — à inspecter) · `api/referral` + widgets (sort de vision mais câblé à User) · `admin/keys` · `lib/academy/gamification.ts` (**orphan, 0 importeurs** — drop direct possible)

### ⚠️ Orphelins détectés (bonus audit)
- `app/api/public/talent/route.ts` : **0 consommateur dans le code** (route orpheline)
- `lib/academy/gamification.ts` + `lib/badge-engine` partiellement orphelins
- `User.interests, experienceLevel, onboarded` : champs morts

---

## 4. Dépendances (package.json) — extrait utile
Rien de majeur identifié comme mono-usage gamification ; les dépendances lourdes sont partagées. Le vrai levier de simplification est le **découplage D1-D8**, pas `package.json`.

---

## 5. Décision à trancher : le plugin better-auth `organization` (D8)

Deux options pour les squads :
- **Option A (recommandée) — Promotions** : le plugin org devient la structure des **cohortes de formation** (une promotion = Organization ; l'apprenant = Member). Zéro migration, le pivot réutilise le socle. `/squad/*` gèle, un futur `/promotions` le remplace.
- **Option B — Suppression complète** : désactiver le plugin + dropper 5 modèles + débrancher 22 fichiers. Coût élevé, gain faible maintenant.

**Reco : Option A en Vague 1-4, revisiter en Vague 5.**

---

## 6. Séquence d'exécution consolidée (Vague 1 concrète)

```
ÉTAPE 1 — Découplage (sans rien supprimer)
  D1  missions/review : retirer squad-logic          (~30 min)
  D2  retirer awardXp de missions/submissions/onboarding   (~2 h)
  D3  retirer evolution-engine des 4 importeurs       (~1 h)
  D4  dossier-view : masquer xp-growth-chart          (~30 min)
  D5  dashboard-shell : purger widgets gamification   (~2 h)
  D6  app-sidebar : retirer SidebarSquad + nav gelée  (~1 h)
  D7  settings : expertise-diagnostic → 2 voies       (~2 h)
  D8  option Promotions (désactivation route squads, garder plugin) (~1 h)
  → npm run verify doit rester VERT à chaque sous-étape

ÉTAPE 2 — Gel visible
  Nav réorientée (Parcours/Labs/Portfolio/Vivier en tête)
  Routes gelées → page "En refonte — pivot Pipeline Cyber" (ou direct 404 pour admin morts)

ÉTAPE 3 — Amendement docs
  PRODUCT_VISION.md réécrit (pipeline cyber) · ROADMAP.md réécrit (jalons §9 PIVOT_CYBER)
  ROADMAP §4 ÉLIMINÉ mis à jour · DOCS/DECISIONS.md AMI pivot · ABSORPTION.md réduite au périmètre cyber

ÉTAPE 2-4 — Vagues 2-4 (#374-#376) puis Vague 5 (#377, destructive, sur confirmation)
```

**Estimation découplage Vague 1 : ~2 jours** — le reste des vagues inchangé (#374-#377).

---

## 7. Décompte final

| Zone | Fichiers | Lignes (est.) | Modèles Prisma |
|---|---|---|---|
| 🟢 NOYAU (pipeline + infra) | ~150 | ~20 000 | 24 |
| 🟡 GELER | ~90 | ~14 000 | 30 |
| 🔴 DROP 0-usage | ~10 | ~500 | 10 |
| 🟠 INCERTAIN | ~14 | ~1 500 | — |

*Chiffres audités par double inventaire parallèle, falsifiables par les chemins listés ci-dessus.*

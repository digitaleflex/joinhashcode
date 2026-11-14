# NETTOYAGE_SUIVI.md — Grand nettoyage (11/2026)

> **Décisions :** D-026 (cyber phare), D-027 (suppression du code gelé), D-028 (gel 6 semaines) — `DOCS/DECISIONS.md`
> **Branche :** `chore/grand-nettoyage` · **Point de retour :** tag `pre-nettoyage`
> **Règle :** 1 commit = 1 intention, `pnpm verify:fast` VERT avant chaque commit, `pnpm verify` + build en fin de phase.
> **Build local :** `REDIS_URL= REDIS_TOKEN= pnpm build` tant que `.env` contient une URL `rediss://` (le client Upstash exige `https://`).

| Phase | Contenu | Statut |
|---|---|---|
| 0 | Décisions D-026 → D-028 | ✅ 09/11 |
| 1 | Hygiène dépôt : racine rangée, `.local/` dé-versionné, AGENTS.md corrigé, 12 dépendances retirées | ✅ 09/11 — outils IA : OpenCode + Claude Code conservés, `.agents/` `.gemini/` supprimés |
| 2 | Suppression du code gelé — **terminée (09/11)** : libs orphelines, /leaderboard, /guide, check-in, admin core/fraud/mentorat/knowledge-hub/interventions, squads (UI/API/admin/invitations/email J+3), 16+ fichiers orphelins, moteur XP/badges/niveaux et leur affichage, knip réparé. **Bugs corrigés** : labs CORE/PRO verrouillés à vie, relecteur inatteignable, parrainage bloqué (D-029). **Reste ouvert** : `TwoFactorSetup` (brancher ou abandonner), `ateliers` (utilisé par `first-action`), ~45 exports inutilisés (phase 5). `/specialization` est ACTIF | ✅ |
| 3 | Produit/docs — **terminée (09/11)** : textes UI et emails sans XP/squad/check-in, cron `check-activity` supprimé, parrainage dédoublonné, double email corrigé, métriques admin sur `activity_log`, docs à jour, `TwoFactorSetup` supprimé, ~50 exports morts retirés. `ateliers` conservé (utilisé par la première action). **Reste (fondateur)** : CGU (`app/terms`), planificateur externe (`check-activity`), test manuel du site | ✅ |
| 4 | Base de données — ~~préparée sur la branche `chore/phase4-migration`~~ : **introuvable**. Vérifié le 12/11/2026 : ni cette branche (dépôt distant et local) ni `DOCS/ops/PHASE4_MIGRATION.md` n'existent. Aucune migration récente ne supprime ces tables. **À reconstruire**, par vagues, avec sauvegarde et accord humain : voir CLEAN-05 (#476) | 🔴 à refaire |
| 5 | Garde-fous — **terminée (09/11)** : `knip` en CI (vide), règles D-028 (pas de feature sans H-xx) et « zéro code mort » dans CLAUDE.md / AGENTS.md | ✅ |

---

# Nettoyage n°2 — Focus D-030 (11/2026)

> **Décision :** D-030 (mission unique : dossier de preuves vérifiées d'un analyste cyber junior francophone) — `DOCS/DECISIONS.md`
> **Test de tri :** est-ce que ça raccourcit le chemin vers la première preuve publique ? Sinon, ça sort.
> **Point de retour :** commit `da0bd23` (tag local `pre-nettoyage-2` ; le push du tag est refusé par le proxy) · **PR #467 fusionnée le 12/11/2026** (`0b2723a`)
> **Règles :** 1 commit = 1 zone ; `tsc` + `eslint` + `knip` verts avant chaque commit ; aucune donnée supprimée sans export et sauvegarde (CLAUDE.md règle 1).
> **Environnement :** `DIRECT_URL` et `DATABASE_URL` factices suffisent pour `prisma generate`, `tsc` et `knip`.

| Phase | Contenu | Statut |
|---|---|---|
| 0 | D-030, H20, H21, tag `pre-nettoyage-2` | ✅ 12/11 |
| 1 | Base de données : **la branche `chore/phase4-migration` et sa procédure sont introuvables** (voir ci-dessus). Reconstruire la liste des tables sans usage, avec export et sauvegarde préalables (CLEAN-05, #476) | ⬜ |
| 2 | **Bloc A** — vérifié zone par zone (ci-dessous) : 4 zones supprimées (sondage UX, Vivier connecté, API v1, API publique talent), les autres conservées, reportées au bloc B ou en attente de décision (`programme`/`paths`/`diplomas`) ou de contrôle en base (webhooks sortants) | ✅ 12/11 |
| 3 | **Bloc B** — B1 quiz ✅ (suppression du code en attente des sessions, #475) · B2 ateliers ✅ (table en phase base de données, #476) · B3 relecture par un pair ✅ (essai manuel requis, #484) · reste : missions 01-03 (#471), gamification (#472), dashboard (#473) | 🔄 |
| 4 | Backlog GitHub : 23 issues fermées, #436 fermée, #440 recadrée (voir B3 et #481). Restent #424, #442 et la note sur #417 | 🔄 |
| 5 | Dépôts : geler `hashcode-learning-platform` et `hashcode-profiling-engine` (archivage = action humaine, #482) | ⬜ |
| 6 | **Construire** : #455 et #456 livrées sur `main` (PR #468) ; 5 labs cyber **rédigés** dans `DOCS/labs/`, à brancher (#479) | 🔄 |

## Bloc A — détail (vérifié zone par zone : liens entrants, données écrites, tests)

| Zone | Verdict après vérification | Statut |
|---|---|---|
| Sondage UX (admin, 2 routes API, lib, schéma Zod, test) | Orphelin : le bandeau n'existe plus, plus rien n'appelle l'API | ✅ `1c20063` |
| `app/acquisition`, `lib/acquisition`, `app/actions/acquisition` | **À CONSERVER.** Funnel reboot importé (ROADMAP ✅ 100 %), crée de vrais comptes, renvoie vers WhatsApp (D-020, D-022), sondé par `verify.sh` et les e2e. À réévaluer seulement par décision | ⛔ conservé |
| `academy/programme`, `paths`, `diplomas`, `certificates`, `playground` | **Imbriqué** : indexé dans `sitemap.ts`, sondé par `verify.sh` et les e2e, alimenté par `seed-academy.ts` (exécuté 2× en CI). `programme` et `paths` sont la vitrine publique des domaines (D-024, maintenue par D-030). Décision requise | ⏸ décision |
| `academy/my-courses` | **À CONSERVER.** C'est l'écran « Mes cours » de l'apprenant (seul `/new` est réservé aux admins) | ⛔ conservé |
| Admin `analytics`, `feedback` | **À CONSERVER.** Mesure des KPI et lecture des retours des sessions utilisateurs (D-028) | ⛔ conservé |
| Admin `keys`, `operations` | **À CONSERVER.** Clés bêta utilisées par l'authentification ; relances email | ⛔ conservé |
| Admin `contenus`, `parcours`, `notifications` | **→ bloc B.** `contenus` édite le contenu des profils et ateliers, `parcours` les spécialisations avec XP ; ils appellent des routes API qui resteraient orphelines (`profile-content`, `ateliers`, `specializations`) | ➡ B |
| `/talents` (vitrine publique) | **À CONSERVER.** Seul index public des preuves (`talentVisible` + au moins 1 mission validée), lié depuis la nav, le pied de page, le sitemap et `/community`. Texte « bâtisseurs / stratèges » à nettoyer au bloc B | ⛔ conservé |
| `/dashboard/talents` (Vivier connecté) | **Fuite de données** : listait tous les membres non bannis sans `talentVisible` et transmettait leurs 4 scores psychométriques au composant client. Supprimé avec `ui/hover-card` et `@radix-ui/react-hover-card` | ✅ `6fdf4c5` |
| API v1 (`GET /api/v1/members/me`, test, workflow `api-v1.yml`, `docs/API_V1.md`) | Aucun consommateur dans le dépôt ni dans les 3 autres. Aucun appelant externe n'a été exclu (logs d'accès non consultés) | ✅ `db4fc74` |
| `/api/public/talent` | Route orpheline (déjà relevée en 09/2026), `/talents` ne l'utilise pas | ✅ `07252f8` |
| `/api/webhooks/resend` | **À CONSERVER** : rebonds et plaintes d'emails (signature svix) | ⛔ conservé |
| Webhooks sortants par mission (`lib/webhooks.ts`, table `MissionWebhook`, 3 routes admin) | Aucun écran, configurables par appel API seulement, branchés dans 4 routes du chemin critique. **Contrôle en base requis avant décision** : `SELECT count(*) FROM mission_webhook` en production | ⏸ contrôle base |
| `/api/feed` | **À CONSERVER** : alimente `AdminLiveFeed` (dashboard admin) | ⛔ conservé |
| `components/tour` (+ dépendance `nextstepjs`) | Actif : flag `tour` à `true` par défaut, utilisé par `dossier`, `missions`, `dashboard-with-tour`, barre latérale. Pas isolé | ➡ B (réduction du dashboard) |
| `lib/profile-v1.ts` + modèle `ProfileV1` | Écrit à l'approbation de la Mission 01 (2 appels sur le chemin critique), lu par personne | ➡ B (missions 01-03) |

> **Leçon :** la liste initiale du bloc A (~7 600 lignes) était une estimation faite sans lire le code. Après vérification, une seule zone était réellement isolée. Règle ajoutée : aucune suppression sans avoir listé les liens entrants, les données écrites et les tests qui en dépendent.

> **Test connu en échec, préexistant :** `__tests__/db-connection.test.ts` exige une vraie base PostgreSQL (`ECONNREFUSED` sans elle). Identique avant le nettoyage.

## Bloc B — détail

## État au 12/11/2026, après la fusion de la PR #467

| Sujet | État |
|---|---|
| Code | Fusionné dans `main` : suppression du sondage UX, du Vivier connecté, de l'API v1, de `/api/public/talent` et du Matchmaking Alpha ; quiz facultatif ; ateliers fusionnés dans les Labs ; relecture par un pair ouverte (3 labs validés). CI verte sur le commit de fusion. |
| Production | **Pas encore déployé** (déploiement par le fondateur, #470) : les corrections de fuites ne protègent les membres qu'après `./deploy.sh --image`. |
| Documentation | Mise à jour le 12/11 : `README.md`, `AGENTS.md` (38 routes ajoutées), `PRODUCT_VISION.md` (une page), `GLOSSAIRE.md`, `HYPOTHESES.md` (indicateurs), `MVP_SPEC.md`, bandeaux d'archive (ROADMAP, PLAN_EXECUTION, 9 spécifications), `CHANGELOG.md`, `DOCS/labs/README.md`. |
| Non vérifié | **Parcours de relecture par un pair** jamais essayé à la main ; aucun e2e ne le couvre. |
| Fuite supplémentaire trouvée en cours de route | `/u/[pseudo]` listait les labs validés d'un **profil privé** (privé par défaut) depuis la PR #468 : corrigé, avec test de régression. |
| Erreurs de suivi corrigées | La phase 4 « préparée » n'existait pas (voir ci-dessus). Les 5 labs cyber **existent** (`DOCS/labs/`), contrairement à ce qu'affirmait le brief initial de BUILD-01. |

### B1 — Quiz psychométrique
| Étape | Contenu | Statut |
|---|---|---|
| 1 | Sortir le quiz du parcours obligatoire (`proxy.ts`, onboarding, repli de connexion, message du dashboard, tests). **Aucun code du quiz supprimé** ; `/quiz` reste accessible | ✅ voir `git log` (`refactor(funnel)`) |
| 2 | Retirer les invitations vers `/quiz` : landing (nav, pied de page, sitemap), emails `welcome`, `onboarding-completed` et `ops-reminder` (étape « quiz » supprimée, page `operations` alignée), étape « Calibration terminée » de la checklist. Le bouton de `ProfileTab` est **conservé** comme entrée facultative. **KPI « Landing → Quiz » et « Quiz terminé » à redéfinir** (voir `HYPOTHESES.md`) | ✅ voir `git log` (`retirer les invitations vers le quiz`) |
| 3 | Mesurer H2 et H4 sur les 20 sessions utilisateurs, puis décider de la suppression du code (~3 200 l. : `components/quiz`, `lib/questions`, `analysis`, `profile-content`, `/quiz`, `/specialization`, `app/api/quiz`, `QuizResult`) | ⬜ après les sessions |
| ✓ | « Matchmaking Alpha » (`app/missions/[id]/page.tsx`) : suggestions de partenaires par classe complémentaire, qui exposaient pseudo et liens sociaux de membres sans filtre `talentVisible`. Supprimé | ✅ `fix(privacy): supprimer le Matchmaking Alpha` |

### B2 — Ateliers fusionnés dans les Labs
| Étape | Contenu | Statut |
|---|---|---|
| 1 | La première action du dashboard mène à `/missions` (plus à un atelier). Constat : les 12 ateliers pointaient tous vers le slug de lab `premiere-preuve-maitrise`, absent du seed, de `lib/missions.ts` et du contenu HEF | ✅ `refactor(first-action)` |
| 2 | Pages `/ateliers`, bloc « Atelier recommandé » des labs, section Ateliers de `/labs`, catalogue `lib/ateliers.ts`, redirection `/ateliers/*` → `/missions` | ✅ `refactor(ateliers): supprimer les pages` |
| 3 | Admin des ateliers (page, API, actions du journal) et onglet Ateliers de `admin/contenus` | ✅ `refactor(ateliers): supprimer l'admin` |
| 4 | **Table `atelier`** (modèle Prisma) : plus aucun code ne la lit ni ne l'écrit. Suppression = migration + export préalable + confirmation explicite. À vérifier d'abord en production : `SELECT count(*) FROM atelier` et si un lab `premiere-preuve-maitrise` y a été créé à la main | ⏸ phase base de données |
| ⚠ | Restes à décider : `sendOrientationEmail` (paramètres `atelier*`, aucun appelant trouvé), bouton « Commencer l'atelier » du résultat du quiz (disparaît avec le code du quiz), mot « Atelier » dans l'Academy (`programme/[slug]`, `python-runner`, `lib/academy/program.ts`), événement `first_action_completed` désormais sans déclencheur dans l'interface (API conservée) | ⬜ |

### B3 — Relecture par un pair (BUILD-02, #484) et backlog (CLEAN-07, #481)
| Étape | Contenu | Statut |
|---|---|---|
| 1 | Éligibilité relecteur = **3 labs validés**, sans condition de profil (D-029) : `isEligibleReviewer` exigeait en plus un profil psychométrique, bloquant tout membre sans quiz | ✅ `fix(review): éligibilité relecteur` |
| 2 | Page `/reviewer/submissions/[submissionId]` (brief, livrable, prise en charge, formulaire de relecture) ; la file ne mène plus à un 404 ; `lib/review-access.ts` source unique de la politique | ✅ `fix(review): page de relecture par soumission` |
| 3 | **Ouverture aux pairs** (modération + membres avec 3 labs validés) ; lien « Reviewer » de la barre latérale sans condition de niveau. Commit isolé : `git revert` pour revenir au mode concierge | ✅ `fix(review): ouvrir la relecture aux pairs` |
| ⚠ | Non vérifié en navigateur ni par un e2e (pas de base ici) : **parcours à essayer à la main** avec deux comptes de test avant déploiement | ⬜ |
| ⚠ | Les labs CORE relus par un pair passent en `PENDING_ADMIN` et attendent la confirmation de l'admin : prévoir de la traiter | ⬜ |
| CLEAN-07 | 23 issues du backlog fermées : 20 en `not_planned` (#422, #425, #426, #429-#435, #437-#439, #441, #443, #444, #457, #459, #460, #463), #423 en `completed` (PR #453 ; **`pnpm hef:seed` à lancer en production**), #427 et #428 en `not_planned` (import et code livrés, affichage et contenu absents). #436 fermée en `not_planned` (outillage de labs de code HEF, **pas** un doublon de BUILD-01) ; #440 recadrée en « Evidence minimal », parent de #455 et #456. Restent à décider : #424 (vérification visuelle des libellés), #442 (partielle), et la note de restriction sur #417 | 🔄 |

---

# Historique — Vague 1 (09/2026)


> **Dernière mise à jour :** 2026-09-17 (Vague 1 étape 1 exécutée)
> **Références :** `DOCS/AUDIT_PIVOT.md` (la carte), `DOCS/PIVOT_CYBER.md` (la vision), EPIC #372, Vague 1 #373
> **Règle :** chaque sous-étape → gate. `npm run verify` (Docker requis) ou `npm run verify:fast` (types + lint + prisma, sans réseau) en secours.
> **Piège connu :** `.next/dev/types` se corrompt → purger `.next` avant de diagnostiquer un échec `tsc`.

---

## ÉTAT GLOBAL

| Étape | Statut | Notes |
|---|---|---|
| Création tracker | ✅ fait | ce fichier |
| Étape 1 — Découplage D1-D8 | ✅ **terminé** | gate complet VERT (voir journal) |
| Étape 2 — Gel visible (nav + pages refonte) | ⬜ | |
| Étape 3 — Amendement docs (PRODUCT_VISION, ROADMAP, DECISIONS, ABSORPTION) | ⬜ | |
| Gate final Vague 1 | ⬜ | |

---

## ÉTAPE 1 — DÉCOUPLAGE D1→D8

### D1 — `app/api/missions/[id]/review/route.ts` : retirer squad-logic
- [x] Import `updateSquadCohesion` retiré
- [x] Bloc cohésion de squad retiré du flow d'approbation
- [ ] Gate : verify:fast ✅ / ❌

### D2 — Retirer `awardXp` (`lib/experience.ts`) des flows pipeline
- [x] `app/api/missions/*` (×4 occurrences identifiées)
- [x] `app/api/admin/submissions/[id]/route.ts`
- [x] `app/api/admin/missions/attempts/[attemptId]/route.ts`
- [x] `app/api/onboarding/route.ts`
- [x] Remplacement : `logActivity` (l'XP disparaît des flows pipeline)
- [ ] Gate : verify:fast ✅ / ❌
- ⚠️ Ne PAS supprimer `lib/experience.ts` lui-même (toujours référencé ailleurs — il meurt en Vague 5)

### D3 — Retirer `lib/evolution-engine` des importeurs
- [x] `app/api/admin/submissions/[id]/route.ts`
- [x] `app/api/missions/[id]/review/route.ts` (avec D1)
- [x] `app/api/admin/core/route.ts` (module gelé — route désactivée en D8-adjacent)
- [x] `app/api/admin/feedback/route.ts`
- [x] UPDATE `behavioralVibrancy` retiré des flows pipeline
- [ ] Gate : verify:fast ✅ / ❌

### D4 — `components/dossier/dossier-view.tsx` : masquer `xp-growth-chart`
- [x] Import + rendu retirés (section evidences arrivera en V3 — trou assumé)
- [ ] Gate : verify:fast ✅ / ❌

### D5 — `components/dashboard/dashboard-shell.tsx` : purge widgets gamification
- [x] `SquadBanner` retiré
- [x] `WeeklyChallengeWidget` retiré
- [x] `AmbassadorGoal` retiré
- [x] `ReferralCard` retiré
- [x] `level-utils` / couleurs gamification retirées
- [ ] Garder : `MissionHistory` (réutilisable Labs), layout, tour
- [ ] Gate : verify:fast ✅ / ❌

### D6 — `components/dashboard/app-sidebar.tsx` : nav réorientée
- [x] `SidebarSquad` retiré
- [x] Nav : entrées gelées retirées (`/ateliers`, `/guide`, `/squad`, `/leaderboard`)
- [x] Nav cible appliquée : Mon Parcours → Labs → Parcours(academy) → Portfolio → Vivier
- [ ] Gate : verify:fast ✅ / ❌

### D7 — `components/settings/expertise-diagnostic.tsx` : 2 voies SOC/OSINT
- [ ] Dépendance `lib/tech-tree*` retirée du composant
- [x] Remplacé par un quiz 1 question → 2 voies (SOC défensive / OSINT / Investigation)
- [ ] Gate : verify:fast ✅ / ❌
- ⚠️ `lib/tech-tree*` reste en place jusqu'à Vague 5 (toujours importé ailleurs)

### D8 — Option A « Promotions » : gel des routes squads, plugin conservé
- [ ] Décision : plugin better-auth `organization` **conservé** (devient cohortes plus tard)
- [x] `/squad` → redirect `/dashboard`, `/api/squad/*` → 404 JSON — **coupure unique dans `proxy.ts`** (renommage dossier impossible : handles Node ; fichiers intacts pour Vague 5)
- [ ] `/invite/[slug]` : destination join-squad à réorienter — **reporté Vague 2** (cookie `pending-squad` consommé par /quiz)
- [x] Crons `squad-decay`, `reset-streaks` : renommés `_…-frozen` (404 scheduler — sans effet)
- [ ] Gate : verify:fast ✅ / ❌

---

## ÉTAPE 2 — GEL VISIBLE
- [ ] Nav finale appliquée (après D6)
- [ ] Pages admin mortes (`admin/{fraud,core,mentorat,interventions,knowledge-hub,squads}`) → retirées de l'index admin (routes gardées, inaccessibles)
- [ ] `/leaderboard`, `/guide` → hors nav, access direct possible (gel doux) — décision finale en Vague 5

## ÉTAPE 3 — AMENDEMENT DOCS
- [ ] `PRODUCT_VISION.md` réécrit (pipeline cyber) — **amendement constitution**
- [ ] `ROADMAP.md` réécrit (jalons §9 PIVOT_CYBER + §4 ÉLIMINÉ enrichi)
- [ ] `DOCS/DECISIONS.md` — AMI pivot daté
- [ ] `ABSORPTION.md` — périmètre réduit au cyber
- [ ] `DOCS/PIVOT_CYBER.md` §12 mis à jour

## GATE FINAL
- [ ] `npm run verify` complet (Docker) OU verify:fast documenté si Docker indisponible
- [ ] `npm run lint` propre
- [ ] Commit Vague 1 (sur demande)

---

## JOURNAL DES MODIFICATIONS (log brut de session)

| Heure | Étape | Fichiers | Résultat |
|---|---|---|---|
| session | création tracker | `DOCS/NETTOYAGE_SUIVI.md` | ✅ |
| session | D1+D2+D3 | review route + 6 routes API + email template | tsc ✅ eslint ✅ |
| session | D4 | dossier-view.tsx | tsc ✅ (chart XP masqué, trou V3 assumé) |
| session | D5 | dashboard-shell.tsx (widgets XP/streak/squad/referral retirés) | tsc ✅ |
| session | D6 | app-sidebar.tsx + sidebar-nav-config.ts (nav : Mon Parcours → Labs → Parcours → Portfolio → Vivier) | tsc ✅ |
| session | D7 | expertise-diagnostic.tsx (2 voies SOC/OSINT, tech-tree débranché) | tsc ✅ |
| session | D8 | proxy.ts (kill-switch /squad + /api/squad) + crons renommés _frozen | ✅ |
| session | GATE | `npm run verify` : **types ✅ lint ✅ prisma ✅ 15/15 sondes ✅ 22 E2E ✅** | 🟢 VERT |
| session | 🔴 BUG TROUVÉ PAR L'AUDIT APPROFONDI | le matcher du middleware **exclut `api/`** → le kill-switch D8 n'interceptait PAS les API squads (`POST /api/squad/join` = 401 = routes live !). Fix : matcher `"/api/squad/:path*"` ajouté → **404 confirmé** | ✅ |
| session | TESTS | `npm run test` : **177 passés / 7 échecs — tous préexistants** (pruve stash avant/après) ; 1 test mis à jour (`admin-submissions`) pour affirmer le nouveau comportement sans XP ; **0 régression** | ✅ |

---

## ⚠️ ÉCHECS PRÉEXISTANTS (annoncés à voix haute — NON absorbés par ce pivot)

Vérifiés par stash avant/après : **ces 7 tests échouaient DÉJÀ avant le nettoyage** (écart D2/D3 n'en corrige aucun, n'en crée aucun) :
1. `mission-attempt-review.test.ts` ×4 — mock Vitest sans export `submitLimiter` (`@/lib/ratelimit` mocké incomplètement)
2. `api-onboarding.test.ts` — "save partial onboarding data" (mock `awardXp` obsolète)
3. `missions.test.ts` — "target all four profiles" (affirme la vision 4 profils — **deviendra obsolète avec le pivot**)
4. `security-abuse-prevention.test.ts` — "strips HTML from pseudo and bio" (mock `user.update` incompatible)

→ À créer en issue dédiée (nettoyage tests, hors Vague 1).

---

## DÉCISIONS PRÉPRISES (rappel)

1. **D8 = Option A Promotions** (plugin org conservé, routes squads gelées)
2. Aucune suppression de **données** ni de `prisma db push` destructif en Vague 1
3. Les fichiers gelés restent sur disque (morts à Vague 5) — git conserve l'historique
4. Branches non mergées : gelées (décision en attente)
5. **Séries de commits obligatoires** (demande propriétaire 17/09) : 1 étape de
   découplage = 1 commit, 1 vague de docs = 1 commit — règle permanente
   ajoutée à AGENTS.md ("Séries de commits"). Plus de commits fourre-tout.

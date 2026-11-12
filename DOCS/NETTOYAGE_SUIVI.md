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
| 4 | Base de données — **préparée (09/11)** sur la branche séparée `chore/phase4-migration` : 11 tables inutilisées supprimées. Procédure : `DOCS/ops/PHASE4_MIGRATION.md`. **Ne pas fusionner** sans sauvegarde, export et feu vert explicite. Lot suivant : colonnes XP/séries de `User` et squad d'`organization` | 🟡 prête |
| 5 | Garde-fous — **terminée (09/11)** : `knip` en CI (vide), règles D-028 (pas de feature sans H-xx) et « zéro code mort » dans CLAUDE.md / AGENTS.md | ✅ |

---

# Nettoyage n°2 — Focus D-030 (11/2026)

> **Décision :** D-030 (mission unique : dossier de preuves vérifiées d'un analyste cyber junior francophone) — `DOCS/DECISIONS.md`
> **Test de tri :** est-ce que ça raccourcit le chemin vers la première preuve publique ? Sinon, ça sort.
> **Point de retour :** commit `da0bd23` (tag local `pre-nettoyage-2` ; le push du tag est refusé par le proxy) · **Branche :** `claude/exciting-maxwell-4r95bk`
> **Règles :** 1 commit = 1 zone ; `tsc` + `eslint` + `knip` verts avant chaque commit ; aucune donnée supprimée sans export et sauvegarde (CLAUDE.md règle 1).
> **Environnement :** `DIRECT_URL` et `DATABASE_URL` factices suffisent pour `prisma generate`, `tsc` et `knip`.

| Phase | Contenu | Statut |
|---|---|---|
| 0 | D-030, H20, H21, tag `pre-nettoyage-2` | ✅ 12/11 |
| 1 | Base de données : fusion de `chore/phase4-migration` (11 tables) **avec export et sauvegarde préalables** | ⬜ |
| 2 | **Bloc A** — vérifié zone par zone (ci-dessous) : 4 zones supprimées (sondage UX, Vivier connecté, API v1, API publique talent), les autres conservées, reportées au bloc B ou en attente de décision (`programme`/`paths`/`diplomas`) ou de contrôle en base (webhooks sortants) | ✅ 12/11 |
| 3 | **Bloc B** — après découplage : sortir le quiz du funnel (`proxy.ts`), fusionner Ateliers dans Labs, remplacer les missions 01-03 codées en dur, résidus de gamification, réduire le dashboard | 🔄 B1 quiz : étape 1 faite (voir ci-dessous) |
| 4 | Backlog GitHub : fermer #425-#444 sauf #440 et #436 (recadrées), #457, #459, #460, #463, #464, #465 en `not_planned` avec renvoi vers D-030 | ⬜ |
| 5 | Dépôts : archiver `hashcode-learning-platform` et `hashcode-profiling-engine` (après accord) | ⬜ |
| 6 | **Construire** : écrire les 5 labs cyber SOC N1, livrer #455 et #456 | ⬜ |

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

### B1 — Quiz psychométrique
| Étape | Contenu | Statut |
|---|---|---|
| 1 | Sortir le quiz du parcours obligatoire (`proxy.ts`, onboarding, repli de connexion, message du dashboard, tests). **Aucun code du quiz supprimé** ; `/quiz` reste accessible | ✅ voir `git log` (`refactor(funnel)`) |
| 2 | Retirer les invitations vers `/quiz` : nav et pied de page de la landing, emails `welcome`, `onboarding-completed` et `ops-reminder`, bouton de `ProfileTab`, étape « Calibration terminée » de `activation-checklist`, `sitemap.ts`, `a11y-audit.ts`. **Touche le KPI « Landing → Quiz »** : à décider avant | ⏸ décision |
| 3 | Mesurer H2 et H4 sur les 20 sessions utilisateurs, puis décider de la suppression du code (~3 200 l. : `components/quiz`, `lib/questions`, `analysis`, `profile-content`, `/quiz`, `/specialization`, `app/api/quiz`, `QuizResult`) | ⬜ après les sessions |
| ⚠ | « Matchmaking Alpha » (`app/missions/[id]/page.tsx`) suggère des partenaires par classe complémentaire : reliquat des squads à retirer | ⬜ |

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

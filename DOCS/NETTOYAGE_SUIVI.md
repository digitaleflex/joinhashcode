# NETTOYAGE_SUIVI.md — Tracker de la Vague 1 (découplage + gel)

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

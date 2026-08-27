# ROADMAP ISSUES — Réorganisation Complète

> **Date :** 27 août 2026 (mis à jour)
> **Issues ouvertes :** 92 actives (+ 11 fermées déjà implémentées)
> **Nouvelles issues créées :** 8 (#331-#338)
> **Charge totale estimée :** ~75-100 jours (15-20 semaines / 1 perso à temps plein)
> **Légende taille :** S = 0.5j | M = 1-2j | L = 3-5j | XL = 5-10j+
> **Milestones GitHub :** [#36 Phase 0](https://github.com/digitaleflex/joinhashcode/milestone/36) | [#37 Phase 1](https://github.com/digitaleflex/joinhashcode/milestone/37) | [#38 Phase 2](https://github.com/digitaleflex/joinhashcode/milestone/38) | [#39 Nice-to-have](https://github.com/digitaleflex/joinhashcode/milestone/39)

---

## Issues à FERMER (11 issues — déjà implémentées)

Ces issues ont été vérifiées dans le code et sont **déjà résolues**. À clore avec commentaire "Already implemented".

| # | Titre | Raison de la fermeture |
|---|-------|----------------------|
| **#243** | badge-engine ne populate pas currentStreak/reviewsCount | `lib/badge-engine.ts:231-276` fetch correctement les deux champs |
| **#244** | Valider content selon submissionMethod (TEXT_RESPONSE) | `app/api/missions/route.ts:47-58` gère les deux branches |
| **#246** | XP_THRESHOLDS capped à 4 niveaux | `lib/member-card-constants.ts:26-33` couvre 50 niveaux |
| **#267** | Garde anti-course autosave | `app/api/missions/[id]/attempt/route.ts:230` + submit route vérifient le statut |
| **#233** | Quiz de spécialisation | `components/quiz/specialization-quiz.tsx` + `app/specialization/` complet |
| **#234** | Étape post-quiz dans le flux | `app/api/onboarding/post-quiz/route.ts` + flow quiz/onboarding câblé |
| **#237** | Page évolution comportementale | `components/dashboard/evolution-radar.tsx` + `lib/evolution-engine.ts` |
| **#241** | Endpoint OG image | `app/api/og/route.tsx` complet avec ImageResponse |
| **#242** | Programme ambassadeur complet | `components/dashboard/ReferralCard.tsx` + `lib/referral.ts` + anti-fraud |
| **#325** | Tour guidé moteur | `components/tour/` 5 fichiers + `lib/feature-flags.ts` tour flag actif |
| **#329** | Purger feature flags morts | `lib/feature-flags.ts` — 8 flags actifs et consommés, pas de morts |

---

## PHASE 0 — Bugfixes & Sécurité ⚡

> **Milestone :** [#36 Phase 0 — Ça marche](https://github.com/digitaleflex/joinhashcode/milestone/36) (8 issues)

**Durée :** 2-3 jours | **Bloquant pour :** tout le reste

| # | Titre | Taille | Priorité | Notes |
|---|-------|--------|----------|-------|
| **#245** | fix(checkin): streak reset après jour manqué + cooldown 24h | M | P0 | Cooldown corrigé (24h), mais pas de cron proactif pour reset les streaks stale. UX confuse. |
| **#331** | fix(checkin): cron proactif pour reset les streaks individuels stale | M | P0 | Cron daily qui reset les streaks des users inactifs >24h. Extension du cron check-activity. |
| **#326** | fix(auth): page /2fa orpheline — brancher twoFactor ou supprimer | M | medium | Page existe, mais le plugin `twoFactor` n'est PAS dans `lib/auth.ts`. Système non-fonctionnel. |
| **#266** | security(missions): limiter taille payload autosave PATCH | S | security | Sécurité : pas de limite de taille sur le PATCH autosave. |
| **#261** | fix(missions): retirer slug hardcodé signal-ouverture | S | medium | `signal-ouverture` en magic string dans 2 fichiers → remplacer par flag DB `isAutoApproved`. |
| **#332** | feat(missions): flag isAutoApproved sur le schema Mission | M | P1 | DB : champ `isAutoApproved Boolean default false`. Remplace les checks hardcodés de #261. |

**Total Phase 0 : ~5-7 jours**

---

## PHASE 1 — Mission Admin : Socle 🔨

> **Milestone :** [#37 Phase 1 — Admin autonome](https://github.com/digitaleflex/joinhashcode/milestone/37) (34 issues, Phases 1-5 du roadmap)

**Durée :** 5-8 jours | **Dépend de :** Phase 0 | **Bloque :** Phases 2-5

| # | Titre | Taille | Priorité | Notes |
|---|-------|--------|----------|-------|
| **#277** | Schéma Mission : ajouter statut cycle de vie + dates | L | P0 | DB : ajouter `status` (DRAFT/PUBLISHED/CLOSED/ARCHIVED), `publishAt`, `deadline`, `closedAt`. Migration Prisma obligatoire. |
| **#278** | Archivage vs suppression : soft-delete + garde anti-data-loss | M | P0 | Ne jamais supprimer une mission avec des tentatives. Soft-delete avec champ `deletedAt`. |
| **#285** | Tags : champ + filtres | M | P1 | DB : champ `tags String[]` sur Mission + filtres UI côté admin et membre. |
| **#290** | Ressources externes sur une mission (labels + URLs) | M | P2 | DB : champ JSON `resources` avec title/url/type. UI pour afficher côté membre. |
| **#293** | Notes internes admin (jamais exposées côté membre) | M | P2 | DB : champ `adminNotes String?` sur Mission. Visible uniquement dans admin. |
| **#334** | feat(missions): notes internes admin sur les missions | M | P2 | Extension de #293 : champ adminNotes dans MissionForm, jamais dans les API publiques. |
| **#271** | EPIC — Socle (schéma + statuts + dates) | — | P0 | Contient #277, #278. Tracker uniquement. |

**Total Phase 1 : ~8-10 jours**

---

## PHASE 2 — Mission Admin : Mission Builder 🏗️

> **Milestone :** [#37 Phase 1 — Admin autonome](https://github.com/digitaleflex/joinhashcode/milestone/37) (Phases 2-5 du roadmap)

**Durée :** 10-14 jours | **Dépend de :** Phase 1 | **Bloque :** Phases 3-5

| # | Titre | Taille | Priorité | Notes |
|---|-------|--------|----------|-------|
| **#279** | Mission Builder : CRUD des étapes depuis l'UI | XL | P0 | Composant multi-étapes drag-and-drop pour créer/modifier les étapes d'une mission. |
| **#280** | Mission Builder : Question Builder (types de champs + validation) | L | P0 | Types : text, textarea, url, file, select, multi-select. Validation par type. |
| **#281** | Mission Builder : rubrique d'évaluation configurable + seuils | L | P0 | Critères pondérés avec barème, seuil de passage minimum. |
| **#282** | Critères de validation : configurable + affichage dans la review | M | P0 | Les critères définis dans le builder s'affichent dans l'interface de review. |
| **#283** | Livrables : éditable en UI + affichage membre/reviewer | M | P1 | Champs livrables configurables (type de fichier attendu, description). |
| **#284** | Prérequis : éditable en UI + affichage membre | M | P1 | Définir les prérequis d'une mission (missions à compléter, niveau min). |
| **#286** | Preview as Member + Test Mission (sans crédit XP) | L | P0 | L'admin peut prévisualiser la mission comme un membre, sans gagner d'XP. |
| **#287** | Exposer les champs existants (shortDesc, fullBriefing, evaluatorNotes, qualityIndicators) | M | P1 | Champs déjà dans le schema mais pas dans l'UI admin. Les câbler dans le form. |
| **#288** | Dupliquer une mission (mission + étapes) | M | P1 | Bouton "Dupliquer" qui clone la mission + toutes ses étapes. |
| **#289** | Versioning des missions (snapshots + restauration) | L | P2 | Sauvegarder des snapshots à chaque publication, permettre la restauration. |
| **#272** | EPIC — Mission Builder (créer/configurer) | — | P0 | Contient #279-#289. Tracker uniquement. |

**Total Phase 2 : ~14-18 jours**

---

## PHASE 3 — Mission Admin : Operations 📋

**Durée :** 6-9 jours | **Dépend de :** Phase 2 | **Bloque :** Phases 4-5

| # | Titre | Taille | Priorité | Notes |
|---|-------|--------|----------|-------|
| **#292** | Publication : statut + checklist avant publier + visibilité membre | L | P0 | Workflow de publication : brouillon → prêt → publié. Checklist de vérification. |
| **#294** | Assignation des missions aux membres (MissionAssignment) | L | P0 | DB : table `MissionAssignment` (missionId, userId, deadline, status). Assignation manuelle + auto. |
| **#295** | Deadlines individuelles + rappels automatiques | M | P1 | Deadlines par membre + emails de rappel via cron. |
| **#296** | Suivi des participants par mission | L | P0 | Vue admin : liste des participants, statut, progression, tentatives. |
| **#297** | Bulk actions sur les tentatives (approve/reject/assign en masse) | M | P1 | Checkboxes + actions groupées dans la vue tentatives. |
| **#298** | Reviewer assignation (manuel + auto + file de travail) | L | P0 | File de travail review : auto-assign basé sur charge + spécialisation. |
| **#302** | Rôles admin fins (ADMIN/MODERATOR/REVIEWER) + permissions par fonction | L | P0 | RBAC : REVIEWER ne voit que les reviews, MODERATOR gère les missions, ADMIN a tout. |
| **#273** | EPIC — Operations (publication, assignation, suivi) | — | P0 | Contient #292-#302. Tracker uniquement. |

**Total Phase 3 : ~8-12 jours**

---

## PHASE 4 — Mission Admin : Review Center 🔍

**Durée :** 6-9 jours | **Dépend de :** Phase 3 | **Bloque :** Phase 5

| # | Titre | Taille | Priorité | Notes |
|---|-------|--------|----------|-------|
| **#299** | Unifier le Review Center (missions à étapes + classiques) | L | P1 | Une seule interface pour reviews, quel que soit le type de mission. |
| **#300** | Analytics par mission (KPIs réels, périodes) | M | P1 | Taux de complétion, note moyenne, temps moyen, taux d'abandon par mission. |
| **#301** | Analytics par étape (goulots d'étranglement) | M | P2 | Identification des étapes où les users bloquent abandonnent. |
| **#303** | Export missions + scoring (CSV) | M | P1 | Export CSV des résultats : membre, score, statut, date. |
| **#304** | Confirmations renforcées + protection des formulaires en cours | M | P1 | Empêcher les actions destructrices sans confirmation. Sauvegarde auto des formulaires. |
| **#305** | Audit log complet des actions admin missions | L | P0 | Traçabilité : qui a fait quoi, quand. Table dédiée ou extension d'ActivityLog. |
| **#274** | EPIC — Review Center (évaluation, scoring, analytics) | — | P0 | Contient #299-#305. Tracker uniquement. |

**Total Phase 4 : ~8-12 jours**

---

## PHASE 5 — Mission Admin : Progression & Qualité 📈

**Durée :** 10-14 jours | **Dépend de :** Phase 4

| # | Titre | Taille | Priorité | Notes |
|---|-------|--------|----------|-------|
| **#307** | Équilibrage XP + gate par niveau membre (difficulty → level) | L | P1 | DB : gating XP par niveau. Missions difficiles débloquées au niveau X. |
| **#308** | Badges liés aux missions (badge-engine ↔ mission) | M | P1 | Attribuer des badges spécifiques à la complétion de missions. |
| **#309** | Connexion CORE → missions (recommandation par profil) | L | P1 | Le CORE engine recommande des missions basées sur le profil Builder/Creator/etc. |
| **#310** | Rattachement missions → parcours/spécialisation (tech-tree) | L | P1 | DB : lien mission → parcours. Les missions s'intègrent dans un parcours progression. |
| **#311** | Cycle hebdo pour les missions à étapes (attempts + weeklySlot) | L | P1 | DB : champ `weeklySlot`. Les missions à étapes se réinitialisent chaque semaine. |
| **#312** | Double review / arbitrage des décisions contestées | M | P1 | Workflow : si un membre conteste, un 2e reviewer arbitre. |
| **#313** | SLA de review (alerte tentative en attente > 48h) | M | P2 | Notification admin quand une tentative attend >48h sans review. |
| **#314** | Agrégation du feedback membre sur la review | M | P2 | After review : demander au membre sa note de difficulty + satisfaction. |
| **#315** | Médias dans les étapes (images, liens, upload brief) | M | P1 | Possibilité d'ajouter des images/vidéos dans les briefs d'étapes. |
| **#316** | i18n / multi-langue des missions (libellés UI) | L | P2 | Traductions des interfaces missions. Dépend de l'i18n globale. |
| **#317** | Rate limiting sur les routes missions (submit/autosave/submissions) | S | P1 | Vérifier/câbler le rate limiting sur toutes les routes missions. |
| **#318** | Purge attempts/submissions à la suppression de compte (RGPD) | M | P1 | When user deletes account → cascade delete attempts + submissions. |
| **#319** | Export/import JSON d'une mission (backup/migration) | M | P2 | Export complet d'une mission en JSON, import pour migration. |
| **#320** | Notification admin quand une soumission arrive | M | P2 | Email/notification admin sur nouvelle soumission en attente. |
| **#321** | Webhooks (Slack/Discord) pour nouvelles soumissions | M | P2 | Webhook POST sur événement submission. |
| **#275** | EPIC — Transverse (permissions, audit, UX, test) | — | P0 | Contient #302, #305, #304. Tracker uniquement. |
| **#306** | EPIC — Progression, contenu & qualité | — | P1 | Contient #307-#321. Tracker uniquement. |

**Total Phase 5 : ~16-22 jours**

---

## PHASE 6 — Missions : UX Membre 🎮

> **Milestone :** [#38 Phase 2 — Produit complet](https://github.com/digitaleflex/joinhashcode/milestone/38) (26 issues)

**Durée :** 3-5 jours | **Dépend de :** Phase 1 (schéma)

| # | Titre | Taille | Priorité | Notes |
|---|-------|--------|----------|-------|
| **#264** | Afficher la timeline d'une mission à étapes côté utilisateur | M | enhancement | Composant timeline visuelle de progression dans les étapes. |
| **#265** | Refactor mission-engine : séparer statuts complete/reviewed des étapes | M | refactor | Le statut actuel confond complétion et review. Séparer en deux champs. |
| **#268** | Mémoriser la dernière étape éditée (currentStep) en autosave | M | enhancement | Sauvegarder le currentStep dans l'attempt pour reprendre où on était. |
| **#269** | Avertir avant de quitter avec changements non enregistrés | S | enhancement | `beforeunload` + confirmation dialog si dirty form. |

**Total Phase 6 : ~4-6 jours**

---

## PHASE 7 — Contenu & Mesure 📊

> **Milestone :** [#38 Phase 2 — Produit complet](https://github.com/digitaleflex/joinhashcode/milestone/38) + [#39 Nice-to-have](https://github.com/digitaleflex/joinhashcode/milestone/39) (contenus)

**Durée :** 4-6 jours | **Pas de dépendance technique**

| # | Titre | Taille | Priorité | Notes |
|---|-------|--------|----------|-------|
| **#322** | Rédiger les missions M04-M06 | L | high | Contenu réel : seulement 3 missions existent. Rédiger 3 missions supplémentaires. |
| **#323** | Mesurer le funnel d'activation à J+7 | M | high | Métriques : Landing→Quiz→Choice→Orientation→Atelier→Evidence. Seuils de décision. |
| **#328** | Fusionner /talent et /talents | S | low | `/talent` = public, `/talents` = auth. Vérifier si intentionnel ou doublon. |
| **#238** | Missions coming soon | M | enhancement | UI pour afficher des missions "bientôt disponible" avec date estimée. |
| **#336** | feat(missions): weekly challenges (WEEKLY_CHALLENGES vide) | M | P1 | Remplir le tableau WEEKLY_CHALLENGES + rotation hebdo + widget affichage. |
| **#239** | Recherche utilisateur | M | enhancement | Endpoint de recherche côté serveur (aujourd'hui client-side uniquement). |
| **#335** | feat(search): recherche utilisateur côté serveur | M | P1 | Endpoint GET /api/users/search?q=term paginé + rate limité. Remplace le filtre client. |
| **#240** | Gestion candidatures équipe | M | enhancement | Interface admin pour gérer les demandes d'adhésion aux squads. |
| **#337** | feat(admin): dashboard admin pour les candidatures équipe | M | P1 | Page /admin/squads/requests avec liste globale, filtres, actions bulk. |

**Total Phase 7 : ~5-7 jours**

---

## PHASE 8 — DX/UX Polish 🎨

> **Milestone :** [#39 Nice-to-have](https://github.com/digitaleflex/joinhashcode/milestone/39) (24 issues)

**Durée :** 5-8 jours | **Pas de dépendance technique**

| # | Titre | Taille | Priorité | Notes |
|---|-------|--------|----------|-------|
| **#248** | Ajouter loading.tsx skeletons sur dashboard, missions, squad, admin | M | P1 | Routes manquantes : `/specialization`, `/2fa`. |
| **#250** | Remplacer les overrides light-mode par des tokens CSS variables | M | P1 | Nettoyage : les overrides hardcodés en light mode doivent utiliser les variables CSS. |
| **#251** | Créer composant EmptyState réutilisable | M | P1 | Pattern standardisé pour les états vides (aucune mission, aucun squad, etc.). |
| **#252** | Simplifier le data model — merger les modèles 1:1 inutiles | L | medium | UserProfile pourrait être mergé dans User. Audit des relations 1:1. |
| **#253** | Supprimer toast.tsx Radix inutilisé | S | medium | Le fichier existe mais Sonner est le standard. Supprimer la doublure. |
| **#254** | Définir échelle z-index centralisée dans globals.css | S | medium | Variables CSS pour z-index : dropdown, modal, toast, etc. |
| **#255** | Accessibilité : remplacer text-[9px]/text-[10px] par du sémantique | M | medium | Audit contraste WCAG AA + taille min 12px. |
| **#338** | feat(a11y): audit accessibilité WCAG AA complet | L | P1 | Audit complet : contraste, ARIA, navigation clavier, screen reader, prefers-reduced-motion. |
| **#256** | Créer ConfirmDialog pattern standardisé | M | medium | Composant réutilisable pour toutes les actions destructrices. |
| **#257** | Résoudre la confusion proxy.ts vs middleware.ts | S | medium | Next.js attend `middleware.ts`. Renommer ou créer un alias. |
| **#324** | Trancher le sort des 8 modules stub "Module en construction" | S | medium | Soit les implémenter (→ Phase 9), soit les supprimer proprement. |
| **#330** | Configurer Discord webhook pour les alertes monitor | M | infra | Câbler Uptime Kuma + alerts Docker → Discord. |

**Total Phase 8 : ~7-10 jours**

---

## PHASE 9 — Admin Modules (Command Center) 🏛️

> **Milestone :** [#39 Nice-to-have](https://github.com/digitaleflex/joinhashcode/milestone/39) (modules admin)

**Durée :** 15-20 jours | **Dépend de :** Phase 3 (rôles) | **Séquentiel**

> Chaque module est un mini-projet. Les specs existent dans `DOCS/specs/`.

| # | Titre | Taille | Priorité | Spec | Notes |
|---|-------|--------|----------|------|-------|
| **#232** | Module Core (moteur comportemental) | XL | enhancement | `CORE_SPECIFICATION.md` | 7 règles de décision, détection blocages, simulator. |
| **#225** | Module Analytics | L | enhancement | `ANALYTICS_INSIGHTS.md` | KPIs, funnel, cohortes, rétention, rapports. |
| **#229** | Module Mentorat | L | enhancement | `MENTOR_OPERATIONS.md` | Mentors, mentees, sessions, matching. |
| **#226** | Module Ateliers | L | enhancement | `ACADEMY_MANAGER.md` | Catalogue, stats, feedback ateliers. |
| **#227** | Module Parcours | M | enhancement | — | Définition des parcours par spécialisation. |
| **#228** | Module Knowledge Hub | M | enhancement | `KNOWLEDGE_HUB.md` | Docs internes, search, rendu Markdown. |
| **#231** | Module Contenus | L | enhancement | — | Gestion du contenu éditorial. |
| **#230** | Module Interventions | L | enhancement | — | Suivi des interventions externes. |

**Total Phase 9 : ~18-24 jours**

---

## Synthèse par phase

| Phase | Scope | Durée | Dépend de | Bloque |
|-------|-------|-------|-----------|--------|
| **0** | Bugfixes & sécurité | 2-3j | — | Tout |
| **1** | Mission Admin : Socle | 5-8j | Phase 0 | 2-5, 6 |
| **2** | Mission Admin : Builder | 10-14j | Phase 1 | 3-5 |
| **3** | Mission Admin : Operations | 6-9j | Phase 2 | 4-5, 9 |
| **4** | Mission Admin : Review Center | 6-9j | Phase 3 | 5 |
| **5** | Mission Admin : Progression | 10-14j | Phase 4 | — |
| **6** | Missions : UX Membre | 3-5j | Phase 1 | — |
| **7** | Contenu & Mesure | 4-6j | — | — |
| **8** | DX/UX Polish | 5-8j | — | — |
| **9** | Admin Modules | 15-20j | Phase 3 | — |
| | **TOTAL** | **~70-95j** | | |

---

## Ordre d'exécution recommandé

```
Semaine 1-2  : Phase 0 (bugfix) + Phase 1 (socle) + Phase 7 (contenu M04-M06)
Semaine 3-4  : Phase 2 (Builder) + Phase 6 (UX membre)
Semaine 5-6  : Phase 2 (Builder suite) + Phase 3 (Operations)
Semaine 7-8  : Phase 3 (Operations suite) + Phase 4 (Review Center)
Semaine 9-10 : Phase 4 (Review suite) + Phase 5 (Progression début)
Semaine 11-12: Phase 5 (Progression suite) + Phase 8 (DX polish)
Semaine 13+ : Phase 9 (Admin modules — séquentiels)
```

**Parallelisation possible :**
- Phase 7 (contenu) et Phase 8 (DX) peuvent tourner en parallèle de tout le reste
- Phase 6 (UX membre) peut démarrer dès la Phase 1 terminée
- Les 4 fixes P0 de la Phase 0 sont indépendants les uns des autres

---

## Résumé des compteurs

| Catégorie | Nombre |
|-----------|--------|
| Issues à fermer (déjà fait) | 11 |
| Issues actives (existantes) | 84 |
| Nouvelles issues créées | 8 (#331-#338) |
| **Total actif** | **92** |
| Bugs à corriger | 5 (#245, #326, #266, #261, #331) |
| Features Mission Admin | 52 |
| Features autres | 20 |
| DX/UX/Refactoring | 12 |
| EPICS (tracker) | 6 |
| Migration DB nécessaire | 10 (#277, #285, #290, #293, #294, #307, #310, #311, #332, #334) |
| Charge totale | ~75-100 jours |

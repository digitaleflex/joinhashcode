# ROADMAP — Source unique de vérité

> ⚠️ **AMENDEMENT — PIVOT PIPELINE CYBER (17/09/2026) — Décision D-014.**
>
> La roadmap ci-dessous (phases 0-3, KPI 500 actifs, talent pool généraliste) est
> **archivée** : le projet suit désormais `DOCS/PLAN_EXECUTION.md` (plan 12 mois,
> gates mesurables) et `DOCS/PIVOT_CYBER.md` (la vision du pivot). Backlog : EPIC #372.
>
> **Nouvelle hiérarchie des références :**
> `DOCS/PIVOT_CYBER.md` → `DOCS/PLAN_EXECUTION.md` → `PRODUCT_VISION.md` (amendé) → cette page (archive)
>
> **Ce qui est déjà exécuté au 17/09 :** Vague 1 étape 1 complète (découplage D1-D8,
> commit `282ebef`, gate VERT) — voir `DOCS/NETTOYAGE_SUIVI.md`. Les 33 issues de
> l'ancienne roadmap sont fermées (pivot), remplacées par #378-#391.

> **Ce document remplace les 3 anciens ROADMAP.** Il est le seul à faire foi pour
> l'avancement du projet. Les deux autres sont archivés :
> `DOCS/archive/ROADMAP_ISSUES.md` et `DOCS/archive/ROADMAP_PRODUCTION.md`
> (conservés pour l'historique, **ne plus les utiliser comme référence**).
>
> **Document de référence produit :** `PRODUCT_VISION.md` — *la constitution*.
> Elle est supérieure à ce fichier. En cas de contradiction, **`PRODUCT_VISION.md` gagne.**
>
> **Dernière mise à jour :** 2026-09-16, commit `831e8e1` — chiffres **mesurés**, pas estimés.

---

## 0. Les 4 documents de référence (et rien d'autre)

| Document | Rôle | Statut |
|---|---|---|
| `PRODUCT_VISION.md` | **La constitution** — 6 piliers, vocabulaire, anti-patterns | 🔒 **ne plus évoluer** pendant l'implémentation |
| `RAPPORT_STRATEGIQUE.md` | Marché, moat, modèle économique | vivant, revue mensuelle |
| `ABSORPTION.md` | Décommission des 4 codebases | vivant — checklist active |
| `ROADMAP.md` | **ce fichier** — avancement et priorités | vivant |

> ❌ Les roadmaps auto-générés (92 issues, phases Guildes/i18n/Sentry) ont été archivés
> parce qu'ils **rivalisaient avec la constitution**. Voir §4.

---

## 1. Où on en est — mesuré le 2026-09-16

| Phase | Statut | Score mesuré | Base du calcul |
|---|---|---|---|
| **0 — Unification** | 🟡 **en cours** | **74 %** | les 5 actions exigées par `RAPPORT_STRATEGIQUE.md` §8 |
| 1 — Communauté & Progression | ⬜ à faire | ~10 % | squads/missions/check-in existent déjà (héritage) |
| 2 — Certification & revenus | ⬜ à faire | ~0 % | — |
| 3 — Scale | ⬜ à faire | ~0 % | — |
| **Conformité à la constitution** | ⚠️ | **58 %** | moyenne des 6 piliers |
| **Production-ready** | ⚠️ | **~50 %** | tests/sécu/monitoring/qualité |

**Phase 0 a démarré le 2026-09-11. Nous sommes en semaine 1 sur 4.**

### Détail des 5 actions de la Phase 0

| # | Action exigée | Statut | Preuve |
|---|---|---|---|
| 1 | 1 schema Prisma unifié | ✅ **100 %** | 64 modèles, `prisma validate` ✅ |
| 2 | Import funnel reboot → `/acquisition` | ✅ **100 %** | `/`, `/profiling`, `/invite` → 200 |
| 3 | 1 auth better-auth | ✅ **100 %** | `lib/auth.ts` |
| 4 | Redirects 301 « zéro dispersion » | 🟡 **30 %** | 3 redirects (`/cgu`, `/mentions-legales`, `/talent`) ; `reboot.joinhashcode.com → /acquisition` **non câblé** |
| 5 | **Import academy hashskills → `/academy`** | 🟡 **40 %** | catalogue + inscription OK ; **moteur LMS absent** |

---

## 2. 🔴 Les bloqueurs de la Phase 0 (par ordre d'impact)

| # | Bloqueur | Constat mesuré | Effort |
|---|---|---|---|
| **B1** | **Moteur LMS absent** | la page leçon (`app/academy/my-courses/[id]/page.tsx`) affiche une **liste de titres** — aucun lecteur, aucun contenu accessible. `Progress` = **0 usage**, `CourseQuiz`/`CourseQuestion`/`CourseOption` = **0**, `Resource` = **0** | 2-3 j |
| **B2** | **L'Evidence n'existe pas** | `grep -ci "evidence" prisma/schema.prisma` → **0**. Aucune route `/evidences`. Or la constitution : *« Une compétence n'est pas acquise tant qu'elle n'est pas prouvée »* | 3-4 j |
| **B3** | **CORE / Kalman supprimé** | **zéro trace** de Kalman dans le code. Or c'est le **pilier n°3 du moat** | décision |
| **B4** | **Vocabulaire non appliqué** | la nav affiche « Console », « Mon Dossier », « Guide de l'Agent ». La constitution impose « Mon Parcours », « Diagnostic », « Portfolio d'evidences » et **rejette** le jargon « Agent » | 1 j |
| **B5** | **Admin academy absent** | aucun course builder → **aucun cours ne peut être créé**, la base est figée au seed. 3 modules admin encore en « Module en construction » (ateliers, knowledge-hub, mentorat) | 3-4 j |

> ⚠️ **B2 et B3 sont plus graves que B1.** B1 est un manque fonctionnel ; B2 et B3
> sont des **atteintes à la raison d'être du produit** — sans Evidence il n'y a ni
> portfolio, ni certification, ni talent pool, donc **pas de modèle B2B**.

---

## 3. Décision structurante : **parcours, pas catalogue**

`PRODUCT_VISION.md` tranche explicitement :

> *« Chaque atelier est une **étape d'un parcours**, pas un contenu isolé. »*
> *« ❌ Vendre des ateliers comme des cours isolés »*
> *« ❌ Demander à l'utilisateur de choisir quoi faire sans guidance »*
> *« CORE retourne une décision unique : **la prochaine meilleure étape** »*

| | ❌ Catalogue / LMS | ✅ Parcours (la vision) |
|---|---|---|
| L'unité | le cours | **l'étape** |
| Qui décide | l'utilisateur | **CORE prescrit**, l'utilisateur valide |
| Le point d'entrée | `/academy` | **`Mon Parcours`** |
| Fin d'une leçon | « cours suivant » | **« Prouver » → Evidence** |

**Conséquence :** le contenu de `hashskills` est le **réservoir**, il n'est pas à jeter.
Ce qui manque, c'est la **couche parcours** au-dessus. Et **l'ordre de construction
s'inverse** : l'**Evidence d'abord** (B2), le lecteur d'étape ensuite (B1).

> ⚠️ Enjeu business : un cadrage « LMS » ramène mécaniquement le modèle **B2C**
> (cours payants) que la constitution interdit. Voir §4.

---

## 4. ⛔ Périmètre ÉLIMINÉ — décisions acquises, ne pas rouvrir

Toute proposition qui retombe ici doit être **refusée** avec un lien vers cette section.

| Élément éliminé | Motif | Référence |
|---|---|---|
| **Guildes** (`Guild`/`GuildMember`, `/guilds`) | Absentes des 6 piliers. Squad/Organization couvrent déjà le besoin. L'ancien roadmap **affirmait à tort** qu'elles étaient dans le schéma | constitution |
| **`finance`, `transactions`, `revenue`, `subscriptions`** (hashskills) | **B2C** — « jamais de paiement membre ». Aucun Stripe dans la source | constitution §5 |
| **Blog, Events, RSVP** | Absents des 6 piliers | constitution |
| **i18n complète** (`next-intl`, FR→EN) | « Expansion géographique » = Phase 3 | `RAPPORT_STRATEGIQUE` §8 |
| **Sentry, audit a11y complet, Lighthouse, bundle-analyzer** | Industrialisation, pas produit | — |
| **Les 92 issues de l'ancien `ROADMAP_ISSUES.md`** | Backlog auto-généré rivalisant avec la constitution | `DOCS/archive/` |
| **6 modèles/moteurs morts** | `AdminKey`, `AdminAuditLog`, `LearningAuditLog`, `EmailProviderMetric`, `MemberEmailLog`, `EmailEvent`, `MemberBlacklist`, `ProfilingDraft`, `MemberSession`, `Event`, `EventRsvp` → **supprimés du schéma le 2026-09-16** | — |

---

## 5. Phases suivantes (rappel — `PRODUCT_VISION.md` fait foi)

### Phase 1 — Communauté & Progression (semaines 5-10)
Discord squads/projets · pont WhatsApp → plateforme · **parcours guidé** (roadmap perso par domaine) · dashboard membre (progression visible) · micro-challenge à l'inscription
**Cible :** 500 membres actifs · 25 % actifs/semaine · +40 % missions complétées

### Phase 2 — Certification & premiers revenus (semaines 11-18)
Workflow de certification (mentors valident les evidences) · espace recruteur · **1er contrat agence** · talent pool v1
**Cible :** 25 profils certifiés · 3 contrats · 10 entreprises

### Phase 3 — Scale (semaines 19-26)
Matching IA (CORE étendu) · webinars/events live · boucle feedback entreprises · rétention J30/J60/J90
**Cible :** 1000 membres · unité économique en vue

---

## 6. KPIs — à suivre chaque semaine

| KPI | Cible 6 mois |
|---|---|
| Membres actifs (7 jours) | **500** |
| Complétion profiling | **+30 %** |
| Missions complétées | **+40 %** |
| Profils certifiés | **25** |
| Contrats agence | **3** |
| Entreprises en contact | **10** |
| Rétention J30 | **> 40 %** |

---

## 7. Règles non négociables

1. **1 codebase** — pas de second projet Next.js
2. **1 schema Prisma** — pas de duplication de modèles
3. **1 auth** — better-auth unique
4. **1 branche `main`** — feature flags pour les expérimentations
5. Nouvelle feature → **PR avec test + doc**
6. Import → **dossier module** (`/acquisition/`, `/academy/`), **jamais à la racine**
7. Décision architecturale → documentée
8. **`PRODUCT_VISION.md` ne se modifie plus.** On exécute, on teste, on mesure.

---

## 8. Le gate — aucune avancée sans preuve

```bash
npm run verify        # gate complet : types → lint → prisma → 15 sondes HTTP → E2E
npm run verify:fast   # types + lint + prisma (sans réseau)
```

Dernier passage **GATE VERT** : 2026-09-16 sur `831e8e1` — types ✅ · lint ✅ · prisma ✅ ·
15/15 sondes ✅ · **22 E2E passés** ✅.

> ⚠️ **Prérequis du gate :** Docker Desktop doit tourner (la base Postgres est dans WSL2)
> et la RAM doit être disponible (~2-3 Go libres pour `tsc`).
> Piège connu : `.next/dev/types` se corrompt quand le dev server est tué → `tsc` échoue.
> **Réflexe : purger `.next` avant de diagnostiquer.**

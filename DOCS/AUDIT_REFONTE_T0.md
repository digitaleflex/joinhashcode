# T0 — Complément de cadrage validé — Refonte vitrine internationale HASHCODE

> Suite de `DOCS/AUDIT_REFONTE_PHASE0.md`. Lecture seule du code, aucune donnée créée, aucune migration.
> Date : 2026-10-31.
> Décisions de validation : inventaire réel exigé (Active/Developing/Coming soon) ; divergence ADMIN/MODERATOR sortie du périmètre (tâche indépendante) ; thème hybride à valider techniquement ; périmètre vitrine + UX membre, hors backend/admin/squads/destructif.
> Principe : *Transform the experience, preserve the product, strengthen the ecosystem.*

## 1. Inventaire des domaines réellement disponibles

Sources : `lib/ateliers.ts`, `lib/missions.ts`, `prisma/seed.ts`, `prisma/seed-academy.ts`, `lib/mission-tech-tree.ts`, `app/specialization`, `app/acquisition/profiling`, `app/academy/*`.

| Source | Contenu réel |
|---|---|
| Ateliers `lib/ateliers.ts` | **12** en mémoire uniquement (`Atelier` DB vide, jamais seedé). 3×builder (`html-css-responsive`, `linux-cloud-basics`, `architecture-solid`), 3×creator (`figma-basics`, `graphic-design-basics`, `content-strategy`), 3×strategist (`product-management`, `data-analysis-intro`, `design-thinking`), 3×catalyst (`community-management`, `project-management-intro`, `partner-identification`). Tous `order:1, xpReward:50`, tous pointent vers `missionSlugs:[premiere-preuve-maitrise]` **inexistante** (lien mort). |
| Missions `lib/missions.ts` + steps | **8 + 4 weeklies = 12 slugs** seedés. Utilisables : M01 découverte (INTRO, 5 steps), M02 idée→projet (BUSINESS, 10 steps), M03 problème→solution (PRODUCT, 12 steps), M04 ML-fundamentals (CODE), M05 CI/CD (CODE), M06 mobile-first (CODE). `comingSoon` : M07 design-system, M08 business-model. Weeklies : API, design écran, mini-atelier, outil IA. |
| Academy `seed-academy.ts` | **1** programme (`hef`), **4** phases, **17** piliers publiés, **5** catégories (Fondamentaux, Web, Data, DevOps, Sécurité), **3** cours (`hef-algorithmique`, `hef-bases-donnees`, `hef-devops`), 6 sections / 18 contenus / 3 quiz / 4 badges. Cat. `Web` et `Sécurité` : **0 cours**. |
| `Specialization` / `ProfileContent` DB | **0 / 0** — modèles vides, jamais seedés. Les 12 spécialisations `lib/mission-tech-tree.ts` sont code-only avec **60 `missionId` fantômes** sans slug DB. |
| Quiz `/specialization` | **10** `PrimaryDomain` : Web, Cybersecurity, Cloud, IA (+ Mobile, Automation, UI/UX, Web3, Data, DevOps). Sous-domaines réels pour 4 seulement. |
| Acquisition `/acquisition/profiling` | **3** domaines : `web`, `cybersecurity`, `ai`. |

## 2. Classification de maturité (comptes seuls, zéro fiction)

| Domaine | Ressources | Activités opérationnelles | Statut |
|---|---|---|---|
| Cloud & DevOps | 1 atelier (linux), 1 mission (M05), 1 cours (`hef-devops`) + pilier | Oui | **Active** |
| IA / Data | 1 atelier (data-intro), 1 mission (M04), 1 cours (`hef-bases-donnees`) + piliers, weekly IA | Oui | **Active** |
| Produit / Stratégie | 2 ateliers (product-mgmt, design-thinking), M02+M03 généralistes | Oui (généraliste, M08 à venir) | **Active** |
| Fondamentaux ingénierie (HEF) | 1 programme, 4 phases, 17 piliers, 1 cours algo | Oui (`/academy/paths|programme`) | **Active** |
| Web / Fullstack | 1 atelier (html-css), 0 mission dédiée, 0 cours | Partiel : atelier seul | **Developing** |
| Mobile | 0 atelier, 1 mission (M06) | Partiel : mission seule | **Developing** |
| Design UX/UI + Graphique | 2 ateliers (figma, design-graphique), M07 `comingSoon` + weekly design | Partiel (Active à la sortie M07) | **Developing** |
| Contenu / Création | 1 atelier (content-strategy) | Partiel | **Developing** |
| Communauté / Partenariats / Projet | 3 ateliers catalyst + weekly community | Partiel | **Developing** |
| Architecture | 1 atelier (SOLID) + piliers sans cours | Partiel | **Developing** |
| Cybersécurité | 0 atelier, 0 mission, 0 cours (1 pilier sans cours) ; affichée quiz+acquisition | Non | **Coming soon** |
| Automation / Web3 | 0 contenu, quiz seul | Non | **Coming soon** |

Présentable publiquement : 4 Active + 6 Developing (périmètre honnête). Cybersécurité/Automation/Web3 : badge `Coming soon`, jamais `opérationnel`.

## 3. Navigation publique finale proposée

```
HASHCODE  Programs  Labs  Community  Talents  Opportunities*  About  [Sign in] [Join]
* Opportunities conditionnée : affichée seulement si contenu réel, sinon masquée ou "À venir".
```

- `/talents` vitrine publique (via `/api/public/talent` + `/u/[pseudo]`, filtre `talentVisible + missionsCompletedCount>=1`). L'actuelle `/talents` protégée doit déménager (voir §5).
- `/contact` gardé (endpoint `POST /api/contact` inchangé), re-skin.
- `/team` fusionné → `/about#equipe` + redirect 308 `/team → /about`. `/guide` reste membre, non exposé.
- CTA conversion modèle `/invite/[slug]` : page publique, auth seulement à l'action (`signin?callbackURL=`), jamais de garde `proxy.ts`.

## 4. Stratégie thème hybride (validation technique)

Contrainte : un seul `<html>/<body>` (`app/layout.tsx`). Un layout `(site)` imbriqué **ne peut pas** le redéfinir.

**Retenue : B — wrapper scopé, pas de `forcedTheme` global.**
- `(site)/layout.tsx` rend `<div class="site-light" data-theme="light">` ; bloc CSS `.site-light { <tokens :root ivoire/émeraude> ; color-scheme: light; }` neutralisant l'héritage `.dark`.
- `providers.tsx` (`defaultTheme="dark"`) inchangé, `<html>` global intact, zéro flash, zéro impact membre.
- Option A (`forcedTheme="light"` imbriqué) rejetée : mute `<html>` global en navigation client → flash light↔dark + n'efface pas les 46 hardcodes `bg-zinc-950/text-white` (îlots dark).
- Option C (couleurs en dur) rejetée : dette palette dupliquée.
- **Prérequis T1 obligatoire :** re-skin des 46 hardcodes `landing/` vers tokens sémantiques (`bg-background`, `text-foreground`, `border-border`, `--surface-*`).

## 5. Cartographie définitive des routes

| URL | État | Action |
|---|---|---|
| `/` | Existe (publique, ISR 3600) | Re-skin : nouveau Hero 8 sections, garder `getLandingStats` |
| `/about` | Libre | Créer |
| `/programs` | Libre | Créer (tableau §2) |
| `/labs` | Libre | Créer (`Mission PUBLISHED` + ateliers `isActive` + weeklies) |
| `/community` | Libre | Créer (stats réelles + talents opt-in + interventions `PUBLISHED`) |
| `/talents` | **Collision** (protégée, shell dashboard) | **Arbitrage requis :** déplacer l'appli (ex. `/dashboard/talents`), libérer `/talents` en vitrine |
| `/opportunities` | Libre | Créer **conditionnée** (aucun modèle `Opportunity` — masquer/`À venir` tant que vide) |
| `/contact` | Existe (publique) | Re-skin, garder `POST /api/contact` |
| `/signin` | Existe (`(auth)`) | Inchangé |
| `/team` → `/about` | Existe | Fusion + redirect 308 |
| `/guide` | Protégée | Garder membre, ne pas exposer |
| `/squad*` | Gelé | Ne jamais réutiliser le préfixe (`startsWith("/squad")`) |

Règles `proxy.ts` : nouvelles pages **hors `PROTECTED_PATHS`**, jamais de préfixe protégé détourné, matcher inchangé.

## 6. Conflits et garde-fous techniques

1. **`/talents` protégée vs vitrine** — bloquant T2 : trancher le déménagement avant création vitrine.
2. **`ADMIN vs MODERATOR`** — hors périmètre (tâche indépendante + tests permissions), documenté, non traité ici.
3. **Aucune `Evidence`** (`User.portfolioUrl` seul) — Proof = `missionSubmission APPROVED` + `/u/[pseudo]` + certificats Academy. `testimonials.tsx` = démo → ne pas présenter comme preuve.
4. **`goal90days` zod sans colonne DB** — ne pas exposer avant réconciliation (migration dédiée, hors phase 1-2).
5. **Lien mort `premiere-preuve-maitrise`** (12 ateliers) — aucun CTA vers lui ; fix chaînage en T4.
6. **Spécialisations code-only fantômes** — progression 0 % réelle, ne pas chiffrer.
7. **`GET /api/missions` (401 + sans filtre `status`)** — nouvelle requête publique `status:PUBLISHED, deletedAt:null`, select allowlist (exclure `evaluatorNotes`, soumissions, reviews).
8. **`/talents` interne sans `talentVisible`** — vitrine = `/api/public/talent` uniquement (allowlist stricte, `take:50`).
9. **`totalMembers`** = réel (`role:MEMBER, banned!=true`) — ne pas gonfler, ne pas exposer `realUserCount`.

Données vitrine autorisées : `getLandingStats` (OUI, cache 300s, fallback 0), `/api/public/talent` (OUI), `/u/[pseudo]` (OUI avec `isPrivate`), `Mission PUBLISHED` (OUI nouvelle requête), `Intervention PUBLISHED` (OUI), `Atelier/Specialization isActive` (OUI si non-vide), `Course/Program isPublished` (OUI). Interdites : `/talents` interne, `/api/missions` GET, `testimonials.tsx`, `Opportunities` fictives.

## 7. Plan T1–T5 ajusté

- **T1 socle** : `feat(site): groupe (site) + layout wrapper scopé + nav/footer` → `fix(site): re-skin 46 hardcodes vers tokens` → `feat(seo): sitemap étendu + metadata`. Gate : vitrine light isolée, dashboard dark inchangé (captures avant/après).
- **T2 vitrine** : arbitrage `/talents` d'abord, puis 1 commit/page (`about`, `programs` depuis §2, `labs`, `community`, `opportunities` conditionnée), home en 4 commits (`hero+what-we-do`, `programs+labs`, `proof+community`, `opportunities+final-cta`).
- **T3 navigation** : redirects `/team→/about`, CTA `callbackURL`, copy dé-jargonnée.
- **T4 membre** : copy sans logique → dashboard prochaine-action → portfolio preuves réelles (+ fix `premiere-preuve-maitrise`, hors squad/admin).
- **T5 validation** : e2e public/auth/permissions, responsive/a11y/seo, `npm run build` avant push code.

**En attente de validation :** arbitrage `/talents` (§5) et tableau §2 comme source unique des contenus vitrine.

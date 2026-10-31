# PHASE 0 — AUDIT ET CADRAGE — Refonte vitrine internationale HASHCODE

> Source : prompt maître de refonte. Audit en lecture seule, aucun code modifié.
> Date : 2026-10-31. Dépôt : `digitaleflex/joinhashcode`.
> Principe directeur : *Transform the experience, preserve the product, strengthen the ecosystem.*

Signature cible : **Build skills. Prove expertise. Create opportunities.**
Mission : permettre aux individus d'apprendre, d'expérimenter, de construire des projets, de démontrer leurs compétences et de transformer leur expertise en opportunités. Positionnement universel, pas exclusivement africain, pas simple académie, pas uniquement cybersécurité.

---

## 1. Architecture actuelle

**Stack réelle (à préserver) :** Next.js 16 App Router + React 19 + TypeScript, Tailwind v4 CSS-first (`app/globals.css`, pas de `tailwind.config`), shadcn/ui New York (32 composants `components/ui`), Prisma 7 + PostgreSQL, Better Auth (`lib/auth.ts` : Google/GitHub/MagicLink/OTP/2FA, plugins `admin/organization/multiSession`), pnpm. `output: standalone`, SEO de base (`robots.ts`, `sitemap.ts` pauvre, OG).

**Structure :**
- `app/` : ~70 routes pages + ~60 routes API.
- `components/` : ~150 fichiers — `ui/32`, `dashboard/44` (dont `squad/` 15), `admin/26`, `landing/9`, `quiz/11`, `missions/12`, `settings/6`, `academy/4`.
- `lib/` : ~60 modules (`missions`, `ateliers`, `auth`, `squad-logic`, `mission-engine`, ...).
- `prisma/` : ~30 modèles.
- `proxy.ts` : unique middleware. `locales/` fr/en — uniquement labels missions.

**Points structurants :**
- Seulement 2 layouts : `app/layout.tsx` (root, `defaultTheme="dark"`, fonts Syne/Outfit/IBM Plex Mono, `themeColor #c5f441` lime) et `app/admin/layout.tsx` (`ADMIN/MODERATOR`, shell zinc-950). Aucun layout `(auth)` / `(public)` / `(member)`.
- Garde d'accès : `proxy.ts` + `lib/auth-guard.ts` (`requireSession`, `requireRole`, `checkCsrfOrigin`). Funnel 3 étapes : `!currentSituation → /onboarding`, `!class → /quiz`, `!primaryDomain → /specialization`.
- Kill-switch Pivot Cyber : `/squad* → /dashboard`, `/api/squad* → 404 Module gelé`. Crons squad freezés. Code squad conservé mais inactif.
- Divergence connue : proxy `/admin*` n'accepte que `ADMIN`, layout accepte `ADMIN+MODERATOR` → modérateurs bloqués en amont.
- Sitemap : 4 URLs statiques seulement (`/`, `/quiz`, `/privacy`, `/terms`). i18n : `lang="fr"`, FR dominant, EN = labels missions.

## 2. Routes et fonctionnalités

**Public (resteront publiques) :** `/`, `/signin`, `/2fa`, `/contact`, `/cookies`, `/privacy`, `/terms`, `/legal`, `/team`, `/guide`, `/talents`, `/u/[pseudo]`, `/leaderboard`, `/invite/[slug]`, `/invite/accept`, `/academy` + `courses/paths/programme/diplomas`, `/acquisition*`, `/offline`, `/maintenance`, `/reactivate`.

**Protégé (session + funnel) :** `/dashboard`, `/onboarding`, `/quiz`, `/specialization`, `/missions`, `/missions/[id]`, `/ateliers`, `/ateliers/[slug]`, `/dossier`, `/settings`, `/feedback`, `/reviewer`, `/academy/my-courses*`, `/academy/certificates`.

**Gelées (Pivot Cyber) :** `/squad`, `/squad/discover`, `/squad/manage`, `/squad/leaderboard`, `/squad/[slug]` (+ toutes les API `/api/squad/*`).

**Admin (27 pages) :** `users, missions (+new/analytics/review/attempts/[attemptId]/[id]/preview), submissions, analytics, squads (+join-requests), ateliers, interventions (+new/[id]), feedback, ux-poll, activity, notifications, keys, core, parcours, contenus, knowledge-hub, mentorat, fraud`.

**API :** auth catch-all `[...all]` + `middleware-session` + `beta-verify`, `onboarding` + `post-quiz`, `quiz/feedback|retry`, `specialization`, `missions` (claim/review/attempt/submit), `feed`, `reviewer`, `user/*` (me/update/avatar/export/deactivate/reactivate/delete/check-pseudo/quiz-status/j7-activation/checkin/notifications), `squad/*` (gelées), `admin/*` complet, `internal/cron/*` (`CRON_SECRET`), `contact`, `public/talent`, `og`, `status`, `log/client-error`, `webhooks/resend`.

Redirections `next.config.mjs` (308) : `/cgu → /terms`, `/mentions-legales → /legal`, `/talent → /talents`.

## 3. Composants et layouts réutilisables

**Réutilisable (re-skin light) :**
- `components/ui/*` (32) : socle sain, forcer variants clairs + tokens light.
- `components/brand/logo.tsx` : base vectorielle à décliner light/dark (remplace PNG `hashcodejoin.png`).
- `landing/nav.tsx` : structure session-aware OK → ivoire opaque + toggle thème + liens éditoriaux.
- `landing/faq.tsx`, `missions-preview.tsx`, `testimonials.tsx` : patterns solides (accordéon, grille sticky, carrousels aria) → tokens clairs. Bug à corriger : `missions-preview` utilise `text-primary` comme couleur hex → différenciation profils cassée.
- `hero-section.tsx` (`getLandingStats`) + `activity-feed.tsx` : preuve sociale → bandeau statique 3 chiffres.

**À refaire :** `landing/hero.tsx` (`text-white` hardcodé, `scanline/dot-grid`, `uppercase font-black`, jargon `Builders synchronisés`), `footer.tsx` (`évolution neuronale / NOUVELLE ÈRE`), `final-cta.tsx` (ton injonctif), 46 occurrences `bg-zinc-950/text-white/border-white/*` dans `landing/`, utilitaires `cyber-notch/grid/laser/hazard/hud-pulse/btn-primary-glow` bannis de la vitrine.

## 4. Fonctionnalités à préserver (interdiction de casser)

1. Better Auth + sessions + 2FA + org plugin.
2. Funnel onboarding → quiz (`app/actions/quiz.ts`, anti-repass, anti-triche) → specialization.
3. Double-stack missions : `MissionAttempt/StepResponse/ReviewLog` (guidé) + `MissionSubmission/Review` (peer + claim) + reviewer + crons (`release-claims`, `close-overdue`, `deadline-reminders`, `review-sla`, `publish-scheduled`).
4. Ateliers (`Atelier` + `missionSlugs`), `Specialization`, `ProfileContent`.
5. Dossier `/dossier` + `/u/[pseudo]` + `/api/public/talent`, check-in/XP/streak, notifications, feed, `ActivityLog` fire-and-forget.
6. Admin complet + Academy LMS + `Intervention` + `KnowledgeArticle`.
7. Squads : ne pas supprimer, même gelés. Zéro migration destructive, zéro suppression Prisma, zéro réécriture backend.

## 5. Problèmes UX / visuels identifiés

1. **Dark-only effectif** malgré tokens light prêts (ivoire/émeraude vs charcoal/lime, AA). Pas de toggle public.
2. **Jargon cyberpunk excluant** : `Builders synchronisés, guilde, Nexus, NOUVEAU_MEMBRE, nouvelle ère, Contact_Support`.
3. **Typo HUD** : base 14px, `uppercase italic font-black` systématique, body en Syne display au lieu d'Outfit, micro-textes 7px (`text-3xs`).
4. **Contraste** : `text-zinc-400/500/600` sur `zinc-950` omniprésent, `primary/5` quasi invisible.
5. **Responsive** : hero `min-h-screen` trop haute sur mobile, flèches testimonials chevauchantes à 360px.
6. **A11y partielle** : FAQ custom sans `aria-expanded`, carrousels sans clavier ni `aria-live`, texte < 12px, contenu EN mêlé dans `lang="fr"`.

## 6. Écarts avec la nouvelle vision

| Vision cible | Réalité | Écart / règle |
|---|---|---|
| Signature EN `Build skills. Prove expertise. Create opportunities.` | Hero FR `Quel type de builder es-tu ?` | Refonte copy, FR par défaut, EN préparé |
| 8 pages vitrine (`/about/programs/labs/community/talents/opportunities/contact`) | Seulement `/talents/contact/team/guide/academy` existent | 5 pages à créer, contenus réels uniquement |
| Programs = Cybersecurity / Software / IA / Cloud-DevOps / Emerging | `Specialization` + `Atelier` existent mais inventaire exact à figer | Ne jamais présenter comme opérationnel ce qui ne l'est pas |
| `Proof of Skills` / portfolios vérifiés | Aucun modèle `Evidence`, seul `User.portfolioUrl` ; `goal90days` zod sans colonne DB | Vitrine = `missions APPROVED` + `/u/[pseudo]` + certificats Academy uniquement |
| `Labs` | Missions + Academy existent, pas de concept `Lab` nommé | Mapper `Lab = Mission/Atelier pratique`, ne pas créer de modèle |
| Light éditorial public / Dark membre | Dark partout | Groupe `(site)` light à créer, membre dark inchangé |
| Internationale | FR-only effectif | Préparer i18n (structure, `lang`, metadata) sans full `next-intl` en phase 2 |

## 7. Architecture cible recommandée

```
app/
  layout.tsx              (root inchangé)
  (site)/                 NOUVEAU groupe public light
    layout.tsx            (nav light + footer éditorial, light forcé, SEO)
    page.tsx              (Hero 8 sections)
    about/page.tsx        (NOUVEAU)
    programs/page.tsx     (NOUVEAU, données DB réelles)
    labs/page.tsx         (NOUVEAU = missions/ateliers pratiques)
    community/page.tsx    (NOUVEAU = stats réelles + talents + interventions)
    talents/page.tsx      (EXISTANT à re-skin, ne pas déplacer)
    opportunities/page.tsx(NOUVEAU, seulement opportunités réelles)
    contact/page.tsx      (EXISTANT à re-skin)
  (member)/ ou existant   INCHANGÉ fonctionnellement (re-skin phase 3)
  admin/                  INCHANGÉ (sauf fix MODERATOR si validé)
```

- Théming hybride : `ThemeProvider` gardé ; `(site)/layout` force `light` + tokens ivoire/émeraude, membre garde `dark`. Réutiliser `ui/*`.
- Données vitrine = lecture seule DB existante (`Specialization where isActive`, `Atelier where isActive`, `Mission where status=PUBLISHED`, `getLandingStats`, `User talentVisible`). Aucun schéma requis en phase 2.
- Zéro suppression d'ancienne route. Nouvelles pages = nouvelles URLs.

## 8. Plan de modifications fichier par fichier

**Phase 1 — socle :** CRÉER `app/(site)/layout.tsx`, `components/site/site-nav.tsx`, `site-footer.tsx`, `section-heading.tsx`, `stat-band.tsx` ; MODIFIER `app/globals.css` (body Outfit, Syne aux titres) ; ÉTENDRE `components/brand/logo.tsx`, `app/sitemap.ts`, `robots.ts`, metadata `app/layout.tsx`.

**Phase 2 — vitrine :** CRÉER `app/(site)/page.tsx` + `components/site/home/*` (hero, what-we-do, programs, labs, proof, community, opportunities, final-cta) ; CRÉER `about|programs|labs|community|opportunities/page.tsx` ; RE-SKIN `talents`, `contact`, `team`. `app/page.tsx` actuel : basculer seulement après validation.

**Phase 3 — membre (sans backend) :** RE-SKIN `dashboard`, `quiz`, `missions`, `settings` (copy dé-jargonnée, hiérarchie progression / prochaine action).

**Phase 4 — validation :** e2e public + auth + permissions + responsive/a11y/seo + `npm run build`.

## 9. Risques techniques et prévention

| Risque | Prévention |
|---|---|
| Casser funnel `proxy.ts` / session | Ne pas toucher `proxy.ts`, `lib/auth*.ts` en phase 1-2 ; tester `?callbackURL` + `/invite/[slug]` |
| Casser Better Auth / OAuth www vs non-www | Ne toucher ni `[...all]` ni cookies ; vérifier `trustedOrigins` en preview |
| Contenu fictif | Chaque carte liée à une ligne DB ; sinon badge `Coming soon`, jamais `opérationnel` |
| Régression dark membre | Tokens sémantiques obligatoires dans `(site)` ; grep `zinc-950/text-white` en gate |
| Divergence `ADMIN vs MODERATOR` | Hors périmètre sauf validation explicite |
| Squad gelé réactivé par erreur | Garder kill-switch ; aucun lien vitrine vers `/squad*` |
| Schéma divergent (`goal90days`) | Zéro migration en phase 1-2 |
| Build standalone / Traefik | `npm run build` avant chaque push code ; docs seuls sans build |

## 10. Découpage en tâches exécutables

Règle repo permanente : 1 intention = 1 commit granulaire, gate `npm run verify` dans le body, jamais code + docs pivot mélangés.

- **T0** : valider ce plan + inventaire réel des domaines (`Specialization`/`Atelier`/`Mission`).
- **T1 socle** : `feat(site): groupe (site) + layout light + nav/footer` → `feat(site): tokens typo + logo` → `feat(seo): sitemap + metadata`.
- **T2 home** : 4 commits (`hero+what-we-do`, `programs+labs`, `proof+community`, `opportunities+final-cta`), données réelles.
- **T3 pages** : 1 commit par page (`about`, `programs`, `labs`, `community`, `opportunities`), re-skin `contact/talents`.
- **T4 membre** : `refactor(member): dé-jargon copy` → `feat(member): dashboard prochaine-action` → `feat(member): portfolio preuves réelles`.
- **T5 validation** : `test(site): e2e + a11y/seo` → `docs(refonte): rapport validation`.

**Question T0 en attente :** confirmer la liste des domaines réellement opérationnels à afficher, et si le fix `proxy ADMIN→ADMIN/MODERATOR` est dans le périmètre.

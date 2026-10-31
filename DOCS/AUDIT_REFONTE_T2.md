# T2 — Site public : état d'avancement (code terminé, validation live en attente)

> Suite de `DOCS/AUDIT_REFONTE_PHASE0.md` et `DOCS/AUDIT_REFONTE_T0.md`.
> Date : 2026-10-31. Scope : T2.1 → T2.4 (code). Validation live §15 en attente (machine partagée occupée par un build concurrent).

## Décisions appliquées
- Home 100 % statique (`revalidate = 3600`), zéro requête DB → aucun risque build/ISR.
- Pages DB (`/labs`, `/community`, `/talents`) en `force-dynamic` + `safe()` : le build ne crashe plus si la DB est injoignable (leçon : `EAI_AGAIN` cassait le prerender `/talents`).
- `/opportunities` : aucun modèle, aucune route, aucun lien — masquée partout (nav, footer, home).
- Aucune donnée fictive : counts via `getPublicStats`, listes via allowlists, empty states honnêtes.
- `proxy.ts`, Better Auth, Prisma, API : intacts. Anciens `landing/*` conservés (encore utilisés par le dashboard).

## Commits T2 (poussés)
- `b361621` lib `site-data` + `/about`
- `1572b09` résilience build DB (`safe()` + `force-dynamic`)
- `26e13d6` `/programs` `/labs` `/community`
- `15fa4fb` source éditoriale partagée `site-programs`
- `8cbc5d2` home 7 sections (Opportunities masquée)
- `6a5edcd` menu mobile `SiteNav`

## Gates par commit
`tsc --noEmit` 0 erreur, `eslint` 0 erreur à chaque commit. `npm run build` complet : bloqué par build concurrent sur la machine (lock Next.js) — à rejouer dès libre, avant validation T2.

## Reste pour clore T2 (§15)
1. `npm run build` vert sur machine libre.
2. `npm run verify` (sondes + E2E) avec serveur live.
3. Captures : `/`, `/programs`, `/labs`, `/community`, `/talents`, `/about` (clair) + `/dashboard` (sombre, session requise).
4. Nettoyage `landing/*` orphelins (hero-section, missions-preview, faq, testimonials, final-cta côté vitrine) — seulement après validation.
5. Ancien `/team` (design pré-refonte) : hors périmètre, à arbitrer (redirect `/about#equipe` proposé en T0).

## Prochaine étape
Validation live ci-dessus, puis T3 (UX membre) — interdit avant validation T2.

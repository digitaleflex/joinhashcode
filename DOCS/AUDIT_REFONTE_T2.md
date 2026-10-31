# T2 — Site public : état d'avancement (code terminé, validation live en attente)

> Suite de `DOCS/AUDIT_REFONTE_PHASE0.md` et `DOCS/AUDIT_REFONTE_T0.md`.
> Date : 2026-10-31. Scope : T2.1 → T2.4 (code). Statut final : **VALIDÉE techniquement** (build vert 2026-10-31, sondes live vertes, captures vérifiées).

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

## Verdict final (§15)
- `npm run build` : **VERT** (`BUILD_EXIT:0`, 0 prerender error ; `/about`+`/programs` statiques, `/labs`+`/community`+`/talents` dynamiques, `/dashboard/talents` protégée compilée).
- Sondes live (dev) : `/ /about /programs /labs /community /talents /contact` → 200 ; `/dashboard` → 307 (garde intacte).
- Captures desktop+mobile (12/12) : thème clair ivoire/émeraude, menu mobile OK, empty states honnêtes, footer complet.
- Reste hors T2 : `npm run verify` complet + capture dashboard sombre (session requise, à faire avec un compte) ; nettoyage `landing/*` vitrine orphelins ; arbitrage `/team`.
- T3 (UX membre) : autorisée — T2 validée.

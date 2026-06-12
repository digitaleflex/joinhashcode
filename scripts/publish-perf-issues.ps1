#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Publie les 22 issues de performance et les 4 milestones sur GitHub.
  Script crÃ©Ã© le 2026-06-12 Ã  partir de l'audit PERF_ISSUES.md.

.DESCRIPTION
  - CrÃ©e 4 milestones (M0, M1, M2, M3)
  - CrÃ©e 22 issues avec labels, milestone et checklist
  - Idempotent : vÃ©rifie si le milestone/issue existe dÃ©jÃ  avant de crÃ©er

.USAGE
  pwsh scripts/publish-perf-issues.ps1
  # Dry-run (affiche sans crÃ©er) :
  pwsh scripts/publish-perf-issues.ps1 -DryRun
#>

param(
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$REPO = "digitaleflex/joinhashcode"

# â”€â”€â”€ Labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$labels = @(
    @{ name = "perf"; color = "e99695"; description = "Performance & ScalabilitÃ©" },
    @{ name = "security"; color = "d73a4a"; description = "SÃ©curitÃ©" },
    @{ name = "database"; color = "0075ca"; description = "Base de donnÃ©es" },
    @{ name = "frontend"; color = "7057ff"; description = "Frontend / UI" },
    @{ name = "infra"; color = "006b75"; description = "Infrastructure" },
    @{ name = "ux"; color = "fbca04"; description = "ExpÃ©rience utilisateur" },
    @{ name = "critical"; color = "b60205"; description = "PrioritÃ© critique" },
    @{ name = "important"; color = "d93f0b"; description = "PrioritÃ© importante" },
    @{ name = "secondary"; color = "0e8a16"; description = "PrioritÃ© secondaire" }
)

# â”€â”€â”€ Milestones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$milestones = @(
    @{
        title       = "M0 â€” Urgences sÃ©curitÃ© & quick wins"
        description = "Corriger les failles critiques et obtenir des gains de performance immÃ©diats sans refactoring. Palier visÃ© : 500 users."
        due_on      = "2026-06-13T23:59:59Z"
    },
    @{
        title       = "M1 â€” Frontend & UX"
        description = "RÃ©duire le JavaScript envoyÃ© au client, ajouter loading states, amÃ©liorer les Core Web Vitals. Palier visÃ© : 1 000 users."
        due_on      = "2026-06-20T23:59:59Z"
    },
    @{
        title       = "M2 â€” Base de donnÃ©es & caching"
        description = "Migrer le cache vers Redis, optimiser les requÃªtes, amÃ©liorer le temps de rÃ©ponse des API. Palier visÃ© : 5 000 users."
        due_on      = "2026-06-27T23:59:59Z"
    },
    @{
        title       = "M3 â€” Infrastructure & scaling"
        description = "CDN, PgBouncer, ISR, async notifications. PrÃ©parer l'infrastructure pour 10 000+ utilisateurs."
        due_on      = "2026-07-11T23:59:59Z"
    }
)

# â”€â”€â”€ Issues â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$issues = @(
    # â”€â”€ M0 â”€â”€
    @{
        title     = "PERF-001: RÃ©voquer les secrets exposÃ©s dans .env.production"
        milestone = "M0 â€” Urgences sÃ©curitÃ© & quick wins"
        labels    = @("perf", "security", "critical")
        body      = @"
## ðŸ”´ CRITIQUE â€” SÃ©curitÃ©
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 30 min
**Impact** : SÃ©curitÃ© (âˆž)

### Contexte
Le fichier ``.env.production`` est commitÃ© dans Git avec tous les secrets de production en clair : mots de passe PostgreSQL, clÃ©s OAuth Google/GitHub, tokens Resend/QStash/Upstash.

### Fichiers concernÃ©s
- ``.env.production``
- ``.gitignore``

### Checklist
- [ ] RÃ©voquer et rÃ©gÃ©nÃ©rer le mot de passe PostgreSQL de production
- [ ] RÃ©gÃ©nÃ©rer le ``BETTER_AUTH_SECRET``
- [ ] RÃ©gÃ©nÃ©rer les credentials OAuth Google (``GOOGLE_CLIENT_SECRET``)
- [ ] RÃ©gÃ©nÃ©rer les credentials OAuth GitHub (``GITHUB_CLIENT_SECRET``)
- [ ] RÃ©gÃ©nÃ©rer la clÃ© API Resend (``RESEND_API_KEY``)
- [ ] RÃ©gÃ©nÃ©rer les tokens QStash (``QSTASH_TOKEN``, signing keys)
- [ ] RÃ©gÃ©nÃ©rer les tokens Upstash Redis/KV
- [ ] Ajouter ``.env.production`` Ã  ``.gitignore``
- [ ] Supprimer ``.env.production`` de l'historique Git (``git filter-branch`` ou BFG Repo Cleaner)
- [ ] Configurer les secrets via variables d'environnement Docker (compose ``environment:`` ou fichier ``.env`` non commitÃ©)
- [ ] VÃ©rifier que ``.env``, ``.env.local``, ``.env.production`` sont tous dans ``.gitignore``
"@
    },
    @{
        title     = "PERF-002: Supprimer la dÃ©sactivation TLS globale"
        milestone = "M0 â€” Urgences sÃ©curitÃ© & quick wins"
        labels    = @("perf", "security", "critical")
        body      = @"
## ðŸ”´ CRITIQUE â€” SÃ©curitÃ©
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 15 min
**Impact** : SÃ©curitÃ© (âˆž)

### Contexte
``process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"`` dans ``lib/prisma.ts`` ligne 7 dÃ©sactive la vÃ©rification des certificats TLS pour **tout le process Node.js**. Cela expose toutes les requÃªtes HTTP sortantes (Resend, QStash, Upstash) Ã  des attaques Man-in-the-Middle.

### Fichiers concernÃ©s
- ``lib/prisma.ts``

### Checklist
- [ ] Supprimer la ligne ``process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"``
- [ ] La connexion DB locale utilise dÃ©jÃ  ``ssl: false`` quand ``isLocalDb`` est true â€” c'est suffisant
- [ ] Pour la prod Docker, le PostgreSQL est en local (``@db:5432``) donc pas besoin de SSL
- [ ] Tester que la connexion DB fonctionne toujours en dev et en prod
- [ ] Si un certificat auto-signÃ© est nÃ©cessaire, utiliser ``ssl: { rejectUnauthorized: false }`` **uniquement** dans les options du Pool pg
"@
    },
    @{
        title     = "PERF-003: Configurer le pool de connexions PostgreSQL"
        milestone = "M0 â€” Urgences sÃ©curitÃ© & quick wins"
        labels    = @("perf", "database", "critical")
        body      = @"
## ðŸ”´ CRITIQUE â€” Performance DB
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 15 min
**Impact** : ðŸŸ¢ðŸŸ¢ðŸŸ¢ â€” EmpÃªche la saturation DB dÃ¨s ~100 users concurrents

### Contexte
Le pool ``pg`` est instanciÃ© sans configuration de taille. Le dÃ©faut est ``max: 10`` connexions, insuffisant sous charge. Pas de timeout configurÃ©.

### Fichiers concernÃ©s
- ``lib/prisma.ts``

### Checklist
- [ ] Configurer le pool ``pg`` avec des paramÃ¨tres explicites :
  ``````typescript
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: isLocalDb ? false : { rejectUnauthorized: false },
  })
  ``````
- [ ] Tester sous charge locale avec 20 requÃªtes simultanÃ©es
- [ ] Monitorer en production le nombre de connexions actives
"@
    },
    @{
        title     = "PERF-004: Activer l'optimisation d'images Next.js"
        milestone = "M0 â€” Urgences sÃ©curitÃ© & quick wins"
        labels    = @("perf", "frontend", "critical")
        body      = @"
## ðŸ”´ CRITIQUE â€” Frontend
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 20 min
**Impact** : ðŸŸ¢ðŸŸ¢ðŸŸ¢ â€” AmÃ©lioration LCP de ~1-2 secondes

### Contexte
``images: { unoptimized: true }`` dans ``next.config.mjs`` dÃ©sactive toute l'optimisation d'images Next.js : pas de WebP/AVIF, pas de resize, pas de lazy loading natif. Tueur nÂ°1 de LCP.

### Fichiers concernÃ©s
- ``next.config.mjs``

### Checklist
- [ ] Supprimer ``unoptimized: true`` (ou le mettre Ã  ``false``)
- [ ] VÃ©rifier que les ``remotePatterns`` couvrent tous les domaines d'images utilisÃ©s
- [ ] Remplacer les ``<img>`` par ``<Image>`` de ``next/image`` dans les composants concernÃ©s
- [ ] Tester que les images s'affichent correctement en dev
- [ ] En prod standalone, vÃ©rifier que ``.next/cache/images`` est persistÃ© (volume Docker)
"@
    },
    @{
        title     = "PERF-005: Ajouter les index DB manquants"
        milestone = "M0 â€” Urgences sÃ©curitÃ© & quick wins"
        labels    = @("perf", "database", "critical")
        body      = @"
## ðŸ”´ CRITIQUE â€” Performance DB
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 15 min
**Impact** : ðŸŸ¢ðŸŸ¢ â€” RequÃªtes squad et feed 5-10x plus rapides

### Contexte
Plusieurs requÃªtes frÃ©quentes opÃ¨rent sur des colonnes non indexÃ©es, causant des full table scans.

### Fichiers concernÃ©s
- ``prisma/schema.prisma``

### Checklist
- [ ] Ajouter ``@@index([userId])`` sur le modÃ¨le ``Member``
- [ ] Ajouter ``@@index([organizationId])`` sur le modÃ¨le ``Member``
- [ ] Ajouter ``@@index([createdAt])`` sur le modÃ¨le ``User``
- [ ] Ajouter un index composite ``@@index([status, missionId])`` sur ``MissionSubmission``
- [ ] GÃ©nÃ©rer la migration : ``npx prisma migrate dev --name add-perf-indexes``
- [ ] VÃ©rifier que la migration SQL est correcte
- [ ] Appliquer en production : ``npx prisma migrate deploy``
"@
    },
    @{
        title     = "PERF-006: RÃ©duire le chargement de submissions sur le dashboard"
        milestone = "M0 â€” Urgences sÃ©curitÃ© & quick wins"
        labels    = @("perf", "frontend", "critical")
        body      = @"
## ðŸ”´ CRITIQUE â€” Performance
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 10 min
**Impact** : ðŸŸ¢ðŸŸ¢ â€” RÃ©duit la taille HTML et le temps de sÃ©rialisation

### Contexte
Le dashboard charge ``take: 200`` soumissions avec JOIN mission. L'UI n'en affiche qu'une dizaine. Ces 200 objets sont sÃ©rialisÃ©s dans le HTML du Server Component.

### Fichiers concernÃ©s
- ``app/dashboard/page.tsx``

### Checklist
- [ ] RÃ©duire ``take: 200`` Ã  ``take: 20`` (ligne 67)
- [ ] Ajouter un filtre ``status`` si seuls APPROVED et PENDING sont nÃ©cessaires
- [ ] Si un historique complet est nÃ©cessaire, implÃ©menter une pagination cÃ´tÃ© client
- [ ] VÃ©rifier que ``submissionsMap`` et ``MissionHistory`` fonctionnent toujours
"@
    },

    # â”€â”€ M1 â”€â”€
    @{
        title     = "PERF-007: DÃ©couper squad-journey.tsx (74 KB)"
        milestone = "M1 â€” Frontend & UX"
        labels    = @("perf", "frontend", "important")
        body      = @"
## ðŸŸ¡ IMPORTANT â€” Frontend
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 3-4h
**Impact** : ðŸŸ¢ðŸŸ¢ðŸŸ¢ â€” RÃ©duit le TTI de 2-4 secondes sur mobile

### Contexte
``squad-journey.tsx`` fait 74 KB source (~200KB+ compilÃ©). MÃ©ga-composant monolithique contenant tout le flow squad. Sur mobile 3G africain : 5-8s de chargement JS.

### Fichiers concernÃ©s
- ``components/dashboard/squad-journey.tsx``

### Checklist
- [ ] Identifier les sections logiques (lobby, membres, paramÃ¨tres, chat, etc.)
- [ ] Extraire chaque section dans un fichier sÃ©parÃ©
- [ ] Utiliser ``dynamic()`` de Next.js pour lazy-loader les sections non visibles au premier render
- [ ] Garder le composant principal comme orchestrateur lÃ©ger (<5 KB)
- [ ] Ajouter des skeletons de chargement pour chaque section
- [ ] Tester sur mobile (Chrome DevTools throttle 3G)
"@
    },
    @{
        title     = "PERF-008: DÃ©couper dashboard-shell.tsx (25 KB)"
        milestone = "M1 â€” Frontend & UX"
        labels    = @("perf", "frontend", "important")
        body      = @"
## ðŸŸ¡ IMPORTANT â€” Frontend
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 2-3h
**Impact** : ðŸŸ¢ðŸŸ¢ðŸŸ¢ â€” RÃ©duit le TTI de 1-2 secondes

### Contexte
Le dashboard est un seul composant ``"use client"`` de 422 lignes. Chaque widget est importÃ© statiquement.

### Fichiers concernÃ©s
- ``components/dashboard/dashboard-shell.tsx``

### Checklist
- [ ] Identifier les widgets sous le fold (MemberCard, Arsenal, etc.)
- [ ] Lazy-loader avec ``dynamic()`` les composants non critiques
- [ ] Garder ``DailyCheckinWidget`` et ``MissionDeck`` en import statique (above the fold)
- [ ] Mesurer la taille du bundle avant/aprÃ¨s avec ``@next/bundle-analyzer``
- [ ] Tester que la navigation reste fluide
"@
    },
    @{
        title     = "PERF-009: Ajouter des loading.tsx dans les routes principales"
        milestone = "M1 â€” Frontend & UX"
        labels    = @("perf", "ux", "important")
        body      = @"
## ðŸŸ¡ IMPORTANT â€” UX
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 1h
**Impact** : ðŸŸ¢ðŸŸ¢ â€” Ã‰limine les Ã©crans blancs pendant le chargement

### Contexte
Les routes ``/dashboard``, ``/squad`` et ``/missions`` n'ont pas de ``loading.tsx`` fonctionnel. L'utilisateur voit un Ã©cran blanc pendant 1-3s.

### Fichiers concernÃ©s
- ``app/dashboard/loading.tsx`` (vÃ©rifier le contenu)
- ``app/squad/loading.tsx`` (Ã  crÃ©er)
- ``app/missions/loading.tsx`` (Ã  crÃ©er)
- ``app/settings/loading.tsx`` (Ã  crÃ©er)

### Checklist
- [ ] VÃ©rifier le ``loading.tsx`` existant dans ``/dashboard``
- [ ] CrÃ©er ``app/squad/loading.tsx`` avec un skeleton du SquadJourney
- [ ] CrÃ©er ``app/missions/loading.tsx`` avec un skeleton des cartes missions
- [ ] CrÃ©er ``app/settings/loading.tsx``
- [ ] Utiliser ``animate-pulse`` pour les skeletons
- [ ] Tester en throttling rÃ©seau lent
"@
    },
    @{
        title     = "PERF-010: RÃ©duire les polices Google chargÃ©es"
        milestone = "M1 â€” Frontend & UX"
        labels    = @("perf", "frontend", "important")
        body      = @"
## ðŸŸ¡ IMPORTANT â€” Frontend
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 30 min
**Impact** : ðŸŸ¢ðŸŸ¢ â€” RÃ©duit le FCP de 200-400ms

### Contexte
Le layout charge 3 polices (Syne, Outfit, IBM Plex Mono) avec 14 poids. Chaque fichier ~20-40 KB.

### Fichiers concernÃ©s
- ``app/layout.tsx``
- ``app/globals.css``

### Checklist
- [ ] RÃ©duire Syne Ã  2-3 poids max (700, 800)
- [ ] RÃ©duire Outfit Ã  2-3 poids (400, 500, 600)
- [ ] IBM Plex Mono : garder uniquement le poids 400
- [ ] Ajouter ``display: 'swap'`` si pas dÃ©jÃ  fait
- [ ] Tester visuellement que rien ne casse
"@
    },
    @{
        title     = "PERF-011: Conditionner les animations CSS avec prefers-reduced-motion"
        milestone = "M1 â€” Frontend & UX"
        labels    = @("perf", "ux", "important")
        body      = @"
## ðŸŸ¡ IMPORTANT â€” A11y + Performance Mobile
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 30 min
**Impact** : ðŸŸ¢ â€” RÃ©duit la consommation GPU sur mobile

### Contexte
5+ animations CSS ``infinite`` (holo-sheen-sweep, hud-pulse, laser-sweep, grid-drift, hazard-sweep) tournent en permanence, mÃªme invisibles. Sur mobile bas de gamme : batterie + GPU excessifs.

### Fichiers concernÃ©s
- ``app/globals.css``

### Checklist
- [ ] Ajouter une media query ``prefers-reduced-motion: reduce`` globale
- [ ] Alternativement, cibler les animations les plus lourdes
- [ ] Tester avec l'option "Reduce motion" activÃ©e
- [ ] VÃ©rifier que les transitions de navigation fonctionnent toujours
"@
    },

    # â”€â”€ M2 â”€â”€
    @{
        title     = "PERF-012: Migrer le cache in-memory vers Redis (Upstash)"
        milestone = "M2 â€” Base de donnÃ©es & caching"
        labels    = @("perf", "database", "infra", "important")
        body      = @"
## ðŸŸ¡ IMPORTANT â€” Scaling
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 2-3h
**Impact** : ðŸŸ¢ðŸŸ¢ðŸŸ¢ â€” PrÃ©requis au scaling horizontal

### Contexte
Cache actuel = ``Map`` JS en mÃ©moire (``lib/cache.ts``). Perdu Ã  chaque redÃ©marrage, non partageable entre instances. Upstash Redis est dÃ©jÃ  configurÃ© et payÃ©.

### Fichiers concernÃ©s
- ``lib/cache.ts``

### Checklist
- [ ] RÃ©Ã©crire ``lib/cache.ts`` pour utiliser ``@upstash/redis``
- [ ] Adapter les appelants Ã  l'API async
- [ ] Ajouter un prÃ©fixe aux clÃ©s (``hc:``) pour Ã©viter les collisions avec le rate limiter
- [ ] Tester que le cache fonctionne en dev
- [ ] Monitorer l'utilisation Redis dans le dashboard Upstash
"@
    },
    @{
        title     = "PERF-013: Ajouter Cache-Control sur les API GET publiques"
        milestone = "M2 â€” Base de donnÃ©es & caching"
        labels    = @("perf", "infra", "important")
        body      = @"
## ðŸŸ¡ IMPORTANT â€” Performance
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 1h
**Impact** : ðŸŸ¢ðŸŸ¢ â€” RÃ©duit la charge serveur de 30-50%

### Contexte
37/37 routes API en ``force-dynamic``. Certaines API GET (feed, leaderboard, public) pourraient servir des rÃ©ponses cachÃ©es 30-60s.

### Fichiers concernÃ©s
- ``app/api/feed/route.ts``
- ``app/api/squad/leaderboard/route.ts``
- ``app/api/squad/public/route.ts``
- ``app/api/status/route.ts``

### Checklist
- [ ] Retirer ``force-dynamic`` des routes GET purement informatives
- [ ] Ajouter ``Cache-Control: public, s-maxage=60, stale-while-revalidate=120`` sur les routes concernÃ©es
- [ ] Ne PAS toucher aux routes POST/PATCH/DELETE ni aux routes user-specific
- [ ] Tester que les rÃ©ponses sont bien cachÃ©es (vÃ©rifier les headers)
"@
    },
    @{
        title     = "PERF-014: ParallÃ©liser les requÃªtes de la page Squad"
        milestone = "M2 â€” Base de donnÃ©es & caching"
        labels    = @("perf", "database", "important")
        body      = @"
## ðŸŸ¡ IMPORTANT â€” Performance
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 30 min
**Impact** : ðŸŸ¢ðŸŸ¢ â€” RÃ©duit le TTFB de 200-400ms

### Contexte
``app/squad/page.tsx`` fait 3 requÃªtes sÃ©quentielles au lieu de les exÃ©cuter en parallÃ¨le.

### Fichiers concernÃ©s
- ``app/squad/page.tsx``

### Checklist
- [ ] ParallÃ©liser avec ``Promise.all`` les requÃªtes ``getFullOrganization`` + ``user.findUnique``
- [ ] Garder le fallback conditionnel (``member.findFirst``) uniquement si org est null
- [ ] VÃ©rifier que le comportement reste identique
- [ ] Tester la page squad avec/sans squad
"@
    },
    @{
        title     = "PERF-015: Combiner les requÃªtes notifications"
        milestone = "M2 â€” Base de donnÃ©es & caching"
        labels    = @("perf", "database", "important")
        body      = @"
## ðŸŸ¡ IMPORTANT â€” Performance DB
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 15 min
**Impact** : ðŸŸ¢ â€” RÃ©duit de 2 Ã  1 les requÃªtes DB par appel

### Contexte
L'endpoint notifications fait 2 requÃªtes sÃ©parÃ©es : ``findMany`` + ``count``. Le comptage non-lu peut Ãªtre dÃ©rivÃ© du rÃ©sultat.

### Fichiers concernÃ©s
- ``app/api/user/notifications/route.ts``

### Checklist
- [ ] Remplacer les 2 requÃªtes par un seul ``findMany`` + filtre JS pour le count
- [ ] Si le nombre total de non-lus peut dÃ©passer 20, parallÃ©liser avec ``Promise.all`` Ã  la place
- [ ] Tester la notification bell dans le dashboard
"@
    },
    @{
        title     = "PERF-016: Optimiser le feed API (Ã©viter le full table scan)"
        milestone = "M2 â€” Base de donnÃ©es & caching"
        labels    = @("perf", "database", "important")
        body      = @"
## ðŸŸ¡ IMPORTANT â€” Performance DB
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 30 min
**Impact** : ðŸŸ¢ðŸŸ¢ â€” Critique Ã  10K+ utilisateurs

### Contexte
Le feed fait ``user.findMany({ orderBy: createdAt, take: 10 })`` sans filtre. Ã€ 100K users = full table scan.

### Fichiers concernÃ©s
- ``app/api/feed/route.ts``

### Checklist
- [ ] S'assurer que PERF-005 est fait (index sur ``user.createdAt``)
- [ ] Ajouter un filtre temporel (``createdAt >= 7 jours``) pour limiter le scan
- [ ] MÃªme chose pour les submissions du feed
- [ ] Cacher le rÃ©sultat dans Redis (cf. PERF-012) avec TTL de 60s
- [ ] Tester que le feed reste pertinent et non vide
"@
    },

    # â”€â”€ M3 â”€â”€
    @{
        title     = "PERF-017: Ajouter PgBouncer devant PostgreSQL"
        milestone = "M3 â€” Infrastructure & scaling"
        labels    = @("perf", "infra", "database", "secondary")
        body      = @"
## ðŸŸ¢ SECONDAIRE â€” Infrastructure
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 2-3h
**Impact** : ðŸŸ¢ðŸŸ¢ â€” Multiplie la capacitÃ© DB par 5-10x

### Contexte
Sans PgBouncer, chaque connexion Node.js ouvre un processus backend PostgreSQL dÃ©diÃ© (coÃ»teux en mÃ©moire).

### Fichiers concernÃ©s
- ``compose.yaml``
- ``lib/prisma.ts``

### Checklist
- [ ] Ajouter un service PgBouncer dans ``compose.yaml``
- [ ] Modifier ``DATABASE_URL`` pour pointer vers PgBouncer (``@pgbouncer:6432``)
- [ ] Garder ``DIRECT_URL`` vers PostgreSQL direct (pour les migrations)
- [ ] Tester les migrations via ``DIRECT_URL``
- [ ] Tester l'app via PgBouncer
- [ ] Monitorer les connexions via ``SHOW POOLS``
"@
    },
    @{
        title     = "PERF-018: ISR pour la page Missions"
        milestone = "M3 â€” Infrastructure & scaling"
        labels    = @("perf", "frontend", "secondary")
        body      = @"
## ðŸŸ¢ SECONDAIRE â€” Performance
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 1h
**Impact** : ðŸŸ¢ â€” TTFB quasi instantanÃ© pour ``/missions``

### Contexte
La page missions utilise dÃ©jÃ  ``unstable_cache`` avec ``revalidate: 300`` mais le reste est SSR dynamique. Les donnÃ©es missions sont hardcodÃ©es.

### Fichiers concernÃ©s
- ``app/missions/page.tsx``

### Checklist
- [ ] SÃ©parer les donnÃ©es statiques (liste missions) des donnÃ©es user-specific (submissions)
- [ ] CrÃ©er un layout intermÃ©diaire en ISR pour les missions statiques
- [ ] Garder les submissions dynamiques (Suspense cÃ´tÃ© client)
- [ ] Tester le temps de rÃ©ponse avant/aprÃ¨s
"@
    },
    @{
        title     = "PERF-019: Rendre les notifications asynchrones"
        milestone = "M3 â€” Infrastructure & scaling"
        labels    = @("perf", "infra", "secondary")
        body      = @"
## ðŸŸ¢ SECONDAIRE â€” Performance API
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 2h
**Impact** : ðŸŸ¢ðŸŸ¢ â€” RÃ©duit la latence des endpoints de soumission de mission

### Contexte
``triggerNotification()`` fait un write DB synchrone + envoi email dans le chemin critique. Si Resend timeout, la soumission entiÃ¨re ralentit.

### Fichiers concernÃ©s
- ``lib/qstash.ts``
- ``app/api/missions/route.ts``

### Checklist
- [ ] Option A : fire-and-forget la notification sans ``await``
- [ ] Option B : utiliser QStash (dÃ©jÃ  configurÃ©) pour envoyer via queue HTTP
- [ ] VÃ©rifier que les emails sont dÃ©jÃ  en fire-and-forget (``.catch()``)
- [ ] Tester que les notifications sont toujours crÃ©Ã©es
- [ ] Monitorer les erreurs dans les logs
"@
    },
    @{
        title     = "PERF-020: Ajouter un CDN (Cloudflare) devant Traefik"
        milestone = "M3 â€” Infrastructure & scaling"
        labels    = @("perf", "infra", "secondary")
        body      = @"
## ðŸŸ¢ SECONDAIRE â€” Infrastructure
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 2-3h
**Impact** : ðŸŸ¢ðŸŸ¢ â€” Cache les assets statiques et rÃ©duit la latence globale

### Contexte
Chaque requÃªte (JS, CSS, images, polices) atteint directement le serveur via Traefik. Un CDN absorbe 70-80% du trafic.

### Fichiers concernÃ©s
- Configuration DNS (``joinhashcode.com``)
- ``next.config.mjs`` (headers CSP)

### Checklist
- [ ] CrÃ©er un compte Cloudflare
- [ ] Migrer les DNS vers Cloudflare
- [ ] Activer le proxy (nuage orange)
- [ ] Configurer les rÃ¨gles de cache (``/_next/static/*`` = long, ``/api/*`` = bypass)
- [ ] Adapter la CSP
- [ ] Tester les headers de cache avec ``curl -I``
- [ ] Activer la minification HTML/CSS/JS
"@
    },
    @{
        title     = "PERF-021: SSG pour la landing page"
        milestone = "M3 â€” Infrastructure & scaling"
        labels    = @("perf", "frontend", "secondary")
        body      = @"
## ðŸŸ¢ SECONDAIRE â€” Performance
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 1h
**Impact** : ðŸŸ¢ â€” TTFB < 100ms pour la page d'accueil

### Contexte
La page d'accueil est 100% statique (pas de fetch serveur). Elle peut Ãªtre pre-rendue en SSG.

### Fichiers concernÃ©s
- ``app/page.tsx``

### Checklist
- [ ] Ajouter ``export const dynamic = 'force-static'`` en haut de ``app/page.tsx``
- [ ] VÃ©rifier qu'aucun composant landing n'appelle de fonction serveur
- [ ] Tester en build (``npm run build``) que la page est marquÃ©e ``â—‹`` (statique)
- [ ] VÃ©rifier le TTFB en production
"@
    },
    @{
        title     = "PERF-022: Extraire les donnÃ©es missions du bundle JavaScript"
        milestone = "M3 â€” Infrastructure & scaling"
        labels    = @("perf", "frontend", "secondary")
        body      = @"
## ðŸŸ¢ SECONDAIRE â€” Frontend
**CrÃ©Ã© le** : 2026-06-12
**Effort** : 1h
**Impact** : ðŸŸ¢ â€” RÃ©duit le bundle de 36 KB

### Contexte
``lib/missions.ts`` contient 36 KB de donnÃ©es missions hardcodÃ©es importÃ©es dans le bundle client.

### Fichiers concernÃ©s
- ``lib/missions.ts``
- ``app/missions/page.tsx``
- ``components/missions/missions-list.tsx``

### Checklist
- [ ] Option A : S'assurer que le fichier n'est importÃ© que dans les Server Components
- [ ] Option B : Migrer les missions vers la DB + seed via ``prisma/seed.ts``
- [ ] Option C : Extraire dans un fichier JSON chargÃ© cÃ´tÃ© serveur
- [ ] VÃ©rifier le bundle client avec ``@next/bundle-analyzer``
- [ ] Tester la page missions
"@
    }
)

# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
#  EXECUTION
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Write-Host ""
Write-Host "â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—" -ForegroundColor Cyan
Write-Host "â•‘  HASHCODE â€” Publication des issues performance sur GitHub   â•‘" -ForegroundColor Cyan
Write-Host "â•‘  Repo: $REPO                                    â•‘" -ForegroundColor Cyan
Write-Host "â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "ðŸ” MODE DRY-RUN â€” Aucune modification ne sera effectuÃ©e" -ForegroundColor Yellow
    Write-Host ""
}

# â”€â”€ 1. CrÃ©er les labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Write-Host "â”â”â” Ã‰tape 1/3 : CrÃ©ation des labels â”â”â”" -ForegroundColor Magenta
foreach ($label in $labels) {
    $existing = gh label list --repo $REPO --search $label.name --json name 2>$null | ConvertFrom-Json
    if ($existing -and ($existing | Where-Object { $_.name -eq $label.name })) {
        Write-Host "  â­ï¸  Label '$($label.name)' existe dÃ©jÃ " -ForegroundColor DarkGray
    } else {
        if ($DryRun) {
            Write-Host "  ðŸ·ï¸  [DRY] CrÃ©erait le label '$($label.name)' ($($label.color))" -ForegroundColor Yellow
        } else {
            gh label create $label.name --repo $REPO --color $label.color --description $label.description --force 2>$null
            Write-Host "  âœ… Label '$($label.name)' crÃ©Ã©" -ForegroundColor Green
        }
    }
}
Write-Host ""

# â”€â”€ 2. CrÃ©er les milestones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Write-Host "â”â”â” Ã‰tape 2/3 : CrÃ©ation des milestones â”â”â”" -ForegroundColor Magenta
$milestoneMap = @{}

foreach ($ms in $milestones) {
    $existing = gh api "repos/$REPO/milestones" --jq ".[] | select(.title == `"$($ms.title)`") | .number" 2>$null
    if ($existing) {
        Write-Host "  â­ï¸  Milestone '$($ms.title)' existe dÃ©jÃ  (#$existing)" -ForegroundColor DarkGray
        $milestoneMap[$ms.title] = [int]$existing
    } else {
        if ($DryRun) {
            Write-Host "  ðŸŽ¯ [DRY] CrÃ©erait le milestone '$($ms.title)'" -ForegroundColor Yellow
            $milestoneMap[$ms.title] = 0
        } else {
            $msNumber = gh api "repos/$REPO/milestones" `
                --method POST `
                --field title="$($ms.title)" `
                --field description="$($ms.description)" `
                --field due_on="$($ms.due_on)" `
                --jq ".number"
            Write-Host "  âœ… Milestone '$($ms.title)' crÃ©Ã© (#$msNumber)" -ForegroundColor Green
            $milestoneMap[$ms.title] = [int]$msNumber
        }
    }
}
Write-Host ""

# â”€â”€ 3. CrÃ©er les issues â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Write-Host "â”â”â” Ã‰tape 3/3 : CrÃ©ation des issues â”â”â”" -ForegroundColor Magenta
$created = 0
$skipped = 0

foreach ($issue in $issues) {
    # VÃ©rifier si l'issue existe dÃ©jÃ  (par titre exact)
    $searchTitle = $issue.title -replace '["\[\]]', ''
    $existingIssues = gh issue list --repo $REPO --search "in:title $($issue.title.Substring(0, 8))" --state all --json title 2>$null | ConvertFrom-Json
    $alreadyExists = $existingIssues | Where-Object { $_.title -eq $issue.title }

    if ($alreadyExists) {
        Write-Host "  â­ï¸  '$($issue.title)' existe dÃ©jÃ " -ForegroundColor DarkGray
        $skipped++
        continue
    }

    if ($DryRun) {
        Write-Host "  ðŸ“ [DRY] CrÃ©erait: $($issue.title)" -ForegroundColor Yellow
        Write-Host "          Labels: $($issue.labels -join ', ')  |  Milestone: $($issue.milestone)" -ForegroundColor DarkGray
        $created++
        continue
    }

    # Construire la commande
    $labelArgs = @()
    foreach ($l in $issue.labels) {
        $labelArgs += "--label"
        $labelArgs += $l
    }

    $msNumber = $milestoneMap[$issue.milestone]
    $milestoneArgs = @()
    if ($msNumber -and $msNumber -gt 0) {
        $milestoneArgs = @("--milestone", $issue.milestone)
    }

    $result = gh issue create --repo $REPO `
        --title $issue.title `
        --body $issue.body `
        @labelArgs `
        @milestoneArgs 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  âœ… $($issue.title)" -ForegroundColor Green
        $created++
    } else {
        Write-Host "  âŒ Erreur pour '$($issue.title)': $result" -ForegroundColor Red
    }

    # Pause pour Ã©viter le rate limiting GitHub API
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•" -ForegroundColor Cyan
Write-Host "  RÃ©sultat: $created crÃ©Ã©es, $skipped ignorÃ©es (dÃ©jÃ  existantes)" -ForegroundColor Cyan
Write-Host "â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•" -ForegroundColor Cyan
Write-Host ""


const { execSync } = require('child_process');

const REPO = "digitaleflex/joinhashcode";
const dryRun = process.argv.includes('--dry-run') || process.argv.includes('-DryRun');

// --- Labels ---
const labels = [
    { name: "perf", color: "e99695", description: "Performance & Scalabilité" },
    { name: "security", color: "d73a4a", description: "Sécurité" },
    { name: "database", color: "0075ca", description: "Base de données" },
    { name: "frontend", color: "7057ff", description: "Frontend / UI" },
    { name: "infra", color: "006b75", description: "Infrastructure" },
    { name: "ux", color: "fbca04", description: "Expérience utilisateur" },
    { name: "critical", color: "b60205", description: "Priorité critique" },
    { name: "important", color: "d93f0b", description: "Priorité importante" },
    { name: "secondary", color: "0e8a16", description: "Priorité secondaire" }
];

// --- Milestones ---
const milestones = [
    {
        title: "M0 - Urgences sécurité & quick wins",
        description: "Corriger les failles critiques et obtenir des gains de performance immédiats sans refactoring. Palier visé : 500 users.",
        due_on: "2026-06-13T23:59:59Z"
    },
    {
        title: "M1 - Frontend & UX",
        description: "Réduire le JavaScript envoyé au client, ajouter loading states, améliorer les Core Web Vitals. Palier visé : 1 000 users.",
        due_on: "2026-06-20T23:59:59Z"
    },
    {
        title: "M2 - Base de données & caching",
        description: "Migrer le cache vers Redis, optimiser les requêtes, améliorer le temps de réponse des API. Palier visé : 5 000 users.",
        due_on: "2026-06-27T23:59:59Z"
    },
    {
        title: "M3 - Infrastructure & scaling",
        description: "CDN, PgBouncer, ISR, async notifications. Préparer l'infrastructure pour 10 000+ utilisateurs.",
        due_on: "2026-07-11T23:59:59Z"
    }
];

// --- Issues ---
const issues = [
    // --- M0 ---
    {
        title: "PERF-001: Révoquer les secrets exposés dans .env.production",
        milestone: "M0 - Urgences sécurité & quick wins",
        labels: ["perf", "security", "critical"],
        body: `## 🔴 CRITIQUE — Sécurité
**Créé le** : 2026-06-12
**Effort** : 30 min
**Impact** : Sécurité (∞)

### Contexte
Le fichier \`.env.production\` est commité dans Git avec tous les secrets de production en clair : mots de passe PostgreSQL, clés OAuth Google/GitHub, tokens Resend/QStash/Upstash.

### Fichiers concernés
- \`.env.production\`
- \`.gitignore\`

### Checklist
- [ ] Révoquer et régénérer le mot de passe PostgreSQL de production
- [ ] Régénérer le \`BETTER_AUTH_SECRET\`
- [ ] Régénérer les credentials OAuth Google (\`GOOGLE_CLIENT_SECRET\`)
- [ ] Régénérer les credentials OAuth GitHub (\`GITHUB_CLIENT_SECRET\`)
- [ ] Régénérer la clé API Resend (\`RESEND_API_KEY\`)
- [ ] Régénérer les tokens QStash (\`QSTASH_TOKEN\`, signing keys)
- [ ] Régénérer les tokens Upstash Redis/KV
- [ ] Ajouter \`.env.production\` à \`.gitignore\`
- [ ] Supprimer \`.env.production\` de l'historique Git (\`git filter-branch\` ou BFG Repo Cleaner)
- [ ] Configurer les secrets via variables d'environnement Docker (compose \`environment:\` ou fichier \`.env\` non commité)
- [ ] Vérifier que \`.env\`, \`.env.local\`, \`.env.production\` sont tous dans \`.gitignore\``
    },
    {
        title: "PERF-002: Supprimer la désactivation TLS globale",
        milestone: "M0 - Urgences sécurité & quick wins",
        labels: ["perf", "security", "critical"],
        body: `## 🔴 CRITIQUE — Sécurité
**Créé le** : 2026-06-12
**Effort** : 15 min
**Impact** : Sécurité (∞)

### Contexte
\`process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"\` dans \`lib/prisma.ts\` ligne 7 désactive la vérification des certificats TLS pour **tout le process Node.js**. Cela expose toutes les requêtes HTTP sortantes (Resend, QStash, Upstash) à des attaques Man-in-the-Middle.

### Fichiers concernés
- \`lib/prisma.ts\`

### Checklist
- [ ] Supprimer la ligne \`process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"\`
- [ ] La connexion DB locale utilise déjà \`ssl: false\` quand \`isLocalDb\` est true — c'est suffisant
- [ ] Pour la prod Docker, le PostgreSQL est en local (\`@db:5432\`) donc pas besoin de SSL
- [ ] Tester que la connexion DB fonctionne toujours en dev et en prod
- [ ] Si un certificat auto-signé est nécessaire, utiliser \`ssl: { rejectUnauthorized: false }\` **uniquement** dans les options du Pool pg`
    },
    {
        title: "PERF-003: Configurer le pool de connexions PostgreSQL",
        milestone: "M0 - Urgences sécurité & quick wins",
        labels: ["perf", "database", "critical"],
        body: `## 🔴 CRITIQUE — Performance DB
**Créé le** : 2026-06-12
**Effort** : 15 min
**Impact** : 🟢🟢🟢 — Empêche la saturation DB dès ~100 users concurrents

### Contexte
Le pool \`pg\` est instancié sans configuration de taille. Le défaut est \`max: 10\` connexions, insuffisant sous charge. Pas de timeout configuré.

### Fichiers concernés
- \`lib/prisma.ts\`

### Checklist
- [ ] Configurer le pool \`pg\` avec des paramètres explicites :
  \`\`\`typescript
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: isLocalDb ? false : { rejectUnauthorized: false },
  })
  \`\`\`
- [ ] Tester sous charge locale avec 20 requêtes simultanées
- [ ] Monitorer en production le nombre de connexions actives`
    },
    {
        title: "PERF-004: Activer l'optimisation d'images Next.js",
        milestone: "M0 - Urgences sécurité & quick wins",
        labels: ["perf", "frontend", "critical"],
        body: `## 🔴 CRITIQUE — Frontend
**Créé le** : 2026-06-12
**Effort** : 20 min
**Impact** : 🟢🟢🟢 — Amélioration LCP de ~1-2 secondes

### Contexte
\`images: { unoptimized: true }\` dans \`next.config.mjs\` désactive toute l'optimisation d'images Next.js : pas de WebP/AVIF, pas de resize, pas de lazy loading natif. Tueur n°1 de LCP.

### Fichiers concernés
- \`next.config.mjs\`

### Checklist
- [ ] Supprimer \`unoptimized: true\` (ou le mettre à \`false\`)
- [ ] Vérifier que les \`remotePatterns\` couvrent tous les domaines d'images utilisés
- [ ] Remplacer les \`<img>\` par \`<Image>\` de \`next/image\` dans les composants concernés
- [ ] Tester que les images s'affichent correctement en dev
- [ ] En prod standalone, vérifier que \`.next/cache/images\` est persisté (volume Docker)`
    },
    {
        title: "PERF-005: Ajouter les index DB manquants",
        milestone: "M0 - Urgences sécurité & quick wins",
        labels: ["perf", "database", "critical"],
        body: `## 🔴 CRITIQUE — Performance DB
**Créé le** : 2026-06-12
**Effort** : 15 min
**Impact** : 🟢🟢 — Requêtes squad et feed 5-10x plus rapides

### Contexte
Plusieurs requêtes fréquentes opèrent sur des colonnes non indexées, causant des full table scans.

### Fichiers concernés
- \`prisma/schema.prisma\`

### Checklist
- [ ] Ajouter \`@@index([userId])\` sur le modèle \`Member\`
- [ ] Ajouter \`@@index([organizationId])\` sur le modèle \`Member\`
- [ ] Ajouter \`@@index([createdAt])\` sur le modèle \`User\`
- [ ] Ajouter un index composite \`@@index([status, missionId])\` sur \`MissionSubmission\`
- [ ] Générer la migration : \`npx prisma migrate dev --name add-perf-indexes\`
- [ ] Vérifier que la migration SQL est correcte
- [ ] Appliquer en production : \`npx prisma migrate deploy\``
    },
    {
        title: "PERF-006: Réduire le chargement de submissions sur le dashboard",
        milestone: "M0 - Urgences sécurité & quick wins",
        labels: ["perf", "frontend", "critical"],
        body: `## 🔴 CRITIQUE — Performance
**Créé le** : 2026-06-12
**Effort** : 10 min
**Impact** : 🟢🟢 — Réduit la taille HTML et le temps de sérialisation

### Contexte
Le dashboard charge \`take: 200\` soumissions avec JOIN mission. L'UI n'en affiche qu'une dizaine. Ces 200 objets sont sérialisés dans le HTML du Server Component.

### Fichiers concernés
- \`app/dashboard/page.tsx\`

### Checklist
- [ ] Réduire \`take: 200\` à \`take: 20\` (ligne 67)
- [ ] Ajouter un filtre \`status\` si seuls APPROVED et PENDING sont nécessaires
- [ ] Si un historique complet est nécessaire, implémenter une pagination côté client
- [ ] Vérifier que \`submissionsMap\` et \`MissionHistory\` fonctionnent toujours`
    },

    // --- M1 ---
    {
        title: "PERF-007: Découper squad-journey.tsx (74 KB)",
        milestone: "M1 - Frontend & UX",
        labels: ["perf", "frontend", "important"],
        body: `## 🟡 IMPORTANT — Frontend
**Créé le** : 2026-06-12
**Effort** : 3-4h
**Impact** : 🟢🟢🟢 — Réduit le TTI de 2-4 secondes sur mobile

### Contexte
\`squad-journey.tsx\` fait 74 KB source (~200KB+ compilé). Méga-composant monolithique contenant tout le flow squad. Sur mobile 3G africain : 5-8s de chargement JS.

### Fichiers concernés
- \`components/dashboard/squad-journey.tsx\`

### Checklist
- [ ] Identifier les sections logiques (lobby, membres, paramètres, chat, etc.)
- [ ] Extraire chaque section dans un fichier séparé
- [ ] Utiliser \`dynamic()\` de Next.js pour lazy-loader les sections non visibles au premier render
- [ ] Garder le composant principal comme orchestrateur léger (<5 KB)
- [ ] Ajouter des skeletons de chargement pour chaque section
- [ ] Tester sur mobile (Chrome DevTools throttle 3G)`
    },
    {
        title: "PERF-008: Découper dashboard-shell.tsx (25 KB)",
        milestone: "M1 - Frontend & UX",
        labels: ["perf", "frontend", "important"],
        body: `## 🟡 IMPORTANT — Frontend
**Créé le** : 2026-06-12
**Effort** : 2-3h
**Impact** : 🟢🟢🟢 — Réduit le TTI de 1-2 secondes

### Contexte
Le dashboard est un seul composant \`"use client"\` de 422 lignes. Chaque widget est importé statiquement.

### Fichiers concernés
- \`components/dashboard/dashboard-shell.tsx\`

### Checklist
- [ ] Identifier les widgets sous le fold (MemberCard, Arsenal, etc.)
- [ ] Lazy-loader avec \`dynamic()\` les composants non critiques
- [ ] Garder \`DailyCheckinWidget\` et \`MissionDeck\` en import statique (above the fold)
- [ ] Mesurer la taille du bundle avant/après avec \`@next/bundle-analyzer\`
- [ ] Tester que la navigation reste fluide`
    },
    {
        title: "PERF-009: Ajouter des loading.tsx dans les routes principales",
        milestone: "M1 - Frontend & UX",
        labels: ["perf", "ux", "important"],
        body: `## 🟡 IMPORTANT — UX
**Créé le** : 2026-06-12
**Effort** : 1h
**Impact** : 🟢🟢 — Élimine les écrans blancs pendant le chargement

### Contexte
Les routes \`/dashboard\`, \`/squad\` et \`/missions\` n'ont pas de \`loading.tsx\` fonctionnel. L'utilisateur voit un écran blanc pendant 1-3s.

### Fichiers concernés
- \`app/dashboard/loading.tsx\` (vérifier le contenu)
- \`app/squad/loading.tsx\` (à créer)
- \`app/missions/loading.tsx\` (à créer)
- \`app/settings/loading.tsx\` (à créer)

### Checklist
- [ ] Vérifier le \`loading.tsx\` existant dans \`/dashboard\`
- [ ] Créer \`app/squad/loading.tsx\` avec un skeleton du SquadJourney
- [ ] Créer \`app/missions/loading.tsx\` avec un skeleton des cartes missions
- [ ] Créer \`app/settings/loading.tsx\`
- [ ] Utiliser \`animate-pulse\` pour les skeletons
- [ ] Tester en throttling réseau lent`
    },
    {
        title: "PERF-010: Réduire les polices Google chargées",
        milestone: "M1 - Frontend & UX",
        labels: ["perf", "frontend", "important"],
        body: `## 🟡 IMPORTANT — Frontend
**Créé le** : 2026-06-12
**Effort** : 30 min
**Impact** : 🟢🟢 — Réduit le FCP de 200-400ms

### Contexte
Le layout charge 3 polices (Syne, Outfit, IBM Plex Mono) avec 14 poids. Chaque fichier ~20-40 KB.

### Fichiers concernés
- \`app/layout.tsx\`
- \`app/globals.css\`

### Checklist
- [ ] Réduire Syne à 2-3 poids max (700, 800)
- [ ] Réduire Outfit à 2-3 poids (400, 500, 600)
- [ ] IBM Plex Mono : garder uniquement le poids 400
- [ ] Ajouter \`display: 'swap'\` si pas déjà fait
- [ ] Tester visuellement que rien ne casse`
    },
    {
        title: "PERF-011: Conditionner les animations CSS avec prefers-reduced-motion",
        milestone: "M1 - Frontend & UX",
        labels: ["perf", "ux", "important"],
        body: `## 🟡 IMPORTANT — A11y + Performance Mobile
**Créé le** : 2026-06-12
**Effort** : 30 min
**Impact** : 🟢 — Réduit la consommation GPU sur mobile

### Contexte
5+ animations CSS \`infinite\` (holo-sheen-sweep, hud-pulse, laser-sweep, grid-drift, hazard-sweep) tournent en permanence, même invisibles. Sur mobile bas de gamme : batterie + GPU excessifs.

### Fichiers concernés
- \`app/globals.css\`

### Checklist
- [ ] Ajouter une media query \`prefers-reduced-motion: reduce\` globale
- [ ] Alternativement, cibler les animations les plus lourdes
- [ ] Tester avec l'option "Reduce motion" activée
- [ ] Vérifier que les transitions de navigation fonctionnent toujours`
    },

    // --- M2 ---
    {
        title: "PERF-012: Migrer le cache in-memory vers Redis (Upstash)",
        milestone: "M2 - Base de données & caching",
        labels: ["perf", "database", "infra", "important"],
        body: `## 🟡 IMPORTANT — Scaling
**Créé le** : 2026-06-12
**Effort** : 2-3h
**Impact** : 🟢🟢🟢 — Prérequis au scaling horizontal

### Contexte
Cache actuel = \`Map\` JS en mémoire (\`lib/cache.ts\`). Perdu à chaque redémarrage, non partageable entre instances. Upstash Redis est déjà configuré et payé.

### Fichiers concernés
- \`lib/cache.ts\`

### Checklist
- [ ] Réécrire \`lib/cache.ts\` pour utiliser \`@upstash/redis\`
- [ ] Adapter les appelants à l'API async
- [ ] Ajouter un préfixe aux clés (\`hc:\`) pour éviter les collisions avec le rate limiter
- [ ] Tester que le cache fonctionne en dev
- [ ] Monitorer l'utilisation Redis dans le dashboard Upstash`
    },
    {
        title: "PERF-013: Ajouter Cache-Control sur les API GET publiques",
        milestone: "M2 - Base de données & caching",
        labels: ["perf", "infra", "important"],
        body: `## 🟡 IMPORTANT — Performance
**Créé le** : 2026-06-12
**Effort** : 1h
**Impact** : 🟢🟢 — Réduit la charge serveur de 30-50%

### Contexte
37/37 routes API en \`force-dynamic\`. Certaines API GET (feed, leaderboard, public) pourraient servir des réponses cachées 30-60s.

### Fichiers concernés
- \`app/api/feed/route.ts\`
- \`app/api/squad/leaderboard/route.ts\`
- \`app/api/squad/public/route.ts\`
- \`app/api/status/route.ts\`

### Checklist
- [ ] Retirer \`force-dynamic\` des routes GET purement informatives
- [ ] Ajouter \`Cache-Control: public, s-maxage=60, stale-while-revalidate=120\` sur les routes concernées
- [ ] Ne PAS toucher aux routes POST/PATCH/DELETE ni aux routes user-specific
- [ ] Tester que les réponses sont bien cachées (vérifier les headers)`
    },
    {
        title: "PERF-014: Paralléliser les requêtes de la page Squad",
        milestone: "M2 - Base de données & caching",
        labels: ["perf", "database", "important"],
        body: `## 🟡 IMPORTANT — Performance
**Créé le** : 2026-06-12
**Effort** : 30 min
**Impact** : 🟢🟢 — Réduit le TTFB de 200-400ms

### Contexte
\`app/squad/page.tsx\` fait 3 requêtes séquentielles au lieu de les exécuter en parallèle.

### Fichiers concernés
- \`app/squad/page.tsx\`

### Checklist
- [ ] Paralléliser avec \`Promise.all\` les requêtes \`getFullOrganization\` + \`user.findUnique\`
- [ ] Garder le fallback conditionnel (\`member.findFirst\`) uniquement si org est null
- [ ] Vérifier que le comportement reste identique
- [ ] Tester la page squad avec/sans squad`
    },
    {
        title: "PERF-015: Combiner les requêtes notifications",
        milestone: "M2 - Base de données & caching",
        labels: ["perf", "database", "important"],
        body: `## 🟡 IMPORTANT — Performance DB
**Créé le** : 2026-06-12
**Effort** : 15 min
**Impact** : 🟢 — Réduit de 2 à 1 les requêtes DB par appel

### Contexte
L'endpoint notifications fait 2 requêtes séparées : \`findMany\` + \`count\`. Le comptage non-lu peut être dérivé du résultat.

### Fichiers concernés
- \`app/api/user/notifications/route.ts\`

### Checklist
- [ ] Remplacer les 2 requêtes par un seul \`findMany\` + filtre JS pour le count
- [ ] Si le nombre total de non-lus peut dépasser 20, paralléliser avec \`Promise.all\` à la place
- [ ] Tester la notification bell dans le dashboard`
    },
    {
        title: "PERF-016: Optimiser le feed API (éviter le full table scan)",
        milestone: "M2 - Base de données & caching",
        labels: ["perf", "database", "important"],
        body: `## 🟡 IMPORTANT — Performance DB
**Créé le** : 2026-06-12
**Effort** : 30 min
**Impact** : 🟢🟢 — Critique à 10K+ utilisateurs

### Contexte
Le feed fait \`user.findMany({ orderBy: createdAt, take: 10 })\` sans filtre. À 100K users = full table scan.

### Fichiers concernés
- \`app/api/feed/route.ts\`

### Checklist
- [ ] S'assurer que PERF-005 est fait (index sur \`user.createdAt\`)
- [ ] Ajouter un filtre temporel (\`createdAt >= 7 jours\`) pour limiter le scan
- [ ] Même chose pour les submissions du feed
- [ ] Cacher le résultat dans Redis (cf. PERF-012) avec TTL de 60s
- [ ] Tester que le feed reste pertinent et non vide`
    },

    // --- M3 ---
    {
        title: "PERF-017: Ajouter PgBouncer devant PostgreSQL",
        milestone: "M3 - Infrastructure & scaling",
        labels: ["perf", "infra", "database", "secondary"],
        body: `## 🟢 SECONDAIRE — Infrastructure
**Créé le** : 2026-06-12
**Effort** : 2-3h
**Impact** : 🟢🟢 — Multiplie la capacité DB par 5-10x

### Contexte
Sans PgBouncer, chaque connexion Node.js ouvre un processus backend PostgreSQL dédié (coûteux en mémoire).

### Fichiers concernés
- \`compose.yaml\`
- \`lib/prisma.ts\`

### Checklist
- [ ] Ajouter un service PgBouncer dans \`compose.yaml\`
- [ ] Modifier \`DATABASE_URL\` pour pointer vers PgBouncer (\`@pgbouncer:6432\`)
- [ ] Garder \`DIRECT_URL\` vers PostgreSQL direct (pour les migrations)
- [ ] Tester les migrations via \`DIRECT_URL\`
- [ ] Tester l'app via PgBouncer
- [ ] Monitorer les connexions via \`SHOW POOLS\``
    },
    {
        title: "PERF-018: ISR pour la page Missions",
        milestone: "M3 - Infrastructure & scaling",
        labels: ["perf", "frontend", "secondary"],
        body: `## 🟢 SECONDAIRE — Performance
**Créé le** : 2026-06-12
**Effort** : 1h
**Impact** : 🟢 — TTFB quasi instantané pour \`/missions\`

### Contexte
La page missions utilise déjà \`unstable_cache\` avec \`revalidate: 300\` mais le reste est SSR dynamique. Les données missions sont hardcodées.

### Fichiers concernés
- \`app/missions/page.tsx\`

### Checklist
- [ ] Séparer les données statiques (liste missions) des données user-specific (submissions)
- [ ] Créer un layout intermédiaire en ISR pour les missions statiques
- [ ] Garder les submissions dynamiques (Suspense côté client)
- [ ] Tester le temps de réponse avant/après`
    },
    {
        title: "PERF-019: Rendre les notifications asynchrones",
        milestone: "M3 - Infrastructure & scaling",
        labels: ["perf", "infra", "secondary"],
        body: `## 🟢 SECONDAIRE — Performance API
**Créé le** : 2026-06-12
**Effort** : 2h
**Impact** : 🟢🟢 — Réduit la latence des endpoints de soumission de mission

### Contexte
\`triggerNotification()\` fait un write DB synchrone + envoi email dans le chemin critique. Si Resend timeout, la soumission entière ralentit.

### Fichiers concernés
- \`lib/qstash.ts\`
- \`app/api/missions/route.ts\`

### Checklist
- [ ] Option A : fire-and-forget la notification sans \`await\`
- [ ] Option B : utiliser QStash (déjà configuré) pour envoyer via queue HTTP
- [ ] Vérifier que les emails sont déjà en fire-and-forget (\`.catch()\`)
- [ ] Tester que les notifications sont toujours créées
- [ ] Monitorer les erreurs dans les logs`
    },
    {
        title: "PERF-020: Ajouter un CDN (Cloudflare) devant Traefik",
        milestone: "M3 - Infrastructure & scaling",
        labels: ["perf", "infra", "secondary"],
        body: `## 🟢 SECONDAIRE — Infrastructure
**Créé le** : 2026-06-12
**Effort** : 2-3h
**Impact** : 🟢🟢 — Cache les assets statiques et réduit la latence globale

### Contexte
Chaque requête (JS, CSS, images, polices) atteint directement le serveur via Traefik. Un CDN absorbe 70-80% du trafic.

### Fichiers concernés
- Configuration DNS (\`joinhashcode.com\`)
- \`next.config.mjs\` (headers CSP)

### Checklist
- [ ] Créer un compte Cloudflare
- [ ] Migrer les DNS vers Cloudflare
- [ ] Activer le proxy (nuage orange)
- [ ] Configurer les règles de cache (\`/_next/static/*\` = long, \`/api/*\` = bypass)
- [ ] Adapter la CSP
- [ ] Tester les headers de cache avec \`curl -I\`
- [ ] Activer la minification HTML/CSS/JS`
    },
    {
        title: "PERF-021: SSG pour la landing page",
        milestone: "M3 - Infrastructure & scaling",
        labels: ["perf", "frontend", "secondary"],
        body: `## 🟢 SECONDAIRE — Performance
**Créé le** : 2026-06-12
**Effort** : 1h
**Impact** : 🟢 — TTFB < 100ms pour la page d'accueil

### Contexte
La page d'accueil est 100% statique (pas de fetch serveur). Elle peut être pre-rendue en SSG.

### Fichiers concernés
- \`app/page.tsx\`

### Checklist
- [ ] Ajouter \`export const dynamic = 'force-static'\` en haut de \`app/page.tsx\`
- [ ] Vérifier qu'aucun composant landing n'appelle de fonction serveur
- [ ] Tester en build (\`npm run build\`) que la page est marquée \`○\` (statique)
- [ ] Vérifier le TTFB en production`
    },
    {
        title: "PERF-022: Extraire les données missions du bundle JavaScript",
        milestone: "M3 - Infrastructure & scaling",
        labels: ["perf", "frontend", "secondary"],
        body: `## 🟢 SECONDAIRE — Frontend
**Créé le** : 2026-06-12
**Effort** : 1h
**Impact** : 🟢 — Réduit le bundle de 36 KB

### Contexte
\`lib/missions.ts\` contient 36 KB de données missions hardcodées importées dans le bundle client.

### Fichiers concernés
- \`lib/missions.ts\`
- \`app/missions/page.tsx\`
- \`components/missions/missions-list.tsx\`

### Checklist
- [ ] Option A : S'assurer que le fichier n'est importé que dans les Server Components
- [ ] Option B : Migrer les missions vers la DB + seed via \`prisma/seed.ts\`
- [ ] Option C : Extraire dans un fichier JSON chargé côté serveur
- [ ] Vérifier le bundle client avec \`@next/bundle-analyzer\`
- [ ] Tester la page missions`
    }
];

console.log("\n=======================================================");
console.log("   HASHCODE - Publication des issues sur GitHub");
console.log(`   Repo: ${REPO}`);
console.log("=======================================================\n");

if (dryRun) {
    console.log("🔍 MODE DRY-RUN — Aucune modification ne sera effectuée\n");
}

// 1. Créer les labels
console.log("━━━ Étape 1/3 : Création des labels ━━━");
for (const label of labels) {
    try {
        const existingRaw = execSync(`gh label list --repo ${REPO} --search "${label.name}" --json name`).toString();
        const existing = JSON.parse(existingRaw);
        if (existing.some(l => l.name === label.name)) {
            console.log(`  ⏭️  Label '${label.name}' existe déjà`);
        } else {
            if (dryRun) {
                console.log(`  🏷️  [DRY] Créerait le label '${label.name}' (${label.color})`);
            } else {
                execSync(`gh label create "${label.name}" --repo ${REPO} --color "${label.color}" --description "${label.description}" --force`);
                console.log(`  ✅ Label '${label.name}' créé`);
            }
        }
    } catch (e) {
        if (!dryRun) {
            console.log(`  ❌ Erreur de vérification/création pour le label ${label.name}:`, e.message);
        }
    }
}
console.log("");

// 2. Créer les milestones
console.log("━━━ Étape 2/3 : Création des milestones ━━━");
const milestoneMap = {};

for (const ms of milestones) {
    try {
        const existingRaw = execSync(`gh api "repos/${REPO}/milestones" --jq ".[] | select(.title == \\"${ms.title}\\") | .number"`).toString().trim();
        if (existingRaw) {
            console.log(`  ⏭️  Milestone '${ms.title}' existe déjà (#${existingRaw})`);
            milestoneMap[ms.title] = parseInt(existingRaw, 10);
        } else {
            if (dryRun) {
                console.log(`  🎯 [DRY] Créerait le milestone '${ms.title}'`);
                milestoneMap[ms.title] = 0;
            } else {
                const msNumber = execSync(`gh api "repos/${REPO}/milestones" --method POST --field title="${ms.title}" --field description="${ms.description}" --field due_on="${ms.due_on}" --jq ".number"`).toString().trim();
                console.log(`  ✅ Milestone '${ms.title}' créé (#${msNumber})`);
                milestoneMap[ms.title] = parseInt(msNumber, 10);
            }
        }
    } catch (e) {
        console.log(`  ❌ Erreur pour le milestone ${ms.title}:`, e.message);
    }
}
console.log("");

// 3. Créer les issues
console.log("━━━ Étape 3/3 : Création des issues ━━━");
let createdCount = 0;
let skippedCount = 0;

for (const issue of issues) {
    try {
        const searchTitle = issue.title.substring(0, 8);
        const existingIssuesRaw = execSync(`gh issue list --repo ${REPO} --search "in:title ${searchTitle}" --state all --json title`).toString();
        const existingIssues = JSON.parse(existingIssuesRaw);
        const alreadyExists = existingIssues.some(i => i.title === issue.title);

        if (alreadyExists) {
            console.log(`  ⏭️  '${issue.title}' existe déjà`);
            skippedCount++;
            continue;
        }

        if (dryRun) {
            console.log(`  📝 [DRY] Créerait l'issue: ${issue.title}`);
            console.log(`          Labels: ${issue.labels.join(', ')}  |  Milestone: ${issue.milestone}`);
            createdCount++;
            continue;
        }

        const labelArgs = issue.labels.map(l => `--label "${l}"`).join(' ');
        const msNumber = milestoneMap[issue.milestone];
        const milestoneArg = msNumber ? `--milestone "${issue.milestone}"` : '';

        // Utiliser des fichiers temporaires ou envoyer via stdin pour éviter les problèmes d'arguments longs et d'accents sous Windows CMD/PowerShell
        const fs = require('fs');
        const path = require('path');
        const tempFilePath = path.join(process.env.TEMP || '.', `issue_${createdCount}.md`);
        fs.writeFileSync(tempFilePath, issue.body, 'utf8');

        execSync(`gh issue create --repo ${REPO} --title "${issue.title}" --body-file "${tempFilePath}" ${labelArgs} ${milestoneArg}`);
        
        try { fs.unlinkSync(tempFilePath); } catch (e) {}

        console.log(`  ✅ ${issue.title}`);
        createdCount++;
    } catch (e) {
        console.log(`  ❌ Erreur pour l'issue '${issue.title}':`, e.message);
    }
}

console.log("\n=======================================================");
console.log(`  Résultat: ${createdCount} créées, ${skippedCount} ignorées`);
console.log("=======================================================\n");

# HASHCODE — Issues Performance & Scalabilité

> **Créé le** : 2026-06-12  
> **Dernière mise à jour** : 2026-06-12  
> **Source** : Audit performance & scalabilité

Chaque issue est autonome, avec fichiers concernés et checklist de correction.
Les milestones sont à traiter **dans l'ordre** (M0 → M1 → M2 → M3).

---

## Milestones

| Milestone                               | Objectif                                               | Effort     | Palier visé   |
| --------------------------------------- | ------------------------------------------------------ | ---------- | ------------- |
| **M0 — Urgences sécurité & quick wins** | Corriger les failles critiques + gains immédiats       | ~1 jour    | 500 users     |
| **M1 — Frontend & UX**                  | Découper les composants géants, ajouter loading states | ~3-4 jours | 1 000 users   |
| **M2 — Base de données & caching**      | Migrer le cache, optimiser les requêtes, pooling       | ~3-4 jours | 5 000 users   |
| **M3 — Infrastructure & scaling**       | CDN, PgBouncer, ISR, async notifications               | ~5-7 jours | 10 000+ users |

---

## Ordre de traitement recommandé

```
Jour 1       → PERF-001, PERF-002, PERF-003, PERF-004, PERF-005, PERF-006
Jours 2-4    → PERF-007, PERF-008, PERF-009, PERF-010, PERF-011
Jours 5-8    → PERF-012, PERF-013, PERF-014, PERF-015, PERF-016
Jours 9-15   → PERF-017, PERF-018, PERF-019, PERF-020, PERF-021, PERF-022
```

---

---

# M0 — Urgences Sécurité & Quick Wins

> Objectif : corriger les failles bloquantes et obtenir des gains de performance immédiats sans refactoring.

---

## PERF-001 — 🔴 Révoquer les secrets exposés dans `.env.production`

**Créé le** : 2026-06-12  
**Priorité** : CRITIQUE — Sécurité
**Effort** : 30 min
**Impact** : Sécurité (∞)

### Contexte

Le fichier `.env.production` est commité dans Git avec tous les secrets de production en clair : mots de passe PostgreSQL, clés OAuth Google/GitHub, tokens Resend/QStash/Upstash.

### Fichiers concernés

- `.env.production`
- `.gitignore`

### Checklist

- [ ] Révoquer et régénérer le mot de passe PostgreSQL de production
- [ ] Régénérer le `BETTER_AUTH_SECRET`
- [ ] Régénérer les credentials OAuth Google (`GOOGLE_CLIENT_SECRET`)
- [ ] Régénérer les credentials OAuth GitHub (`GITHUB_CLIENT_SECRET`)
- [ ] Régénérer la clé API Resend (`RESEND_API_KEY`)
- [ ] Régénérer les tokens QStash (`QSTASH_TOKEN`, signing keys)
- [ ] Régénérer les tokens Upstash Redis/KV
- [ ] Ajouter `.env.production` à `.gitignore`
- [ ] Supprimer `.env.production` de l'historique Git (`git filter-branch` ou BFG Repo Cleaner)
- [ ] Configurer les secrets via variables d'environnement Docker (compose `environment:` ou fichier `.env` non commité)
- [ ] Vérifier que `.env`, `.env.local`, `.env.production` sont tous dans `.gitignore`

---

## PERF-002 — 🔴 Supprimer la désactivation TLS globale

**Créé le** : 2026-06-12  
**Priorité** : CRITIQUE — Sécurité
**Effort** : 15 min
**Impact** : Sécurité (∞)

### Contexte

`process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"` dans `lib/prisma.ts` ligne 7 désactive la vérification des certificats TLS pour **tout le process Node.js**, pas seulement la connexion DB. Cela expose toutes les requêtes HTTP sortantes (Resend, QStash, Upstash) à des attaques Man-in-the-Middle.

### Fichiers concernés

- `lib/prisma.ts`

### Checklist

- [ ] Supprimer la ligne `process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"`
- [ ] La connexion DB locale utilise déjà `ssl: false` quand `isLocalDb` est true — c'est suffisant
- [ ] Pour la prod Docker, le PostgreSQL est en local (`@db:5432`) donc pas besoin de SSL
- [ ] Tester que la connexion DB fonctionne toujours en dev et en prod
- [ ] Si un certificat auto-signé est nécessaire, utiliser `ssl: { rejectUnauthorized: false }` **uniquement** dans les options du Pool pg, pas globalement

---

## PERF-003 — 🔴 Configurer le pool de connexions PostgreSQL

**Créé le** : 2026-06-12  
**Priorité** : CRITIQUE — Performance DB
**Effort** : 15 min
**Impact** : 🟢🟢🟢 — Empêche la saturation DB dès ~100 users concurrents

### Contexte

Le pool `pg` est instancié sans configuration de taille. Le défaut est `max: 10` connexions, ce qui est insuffisant sous charge. Pas de timeout configuré non plus.

### Fichiers concernés

- `lib/prisma.ts`

### Checklist

- [ ] Configurer le pool `pg` avec des paramètres explicites :
  ```typescript
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // Connexions max (ajuster selon la RAM du serveur)
    idleTimeoutMillis: 30000, // Fermer les connexions idle après 30s
    connectionTimeoutMillis: 5000, // Timeout si pas de connexion dispo en 5s
    ssl: isLocalDb ? false : { rejectUnauthorized: false },
  });
  ```
- [ ] Tester sous charge locale avec 20 requêtes simultanées
- [ ] Monitorer en production le nombre de connexions actives

---

## PERF-004 — 🔴 Activer l'optimisation d'images Next.js

**Créé le** : 2026-06-12  
**Priorité** : CRITIQUE — Frontend
**Effort** : 20 min
**Impact** : 🟢🟢🟢 — Amélioration LCP de ~1-2 secondes

### Contexte

`images: { unoptimized: true }` dans `next.config.mjs` désactive toute l'optimisation d'images Next.js : pas de conversion WebP/AVIF, pas de resize automatique, pas de lazy loading natif. C'est le principal tueur de LCP.

### Fichiers concernés

- `next.config.mjs`

### Checklist

- [ ] Supprimer `unoptimized: true` (ou le mettre à `false`)
- [ ] Vérifier que les `remotePatterns` couvrent tous les domaines d'images utilisés
- [ ] Ajouter les domaines manquants si nécessaire (avatars, etc.)
- [ ] Remplacer les `<img>` par `<Image>` de `next/image` dans les composants qui utilisent encore `<img>`
- [ ] Tester que les images s'affichent correctement en dev
- [ ] En production standalone, vérifier que le dossier `.next/cache/images` est persisté (volume Docker)

---

## PERF-005 — 🔴 Ajouter les index DB manquants

**Créé le** : 2026-06-12  
**Priorité** : CRITIQUE — Performance DB
**Effort** : 15 min
**Impact** : 🟢🟢 — Requêtes squad et feed 5-10x plus rapides

### Contexte

Plusieurs requêtes fréquentes opèrent sur des colonnes non indexées, causant des full table scans.

### Fichiers concernés

- `prisma/schema.prisma`

### Checklist

- [ ] Ajouter `@@index([userId])` sur le modèle `Member` (ligne ~134)
  ```prisma
  @@index([userId])
  @@index([organizationId])
  ```
- [ ] Ajouter `@@index([createdAt])` sur le modèle `User` (pour le tri du feed)
  ```prisma
  @@index([createdAt])
  ```
- [ ] Ajouter un index composite sur `MissionSubmission` :
  ```prisma
  @@index([status, missionId])
  ```
- [ ] Générer la migration : `npx prisma migrate dev --name add-perf-indexes`
- [ ] Vérifier que la migration SQL est correcte
- [ ] Appliquer en production : `npx prisma migrate deploy`

---

## PERF-006 — 🔴 Réduire le chargement de submissions sur le dashboard

**Créé le** : 2026-06-12  
**Priorité** : CRITIQUE — Performance
**Effort** : 10 min
**Impact** : 🟢🟢 — Réduit la taille HTML et le temps de sérialisation

### Contexte

Le dashboard charge `take: 200` soumissions avec un JOIN sur la table `mission`, alors que l'UI n'affiche que l'historique des missions validées (< 10 en général pour un utilisateur moyen). Ces 200 objets sont sérialisés dans le HTML initial du Server Component.

### Fichiers concernés

- `app/dashboard/page.tsx`

### Checklist

- [ ] Réduire `take: 200` à `take: 20` dans le `findMany` des submissions (ligne 67)
- [ ] Ajouter un filtre `status` si seuls les `APPROVED` et `PENDING` sont nécessaires
- [ ] Si un historique complet est nécessaire, implémenter une pagination côté client via l'API
- [ ] Vérifier que le `submissionsMap` et le `MissionHistory` fonctionnent toujours correctement

---

---

# M1 — Frontend & UX

> Objectif : réduire le JavaScript envoyé au client, ajouter des loading states, améliorer les Core Web Vitals.

---

## PERF-007 — 🟡 Découper `squad-journey.tsx` (74 KB)

**Créé le** : 2026-06-12  
**Priorité** : IMPORTANT — Frontend
**Effort** : 3-4h
**Impact** : 🟢🟢🟢 — Réduit le TTI de 2-4 secondes sur mobile

### Contexte

`squad-journey.tsx` fait 74 KB de source (probablement >200 KB compilé+minifié). C'est un méga-composant monolithique qui contient tout le flow de création/gestion de squad. Sur mobile 3G, c'est 5-8 secondes de chargement JS.

### Fichiers concernés

- `components/dashboard/squad-journey.tsx`

### Checklist

- [ ] Identifier les sections logiques du composant (lobby, membres, paramètres, chat, etc.)
- [ ] Extraire chaque section dans un fichier séparé
- [ ] Utiliser `dynamic()` de Next.js pour lazy-loader les sections non visibles au premier render
  ```typescript
  const SquadSettings = dynamic(() => import('./squad/squad-settings'), {
    loading: () => <SquadSettingsSkeleton />
  })
  ```
- [ ] Garder le composant principal comme orchestrateur léger (<5 KB)
- [ ] Ajouter des skeletons de chargement pour chaque section lazy-loadée
- [ ] Tester sur mobile (Chrome DevTools throttle 3G)

---

## PERF-008 — 🟡 Découper `dashboard-shell.tsx` (25 KB)

**Créé le** : 2026-06-12  
**Priorité** : IMPORTANT — Frontend
**Effort** : 2-3h
**Impact** : 🟢🟢🟢 — Réduit le TTI de 1-2 secondes

### Contexte

Le dashboard entier est un seul composant client `"use client"` de 422 lignes. Chaque widget (MemberCard, ReferralCard, AmbassadorGoal, MissionDeck, NeuralFeed) est importé statiquement.

### Fichiers concernés

- `components/dashboard/dashboard-shell.tsx`

### Checklist

- [ ] Identifier les widgets au-dessous du fold initial (MemberCard holographique, Arsenal, etc.)
- [ ] Lazy-loader avec `dynamic()` les composants non critiques :
  ```typescript
  const MemberCard = dynamic(() => import('@/components/ui/member-card').then(m => ({ default: m.MemberCard })), {
    loading: () => <div className="h-64 animate-pulse bg-white/5 rounded-4xl" />
  })
  const ReferralCard = dynamic(() => import('./ReferralCard').then(m => ({ default: m.ReferralCard })))
  const AmbassadorGoal = dynamic(() => import('./AmbassadorGoal').then(m => ({ default: m.AmbassadorGoal })))
  ```
- [ ] Garder `DailyCheckinWidget` et `MissionDeck` en import statique (above the fold)
- [ ] Mesurer la taille du bundle avant/après avec `next build --analyze` (ou `@next/bundle-analyzer`)
- [ ] Tester que la navigation et les interactions restent fluides

---

## PERF-009 — 🟡 Ajouter des `loading.tsx` dans les routes principales

**Créé le** : 2026-06-12  
**Priorité** : IMPORTANT — UX
**Effort** : 1h
**Impact** : 🟢🟢 — Élimine les écrans blancs pendant le chargement

### Contexte

Les routes `/dashboard`, `/squad` et `/missions` n'ont pas de fichier `loading.tsx`. Quand le Server Component charge les données (200-500ms), l'utilisateur voit un écran blanc.

### Fichiers concernés

- `app/dashboard/loading.tsx` (existe déjà mais vérifier le contenu)
- `app/squad/loading.tsx` (à créer)
- `app/missions/loading.tsx` (à créer)
- `app/settings/loading.tsx` (à créer)

### Checklist

- [ ] Vérifier le `loading.tsx` existant dans `/dashboard` — s'assurer qu'il a un skeleton pertinent
- [ ] Créer `app/squad/loading.tsx` avec un skeleton qui reflète la structure du SquadJourney
- [ ] Créer `app/missions/loading.tsx` avec un skeleton montrant les cartes de missions
- [ ] Créer `app/settings/loading.tsx`
- [ ] Utiliser des classes `animate-pulse` pour les skeletons
- [ ] Tester en throttling réseau lent pour vérifier l'affichage

---

## PERF-010 — 🟡 Réduire les polices Google chargées

**Créé le** : 2026-06-12  
**Priorité** : IMPORTANT — Frontend
**Effort** : 30 min
**Impact** : 🟢🟢 — Réduit le FCP de 200-400ms

### Contexte

Le layout charge **3 polices** (Syne, Outfit, IBM Plex Mono) avec **14 poids au total**. Chaque fichier de police est ~20-40 KB. Les polices sont le 2ème facteur de blocage du FCP après les images.

### Fichiers concernés

- `app/layout.tsx`
- `app/globals.css`

### Checklist

- [ ] Réduire Syne à 2-3 poids maximum (700, 800 suffisent pour les titres)
- [ ] Réduire Outfit à 2-3 poids (400, 500, 600)
- [ ] IBM Plex Mono : garder uniquement le poids 400 (pour le code/mono)
- [ ] Ajouter `display: 'swap'` si pas déjà fait (pour éviter le FOIT)
  ```typescript
  const syne = Syne({
    subsets: ["latin"],
    variable: "--font-syne",
    weight: ["700", "800"],
    display: "swap",
  });
  ```
- [ ] Tester visuellement que rien ne casse (titres, body, mono)

---

## PERF-011 — 🟡 Conditionner les animations CSS avec `prefers-reduced-motion`

**Créé le** : 2026-06-12  
**Priorité** : IMPORTANT — A11y + Performance Mobile
**Effort** : 30 min
**Impact** : 🟢 — Réduit la consommation GPU sur mobile

### Contexte

Le CSS global contient 5+ animations `infinite` (holo-sheen-sweep, hud-pulse, laser-sweep, grid-drift, hazard-sweep) qui tournent en permanence, même quand elles ne sont pas visibles. Sur mobile bas de gamme (cible Afrique), cela consomme de la batterie et du GPU.

### Fichiers concernés

- `app/globals.css`

### Checklist

- [ ] Ajouter une media query globale pour couper les animations :
  ```css
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- [ ] Alternativement, cibler spécifiquement les animations les plus lourdes
- [ ] Tester avec l'option "Reduce motion" activée dans les paramètres OS/navigateur
- [ ] Vérifier que les transitions de navigation fonctionnent toujours (TopLoader, etc.)

---

---

# M2 — Base de Données & Caching

> Objectif : optimiser les requêtes, migrer le cache vers Redis, améliorer le temps de réponse des API.

---

## PERF-012 — 🟡 Migrer le cache in-memory vers Redis (Upstash)

**Créé le** : 2026-06-12  
**Priorité** : IMPORTANT — Scaling
**Effort** : 2-3h
**Impact** : 🟢🟢🟢 — Prérequis au scaling horizontal

### Contexte

Le cache actuel est un `Map` JavaScript en mémoire (`lib/cache.ts`). Il est perdu à chaque redémarrage et ne peut pas être partagé entre plusieurs instances. Upstash Redis est déjà configuré et payé (rate limiting).

### Fichiers concernés

- `lib/cache.ts`

### Checklist

- [ ] Installer `@upstash/redis` (déjà dans les dépendances)
- [ ] Réécrire `lib/cache.ts` pour utiliser Redis :

  ```typescript
  import { Redis } from "@upstash/redis";

  const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });

  export async function getCache<T>(key: string): Promise<T | null> {
    return redis.get<T>(key);
  }

  export async function setCache(key: string, data: unknown, ttlSeconds = 60) {
    await redis.set(key, data, { ex: ttlSeconds });
  }
  ```

- [ ] Adapter les appelants de `getCache`/`setCache` à l'API async
- [ ] Ajouter un préfixe aux clés (`hc:` par ex.) pour éviter les collisions avec le rate limiter
- [ ] Tester que le cache fonctionne en dev (vérifier les env vars Upstash)
- [ ] Monitorer l'utilisation Redis dans le dashboard Upstash

---

## PERF-013 — 🟡 Ajouter `Cache-Control` sur les API GET publiques

**Créé le** : 2026-06-12  
**Priorité** : IMPORTANT — Performance
**Effort** : 1h
**Impact** : 🟢🟢 — Réduit la charge serveur de 30-50% pour les endpoints répétitifs

### Contexte

Sur 37 routes API, toutes sont en `force-dynamic`. Certaines API GET (feed, squad leaderboard, squad public) pourraient servir des réponses cachées 30-60 secondes sans impact fonctionnel.

### Fichiers concernés

- `app/api/feed/route.ts` (déjà un `Cache-Control` — vérifier si effectif avec `force-dynamic`)
- `app/api/squad/leaderboard/route.ts`
- `app/api/squad/public/route.ts`
- `app/api/status/route.ts`

### Checklist

- [ ] Pour les routes GET purement informatives, **retirer** `export const dynamic = 'force-dynamic'` et laisser Next.js gérer le cache
- [ ] Pour les routes qui DOIVENT rester dynamiques mais sont peu sensibles au temps réel, ajouter un header :
  ```typescript
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
  ```
- [ ] Le feed API a déjà un `Cache-Control` mais `force-dynamic` l'annule — retirer le `force-dynamic` de cette route
- [ ] Ne PAS toucher aux routes POST/PATCH/DELETE ni aux routes user-specific (me, notifications)
- [ ] Tester que les réponses sont bien cachées (vérifier les headers dans le navigateur)

---

## PERF-014 — 🟡 Paralléliser les requêtes de la page Squad

**Créé le** : 2026-06-12  
**Priorité** : IMPORTANT — Performance
**Effort** : 30 min
**Impact** : 🟢🟢 — Réduit le TTFB de 200-400ms

### Contexte

`app/squad/page.tsx` fait 3 requêtes **séquentielles** au lieu de les exécuter en parallèle.

### Fichiers concernés

- `app/squad/page.tsx`

### Checklist

- [ ] Refactorer pour paralléliser les requêtes DB :

  ```typescript
  const [org, dbUser] = await Promise.all([
    auth.api.getFullOrganization({ headers: await headers() }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: {...} }),
  ]);

  // Fallback conditionnel uniquement si org est null
  let dbSquad = null;
  if (!org) {
    dbSquad = await prisma.member.findFirst({...});
  }
  ```

- [ ] Vérifier que le comportement reste identique
- [ ] Tester la page squad dans les deux cas (avec/sans squad)

---

## PERF-015 — 🟡 Combiner les requêtes notifications

**Créé le** : 2026-06-12  
**Priorité** : IMPORTANT — Performance DB
**Effort** : 15 min
**Impact** : 🟢 — Réduit de 2 à 1 les requêtes DB par appel

### Contexte

L'endpoint notifications fait 2 requêtes séparées : un `findMany` et un `count`. Le comptage non-lu peut être dérivé du résultat du `findMany`.

### Fichiers concernés

- `app/api/user/notifications/route.ts`

### Checklist

- [ ] Remplacer les 2 requêtes par une seule :
  ```typescript
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  ```
- [ ] Attention : si le nombre total de non-lus dépasse 20, le count sera tronqué. Si c'est un problème, garder le `count` séparé mais utiliser `Promise.all` pour les paralléliser
- [ ] Tester la notification bell dans le dashboard

---

## PERF-016 — 🟡 Optimiser le feed API (éviter le full table scan)

**Créé le** : 2026-06-12  
**Priorité** : IMPORTANT — Performance DB
**Effort** : 30 min
**Impact** : 🟢🟢 — Critique à 10K+ utilisateurs

### Contexte

Le feed API fait un `user.findMany({ orderBy: { createdAt: "desc" }, take: 10 })` sans filtre. À 100K utilisateurs, PostgreSQL doit scanner et trier toute la table avant de retourner 10 résultats. La colonne `createdAt` sur `user` n'a pas d'index (corrigé dans PERF-005).

### Fichiers concernés

- `app/api/feed/route.ts`

### Checklist

- [ ] S'assurer que PERF-005 est fait (index sur `user.createdAt`)
- [ ] Ajouter un filtre temporel pour limiter le scan :
  ```typescript
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  prisma.user.findMany({
    where: { createdAt: { gte: oneWeekAgo } },
    orderBy: { createdAt: "desc" },
    take: 10,
    ...
  })
  ```
- [ ] Même chose pour les submissions du feed
- [ ] Envisager de cacher le résultat du feed dans Redis (PERF-012) avec un TTL de 60s
- [ ] Tester que le feed reste pertinent et non vide

---

---

# M3 — Infrastructure & Scaling

> Objectif : préparer l'infrastructure pour 10 000+ utilisateurs, ajouter des couches de cache, rendre les opérations lourdes asynchrones.

---

## PERF-017 — 🟢 Ajouter PgBouncer devant PostgreSQL

**Créé le** : 2026-06-12  
**Priorité** : SECONDAIRE — Infrastructure
**Effort** : 2-3h
**Impact** : 🟢🟢 — Multiplie la capacité DB par 5-10x

### Contexte

Sans PgBouncer, chaque connexion Node.js → PostgreSQL ouvre un processus backend PostgreSQL dédié (coûteux en mémoire). PgBouncer pool les connexions et réduit drastiquement la pression sur PostgreSQL.

### Fichiers concernés

- `compose.yaml`
- `lib/prisma.ts`

### Checklist

- [ ] Ajouter un service PgBouncer dans `compose.yaml` :
  ```yaml
  pgbouncer:
    image: edoburu/pgbouncer:latest
    environment:
      DATABASE_URL: postgres://postgres:${DB_PASSWORD}@db:5432/${DB_NAME}
      POOL_MODE: transaction
      MAX_CLIENT_CONN: 200
      DEFAULT_POOL_SIZE: 20
    ports:
      - "6432:6432"
    depends_on:
      - db
  ```
- [ ] Modifier `DATABASE_URL` pour pointer vers PgBouncer (`@pgbouncer:6432`)
- [ ] Garder `DIRECT_URL` pointant vers PostgreSQL direct (pour les migrations)
- [ ] Tester les migrations : `npx prisma migrate deploy` via `DIRECT_URL`
- [ ] Tester l'app via PgBouncer
- [ ] Monitorer les connexions via `SHOW POOLS` dans PgBouncer

---

## PERF-018 — 🟢 ISR pour la page Missions

**Créé le** : 2026-06-12  
**Priorité** : SECONDAIRE — Performance
**Effort** : 1h
**Impact** : 🟢 — TTFB quasi instantané pour `/missions`

### Contexte

La page missions utilise déjà `unstable_cache` avec `revalidate: 300` pour l'enrichissement, mais le reste de la page est toujours SSR dynamique. Les données missions elles-mêmes sont statiques (hardcodées dans `lib/missions.ts`).

### Fichiers concernés

- `app/missions/page.tsx`

### Checklist

- [ ] Séparer les données statiques (liste des missions) des données user-specific (submissions)
- [ ] Créer un layout intermédiaire qui charge les missions statiques en ISR
- [ ] Les submissions user restent dynamiques (chargées côté client ou via Suspense)
- [ ] Alternativement, convertir la page en route dynamique mais avec `unstable_cache` plus agressif sur les données partagées
- [ ] Tester le temps de réponse avant/après

---

## PERF-019 — 🟢 Rendre les notifications asynchrones

**Créé le** : 2026-06-12  
**Priorité** : SECONDAIRE — Performance API
**Effort** : 2h
**Impact** : 🟢🟢 — Réduit la latence des endpoints de soumission de mission

### Contexte

`triggerNotification()` dans `lib/qstash.ts` fait un write DB synchrone + envoi email dans le chemin critique de la soumission de mission. Si Resend est lent (timeout), la soumission de mission entière ralentit.

### Fichiers concernés

- `lib/qstash.ts`
- `app/api/missions/route.ts`

### Checklist

- [ ] Option A (simple) : fire-and-forget la notification sans `await` :
  ```typescript
  // Ne pas await la notification — elle ne doit pas bloquer la réponse
  triggerNotification({...}).catch(err => console.error("[NOTIF_ERROR]", err));
  ```
- [ ] Option B (robuste) : utiliser QStash (déjà configuré) pour envoyer les notifications via une queue HTTP
- [ ] Pour les emails, ils sont déjà en fire-and-forget (`.catch()`) — vérifier que c'est le cas partout
- [ ] Tester que les notifications sont toujours créées après une soumission
- [ ] Monitorer les erreurs de notification dans les logs

---

## PERF-020 — 🟢 Ajouter un CDN (Cloudflare) devant Traefik

**Créé le** : 2026-06-12  
**Priorité** : SECONDAIRE — Infrastructure
**Effort** : 2-3h
**Impact** : 🟢🟢 — Cache les assets statiques et réduit la latence globale

### Contexte

Actuellement, chaque requête (y compris les fichiers JS, CSS, images, polices) atteint directement le serveur via Traefik. Un CDN absorbe 70-80% du trafic pour les assets statiques.

### Fichiers concernés

- Configuration DNS (`joinhashcode.com`)
- `next.config.mjs` (headers CSP à adapter)

### Checklist

- [ ] Créer un compte Cloudflare (gratuit suffit)
- [ ] Migrer les DNS de `joinhashcode.com` vers Cloudflare
- [ ] Activer le proxy Cloudflare (nuage orange) sur les enregistrements DNS
- [ ] Configurer les règles de cache :
  - `/_next/static/*` → cache long (1 an, immutable)
  - `/api/*` → pas de cache (bypass)
  - `/*.png, /*.svg, /*.ico` → cache 1 mois
- [ ] Adapter la CSP dans `next.config.mjs` pour autoriser les CDN Cloudflare
- [ ] Tester avec `curl -I` que les headers de cache sont corrects
- [ ] Activer la minification HTML/CSS/JS dans Cloudflare

---

## PERF-021 — 🟢 SSG pour la landing page

**Créé le** : 2026-06-12  
**Priorité** : SECONDAIRE — Performance
**Effort** : 1h
**Impact** : 🟢 — TTFB < 100ms pour la page d'accueil

### Contexte

La page d'accueil (`app/page.tsx`) est 100% statique — elle ne fetch aucune donnée côté serveur. Elle utilise déjà `dynamic()` pour les composants lazy-loaded. Elle peut être pre-rendue en SSG.

### Fichiers concernés

- `app/page.tsx`

### Checklist

- [ ] Ajouter `export const dynamic = 'force-static'` en haut de `app/page.tsx`
- [ ] Vérifier que rien dans les composants landing n'appelle de fonction serveur ou de données dynamiques
- [ ] Tester en build (`npm run build`) que la page est bien pre-rendue (marquée `○` dans l'output)
- [ ] Vérifier le TTFB de la landing page en production

---

## PERF-022 — 🟢 Extraire les données missions du bundle JavaScript

**Créé le** : 2026-06-12  
**Priorité** : SECONDAIRE — Frontend
**Effort** : 1h
**Impact** : 🟢 — Réduit le bundle de 36 KB

### Contexte

`lib/missions.ts` contient 36 KB de données missions hardcodées (textes de briefing longs, requirements, etc.) qui sont importées dans le bundle client via les pages et composants. Ces données pourraient être servies depuis la DB ou un fichier JSON côté serveur uniquement.

### Fichiers concernés

- `lib/missions.ts`
- `app/missions/page.tsx`
- `components/missions/missions-list.tsx`

### Checklist

- [ ] Option A : Garder le fichier mais s'assurer qu'il n'est importé que dans les Server Components (vérifier les imports côté client)
- [ ] Option B : Migrer les missions vers la DB (le modèle `Mission` existe déjà dans Prisma) et seed via `prisma/seed.ts`
- [ ] Option C : Extraire dans un fichier JSON et le charger côté serveur avec `fs.readFileSync` au build time
- [ ] Vérifier que le bundle client ne contient plus les données missions avec `@next/bundle-analyzer`
- [ ] Tester que la page missions affiche toujours les données correctement

---

---

## Légende

| Icône  | Signification                              |
| ------ | ------------------------------------------ |
| 🔴     | Critique — à faire immédiatement           |
| 🟡     | Important — à planifier sous 1-2 semaines  |
| 🟢     | Secondaire — à planifier sous 3-4 semaines |
| 🟢🟢🟢 | ROI très élevé                             |
| 🟢🟢   | ROI élevé                                  |
| 🟢     | ROI modéré                                 |

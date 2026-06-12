# Recommandations Senior — JoinHashcode
**Date** : 2026-06-12  
**Source** : Analyse statique complète du code source (audit sécurité + revalidation beta)  
**Branch analysée** : `fix/avatar-upload-display` → commit `fe6f657`

---

## Légende priorités

| Niveau | Signification |
|--------|--------------|
| 🔴 P0 | Bloquant pour la montée en charge |
| 🟠 P1 | Avant la prochaine cohorte beta |
| 🟡 P2 | Dette architecturale — rembourser progressivement |

---

## 🔴 P0 — À corriger avant la montée en charge

---

### 1. Middleware : double fetch synchrone sur chaque requête protégée

**Fichier** : `middleware.ts`

**Problème** :
```ts
// Deux fetch() bloquants en série sur chaque navigation
fetch(`http://127.0.0.1/api/auth/get-session`) // ~50ms
fetch(`http://127.0.0.1/api/user/me`)           // ~80ms
// Total : ~130ms de latence artificielle sur 100% des pages protégées
```

À 100 utilisateurs simultanés = 200 requêtes HTTP internes/seconde de navigation. En prod Docker, le loopback HTTP est coûteux.

**Solution** : enrichir le JWT Better Auth avec `currentSituation` et `class` via `user.additionalFields`. Ces deux champs sont les seuls utilisés pour le funnel — lire directement depuis le cookie signé, 0 fetch.

```ts
// Cible : middleware réduit à lecture cookie locale
const sessionCookie = getSessionCookie(request)
const { currentSituation, class: userClass } = sessionCookie.user
// 0ms de réseau — decision prise en local
```

**Effort** : 2h | **Gain** : −130ms latence sur chaque navigation

---

### 2. `any` partout — TypeScript sans filet de sécurité

**Fichiers** : `dashboard-shell.tsx`, `squad-journey.tsx`, `dossier-view.tsx`, et ~20 autres

**Problème** :
```ts
// dashboard-shell.tsx
user: any, quizResult: any, squad: any

// dossier-view.tsx
(user.behavioralVibrancy as any)?.score

// next.config.mjs
ignoreBuildErrors: true  // TypeScript ne bloque plus le build
```

Un changement de schéma Prisma ne cassera plus le build — il cassera en prod silencieusement. Le `ignoreBuildErrors: true` transforme TypeScript en documentation morte.

**Solution** :
1. Créer `lib/types.ts` avec les types dérivés du schéma Prisma :
```ts
import { Prisma } from "@/generated/prisma"

export type UserProfile = Prisma.UserGetPayload<{
  select: {
    id: true; name: true; email: true; image: true;
    level: true; experience: true; class: true; role: true;
    // ... tous les champs utilisés en UI
  }
}>
```
2. Remplacer tous les `user: any` par `user: UserProfile`
3. Retirer `ignoreBuildErrors: true` de `next.config.mjs`
4. Corriger les erreurs TS révélées

**Effort** : 1 jour | **Gain** : filet CI, refactors sûrs, autocomplétion

---

## 🟠 P1 — Avant la prochaine cohorte

---

### 3. `window.location.reload()` dans les handlers de mutation

**Fichiers** : `components/dashboard/squad/JoinRequestsManager.tsx`, `components/settings/TwoFactorSetup.tsx`, `components/dashboard/squad-journey.tsx`

**Problème** :
```ts
// Reload complet = re-fetch tout le contexte, flash de page, perte de scroll
if (action === "accept") window.location.reload()
window.location.reload() // après enable/disable 2FA
```

**Solution** : `router.refresh()` revalide les Server Components sans reload complet.

```ts
import { useRouter } from "next/navigation"
const router = useRouter()

// Remplacer window.location.reload() par :
router.refresh()
// Ou pour TanStack Query :
queryClient.invalidateQueries({ queryKey: ["user"] })
```

**Effort** : 30min | **Gain** : UX fluide, pas de flash, pas de perte de scroll

---

### 4. Pas de cache sur `/api/user/me` — appelé à chaque navigation

**Fichier** : `app/api/user/me/route.ts` (appelé depuis `middleware.ts`)

**Problème** : chaque navigation protégée déclenche une requête Prisma complète sur `user.findUnique`. Les données utilisateur (`level`, `class`, `currentSituation`) changent rarement.

**Solution** : cache Redis 30s par userId (déjà configuré avec Upstash).

```ts
// lib/user-cache.ts
import { redis } from "./ratelimit"

export async function getCachedUser(userId: string) {
  const cached = await redis?.get<string>(`user:${userId}`)
  if (cached) return JSON.parse(cached)
  
  const user = await prisma.user.findUnique({ where: { id: userId } })
  await redis?.set(`user:${userId}`, JSON.stringify(user), { ex: 30 })
  return user
}

// Invalider le cache sur chaque mutation (checkin, quiz, update profile) :
await redis?.del(`user:${userId}`)
```

**Effort** : 1h | **Gain** : −80% requêtes Prisma sur pages protégées

---

### 5. États d'erreur silencieux dans les composants client

**Fichiers** : `components/dashboard/squad/SquadActivityFeed.tsx`, `components/dashboard/squad/SquadDiscovery.tsx`, `components/dashboard/squad/PendingInvitations.tsx`

**Problème** :
```ts
// SquadActivityFeed.tsx
} catch (err) {
  console.error(err)
  // isLoading reste true → spinner infini visible
  // L'utilisateur croit que le chargement est en cours
}
```

**Solution** :
```ts
const [error, setError] = useState<string | null>(null)

} catch (err) {
  setError("Impossible de charger l'activité. Réessaie.")
} finally {
  setIsLoading(false) // TOUJOURS appeler finally
}

// Dans le render :
if (error) return <div className="text-red-400 text-xs p-4">{error}</div>
```

**Effort** : 2h | **Gain** : bugs visibles par les utilisateurs, pas cachés

---

### 6. `useCallback` + `useEffect` instable — risque de refetch intempestif

**Fichier** : `components/dashboard/squad-journey.tsx` lines 420–469

**Problème** :
```ts
const fetchJoinRequests = useCallback(async () => {
  // ...
}, [squad?.id, isLeader])

useEffect(() => {
  fetchJoinRequests()
}, [fetchJoinRequests]) // Si squad re-render → nouvelle référence → re-fetch
```

Si le composant parent re-render (état local mis à jour), `fetchJoinRequests` change de référence même si `squad?.id` et `isLeader` n'ont pas changé. Risque de boucle subtile.

**Solution** : migrer vers TanStack Query (déjà dans le projet).

```ts
const { data: joinRequests, refetch } = useQuery({
  queryKey: ["join-requests", squad?.id],
  queryFn: () => fetch(`/api/squad/join-request?organizationId=${squad.id}`).then(r => r.json()),
  enabled: !!squad?.id && isLeader,
  staleTime: 30_000,
})
```

Autorisé dedup, retry, pas de loop, cache intégré.

**Effort** : 3h | **Gain** : stabilité, moins de fetches, code plus lisible

---

### 7. Historique XP non visible — source de confiance manquante

**Contexte** : `ActivityLog` existe en DB et log toutes les mutations XP (`MISSION_APPROVED`, `CHECKIN_COMPLETED`, `SQUAD_JOINED`). Aucune UI ne le présente à l'utilisateur.

**Problème** : les beta-testeurs qui signalent "mon XP n'a pas bougé" n'ont aucun moyen de vérifier. Les admins doivent aller en base.

**Solution** : ajouter un onglet "Historique" dans `/dossier` qui liste les 20 derniers événements ActivityLog de l'utilisateur.

```ts
// app/api/user/activity/route.ts (nouveau)
const logs = await prisma.activityLog.findMany({
  where: { userId: session.user.id },
  orderBy: { createdAt: "desc" },
  take: 20,
  select: { action: true, metadata: true, createdAt: true }
})
```

**Effort** : 4h | **Gain** : confiance utilisateurs, debug autonome, moins de tickets support

---

## 🟡 P2 — Dette architecturale

---

### 8. Deux sources de vérité : `session.user` vs `dbUser`

**Problème** : dans chaque Server Component, le code mélange :
```ts
const session = await auth.api.getSession(...)  // JWT — potentiellement stale
const dbUser = await prisma.user.findUnique(...)  // DB — toujours frais

// Puis utilise les deux sans distinction :
user.name      // de session (stale possible)
user.level     // de dbUser (frais)
user.class     // de dbUser (frais)
```

**Règle à établir** :
- Identité (`id`, `email`, `name`, `image`) → session JWT
- Données métier (`level`, `experience`, `class`, `currentSituation`) → **toujours DB**
- Ne jamais passer `session.user as any` là où un `dbUser` est attendu

---

### 9. Modèle `User` sur-chargé — 30+ champs métier

**Fichier** : `prisma/schema.prisma`

**Problème** : `User` contient `builderScore`, `creatorScore`, `strategistScore`, `catalystScore`, `behavioralVibrancy`, `confidenceScore`, `dreamStatement`, `currentFocus`, `mainBlocker`, `referralCode`, `referralCount`, `betaKeyId`... C'est un god object.

**Solution progressive** :
1. Extraire les scores psychométriques vers une table `UserProfile` liée 1-1
2. Extraire les données de progression vers `UserProgression`

Ne pas faire ce refactor d'un coup — le prioriser pour la v2 quand le schéma se stabilise.

**Effort** : 2 jours + migration | **Gain** : queries plus rapides, indexes ciblés, moins de lock

---

### 10. Pas de tests de contrat API

**Problème** : Vitest est configuré mais ne teste pas les routes API. Chaque refactor de réponse (`{ message }` → `{ error }`) peut casser le frontend sans que le CI le détecte.

**Solution** : 1 test d'intégration par route critique avec `next-test-api-route-handler` ou MSW.

Routes prioritaires à couvrir :
- `POST /api/squad/join` → vérifie `SQUAD_FULL`, `ALREADY_IN_SQUAD`, succès
- `POST /api/missions` → vérifie `APPROVED` bloqué, `PENDING` bloqué, succès
- `POST /api/user/checkin` → vérifie idempotence (2e checkin même jour)
- `PATCH /api/user/update` → vérifie validation des champs

**Effort** : 1 jour | **Gain** : régression impossible en CI

---

## Tableau de priorisation

| # | Fix | Fichier(s) principal(aux) | Effort | Impact |
|---|-----|--------------------------|--------|--------|
| 1 | Supprimer fetches middleware | `middleware.ts`, `lib/auth.ts` | 2h | 🔴 −130ms latence |
| 2 | Types stricts + retirer `ignoreBuildErrors` | `lib/types.ts` (nouveau), `next.config.mjs` | 1j | 🔴 CI fiable |
| 3 | `router.refresh()` → `window.location.reload()` | 3 fichiers | 30min | 🟠 UX |
| 4 | Cache Redis sur `/api/user/me` | `lib/user-cache.ts` (nouveau) | 1h | 🟠 −80% DB |
| 5 | Error states dans fetch clients | 4 composants squad | 2h | 🟠 UX |
| 6 | TanStack Query pour join-requests | `squad-journey.tsx` | 3h | 🟡 Stabilité |
| 7 | Historique XP dans /dossier | `app/api/user/activity/route.ts` (nouveau) | 4h | 🟡 Confiance |
| 8 | Source de vérité unique session/DB | Convention de code | 1j | 🟡 Cohérence |
| 9 | Extraction UserProfile du schéma | `prisma/schema.prisma` | 2j | 🟡 Scalabilité |
| 10 | Tests contrat API | `__tests__/api/` | 1j | 🟡 Régression CI |

---

## Ce qui est déjà bien fait ✅

- Rate limiting Redis avec fail-closed en prod (`lib/ratelimit.ts`)
- Middleware CVE-2025-29927 protégé
- Magic bytes validation sur les uploads avatar
- ActivityLog fire-and-forget sur toutes les mutations critiques
- `$transaction` Prisma avec isolation `Serializable` sur le join squad
- CSP nonce par requête (SEC-010)
- Better Auth secondaryStorage Redis (SEC-011)
- BottomNav sur toutes les pages mobiles
- Messages d'erreur en français, contextualisés

---

*Rapport généré suite à l'audit sécurité du 2026-06-12 et la revalidation beta.*  
*Voir aussi : `DOCS/SECURITY_AUDIT_2026-06-12.md`, `DOCS/REVALIDATION_BETA_2026-06-12.md`*

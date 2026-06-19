# Rapport de Revalidation — JoinHashcode Beta

**Date** : 2026-06-12  
**Préparé par** : Claude Code (analyse statique complète du code source)  
**Branch** : `fix/avatar-upload-display` → `main`  
**Périmètre** : Retours Beta Team — Steve, Malick, Daniella, Nelkaël

---

## Légende

| Statut                         | Signification                                           |
| ------------------------------ | ------------------------------------------------------- |
| ✅ Corrigé                     | Fix vérifié dans le code, comportement attendu confirmé |
| ⚠️ Partiellement corrigé       | Fix appliqué mais lacune ou régression résiduelle       |
| ❌ Non corrigé                 | Problème toujours présent dans le code                  |
| 🔍 Non vérifiable statiquement | Nécessite test manuel ou accès prod                     |

---

## 1. CRITIQUES

---

### 1.1 Upload de photo de profil

**Statut** : ✅ **Corrigé**

**Référence** :

- Commits : `27f1a95` (fix: replace Image fill with img tag), `97badc2` (fix: return relative URL), security commits (magic bytes, UUID filename)
- Fichiers : `components/settings/tabs/ProfileTab.tsx`, `app/api/user/avatar/route.ts`

**Ce qui a changé** :

_Frontend (`ProfileTab.tsx`)_

- `<Image fill>` remplacé par `<img>` natif (line 76) — élimine le conflit avec `clip-path` parent qui rendait l'avatar invisible
- Timeout 30 secondes avec `AbortController` — évite les uploads fantômes
- Réinitialisation du `<input>` après chaque tentative — permet de resélectionner le même fichier après une erreur
- Toast explicite si timeout (`"Upload trop long. Vérifie ta connexion et réessaie."`)

_Backend (`route.ts`)_

- Validation des **magic bytes** (JPEG `ffd8ff`, PNG `89504e47`, WEBP `52494646...57454250`) — le type MIME côté client n'est plus trusted seul
- Filename aléatoire via `randomUUID()` — n'expose plus l'userId dans l'URL publique
- Limit 2 Mo, types autorisés : JPEG/PNG/WEBP

**Risque de régression** :

- Les anciens avatars avec URL `userId-*` restent valides (champ `image` en base non migré) — pas de cassure
- Vérifier que `saveFile()` en `lib/upload.ts` écrit bien sous `/avatars/` avec les bonnes permissions Dockerfile

---

### 1.2 Boucle infinie des appels API

**Statut** : ✅ **Corrigé** (aucun pattern de loop détecté)

**Référence** :

- Commits : `f31d7ff`, `02d7e94`, `9b2eb20`, `85dd356` (conversion des routes en JSON responses)
- Fichiers : tous les `app/api/*/route.ts`

**Analyse** :

| Composant                             | Pattern                                                   | Fréquence            | Verdict |
| ------------------------------------- | --------------------------------------------------------- | -------------------- | ------- |
| `neural-feed.tsx`                     | `refetchInterval: 60_000` (TanStack Query)                | 1x/min               | ✅ OK   |
| `notification-bell.tsx`               | `refetchInterval: 30_000`                                 | 1x/30s               | ✅ OK   |
| `SquadActivityFeed.tsx`               | `useEffect` fetch once on mount, deps: `[organizationId]` | 1x au mount          | ✅ OK   |
| `JoinRequestsManager.tsx`             | `useEffect` fetch once, deps: `[organizationId]`          | 1x au mount          | ✅ OK   |
| `squad-journey.tsx` fetchJoinRequests | `useCallback` avec deps `[squad?.id, isLeader]`           | 1x au mount + manuel | ✅ OK   |

**Cause initiale probable** : les routes retournaient du texte brut en cas d'erreur (ex. Prisma throws non-capturé) → le frontend parsait JSON → exception → retry infini. La conversion systématique en `NextResponse.json()` avec try/catch a éliminé ce vecteur.

**Risque de régression** : Faible. `notification-bell` (30s) et `neural-feed` (60s) sont des choix d'UX, pas des bugs. À surveiller si un endpoint lent bloque le thread principal sur mobile bas de gamme.

---

### 1.3 Compatibilité 2FA avec l'authentification actuelle

**Statut** : ⚠️ **Partiellement corrigé / À tester**

**Référence** :

- Fichier : `components/settings/TwoFactorSetup.tsx`
- La page de vérification 2FA existe : `app/(auth)/2fa/page.tsx`

**Problème résiduel** :

```ts
// TwoFactorSetup.tsx line 29
const { data, error } = await authClient.twoFactor.enable({
  password: "", // Not needed for passwordless, but passed to satisfy types
});
```

Pour les utilisateurs **OAuth (Google/GitHub) et Magic Link** — qui n'ont pas de mot de passe — Better Auth `twoFactor.enable()` attend potentiellement une validation de session supplémentaire. L'envoi de `password: ""` peut :

1. **Fonctionner** si Better Auth ignore le champ pour les comptes sans password
2. **Échouer silencieusement** avec un `error` non affiché si la validation échoue

Le `handleDisable()` a le même pattern (`password: ""`).

**À valider manuellement** :

- Activer 2FA sur un compte Google → vérifier que le QR code s'affiche bien
- Activer 2FA sur un compte Magic Link → même test
- Vérifier que le code OTP est bien validé par `verifyTotp()`

**Risque de régression** : Moyen. Si la 2FA est cassée pour les comptes OAuth, les utilisateurs qui tentent de l'activer auront une erreur ou un comportement muet. Aucune donnée perdue mais expérience dégradée.

---

### 1.4 Navigation mobile

**Statut** : ✅ **Corrigé**

**Référence** :

- Commit : `0b62b78` (perf/mobile: hide noise overlay on mobile)
- Fichiers : `components/ui/noise.tsx`, `components/landing/nav.tsx`

**Ce qui a changé** :

- `noise.tsx` : `hidden md:block` — l'overlay SVG de bruit est masqué sur mobile (économie GPU/batterie)
- `dashboard-shell.tsx` : `pb-32 md:pb-12` sur `<main>` — espace réservé en bas pour la BottomNav
- `landing/nav.tsx` line 106 : `{isMounted && session && <BottomNav />}` — affiche la BottomNav sur la landing si l'utilisateur est connecté

**Risque de régression** : Faible.

---

### 1.5 Affichage du Bottom Navigation sur toutes les pages

**Statut** : ⚠️ **Partiellement corrigé**

**Référence** :

- Fichier : `components/dashboard/bottom-nav.tsx` (composant `md:hidden fixed bottom-6`)

**Audit des pages** :

| Page             | BottomNav présente ?                         |
| ---------------- | -------------------------------------------- |
| `/dashboard`     | ✅ Oui (via `DashboardShell`)                |
| `/missions`      | ✅ Oui                                       |
| `/missions/[id]` | ✅ Oui                                       |
| `/settings`      | ✅ Oui                                       |
| `/dossier`       | ✅ Oui                                       |
| `/reviewer`      | ✅ Oui                                       |
| `/squad`         | ❌ **ABSENT**                                |
| `/feedback`      | ❌ **ABSENT**                                |
| Landing (`/`)    | ✅ Si session active (via `landing/nav.tsx`) |

**`/squad`** : `SquadJourney` rend son propre `SidebarProvider` + `SidebarInset` mais n'inclut **pas** `<BottomNav />`. Sur mobile, l'utilisateur sur la page escouade n'a aucun menu de navigation bas.

**`/feedback`** : `SidebarProvider` + `AppSidebar` + `UserTopBar` présents, mais pas de `<BottomNav />`.

**Correctifs nécessaires** :

```tsx
// À ajouter dans squad-journey.tsx (juste avant </SidebarInset>)
import { BottomNav } from "@/components/dashboard/bottom-nav"
// ...
        </main>
+       <BottomNav />
      </SidebarInset>

// À ajouter dans app/feedback/page.tsx (avant </SidebarInset>)
import { BottomNav } from "@/components/dashboard/bottom-nav"
// ...
        </main>
+       <BottomNav />
      </SidebarInset>
```

**Risque de régression** : Faible. `BottomNav` est `md:hidden` — invisible sur desktop.

---

## 2. FONCTIONNELS

---

### 2.1 Processus de soumission des missions

**Statut** : ✅ **Corrigé**

**Référence** :

- Commits : `0fdeb6a` (fix P0: farming XP), `f31d7ff` (JSON responses)
- Fichier : `app/api/missions/route.ts`

**Flux validé** :

```
Soumission → vérif session → rate-limit → vérif niveau requis →
vérif statut existant (APPROVED → 409, PENDING/IN_REVIEW → 400, max révisions → 400) →
création submission → incrément XP (seulement si pas déjà approuvé)
```

**Messages d'erreur côté API** (clairs, en français) :

- `"Ta soumission est déjà en attente de validation. Patience !"` (400)
- `"Cette mission a déjà été validée pour cette période."` (409)
- `"Ton rang est trop bas pour cette mission."` (403)

**Risque de régression** : Faible. La logique XP farming est couverte (SEC-001 + SEC-002).

---

### 2.2 Messages de confirmation utilisateur

**Statut** : ✅ **Corrigé**

**Référence** :

- Fichiers : `components/missions/missions-list.tsx`, `components/missions/reviewer-rubric-form.tsx`

**Messages présents** :

- `"Soumission envoyée ! Un admin va vérifier et valider sous 24h."` ✅
- `"Révision demandée. Le membre a été notifié."` ✅
- `"Mission validée — Niveau X (+Y XP pour le membre)"` ✅ (avec données dynamiques)
- `"Tous les canaux rejoints ! Entre tes identifiants pour valider."` ✅
- Feedback upload avatar : success + erreur + timeout ✅

**Risque de régression** : Faible.

---

### 2.3 Gestion des statuts des missions

**Statut** : ✅ **Corrigé**

**Référence** :

- Fichier : `app/api/missions/route.ts`, `components/missions/missions-list.tsx`

**Statuts gérés** : `PENDING`, `IN_REVIEW`, `APPROVED`, `REVISION_REQUESTED`

La UI (`missions-list.tsx`) affiche le statut de chaque soumission avec un composant visuel différencié. Le reviewer peut approuver, demander révision, ou rejeter.

---

### 2.4 Recherche et accessibilité mobile

**Statut** : 🔍 **Non vérifiable statiquement** (aucun composant de recherche trouvé dans le code)

Il n'existe pas de barre de recherche de missions ou d'utilisateurs dans les composants analysés. Si des bêta-testeurs ont signalé un problème de recherche, il se peut que :

- La fonctionnalité soit en cours de développement (non présente)
- Le problème soit lié à la navigation entre filtres dans `missions-list.tsx`

**À vérifier manuellement** : Tester la navigation filtrée INIT/CORE/PRO sur mobile.

---

### 2.5 Affichage de la localisation

**Statut** : ✅ **Corrigé**

**Référence** :

- `components/dashboard/dashboard-shell.tsx` line 319
- `components/settings/tabs/ProfileTab.tsx` lines 152-169

**Dashboard** :

```tsx
{
  user.city || user.country ? (
    [user.city, user.country].filter(Boolean).join(", ")
  ) : (
    <span className="text-zinc-500 italic text-xs">
      Localisation non renseignée
    </span>
  );
}
```

Affichage conditionnel, fallback explicite.

**Settings** : CountrySelector + champ Ville présents et fonctionnels.

---

## 3. PRODUIT & UX

---

### 3.1 Compréhension des indicateurs (Vibrancy, Confidence, Drift)

**Statut** : ⚠️ **Partiellement corrigé — jargon résiduel en UI**

**Référence** :

- `components/dossier/dossier-view.tsx`
- `components/dashboard/neural-sync-gauge.tsx`
- `components/dashboard/mission-deck.tsx`

**Ce qui a été amélioré** :

- `dossier-view.tsx` : labels traduits en "Activité" et "Confiance" (plutôt que `behavioralVibrancy` et `confidenceScore`)
- `neural-sync-gauge.tsx` : textes contextuels selon le score (`"Fais ton check-in aujourd'hui pour remonter."`, `"Continue ta streak pour débloquer le bonus XP."`)

**Problèmes résiduels** :

- `neural-sync-gauge.tsx` : label affiché `état_de_synchronisation_` — jargon opaque pour un utilisateur lambda
- `mission-deck.tsx` ligne 131 : `"behavioral_vibrancy_signal"` affiché en italique dans l'UI comme badge d'algorithme — non expliqué
- Aucun tooltip ou popover n'explique ce que représente chaque score numériquement
- "Drift" n'est pas visible dans le code actuel — peut-être renommé ou supprimé

**Recommandations** :

1. Remplacer `état_de_synchronisation_` par `Score d'engagement` ou `Synchronisation`
2. Ajouter un `<Tooltip>` sur chaque indicateur dans le dossier
3. Retirer ou expliquer le `behavioral_vibrancy_signal` dans `mission-deck.tsx`

**Risque de régression** : Aucun (changements UI purs).

---

### 3.2 Compréhension du système de progression

**Statut** : ⚠️ **Partiellement corrigé**

**Référence** :

- `components/dashboard/dashboard-shell.tsx` (progression bento)
- `components/missions/missions-list.tsx` (stages INIT/CORE/PRO)

**Ce qui fonctionne** :

- `missions-list.tsx` : stages avec label + explication du verrou (`"Niveau X requis — tu es au niveau Y (Z niveaux restants)"`) + calcul XP manquant — clair
- Progress bar XP avec `"N XP pour le niveau suivant"`

**Problèmes résiduels** :

- Les noms `INIT / CORE / PRO / ELITE` ne sont pas expliqués : que débloque chaque niveau ?
- Le dashboard ne montre pas ce que niveau 2 (CORE) débloque concrètement vs niveau 1 (INIT)
- Il n'y a pas de vue récapitulative des récompenses de progression

**Recommandation** : Ajouter un tooltip ou un bloc "Ce niveau débloque : missions CORE + révisions de pairs" dans la section progression du dashboard.

---

### 3.3 Compréhension des missions PRO verrouillées

**Statut** : ✅ **Corrigé dans `missions-list.tsx`**

**Référence** :

- `components/missions/missions-list.tsx` lines 150–196

**Ce qui est implémenté** :

```tsx
const isLocked = config.requiredLevel > userLevel;
// Si locked :
<Lock className="size-3 text-zinc-600" />
<span>Niveau {config.requiredLevel} requis — tu es au niveau {userLevel} ({levelsToGo} niveau{...} restant{...})</span>
// XP nécessaire calculé dynamiquement
// Bloc de missions grisé + pointer-events-none + grayscale
```

**Problème résiduel** :

- Dans le **`MissionDeck`** (page dashboard, widget "For You Page"), les missions affichées ne semblent pas filtrer les missions PRO si l'utilisateur est au niveau INIT. `recommendedMissions` est calculé côté serveur dans `dashboard/page.tsx` — à vérifier que le filtre par niveau est appliqué dans la requête Prisma.

**Risque de régression** : Moyen si des missions PRO apparaissent sans verrou dans le deck dashboard.

---

### 3.4 Parcours d'onboarding des nouveaux utilisateurs

**Statut** : 🔍 **À tester manuellement (code semble correct)**

**Référence** :

- `middleware.ts` (funnel 3 étapes)
- `app/onboarding/page.tsx`

**Funnel implémenté** :

1. Pas de session → `/signin`
2. Session sans `currentSituation` → `/onboarding`
3. Session avec `currentSituation` mais sans `class` → `/quiz`
4. Session complète → `/dashboard`

Le middleware gère le funnel pour toutes les routes protégées, avec fallback sur le cookie de session si le fetch loopback échoue.

**Risque** : Si un nouvel utilisateur a un cookie de session valide mais que le fetch `/api/user/me` échoue (erreur réseau ou DB), il pourrait passer le funnel sans avoir complété l'onboarding — le `getSessionCookie()` fallback ne vérifie pas `currentSituation`.

---

## Synthèse exécutive

### Tableau de bord

| #   | Problème                         | Statut                              | Priorité correctif             |
| --- | -------------------------------- | ----------------------------------- | ------------------------------ |
| 1.1 | Upload avatar                    | ✅ Corrigé                          | —                              |
| 1.2 | Boucles API infinies             | ✅ Corrigé                          | —                              |
| 1.3 | Compatibilité 2FA (passwordless) | ⚠️ À tester                         | 🟠 Élevée — test manuel requis |
| 1.4 | Navigation mobile générale       | ✅ Corrigé                          | —                              |
| 1.5 | BottomNav sur toutes les pages   | ⚠️ Manquant `/squad` et `/feedback` | 🟡 Moyenne — 2 lignes de code  |
| 2.1 | Soumission missions              | ✅ Corrigé                          | —                              |
| 2.2 | Messages de confirmation         | ✅ Corrigé                          | —                              |
| 2.3 | Statuts missions                 | ✅ Corrigé                          | —                              |
| 2.4 | Recherche mobile                 | 🔍 Non vérifiable                   | 🔵 Faible                      |
| 2.5 | Localisation                     | ✅ Corrigé                          | —                              |
| 3.1 | Indicateurs incompris            | ⚠️ Jargon résiduel                  | 🟡 Moyenne                     |
| 3.2 | Système progression              | ⚠️ Niveaux non expliqués            | 🟡 Moyenne                     |
| 3.3 | Missions PRO verrouillées        | ✅ Corrigé (`missions-list`)        | —                              |
| 3.4 | Onboarding nouveaux users        | 🔍 À tester                         | 🟡 Moyenne                     |

### Score global

- **8 / 14 points** entièrement corrigés ✅
- **4 / 14** partiellement corrigés ⚠️
- **2 / 14** nécessitent validation manuelle 🔍

---

## Actions immédiates recommandées

### P0 — Avant le prochain test utilisateur

1. **Ajouter `<BottomNav />` dans `/squad` et `/feedback`** (5 min de code)

   ```tsx
   // squad-journey.tsx, avant </SidebarInset>
   <BottomNav />
   // app/feedback/page.tsx, avant </SidebarInset>
   <BottomNav />
   ```

2. **Tester la 2FA sur un compte OAuth** — activer, scanner QR, entrer code, désactiver. Si `password: ""` cause une erreur Better Auth, passer à `authClient.twoFactor.enable()` sans argument ou chercher la signature correcte pour passwordless.

### P1 — Avant montée en charge

3. **Retirer `behavioral_vibrancy_signal`** du texte visible dans `mission-deck.tsx` line 131 → remplacer par `"Algorithme calibré sur ton historique de missions"`

4. **Ajouter tooltips explicatifs** sur `neural-sync-gauge.tsx` pour "état*de_synchronisation*" et sur `dossier-view.tsx` pour "Activité" / "Confiance"

5. **Vérifier le filtre de niveau dans `MissionDeck`** (page dashboard) — s'assurer que `recommendedMissions` côté serveur exclut les missions PRO pour les utilisateurs niveau 1

### P2 — Amélioration continue

6. **Expliquer INIT/CORE/PRO/ELITE** dans la section progression du dashboard avec les déblocages concrets
7. **Test de charge du middleware** — le double fetch (`/api/auth/get-session` + `/api/user/me`) sur chaque requête protégée peut devenir un goulot en prod avec beaucoup d'utilisateurs simultanés

---

## Points bloquants pour la montée en charge

| Point                                                    | Impact                              | Action                                                      |
| -------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------- |
| Double fetch dans middleware (session + /me)             | Latence ×2 sur chaque page protégée | Considérer JWT claims enrichis ou cache Redis middleware    |
| `notification-bell` refetch 30s par utilisateur connecté | ×N requêtes/min en prod             | Passer à WebSocket ou SSE pour les notifications temps réel |
| Rate limiting Redis non configuré = fail-closed en prod  | Bloque tous les users si Redis down | Monitorer l'uptime Upstash, ajouter alerte                  |
| `ignoreBuildErrors: true` dans next.config.mjs           | Masque les erreurs TypeScript en CI | Corriger les erreurs TS et retirer ce flag (SEC-019)        |

---

_Rapport généré par analyse statique du code source — branche `fix/avatar-upload-display`, commit `207e5a2`._  
_Validation manuelle recommandée pour les points marqués 🔍._

# Recommandations d'Architecture Senior — 12 Juin 2026

Ce document détaille 10 recommandations techniques prioritaires pour améliorer la scalabilité, la maintenabilité, les performances et la sécurité de la plateforme HASHCODE.

---

## 🔴 Priorité P0 : Bloquants pour la scalabilité & Robustesse

### 1. Élimination du Double-Fetch HTTP dans le Middleware

- **Fichier cible :** [middleware.ts](file:///c:/Users/PC/Documents/GitHub/hashcode-community/middleware.ts)
- **Effort estimé :** 2-3 heures
- **Description du problème :**
  À chaque chargement de page protégée, le middleware effectue successivement deux requêtes HTTP internes :
  1. Un appel vers `/api/auth/get-session` pour valider l'existence de la session Better Auth.
  2. Si la session existe, un second appel vers `/api/user/me` pour récupérer les champs utilisateurs frais de PostgreSQL (comme `currentSituation` ou `class`), car le JWT de Better Auth stocke des cookies périmés.

  Ce double-fetch local multiplie la latence réseau par deux sur toutes les pages et sature inutilement le serveur web en créant deux sous-requêtes HTTP pour chaque page chargée.

- **Solution :**
  Fusionner ces deux appels en un seul en modifiant le endpoint de session afin qu'il interroge la base de données pour enrichir l'objet utilisateur frais de PostgreSQL avant de répondre. Ainsi, le middleware ne fait qu'un seul fetch combiné.
- **Exemple de Code :**

```typescript
// app/api/auth/session-user/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ session: null, user: null });
  }

  // Fetch direct et unifié des données utilisateur fraîches en BDD
  const freshUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      currentSituation: true,
      class: true,
      role: true,
      banned: true,
      banExpires: true,
    },
  });

  return NextResponse.json({
    session,
    user: freshUser,
  });
}

// Dans le middleware.ts (Simplification)
// const response = await fetch(`${baseUrl}/api/auth/session-user`, { headers: requestHeaders });
// const { session, user } = await response.json();
```

---

### 2. TypeScript sans filet (Éradication des assertions `as any`)

- **Fichiers cibles :** [app/actions/quiz.ts](file:///c:/Users/PC/Documents/GitHub/hashcode-community/app/actions/quiz.ts), [app/api/squad/join/route.ts](file:///c:/Users/PC/Documents/GitHub/hashcode-community/app/api/squad/join/route.ts) et les types de session.
- **Effort estimé :** 4-6 heures
- **Description du problème :**
  L'application utilise fréquemment le cast `as any` ou le type `any` pour contourner le typage TypeScript (ex: `session.user as any`, `answers as any`). Cela supprime les garanties de sécurité du compilateur, introduit des risques de plantages silencieux en production si la structure des objets change et nuit aux refactorings automatiques de l'IDE.
- **Solution :**
  Configurer l'extension de types Better Auth à l'aide d'un fichier de déclaration globale TypeScript (`auth.d.ts`) pour que le compilateur reconnaisse nativement les champs personnalisés de `session.user` (comme `level`, `class`, `builderScore`, etc.). Déclarer des interfaces explicites pour les réponses du quiz ou les métadonnées de BDD.
- **Exemple de Code :**

```typescript
// types/auth.d.ts
import { auth } from "@/lib/auth";

declare module "better-auth" {
  interface User {
    level: number;
    experience: number;
    class?: string | null;
    currentSituation?: string | null;
    builderScore: number;
    creatorScore: number;
    strategistScore: number;
    catalystScore: number;
    // ajouter les autres champs customisés...
  }
}

// Exemple d'utilisation typée dans app/api/squad/join/route.ts
const session = await auth.api.getSession({ headers: req.headers });
if (!session)
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// session.user.class est maintenant reconnu comme string | null | undefined par l'IDE
const userClass = session.user.class;
```

---

## 🟠 Priorité P1 : Améliorations UX, Performances et Auditabilité

### 3. Suppression des `window.location.reload()` brutaux

- **Fichiers cibles :** [components/dashboard/squad-journey.tsx](file:///c:/Users/PC/Documents/GitHub/hashcode-community/components/dashboard/squad-journey.tsx), [components/dashboard/squad/MemberList.tsx](file:///c:/Users/PC/Documents/GitHub/hashcode-community/components/dashboard/squad/MemberList.tsx)
- **Effort estimé :** 2-3 heures
- **Description du problème :**
  Lorsqu'une action est effectuée côté client (ex: retrait d'un membre de l'escouade, acceptation d'une candidature, ou création de squad), le composant force le rechargement global du navigateur avec `window.location.reload()`. Cette approche détruit l'état de la Single Page Application (SPA), réinitialise le cache React, casse les transitions visuelles et surcharge le serveur en ré-exécutant toutes les requêtes de page initiales.
- **Solution :**
  Utiliser les mécanismes natifs de Next.js pour rafraîchir les données du serveur sans recharger l'application entière (`router.refresh()`), ou mettre à jour dynamiquement l'état local du composant en combinant des appels d'état React.
- **Exemple de Code :**

```typescript
// components/dashboard/squad/MemberList.tsx
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MemberList({ initialMembers }) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [isMutating, setIsMutating] = useState(false);

  const kickMember = async (memberId: string) => {
    setIsMutating(true);
    try {
      const res = await fetch("/api/squad/member/remove", {
        method: "POST",
        body: JSON.stringify({ memberId }),
      });
      if (res.ok) {
        // Mise à jour de l'état local immédiatement pour l'UX
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
        // Revalidation silencieuse des Server Components
        router.refresh();
        toast.success("Membre retiré");
      }
    } finally {
      setIsMutating(false);
    }
  };
}
```

---

### 4. Cache Redis pour la lecture des profils utilisateurs

- **Fichiers cibles :** [lib/auth.ts](file:///c:/Users/PC/Documents/GitHub/hashcode-community/lib/auth.ts), [app/api/user/me/route.ts](file:///c:/Users/PC/Documents/GitHub/hashcode-community/app/api/user/me/route.ts)
- **Effort estimé :** 3-4 heures
- **Description du problème :**
  À chaque appel du middleware ou chargement de page, l'application exécute une requête SQL `SELECT` sur PostgreSQL pour vérifier ou rafraîchir les détails du profil utilisateur. Sous fort trafic ou attaques, la base de données PostgreSQL est saturée d'opérations de lecture identiques, augmentant les temps de réponse de l'application.
- **Solution :**
  Mettre en cache le profil utilisateur sérialisé dans Redis avec une durée de vie (TTL) courte (ex: 5 minutes) lors des lectures de session. Ce cache doit être immédiatement invalidé lors des mutations (`PATCH` utilisateur, gain d'XP).
- **Exemple de Code :**

```typescript
// lib/user-cache.ts
import { redis } from "./ratelimit";
import { prisma } from "./prisma";
import { User } from "@prisma/generated/client";

const CACHE_TTL = 300; // 5 minutes

export async function getCachedUser(userId: string): Promise<User | null> {
  if (!redis) return prisma.user.findUnique({ where: { id: userId } });

  const cacheKey = `user:profile:${userId}`;
  const cached = await redis.get<string>(cacheKey);

  if (cached) {
    return JSON.parse(cached) as User;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    await redis.set(cacheKey, JSON.stringify(user), { ex: CACHE_TTL });
  }
  return user;
}

export async function invalidateUserCache(userId: string) {
  if (redis) {
    await redis.del(`user:profile:${userId}`);
  }
}
```

---

### 5. Standardisation de la gestion d'erreurs d'API (Éviter les catchs silencieux)

- **Fichier cible :** [app/api/onboarding/route.ts](file:///c:/Users/PC/Documents/GitHub/hashcode-community/app/api/onboarding/route.ts)
- **Effort estimé :** 3-5 heures
- **Description du problème :**
  De nombreux blocs `catch` dans les routes API capturent les erreurs de manière générique, les affichent via un simple `console.error` (qui peut polluer ou ne pas être persisté de manière structurée) et retournent un message HTTP 500 générique à l'utilisateur. De plus, certaines promesses secondaires (comme l'envoi d'e-mails de bienvenue ou de complétion) échouent silencieusement sans monitoring.
- **Solution :**
  Mettre en place une fonction d'enveloppe standardisée ou un gestionnaire d'erreurs pour formater les erreurs de validation Zod, filtrer les détails sensibles en production (fuites de stack traces PostgreSQL) et logger les anomalies sur un collecteur centralisé.
- **Exemple de Code :**

```typescript
// lib/api-error-handler.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleApiError(error: unknown, context: string) {
  console.error(`❌ [API_ERROR] [${context}]:`, error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_ERROR",
        details: error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Ne pas exposer les détails SQL internes en production pour la sécurité
  const isProd = process.env.NODE_ENV === "production";
  return NextResponse.json(
    {
      success: false,
      error: "INTERNAL_SERVER_ERROR",
      message: isProd
        ? "Une erreur système est survenue. Veuillez réessayer."
        : String(error),
    },
    { status: 500 },
  );
}
```

---

### 6. Stabilisation des useCallback instables

- **Fichier cible :** [components/missions/missions-list.tsx](file:///c:/Users/PC/Documents/GitHub/hashcode-community/components/missions/missions-list.tsx)
- **Effort estimé :** 1-2 heures
- **Description du problème :**
  Les fonctions `handleSocialClick` (lignes 286) et `handleSocialSubmit` (ligne 300) utilisent `useCallback` mais incluent des dépendances instables comme les états mutables `socialClicks` et `socialForm`. Par conséquent, le callback est recréé à chaque fois que l'utilisateur clique ou tape une lettre dans le formulaire, ce qui annule complètement l'utilité du useCallback et force la ré-évaluation inutile des sous-composants.
- **Solution :**
  Utiliser la mise à jour fonctionnelle de l'état React (`setState(prev => ...)`) pour éliminer l'état lui-même des dépendances du useCallback, et utiliser des refs pour stocker temporairement les valeurs textuelles de saisie sans invalider le callback.
- **Exemple de Code :**

```typescript
// Refactorisation dans components/missions/missions-list.tsx

// handleSocialClick ne dépend plus de la valeur courante de `socialClicks`
const handleSocialClick = useCallback(
  (platform: string) => {
    if (mission.id !== "social-connection-protocol") return;
    if (status === "APPROVED" || status === "PENDING") return;

    setSocialClicks((prev) => {
      if (prev[platform]) return prev;
      const nextClicks = { ...prev, [platform]: true };
      const count = Object.values(nextClicks).filter(Boolean).length;

      if (count < 3) {
        toast.info(`${count}/3 canaux rejoints — continue !`);
      } else {
        toast.success("Tous les canaux rejoints !");
      }
      return nextClicks;
    });
  },
  [mission.id, status],
); // Dépendances stables
```

---

### 7. Ajout d'une table d'Historique de Progression d'XP

- **Fichier cible :** [prisma/schema.prisma](file:///c:/Users/PC/Documents/GitHub/hashcode-community/prisma/schema.prisma)
- **Effort estimé :** 3-4 heures
- **Description du problème :**
  Actuellement, l'XP des utilisateurs est modifiée directement en base de données sur la table `User` (champs `experience` et `level`). Il n'existe aucun historique comptabilisant la provenance de ces gains (ex: mission complétée, check-in quotidien, bonus d'escouade). Cela empêche l'audit en cas d'incohérence, rend impossible la détection de triche ou de double gain d'XP, et empêche l'affichage d'un journal d'activité d'XP à l'utilisateur.
- **Solution :**
  Ajouter un modèle de données `XpTransaction` dans Prisma pour consigner chaque modification d'XP avec son motif, son montant et son entité source. Effectuer ces transactions dans une transaction SQL Prisma unifiée.
- **Exemple de Code :**

```prisma
// Dans prisma/schema.prisma (Nouveau modèle)
model XpTransaction {
  id        String   @id @default(cuid())
  userId    String
  amount    Int      // ex: 100 ou 500
  reason    String   // ex: "MISSION_COMPLETED", "DAILY_CHECKIN"
  sourceId  String?  // ex: id de la mission ou du check-in
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
  @@map("xp_transaction")
}
```

```typescript
// lib/experience.ts
import { prisma } from "./prisma";

export async function awardXp(
  userId: string,
  amount: number,
  reason: string,
  sourceId?: string,
) {
  return prisma.$transaction(async (tx) => {
    // 1. Enregistrer la transaction XP
    await tx.xpTransaction.create({
      data: { userId, amount, reason, sourceId },
    });

    // 2. Mettre à jour le profil de l'utilisateur
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Utilisateur introuvable");

    let newXp = user.experience + amount;
    let newLevel = user.level;

    // Seuil de niveau simple (ex: 1000 XP par niveau)
    const xpPerLevel = 1000;
    const targetLevel = Math.floor(newXp / xpPerLevel) + 1;

    await tx.user.update({
      where: { id: userId },
      data: {
        experience: newXp,
        level: targetLevel > newLevel ? targetLevel : newLevel,
      },
    });
  });
}
```

---

## 🟡 Priorité P2 : Alignement d'Architecture & Validation

### 8. Découpage du "God Model" User (Dette d'Architecture)

- **Fichier cible :** [prisma/schema.prisma](file:///c:/Users/PC/Documents/GitHub/hashcode-community/prisma/schema.prisma) (Modèle `User`)
- **Effort estimé :** 6-8 heures (migration de BDD complexe)
- **Description du problème :**
  La table `User` est devenue un fourre-tout stockant plus de 30 colonnes disparates. Elle mélange des données d'authentification (emails, tokens), de profil public (pseudo, biographie, réseaux sociaux), des statistiques psychométriques de quiz (builderScore, strategistScore, etc.), des états de gamification (level, experience, streaks) et de sécurité (twoFactorSecret). Cela nuit aux performances des requêtes simples et rend le code vulnérable aux failles d'assignation de masse (Mass Assignment) si les filtres d'API sont incomplets.
- **Solution :**
  Scinder la table `User` en isolant les domaines métier dans des tables liées par des relations 1-à-1 ou 1-à-N :
  - `PsychometricProfile` : builderScore, creatorScore, strategistScore, catalystScore, confidenceScore.
  - `SocialProfile` : twitterUrl, githubUrl, portfolioUrl, linkedinUrl.
  - `EngagementStats` : currentStreak, longestStreak, lastStreakDate, lastCheckinAt.
- **Exemple de Code :**

```prisma
// prisma/schema.prisma (Proposition de scission)
model User {
  id            String         @id
  email         String         @unique
  name          String
  role          String         @default("MEMBER")
  // Relations isolées
  psychometrics Psychometric?
  socials       UserSocials?
  // ... champs d'authentification de base ...
}

model Psychometric {
  id              String @id @default(cuid())
  userId          String @unique
  user            User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  builderScore    Int    @default(0)
  creatorScore    Int    @default(0)
  strategistScore Int    @default(0)
  catalystScore   Int    @default(0)
  confidenceScore Float  @default(0.25)
}

model UserSocials {
  id           String  @id @default(cuid())
  userId       String  @unique
  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  githubUrl    String?
  portfolioUrl String?
  linkedinUrl  String?
  twitterUrl   String?
}
```

---

### 9. Correction de la Dualité des Sources de Vérité (Session vs Base de données)

- **Fichiers cibles :** [lib/auth.ts](file:///c:/Users/PC/Documents/GitHub/hashcode-community/lib/auth.ts), [middleware.ts](file:///c:/Users/PC/Documents/GitHub/hashcode-community/middleware.ts)
- **Effort estimé :** 3-5 heures
- **Description du problème :**
  Better Auth stocke les données additionnelles de l'utilisateur dans son JWT ou son cookie de session. Lorsque l'utilisateur modifie ses objectifs ou son niveau en base de données, les données stockées dans la session client restent obsolètes jusqu'à la prochaine reconnexion ou régénération forcée du cookie de session. Cela entraîne des redirections infinies dans le middleware qui lit des valeurs de session périmées.
- **Solution :**
  Retirer les données métier dynamiques (ex: `class`, `currentSituation`, progression XP) du JWT/cookie de session pour n'y conserver que l'identifiant utilisateur (`userId`) et son rôle d'accès global. Toute vérification métier ou de redirection de flux dans le middleware doit se faire en interrogeant la source de vérité fraîche (base de données ou cache Redis).
- **Exemple de Code :**

```typescript
// lib/auth.ts
export const auth = betterAuth({
  // Conserver uniquement les champs d'authentification et de sécurité dans le JWT
  user: {
    additionalFields: {
      role: { type: "string", required: true, defaultValue: "MEMBER" },
      // Supprimer l'XP, les scores psychométriques et la situation des cookies de session
    },
  },
  // ... reste de la configuration
});
```

---

### 10. Tests de Contrat d'Intégration d'API

- **Fichiers cibles :** [**tests**/api/onboarding.test.ts](file:///c:/Users/PC/Documents/GitHub/hashcode-community/__tests__) (Nouveau fichier)
- **Effort estimé :** 4-6 heures
- **Description du problème :**
  L'application ne dispose d'aucun test d'intégration pour valider la conformité des contrats d'API Zod ou la sécurité des endpoints (ex: valider qu'un payload malicieux renvoie bien un statut HTTP 400 et ne provoque pas de crash Prisma non géré). Toute mise à jour du schéma Prisma ou d'une dépendance peut casser l'onboarding ou le quiz sans être détectée par les tests de fumée.
- **Solution :**
  Déployer des suites de tests automatiques à l'aide de `Vitest` pour envoyer des payloads conformes et non conformes à nos routes d'API, et vérifier la structure des réponses JSON.
- **Exemple de Code :**

```typescript
// __tests__/api/onboarding.test.ts
import { describe, it, expect, vi } from "vitest";
import { PATCH } from "@/app/api/onboarding/route";
import { NextRequest } from "next/server";

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: "test-user-id", email: "test@hashcode.community" },
      }),
    },
  },
}));

describe("PATCH /api/onboarding", () => {
  it("should reject invalid payloads with HTTP 400", async () => {
    const request = new NextRequest("http://localhost/api/onboarding", {
      method: "PATCH",
      body: JSON.stringify({
        country: "", // invalide (trop court)
        language: "de", // invalide (doit être fr ou en)
      }),
    });

    const response = await PATCH(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.message).toBe("Données invalides");
  });

  it("should process valid onboarding and return HTTP 200", async () => {
    // Mocker prisma.user.update
    // ...
  });
});
```

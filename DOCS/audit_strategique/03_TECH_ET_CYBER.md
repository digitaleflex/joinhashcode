# Audit Technologique, Architecture & Sécurité

## 03. Infrastructure, Scalabilité & Résilience (Norme EHAF)

**Auteurs de l'audit :** Chief Technology Officer, Site Reliability Engineer, Lead Cybersecurity Auditor

---

### 1. Analyse de l'Architecture Logicielle (CTO)

**La Stack :** Next.js 15 (App Router), Prisma, PostgreSQL, Better Auth, Tailwind v4.
C'est le standard de l'industrie (la "T3/Modern Stack"). C'est un choix extrêmement robuste pour démarrer vite et scaler.

**Points d'attention architecturaux :**

- **Server Components vs Client Components :** Avec Next.js 15, la frontière est stricte. Assurez-vous que la logique lourde de calcul de l'évolution (Vibrancy, Scores) se fasse côté serveur. Les composants clients (`"use client"`) ne doivent gérer que l'interactivité (Framer Motion, formulaires React Hook Form).
- **Le goulot d'étranglement de la BDD :** Prisma peut générer des requêtes N+1 si mal maîtrisé. Dans un contexte communautaire (afficher un feed de missions avec les auteurs et leurs guildes), c'est un risque mortel.
  _Action :_ Auditer systématiquement les `.findMany()` qui incluent des relations complexes.

### 2. Sécurité & Conformité EHAF Engineering Standard (Cybersecurity Lead)

Conformément à la règle globale **[user_global] EHAF Security Engineering Standard**, la sécurité n'est pas optionnelle.

**Menaces critiques identifiées & Mitigations :**

| Menace (OWASP)                               | Vecteur sur Hashcode                                                                    | Mitigation (Obligatoire)                                                                                                                                    |
| :------------------------------------------- | :-------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Broken Access Control**                    | Un utilisateur API modifie la mission d'un autre via `/api/missions` en changeant l'ID. | Les endpoints REST doivent vérifier l'identité via `auth.api.getSession()` ET vérifier que le `userId` de la ressource correspond.                          |
| **Mass Assignment**                          | Lors du `PATCH /api/user/update`, l'utilisateur envoie `{"role": "admin"}`.             | Validation stricte avec **Zod**. `.pick()` ou `.omit()` sur les schémas pour ne parser que les champs autorisés.                                            |
| **Insecure Direct Object References (IDOR)** | Accès aux résultats psychométriques bruts d'un autre utilisateur.                       | Vérification des rôles (RBAC) ou matching de session strict.                                                                                                |
| **Data Leakage (Logs)**                      | Logguer l'objet Session complet ou les erreurs Prisma.                                  | Nettoyer les objets avant console.log. Ne jamais renvoyer d'erreurs Prisma au client (intercepter via un Middleware d'erreur et renvoyer un 500 générique). |

### 3. Scalabilité et Infrastructure (SRE)

Vous utilisez Supabase.

- **Le Pooler :** Vous avez mentionné `DATABASE_URL` (pooled) et `DIRECT_URL` (migrations). C'est parfait. Assurez-vous que PgBouncer est bien configuré (Transaction mode) pour éviter d'exploser le nombre de connexions lors de pics de trafic (ex: campagne virale d'influenceur).
- **Edge Computing :** Le Middleware `middleware.ts` est sur l'Edge. Il doit être ultra-léger. Ne faites pas d'appels à la BDD directement depuis le middleware, utilisez les cookies de session JWT fournis par Better Auth.

### 4. Checklist Audit Technique & Sécurité

#### Checklist Sécurité (Avant lancement en Production)

- [ ] **Zero Trust Input :** Tous les payloads entrants (`req.json()`) sont passés à travers un `.parse()` Zod.
- [ ] **No Secrets in Code :** Vérification via outils de scan locaux (ex: GitGuardian, gitleaks) qu'aucune clé n'est hardcodée.
- [ ] **Rate Limiting :** Implémentation d'un rate limiter sur les endpoints sensibles (Login, Inscription, Soumission de mission) pour éviter les attaques DDoS applicatives.
- [ ] **CORS & CSRF :** Configurer les CORS headers si des APIs sont exposées, protection CSRF active (gérée par Better Auth nativement en général).

#### Checklist Dette Technique

- [ ] **Observabilité :** Mettre en place Sentry ou Datadog très tôt. Sans ça, vous volerez à l'aveugle lorsque les utilisateurs auront des bugs sur des missions.
- [ ] **Testing :** Le fichier `AGENTS.md` mentionne Vitest. Avoir au minimum une suite de tests "Smoke" (Le login fonctionne, l'onboarding fonctionne, le calcul de la guilde fonctionne).

---

**Verdict Technologique :** Les fondations sont saines. Le défi ne sera pas d'écrire le code, mais de s'assurer qu'il reste inviolable et performant quand des milliers d'utilisateurs soumettront des actions simultanément. L'application du standard EHAF est votre gilet de sauvetage.

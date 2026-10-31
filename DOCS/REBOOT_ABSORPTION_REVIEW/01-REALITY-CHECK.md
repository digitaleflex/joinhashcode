# 01 — État réel observé sur JoinHashCode

## Snapshot GitHub
- Dépôt : `digitaleflex/joinhashcode`
- Branche par défaut : `main`
- Commit de base observé le 31/10/2026 : `427568345f75cb55666a78995028db24d69e23a6`
- Dernier commit observé : correction de la dépendance directe `nanoid` pour le build pnpm/Docker.
- Stack observée dans `package.json` : Next.js 16.4.3, React 19, Better Auth 1.7.7, Prisma 7.9.1, pnpm 10.33.0, PostgreSQL, Resend.
- Scripts disponibles : build, lint, verify, tests Vitest, Playwright E2E, type-check, security-scan.

## Faits vérifiés
1. `PRODUCT_VISION.md` présente encore le pivot cyber D-014 comme amendement constitutionnel prioritaire et renvoie à `DOCS/PIVOT_CYBER.md`.
2. `DOCS/DECISIONS.md` contient déjà D-023 : la communauté conserve trois axes Web/Cyber/IA, mais l'investissement produit de la filière reste cyber pendant 12 mois. Cette distinction doit être explicitement arbitrée par la nouvelle décision multi-domaines.
3. `DOCS/DECISIONS.md` contient également D-015 (gel de la gamification générique), D-016 à D-020. D-020 n'est donc PAS un identifiant disponible : la nouvelle décision doit prendre le prochain identifiant libre après vérification du fichier complet.
4. `DOCS/PIVOT_CYBER.md` reste présenté comme document de référence du pivot.
5. `lib/acquisition/engine.ts` existe et connaît explicitement les domaines `web`, `cybersecurity` et `ai`. Il comprend validation de réponses, progression du profilage et détection de domaines email jetables.
6. `app/api/squad/create/route.ts` vérifie `prisma.member.findFirst({ where: { userId } })` pour empêcher un utilisateur déjà membre d'une squad d'en créer une autre. La sémantique de `Member` est donc sensible aux flux d'acquisition.
7. `package.json` confirme Prisma 7 et pnpm ; toute proposition de migration doit respecter la stack actuelle.

## Écarts avec l'audit précédent
- Les chemins `app/acquisition/profiling-flow.tsx` et `app/actions/acquisition/create-prospect.ts` ne sont pas présents à ces chemins exacts sur le `main` observé (404). Les références antérieures sont probablement obsolètes ou ont été déplacées.
- Le rapport précédent proposait D-020, mais ce numéro est déjà utilisé dans le registre actuel.
- La présence des trois domaines dans le moteur d'acquisition ne prouve pas à elle seule l'existence de trois parcours complets et opérationnels.
- La route de brouillon, le flux magic link, les modèles Member/MemberProfile et les modules administratifs doivent être recherchés à partir de l'arbre actuel avant toute conclusion.

## Ce que ce snapshot ne prouve pas
Aucun clone local, build, lint, test, test E2E, test de migration ou déploiement n'a été exécuté dans le cadre de cette vérification. La présence d'un script dans `package.json` n'est pas une preuve que les contrôles passent. Les fonctionnalités administratives ne sont pas déclarées absentes sans revue exhaustive des routes, composants, actions, permissions et tests.

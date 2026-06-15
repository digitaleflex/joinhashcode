# HASHCODE System Architecture & Cadrage Produit

Ce document centralise la vision architecturale et l'organisation fonctionnelle de la plateforme HASHCODE, marquant la transition du MVP vers un système évolutif, modulaire et structuré.

## 1. Profils et Classes Utilisateurs

_Définition des archétypes fondamentaux et de leurs permissions._

- **Le Builder** : Focalisé sur la création technique, l'infrastructure, le back-end.
- **Le Créateur** : Orienté design, expérience utilisateur, front-end, art génératif.
- **Le Stratège** : Centré sur la data, l'optimisation, la croissance, les algorithmes.
- **Le Catalyseur** : Dédié à la communauté, l'animation, la connexion des talents, le réseau.

## 2. Systèmes de Progression et Parcours

_Gamification et déblocage graduel des capacités de la plateforme._

- **Niveaux (Levels)** : De 1 à 4 (et plus).
- **Critères d'Évolution** : Complétion du quiz, actions communautaires, engagement.
- **Déblocages Associés** : Accès à des outils spécifiques, accès aux guildes privées, badges.

## 3. Architecture des Dashboards Dynamiques

_Interfaces adaptatives basées sur la classe et le niveau._

- **Modules Communs** : Vue d'ensemble, Paramètres.
- **Outils Spécialisés** :
  - _Terminal HASH_ (Builder)
  - _Studio Créatif_ (Créateur)
  - _Analyste de Marché_ (Stratège)
  - _Hub de Connexion_ (Catalyseur)
- **Logique UI** : Thèmes colorimétriques dynamiques.

## 4. Architecture Communautaire

_Espaces d'interaction et d'intelligence collective._

- **Canaux / Guildes** : Espaces cloisonnés et publics.
- **Rôles (RBAC)** : Droits d'accès granulaires gérés via Prisma.

## 5. Modèles de Données & Base de Données (Prisma)

_Alignement des schémas pour supporter la vision._

- Utilisateurs et Profils (`User`, `QuizResult`).
- Progression (`Level`, `Experience`).
- Communauté (`Channel`, `Message`, `Guild`).

## 6. Routage et Pages Futures

_Structure Next.js (App Router)._

- `/dashboard` (Espace personnel)
- `/community/[canal]` (Espaces de guilde)
- `/profile/[id]` (Vues publiques des membres)
- `/missions` (Système de quêtes/tâches)

## 7. APIs Nécessaires

_Endpoints robustes et sécurisés._

- `GET /api/user/progress`
- `POST /api/community/join`
- `GET /api/analytics/behavior`

## 8. Analytics Comportementaux & Systèmes de Recommandation

_Comprendre l'utilisateur pour personnaliser l'expérience._

- Mesure des temps de réponse (déjà implémenté sur le quiz).
- Tracking des interactions communautaires.
- Moteur de suggestion d'outils et de connexions.

## 9. Fondations de Scalabilité Produit

_Bases techniques pérennes._

- **Front-end** : Server Components, Suspense, Caching.
- **Back-end** : Prisma Edge, Connection Pooling.
- **Sécurité** : Validation Zod, RBAC strict, limitations de taux (Rate Limiting).

---

_Document en cours de rédaction. Ce fichier servira de "Single Source of Truth" (SSOT) pour les prochains développements._

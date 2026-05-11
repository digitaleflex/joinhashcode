# HASHCODE System Architecture & Cadrage Produit

Ce document centralise la vision architecturale et l'organisation fonctionnelle de la plateforme HASHCODE, marquant la transition du MVP vers un système évolutif, modulaire et structuré.

## 1. Profils et Classes Utilisateurs
*Définition des archétypes fondamentaux et de leurs permissions.*
- **Le Builder** : Focalisé sur la création technique, l'infrastructure, le back-end.
- **Le Créateur** : Orienté design, expérience utilisateur, front-end, art génératif.
- **Le Stratège** : Centré sur la data, l'optimisation, la croissance, les algorithmes.
- **Le Catalyseur** : Dédié à la communauté, l'animation, la connexion des talents, le réseau.

## 2. Systèmes de Progression et Parcours
*Gamification et déblocage graduel des capacités de la plateforme.*
- **Niveaux (Levels)** : De 1 à 4 (et plus).
- **Critères d'Évolution** : Complétion du quiz, actions communautaires, engagement.
- **Déblocages Associés** : Accès à des outils spécifiques, accès aux guildes privées, badges.

## 3. Architecture des Dashboards Dynamiques
*Interfaces adaptatives basées sur la classe et le niveau.*
- **Modules Communs** : Vue d'ensemble, Paramètres.
- **Outils Spécialisés** :
  - *Terminal HASH* (Builder)
  - *Studio Créatif* (Créateur)
  - *Analyste de Marché* (Stratège)
  - *Hub de Connexion* (Catalyseur)
- **Logique UI** : Thèmes colorimétriques dynamiques.

## 4. Architecture Communautaire
*Espaces d'interaction et d'intelligence collective.*
- **Canaux / Guildes** : Espaces cloisonnés et publics.
- **Rôles (RBAC)** : Droits d'accès granulaires gérés via Prisma/Supabase.

## 5. Modèles de Données & Base de Données (Prisma)
*Alignement des schémas pour supporter la vision.*
- Utilisateurs et Profils (`User`, `QuizResult`).
- Progression (`Level`, `Experience`).
- Communauté (`Channel`, `Message`, `Guild`).

## 6. Routage et Pages Futures
*Structure Next.js (App Router).*
- `/dashboard` (Espace personnel)
- `/community/[canal]` (Espaces de guilde)
- `/profile/[id]` (Vues publiques des membres)
- `/missions` (Système de quêtes/tâches)

## 7. APIs Nécessaires
*Endpoints robustes et sécurisés.*
- `GET /api/user/progress`
- `POST /api/community/join`
- `GET /api/analytics/behavior`

## 8. Analytics Comportementaux & Systèmes de Recommandation
*Comprendre l'utilisateur pour personnaliser l'expérience.*
- Mesure des temps de réponse (déjà implémenté sur le quiz).
- Tracking des interactions communautaires.
- Moteur de suggestion d'outils et de connexions.

## 9. Fondations de Scalabilité Produit
*Bases techniques pérennes.*
- **Front-end** : Server Components, Suspense, Caching.
- **Back-end** : Prisma Edge, Connection Pooling (Supabase).
- **Sécurité** : Validation Zod, RBAC strict, limitations de taux (Rate Limiting).

---
*Document en cours de rédaction. Ce fichier servira de "Single Source of Truth" (SSOT) pour les prochains développements.*

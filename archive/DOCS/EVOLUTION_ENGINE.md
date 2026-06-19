# Moteur d'Évolution (Evolution Engine)

Ce document définit l'architecture du système de progression et de profilage de HASHCODE.
**Principe fondamental : "Construire le moteur le plus crédible possible, pas le plus intelligent possible."**

La stratégie suit un déploiement progressif (V1 → V2 → V3) basé sur le volume de données et de membres.

---

## V1 : Moteur de Base (MVP Robuste)

_Statut : Implémentation Actuelle (Communauté < 100 membres)_

Le système V1 est volontairement linéaire, compréhensible et transparent pour les utilisateurs.

### 1. XP et Niveaux (Progression Globale)

L'expérience s'accumule de manière linéaire. Chaque action apporte une valeur claire :

- Challenge classique = `+50 XP`
- Challenge avancé = `+100 XP`
- Mission Spéciale = `+150 XP`
- Atelier / Event = `+25 XP`

**Échelle de Niveaux :**

- **0 - 100** : Explorateur
- **101 - 300** : Contributeur
- **301 - 700** : Analyste
- **701 - 1500** : Spécialiste
- **1500+** : Expert

### 2. Talent Scores (Domaines)

Au lieu de profils psychométriques abstraits, les membres accumulent des points dans des **Domaines d'Expertise** concrets (QA, UX, Produit, Cybersécurité, DevOps, Cloud).

- Chaque mission valide rapporte des points dans un ou plusieurs domaines spécifiques.

### 3. Confidence (Fiabilité)

La "Confidence" en V1 est un indicateur de régularité et de fiabilité, basé sur le nombre de validations réussies.

- **0-20** = Faible
- **21-50** = Moyen
- **51-80** = Élevé
- **81-100** = Très élevé

### 4. Recommandation Automatique

Basé sur les Talent Scores, le système suggère une **Orientation** claire (ex: "Orientation suggérée : QA Analyst").

---

## V2 : Talent Detection Engine

_Déclencheur : > 100 membres, > 500 missions._

Le système commence à observer des patterns au-delà des points bruts.

- **Qualité & Régularité** : Prise en compte de la constance dans les soumissions.
- **Affinité de Guilde** : Regroupement automatique des profils complémentaires basés sur les scores historiques (Ex: Un leader produit avec un expert QA).

---

## V3 : La Couche Bayésienne & FSRS

_Déclencheur : > 300 membres, > 5000 missions, historiques multiples._

C'est ici que l'architecture technique complexe est activée, justifiée par le volume de données.

- **FSRS (Free Spaced Repetition Scheduler)** : Pris en compte du _Time Decay_. Si un membre n'a pas pratiqué le QA depuis 14 mois, son "Risque d'oubli" est affiché comme élevé, bien que son niveau historique reste visible.
- **Bayesian Rating (Glicko / TrueSkill)** : Remplacement de la Confidence statique par une véritable modélisation probabiliste (Moyenne $\mu$, Incertitude $\sigma$).
- **Psychométrie Adaptative** : Déploiement de l'Item Response Theory (IRT) pour l'onboarding.

---

## Synthèse d'Implémentation Core

### Actif dans le Core Actuel (V1)

✅ XP & Niveaux Linéaires
✅ Badges de complétion
✅ Talent Scores par Domaine (QA, UX, etc.)
✅ Indicateur de Confidence Basique
✅ Recommandations

### Préparé dans l'Architecture (V3 Ready)

⏳ Table pour l'historique du decay (FSRS)
⏳ Structures de données pour $\mu$ et $\sigma$ (Bayésien)

### Rejeté pour la V1 (Over-engineering)

❌ Glicko / Elo pur
❌ Psychométrie adaptative complexe
❌ Télémétrie IA avancée

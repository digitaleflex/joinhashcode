# Roadmap Produit — HASHCODE Community

> Analyse stratégique établie le 22 juin 2026
> Base : 121 fonctionnalités identifiées dans le codebase

---

## 1. Analyse des fonctionnalités par quadrant MoSCoW

Chaque fonctionnalité est évaluée sur 5 critères (1-5) :

| Critère                         | Signification                            |
| ------------------------------- | ---------------------------------------- |
| **U** — Valeur utilisateur      | Impact direct sur l'expérience du membre |
| **F** — Fréquence d'utilisation | Quotidienne, hebdomadaire, mensuelle     |
| **D** — Coût de développement   | Effort d'implémentation restant          |
| **M** — Coût de maintenance     | Effort continu sur le VPS                |
| **R** — Risque de complexité    | Probabilité de bugs/régressions          |

---

### 🔴 MUST HAVE — Fondations essentielles (MVP)

| #   | Fonctionnalité                                       | U   | F   | D   | M   | R   | Justification                                       |
| --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --------------------------------------------------- |
| 1   | **Auth** (Email OTP, Magic Link, Sessions)           | 5   | 5   | 1   | 2   | 1   | Porte d'entrée unique. Déjà implémentée et stable.  |
| 2   | **Onboarding Funnel** (pseudo, pays, objectif)       | 5   | 1   | 1   | 1   | 1   | 100% des nouveaux utilisateurs. Déjà en production. |
| 3   | **Quiz Psychométrique** (20+ questions, 4 profils)   | 5   | 1   | 1   | 2   | 2   | Différenciateur cœur. 1 seule fois par utilisateur. |
| 4   | **Système de Missions** (100 missions, 6 catégories) | 5   | 3   | 1   | 2   | 2   | Proposition de valeur principale. Déjà en prod.     |
| 5   | **XP & Niveaux** (awardXp, paliers, transactions)    | 5   | 4   | 1   | 1   | 1   | Moteur de progression. Critique pour l'engagement.  |
| 6   | **Dashboard** (accueil, progression, stats)          | 5   | 5   | 1   | 1   | 1   | Page d'atterrissage quotidienne. Déjà en prod.      |
| 7   | **Dossier Utilisateur** (profil complet, badges)     | 4   | 2   | 1   | 1   | 1   | Carte d'identité du membre. Déjà en prod.           |
| 8   | **Validation Admin** (approuver/rejeter soumissions) | 5   | 3   | 1   | 2   | 2   | Workflow critique de complétion de mission.         |
| 9   | **Admin Dashboard** (stats, utilisateurs, KPIs)      | 4   | 4   | 1   | 2   | 1   | Opérations quotidiennes de l'équipe.                |
| 10  | **Notifications In-App** (inbox, read/archive)       | 5   | 4   | 1   | 2   | 1   | Communication avec les membres. Déjà en prod.       |
| 11  | **ActivityLog** (30+ actions, fire-and-forget)       | 3   | 5   | 1   | 1   | 1   | Audit trail. Critique pour la confiance.            |
| 12  | **Rate Limiting** (Redis Upstash, 6 limiters)        | 4   | 5   | 1   | 1   | 1   | Protection anti-abuse. Déjà en prod.                |
| 13  | **Email Transactionnel** (Resend, templates)         | 5   | 3   | 1   | 1   | 1   | Notifications critiques (validation, reset).        |

**Coût total MVP** : Développement ≈ 0 (déjà fait). Maintenance : 13 unités.

---

### 🟡 SHOULD HAVE — V2 (Prochaine itération)

| #   | Fonctionnalité                                     | U   | F   | D   | M   | R   | Justification                                        |
| --- | -------------------------------------------------- | --- | --- | --- | --- | --- | ---------------------------------------------------- |
| 14  | **Badges** (7 badges, engine)                      | 4   | 1   | 1   | 1   | 1   | Gamification. Feature flag OFF → FLIP.               |
| 15  | **Check-in Quotidien** (note, énergie, durée)      | 4   | 5   | 1   | 2   | 2   | Engagement quotidien. Feature flag OFF → FLIP.       |
| 16  | **Evolution Engine** (4 dimensions, confidence)    | 4   | 1   | 1   | 2   | 2   | Différenciateur. Déjà implémenté, sous-exploité.     |
| 17  | **Radar d'Évolution** (graphique radar)            | 3   | 1   | 1   | 1   | 1   | Visualisation du profil. Déjà implémenté.            |
| 18  | **Neural Sync** (alignement de profil)             | 3   | 1   | 1   | 1   | 1   | Métrique sociale. Déjà implémenté.                   |
| 19  | **Escouades (Squads)** — Création, join, roster    | 4   | 1   | 1   | 1   | 1   | Fonctionnalité sociale clé. Feature flag OFF → FLIP. |
| 20  | **Squad Journey UI** (phases 1-3)                  | 4   | 1   | 2   | 2   | 2   | Gamification sociale. UI déjà construite.            |
| 21  | **Squad Invites & Join Requests**                  | 3   | 1   | 1   | 1   | 1   | Croissance virale. Déjà implémenté.                  |
| 22  | **Squad Leaderboard**                              | 3   | 1   | 1   | 1   | 1   | Compétition sociale. Déjà implémenté.                |
| 23  | **Admin CRUD Missions** (créer/modifier/supprimer) | 3   | 1   | 1   | 2   | 2   | Opérations admin. Déjà implémenté.                   |
| 24  | **Admin Gestion Utilisateurs** (ban, export)       | 4   | 2   | 1   | 1   | 1   | Modération. Déjà implémenté.                         |
| 25  | **Parrainage (Referral)**                          | 4   | 1   | 1   | 2   | 2   | Croissance. Déjà implémenté.                         |
| 26  | **Beta Feedback** (formulaire + admin)             | 3   | 1   | 1   | 1   | 1   | Amélioration produit. Déjà implémenté.               |
| 27  | **Profils Publics** (/u/[pseudo])                  | 3   | 1   | 1   | 1   | 1   | Découverte. Déjà implémenté.                         |
| 28  | **2FA** (TOTP + backup codes)                      | 3   | 1   | 1   | 1   | 1   | Sécurité. Déjà implémenté.                           |
| 29  | **Carte de Membre (OG)**                           | 3   | 1   | 2   | 1   | 1   | Partage viral. Déjà implémenté.                      |
| 30  | **Middleware Funnel** (3-stage guard)              | 5   | 5   | 1   | 1   | 1   | Déjà en prod critique.                               |
| 31  | **Guided Tour** (driver.js)                        | 3   | 1   | 1   | 1   | 1   | UX onboarding. Déjà implémenté.                      |
| 32  | **UX Poll** (préférences + admin stats)            | 2   | 1   | 1   | 1   | 1   | Data produit. Déjà implémenté.                       |
| 33  | **Canal Externe Squad** (Discord/WhatsApp link)    | 3   | 1   | 1   | 1   | 1   | Communication déportée. Déjà implémenté.             |

**Coût V2** : Développement ≈ 5 unités (squad-journey, external link config). Feature flags à activer. Maintenance : 19 unités.

---

### 🟢 COULD HAVE — V3 (Améliorations)

| #   | Fonctionnalité                               | U   | F   | D   | M   | R   | Justification                             |
| --- | -------------------------------------------- | --- | --- | --- | --- | --- | ----------------------------------------- |
| 34  | **Défis Hebdomadaires** (weekly challenges)  | 4   | 1   | 3   | 2   | 3   | Engagement régulier. UI joueur manquante. |
| 35  | **Rétrospectives Mission**                   | 3   | 1   | 1   | 1   | 1   | Feedback post-mission. Feature flag OFF.  |
| 36  | **Tech Tree & Spécialisation**               | 3   | 1   | 3   | 2   | 3   | Orienté expert. UI non construite.        |
| 37  | **Admin Broadcast** (notifications globales) | 2   | 1   | 1   | 1   | 1   | Communication admin. Déjà implémenté.     |
| 38  | **Admin UX Poll Dashboard** (graphiques)     | 2   | 1   | 1   | 1   | 1   | Data produit. Déjà implémenté.            |
| 39  | **Admin Activity Log** (visualisation)       | 2   | 1   | 1   | 1   | 1   | Audit. Déjà implémenté.                   |
| 40  | **Admin Beta Keys** (génération + gestion)   | 2   | 1   | 1   | 1   | 1   | Accès contrôlé. Déjà implémenté.          |
| 41  | **Admin Feedback Management**                | 2   | 1   | 1   | 1   | 1   | Modération feedback. Déjà implémenté.     |
| 42  | **Admin Missions Management UI**             | 3   | 1   | 2   | 2   | 2   | Gestion contenu. Déjà implémenté.         |
| 43  | **Squad Role Management** (promote/demote)   | 2   | 1   | 1   | 1   | 1   | Gestion d'équipe. Déjà implémenté.        |
| 44  | **Squad Ownership Transfer**                 | 2   | 1   | 1   | 1   | 1   | Continuité. Déjà implémenté.              |
| 45  | **Annuaire des Talents** (recherche/filtres) | 3   | 1   | 1   | 1   | 1   | Découverte sociale. Déjà implémenté.      |
| 46  | **Data Export (GDPR)**                       | 2   | 1   | 1   | 1   | 1   | Conformité. Déjà implémenté.              |
| 47  | **Formulaire de Contact**                    | 1   | 1   | 1   | 1   | 1   | Support. Déjà implémenté.                 |
| 48  | **Cookie Banner**                            | 1   | 1   | 1   | 1   | 1   | Conformité RGPD. Déjà implémenté.         |
| 49  | **Pages Légales** (Privacy, Terms, Legal)    | 1   | 1   | 1   | 1   | 1   | Conformité. Déjà implémenté.              |
| 50  | **Passkeys** (WebAuthn)                      | 2   | 1   | 1   | 1   | 1   | Auth sans mot de passe. Déjà implémenté.  |

**Coût V3** : Développement ≈ 6 unités (weekly challenges UI, tech tree). Maintenance : 17 unités.

---

### 🔵 FUTURE — Plus tard (Horizon 2027+)

| #   | Fonctionnalité                     | U   | F   | D   | M   | R   | Justification                          |
| --- | ---------------------------------- | --- | --- | --- | --- | --- | -------------------------------------- |
| 51  | **Guilds** (groupes thématiques)   | 3   | 1   | 5   | 4   | 4   | Redondant avec Squads. À réévaluer.    |
| 52  | **Mission Claim (Peer Review)**    | 2   | 1   | 3   | 3   | 4   | Déjà suspendu. Complexité > valeur.    |
| 53  | **Squad Messaging Temps Réel**     | 3   | 3   | 4   | 4   | 4   | Externalisé vers Discord/WhatsApp.     |
| 54  | **Squad Activity Feed**            | 2   | 2   | 2   | 2   | 2   | Dashboard suffit.                      |
| 55  | **Recommandation de Talents**      | 3   | 1   | 4   | 3   | 3   | Algorithme complexe.                   |
| 56  | **PostHog Analytics**              | 2   | 1   | 1   | 2   | 1   | Optionnel, console suffit.             |
| 57  | **Carte Géographique** (admin GPS) | 1   | 1   | 2   | 3   | 4   | Risque RGPD. Utilité faible.           |
| 58  | **Badge LEGENDE / 25 missions**    | 1   | 1   | 1   | 1   | 1   | Seuil trop haut pour la base actuelle. |
| 59  | **Application Mobile**             | 5   | 5   | 10  | 5   | 5   | Projet majeur. Nécessite API stable.   |
| 60  | **API Publique / Tiers**           | 3   | 1   | 5   | 4   | 4   | Trop tôt dans le cycle de vie.         |

---

## 2. Roadmaps

### ROADMAP MVP (Maintenant) — Activer l'existant

**Objectif** : Mettre en production les fonctionnalités critiques déjà développées mais désactivées.

```
Sprint A (1 semaine)
├── Activer BADGES (feature flag → ON)
│   └── 7 badges : INITIE, VETERAN, ELITE, EARLY_ADOPTER, L_EXEMPLAIRE, SYNCHRO_GOLD, HYPER_LINK
├── Activer STREAKS (feature flag → ON)
│   └── Check-in quotidien, streak counters, XP bonus
└── Activer SQUADS (feature flag → ON)
    └── Création, roster, invites, journey phases 1-4

Sprint B (1 semaine)
├── Configurer AUDIENCE_WEBHOOK_URL pour Loops/Resend
├── Ajouter lien Discord/WhatsApp dans squad-settings (déjà fait)
├── Supprimer les derniers résidus de peer-review
└── Tests de charge sur le VPS

Sprint C (1 semaine)
├── Lancer la beta fermée (20-50 utilisateurs)
├── Monitoring : logs, erreurs, performance
└── Boucle de feedback itérative
```

**Métriques de succès MVP** :

- Taux de complétion onboarding → quiz > 70 %
- Taux de soumission de mission > 40 % des inscrits
- Temps de réponse admin < 48h
- Aucune erreur 500 sur le parcours critique

---

### ROADMAP V2 (J+30 à J+90) — Croissance

**Objectif** : Fidéliser les utilisateurs et activer la boucle virale.

```
Phase 1 (J+30) — Gamification
├── Améliorer l'affichage des badges dans le Dossier
├── Notifications visuelles de déblocage de badge
├── Animations de level-up
├── XP Growth Chart sur le dashboard
└── Message de "streak en danger" si inactif 48h

Phase 2 (J+45) — Viralité
├── Optimiser les profils publics (SEO)
├── Carte de membre partageable (OG image)
├── Widget de parrainage dans le dashboard
├── Campagne email de relance pour les inscrits sans quiz
└── Liens d'invitation squad optimisés

Phase 3 (J+60) — Rétention
├── Dashboard enrichi (widgets recommandations)
├── Notifications push (email) pour missions matching profil
├── Leaderboard hebdomadaire
├── Système de "mission du jour" recommandée
└── Cohésion squad simplifiée (sans decay)

Phase 4 (J+75) — Opérations
├── Admin dashboard KPIs enrichis
├── Export CSV utilisateurs avancé
├── Gestion des beta keys depuis l'admin
├── Modération simplifiée des soumissions
└── Statistiques d'engagement hebdomadaires
```

**Investissement estimé V2** : 2-3 développeurs × 2 mois

---

### ROADMAP V3 (J+90 à J+180) — Maturité

**Objectif** : Passer de l'outil à la plateforme communauté.

```
Phase 1 (J+90) — Contenu
├── Missions premium (CORE/PRO) avec briefings riches
├── Défis hebdomadaires (UI joueur + classement)
├── Rétrospectives de mission (feedback utilisateur)
├── Tech tree / spécialisation visible
└── Badges de spécialisation par domaine

Phase 2 (J+120) — Communauté
├── Annuaire des talents avancé (filtres complets)
├── Profil public enrichi (portfolio + réalisations)
├── Système de recommandation pair-à-pair
├── Messenger squad externe (Discord bridge)
└── Événements communautaires (hackathons)

Phase 3 (J+150) — Scalabilité
├── Cache Redis optimisé
├── Optimisation des requêtes Prisma (N+1)
├── Tests de performance (k6)
├── Documentation API
└── Préparation mobile (PWA)

Phase 4 (J+180) — Monetization
├── Mission sponsorisées (partenariats)
├── Profils "vérifiés" (entreprises)
├── Recrutement / Talent matching
└── Abonnements premium (stats avancées, insights)
```

**Investissement estimé V3** : 3-4 développeurs × 3 mois

---

## 3. Fonctionnalités à supprimer ou mettre en sommeil

Ces fonctionnalités ne justifient plus leur existence dans le codebase :

| #   | Fonctionnalité                             | Raison                                                                          | Action                                                  |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | **GPS / Géolocalisation**                  | Risque RGPD. Aucune utilisation réelle. Code de maintenance coûteux.            | Supprimer (déjà fait : colonnes enlevées, cron restant) |
| 2   | **Peer-Review Distribué** (Claim + Review) | Suspendu. Le workflow admin est plus fiable et moins complexe.                  | Supprimer le code mort (déjà fait)                      |
| 3   | **Squad Chat Temps Réel**                  | Externalisé vers Discord/WhatsApp. Évite les coûts d'infra temps réel.          | Remplacer par lien externe (déjà fait)                  |
| 4   | **Cohesion Decay Cron**                    | Sans cohésion dynamique, le cron n'a plus de sens.                              | Supprimer                                               |
| 5   | **Onboarding Drip Cron**                   | Externalisé vers Loops/Resend. Moins de charge sur Next.js.                     | Supprimer (déjà fait)                                   |
| 6   | **Purge Data Cron**                        | Trop agressif. Rétention à gérer manuellement ou via une politique plus simple. | Supprimer ou réduire drastiquement                      |
| 7   | **Modèles Prisma legacy**                  |                                                                                 |                                                         |
|     | `Suggestion`                               | Ancien système de suggestions, plus utilisé.                                    | Supprimer du schéma                                     |
|     | `Bookmark`                                 | Plus utilisé.                                                                   | Supprimer du schéma                                     |
|     | `PasswordResetToken`                       | Remplacé par OTP/Magic Link.                                                    | Supprimer du schéma                                     |
|     | `VerificationToken`                        | Remplacé par OTP.                                                               | Supprimer du schéma                                     |
|     | `Badge` (ancien modèle)                    | Remplacé par badge-engine.ts.                                                   | Supprimer du schéma                                     |
|     | `UserBadge` (ancien modèle)                | Remplacé par badges[] sur User.                                                 | Supprimer du schéma                                     |
| 8   | **Reviewer Queue (pair)**                  | Inutilisable sans peer-review.                                                  | Supprimer ou verrouiller                                |
| 9   | **Admin GPS Map**                          | Basé sur la géolocalisation supprimée.                                          | Supprimer                                               |
| 10  | **PostHog Analytics** (optionnel)          | Console suffisante en MVP. Payant à l'échelle.                                  | Désactiver, réactiver si besoin                         |

---

## 4. Matrice d'impact technique

### Ce qui ALLÈGE le VPS

| Suppression           | Gain RAM | Gain CPU | Gain Stockage | Gain Maint. |
| --------------------- | -------- | -------- | ------------- | ----------- |
| Peer-review code mort | Faible   | Moyen    | Faible        | Élevé       |
| GPS / Location        | Faible   | Faible   | Moyen         | Élevé       |
| Squad chat temps réel | Moyen    | Moyen    | Élevé         | Élevé       |
| Onboarding drip cron  | Faible   | Moyen    | Faible        | Moyen       |
| Purge data cron       | Faible   | Faible   | Élevé         | Moyen       |
| Modèles Prisma legacy | Faible   | Faible   | Faible        | Moyen       |

### Estimation de réduction de complexité

| Métrique        | Avant | Après | Réduction |
| --------------- | ----- | ----- | --------- |
| Fichiers API    | ~62   | ~55   | ~11 %     |
| Routes          | ~68   | ~58   | ~15 %     |
| Modèles Prisma  | ~32   | ~25   | ~22 %     |
| Lib files       | ~45   | ~38   | ~16 %     |
| Composants      | ~150  | ~140  | ~7 %      |
| Fichiers totaux | ~280  | ~240  | ~14 %     |

---

## 5. Recommandations clés

### Priorité absolue (exécution immédiate)

1. **Activer les 3 feature flags** : `badges`, `streaks`, `squads` → ON
   - 80 % du code est déjà écrit et testé
   - Ces 3 features sont les principaux leviers d'engagement
   - Risque technique quasi nul (feature-flagged, testé)

2. **Configurer le webhook audience** (`AUDIENCE_WEBHOOK_URL`)
   - Permet de déléguer le drip marketing à Loops/Resend
   - Soulage Next.js des traitements cron d'email
   - Coût d'implémentation : 1 ligne de config

3. **Supprimer le code mort identifié**
   - Évite la confusion des nouveaux développeurs
   - Réduit la surface d'attaque (GPS, peer-review)
   - Accélère le build (moins de fichiers à compiler)

### Pièges à éviter

- **Ne pas construire de chat interne** : Discord/WhatsApp sont gratuits, matures, et déjà adoptés par la cible Africaine
- **Ne pas réactiver le peer-review** : Trop complexe pour la taille actuelle de la communauté. Admin review > peer review.
- **Ne pas construire de mobile natif** : PWA suffit jusqu'à 10 000 utilisateurs
- **Ne pas activer Guilds** : Redondant avec le système de classes (builder/creator/strategist/catalyst) qui segmente déjà les utilisateurs

---

## 6. Métriques clés à suivre

| Métrique                  | Objectif MVP | Objectif V2 | Objectif V3 |
| ------------------------- | ------------ | ----------- | ----------- |
| Utilisateurs actifs (DAU) | > 20         | > 100       | > 1 000     |
| Taux de complétion quiz   | > 70 %       | > 80 %      | > 85 %      |
| Missions soumises/semaine | > 10         | > 50        | > 200       |
| Taux de rétention J+7     | > 40 %       | > 50 %      | > 60 %      |
| Squads actives            | > 5          | > 20        | > 100       |
| Temps de réponse admin    | < 48h        | < 24h       | < 12h       |
| Score NPS                 | > 30         | > 45        | > 55        |

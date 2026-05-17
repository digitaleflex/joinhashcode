# HASHCODE — Spécification : Le Profil Vivant

> Le quiz est une hypothèse. Tout ce qui suit la confirme, l'affine, ou la corrige.

---

## Vision

HASHCODE ne doit pas être une plateforme qui te classe une fois et t'oublie. C'est un système qui apprend qui tu es au fil du temps — à travers tes missions, tes check-ins, tes blocages, tes objectifs. Le profil devient vivant.

**Principe directeur :** chaque donnée collectée doit servir à une décision concrète (quelle mission proposer, quelle formation recommander, dans quelle guilde progresser). Si une donnée ne sert à rien de décisionnel, on ne la collecte pas.

---

## État actuel

### Ce qui existe déjà dans le schéma

| Champ | Type | Utilisé ? |
|---|---|---|
| `class` (Builder/Creator/Strategist/Catalyst) | String | ✅ |
| `builderScore`, `creatorScore`, `strategistScore`, `catalystScore` | Int | ✅ |
| `confidenceScore` | Int | ✅ |
| `level` (INIT/CORE/PRO/ELITE) | String | ✅ |
| `behavioralVectors` | Json | ⚠️ Partiellement |
| `profileDrift` | Json | ❌ Pas utilisé |
| `behavioralVibrancy` | Float | ❌ Pas utilisé |
| `missions` (relation) | Mission[] | ⚠️ Missions génériques |
| `currentSituation` | String | ✅ |
| `mainObjective` | String | ✅ |
| `domains` | String[] | ✅ |
| `tools` | String[] | ✅ |

### Ce qui manque

- Missions **spécifiques par profil** avec livrables concrets
- Données post-quiz : rêve à 12 mois, blocages actuels, stack quotidienne
- Check-in d'activité quotidienne
- Système de recommandation de formations lié au profil

---

## Roadmap — 4 étapes dans l'ordre

---

## Étape 1 — Missions par profil *(priorité maximale)*

### Principe

Chaque profil a son propre catalogue de missions. Une mission Builder ne peut pas être complétée par un Catalyseur — le livrable est trop spécifique. Les missions ont 3 niveaux : INIT (débutant), CORE (intermédiaire), PRO (avancé).

### Structure d'une mission

```
Titre         : court, actionnable, sans jargon
Profil cible  : Builder | Creator | Strategist | Catalyst
Niveau        : INIT | CORE | PRO
Durée estimée : en heures (1h, 3h, 8h)
Description   : ce que la mission développe chez ce profil
Livrable      : ce que l'utilisateur soumet pour valider
XP            : points gagnés à la completion
Compétences   : tags de ce que ça développe
```

### Catalogue par profil

---

#### BUILDER (développeur, ingénieur, maker)

| # | Titre | Niveau | Durée | Livrable | XP |
|---|---|---|---|---|---|
| B1 | Premier Commit | INIT | 2h | Lien GitHub avec README + description du projet | 100 |
| B2 | Deploy en production | INIT | 3h | URL live fonctionnelle + screenshot | 150 |
| B3 | Résoudre un vrai bug | CORE | 4h | Lien PR + explication du diagnostic | 200 |
| B4 | API publique documentée | CORE | 6h | URL endpoint + doc Postman/Swagger | 250 |
| B5 | Contribuer à un projet open source | CORE | 8h | Lien PR mergée | 300 |
| B6 | Construire un outil interne | PRO | 12h | Repo + demo vidéo 2min | 400 |
| B7 | Système en production avec 10 utilisateurs réels | PRO | - | Screenshot métriques + retours users | 500 |

**Compétences développées :** Shipping, debugging, documentation, versioning, infrastructure

---

#### CRÉATEUR (designer, rédacteur, vidéaste)

| # | Titre | Niveau | Durée | Livrable | XP |
|---|---|---|---|---|---|
| C1 | Première publication | INIT | 2h | Lien article/post/vidéo publiée | 100 |
| C2 | Identité visuelle d'un projet | INIT | 4h | Fichier Figma ou PDF avec logo, couleurs, typo | 150 |
| C3 | Cas d'usage redesigné | CORE | 6h | Before/After + explication des choix | 200 |
| C4 | Contenu qui a eu de l'engagement | CORE | - | Screenshot métriques + URL | 250 |
| C5 | Système de design (mini) | CORE | 8h | Fichier Figma avec composants | 300 |
| C6 | Identité complète d'une marque | PRO | 15h | PDF brand guidelines complet | 400 |
| C7 | Contenu qui a converti | PRO | - | Funnel + résultats mesurables | 500 |

**Compétences développées :** Storytelling, design systems, publication, conversion, narration

---

#### STRATÈGE (product, growth, business dev)

| # | Titre | Niveau | Durée | Livrable | XP |
|---|---|---|---|---|---|
| S1 | Analyser un marché en 1 page | INIT | 3h | Document structuré (problème, acteurs, opportunité) | 100 |
| S2 | Définir le MVP d'une idée | INIT | 2h | Fiche produit : problème, cible, 3 features max | 150 |
| S3 | Conduire 5 interviews utilisateurs | CORE | 6h | Synthèse des insights + verbatims clés | 200 |
| S4 | Roadmap produit sur 3 mois | CORE | 4h | Document avec priorités justifiées | 250 |
| S5 | Mesurer une métrique de croissance | CORE | - | Dashboard ou tableau de bord avec analyse | 300 |
| S6 | Lancer une expérience A/B | PRO | 8h | Hypothèse + résultats + décision | 400 |
| S7 | Faire passer un produit de 0 à 100 users | PRO | - | Rapport stratégie d'acquisition + métriques | 500 |

**Compétences développées :** Analyse, product thinking, growth, priorisation, data

---

#### CATALYSEUR (community, mentor, networker)

| # | Titre | Niveau | Durée | Livrable | XP |
|---|---|---|---|---|---|
| K1 | Introduire 2 personnes qui ont collaboré | INIT | - | Témoignage des 2 personnes + contexte | 100 |
| K2 | Organiser un événement (même petit) | INIT | 4h | Recap avec photos + liste participants | 150 |
| K3 | Mentorer quelqu'un sur 2 semaines | CORE | - | Journal de suivi + feedback du mentoré | 200 |
| K4 | Construire une communauté de 50 personnes | CORE | - | Preuves d'engagement (messages, activité) | 250 |
| K5 | Créer un programme d'onboarding | CORE | 6h | Document ou Notion avec le process | 300 |
| K6 | Impact mesurable sur un réseau | PRO | - | Rapport : qui a été connecté, quels résultats | 400 |
| K7 | Lancer un mouvement ou initiative | PRO | - | Story + métriques d'impact | 500 |

**Compétences développées :** Facilitation, mentoring, networking stratégique, community building

---

### Missions hybrides (tous profils)

Ces missions sont disponibles à tous mais évaluées différemment selon le profil.

| # | Titre | Description | Évaluation selon profil |
|---|---|---|---|
| H1 | Résoudre un problème réel | Identifier un problème dans ton environnement et le résoudre | Builder : code / Créateur : contenu / Stratège : plan / Catalyseur : mise en relation |
| H2 | Documenter ton parcours | Écrire un post sur ce que tu as appris ce mois-ci | Tous profils, livrable identique |
| H3 | Collaborer avec un autre profil | Mener un projet avec quelqu'un d'un profil différent | Preuve de collaboration + résultat |

---

## Étape 2 — Collecte d'infos post-quiz *(après étape 1)*

### Principe

Après le quiz, avant d'accéder au dashboard, l'utilisateur répond à 3 questions supplémentaires. Rapides, directes, pas de formulaire long. Les réponses orientent immédiatement les missions suggérées.

### Les 3 questions

**Question 1 — Le rêve à 12 mois**
```
"Dans 12 mois, qu'est-ce qui aurait changé dans ta vie professionnelle
si tout se passe comme tu le veux ?"
→ Texte libre (max 200 caractères)
→ Stocké dans : User.dreamStatement (nouveau champ String)
```

**Question 2 — La situation quotidienne**
```
"Concrètement, sur quoi travailles-tu en ce moment ?"
→ Sélection multiple parmi des domaines (tech, design, business, éducation, santé, agriculture, fintech, autre)
→ Stocké dans : User.currentFocus (nouveau champ String[])
```

**Question 3 — Le principal blocage**
```
"Qu'est-ce qui te bloque le plus en ce moment ?"
→ Choix unique parmi :
  - Manque de compétences techniques
  - Manque de visibilité / réseau
  - Manque de clarté sur ma direction
  - Manque de temps / organisation
  - Manque de ressources / financement
  - Autre
→ Stocké dans : User.mainBlocker (nouveau champ String)
```

### Impact sur les missions suggérées

```
Si blocage = "Manque de compétences techniques" + profil Builder
  → Suggérer B1, B2 en priorité

Si blocage = "Manque de visibilité / réseau" + profil Creator
  → Suggérer C1, C4 en priorité

Si blocage = "Manque de clarté" + n'importe quel profil
  → Suggérer H2 (documenter son parcours) en premier
```

---

## Étape 3 — Check-in d'activité quotidienne *(après étape 2)*

### Principe

Un check-in rapide (30 secondes max) accessible depuis le dashboard. Optionnel mais encourage. Alimente le `behavioralVibrancy` qui existe déjà dans le schéma.

### Structure du check-in

```
"Qu'as-tu avancé aujourd'hui ?"
→ Texte libre court (max 150 caractères)

"Dans quel domaine ?"
→ Tag parmi : Code / Design / Business / Contenu / Réseau / Apprentissage / Autre

"Niveau d'énergie ?"
→ 1 à 5 (emoji scale, pas de label verbal)

→ Durée estimée de la session : 15min / 30min / 1h / 2h+ (sélection)
```

### Modèle de données

```prisma
model DailyCheckin {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  note      String   @db.VarChar(150)
  domain    String
  energy    Int      // 1-5
  duration  Int      // en minutes
  createdAt DateTime @default(now())
}
```

### Utilisation des données

- `behavioralVibrancy` = fréquence des check-ins sur les 30 derniers jours (0.0 à 1.0)
- Le domaine fréquent recalibre les suggestions de missions
- L'énergie moyenne peut déclencher une notification douce si < 2 pendant 5 jours

---

## Étape 4 — Recommandations de formations *(quand 50+ users actifs)*

### Principe

On ne construit pas un catalogue de formations à l'avance. On observe ce que les users font, où ils bloquent, et on recommande des ressources externes (YouTube, Coursera, articles) organisées par profil + niveau.

### Structure

```prisma
model LearningResource {
  id          String   @id @default(cuid())
  title       String
  url         String
  type        String   // video | article | course | tool
  profiles    String[] // quels profils concernés
  levels      String[] // INIT | CORE | PRO
  domains     String[] // tags de domaine
  language    String   // fr | en
  durationMin Int      // durée estimée en minutes
  createdAt   DateTime @default(now())
}
```

### Logique de recommandation

```
Pour un utilisateur :
1. Récupérer son profil dominant + niveau
2. Récupérer son mainBlocker + currentFocus
3. Filtrer les LearningResource qui matchent profil + domaine
4. Prioriser ceux qui correspondent au blocage déclaré
5. Limiter à 3 recommandations visibles (pas de catalogue infini)
```

---

## Schéma Prisma — modifications nécessaires

### Nouveaux champs sur User

```prisma
// Post-quiz questionnaire
dreamStatement  String?    // "Dans 12 mois..."
currentFocus    String[]   // domaines actuels
mainBlocker     String?    // principal frein

// Activité
behavioralVibrancy Float @default(0)  // déjà là, à activer
lastCheckinAt   DateTime?
```

### Nouveaux modèles

```prisma
model DailyCheckin {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  note      String   @db.VarChar(150)
  domain    String
  energy    Int
  duration  Int
  createdAt DateTime @default(now())
}

model LearningResource {
  id          String   @id @default(cuid())
  title       String
  url         String
  type        String
  profiles    String[]
  levels      String[]
  domains     String[]
  language    String   @default("fr")
  durationMin Int
  createdAt   DateTime @default(now())
}
```

---

## Ordre d'implémentation

```
Semaine 1 : Étape 1
  ├── Mettre à jour le seed avec les missions par profil (B1-B7, C1-C7, S1-S7, K1-K7, H1-H3)
  ├── Ajouter un champ `targetProfiles` sur le modèle Mission
  ├── Filtrer les missions par profil dans /missions
  └── Afficher les missions suggérées en priorité sur le dashboard

Semaine 2 : Étape 2
  ├── Ajouter dreamStatement, currentFocus, mainBlocker au schéma User
  ├── Créer une page post-quiz (3 questions entre /quiz et /dashboard)
  ├── Brancher la logique de suggestion de missions

Semaine 3 : Étape 3
  ├── Créer le modèle DailyCheckin
  ├── Widget check-in sur le dashboard
  ├── Calculer et afficher behavioralVibrancy

Semaine 4+ : Étape 4
  ├── Attendre 50 users actifs
  ├── Créer LearningResource + seed initial
  └── Widget "Formations recommandées" sur le dashboard
```

---

## Critères de succès

| Étape | Succès si... |
|---|---|
| 1 | Chaque profil a au moins 5 missions avec livrables clairs et l'utilisateur ne voit que ses missions |
| 2 | 80%+ des users complètent les 3 questions post-quiz |
| 3 | 30%+ des users actifs font un check-in par semaine |
| 4 | Le taux de completion de missions augmente après recommandation |

---

## Ce qu'on NE fait PAS (pour l'instant)

- ❌ Algorithme de matching entre membres (trop tôt)
- ❌ Marketplace de services entre profils (trop tôt)
- ❌ Certifications ou badges (trop tôt)
- ❌ Contenu généré par IA pour chaque mission (trop tôt)
- ❌ App mobile native (on optimise le web d'abord)

---

*Document créé le 2026-05-17 — à réviser après les 50 premiers utilisateurs actifs.*

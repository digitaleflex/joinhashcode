# HASHCODE Experience Framework (HXF) — Audit Stratégique

> **Principe** : Ne pas auditer en demandant « Qu'est-ce qui est mal fait ? » mais « Est-ce que cet écran tient la promesse de HashCode ? »

## La promesse retenue

> **Découvre ton potentiel. Développe tes compétences. Construis ton avenir.**
>
> HashCode identifie tes forces, t'oriente vers la bonne spécialisation et t'accompagne avec des ateliers, du mentorat et des projets concrets jusqu'à ce que ton potentiel devienne une véritable expertise.

---

## Parcours utilisateur actuel (simplifié)

```
Landing → Signin → Beta Access → Onboarding (6 étapes) → Quiz (13 questions)
→ Animation "Analyse" → ResultRevelation (classe dévoilée)
→ ResultScores + MissionsLocked → Dashboard
```

---

## Audit page par page

---

### 1. Landing Page (`/`)

| Axe | Analyse |
|---|---|
| **Objectif** | Convertir un visiteur en membre — lui donner envie de rejoindre |
| **Valeur utilisateur** | Faible. Le visiteur voit des noms de profils (Builder, Stratège...) et des stats, mais ne comprend pas **ce que HashCode va changer dans sa vie** |
| **Cohérence promesse** | ❌ La promesse actuelle est implicite : « découvre ton potentiel tech ». Le CTA « Révéler mon potentiel » envoie directement au quiz — il manque la **transformation** |
| **Action suivante** | « Révéler mon potentiel » → renvoie vers `/quiz`. Mais si l'utilisateur n'a pas de session, il est redirigé vers `/signin`. Le parcours est **cassé** : un non-connecté clique « Révéler mon potentiel » et atterrit sur une page de connexion. |
| **Priorité** | 🟠 **Repenser** |

**Problèmes identifiés :**
- Le Hero montre un résultat de quiz (radar avec scores) avant même que l'utilisateur ait fait quoi que ce soit — l'effet de surprise est gâché
- Le message « Ne sois plus un spectateur. Deviens un Builder. » parle de **devenir un profil**, pas de **transformer sa vie**
- Les stats (X membres, Y Builders) sont du « social proof » froid qui ne répond pas à « qu'est-ce que ça m'apporte ? »
- Aucune mention d'un parcours, d'une progression, d'un accompagnement — on vend un quiz, pas une transformation

---

### 2. Sign-in (`/signin`)

| Axe | Analyse |
|---|---|
| **Objectif** | Authentifier l'utilisateur |
| **Valeur utilisateur** | Correcte : l'utilisateur reçoit un code OTP et se connecte |
| **Cohérence promesse** | ⚠️ Neutre — c'est un écran technique, mais il pourrait porter la promesse |
| **Action suivante** | Claire : entrer email → OTP → redirection vers `/onboarding` (ou callbackURL) |
| **Priorité** | 🟢 **Garder tel quel** (amélioration cosmétique possible) |

---

### 3. Beta Access (`/beta-access`)

| Axe | Analyse |
|---|---|
| **Objectif** | Filtrer les accès en beta |
| **Valeur utilisateur** | Aucune — l'utilisateur doit entrer une clé ou repartir |
| **Cohérence promesse** | ❌ Contradictoire : on promet la découverte du potentiel, mais on commence par un formulaire de clé |
| **Action suivante** | Entrer clé → `/onboarding` OU quitter le site |
| **Priorité** | 🟠 **Repenser** (ou supprimer si la beta ouvre) |

---

### 4. Onboarding (`/onboarding`)

| Axe | Analyse |
|---|---|
| **Objectif** | Collecter les données personnelles de l'utilisateur |
| **Valeur utilisateur** | Faible à moyenne. L'utilisateur remplit un formulaire (pseudo, niveau technique, pays, situation, objectif) mais **ne reçoit pas de valeur immédiate** |
| **Cohérence promesse** | ⚠️ Partielle. Le titre de l'étape finale (« Ton Diagnostic de Profil ») commence à évoquer la découverte, mais les étapes précédentes sont perçues comme du **formulaire administratif** |
| **Action suivante** | « Démarrer le diagnostic » → `/quiz`. C'est clair mais l'utilisateur n'a pas eu de **récompense émotionnelle** avant de commencer le quiz |
| **Priorité** | 🟡 **Améliorer** |

**Problèmes identifiés :**
- Le Welcome step (étape 0) décrit HashCode comme « plateforme des talents tech africains — profil psychométrique, communauté ciblée, missions concrètes ». C'est une description fonctionnelle, pas une promesse de transformation.
- Les étapes sont séquentielles sans feedback émotionnel — on ne « gagne » rien en passant chaque étape
- Aucune personnalisation visible pendant l'onboarding : les questions sont les mêmes pour tout le monde
- L'utilisateur donne son objectif, son niveau, sa situation — mais ces données ne sont **jamais utilisées** pour adapter l'expérience immédiatement (elles le seront plus tard, mais l'utilisateur ne le voit pas)

---

### 5. Quiz (`/quiz`)

| Axe | Analyse |
|---|---|
| **Objectif** | Évaluer le profil psychométrique de l'utilisateur |
| **Valeur utilisateur** | L'expérience de question-réponse est bien conçue (UX propre, animation) mais l'utilisateur répond sans comprendre **ce que chaque réponse change dans son avenir** |
| **Cohérence promesse** | ⚠️ Partielle. Le quiz est le bon outil de découverte, mais il est vendu comme un « Diagnostic / Protocole de Calibration », pas comme le **premier pas de la transformation** |
| **Action suivante** | Répondre aux questions → résultat. La transition est fluide mais **l'après** est le vrai problème |
| **Priorité** | 🟡 **Améliorer** |

---

### 6. ResultRevelation (`/quiz` → composant résultat)

| Axe | Analyse |
|---|---|
| **Objectif** | Révéler la classe de l'utilisateur |
| **Valeur utilisateur** | ✅ L'animation de révélation est impressionnante — l'utilisateur ressent un moment de **reconnaissance** |
| **Cohérence promesse** | ⚠️ Partielle. L'utilisateur découvre son profil, mais ensuite ? La page enchaîne sur des scores, des missions verrouillées, et un bouton « Accéder à ma Guilde ». **Il manque l'orientation** : que dois-je faire maintenant que je sais que je suis un Builder ? |
| **Action suivante** | « Accéder à ma Guilde & Voir mes missions » → `/dashboard`. Mais le dashboard est un **tableau de bord fonctionnel**, pas un plan d'action personnel |
| **Priorité** | 🟡 **Améliorer** |

---

### 7. Dashboard (`/dashboard`)

| Axe | Analyse |
|---|---|
| **Objectif** | Centre de commande principal |
| **Valeur utilisateur** | L'utilisateur voit : sa classe, son niveau, ses stats, ses missions, sa squad, son check-in, du contenu… **C'est trop.** Le dashboard essaie de tout montrer et ne répond à **aucune question unique**. |
| **Cohérence promesse** | ❌ Le dashboard est conçu comme un **hub de fonctionnalités**, pas comme un **coach personnel**. L'utilisateur doit explorer pour comprendre quoi faire. |
| **Action suivante** | Aucune action claire priorisée. L'utilisateur voit 10 widgets, 3 sections, des cartes, des jauges… mais **quelle est la prochaine meilleure étape ?** |
| **Priorité** | 🟠 **Repenser** |

**Problèmes identifiés :**
- Welcome Modal : montre la classe avec une belle animation, puis enchaîne sur 3 concepts (Missions, Squad, XP & Grades). **L'utilisateur apprend comment fonctionne la plateforme, pas comment il va progresser.**
- Activation Checklist : 4 cases (Quiz, Profil, Squad, Mission). C'est une todo-liste mécanique, pas une **feuille de route personnalisée**.
- Pas de **goal / objectif à 90 jours** affiché
- Les missions recommandées sont dans un carrousel sans contexte personnalisé
- La progression (XP, niveau) est affichée mais sans lien avec un objectif concret
- Les sections « connectivité » (LinkedIn, Twitter, portfolio) sont des distractions pour un nouveau membre
- L'Activity Feed montre l'activité des autres membres — pas prioritaire pour un nouveau

---

### 8. Welcome Modal (post-quiz, first visit)

| Axe | Analyse |
|---|---|
| **Objectif** | Accueillir l'utilisateur après son premier quiz |
| **Valeur utilisateur** | Phase 1 (classe révélée) ✅ — Phase 2 (découverte plateforme) ❌. Après la révélation émotionnelle de la classe, on enchaîne sur « Comment ça marche ? » avec 3 concepts de plateforme. C'est une **descente émotionnelle**. |
| **Cohérence promesse** | ⚠️ La phase 1 tient la promesse (« on m'a compris »), la phase 2 la casse (« on m'explique des fonctionnalités ») |
| **Action suivante** | « Première mission » ou « Guide complet ». Pas de **recommandation personnalisée**, pas de **prochain pas concret**. |
| **Priorité** | 🟡 **Améliorer** |

---

### 9. Missions (`/missions`)

| Axe | Analyse |
|---|---|
| **Objectif** | Lister les missions disponibles |
| **Valeur utilisateur** | Correcte : l'utilisateur voit les missions qu'il peut accomplir |
| **Cohérence promesse** | ⚠️ Les missions sont présentées comme des défis isolés (« Ancrage Initial », « Première Preuve de Maîtrise ») mais sans **contexte de progression globale**. L'utilisateur ne voit pas comment ces missions s'intègrent dans un parcours de transformation. |
| **Action suivante** | Choisir une mission → la réaliser. L'utilisateur comprend le mécanisme mais pas la **direction**. |
| **Priorité** | 🟡 **Améliorer** |

---

### 10. Squad (`/squad`)

| Axe | Analyse |
|---|---|
| **Objectif** | Gérer son équipe |
| **Valeur utilisateur** | Bonne. Le parcours en 6 phases est gamifié et donne un sens de progression. Mais c'est un **parcours parallèle**, pas le parcours principal. |
| **Cohérence promesse** | ✅ L'aspect communautaire tient la promesse d'accompagnement. Mais la squad est présentée comme optionnelle alors qu'elle devrait être un **moyen** (pas une fin). |
| **Action suivante** | Créer/rejoindre une squad, ou progresser dans les 6 phases |
| **Priorité** | 🟢 **Garder tel quel** (améliorations mineures) |

---

### 11. Dossier / Profile (`/dossier`, `/u/[pseudo]`, `/talents`)

| Axe | Analyse |
|---|---|
| **Objectif** | Montrer le portfolio et les compétences |
| **Valeur utilisateur** | Bonne pour un membre avancé — faible pour un nouveau (pas encore de contenu) |
| **Cohérence promesse** | ⚠️ Le dossier est un bon outil de « preuve de progression » mais arrive trop tôt dans le parcours |
| **Priorité** | 🟢 **Garder tel quel** |

---

### 12. Settings (`/settings`)

| Axe | Analyse |
|---|---|
| **Objectif** | Modifier les réglages du compte |
| **Valeur utilisateur** | Utile mais secondaire |
| **Cohérence promesse** | 🟢 Neutre — écran utilitaire |
| **Priorité** | 🟢 **Garder tel quel** |

---

### 13. Guide (`/guide`)

| Axe | Analyse |
|---|---|
| **Objectif** | Documentation complète |
| **Valeur utilisateur** | Bonne — mais 1484 lignes de client component. Trop d'info pour un nouveau membre. |
| **Cohérence promesse** | ⚠️ Un guide utile n'est pas une promesse de transformation |
| **Priorité** | 🟢 **Garder tel quel** (alléger si possible) |

---

### 14. Reviewer, Feedback, Leaderboard, Contact, Team, etc.

Ces pages sont soit utilitaires, soit destinées à des membres avancés. Aucune ne casse la promesse mais aucune ne la porte non plus.

**Priorité** : 🟢 **Garder tel quel** (elles ne sont pas sur le chemin critique)

---

## Synthèse de priorité

| Écran | Priorité | Effort estimé |
|---|---|---|
| Landing Page | 🟠 Repenser | Moyen |
| Beta Access | 🟠 Repenser | Faible |
| Onboarding | 🟡 Améliorer | Moyen |
| Quiz | 🟡 Améliorer | Faible |
| **Post-Quiz (MANQUANT)** | 🔴 **À créer** | Élevé |
| ResultRevelation | 🟡 Améliorer | Moyen |
| Dashboard | 🟠 Repenser | Élevé |
| Welcome Modal | 🟡 Améliorer | Faible |
| Missions | 🟡 Améliorer | Moyen |
| Squad | 🟢 Garder | — |
| Dossier | 🟢 Garder | — |
| Autres | 🟢 Garder | — |

---

## Le trou noir : l'étape Post-Quiz manquante

C'est le **problème numéro 1** de HashCode aujourd'hui.

```
Quiz → [RIEN] → Dashboard
```

Il manque l'étape la plus importante : **l'orientation**.

Actuellement :
1. L'utilisateur finit le quiz
2. Il voit sa classe (émotion ✅)
3. Il voit des scores (intéressant)
4. Il voit des missions verrouillées (frustrant)
5. Il clique « Accéder à ma Guilde »
6. → **Dashboard** : 10 widgets, aucun plan d'action personnalisé

**Ce qui devrait se passer :**

```
Quiz
  ↓
RÉVÉLATION : « Tu es un Builder avec une forte affinité cybersécurité »
  ↓
RAPPORT PERSONNALISÉ : Analyse détaillée de ton profil, de tes forces, de ta spécialisation recommandée
  ↓
OBJECTIF 90 JOURS : « Devenir capable de réaliser ton premier audit de sécurité »
  ↓
PLAN D'ACTION : Atelier recommandé + Mentor + Ressource + Première mission
  ↓
Dashboard (maintenant allégé, centré sur l'objectif)
```

---

## Proposition : Créer une page Post-Quiz « Mon Orientation »

Une nouvelle page à `/orientation` (ou une étape dans le résultat du quiz).

### Structure proposée :

**1. Révélation (déjà existante)** — garder l'animation actuelle

**2. Rapport d'orientation** (nouveau)
- Ton profil dominant : Builder
- Ta spécialisation recommandée : Cybersécurité / Cloud
- Pourquoi cette recommandation ? (liée à ses réponses au quiz + son objectif onboarding)
- Tes points forts identifiés
- Tes axes de progression

**3. Objectif 90 jours** (nouveau)
- « Devenir capable de réaliser ton premier audit de sécurité »
- Avec des milestones : Semaine 1, Mois 1, Mois 3

**4. Premier pas** (nouveau)
- 🎓 Atelier recommandé : « Linux pour la cybersécurité »
- 👨‍🏫 Mentor disponible dans ta spécialisation
- 📚 Ressource de démarrage
- 🎯 Première mission pratique recommandée
- 👥 Groupe de progression (ta Squad potentielle)

**5. CTA unique** : « Commencer mon parcours → » → Dashboard (maintenant centré)

---

## Proposition : Redessiner le Dashboard en tableau de bord personnel

| Aujourd'hui | Demain |
|---|---|
| Bienvenue, [prénom] + message générique | **Objectif actuel** : « Devenir capable de réaliser ton premier audit de sécurité » |
| Missions en carrousel | **Aujourd'hui** : 3 actions prioritaires (atelier, mentor, première mission) |
| Check-in, Weekly Challenge, etc. | **Progression** : barre vers l'objectif 90 jours |
| Activity Feed (autres membres) | **Ressources recommandées** : filtrées par objectif |
| Social links, stats, etc. | **Squad** : liée à l'objectif (optionnel mais encouragé) |

### Règle : sur le dashboard, TOUT doit répondre à la question :
> **« Quelle est la prochaine meilleure étape pour moi ? »**

Si un widget ne répond pas à cette question pour un nouveau membre, il devrait être masqué ou relégué en bas de page.

---

## HashCode Experience Framework (HXF) — Proposition de canevas

Pour chaque écran :

```yaml
Écran: [nom]
Objectif: [pourquoi il existe — 1 phrase]
Question utilisateur: [à quelle question inconsciente répond-il ?]
Valeur apportée: [que gagne l'utilisateur en le quittant ?]
Émotion cible: [curiosité, reconnaissance, confiance, urgence...]
Action suivante: [quelle est la prochaine étape immédiate ?]
Indicateur de succès: [quel métrique prouve que l'écran fonctionne ?]
```

### Application immédiate aux écrans critiques

| Écran | Question utilisateur | Valeur | Émotion | Action suivante |
|---|---|---|---|---|
| Landing | « Qu'est-ce que HashCode va changer dans ma vie ? » | Une promesse de transformation claire | Curiosité + espoir | « Commencer mon diagnostic » |
| Onboarding | « Pourquoi me demandez-vous ça ? » | La sensation que le système me prépare quelque chose de personnalisé | Anticipation | Arriver au quiz |
| Quiz | « Est-ce que ces questions vont vraiment me comprendre ? » | Des questions qui résonnent avec mon vécu | Introspection | Finir le quiz |
| Post-Quiz | « Qui suis-je vraiment ? » | Un miroir précis de mes forces | Reconnaissance | « On m'a compris » |
| Orientation | « Où dois-je aller maintenant ? » | Une direction claire avec un objectif atteignable | Clarté + motivation | « Je sais exactement quoi faire » |
| Dashboard | « Que dois-je faire aujourd'hui ? » | Des actions prioritaires personnalisées | Confiance | Accomplir la première action |

---

## Roadmap stratégique

### Phase 1 — Fondation (la promesse)

**Sprint 1 : Landing Page + Promesse**
- Reformuler le Hero autour de la transformation
- Nouveau tagline : « Découvre ton potentiel. Développe tes compétences. Construis ton avenir. »
- Remplacer « Révéler mon potentiel » par un CTA qui promet une direction
- Supprimer l'aperçu du résultat (gâche la surprise)

**Sprint 2 : Post-Quiz + Orientation**
- Créer l'étape d'orientation après le quiz
- Rapport personnalisé avec recommandation de spécialisation
- Objectif 90 jours
- Plan d'action (atelier, mentor, ressource, mission)

**Sprint 3 : Dashboard centré**
- Masquer les widgets non prioritaires pour les nouveaux membres
- Afficher l'objectif actuel en haut
- 3 actions prioritaires à faire aujourd'hui
- Reléguer l'Activity Feed, les stats sociales, etc. en bas ou dans des onglets secondaires

### Phase 2 — Accompagnement

**Sprint 4 : Ateliers + Mentorat**
- Catalogue d'ateliers liés aux spécialisations
- Matching mentor basé sur le profil et l'objectif
- Calendrier d'ateliers

**Sprint 5 : Parcours d'apprentissage**
- Les missions deviennent des étapes dans un parcours (pas des défis isolés)
- Learning paths par spécialisation
- Suivi de progression visible

### Phase 3 — Écosystème

**Sprint 6 : Squads thématiques**
- Squads recommandées par spécialisation/objectif
- Cohésion = progression collective vers un objectif commun

**Sprint 7 : Portfolio + Opportunités**
- Le dossier devient un portfolio de compétences prouvées
- Mise en relation avec des opportunités (emploi, freelance, projets)

### Phase 4 — Intelligence

**Sprint 8 : CORE (IA)**
- Recommandations adaptatives basées sur l'activité
- Parcours qui évoluent avec l'utilisateur
- Détection de blocage et suggestion proactive

---

## Ce qu'il faut surtout NE PAS faire

1. ❌ **Ne pas repartir de zéro** — la base de données, l'auth, les profils, le quiz sont solides
2. ❌ **Ne pas ajouter des fonctionnalités** — le problème n'est pas un manque de features
3. ❌ **Ne pas refaire tous les écrans** — seul le parcours critique a besoin de changement
4. ❌ **Ne pas négliger l'émotion** — la transformation est vécue, pas expliquée
5. ❌ **Ne pas garder le dashboard actuel** — il détruit la promesse en noyant l'utilisateur

---

## Questions pour valider chaque écran (règle d'or)

1. **Quel problème utilisateur résout cet écran ?**
2. **Contribue-t-il directement à la mission de HashCode ?**
3. **Si on le supprimait aujourd'hui, l'utilisateur le remarquerait-il vraiment ?**
4. **Est-ce que cet écran répond à la question inconsciente « Quelle est la prochaine meilleure étape pour moi ? »**

Si la réponse à la question 3 est **non**, cette fonctionnalité n'est pas prioritaire.
Si la réponse à la question 4 est **non**, cet écran doit être repensé.

---

## Résumé exécutif

HashCode a une base solide : quiz, profils, base de données, auth, rôles, squad. Le problème n'est pas **ce qui existe** mais **ce qui manque entre les morceaux**.

Le trou noir principal : **après le quiz, il n'y a pas d'orientation**.

L'utilisateur découvre son profil mais ne reçoit pas :
- De direction claire (objectif 90 jours)
- De plan d'action personnalisé (atelier, mentor, mission)
- De sentiment de progression immédiate

Le dashboard actuel aggrave le problème en présentant toutes les fonctionnalités sans priorité.

**La solution n'est pas de reconstruire l'app mais de créer l'étape manquante (orientation post-quiz) et de recentrer le dashboard sur l'objectif de l'utilisateur.**

Estimation : **2-3 sprints** pour transformer l'expérience fondamentale sans toucher à l'infrastructure existante.

# Product Vision — HASHCODE

> Document de référence absolue du produit.
> Toute décision d'écran, de feature ou de priorité doit être cohérente avec cette vision.
>
> **❗ Ce document est une constitution. Il ne doit plus évoluer pendant la phase d'implémentation.**
> Les prochains mois servent à exécuter, tester et mesurer, pas à itérer la vision.

---

## Mission

HASHCODE existe pour **révéler le potentiel tech africain** et le transformer en expertise prouvée, via un parcours personnalisé de découverte, d'apprentissage, de validation et d'opportunités.

---

## Transformation promise

| Avant HASHCODE | Après HASHCODE |
|---|---|
| « J'apprends au hasard sans direction claire » | « Je sais exactement quoi apprendre et pourquoi » |
| « Je ne sais pas si je suis fait pour la tech » | « Je connais mes forces et ma spécialisation » |
| « J'apprends seul sans retour » | « Je progresse avec une communauté, des mentors et des projets » |
| « J'ai des compétences mais rien pour le prouver » | « J'ai des preuves validées par des mentors » |
| « Je ne sais pas quoi mettre dans mon portfolio » | « J'ai des projets concrets validés à montrer » |

---

## Les 6 piliers

```
Découverte
    ↓
Orientation
    ↓
Apprentissage
    ↓
Pratique
    ↓
Validation
    ↓
Opportunités
```

### 1. Découverte — « Qui suis-je ? »

Quiz psychométrique → révélation du profil (Builder / Creator / Strategist / Catalyst).

### 2. Orientation — « Où vais-je ? »

Recommandation de spécialisation → choix validé par l'utilisateur → objectif 90 jours → premier plan d'action.

### 3. Apprentissage — « Qu'est-ce que je dois apprendre ? »

Ateliers, ressources, mentorat. Chaque atelier est une **étape d'un parcours**, pas un contenu isolé.

### 4. Pratique — « Comment appliquer ce que j'apprends ? »

Projets, missions, labs, cas réels en équipe. L'application concrète des compétences.

### 5. Validation — « Comment prouver que je maîtrise ? »

Chaque compétence doit être **prouvée** : atelier terminé → projet réalisé → validation mentor → **Evidence** enregistrée.

### 6. Opportunités — « Comment transformer ces compétences en carrière ? »

Portfolio d'evidences, certifications, mise en relation avec des opportunités.

---

## Parcours utilisateur complet

```
Landing
  │
  ▼
[Mini diagnostic — 3 questions — priorité future]
  │
  ▼
Connexion
  │
  ▼
Onboarding (pseudo, niveau, contexte, objectif)
  │
  ▼
Quiz (13 questions psychométriques)
  │
  ▼
Révélation (classe dévoilée avec animation)
  │
  ▼
Choix de spécialisation (système propose → utilisateur valide)
  │
  ▼
Orientation (rapport + objectif 90 jours détaillé + plan d'action)
  │
  ▼
Mon Parcours (ex-Dashboard, centré sur l'objectif)
  │
  ├── Atelier 1  ← première étape du parcours
  ├── Atelier 2
  ├── Projet / Mission
  ├── Validation mentor → Evidence
  ├── …
  └── Objectif suivant (nouvelle boucle)
```

---

## Boucle de progression (l'utilisateur la répète sur plusieurs mois)

```
Objectif
    ↓
Apprendre (atelier, ressource, mentor)
    ↓
Pratiquer (projet, mission, lab)
    ↓
Recevoir du feedback (mentor, pairs)
    ↓
Valider → Evidence enregistrée
    ↓
Débloquer la suite
    ↓
Nouvel objectif (plus avancé)
```

Cette boucle doit être **visible en permanence** sur Mon Parcours.

---

## Objectif 90 jours (structure complète)

```
Objectif

↓

Pourquoi cet objectif ?

↓

Ce que tu sauras faire dans 90 jours

↓

Comment on va y arriver (les étapes)
```

### Exemple — Cybersécurité

**Objectif :** Réaliser ton premier audit de sécurité.

**Pourquoi ?** Parce que cette compétence est la base de tous les métiers de la cybersécurité.

**Dans 90 jours tu seras capable de :**
- Analyser une cible et cartographier ses surfaces d'attaque
- Identifier des vulnérabilités courantes (OWASP Top 10)
- Rédiger un rapport d'audit professionnel

**Les étapes :**
- Semaine 1 : Atelier Linux pour la cybersécurité
- Semaine 2-3 : Atelier OWASP Top 10 + exercices
- Semaine 4-6 : Audit d'une application simple (projet encadré)
- Semaine 7-8 : Rédaction du rapport + validation mentor
- Semaine 9-12 : Audit d'une application réelle en équipe

---

## Evidence (Preuve de compétence)

Le terme **Evidence** est utilisé dans le code et les références internes. Dans l'interface et les communications utilisateur, le terme **Preuve de compétence** est privilégié (ou **Validation** si le contexte est plus large). La première occurrence dans un écran peut afficher : *"Evidence (Preuve de compétence)"* pour familiariser l'utilisateur.

Une compétence n'est pas acquise tant qu'elle n'est pas **prouvée**.

Le chemin de validation :

```
Compétence visée
    ↓
Atelier terminé (acquisition)
    ↓
Projet réalisé (application)
    ↓
Validation mentor (review)
    ↓
Evidence enregistrée dans le portfolio
```

Le portfolio = une collection d'**evidences**, pas une liste de projets.

Chaque evidence contient :
- Compétence validée
- Projet / mission réalisé
- Validation du mentor (avec feedback)
- Date de validation
- Lien vers le livrable

---

## CORE Decision Engine

CORE est le cerveau du produit. Il transforme les données utilisateur en décisions de parcours.

### Entrées

```
Données statiques              Données dynamiques
─────────────────────────────  ─────────────────────────────
Quiz (scores psychométriques)  Progression (ateliers faits)
Onboarding (objectif, niveau)  Historique (projets, validations)
Spécialisation choisie         Feedback (mentor, auto-évaluation)
                               Disponibilité (temps, format)
```

### Traitement

CORE croise ces entrées pour produire des **recommandations contextuelles** à chaque étape de la boucle.

### Décisions produites

```
Prochain atelier       →   Quel atelier est la meilleure étape suivante ?
Nouveau projet         →   Quel projet valide la compétence acquise ?
Mentor recommandé      →   Quel mentor correspond au profil et à l'étape ?
Objectif suivant       →   Quel est le nouveau cap après validation ?
Remédiation            →   L'utilisateur bloque → que lui proposer ?
```

### Principe

CORE n'est pas une collection de règles dispersées. C'est un **moteur unique** qui prend en entrée l'état de l'utilisateur et retourne une **décision unique** : la prochaine meilleure étape.

---

## Vision vs Objectifs

Deux notions distinctes qui ne doivent pas être confondues.

| Vision | Objectif 90 jours |
|---|---|
| « Devenir Architecte Cloud » | « Déployer une application sur AWS » |
| Change rarement (1-3 ans) | Change tous les 90 jours |
| Donne le cap long terme | Donne la cible immédiate |
| Définie par l'utilisateur | Recommandée puis ajustée par CORE |
| Présente dans le portfolio | Présente sur Mon Parcours |

### Hiérarchie

```
Vision (cap long terme)
    ↓
Objectifs 90 jours (jalons)
    ↓
Étapes (ateliers, projets, validations)
```

La vision peut rester la même pendant des mois. Les objectifs évoluent à chaque cycle de la boucle de progression.

---

## Mentorat

Le mentor n'est pas une ressource optionnelle. C'est un **rôle officiel** dans la boucle de progression.

### Rôle du mentor

```
Expliquer    →  Transmet les concepts clés
Challenger   →  Pose des questions, pousse à aller plus loin
Valider      →  Approuve les evidences (compétences prouvées)
Orienter     →  Ajuste le cap si l'utilisateur dévie
```

### Parcours de mentor

Un utilisateur peut devenir mentor après avoir atteint le niveau **Specialist** ou **Mentor** (voir niveaux de maturité). Le mentorat est :
- Une étape de progression (prouver qu'on sait transmettre)
- Une source d'XP et de reconnaissance
- Un maillon essentiel de la validation des compétences

---

## Niveaux de maturité

En complément des niveaux XP (INIT → CORE → PRO → ELITE), les **niveaux de maturité** décrivent le stade de l'utilisateur dans son parcours global.

```
Explorer
    ↓
Learner
    ↓
Practitioner
    ↓
Verified        ←  Première evidence validée
    ↓
Specialist
    ↓
Mentor
```

| Niveau | Déclencheur | Accès |
|---|---|---|
| Explorer | Inscription | Découverte, Orientation |
| Learner | Objectif 90 jours défini | Ateliers, ressources |
| Practitioner | Premier projet terminé | Missions avancées, squad |
| Verified | Première evidence validée | Portfolio publiable |
| Specialist | 3+ evidences dans une spécialisation | Mentorat (en tant que mentoré avancé) |
| Mentor | 5+ evidences + recommandation pairs | Peut valider les evidences des autres |

Le passage de **Practitioner** à **Verified** est le moment clé : l'utilisateur passe de « j'apprends » à « je prouve ».

---

## Architecture systèmes

Le produit est découpé en **6 systèmes**, chacun aligné sur un pilier.

```
Système de Découverte      →   Quiz, profils psychométriques
Système d'Orientation      →   Recommandation, choix, objectif 90 jours
Système d'Apprentissage    →   Ateliers, ressources, mentorat
Système de Pratique        →   Projets, missions, labs
Système de Validation      →   Evidences, mentor review, badges
Système d'Opportunités     →   Portfolio, mise en relation, certifications
```

Chaque système est indépendant mais connecté aux autres via CORE. Cette architecture permet de développer chaque système séparément sans créer de dette transversale.

---

## Règles du produit

1. **Un écran = une question.** Chaque écran répond à UNE seule question utilisateur.
2. **Un écran = une valeur.** Après avoir quitté l'écran, l'utilisateur a gagné quelque chose.
3. **Un écran = une action suivante.** L'utilisateur ne doit jamais se demander quoi faire ensuite.
4. **Un écran = un pas vers l'objectif.** Chaque écran rapproche l'utilisateur de sa transformation.

---

## Anti-patterns

❌ Montrer toutes les fonctionnalités en même temps
❌ Demander à l'utilisateur de choisir quoi faire sans guidance
❌ Afficher des statistiques sans contexte utile
❌ Récompenser sans progression réelle
❌ Vendre des ateliers comme des cours isolés (vendre des étapes de parcours)
❌ Vendre une plateforme au lieu d'une transformation

---

## Proposition de valeur (une phrase)

> HASHCODE révèle ton potentiel, construit ton parcours et valide tes compétences jusqu'à l'opportunité.

---

## Ton des emails

Les emails sont le premier contact durable avec l'utilisateur. Ils doivent **tenir la promesse** à chaque fois.

### Principes

1. **Clarté > Créativité.** L'utilisateur doit comprendre le message en 3 secondes. Pas de métaphores obscures.
2. **Warm > Froid.** On parle à un humain, pas à un agent. « Tu » pas « vous ». Naturel, pas corporate.
3. **Spécifique > Générique.** Chaque email est personnalisé (prénom, profil, spécialisation, objectif, prochaine étape).
4. **Orienté action.** Un seul CTA par email. Jamais « Voir le dashboard ». Toujours « Commencer l'atelier », « Découvrir mon profil », « Voir mon parcours ».
5. **Cohérent avec la boucle.** L'email s'inscrit dans la progression (Apprendre → Pratiquer → Valider), pas à côté.

### Ce qu'on ne fait plus

| Ancien (cyberpunk) | Pourquoi on arrête |
|---|---|
| « Ton signal est actif » | Trop vague. Qu'est-ce que ça veut dire concrètement ? |
| « NEURAL CHECK-IN » | Jargon inutile. On dit « check-in » ou « connexion quotidienne ». |
| « Protocole de Calibration » | Fait peur. On dit « diagnostic » ou « quiz ». |
| « Agent validé » | On n'est pas dans un jeu d'espionnage. |
| « Symbiose Cognitive » | Personne ne parle comme ça. |
| « Dossier Tactique » | On dit « portfolio » ou « parcours ». |
| « Build / Builder » comme verbe/nom universel | On utilise « construire », « développeur », « parcours ». |

### Ce qu'on fait à la place

Les emails parlent de :
- **Ton objectif** — « Tu veux devenir pentester ? Voici la première étape. »
- **Ta progression** — « Cette semaine, tu vas apprendre à… »
- **Tes prochaines actions** — « Commence par l'atelier Linux (45 min). »
- **Ce que tu gagnes** — « Après ce projet, tu sauras auditer une application. »

### Règle d'or pour chaque email

> Si on remplace le prénom par « [Prénom] » et que l'email pourrait être envoyé par n'importe quelle plateforme, il est trop générique. Un bon email HASHCODE est **impossible à envoyer à quelqu'un d'autre**.

---

## Vocabulaire produit

| Ancien terme | Nouveau terme | Pourquoi |
|---|---|---|
| Dashboard | Mon Parcours | Centre sur l'utilisateur, pas sur les stats |
| Mission | Projet / Lab / Sprint | Plus concret, plus orienté réalisation |
| Atelier Linux | Étape 1 de ton parcours Pentester | Vendu comme une étape, pas un cours |
| Compétence | Compétence + Evidence (Preuve de compétence) | Chaque compétence doit être prouvée |
| Quiz | Diagnostic | Plus médical, plus sérieux |
| Features | Systèmes (Découverte, Orientation, etc.) | Décrit le produit comme un écosystème cohérent |
| Carte de membre | Portfolio d'evidences | Montre les compétences prouvées, pas un simple badge |
| Niveau XP | Niveau de maturité (Explorer → Mentor) | Décrit le stade réel de l'utilisateur |
| Mentor (ressource) | Mentor (rôle officiel) | Explique, challenge, valide, oriente |

---

## Ton et personnalité

- **Direct** — pas de jargon inutile
- **Valorisant** — on parle de potentiel, pas de manque
- **Orienté action** — chaque message pousse à l'étape suivante
- **Afro-tech** — fierté de l'écosystème tech africain

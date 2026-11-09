# Admin Vision — HASHCODE Back-Office

> Document de référence absolue du back-office.
> Toute décision d'écran, de module ou de priorité côté administration doit être cohérente avec cette vision.
>
> **❗ Ce document est le pendant de `PRODUCT_VISION.md` pour l'espace administrateur.**
> Il définit la philosophie, l'architecture, les rôles et les responsabilités du Talent Operations Center.

---

## Mission

L'administration HASHCODE existe pour **piloter la progression des talents**, pas pour gérer des données.

L'espace membre répond à :

> *« Comment puis-je progresser ? »*

L'espace administrateur répond à :

> *« Comment aidons-nous chaque membre à progresser, et où devons-nous intervenir ? »*

---

## Transformation promise

| Avant (ancien back-office) | Après (Talent Operations Center) |
|---|---|
| « Je gère des utilisateurs » | « Je pilote des talents » |
| « Je vois des statistiques » | « Je comprends la progression de ma communauté » |
| « J'édite des champs en base » | « J'oriente des parcours, je valide des compétences » |
| « Un seul rôle Admin pour tout » | « Des rôles précis avec des permissions granulaires » |
| « Le back-office est un outil de support » | « Le back-office est un centre de commandement » |
| « Les décisions de CORE sont opaques » | « Les décisions de CORE sont explicables et ajustables » |
| « Je réagis aux problèmes » | « J'anticipe les besoins, je détecte les blocages » |

---

## Les 14 modules

```
🏠 Dashboard
👥 Talents
🧭 Parcours
🎓 Ateliers
📁 Projets
✅ Evidences
👨‍🏫 Mentorat
🆘 Interventions
🧠 CORE Decision Center
📊 Analytics
📚 Contenus
📖 Knowledge Hub
🔔 Notifications
⚙️ Paramètres
```

---

### 1. 🏠 Dashboard — Vue d'ensemble

Le dashboard ne se limite pas à des compteurs. Il répond à :

> **Comment progresse notre communauté ?**

```
📊 Vue d'ensemble

Membres actifs (7 jours)
Quiz terminés
Parcours démarrés
Ateliers suivis (7 jours)
Projets en cours
Evidences validées
Objectifs 90 jours atteints
Mentors actifs
Taux de rétention (J30 / J60 / J90)
```

Chaque métrique est cliquable et ouvre la liste filtrée correspondante.

> **Règle :** Le dashboard doit permettre à l'admin de répondre en 5 secondes à « Qu'est-ce qui se passe aujourd'hui dans ma communauté ? ».

#### Dashboard personnalisé selon le rôle

Le dashboard n'est pas identique pour tous. Chaque rôle voit une vue adaptée à ses responsabilités.

**Product Admin**

```
📊 CORE Decision Center
├── Membres nécessitant une attention
├── Alertes de progression
├── Recommandations en attente de validation
└── Situation des parcours
```

**Academy Admin**

```
🎓 Ateliers
├── Prochains ateliers
├── Participants
├── Projets à review
├── Evidences en attente
└── Certificats à générer
```

**Mentor**

```
👥 Mes mentorés
├── Progression de chaque mentoré
├── Projets soumis pour review
├── Feedback en attente
└── Evidences à valider
```

**Operations / Support**

```
👥 Talents
├── Nouveaux inscrits
├── Membres bloqués
└── Demandes en attente
```

---

### 2. 👥 Talents — Gestion des Talents

Au lieu d'une liste d'utilisateurs, une **fiche de progression** pour chaque membre.

#### Liste

```
Filtres : Statut | Spécialisation | Niveau de maturité | Mentor | Atelier en cours | Date d'inscription

Recherche : nom, email, spécialisation
```

#### Fiche Talent

```
Profil CORE
├── Classe (Builder / Creator / Strategist / Catalyst)
├── Spécialisation choisie
├── Niveau de maturité (Explorer → Learner → … → Mentor)
├── XP / Niveau actuel
├── Date d'inscription
└── Health Score : 92 % (Excellent)

↓

Vue d'ensemble Health Score
├── Progression     ████████░░ 82 %
├── Engagement      ███████░░░ 75 %
├── Ateliers        ██████░░░░ 60 %
├── Projets         ████████░░ 78 %
└── Feedback        █████████░ 90 %

↓

Vision (cap long terme)

↓

Objectif actuel (90 jours avec progression %)

↓

Progression
├── Ateliers complétés
├── Projets réalisés
├── Evidences validées
└── Temps moyen par étape

↓

Ateliers en cours

↓

Projets en cours

↓

Evidences (avec statut : en attente / validée / révision demandée)

↓

Mentor assigné

↓

Historique CORE (décisions passées, recommandations)

↓

Actions rapides
├── Modifier la spécialisation
├── Réaffecter un mentor
├── Valider une evidence (raccourci)
├── Envoyer un message
└── Voir en tant que membre
```

#### Health Score

Chaque membre possède un **Health Score** (0-100 %) qui synthétise sa santé globale dans le parcours. CORE l'utilise pour détecter les risques avant qu'ils ne deviennent des blocages.

```
Health Score = 92 % (Excellent)

Composants :
├── Progression  (40 %) — Avancement dans l'objectif 90 jours
├── Engagement   (25 %) — Régularité des connexions, check-ins
├── Ateliers     (15 %) — Taux de complétion des ateliers
├── Projets      (12 %) — Soumissions et qualité des livrables
└── Feedback     (8 %)  — Retours mentor, auto-évaluation

Seuils :
├── 🔴 Critique      < 40 %  → Intervention requise
├── 🟡 Attention     40-60 % → Surveillance recommandée
├── 🟢 Bon            60-80 % → Progression normale
└── 💎 Excellent     80-100 % → Parcours optimal
```

Toute variation brusque du Health Score (baisse de >15 % en 7 jours) déclenche une alerte dans le **Centre de Notifications** et une suggestion d'intervention dans le module **Interventions**.

---

### 3. 🧭 Parcours — Gestion des Parcours

Chaque spécialisation devient un **parcours structuré** que l'admin peut administrer.

```
Parcours disponibles
├── Cloud
├── Cybersécurité
├── IA / Data
├── Fullstack
├── Mobile
├── Design UI/UX
├── Product Management
└── DevOps
```

#### Structure d'un parcours

```
Spécialisation : Cybersécurité

Objectif final : "Réaliser ton premier audit de sécurité"

Étapes
├── Étape 1 : Atelier Linux pour la cybersécurité
├── Étape 2 : Atelier OWASP Top 10
├── Étape 3 : Projet - Audit d'une application simple
├── Étape 4 : Projet - Audit réel en équipe
└── Étape 5 : Validation mentor → Evidence

Compétences acquises
├── Analyse de surface d'attaque
├── Identification de vulnérabilités OWASP
├── Rédaction de rapport d'audit
└── Tests d'intrusion

Prérequis
Durée estimée totale
```

L'admin peut :
- Modifier l'ordre des étapes
- Ajouter / retirer des ateliers ou projets
- Ajuster les durées
- Définir les prérequis entre étapes
- Activer / désactiver un parcours

---

### 4. 🎓 Ateliers — Gestion des Ateliers

Les ateliers sont le **moteur de l'apprentissage**. L'admin doit pouvoir les administrer finement.

```
Liste des ateliers
├── Titre
├── Parcours associé
├── Mentor assigné
├── Prix (gratuit / payant)
├── Places (illimité / limité)
├── Statut (brouillon / publié / complet / passé)
└── Taux de complétion
```

#### Création / Édition d'un atelier

```
Titre
Description
Objectifs pédagogiques
Parcours associé
Étape dans le parcours (numéro)

Planification
├── Date et heure
├── Durée estimée
├── Format (synchrone / asynchrone / hybride)
└── Lien (Zoom / Google Meet / salle physique)

Capacité
├── Places totales
├── Places disponibles
├── Prix (FCFA)
└── Gratuit (toggle)

Mentor
├── Assigner un mentor
└── Mentor secondaire (optionnel)

Contenu
├── Fichiers / ressources
├── Lien du support
├── Projet associé
└── Compétences visées

Validation
├── Conditions de complétion
├── Certificat généré automatiquement (oui/non)
└── Projet requis pour valider
```

> **Règle :** Un atelier n'est jamais isolé. Il est toujours lié à un parcours et à une étape.

---

### 5. 📁 Projets — Gestion des Projets

```
Liste des projets
├── Titre
├── Parcours associé
├── Spécialisation
├── Difficulté (débutant / intermédiaire / avancé)
├── Statut (brouillon / publié / archivé)
└── Nb de soumissions

Gestion d'un projet
├── Description
├── Consignes
├── Livrables attendus
├── Critères de validation
├── Ressources fournies
├── Durée estimée
└── Compétences validées
```

---

### 6. ✅ Evidences — Gestion des Preuves de Compétence

Module critique. C'est ici que l'admin valide ou demande une révision.

```
Liste des evidences
├── Membre
├── Compétence
├── Projet lié
├── Mentor (celui qui a reviewé)
├── Statut (en attente / validée / révision)
├── Date de soumission
└── Actions (valider / réviser)

Filtres : Statut | Spécialisation | Mentor | Date
```

#### Actions de l'admin

```
Voir l'evidence
├── Compétence visée
├── Projet réalisé (lien vers le livrable)
├── Feedback du mentor
└── Commentaires

Actions
├── ✅ Valider (evidence enregistrée dans le portfolio)
├── 🔄 Demander une révision (avec commentaire obligatoire)
└── ❌ Rejeter (avec motif obligatoire)
```

> **Règle :** Une evidence validée est définitive. Le membre gagne son niveau de maturité supérieur.
> Une demande de révision doit toujours inclure un message constructif.

---

### 7. 👨‍🏫 Mentorat — Gestion des Mentors

```
Liste des mentors
├── Nom
├── Compétences
├── Spécialisation
├── Membres suivis
├── Charge actuelle (nb de mentorés)
├── Disponibilités
├── Taux de réponse
├── Feedback moyen
└── Statut (actif / inactif / en congé)

Fiche mentor
├── Profil complet
├── Evidences du mentor (preuves de ses compétences)
├── Mentorés (liste avec progression)
├── Ateliers animés
├── Evaluations reçues
└── Historique des validations
```

#### Workflow d'assignation

```
Membre a besoin d'un mentor
    ↓
Système détecte un besoin (blocage, nouvel objectif)
    ↓
CORE propose un mentor (selon charge, compétences, affinité)
    ↓
Admin valide ou réaffecte
    ↓
Membre notifié → connexion mentor/mentoré établie
```

---

### 8. 🆘 Interventions — Suivi des Actions Correctives

Toute action humaine sur un membre est historisée pour apprendre ce qui fonctionne.

```
Interventions
├── Membre concerné
├── Type (réassignation mentor, changement objectif, message, nouvel atelier)
├── Déclencheur (blocage détecté, demande membre, alerte CORE)
├── Action effectuée
├── Résultat (en cours / résolu / échec)
├── Date d'ouverture
├── Date de résolution
└── Notes internes
```

#### Workflow

```
Alerte CORE ou admin détecte un problème
    ↓
Création d'une intervention
    ↓
Action (message, réassignation, ajustement)
    ↓
Suivi (J+7 : le problème est-il résolu ?)
    ↓
Clôture et leçon apprise
```

> **Principe :** Chaque intervention est une opportunité d'apprendre ce qui fonctionne réellement pour débloquer un talent. Les patterns d'interventions réussies alimentent CORE.

---

### 9. 🧠 CORE Decision Center

Le cœur de la transparence. L'admin doit comprendre **pourquoi** CORE prend chaque décision.

```
🔍 Rechercher un membre

↓

Décision CORE actuelle
├── Spécialisation recommandée
├── Confiance : 91 %
├── Prochain atelier recommandé
├── Raisonnement
│   ├── Quiz → scores (Builder 82%, Creator 45%, …)
│   ├── Niveau → Débutant
│   ├── Objectif → Cybersécurité
│   └── Progression → Atelier Linux complété
├── Influence
│   ├── Quiz        → 42 %
│   ├── Objectif    → 30 %
│   ├── Historique  → 15 %
│   └── Feedback    → 13 %
└── Historique des décisions
    ├── J0 : Orientation → Cybersécurité (confiance 87 %)
    ├── J15 : Prochain atelier → OWASP Top 10 (confiance 93 %)
    └── J30 : Remédiation → Blocage détecté, proposition mentor
```

#### Actions de l'admin

```
Ajuster une décision
├── Changer la spécialisation recommandée
├── Modifier le prochain atelier
├── Déclencher une remédiation manuelle
└── Laisser un commentaire (pourquoi l'ajustement)

Simuler
├── Entrer des données fictives
├── Voir ce que CORE recommanderait
└── Tester des scénarios (ex: « si ce membre passait le quiz différemment »)
```

> **Principe :** CORE n'est pas une boîte noire. Chaque décision doit être explicable en moins de 10 secondes.

---

### 10. 📊 Analytics & Insights — Cockpit de progression

Deux niveaux : les **chiffres** (Analytics) et les **conclusions** (Insights).

#### Analytics — L'entonnoir de croissance

```
Acquisition
├── Nouveaux inscrits (J7 / J30)
├── Source (Google / GitHub / bouche-à-oreille / …)
└── Taux de conversion inscription → onboarding

↓

Activation
├── Onboarding complété
├── Quiz terminé
├── Spécialisation choisie
└── Taux de complétion onboarding

↓

Orientation
├── Objectif 90 jours défini
├── Premier plan d'action démarré
└── Taux d'abandon avant premier atelier ← ALERTE SI TROP HAUT

↓

Premier atelier
├── Ateliers commencés
├── Ateliers terminés
└── Taux de complétion ateliers

↓

Premier projet
├── Projets démarrés
├── Projets soumis
└── Taux de soumission

↓

Première Evidence
├── Evidences soumises
├── Evidences validées
├── Temps moyen avant première evidence
└── Taux de validation

↓

Objectif atteint
├── Objectifs 90 jours atteints
├── Temps moyen par cycle
└── Taux de passage au cycle suivant
```

En bas du cockpit, un **tableau des alertes** :

```
⚠️ Alertes
├── Membres bloqués (aucune progression depuis 14 jours)
├── Ateliers avec taux de complétion < 30 %
├── Evidences en attente depuis > 7 jours
├── Mentors surchargés (> 10 mentorés)
└── Parcours avec taux d'abandon élevé
```

#### Insights — Les conclusions actionnables

Les données brutes ne suffisent pas. Chaque tendance détectée devient une **conclusion** avec cause probable et recommandation.

```
💡 Insight de la semaine

Le parcours Cloud a perdu 18 % des étudiants
└── Cause probable : Atelier Docker (taux de complétion 34 %)
└── Recommandation : Revoir le format ou le mentor assigné

💡 Insight du mois

Les étudiants avec un mentor terminent 2,4x plus leur parcours
└── Confirmation : Le mentorat est le levier le plus efficace
└── Action : Prioriser l'assignation mentor dès J7

💡 Alerte tendance

Baisse de 12 % du taux de complétion ateliers (M/M)
└── Période : Septembre
└── Hypothèse : Rentrée = baisse d'engagement
└── Comparaison : Même tendance l'année dernière (-15 %)
```

> **Règle :** Chaque insight doit pouvoir être transformé en une **décision** ou une **action**.

---

### 11. 📚 Contenus — CMS Interne

Tout le contenu du produit administrable depuis un seul endroit.

```
Spécialisations
├── Créer / Modifier / Archiver
├── Nom, description, icône, couleur
└── Parcours associé

Objectifs 90 jours
├── Créer / Modifier / Archiver
├── Objectif, description, étapes
├── Associé à une spécialisation
├── Associé à un atelier (optionnel)
├── Associé à un projet (optionnel)
└── Niveau recommandé

Ateliers (voir module Ateliers)

Projets (voir module Projets)

Compétences
├── Créer / Modifier / Archiver
├── Nom, description, spécialisation associée
└── Niveau (débutant, intermédiaire, avancé)

Emails
├── Templates d'emails
├── Déclencheurs (inscription, quiz terminé, evidence validée, …)
└── Éditeur avec variables dynamiques

Playbooks
├── Guides, ressources
├── Parcours mentor
└── Documentation interne
```

---

### 12. 📖 Knowledge Hub — Centre de Connaissances

HashCode devient une **organisation apprenante**. Le Knowledge Hub centralise toute la connaissance opérationnelle : playbooks, standards, templates, décisions architecturales.

```
Knowledge Hub

Playbooks
├── Playbook d'onboarding admin
├── Playbook de validation d'evidence
├── Playbook d'intervention (blocage membre)
├── Playbook de gestion de crise
└── Playbook de passage mentor

Standards
├── Critères de qualité ateliers
├── Grille d'évaluation projets
├── Template de feedback mentor
└── Format des certificates

Templates
├── Email templates (avec variables dynamiques)
├── Certificats (PDF généré)
├── Rapports de progression
└── Fiches de parcours

Guides
├── Guide d'utilisation CORE pour admins
├── Guide du mentor
├── Guide du Product Admin
└── Guide de l'Academy Admin

RFC (Requests for Comments)
├── Propositions de changement
├── Décisions architecturales
└── Historique des décisions

Lessons Learned
├── Post-mortems d'interventions
├── Patterns de réussite
├── Patterns d'échec
└── Recommandations pour CORE
```

> **Principe :** Le Knowledge Hub est le cerveau collectif de l'organisation. Toute connaissance opérationnelle y est documentée, indexée et évolutive.

---

### 13. 🔔 Notifications — Centre de Notifications

L'admin ne doit pas chercher les problèmes. Ce sont les problèmes qui viennent à lui.

```
🔔 Centre de notifications

Alertes actives
├── 🚨 5 membres bloqués (aucune progression depuis 14+ jours)
├── ⚠️ 2 mentors surchargés (> 10 mentorés)
├── ℹ️ 1 atelier complet (Cybersécurité - Niveau 1)
├── ✅ 3 evidences en attente de validation (> 48h)
└── 🆕 Nouveau mentor disponible (IA/Data)

Notifications récentes
├── Hier — Intervention clôturée : Membre X a repris son parcours
├── Hier — CORE a mis à jour 12 recommandations
├── J-2 — L'atelier Docker a atteint 100 % de capacité
└── J-3 — 8 nouveaux inscrits cette semaine
```

#### Configuration des notifications

```
Canaux
├── In-app (centre de notifications)
├── Email (résumé quotidien / hebdomadaire)
└── Mobile (urgences uniquement)

Seuils d'alerte
├── Blocage membre : 14 jours (modifiable)
├── Evidence en attente : 48h (modifiable)
├── Charge mentor max : 10 (modifiable)
└── Taux d'abandon parcours : > 30 % (modifiable)

Règles de silence
├── Ne pas notifier la nuit (22h-7h)
├── Ne pas notifier deux fois pour la même alerte
└── Escalade si alerte non traitée après 24h
```

> **Règle :** L'admin ouvre son interface et sait immédiatement où intervenir. Zéro temps de recherche.

---

### 14. ⚙️ Paramètres — Configuration

```
Paramètres généraux
├── Nom de la plateforme
├── URL
├── Logo
└── Couleurs

Rôles et permissions (voir section dédiée)

Configuration CORE
├── Poids des entrées (Quiz, progression, historique…)
├── Seuils de confiance
├── Règles de remédiation
└── Simulation

Intégrations
├── Email (Resend)
├── Stockage fichiers
├── Paiement
└── Webhooks

Équipe
├── Gérer les admins
├── Inviter un admin
└── Audit log (traçabilité de toutes les actions admin)
```

---

## Rôles et permissions

Un seul rôle « Admin » ne suffit pas. Chaque rôle accède uniquement aux modules pertinents.

| Rôle | Modules accessibles | Responsabilités |
|---|---|---|
| **Super Admin** | Tous les modules | Pilotage global, configuration, gestion des rôles |
| **Product Admin** | Dashboard, Talents, Parcours, Interventions, CORE, Analytics, Notifications | Pilotage de la progression, détection et suivi des blocages, ajustement des recommandations |
| **Academy Admin** | Ateliers, Projets, Evidences, Mentorat, Contenus, Knowledge Hub | Gestion du catalogue pédagogique, affectation mentors, validation, standards qualité |
| **Mentor** | Evidences (en attente), Mentorat (ses mentorés), Notifications (ses alertes) | Review et validation des compétences, suivi des mentorés |
| **QA** | Evidences, Contenus (lecture), Knowledge Hub (lecture) | Vérification qualité avant publication, audits |
| **Operations** | Dashboard, Talents, Interventions, Notifications, Paramètres (limité) | Support, interventions, suivi des blocages, réponses aux alertes |
| **Support** | Talents (lecture), Messages | Support utilisateur, assistance |

### Périmètre par rôle

```
Super Admin       ─── All
Product Admin     ─── Dashboard, Talents, Parcours, Interventions, CORE, Analytics, Notifications
Academy Admin     ─── Ateliers, Projets, Evidences, Mentorat, Contenus, Knowledge Hub
Mentor            ─── Evidences (scope: assigned), Mentorat (scope: own), Notifications (scope: own)
QA                ─── Evidences (read), Contenus (read), Knowledge Hub (read)
Operations        ─── Dashboard (read), Talents, Interventions, Notifications, Paramètres (limited)
Support           ─── Talents (read), Messagerie
```

---

## Workflows critiques

### 1. Validation d'Evidence

```
Membre soumet un projet
    ↓
Mentor review → feedback
    ↓
Admin (Academy) valide ou demande révision
    ↓
Si validé → Evidence enregistrée
    ↓
Membre passe au niveau de maturité supérieur (si seuil atteint)
    ↓
CORE recalcule la prochaine étape
```

### 2. Détection de blocage

```
Membre inactif depuis 14 jours
    ↓
CORE détecte → suggestion de remédiation
    ↓
Admin (Product) examine la situation
    ↓
Actions possibles :
├── Réaffecter un mentor
├── Changer l'objectif
├── Recommander un atelier différent
├── Envoyer un message personnalisé
└── Ajustement CORE
```

### 3. Parcours de mentor

```
Membre atteint niveau Specialist
    ↓
CORE propose le passage Mentor
    ↓
Admin examine les critères (5+ evidences, recommandations pairs)
    ↓
Validation → membre devient Mentor
    ↓
Assignation progressive des mentorés
```

---

## Admin Journeys

Chaque rôle a un parcours typique quand il se connecte. Ces journeys guident la conception des écrans et des enchaînements.

### Journey — Product Admin

```
Connexion
    ↓
Dashboard → Alertes (membres bloqués, evidences en attente)
    ↓
CORE Decision Center → Examiner les recommandations
    ↓
Talents → Membres bloqués identifiés
    ↓
Décision : réaffectation mentor, nouvel objectif, message
    ↓
Intervention créée et suivie
    ↓
Retour au Dashboard → Vérifier l'impact
```

### Journey — Academy Admin

```
Connexion
    ↓
Ateliers → Voir les sessions à venir et passées
    ↓
Participants → Vérifier la présence et la progression
    ↓
Projets → Review des soumissions en attente
    ↓
Evidences → Valider ou demander révision
    ↓
Mentorat → Vérifier la charge des mentors
    ↓
Contenus → Mettre à jour un atelier ou un parcours
```

### Journey — Mentor

```
Connexion
    ↓
Mes mentorés → Liste des membres suivis
    ↓
Projets → Review des livrables soumis
    ↓
Feedback → Écrire des retours individuels
    ↓
Validation → Approuver les evidences de ses mentorés
    ↓
Nouvel objectif → Ajuster le cap avec le mentoré
```

### Journey — Operations

```
Connexion
    ↓
Dashboard → Alertes et nouveaux inscrits
    ↓
Talents → Membres en difficulté
    ↓
Interventions → Suivre les actions en cours
    ↓
Notifications → Répondre aux demandes
    ↓
Support → Messages des membres
```

### Journey — Super Admin

```
Connexion
    ↓
Dashboard → Vue d'ensemble complète
    ↓
Analytics → Insights de la semaine
    ↓
CORE → Audit des décisions et configuration
    ↓
Knowledge Hub → Mise à jour des playbooks
    ↓
Paramètres → Configuration système et rôles
    ↓
Notifications → Alertes non traitées
```

---

## Règles du back-office

1. **Un écran = une action admin.** Chaque écran permet une action claire (valider, assigner, modifier).
2. **Un écran = une décision.** L'admin ne doit jamais hésiter sur ce qu'il doit regarder ou faire.
3. **Visibilité totale en 5 secondes.** L'état de chaque entité (membre, evidence, atelier) doit être évident au premier coup d'œil.
4. **Tout blocage doit être visible.** Si un membre est bloqué depuis 7+ jours, l'admin doit le voir sans avoir à chercher.
5. **Toute action est tracée.** Audit log complet pour chaque validation, assignation, modification.
6. **CORE est transparent.** L'admin peut toujours voir le raisonnement derrière une recommandation.
7. **Les alertes trouvent l'admin, pas l'inverse.** Le centre de notifications est le point d'entrée par défaut.
8. **Le Health Score est le pouls du membre.** Toute alerte est priorisée selon son impact sur le Health Score.

---

## Anti-patterns

❌ Afficher des données brutes sans contexte (liste d'IDs, timestamps seuls)
❌ Demander à l'admin de chercher l'information dans plusieurs écrans
❌ Permettre des actions destructrices sans confirmation
❌ Mélanger les périmètres (un Mentor qui voit tous les membres)
❌ Ignorer les blocages (aucune alerte, aucune vue « membres en difficulté »)
❌ Traiter le back-office comme un CRUD alors que c'est un centre de pilotage
❌ Donner le même dashboard à tous les rôles
❌ Cacher les décisions de CORE (boîte noire)
❌ Attendre qu'un admin découvre un problème par hasard (pas de notifications proactives)
❌ Traiter les interventions comme des tickets sans apprentissage
❌ Avoir un Health Score sans action associée (mesurer sans agir)
❌ Laisser le Knowledge Hub devenir une poubelle documentaire non maintenue

---

## Proposition de valeur (une phrase)

> HASHCODE Admin transforme la gestion d'utilisateurs en pilotage de talents, où chaque décision est éclairée, chaque blocage détecté, et chaque progression mesurée.

---

## Architecture de navigation

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🏠 👥 🧭 🎓 📁 ✅ 👨‍🏫 🆘 🧠 📊 📚 📖 🔔 ⚙️                      │
│ Dashboard · Talents · Parcours · Ateliers · Projets · Evidences    │
│ Mentorat · Interventions · CORE · Analytics · Contenus             │
│ Knowledge Hub · Notifications · Paramètres                         │
│                                                                     │
│ 🔍 Rechercher un talent…                              👤 Super Admin│
└─────────────────────────────────────────────────────────────────────┘
```

La barre de navigation est la même pour tous les rôles, mais les modules non autorisés sont masqués.

---

## Indicateurs Clés de Performance (KPI)

### Pour le Super Admin / Product Admin

| KPI | Cible | Fréquence |
|---|---|---|
| Taux de complétion onboarding | > 80 % | Hebdo |
| Taux de passage à l'objectif 90 jours | > 60 % | Hebdo |
| Taux de complétion ateliers | > 70 % | Hebdo |
| Temps moyen avant première Evidence | < 45 jours | Mensuel |
| Taux de rétention J30 | > 70 % | Mensuel |
| Taux de rétention J90 | > 40 % | Mensuel |
| Evidences en attente > 7 jours | 0 | Quotidien |
| Mentors avec charge > 10 mentorés | 0 | Hebdo |
| Membres bloqués (inactifs 14+ jours) | < 5 % | Hebdo |
| Health Score moyen de la communauté | > 70 % | Hebdo |
| Interventions résolues dans les 7 jours | > 80 % | Hebdo |
| Alertes non traitées après 24h | 0 | Quotidien |

### Pour l'Academy Admin

| KPI | Cible | Fréquence |
|---|---|---|
| Taux de soumission projet / atelier | > 60 % | Hebdo |
| Taux de validation evidence | > 80 % | Hebdo |
| Délai moyen de review evidence | < 48h | Hebdo |
| Satisfaction atelier (feedback membre) | > 4/5 | Par atelier |
| Documentation Knowledge Hub à jour | 100 % avant chaque release | Par release |

---

## Vocabulaire back-office

| Ancien terme | Nouveau terme | Pourquoi |
|---|---|---|
| Utilisateurs | Talents | Chaque membre est un talent en progression, pas un enregistrement |
| Gestion | Pilotage | On pilote la progression, on ne gère pas des données |
| Admin (rôle unique) | Rôles spécifiques | Chaque rôle a un périmètre et des responsabilités claires |
| Validation | Review + Validation | Distinguer la relecture (mentor) de la validation finale (admin) |
| Dashboard stats | Cockpit de progression | Un cockpit permet d'agir, pas seulement de voir |
| Back-office | Talent Operations Center | Reflet de la mission : opérer les talents, pas les données |
| Base de données | Centre de commandement | L'admin commande, il ne navigue pas dans des tables |

---

## Évolution du document

Ce document est un **document de vision**, pas une spécification technique. Il peut évoluer à mesure que le produit mûrit, mais chaque modification doit être alignée avec la mission fondamentale :

> Piloter la progression des talents.

Si une décision back-office ne sert pas cette mission, elle n'a pas sa place dans le produit.

# Checklist de Readiness Bêta & Production — HASHCODE 🚀

Ce document rassemble et structure l'ensemble des parcours utilisateurs, bloquants techniques et priorités fonctionnelles à valider avant le lancement officiel de la bêta privée et le déploiement en production.

---

## ⛔ 1. Les Bloquants Critiques avant Lancement

Ces étapes techniques sont indispensables avant d'inviter les premiers utilisateurs sur l'environnement de production :

- [ ] **Séparation Dev/Prod Supabase** : Configurer deux instances de base de données distinctes pour éviter tout écrasement ou corruption des données de production.
- [ ] **Déploiement du Schéma (`npx prisma db push`)** : S'assurer que le schéma de production intègre la table `ActivityLog` (pour le dashboard admin et l'audit), les colonnes de carte membre, et les champs de protection anti-Sybil.
- [ ] **Variables d'environnement OAuth** : Configurer les identifiants client réels pour **Google** et **GitHub** sur les domaines de production (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`).
- [ ] **Bascule en Modération "Concierge"** : Désactiver temporairement la validation automatique par les pairs (`US-08`) et forcer la validation des missions par les administrateurs via `/admin/submissions` (le système de peer-review nécessite un volume minimal de >10 utilisateurs actifs).

---

## 📋 2. La Checklist des User Stories (EPICS 1 à 6)

Chaque parcours utilisateur doit être testé manuellement en conditions réelles.

### EPIC 1 — Entrée & Onboarding
- [ ] **US-01 — Connexion** : Authentification via Google, GitHub ou Magic Link (Vérifier les redirections de callbacks de production).
- [ ] **US-02 — Onboarding étape 1** : Saisie et validation de la situation actuelle, du pays et des objectifs de l'utilisateur.
- [ ] **US-03 — Quiz psychométrique** : Classification instantanée dans l'un des 4 profils (Builder, Creator, Strategist, Catalyst).
- [ ] **US-04 — Post-quiz** : Saisie des aspirations (rêve, focus, blocage) et redirection vers le lien d'invitation communautaire.

### EPIC 2 — Boucle Cœur (Missions)
- [ ] **US-05 — Découverte** : Affichage des missions adaptées selon la classe et le niveau.
- [ ] **US-06 — Briefing de Mission** : Affichage dynamique des objectifs, livrables, critères d'acceptation et des partenaires complémentaires suggérés (Matchmaking Alpha).
- [ ] **US-07 — Soumission** : Envoi de livrables (liens GitHub, Notion, etc.).
- [ ] **US-08 — Peer Review (XP / Niveau)** : *Suspendue pour la bêta* — Remplacée par la validation administrateur.
- [ ] **US-09 — Dashboard Admin** : Validation/refus des soumissions par les administrateurs et distribution correcte de l'XP.

### EPIC 3 — Social & Escouades
- [ ] **US-10 — Création d'escouade** : Création avec nom unique, validation anti-profanity, et génération automatique de lien d'invitation.
- [ ] **US-11 — Invitation** : Rejoindre une escouade existante via son slug d'invitation.
- [ ] **US-12 — Gestion d'escouade** : Édition des paramètres par le leader.
- [ ] **US-13 — Gamification de groupe** : Évolution de la réputation de l'escouade.

### EPIC 4 — Engagement & Rétention
- [ ] **US-14 — Check-in Quotidien** : Saisie d'une note de check-in d'au moins 20 caractères avec blocage temporel de 20 heures.
- [ ] **US-15 — Activité communautaire** : Flux d'activité des actions clés.
- [ ] **US-16 — Notifications QStash** : Réception des badges, rappels et messages de diffusion.

### EPIC 5 — Profil & Compte
- [ ] **US-17 — Consulter mon dossier** : Visualisation du profil public et graphique radar de Vibrancy.
- [ ] **US-18 — Édition de profil** : Mise à jour des réseaux sociaux (GitHub, LinkedIn, Twitter).
- [ ] **US-19 — Avatar** : Upload et redimensionnement de l'avatar.
- [ ] **US-20 — Carte Membre Digitale** : Rendu et téléchargement de la carte d'identité de développeur.
- [ ] **US-21 — Suppression de compte** : Nettoyage en cascade dans la base de données.
- [ ] **US-22 — Boîte à idées** : Soumission de feedback directement depuis l'application.

### EPIC 6 — Périphérie & Public
- [ ] **US-23 — Espace Reviewer** : Interface de notation pour les soumissions en attente.
- [ ] **US-24 — Guilde communautaire** : Page de hub de la classe d'appartenance.
- [ ] **US-25 — Outils (`/tools`)** : Page d'accès aux outils réservés.
- [ ] **US-26 — Formulaire de contact** : Envoi de messages depuis le site vitrine.
- [ ] **US-27 — Pages légales (CGU / Confidentialité)** : Consentement renforcé et checkbox explicite lors du sign-in.

---

## 🚀 3. Priorités Fonctionnelles des Missions (P1 à P9)

Feuille de route séquentielle pour le déploiement des fonctionnalités associées au moteur de missions :

1. **P1 — Seed des Missions (`Critique`)** : Insertion automatique du jeu de données initial de missions en production.
2. **P2 — Masquer Coming Soon (`Critique`)** : Épurer l'interface des éléments non finalisés pour réduire la friction visuelle.
3. **P3 — Cron de Timeout des Claims (`Critique`)** : Tâche planifiée pour libérer automatiquement les missions réservées mais non soumises après expiration.
4. **P4 — Timeline de Soumission (`Important`)** : Historique visuel pour que l'utilisateur suive l'évolution de son dossier de mission.
5. **P5 — Social Proof sur les Cartes (`Important`)** : Affichage des visages des coéquipiers ayant déjà relevé le défi.
6. **P6 — Rétrospective Optionnelle (`Important`)** : Suppression de l'obligation de saisie post-soumission pour réduire la friction.
7. **P7 — Briefing en Slideover (`Amélioration`)** : Permettre de lire le briefing complet sans quitter la liste principale.
8. **P8 — Visualisation de Progression Core (`Amélioration`)** : Clarification visuelle du parcours de l'utilisateur.
9. **P9 — Missions Quotidiennes (`Long Terme`)** : Système de quêtes quotidiennes à haute rétention.

---

### 📈 La Métrique Unique de la Bêta Privée
Le succès de la bêta privée se mesure à un seul indicateur clé :
> **Le taux de conversion Inscription ➔ 1re mission soumise doit être supérieur ou égal à 40 %**.

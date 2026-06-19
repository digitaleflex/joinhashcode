# Guide des Fonctionnalités : Administrateur HASHCODE 🛡️

Ce document récapitule les outils de contrôle et de pilotage mis à la disposition des administrateurs du système HASHCODE.

## 👥 Gestion des Utilisateurs
*   **Tableau de Bord Global** : Liste complète des agents avec recherche et filtres.
*   **Contrôle des Rôles** : Promouvoir des membres en Admins ou Modérateurs.
*   **Modération** : Bannir ou débannir des comptes avec motif et date d"expiration.
*   **Vue Détaillée** : Accès au dossier complet de chaque utilisateur (XP, Badges, Vibrancy).
*   **Export de Sécurité** : Générer des exports de données utilisateur pour la maintenance ou la conformité.

## 📋 Gestion des Soumissions (Review)
*   **File d"Attente Prioritaire** : Centralisation de toutes les missions en attente de validation.
*   **Validation CORE** : Pouvoir de validation finale sur les missions critiques (niveau CORE/PRO) après la revue par les pairs.
*   **Feedback Admin** : Laisser des instructions précises aux utilisateurs en cas de demande de révision.
*   **Nettoyage Automatique** : Système (Cron) qui libère les missions bloquées par des reviewers inactifs après 48h.

## ⚙️ Maintenance & Système
*   **Sincronisation du Catalogue** : Script de `seed` automatique pour mettre à jour les missions, les défis hebdo et les guildes sans toucher au code.
*   **Surveillance d"Activité** : Rappels automatiques par email envoyés aux agents inactifs (3 jours).
*   **Journal d"Audit Global** : Traçabilité de toutes les actions sensibles (Connexions, modifications de rôle, suppressions).
*   **Migration Non-Destructive** : Outils de transfert de données automatisés pour faire évoluer le schéma de la base de données.

## 📈 Pilotage & Growth
*   **Gestion des Escouades** : Vue d"ensemble sur les organisations créées via Better Auth.
*   **Support Beta** : Interface de gestion des retours utilisateurs (Feedback) pour prioriser la roadmap.
*   **Notifications Système** : Envoyer des alertes globales aux agents via le centre de notifications.

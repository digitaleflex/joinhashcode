# P14 — Contrôle d'Accès Dynamique dans les Escouades

**Priorité :** 🔵 Moyenne  
**Effort estimé :** ~2h  
**Pourquoi c'est important :** Permet de transformer les Escouades (Organizations) en véritables espaces collaboratifs où le chef peut déléguer des tâches (ex: valider des missions d'autres membres).

---

## Contexte

- **Plugin :** `organization()`
- **Addon :** `@better-auth/organization/addons` (pour le RBAC dynamique).
- **Documentation :** [Organization - RBAC](https://better-auth.com/docs/plugins/organization#rbac)

---

## Ce qu'il faut faire

### Étape 1 — Installation

Vérifier si les addons sont nécessaires (souvent inclus dans le plugin de base pour les rôles standards).

### Étape 2 — Définition des permissions d'Escouade

Définir les actions possibles au sein d'une escouade (ex: `invite-member`, `kick-member`, `validate-squad-mission`).

### Étape 3 — UI de gestion des rôles

Dans les paramètres de l'escouade, permettre au propriétaire de changer les rôles des membres.

---

## Critères d'acceptation

- [ ] Les membres d'une escouade ont des permissions différentes selon leur rôle (Owner, Admin, Member).
- [ ] Les actions sensibles sont protégées côté serveur par des checks de rôle d'organisation.

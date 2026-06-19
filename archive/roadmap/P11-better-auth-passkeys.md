# P11 — Implémentation des Passkeys (WebAuthn)

**Priorité :** 🔵 Moyenne  
**Effort estimé :** ~1h  
**Pourquoi c'est important :** Pour une communauté tech comme HASHCODE, les Passkeys (FaceID, TouchID, Windows Hello) offrent l'expérience de connexion la plus moderne, rapide et sécurisée sans aucun mot de passe ni email à attendre.

---

## Contexte

- **Plugin :** `@better-auth/passkey`
- **Documentation :** [Passkeys](https://better-auth.com/docs/plugins/passkey)

---

## Ce qu'il faut faire

### Étape 1 — Installation

`npm install @better-auth/passkey`

### Étape 2 — Configuration Serveur (`lib/auth.ts`)

Ajouter le plugin `passkey()` dans la liste des plugins.

### Étape 3 — Configuration Client (`lib/auth-client.ts`)

Ajouter `passkeyClient()` pour permettre l'enregistrement et la connexion via le navigateur.

### Étape 4 — UI d'enregistrement

Créer une interface dans les paramètres du profil pour permettre à l'utilisateur d'ajouter un Passkey.

### Étape 5 — UI de connexion

Ajouter l'option "Connexion par Passkey" sur la page de login.

---

## Critères d'acceptation

- [ ] Un utilisateur connecté peut enregistrer un Passkey depuis son profil.
- [ ] Un utilisateur déconnecté peut se connecter via son Passkey enregistré.
- [ ] Le système gère correctement les navigateurs non compatibles.

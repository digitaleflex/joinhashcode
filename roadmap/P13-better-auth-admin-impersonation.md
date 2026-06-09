# P13 — Interface d'Impersonation pour l'Admin

**Priorité :** 🔵 Moyenne (Outil Interne)  
**Effort estimé :** ~1h  
**Pourquoi c'est important :** Permet aux administrateurs de se connecter "en tant que" utilisateur pour débugger des problèmes spécifiques ou vérifier l'accès à certaines missions sans changer de compte.

---

## Contexte

- **ACL existante :** Le rôle ADMIN a déjà la permission `impersonate` dans `lib/auth.ts`.
- **Plugin :** `admin()` de Better Auth.
- **Documentation :** [Admin Plugin - Impersonation](https://better-auth.com/docs/plugins/admin#impersonation)

---

## Ce qu'il faut faire

### Étape 1 — Dashboard Admin
Ajouter un bouton "Impersonner" dans la liste des utilisateurs du dashboard admin (`app/admin/users/page.tsx`).

### Étape 2 — Logique d'impersonation
Utiliser `authClient.admin.impersonate({ userId: "..." })`.

### Étape 3 — Feedback visuel
Afficher une bannière persistante quand un admin est en mode impersonation pour éviter toute confusion.

### Étape 4 — Stop Impersonation
Ajouter un bouton pour revenir au compte admin original.

---

## Critères d'acceptation
- [ ] Un admin peut prendre l'identité d'un utilisateur standard.
- [ ] L'admin voit exactement ce que l'utilisateur voit (missions, profil, etc.).
- [ ] L'admin peut quitter le mode impersonation facilement.
- [ ] Sécurité : Un utilisateur standard ne peut JAMAIS utiliser cette fonctionnalité.

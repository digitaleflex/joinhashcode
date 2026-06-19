# P10 — Configuration des Social Providers (Google & GitHub)

**Priorité :** 🟡 Haute  
**Effort estimé :** ~1h (hors config consoles)  
**Pourquoi c'est important :** L'authentification par email/OTP est sécurisée mais peut être perçue comme fastidieuse. L'ajout de Google et GitHub simplifie l'onboarding pour les développeurs et augmente le taux de conversion.

---

## Contexte

- **Configuration existante :** `lib/auth.ts` utilise uniquement Magic Link et Email OTP.
- **Documentation Better Auth :** [Social Providers](https://better-auth.com/docs/concepts/oauth)
- **Variables d'env :** Nécessite `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

---

## Ce qu'il faut faire

### Étape 1 — Configuration des consoles

1. Créer une application sur GitHub Developer Settings.
2. Créer un projet sur Google Cloud Console (OAuth 2.0).
3. Configurer les Redirect URIs : `${BETTER_AUTH_URL}/api/auth/callback/github` et `${BETTER_AUTH_URL}/api/auth/callback/google`.

### Étape 2 — Mise à jour de `lib/auth.ts`

Ajouter les plugins social providers dans la configuration `betterAuth`.

### Étape 3 — Mise à jour de l'UI

Intégrer les boutons "Se connecter avec GitHub/Google" dans `components/auth/signin-form.tsx`.

---

## Critères d'acceptation

- [ ] L'utilisateur peut se connecter avec son compte GitHub.
- [ ] L'utilisateur peut se connecter avec son compte Google.
- [ ] Les comptes sont liés automatiquement si l'email est identique (comportement par défaut de Better Auth à vérifier).
- [ ] L'UI affiche des feedbacks clairs en cas d'erreur OAuth.

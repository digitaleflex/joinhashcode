# SEC-012 — MFA non imposée (staff)

- **Gravité** : 🟡 Moyenne · **Priorité** : P2 · **Statut** : 🔴 OPEN
- **Catégorie** : Authentication Failures (OWASP A07)
- **Fichier** : `lib/auth.ts` (plugins `twoFactor`, `emailOTP`)

## Description

La 2FA est **disponible** mais jamais **imposée**. La connexion par OTP email seule fait reposer la sécurité du compte sur la boîte mail. `changeEmail.enabled: true` est activé sans vérification de changement d'email visible.

## Impact

- Account takeover si la boîte mail est compromise.
- Comptes **ADMIN/MODERATOR** sans 2FA = cible privilégiée (compromission = contrôle plateforme, cf. SEC-003).

## Correctif recommandé

1. **Imposer la 2FA pour tout compte staff** (ADMIN/MODERATOR) : bloquer l'accès `/admin/*` tant que `twoFactorEnabled` est faux (contrôle dans `app/admin/layout.tsx`).
2. Vérifier que le **changement d'email** exige une confirmation sur l'ancienne ET la nouvelle adresse (`sendChangeEmailVerification`).
3. Encourager la 2FA / passkey pour les utilisateurs standards (incitation, pas blocage).

```ts
// app/admin/layout.tsx
if (!dbUser.twoFactorEnabled) redirect("/settings/security?reason=2fa_required");
```

## Critères d'acceptation

- [ ] Un admin sans 2FA ne peut pas accéder à `/admin/*`.
- [ ] Le changement d'email exige une double confirmation.
- [ ] Parcours d'activation 2FA documenté.

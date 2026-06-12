# SEC-003 — MODERATOR possède tous les droits ADMIN

- **Gravité** : 🟠 Élevée · **Priorité** : P0 · **Statut** : ✅ DONE
- **Catégorie** : Broken Access Control (OWASP A01) — escalade verticale staff
- **Fichier** : `lib/auth.ts:68-81, 186-193`

## Description

`MODERATOR` et `ADMIN` sont mappés au **même** `adminRole`, qui inclut `set-role`, `ban`, `delete`, `set-password`, `impersonate` :

```ts
admin({
  adminRoles: ["ADMIN", "MODERATOR"],
  roles: {
    ADMIN: adminRole,
    MODERATOR: adminRole,   // ⚠️ mêmes pouvoirs que ADMIN
    MEMBER: memberRole,
  },
  accessControl: ac,
}),
```

## Impact

Un MODERATOR peut, via les endpoints du plugin admin Better Auth (`/api/auth/admin/*`) :
- **se promouvoir lui-même ADMIN** (`set-role`),
- bannir / supprimer / usurper (`impersonate`) n'importe quel compte,
- réinitialiser des mots de passe (`set-password`).

La distinction Modérateur/Admin est nulle → tout MODERATOR = super-admin de fait.

## Correctif recommandé

Définir un rôle modérateur restreint (pas de `set-role`, `delete`, `set-password`, `impersonate`) :

```ts
const moderatorRole = ac.newRole({
  user: ["list", "ban", "get"],   // modération de base uniquement
  session: ["list", "revoke"],
});

// ...
admin({
  adminRoles: ["ADMIN", "MODERATOR"],
  roles: {
    ADMIN: adminRole,
    MODERATOR: moderatorRole,     // ✅ restreint
    MEMBER: memberRole,
  },
  accessControl: ac,
}),
```

Décider explicitement si un MODERATOR a le droit de `ban` (recommandé : oui, sans `unban` des sanctions admin) mais jamais `set-role`/`delete`/`impersonate`/`set-password`.

## Critères d'acceptation

- [ ] Un MODERATOR ne peut pas appeler `set-role` / `delete` / `set-password` / `impersonate` (403).
- [ ] Un MODERATOR conserve les actions de modération prévues (lister, bannir).
- [ ] Vérifier que les routes `app/api/admin/*` qui acceptent MODERATOR ne donnent pas non plus accès à des actions admin-only.
- [ ] Test : tentative d'auto-promotion MODERATOR → ADMIN refusée.

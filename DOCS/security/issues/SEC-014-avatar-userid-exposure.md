# SEC-014 — Avatars publics exposant l'userId

- **Gravité** : 🟡 Moyenne · **Priorité** : P2 · **Statut** : 🔴 OPEN
- **Catégorie** : Protection des données (RGPD) / IDOR informationnel
- **Fichier** : `app/api/user/avatar/route.ts:40`

## Description

Le nom de fichier d'avatar est `${session.user.id}-${Date.now()}.${ext}` et le fichier est servi statiquement depuis `/uploads/avatars/`. Le nom **expose l'ID utilisateur** et est partiellement devinable.

## Impact

- Corrélation profil ↔ userId via l'URL d'image.
- Énumération/scraping facilité ; pas de contrôle d'accès sur les fichiers statiques.

## Correctif recommandé

Utiliser un identifiant aléatoire non corrélé à l'userId pour le nom de fichier :

```ts
import { randomUUID } from "crypto";
const fileName = `${randomUUID()}.${ext}`;
```

Stocker l'URL en base (déjà fait via `user.image`). Optionnel : supprimer l'ancien avatar lors du remplacement pour éviter l'accumulation.

## Critères d'acceptation

- [ ] Le nom de fichier ne contient plus l'userId.
- [ ] L'avatar reste correctement affiché (URL en base).
- [ ] (Optionnel) Ancien fichier nettoyé au remplacement.

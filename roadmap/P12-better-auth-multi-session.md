# P12 — Gestion Multi-Sessions et Sécurité

**Priorité :** 🟢 Basse  
**Effort estimé :** ~1h30  
**Pourquoi c'est important :** Permettre aux utilisateurs de voir où ils sont connectés et de révoquer des sessions suspectes renforce la confiance dans la plateforme.

---

## Contexte

- **API native :** Better Auth expose des méthodes pour lister et révoquer les sessions d'un utilisateur.
- **Documentation :** [Session Management](https://better-auth.com/docs/concepts/session)

---

## Ce qu'il faut faire

### Étape 1 — Page de Sécurité
Créer `app/settings/security/page.tsx`.

### Étape 2 — Liste des sessions
Utiliser `authClient.listSessions()` pour afficher les sessions actives (appareil, IP, date de connexion).

### Étape 3 — Révocation
Implémenter la possibilité de révoquer une session spécifique ou "toutes les autres sessions".

---

## Critères d'acceptation
- [ ] L'utilisateur voit la liste de ses sessions actives avec des détails lisibles.
- [ ] L'utilisateur peut déconnecter un autre appareil à distance.
- [ ] L'UI est mise à jour immédiatement après une révocation.

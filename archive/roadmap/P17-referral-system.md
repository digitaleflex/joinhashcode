# P17 — Système d'Invitation et Parrainage (Referral)

**Priorité :** 🟡 Haute (P1 Croissance)  
**Effort estimé :** ~3h  
**Pourquoi c'est important :** L'acquisition organique via le cercle de confiance des bâtisseurs est le moteur de croissance le moins coûteux et le plus qualitatif.

---

## Contexte
- **Existant :** Invitations aux Escouades (Squads).
- **Objectif :** Créer un système de parrainage individuel lié au compte utilisateur.

---

## Ce qu'il faut faire

### Étape 1 — Génération de lien
Générer un lien unique par utilisateur : `joinhashcode.com/join?ref=PSEUDO`.

### Étape 2 — Tracking
Lors d'une inscription via ce lien, enregistrer le `referrerId` sur le nouvel utilisateur.

### Étape 3 — Récompense (XP)
Attribuer automatiquement +50 XP au parrain lors de la validation du compte du filleul.

### Étape 4 — UI Dashboard
Afficher le lien d'invitation et le compteur d'invitations réussies dans les paramètres ou sur le dashboard.

---

## Critères d'acceptation
- [ ] Chaque utilisateur a un lien de parrainage unique.
- [ ] L'inscription via le lien est tracée.
- [ ] Le parrain reçoit ses XP immédiatement.

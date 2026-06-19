# P16 — Amélioration du Système de Feedback

**Priorité :** 🔴 Critique (P1 Produit)  
**Effort estimé :** ~1h  
**Pourquoi c'est important :** Comprendre les blocages des premiers utilisateurs bêta est vital pour prioriser les corrections et valider l'UX.

---

## Contexte

- **Existant :** `app/feedback/feedback-form.tsx` permet déjà l'envoi de rapports (BUG, FEATURE, GENERAL) avec pièces jointes.
- **Manquant :** Système de notation (1-5 étoiles) et accessibilité du bouton "Donner mon avis".

---

## Ce qu'il faut faire

### Étape 1 — UI de notation

Ajouter un sélecteur de 1 à 5 étoiles (ou icônes) dans le formulaire de feedback pour mesurer la satisfaction globale.

### Étape 2 — Accessibilité

Ajouter un bouton flottant ou un lien permanent dans le menu/sidebar "Donner mon avis" ou "Signaler un problème".

### Étape 3 — Backend

Mettre à jour le modèle `BetaFeedback` (si nécessaire) pour stocker la note numérique.

---

## Critères d'acceptation

- [ ] L'utilisateur peut noter son expérience sur 5.
- [ ] Le feedback est accessible depuis n'importe quelle page du dashboard.
- [ ] Les admins voient la note moyenne dans leur interface.

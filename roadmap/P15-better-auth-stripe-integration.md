# P15 — Intégration Stripe pour la Monétisation

**Priorité :** 🟢 Basse (Future-proof)  
**Effort estimé :** ~3h  
**Pourquoi c'est important :** Préparer HASHCODE à un modèle "Premium" (missions exclusives, coaching) en liant nativement les abonnements Stripe aux comptes Better Auth.

---

## Contexte

- **Plugin :** `@better-auth/stripe` (ou gestion manuelle via webhooks).
- **Documentation :** [Stripe Integration](https://better-auth.com/docs/plugins/stripe)

---

## Ce qu'il faut faire

### Étape 1 — Configuration Stripe
Créer un compte Stripe et configurer les produits/prix.

### Étape 2 — Intégration Plugin
Ajouter le plugin Stripe à Better Auth pour synchroniser automatiquement le `subscriptionStatus` sur l'objet utilisateur.

### Étape 3 — Checkout UI
Créer une page de tarification et rediriger vers le Stripe Checkout.

### Étape 4 — Accès conditionnel
Protéger certaines routes ou composants en vérifiant `user.subscriptionStatus === "active"`.

---

## Critères d'acceptation
- [ ] L'achat d'un abonnement met à jour le profil utilisateur en temps réel.
- [ ] L'utilisateur peut gérer son abonnement via le portail client Stripe.

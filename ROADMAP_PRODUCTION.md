# ROADMAP DE PRODUCTION — HASHCODE 2026 🚀
*Plan d'action pour transformer le moteur technique en produit fini engageant.*

---

## 📅 SPRINT 1 : ACTIVATION & MOTIVATION (Immédiat)
*Objectif : Garder l'utilisateur dans les 5 premières minutes (J+0).*

### #1 · Barre de Progression XP (Sidebar)
- [x] Créer une fonction de calcul de niveau (L1:0, L2:100, L3:400, L4:1400 XP).
- [x] Calculer le pourcentage de progression vers le prochain niveau.
- [x] Intégrer une barre de progression néon (Cyan) sous l'avatar dans `app-sidebar.tsx`.
- [x] **Critère de succès :** L'utilisateur voit son XP et son grade (Initié, Opérateur...) en permanence.

### #2 · Écran de Révélation Post-Quiz
- [ ] Créer une page de transition `app/quiz/result/page.tsx` (ou modifier l'existante).
- [ ] Ajouter une animation de radar chart (Builder, Creator, etc.).
- [ ] Afficher une description inspirante du profil obtenu.
- [ ] **Critère de succès :** L'utilisateur ressent une validation forte de son identité tech.

### #3 · Checklist d'Activation Dashboard
- [ ] Créer un composant `ActivationChecklist.tsx` avec 3 étapes (Profil, Squad, Mission).
- [ ] Afficher les récompenses XP pour chaque étape complétée.
- [ ] Masquer automatiquement une fois les 3 étapes terminées.
- [ ] **Critère de succès :** Réduction du taux d'abandon post-inscription.

---

## 📅 SPRINT 2 : RÉTENTION & CONFIANCE (Court Terme)
*Objectif : Prouver la valeur et la vitalité de la plateforme.*

### #4 · Feed d'Activité Réel
- [ ] Créer une route API `/api/public/feed` retournant les 10 derniers événements réels.
- [ ] Brancher le composant `ActivityFeed` sur ces données réelles (anonymisées).
- [ ] **Critère de succès :** La landing page montre une activité authentique et récente.

### #5 · Indicateur de Délai de Review
- [ ] Calculer le temps moyen de validation des missions via l'admin.
- [ ] Afficher ce délai sur les fiches missions (ex: "Review habituelle en ~12h").
- [ ] **Critère de succès :** Moins d'anxiété sur le temps d'attente des validations.

### #6 · Emails de Bienvenue Segmentés
- [ ] Configurer 4 templates d'emails Resend (un par profil).
- [ ] Automatiser l'envoi dès la fin du quiz.
- [ ] **Critère de succès :** Taux d'ouverture élevé et clic vers la première mission.

---

## 📅 SPRINT 3 : CROISSANCE & ÉCOSYSTÈME (Moyen Terme)
*Objectif : Créer une communauté autonome.*

### #7 · Messagerie d'Escouade
- [ ] Créer un modèle Prisma `SquadMessage`.
- [ ] Implémenter une interface de chat simple dans la page Squad.
- [ ] **Critère de succès :** Les membres d'une escouade collaborent directement sur l'app.

### #8 · Page Talent (Dossier Public)
- [ ] Ajouter un toggle "Rendre mon profil public" dans les réglages.
- [ ] Créer une vue publique filtrable des talents pour les recruteurs.
- [ ] **Critère de succès :** Première mise en relation talent/opportunité via HASHCODE.

### #9 · Programme de Parrainage
- [ ] Utiliser le `referralCode` existant pour récompenser l'inviteur (+50 XP).
- [ ] Ajouter un badge "Recruteur" pour ceux qui amènent des membres.
- [ ] **Critère de succès :** Croissance organique via le bouche-à-oreille.

---

## 📊 MÉTRIQUES DE RÉUSSITE
- **Activation J+0 :** Passer de 30% à 70% de missions soumises après inscription.
- **Rétention J+7 :** Maintenir 50% des utilisateurs actifs après une semaine.
- **Virale :** Chaque utilisateur invite en moyenne 1.2 nouveaux membres.

# Issues Signalées & Tâches UX / Produit

Ce document récapitule les issues et correctifs locaux identifiés suite aux retours de Steve, Daniella et des audits internes.

> ✅ **ISSUE-023** et **ISSUE-024** ont été résolues et supprimées. Voir [#143](https://github.com/digitaleflex/joinhashcode/issues/143) et [#144](https://github.com/digitaleflex/joinhashcode/issues/144).

## 📌 UX-006 : Audit lisibilité et contraste mobile

### 🎯 Objectif

Optimiser l'accessibilité (WCAG AA) et la lisibilité des textes et cibles tactiles de l'application sur les écrans mobiles.

### 🛠️ Spécifications Techniques

- **Contrastes des couleurs :** Revoir l'utilisation des opacités trop basses (ex: `text-zinc-500` ou `text-muted-foreground` de couleur `#71717a`) sur fonds sombres floutés (`bg-card/60` ou `bg-zinc-950/40`).
- **Navigation mobile :** Ajouter des attributs d'accessibilité ARIA (comme `aria-current="page"` pour le lien actif) dans la barre de navigation basse [BottomNav](file:///c:/Users/PC/Documents/GitHub/hashcode-community/components/dashboard/bottom-nav.tsx).
- **Tailles de texte :** S'assurer que les étiquettes en `9px` ou moins possèdent des alternatives accessibles ou soient légèrement agrandies pour une meilleure lisibilité sous forte luminosité.

### ✅ Critères de Succès

- [ ] Le ratio de contraste pour le texte normal respecte le standard WCAG AA (minimum 4.5:1).
- [ ] La navigation mobile et les boutons principaux disposent d'attributs d'accessibilité corrects pour les lecteurs d'écran.

---

## 📌 PRODUCT-005 : Clarifier la proposition de valeur pour les nouveaux utilisateurs

### 🎯 Objectif

Permettre aux visiteurs non authentifiés de comprendre immédiatement les apports de HASHCODE au-delà du simple quiz de personnalité (squads, missions, évolution, communauté).

### 🛠️ Spécifications Techniques

- **Landing Page :** Ajouter ou enrichir une section détaillant la "Boucle d'Engagement" (le rôle des Guildes, la collaboration en Squads de 5 développeurs, et la progression par paliers d'expérience via l'Evolution Engine).
- **Formulaire d'inscription :** Améliorer la description textuelle sur [SignInForm](file:///c:/Users/PC/Documents/GitHub/hashcode-community/components/auth/signin-form.tsx#L177) pour y faire figurer des bénéfices concrets (ex: "Rejoins une Squad de 5 talents, résous des missions communautaires et propulse ta carrière tech.").

### ✅ Critères de Succès

- [ ] Les nouveaux utilisateurs comprennent la valeur globale de la plateforme avant de démarrer le quiz ou de s'inscrire.
- [ ] Le taux de conversion à l'inscription et au quiz est optimisé grâce à des promesses claires.

# Issues Signalées & Tâches UX / Produit

Ce document récapitule les issues et correctifs locaux identifiés suite aux retours de Steve, Daniella et des audits internes.

---

## 📌 ISSUE-023 : Vérifier le champ Localisation

### 🎯 Objectif
Permettre la saisie et l'affichage complet de la localisation (Ville + Pays) pour chaque utilisateur, et éviter l'affichage systématique de "Localisation non renseignée" sur le Dashboard.

### 🛠️ Spécifications Techniques
* **Formulaire de Paramètres :** Dans [ProfileTab.tsx](file:///c:/Users/PC/Documents/GitHub/hashcode-community/components/settings/tabs/ProfileTab.tsx), ajouter un champ de saisie de texte (`Input`) pour la Ville (`city`) sous le Pays de résidence.
* **API de mise à jour :** La route `/api/user/update` prend déjà en charge le champ `city`, s'assurer que le payload transmis par le formulaire de paramètres l'inclut bien.
* **Rendu du Dashboard :** Dans [dashboard-shell.tsx](file:///c:/Users/PC/Documents/GitHub/hashcode-community/components/dashboard/dashboard-shell.tsx#L319), assouplir la condition pour afficher la localisation si au moins l'un des deux champs (`city` ou `country`) est présent, au lieu d'exiger les deux.
* **Rendu de la Fiche Profil :** Dans [dossier-view.tsx](file:///c:/Users/PC/Documents/GitHub/hashcode-community/components/dossier/dossier-view.tsx#L264), corriger le rendu pour ne pas afficher `UNKNOWN_LOCATION` par défaut si la ville n'est pas renseignée (n'afficher que le pays).

### ✅ Critères de Succès
- [ ] Le champ "Ville" est modifiable depuis les Paramètres du profil et se synchronise en DB.
- [ ] Le Dashboard affiche la ville et/ou le pays dès que l'un d'eux est configuré (ex: "France" ou "Paris, France").
- [ ] Le Dossier n'affiche plus de placeholder technique `UNKNOWN_LOCATION`.

---

## 📌 ISSUE-024 : Erreur "Connexion interrompue" dans Mon Dossier mobile (Priorité Haute)

### 🎯 Objectif
Résoudre le plantage de la page Dossier sur mobile et lors du rendu initial (SSR), qui redirige l'utilisateur vers l'écran d'erreur [error.tsx](file:///c:/Users/PC/Documents/GitHub/hashcode-community/app/dossier/error.tsx).

### 🛠️ Spécifications Techniques
* **Composant en cause :** Le graphique [XPGrowthChart](file:///c:/Users/PC/Documents/GitHub/hashcode-community/components/dashboard/xp-growth-chart.tsx) utilise Recharts (`ResponsiveContainer`, `AreaChart`).
* **Correction SSR / Hydratation :** Mettre en place un état local `isMounted` (via `useState` et `useEffect`) pour empêcher Recharts de tenter de calculer des dimensions côté serveur ou avant la stabilisation du DOM client.
* **Placeholder :** Afficher un squelette de chargement ou un bloc vide stylisé de `200px` pendant que le composant se monte sur le client.

### ✅ Critères de Succès
- [ ] La page `/dossier` se charge sans lever d'exception sur les navigateurs mobiles et les WebViews.
- [ ] Aucune erreur de désynchronisation d'hydratation (mismatch UI) n'est générée en console.

---

## 📌 UX-006 : Audit lisibilité et contraste mobile

### 🎯 Objectif
Optimiser l'accessibilité (WCAG AA) et la lisibilité des textes et cibles tactiles de l'application sur les écrans mobiles.

### 🛠️ Spécifications Techniques
* **Contrastes des couleurs :** Revoir l'utilisation des opacités trop basses (ex: `text-zinc-500` ou `text-muted-foreground` de couleur `#71717a`) sur fonds sombres floutés (`bg-card/60` ou `bg-zinc-950/40`).
* **Navigation mobile :** Ajouter des attributs d'accessibilité ARIA (comme `aria-current="page"` pour le lien actif) dans la barre de navigation basse [BottomNav](file:///c:/Users/PC/Documents/GitHub/hashcode-community/components/dashboard/bottom-nav.tsx).
* **Tailles de texte :** S'assurer que les étiquettes en `9px` ou moins possèdent des alternatives accessibles ou soient légèrement agrandies pour une meilleure lisibilité sous forte luminosité.

### ✅ Critères de Succès
- [ ] Le ratio de contraste pour le texte normal respecte le standard WCAG AA (minimum 4.5:1).
- [ ] La navigation mobile et les boutons principaux disposent d'attributs d'accessibilité corrects pour les lecteurs d'écran.

---

## 📌 PRODUCT-005 : Clarifier la proposition de valeur pour les nouveaux utilisateurs

### 🎯 Objectif
Permettre aux visiteurs non authentifiés de comprendre immédiatement les apports de HASHCODE au-delà du simple quiz de personnalité (squads, missions, évolution, communauté).

### 🛠️ Spécifications Techniques
* **Landing Page :** Ajouter ou enrichir une section détaillant la "Boucle d'Engagement" (le rôle des Guildes, la collaboration en Squads de 5 développeurs, et la progression par paliers d'expérience via l'Evolution Engine).
* **Formulaire d'inscription :** Améliorer la description textuelle sur [SignInForm](file:///c:/Users/PC/Documents/GitHub/hashcode-community/components/auth/signin-form.tsx#L177) pour y faire figurer des bénéfices concrets (ex: "Rejoins une Squad de 5 talents, résous des missions communautaires et propulse ta carrière tech.").

### ✅ Critères de Succès
- [ ] Les nouveaux utilisateurs comprennent la valeur globale de la plateforme avant de démarrer le quiz ou de s'inscrire.
- [ ] Le taux de conversion à l'inscription et au quiz est optimisé grâce à des promesses claires.

# Audit Produit & Expérience Utilisateur (UX)

## 02. Conception, Psychologie & Architecture Fonctionnelle

**Auteurs de l'audit :** Head of Product, UX Strategist, Lead Behavioral Designer

---

### 1. Analyse de l'Architecture Fonctionnelle (Product Manager)

Le produit suit un funnel classique mais extrêmement pertinent pour la cible tech :

1. **Acquisition / Sign-in** -> Better Auth (GitHub/Google/Magic Link).
2. **Onboarding / Profiling** -> Renseignement de la `currentSituation`.
3. **Le Hook (Le Quiz)** -> Classification psychométrique dans une Guilde.
4. **La Boucle Centrale** -> Dashboard (Missions, Évolution, Outils).

**Avertissement sur le MVP vs Overengineering :**
Le risque produit numéro 1 est de vouloir automatiser la validation des "Missions" trop tôt.
_Recommandation :_ Pour le lancement, ne créez pas un système de soumission de code complexe avec CI/CD automatisée. Le MVP doit permettre une soumission simple (lien GitHub, texte, image) validée par les pairs (Peer Review) ou par les modérateurs de guilde. Cela crée de l'interaction humaine et réduit la dette technique initiale.

### 2. Le Hook : Analyse du Quiz Psychométrique (Behavioral Designer)

Le système de typologie (Builder, Creator, Strategist, Catalyst) est un coup de génie psychologique s'il est bien exécuté. L'être humain adore qu'on lui parle de lui-même (Effet Barnum).

**Checklist d'Optimisation du Quiz :**

- [ ] **Pas de mauvaises réponses :** Chaque profil doit valoriser l'utilisateur. Le "Builder" est l'ingénieur robuste, le "Creator" est le designer innovant, le "Strategist" est le leader, le "Catalyst" est le networker.
- [ ] **L'Effet Révélation :** La page de résultat du quiz doit être le moment le plus beau de toute l'application (Animations Framer Motion, effets de particules, sound design si possible).
- [ ] **Shareability :** L'utilisateur DOIT vouloir partager son résultat sur Twitter/LinkedIn. Ex: "Je suis un Builder niveau 1 sur Hashcode. Quel est votre profil ?".

### 3. La Boucle de Rétention & L'Evolution Engine (UX Strategist)

Le moteur d'évolution (Vibrancy, Drift, Confidence) est ambitieux.

**Critique Cognitive :**

- **Vibrancy (Activité) :** Très bien pour l'engagement quotidien. C'est une jauge de "Streak" (comme Duolingo). Attention à la perte de motivation si l'utilisateur perd son streak. Prévoyez un "Streak Freeze" mécanique.
- **Drift (Orientation) :** Intéressant, mais potentiellement complexe à comprendre pour un utilisateur junior. Si c'est trop abstrait, cela sera ignoré. _Recommandation : Traduisez le Drift par un feedback visuel simple (ex: Une boussole qui pointe vers une spécialité)._
- **Confidence (Niveau) :** Classique et efficace.

**Risque de Toxicité :**
La gamification peut créer une "addiction malsaine" ou de l'anxiété de performance.
_Mitigation :_ Valorisez la qualité (Peer reviews positives) plutôt que la seule quantité (faire 100 missions basiques).

### 4. Checklists UX/UI Professionnelles

#### Checklist Interface (Shadcn + Radix)

- [ ] Accessibilité stricte (Contraste des couleurs, support clavier, ARIA tags).
- [ ] Dark Mode natif et parfaitement contrasté (très demandé par les devs).
- [ ] Feedback immédiat sur TOUTES les actions (Sonner toasts pour les succès, chargements avec Skeletons, pas de spinners infinis).
- [ ] Micro-interactions sur les boutons principaux (Framer Motion scale au clic).

#### Checklist Onboarding Funnel

- [ ] Temps de complétion du Sign-in à l'assignation de Guilde : < 3 minutes.
- [ ] Nombre de clics minimum.
- [ ] Éviter de demander des informations inutiles à ce stade (adresse, numéro de téléphone). Ne demandez que ce qui aide à l'assignation de la Guilde.

---

**Verdict Produit :** Potentiel exceptionnel. La friction à l'inscription est le principal risque à court terme ; l'incompréhension du système d'évolution est le principal risque à moyen terme.

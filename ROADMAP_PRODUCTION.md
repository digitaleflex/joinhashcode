# Roadmap Production — HASHCODE

**Statut:** Bêta fonctionnelle (~70%) → Production ready (100%)

---

## Phase 1 — Fondations critiques (semaine 1)

### 1.1 Tests — couverture > 80%

| Zone         | Priorité | Action                                                                        |
| ------------ | -------- | ----------------------------------------------------------------------------- |
| Quiz scoring | Haute    | Tester `lib/analysis.ts` : chaque profil, hybrid detection, consistency score |
| Missions     | Haute    | Tester `lib/missions.ts`, `lib/acceptance-criteria.ts`, scoring XP            |
| Squad        | Haute    | Tester `lib/squad-logic.ts` : cohésion, streaks, badges                       |
| XP & Niveaux | Haute    | Tester `lib/experience.ts`, `lib/level-utils.ts`                              |
| Auth         | Haute    | Tester flux complets : signin, OTP, magic link, 2FA                           |
| Évolution    | Moyenne  | Tester `lib/evolution-engine.ts`                                              |
| Badges       | Moyenne  | Tester `lib/badge-engine.ts` : chaque badge, conditions                       |
| Parrainage   | Moyenne  | Tester `lib/referral.ts` : anti-fraud, rewards                                |

### 1.2 Sécurité — audit & hardening

- [ ] Rate limiting avancé : limiter chaque endpoint sensible par userId + IP
- [ ] Vérifier que toutes les routes API ont leur guard (session / admin / cron)
- [ ] Vérifier l'échappement XSS dans les entrées utilisateur (déjà xss lib)
- [ ] Audit des tokens JWT : durée, rotation, stockage
- [ ] test d'intrusion manuel sur les flux critiques (quiz, missions, squad)
- [ ] Validation CSP headers

### 1.3 Monitoring & Observabilité

- [ ] Intégrer Sentry (ou equivalent) pour les erreurs client et serveur
- [ ] Logger les performances des requêtes lentes ( > 500ms )
- [ ] Dashboard de monitoring uptime (déjà Uptime Kuma sur le VPS)
- [ ] Alertes Discord/Slack sur les erreurs critiques

---

## Phase 2 — Guildes (semaine 2)

### 2.1 Guildes — implémentation complète

Le modèle `Guild` et `GuildMember` existent déjà dans Prisma. Reste à faire :

- [ ] Routes API CRUD pour les guildes
- [ ] Page de découverte des guildes (`/guilds`)
- [ ] Page d'une guilde (`/guild/[slug]`)
- [ ] Composant UI : carte de guilde, liste, recherche/filtre
- [ ] Système de rejoindre/quitter une guilde
- [ ] Dashboard guilde : membres, progression, classement
- [ ] Notifications : invitation, arrivée d'un membre, événements
- [ ] Cohésion de guilde (similaire squad mais à l'échelle)

> **Pourquoi maintenant :** Les guildes sont dans le schema depuis le début mais jamais connectées. C'est le trou le plus visible.

---

## Phase 3 — Fonctionnalités avancées (semaine 2-3)

### 3.1 Défis hebdomadaires

- [ ] Activer le feature flag `weekly_challenges` dans `lib/feature-flags.ts`
- [ ] Finaliser le cycle de reset hebdomadaire
- [ ] UI widget sur le dashboard
- [ ] Notifications de début/fin de cycle

### 3.2 Squad chat avancé

- [ ] Notifications push pour les nouveaux messages
- [ ] Historique paginé avec scroll infini
- [ ] Support des pièces jointes (images, liens)
- [ ] Indicateurs de lecture (vu/non-vu)

### 3.3 Tours interactifs

- [ ] Finaliser les tours définis dans `lib/tours.ts` (Dashboard, Missions, Dossier, Squad, Talents)
- [ ] Déclenchement automatique pour les nouveaux utilisateurs
- [ ] Option "Ne plus montrer"

---

## Phase 4 — Qualité & Performance (semaine 3)

### 4.1 Audit UI/UX responsive

- [ ] Tester tous les écrans sur mobile (320px+), tablette, desktop
- [ ] Vérifier les bottom-nav, sidebar collapse, modales
- [ ] Tester le quiz sur mobile
- [ ] Vérifier les temps de chargement perçus (skeleton states)

### 4.2 Performance

- [ ] Audit Lighthouse (cible : 90+ sur mobile)
- [ ] Stratégie de cache : ISR pour pages publiques, Redis pour sessions
- [ ] Optimisation des images (next/image, sharp déjà présent)
- [ ] Bundle analysis (next/bundle-analyzer)
- [ ] Code-splitting des composants lourds (quiz, résultat, dashboard)

### 4.3 Accessibilité

- [ ] Audit des contrastes (WCAG AA minimum)
- [ ] Labels ARIA sur tous les composants interactifs
- [ ] Navigation au clavier complète
- [ ] Support lecteurs d'écran (formulaires, quiz, dashboard)

---

## Phase 5 — Internationalisation & Finalisation (semaine 4)

### 5.1 i18n

- [ ] Setup next-intl (ou equivalent)
- [ ] Extraire tous les textes dans des fichiers de traduction
- [ ] FR → EN (priorité 1)
- [ ] Sélecteur de langue dans settings
- [ ] Détection automatique de la langue du navigateur

### 5.2 Documentation & Onboarding développeur

- [ ] README à jour avec instructions de setup
- [ ] Documentation API (swagger/openapi — générateur déjà configuré)
- [ ] Guide de contribution

---

## Résumé des estimations

| Phase                        | Effort   | Impact                       |
| ---------------------------- | -------- | ---------------------------- |
| 1 — Fondations critiques     | ~5 jours | 🛡️ Sécurité & confiance      |
| 2 — Guildes                  | ~4 jours | 🏗️ Feature manquante majeure |
| 3 — Fonctionnalités avancées | ~4 jours | 🚀 Engagement & rétention    |
| 4 — Qualité & Performance    | ~3 jours | ⚡ UX & SEO                  |
| 5 — i18n & Documentation     | ~3 jours | 🌍 Portée internationale     |

**Total estimé : ~19 jours ouvrés** pour passer de 70% → 100%.

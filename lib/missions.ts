import { getWeekNumber } from "./dates"

export type MissionLevel = 1 | 2 | 3 | 4;
export type MissionType = "CODE" | "DESIGN" | "BUSINESS" | "NETWORK" | "GENERAL" | "INTRO" | "PRODUCT";
export type UserProfile = "builder" | "creator" | "strategist" | "catalyst";
export type ProgressionLevel = "INIT" | "CORE" | "PRO";

export interface Mission {
  id: string;
  slug?: string;
  title: string;
  description: string;
  shortDesc: string;
  xpReward: number;
  requiredLevel: MissionLevel;
  targetLevel: MissionLevel;
  requirements: string[];
  type: MissionType;
  // Profil Vivant fields
  targetProfiles: UserProfile[];
  missionLevel: ProgressionLevel;
  duration?: string;
  weightBuilder?: number;
  weightCreator?: number;
  weightStrategist?: number;
  weightCatalyst?: number;
  comingSoon?: boolean;
  // Extra DB fields
  deliverables?: string[];
  fullBriefing?: string;
  submissionMethod?: "ANY_LINK" | "TEXT_RESPONSE" | "LIVE_URL" | "DOCUMENT_LINK" | "GITHUB_LINK";
}

export const MISSIONS: Mission[] = [
  {
    id: "mission-01-decouverte",
    title: "Fais connaissance avec HashCode",
    shortDesc: "Ton premier profil HashCode. Comprends qui tu es, ce qui t'intéresse et où tu veux aller.",
    description: "Avant les formations, les challenges et les projets, HashCode veut comprendre qui tu es, ce qui t'intéresse, ce que tu sais déjà faire et où tu aimerais aller. Cette mission construit ton premier profil HashCode.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [],
    type: "INTRO",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "2-3 jours",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Profil HashCode v1 validé"],
  },
  {
    id: "mission-02-de-l-idee-au-projet",
    title: "De l'Idée au Projet",
    shortDesc: "Transforme une intuition en un projet réfléchi, réaliste et défendable.",
    description: "Chaque idée commence par une intuition. Cette mission va t'aider à transformer cette intuition en un projet réfléchi, réaliste et défendable : problème réel, hypothèses vérifiables, stratégie d'exécution et preuves de progression.",
    xpReward: 250,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: ["Recommandé après la Mission 01"],
    type: "BUSINESS",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "3-5 jours",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Dossier projet (3 à 8 pages)"],
  },
  {
    id: "mission-03-du-probleme-a-la-solution",
    title: "Du Problème à la Solution",
    shortDesc: "Concevoir, prototyper et tester une première solution.",
    description: "Une idée analysée reste une hypothèse. Transforme ton problème identifié en solution concrète : reformulation, compréhension utilisateur, conception, prototype V1, tests utilisateurs et itération vers un prototype V2.",
    xpReward: 350,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: ["Recommandé après la Mission 02"],
    type: "PRODUCT",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "5-7 jours",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Dossier de conception", "Prototype V1", "Retours utilisateurs", "Prototype V2"],
  },
  {
    id: "mission-04-ml-fundamentals",
    title: "Fondamentaux IA/ML",
    shortDesc: "Comprends les bases du Machine Learning et entraîne ton premier modèle.",
    description: "L'IA transforme chaque industrie. Cette mission te guide à travers les concepts clés du ML : données, features, entraînement, évaluation. Tu construiras et déployeras un modèle simple (classification ou régression) sur un dataset réel africain (ex: prévision rendements agricoles, détection maladies plantes).",
    xpReward: 400,
    requiredLevel: 2,
    targetLevel: 2,
    requirements: ["Mission 03 recommandée", "Bases Python (pandas, scikit-learn)"],
    type: "CODE",
    targetProfiles: ["builder", "strategist", "creator"],
    missionLevel: "CORE",
    duration: "7-10 jours",
    weightBuilder: 0.4,
    weightCreator: 0.1,
    weightStrategist: 0.3,
    weightCatalyst: 0.2,
    submissionMethod: "GITHUB_LINK",
    deliverables: ["Notebook Jupyter documenté", "Modèle entraîné (fichier .pkl/.joblib)", "Rapport de performance (métriques, matrice confusion)"],
    fullBriefing: `# Mission 04 — Fondamentaux IA/ML

## Contexte & Objectif
L'intelligence artificielle n'est plus un luxe — c'est un levier de transformation pour l'agriculture, la santé, la finance et l'éducation en Afrique. Cette mission te fait passer de "utilisateur d'API" à "créateur de modèles". Tu vas comprendre le cycle de vie complet d'un projet ML et livrer un modèle entraîné, évalué et documenté.

## Dataset au choix (choisis-en UN)
### Option A — Agriculture : Prévision des rendements (Régression)
- **Source** : Données ouvertes FAO / Banque Mondiale / Kaggle "Crop Yield Prediction"
- **Target** : Rendement (tonnes/hectare) pour maïs, riz, mil, sorgho
- **Features** : Précipitations, température, type sol, engrais, région, année
- **Métrique** : MAE / RMSE / R²

### Option B — Santé : Détection maladies plantes (Classification d'images)
- **Source** : PlantVillage Dataset / Kaggle "Plant Disease Classification"
- **Target** : 10+ classes (sain, mildiou, rouille, mosaïque, etc.) sur manioc, maïs, tomate, bananier
- **Approche** : Transfer learning (MobileNetV2 / EfficientNetB0) + fine-tuning
- **Métrique** : Accuracy / F1-macro / Matrice de confusion

### Option C — Finance : Scoring crédit alternatif (Classification binaire)
- **Source** : Données synthétiques inspirées M-Pesa / Orange Money / Findex
- **Target** : Défaut de paiement (0/1) pour micro-crédits
- **Features** : Historique transactions, régularité épargne, réseau social, localisation
- **Métrique** : AUC-ROC / Precision-Recall / Calibration

## Étapes Requises

### 1. Exploration & Nettoyage (Data Understanding)
- Chargement dataset (pandas), analyse descriptive, valeurs manquantes, outliers
- Visualisations : distributions, corrélations, balance des classes
- **Livrable** : Section "Data Exploration" dans le notebook

### 2. Feature Engineering
- Encodage variables catégorielles, scaling, création features temporelles / agrégées
- Split train/val/test **stratifié** (70/15/15) — pas de data leakage !
- **Livrable** : Pipeline de preprocessing reproductible (ColumnTransformer / sklearn Pipeline)

### 3. Modélisation & Entraînement
- **Baseline** : Modèle simple (LogisticRegression / LinearRegression / RandomForest)
- **Itérations** : Comparer 3+ algorithmes (XGBoost, LightGBM, CatBoost, MLP)
- **Validation** : Cross-validation (5-fold) + early stopping
- **Hyperparams** : Optuna / RandomizedSearchCV (budget 30 essais)
- **Livrable** : Cellule "Model Training" avec logging métriques

### 4. Évaluation Rigoureuse
- Métriques métier adaptées (pas juste accuracy !)
- Courbes ROC / PR / Calibration / Learning curves
- Analyse erreurs : faux positifs / faux négatifs — impact business ?
- **Livrable** : Section "Evaluation" + Matrice de confusion annotée

### 5. Interprétabilité & Bias Check
- SHAP values (global + local) — quelles features décident ?
- Vérification biais géographiques / démographiques (fairness)
- **Livrable** : Summary plot SHAP + paragraph "Limitations & Bias"

### 6. Export & Déploiement Léger
- Sauvegarde modèle : \`joblib.dump()\` / \`pickle\` + versioning
- Script \`inference.py\` : charge modèle + prédit sur nouvelle donnée
- (Optionnel) API FastAPI minimaliste \`/predict\` + Dockerfile
- **Livrable** : Modèle \`.pkl\`/.joblib + script inference + README déploiement

## Critères de Validation (Auto-évaluation avant soumission)
- [ ] Notebook **exécutable de bout en bout** (Kernel → Restart & Run All)
- [ ] Code **propre, commenté, typé** (type hints, docstrings)
- [ ] Métriques **supérieures à la baseline** (démontré)
- [ ] **Aucune fuite de données** (test set jamais vu pendant entraînement)
- [ ] Discussion **honnête** des limites (taille dataset, bias, généralisation)
- [ ] README : comment reproduire, requirements.txt / pyproject.toml

## Ressources Recommandées
- **Cours** : "Machine Learning Specialization" (Andrew Ng, Coursera) — Semaines 1-3
- **Livre** : "Hands-On ML with Scikit-Learn, Keras & TensorFlow" (Géron) — Ch. 2, 3, 6
- **Pratique** : Kaggle Micro-courses (Pandas, ML Explainability, Intro to ML)
- **Datasets Afrique** : Zindi Africa, Lacuna Fund, Data Science Nigeria, Ushahidi

## Soumission
**Méthode** : Lien GitHub (repo public ou privé avec accès reviewer)
**Dossier** : \`/mission-04-ml/\` contenant :
\`\`\`
mission-04-ml/
├── notebook.ipynb          # Notebook principal (exécuté)
├── model.pkl               # Modèle entraîné
├── inference.py            # Script prédiction
├── requirements.txt        # Dépendances (pinned versions)
├── README.md               # Reproduction + résultats + limites
└── data/                   # (Optionnel) Échantillon dataset si < 50MB
\`\`\`

## XP & Progression
- **400 XP** à la validation
- Débloque : Mission 07 (Design System), Mission 08 (Business Model)
- Poids profil : Builder 40%, Strategist 30%, Creator 10%, Catalyst 20%
`
  },
  {
    id: "mission-05-devops-ci-cd",
    title: "Pipeline CI/CD Automatisé",
    shortDesc: "Met en place l'intégration et le déploiement continu pour une app full-stack.",
    description: "Le DevOps accélère la livraison. Tu configureras un pipeline complet : build, tests, lint, security scan, déploiement staging/prod sur Kubernetes (K3s) ou serverless (Vercel/Render). Inclut gestion secrets, rollback, monitoring basique.",
    xpReward: 450,
    requiredLevel: 2,
    targetLevel: 2,
    requirements: ["Mission 03 recommandée", "Docker basique", "Git/GitHub Actions ou GitLab CI"],
    type: "CODE",
    targetProfiles: ["builder", "strategist"],
    missionLevel: "CORE",
    duration: "5-7 jours",
    weightBuilder: 0.5,
    weightCreator: 0.1,
    weightStrategist: 0.3,
    weightCatalyst: 0.1,
    submissionMethod: "GITHUB_LINK",
    deliverables: ["Fichier workflow CI/CD (.github/workflows/*)", "App déployée accessible (URL staging)", "Doc architecture pipeline (README)"],
    fullBriefing: `# Mission 05 — Pipeline CI/CD Automatisé

## Contexte & Objectif
Le pipeline CI/CD est l'épine dorsale de tout produit tech sérieux. Cette mission te fait passer d'un projet "qui marche sur ma machine" à un système industrialisé : chaque commit est testé, validé, et déployé automatiquement. Tu vas livrer une app full-stack (front + back + DB) avec un pipeline qui build, teste, scan et déploie en moins de 15 minutes.

## Prérequis Techniques
- [x] Connaître Git (branches, PR, merge, rebase basique)
- [x] Avoir une app full-stack fonctionnelle (Next.js, Node, Python, etc.)
- [x] Docker installé localement
- [x] Compte GitHub/GitLab (pipelines CI gratuits)
- [x] (Optionnel) Cluster K3s OU compte Vercel/Render/Railway/Fly.io

## Architecture Cible

\`\`\`
[Commit] → [CI: Lint + Test + Build + Scan] → [Artifact Registry] → [CD: Deploy Staging] → [Smoke Tests] → [Manual Approval] → [Deploy Prod] → [Healthcheck]
\`\`\`

## Étapes Requises

### 1. Conteneurisation (Docker)
- **Multi-stage Dockerfile** : image finale < 200MB (Alpine, distroless)
- **Docker Compose** pour dev local : app + DB + cache (Redis)
- **Optimisations** : \`.dockerignore\`, layer caching, \`npm ci --frozen-lockfile\`
- **Livrable** : \`Dockerfile\` + \`docker-compose.yml\` + \`docker-compose.prod.yml\`

### 2. Pipeline CI (Intégration Continue)
- **Trigger** : PR + push sur \`main\`
- **Jobs parallèles** :
  - Lint (ESLint, Prettier, mypy/ruff)
  - Tests unitaires + intégration (Jest, Vitest, Pytest)
  - Tests E2E (Playwright headless, au moins 1 spec critique)
  - Build (vérifier que ça compile)
  - **Security scan** : Trivy / Snyk / CodeQL / Gitleaks
- **Cache** : \`actions/cache\` pour node_modules, pip cache, Docker layers
- **Quality gates** : PR bloquée si coverage < 70% ou lint errors
- **Livrable** : \`.github/workflows/ci.yml\` (ou \`.gitlab-ci.yml\`)

### 3. Pipeline CD (Déploiement Continu)
- **Staging automatique** : push \`main\` → déploiement auto
- **Approval manuelle** : promotion vers prod (GitHub Environments)
- **Stratégies** : Blue-Green OU Rolling OU Canary (au moins 1 documenté)
- **Rollback** : Procédure documentée + bouton "Revert" dans GitHub
- **Livrable** : \`.github/workflows/cd.yml\` + runbook \`docs/RUNBOOK.md\`

### 4. Gestion des Secrets
- **Aucun secret en clair** dans le repo (vérifié par Gitleaks)
- Utiliser GitHub Secrets / Vault / Doppler
- **Rotation** : au moins 1 secret rotaté pendant la mission
- **Livrable** : \`SECRETS.md\` listant tous les secrets + où ils sont stockés

### 5. Observabilité Minimaliste
- **Health check** : endpoint \`/api/status\` (DB ping, cache ping)
- **Logs structurés** : JSON (Pino, Winston, structlog)
- **Métriques** : UptimeRobot / BetterStack / Checkly (free tier)
- **Alerte** : 1 canal (Discord webhook ou email) si downtime > 5min
- **Livrable** : Dashboard UptimeRobot + exemples de logs JSON

### 6. Documentation
- **\`README.md\`** : Quick start, architecture, décisions
- **\`docs/ARCHITECTURE.md\`** : diagrammes (ASCII ou Mermaid), flux CI/CD
- **\`docs/RUNBOOK.md\`** : incidents courants + résolution
- **ADR (Architecture Decision Record)** : pourquoi ces choix (K8s vs Vercel, GitHub Actions vs Jenkins)
- **Livrable** : Repo documenté (un dev externe peut cloner et déployer en 30min)

## Critères de Validation
- [ ] **PR demo** : le reviewer peut voir la CI bloquer une PR volontairement cassée
- [ ] **Build time** : < 15 minutes du commit au staging up
- [ ] **Tests E2E** : au moins 1 test critique (login, soumission mission)
- [ ] **Security scan** : 0 vulnérabilités critiques (ou justification documentée)
- [ ] **Secrets** : Gitleaks scan passe en CI
- [ ] **Rollback testé** : au moins 1 rollback réel documenté
- [ ] **URL staging accessible** : reviewer peut tester l'app

## Exemples d'Architecture (Choisis-en UNE)

### Option A — Serverless (le plus simple)
- **Front** : Vercel (Next.js SSR/SSG natif)
- **Back** : Vercel Serverless Functions
- **DB** : Supabase / Neon (Postgres serverless)
- **CD** : Git push → Vercel auto-deploy + PR Preview URLs
- **Secrets** : Vercel Environment Variables
- **Avantage** : 0 infra à gérer, 2h de mise en place

### Option B — Conteneur K3s (le plus pro)
- **VPS** : Hetzner / DigitalOcean (4€-8€/mois)
- **Orchestrateur** : K3s (lightweight K8s)
- **Registry** : GitHub Container Registry (ghcr.io, gratuit)
- **CD** : ArgoCD ou Flux (GitOps)
- **Monitoring** : Uptime Kuma + Prometheus + Grafana
- **Avantage** : Production-grade, courbe d'apprentissage valorisante

### Option C — PaaS (équilibré)
- **App** : Render / Railway / Fly.io
- **DB** : Render Postgres / PlanetScale / Supabase
- **CD** : Push-to-deploy (auto sur push \`main\`)
- **Avantage** : Pas de Docker K8s à gérer, mais on garde le pipeline CI

## Stack Recommandée (projet de référence)
- **App** : Next.js 16 (App Router) + Prisma + PostgreSQL
- **Tests** : Vitest + Playwright
- **Lint** : ESLint + Prettier + TypeScript strict
- **Container** : Docker multi-stage + Compose
- **CI** : GitHub Actions
- **CD** : Vercel (ou auto-deploy Docker via Watchtower)
- **Monitoring** : UptimeRobot (free)

## Soumission
**Méthode** : Lien GitHub (repo public ou privé avec accès)
**Dossier** : \`/mission-05-devops/\` + URL staging opérationnelle
**README** : doit inclure screenshot du pipeline qui passe + URL staging

## XP & Progression
- **450 XP** à la validation
- Débloque : Missions avancées (lvl 3 PRO)
- Poids profil : Builder 50%, Strategist 30%, Creator 10%, Catalyst 10%
`
  },
  {
    id: "mission-06-mobile-first",
    title: "Application Mobile First",
    shortDesc: "Conçois et développe une app mobile React Native/Expo pour un besoin local.",
    description: "Le mobile-first est roi en Afrique. Tu créeras une app responsive (Expo Router) : auth, offline-first (SQLite/AsyncStorage), push notifications, achat in-app ou paiement mobile (Orange Money/MoMo). Focus UX accessible, perfos (bundle size, cold start).",
    xpReward: 500,
    requiredLevel: 2,
    targetLevel: 2,
    requirements: ["Mission 03 recommandée", "React/React Native basique", "TypeScript"],
    type: "CODE",
    targetProfiles: ["builder", "creator"],
    missionLevel: "CORE",
    duration: "10-14 jours",
    weightBuilder: 0.4,
    weightCreator: 0.3,
    weightStrategist: 0.2,
    weightCatalyst: 0.1,
    submissionMethod: "GITHUB_LINK",
    deliverables: ["Repo Expo complet", "Build APK/IPA testable", "Vidéo démo 2 min (screen record)"],
    fullBriefing: `# Mission 06 — Application Mobile First

## Contexte & Objectif
En Afrique, 80% de l'accès internet se fait via mobile — souvent en 3G, avec des forfaits limités et des coupures réseau. Cette mission te fait concevoir une app **mobile-first** pensée pour ce contexte : offline-first, économe en data, performante même sur un Tecno Spark 2 à 30 000 FCFA. Tu livreras une app React Native / Expo complète, installable et testable, avec un cas d'usage réel.

## Use Case au Choix (choisis-en UN)

### Option A — AgriMarket (Marketplace producteur → consommateur)
- **Persona** : Producteur rural qui vend ses récoltes, urbain qui achète
- **Features** : Liste produits (photo, prix, localisation GPS), chat, commande, paiement MoMo/OM
- **Offline** : Cache catalogue, sync différé

### Option B — EduQuiz (Apprentissage gamifié)
- **Persona** : Lycéen qui révise le BAC sur mobile
- **Features** : Quiz, streaks, leaderboard, mode hors-ligne, partage de scores
- **Offline** : Téléchargement de packs de questions

### Option C — HealthTracker (Suivi santé maternelle)
- **Persona** : Femme enceinte en zone rurale, agent de santé
- **Features** : Suivi rendez-vous, rappels vaccins, indicateurs clés, alertes
- **Offline** : Stockage local, sync à la reconnexion

### Option D — Ton idée (avec validation préalable)
- Brief de 1 page (problème, persona, fonctionnalités clés) → soumission pour validation avant démarrage

## Stack Technique Obligatoire
- **Framework** : React Native + **Expo (SDK 50+)** + **Expo Router**
- **Language** : **TypeScript strict** (pas de \`any\` injustifié)
- **State** : Zustand ou Redux Toolkit (pas de useState global)
- **Forms** : React Hook Form + Zod
- **Storage local** : WatermelonDB OU Expo SQLite OU MMKV (PAS AsyncStorage pour données structurées)
- **API** : TanStack Query (React Query) + Axios/Fetch
- **UI** : NativeWind (Tailwind) OU Tamagui OU Gluestack
- **Navigation** : Expo Router (file-based routing)
- **Notifications** : expo-notifications
- **Payments** : expo-iap + (optionnel) Orange Money SDK

## Étapes Requises

### 1. Recherche Utilisateur (Jours 1-2)
- **3-5 entretiens** (même informels, par téléphone) avec ta persona cible
- Documenter : pain points, terminaux utilisés, budget data, usages
- **Livrable** : Document \`research/user-interviews.md\` (3+ entretiens, insights clés)

### 2. Wireframes & Flow (Jours 2-3)
- Wireframes low-fi (Figma, paper, ou Excalidraw) — **tous les écrans**
- User flows principaux (onboarding, feature core, edge cases : offline, erreur)
- Design system minimal : couleurs, typo, spacing (2 fichiers max pour démarrer)
- **Livrable** : Figma link OU dossier \`/wireframes/\` + flow en image

### 3. Setup & Architecture (Jour 3)
- \`npx create-expo-app --template tabs\` + TypeScript template
- Structure dossiers : \`/app\`, \`/components\`, \`/lib\`, \`/hooks\`, \`/types\`
- ESLint + Prettier + Husky pre-commit
- Variables d'env (EXPO_PUBLIC_* pour le front)
- **Livrable** : Repo initial commit + README quickstart

### 4. Implémentation Core Features (Jours 4-8)
- **Auth** : email/password OU magic link (Better Auth, Supabase, Clerk, Firebase)
- **Feature principale** (selon use case) — doit fonctionner end-to-end
- **Offline-first** : la feature core marche SANS réseau
- **Sync** : queue de mutations en attente (TanStack Query persisters)
- **Formulaires validés** (Zod, messages d'erreur clairs)
- **Livrable** : 3+ écrans fonctionnels + offline testé

### 5. UX & Accessibilité (Jours 8-9)
- **i18n** : au moins FR + EN (expo-localization + i18next)
- **Dark mode** : suit les préférences système
- **A11y** : contrastes AA, \`accessibilityLabel\`, support screen reader
- **Loading states** : skeletons, pas de spinners bruts
- **Empty states** : illustration + CTA
- **Erreurs** : messages clairs, action de récupération
- **Livrable** : Check-list WCAG 2.1 AA (au moins 80% respectée)

### 6. Performance & Build (Jours 9-11)
- **Bundle size** : APK < 50MB (EAS Build profile: \`production\`)
- **Cold start** : < 3s sur Android bas de gamme (mesurer avec Flashlight / Performance Monitor)
- **Images optimisées** : expo-image + WebP + cache
- **FlatList optimisée** : keyExtractor, getItemLayout, windowSize
- **Code splitting** : dynamic imports, expo-router lazy routes
- **Livrable** : Build APK avec EAS + screenshot des perfs

### 7. Polish & Documentation (Jours 11-12)
- **Onboarding** : 3 écrans max, skippable
- **Demo data** : compte démo pré-rempli pour reviewer
- **README** : screenshots, GIF animé, instructions build
- **CHANGELOG** : v1.0.0
- **Vidéo démo** : screen record 2min (Loom, screenrecorder natif)
- **Livrable** : Tous les artifacts de soumission

## Critères de Validation
- [ ] **APK installable** : le reviewer peut tester sur son device
- [ ] **Fonctionne offline** : la feature core marche sans réseau
- [ ] **Pas d'erreur console** en dev/prod
- [ ] **TypeScript strict** : \`tsc --noEmit\` passe sans erreur
- [ ] **Bundle < 50MB** : \`eas build -p android --profile production\`
- [ ] **i18n** : au moins 2 langues
- [ ] **A11y** : score Lighthouse > 90 (tester en web preview)
- [ ] **Vidéo démo** : < 2min, montre la feature core + offline
- [ ] **Démo data** : compte de test avec données réalistes

## Resources Recommandées
- **Docs officielles** : docs.expo.dev, reactnavigation.org
- **Templates** : \`expo-router\`, \`nativewind\`, \`supabase\`
- **Outils** : Expo Orbit, EAS CLI, React Native Debugger
- **Communauté** : React Native Discord, Expo Discord, HashCode community

## Soumission
**Méthode** : Lien GitHub + lien EAS Build (ou APK en release)
**Dossier** : \`/mission-06-mobile/\` contenant :
\`\`\`
mission-06-mobile/
├── app/                    # Routes Expo Router
├── components/             # Composants UI
├── lib/                    # Logique métier (API, storage, sync)
├── assets/                 # Images, fonts
├── research/               # Interviews utilisateur
├── wireframes/             # Figma export ou images
├── README.md               # Quick start + screenshots + vidéo
├── app.config.ts           # Config Expo
├── eas.json                # Build profiles
└── CHANGELOG.md            # v1.0.0
\`\`\`

## XP & Progression
- **500 XP** à la validation (XP le plus élevé des missions CORE)
- Débloque : Mission 09+ (niveau PRO), éligibilité beta-tester mobile
- Poids profil : Builder 40%, Creator 30%, Strategist 20%, Catalyst 10%
`
  },
  {
    id: "mission-07-design-system",
    title: "Design System & Accessibilité",
    shortDesc: "Crée un design system cohérent et accessible (WCAG 2.1 AA).",
    description: "Un design system accélère la cohérence. Tu définiras : tokens (couleurs, spacing, typo), composants de base (Button, Input, Card, Modal), thème clair/sombre, tests accessibilité (axe-core, screen readers). Livraison en Figma + Storybook.",
    xpReward: 350,
    requiredLevel: 2,
    targetLevel: 2,
    requirements: ["Mission 03 recommandée", "Figma avancé", "React/Storybook basique"],
    type: "DESIGN",
    targetProfiles: ["creator", "builder"],
    missionLevel: "CORE",
    duration: "7-10 jours",
    weightBuilder: 0.2,
    weightCreator: 0.5,
    weightStrategist: 0.2,
    weightCatalyst: 0.1,
    comingSoon: true,
    submissionMethod: "ANY_LINK",
    deliverables: ["Fichier Figma (tokens + composants)", "Storybook déployé (Chromatic/Vercel)", "Rapport audit accessibilité"],
    fullBriefing: "Disponible prochainement. Inscris-toi à la liste d'attente pour être notifié.",
  },
  {
    id: "mission-08-business-model",
    title: "Business Model & Go-to-Market",
    shortDesc: "Valide ton business model et construis ta stratégie de lancement.",
    description: "Une tech sans business model ne scale pas. Tu utiliseras le Lean Canvas : segments, propositions valeur, canaux, revenue streams, structure coûts, métriques clés. Tu mèneras 10+ entretiens utilisateurs, définiras ton MVP et ton plan d'acquisition (SEO, paid, partenariats, community-led).",
    xpReward: 400,
    requiredLevel: 2,
    targetLevel: 2,
    requirements: ["Mission 02 recommandée", "Notions finance/stratégie"],
    type: "BUSINESS",
    targetProfiles: ["strategist", "catalyst", "creator"],
    missionLevel: "CORE",
    duration: "7-10 jours",
    weightBuilder: 0.1,
    weightCreator: 0.2,
    weightStrategist: 0.5,
    weightCatalyst: 0.2,
    comingSoon: true,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Lean Canvas complet", "Synthèse 10+ entretiens", "Plan GTM 90 jours (objectifs, budget, KPIs)"],
    fullBriefing: "Disponible prochainement. Inscris-toi à la liste d'attente pour être notifié.",
  },
];

export interface WeeklyChallenge {
  id: string;
  title: string;
  shortDesc: string;
  xp: number;
  type: MissionType;
  submissionMethod: Mission["submissionMethod"];
  targetProfiles: UserProfile[];
  weeklySlot: number | null;
}

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: "weekly-code-01",
    title: "API en une semaine",
    shortDesc: "Conçois et déploie une API REST fonctionnelle qui résout un problème réel de ta communauté.",
    xp: 100,
    type: "CODE",
    submissionMethod: "GITHUB_LINK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    weeklySlot: 0,
  },
  {
    id: "weekly-design-01",
    title: "Design d'un écran principal",
    shortDesc: "Crée une maquette haute fidélité d'un écran d'accueil pour une application mobile africaine.",
    xp: 80,
    type: "DESIGN",
    submissionMethod: "ANY_LINK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    weeklySlot: 1,
  },
  {
    id: "weekly-community-01",
    title: "Organise un mini-atelier",
    shortDesc: "Anime un atelier de 30 minutes autour d'un sujet tech et partage le compte-rendu.",
    xp: 120,
    type: "NETWORK",
    submissionMethod: "TEXT_RESPONSE",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    weeklySlot: 2,
  },
  {
    id: "weekly-learn-01",
    title: "Explore un outil IA",
    shortDesc: "Teste un outil ou framework IA, documente ton expérience et partage un retour honnête.",
    xp: 70,
    type: "GENERAL",
    submissionMethod: "TEXT_RESPONSE",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    weeklySlot: 3,
  },
];

export function getCurrentWeeklyChallenge(): WeeklyChallenge | undefined {
  const weekNumber = getWeekNumber(new Date());
  if (WEEKLY_CHALLENGES.length === 0) return undefined;
  return WEEKLY_CHALLENGES[weekNumber % WEEKLY_CHALLENGES.length];
}

export function getCurrentCycleKey(mission?: { isWeeklyChallenge: boolean }): string {
  if (!mission || !mission.isWeeklyChallenge) return "PERMANENT";
  const now = new Date();
  const year = now.getFullYear();
  const week = getWeekNumber(now);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

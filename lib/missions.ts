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
    comingSoon: true,
    submissionMethod: "GITHUB_LINK",
    deliverables: ["Notebook Jupyter documenté", "Modèle entraîné (fichier .pkl/.joblib)", "Rapport de performance (métriques, matrice confusion)"],
    fullBriefing: "Disponible prochainement. Inscris-toi à la liste d'attente pour être notifié.",
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
    comingSoon: true,
    submissionMethod: "GITHUB_LINK",
    deliverables: ["Fichier workflow CI/CD (.github/workflows/*)", "App déployée accessible (URL staging)", "Doc architecture pipeline (README)"],
    fullBriefing: "Disponible prochainement. Inscris-toi à la liste d'attente pour être notifié.",
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
    comingSoon: true,
    submissionMethod: "GITHUB_LINK",
    deliverables: ["Repo Expo complet", "Build APK/IPA testable", "Vidéo démo 2 min (screen record)"],
    fullBriefing: "Disponible prochainement. Inscris-toi à la liste d'attente pour être notifié.",
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

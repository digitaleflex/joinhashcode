export type MissionLevel = 1 | 2 | 3 | 4;
export type MissionType = "CODE" | "DESIGN" | "BUSINESS" | "NETWORK" | "GENERAL" | "INTRO";
export type UserProfile = "builder" | "creator" | "strategist" | "catalyst";
export type ProgressionLevel = "INIT" | "CORE" | "PRO";

export interface Mission {
  id: string;
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
}

export const MISSIONS: Mission[] = [
  // --- MISSIONS GÉNÉRIQUES / INTRO ---
  {
    id: "introduction-ancrage",
    title: "Ancrage Initial",
    shortDesc: "Pose ton identité dans la communauté.",
    description: "Avant toute chose, présente-toi. Qui es-tu, qu'est-ce que tu construis, et où veux-tu aller dans les 3 prochains mois ?",
    xpReward: 25,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Décris ce que tu construis en une phrase.",
      "Partage ton objectif principal pour les 3 prochains mois."
    ],
    type: "INTRO",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25
  },
  {
    id: "social-connection-protocol",
    title: "Protocole de Connexion Globale",
    shortDesc: "Rejoins le réseau neuronal de HASHCODE.",
    description: "La force de HASHCODE réside dans sa communauté. Rejoins nos canaux officiels : Telegram, Discord et WhatsApp.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Rejoindre le canal Telegram @innovcode.",
      "Rejoindre le serveur Discord officiel.",
      "Rejoindre le groupe WhatsApp de ta communauté."
    ],
    type: "NETWORK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25
  },

  // --- BUILDER MISSIONS ---
  {
    id: "b1-first-commit",
    title: "Premier Commit",
    shortDesc: "Prouve ton engagement en partageant ton code.",
    description: "Ton premier test : montre-nous ce que tu construis techniquement.",
    xpReward: 100,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Lien GitHub avec README + description du projet"],
    type: "CODE",
    targetProfiles: ["builder"],
    missionLevel: "INIT",
    duration: "2h",
    weightBuilder: 1.0,
    weightCreator: 0,
    weightStrategist: 0,
    weightCatalyst: 0
  },
  {
    id: "b2-deploy-prod",
    title: "Deploy en production",
    shortDesc: "Rends ton projet accessible au monde.",
    description: "Un code qui n'est pas en ligne n'existe pas. Déploie ton application.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["URL live fonctionnelle + screenshot"],
    type: "CODE",
    targetProfiles: ["builder"],
    missionLevel: "INIT",
    duration: "3h",
    weightBuilder: 1.0,
    weightCreator: 0,
    weightStrategist: 0,
    weightCatalyst: 0
  },
  {
    id: "b3-solve-bug",
    title: "Résoudre un vrai bug",
    shortDesc: "Démontre tes capacités de diagnostic.",
    description: "Identifie et corrige un bug complexe dans un de tes projets ou un projet open source.",
    xpReward: 200,
    requiredLevel: 2,
    targetLevel: 2,
    requirements: ["Lien PR + explication du diagnostic"],
    type: "CODE",
    targetProfiles: ["builder"],
    missionLevel: "CORE",
    duration: "4h",
    weightBuilder: 1.0,
    weightCreator: 0,
    weightStrategist: 0,
    weightCatalyst: 0
  },

  // --- CRÉATEUR MISSIONS ---
  {
    id: "c1-first-publication",
    title: "Première publication",
    shortDesc: "Partage ton univers avec le monde.",
    description: "Publie un contenu original (article, post, vidéo) lié à ton expertise.",
    xpReward: 100,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Lien vers l'article/post/vidéo publiée"],
    type: "DESIGN",
    targetProfiles: ["creator"],
    missionLevel: "INIT",
    duration: "2h",
    weightBuilder: 0,
    weightCreator: 1.0,
    weightStrategist: 0,
    weightCatalyst: 0
  },
  {
    id: "c2-visual-identity",
    title: "Identité visuelle d'un projet",
    shortDesc: "Donne une âme graphique à une idée.",
    description: "Crée le logo, la palette de couleurs et la typographie pour un nouveau projet.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Fichier Figma ou PDF avec logo, couleurs, typo"],
    type: "DESIGN",
    targetProfiles: ["creator"],
    missionLevel: "INIT",
    duration: "4h",
    weightBuilder: 0,
    weightCreator: 1.0,
    weightStrategist: 0,
    weightCatalyst: 0
  },

  // --- STRATÈGE MISSIONS ---
  {
    id: "s1-market-analysis",
    title: "Analyser un marché en 1 page",
    shortDesc: "Identifie les opportunités business.",
    description: "Rédige une analyse concise d'un marché : problème, acteurs, opportunité.",
    xpReward: 100,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Document structuré (problème, acteurs, opportunité)"],
    type: "BUSINESS",
    targetProfiles: ["strategist"],
    missionLevel: "INIT",
    duration: "3h",
    weightBuilder: 0,
    weightCreator: 0,
    weightStrategist: 1.0,
    weightCatalyst: 0
  },
  {
    id: "s2-mvp-definition",
    title: "Définir le MVP d'une idée",
    shortDesc: "Sépare l'essentiel du superflu.",
    description: "Crée la fiche produit de ton idée : problème, cible, 3 features max.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Fiche produit complète"],
    type: "BUSINESS",
    targetProfiles: ["strategist"],
    missionLevel: "INIT",
    duration: "2h",
    weightBuilder: 0,
    weightCreator: 0,
    weightStrategist: 1.0,
    weightCatalyst: 0
  },

  // --- CATALYSEUR MISSIONS ---
  {
    id: "k1-introduction",
    title: "Introduire 2 personnes",
    shortDesc: "Crée de la valeur par la mise en relation.",
    description: "Connecte deux membres de la communauté qui peuvent s'apporter mutuellement.",
    xpReward: 100,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Témoignage des 2 personnes + contexte"],
    type: "NETWORK",
    targetProfiles: ["catalyst"],
    missionLevel: "INIT",
    weightBuilder: 0,
    weightCreator: 0,
    weightStrategist: 0,
    weightCatalyst: 1.0
  },
  {
    id: "k2-organize-event",
    title: "Organiser un événement",
    shortDesc: "Rassemble la communauté.",
    description: "Organise un petit événement (meetup, call, atelier) pour HASHCODE.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Recap avec photos + liste participants"],
    type: "NETWORK",
    targetProfiles: ["catalyst"],
    missionLevel: "INIT",
    duration: "4h",
    weightBuilder: 0,
    weightCreator: 0,
    weightStrategist: 0,
    weightCatalyst: 1.0
  },

  // --- MISSIONS HYBRIDES ---
  {
    id: "h1-solve-real-problem",
    title: "Résoudre un problème réel",
    shortDesc: "Passe de l'idée à la solution concrète.",
    description: "Identifie un problème dans ton environnement et apporte une solution adaptée à ton profil.",
    xpReward: 200,
    requiredLevel: 2,
    targetLevel: 3,
    requirements: ["Preuve de la solution (code, contenu, plan ou mise en relation)"],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25
  }
];

export const XP_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 400,
  4: 1400
};

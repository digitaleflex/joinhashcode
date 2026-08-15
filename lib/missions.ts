import { getWeekNumber } from "./dates"

export type MissionLevel = 1 | 2 | 3 | 4;
export type MissionType = "CODE" | "DESIGN" | "BUSINESS" | "NETWORK" | "GENERAL" | "INTRO";
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
    requirements: ["Avoir validé la Mission 01"],
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

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [];

export function getCurrentWeeklyChallenge(): WeeklyChallenge {
  const weekNumber = getWeekNumber(new Date());
  return WEEKLY_CHALLENGES[weekNumber % WEEKLY_CHALLENGES.length];
}

export function getCurrentCycleKey(mission?: { isWeeklyChallenge: boolean }): string {
  if (!mission || !mission.isWeeklyChallenge) return "PERMANENT";
  const now = new Date();
  const year = now.getFullYear();
  const week = getWeekNumber(now);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

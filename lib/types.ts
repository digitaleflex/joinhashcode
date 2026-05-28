// Hashcode User Profile Types & Enums

export enum UserRole {
  MEMBER = "MEMBER",
  BUILDER = "BUILDER",
  MENTOR = "MENTOR",
  MODERATOR = "MODERATOR",
  OPERATOR = "OPERATOR",
  ADMIN = "ADMIN",
}

export enum TechnicalLevel {
  BEGINNER = "Débutant",
  INTERMEDIATE = "Intermédiaire",
  ADVANCED = "Avancé",
}

export enum UserSituation {
  STUDENT = "Étudiant",
  FREELANCE = "Freelance",
  EMPLOYEE = "Salarié",
  ENTREPRENEUR = "Entrepreneur",
  UNEMPLOYED = "Sans emploi",
  RETRAINING = "Reconversion",
  SELF_TAUGHT = "Autodidacte",
  PROJECT_LEAD = "Porteur de projet",
}

export enum MainObjective {
  FIND_JOB = "Trouver emploi",
  CREATE_SAAS = "Créer SaaS",
  FREELANCE = "Freelance",
  CREATE_STARTUP = "Créer startup",
  CYBERSECURITY = "Cybersécurité",
  MASTER_AI = "Maîtriser IA",
  CLOUD_COMPUTING = "Cloud Computing",
  CREATE_PRODUCTS = "Créer produits digitaux",
}


export const TECHNICAL_DOMAINS = [
  "Web",
  "Cybersecurity",
  "Cloud",
  "IA",
  "Mobile",
  "Data",
  "Automation",
  "UI/UX",
  "DevOps",
] as const;

export const TECHNICAL_TOOLS = [
  "GitHub",
  "VS Code",
  "Docker",
  "Figma",
  "Cursor",
  "ChatGPT",
  "Vercel",
  "Linux",
] as const;

export type TechnicalDomain = typeof TECHNICAL_DOMAINS[number];
export type TechnicalTool = typeof TECHNICAL_TOOLS[number];

export interface UserProfile {
  // Identity
  id: string;
  name: string;
  pseudo?: string;
  email: string;
  image?: string;
  
  // Context Personnel
  country?: string;
  city?: string;
  language: string;
  currentSituation?: UserSituation;

  // Context Technique
  technicalLevel?: TechnicalLevel;
  domains: TechnicalDomain[];
  tools: TechnicalTool[];
  githubUrl?: string;
  portfolioUrl?: string;

  // User Objectives
  mainObjective?: MainObjective;

  // Psychometric Data
  class?: string;
  builderScore: number;
  creatorScore: number;
  strategistScore: number;
  catalystScore: number;

  // Progression
  level: number;
  experience: number;
  missionsCompletedCount: number;
  badges: string[];
}

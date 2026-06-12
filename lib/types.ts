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
  STUDENT = "Étudiant(e)",
  EMPLOYEE = "Salarié(e) / Employé(e)",
  SELF_TAUGHT = "Autodidacte",
  RETRAINING = "En reconversion",
  ENTREPRENEUR = "Entrepreneur / Projet perso",
  FREELANCE = "Freelance / Consultant(e)",
  BEGINNER = "Je commence tout juste",
}

export enum MainObjective {
  FIND_JOB = "Trouver un emploi tech",
  LEARN_CODE = "Apprendre à coder / progresser",
  CREATE_STARTUP = "Lancer un projet / startup",
  FREELANCE = "Faire du freelance",
  MASTER_AI = "Maîtriser l'IA dans mon métier",
  CYBERSECURITY = "Entrer dans la cybersécurité",
  CLOUD_DEVOPS = "Le cloud & DevOps",
  CREATE_PRODUCTS = "Créer des produits digitaux",
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

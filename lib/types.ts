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
  EMPLOYEE = "Salarié(e) du secteur tech",
  SELF_TAUGHT = "Autodidacte / en apprentissage",
  RETRAINING = "En reconversion professionnelle",
  ENTREPRENEUR = "Fondateur / Co-fondateur",
  FREELANCE = "Freelance / Consultant(e)",
  UNEMPLOYED = "À la recherche d'un emploi",
}

export enum MainObjective {
  FIND_JOB = "Trouver un emploi dans la tech",
  LEARN_CODE = "Apprendre les bases de la programmation",
  CREATE_STARTUP = "Lancer mon projet / entreprise",
  FREELANCE = "Devenir freelance / indépendant(e)",
  MASTER_AI = "Se spécialiser en intelligence artificielle",
  CYBERSECURITY = "Se lancer dans la cybersécurité",
  CLOUD_DEVOPS = "Explorer le Cloud & DevOps",
  CREATE_PRODUCTS = "Créer des solutions digitales",
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
  "Linux",
] as const;

export type TechnicalDomain = typeof TECHNICAL_DOMAINS[number];
export type TechnicalTool = typeof TECHNICAL_TOOLS[number];

export interface BehavioralVitality {
  builder: number;
  creator: number;
  strategist: number;
  catalyst: number;
}

export interface BehavioralVibrancy {
  builder: number;
  creator: number;
  strategist: number;
  catalyst: number;
}

export interface UserProfile {
  // Identity
  id: string;
  name: string;
  pseudo?: string | null;
  email: string;
  image?: string | null;
  role: string;
  
  // Context Personnel
  country?: string | null;
  city?: string | null;
  language: string;
  currentSituation?: UserSituation | string | null;

  // Context Technique
  technicalLevel?: TechnicalLevel | string | null;
  domains: string[];
  tools: string[];
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;

  // User Objectives
  mainObjective?: MainObjective | string | null;

  // Psychometric Data & Evolution
  class: string | null;
  experience: number;
  level: number;
  missionsCompletedCount: number;
  confidenceScore: number;
  builderScore: number;
  creatorScore: number;
  strategistScore: number;
  catalystScore: number;
  behavioralVibrancy?: BehavioralVibrancy | any;
  lastCheckin: Date | string | null;
  currentStreak: number;

  // Metadata
  memberNumber: number;
  createdAt: Date;
  referralCode?: string | null;
  referralCount: number;
  betaKeyId?: string | null;
  twoFactorEnabled?: boolean;
  badges: string[];
  bio?: string | null;
}

export interface DetailedMissionSubmission {
  id: string;
  missionId: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_REVISION" | "IN_REVIEW";
  content: string;
  createdAt: Date;
  updatedAt: Date;
  xpAwarded?: number | null;
  adminFeedback?: string | null;
  qualityLevel?: "STANDARD" | "HIGH" | "EXEMPLARY" | null;
  mission: {
    title: string;
    category: string;
    slug: string;
  };
}

// Onboarding flow
export enum OnboardingStep {
  WELCOME = 0,
  PSEUDO = 1,
  LEVEL = 2,
  CONTEXT = 3,
  OBJECTIVE = 4,
  BRIDGE = 5,
}

export interface OnboardingSessionUser {
  id: string
  name: string
  email: string
  image?: string | null
  pseudo?: string | null
  technicalLevel?: string | null
  country?: string | null
  currentSituation?: string | null
  mainObjective?: string | null
  class?: string | null
}

export interface AuthClient {
    signIn: any;
    signUp: any;
    signOut: any;
    useSession: any;
    getSession: () => Promise<any>;
    listSessions: () => Promise<{ data: any[] | null, error: any }>;
    revokeSession: (args: { token: string }) => Promise<{ error: any }>;
    revokeOtherSessions: () => Promise<{ error: any }>;
    $Infer: {
        Session: any;
    };
    organization: {
        acceptInvitation: (args: { invitationId: string }) => Promise<{ error: any }>;
        rejectInvitation: (args: { invitationId: string }) => Promise<{ error: any }>;
        inviteMember: (args: { email: string, role: string }) => Promise<{ error: any }>;
        listInvitations: () => Promise<{ data: any[] | null, error: any }>;
    };
    twoFactor: {
        enable: (args: { password?: string }) => Promise<{ data: { totpURI: string, backupCodes: string[] } | null, error: any }>;
        verifyTotp: (args: { code: string, trustDevice?: boolean }) => Promise<{ error: any }>;
        disable: (args: { password?: string }) => Promise<{ error: any }>;
    };
    admin: {
        stopImpersonating: () => Promise<any>;
        setRole: (args: { userId: string, role: string }) => Promise<any>;
        banUser: (args: { userId: string, banReason?: string, expiresAt?: Date }) => Promise<any>;
        unbanUser: (args: { userId: string }) => Promise<any>;
        impersonate: (args: { userId: string }) => Promise<any>;
    };
    passkey: {
        addPasskey: () => Promise<{ error: any }>;
        deletePasskey: (args: { id: string }) => Promise<{ error: any }>;
        useListPasskeys: () => { data: any[] | null; isPending: boolean };
    };
    emailOtp: {
        sendVerificationOtp: (args: { email: string, type: string }) => Promise<{ error: any }>;
    };
}

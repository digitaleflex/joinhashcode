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

  // Specialization System
  primaryDomain?: string | null;
  subDomain?: string | null;
  learningTools?: string[];
  practiceMode?: string | null;
  certifications?: string[];
  specializationAt?: string | null;

  // Psychometric Data & Evolution
  class: string | null;
  experience: number;
  level: number;
  missionsCompletedCount: number;
  builderScore: number;
  creatorScore: number;
  strategistScore: number;
  catalystScore: number;
  j7Activated: boolean; // J+7 activation: validated >= 3 of 5 M01 sub-missions in 7 days
  behavioralVibrancy?: BehavioralVibrancy | Record<string, number> | null | unknown;
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
    title: string
    category: string
    slug: string
    missionLevel?: string | null
  }
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

export interface NavUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  experience?: number
  pseudo?: string | null
  level?: number | null
  missionsCompletedCount?: number | null
  role?: string | null
}

export interface SettingsUserData {
  id?: string
  name?: string | null
  email?: string | null
  pseudo?: string | null
  bio?: string | null
  image?: string | null
  country?: string | null
  city?: string | null
  language: string
  currentSituation?: string | null
  githubUrl?: string | null
  portfolioUrl?: string | null
  twitterUrl?: string | null
  linkedinUrl?: string | null
  domains: string[]
  tools: string[]
  primaryDomain?: string | null
  subDomain?: string | null
  learningTools?: string[]
  practiceMode?: string | null
  certifications?: string[]
  mainObjective?: string | null
  secondaryObjectives?: unknown
  talentVisible?: boolean
}

export type PrimaryDomain =
  | "Web" | "Cybersecurity" | "Cloud" | "IA"
  | "Mobile" | "Automation" | "UI/UX" | "Web3" | "Data" | "DevOps"

export type SubDomain =
  | "frontend" | "backend" | "fullstack" | "web3"
  | "offensive" | "defensive" | "appsec" | "crypto"
  | "cloud" | "containers" | "iac" | "sre"
  | "ml" | "llm" | "data-eng" | "analytics"

export type PracticeMode = "github" | "ctf_platform" | "learning_platform" | "team"

export const TECH_TREE_V2: Record<PrimaryDomain, {
  subDomains: SubDomain[]
  tools: string[]
  platforms?: string[]
}> = {
  Cybersecurity: {
    subDomains: ["offensive", "defensive", "appsec", "crypto"],
    tools: [
      "Kali Linux", "Metasploit", "Burp Suite", "Nmap", "SQLmap",
      "Wireshark", "Aircrack-ng", "Gobuster", "Hydra", "ELK Stack",
      "Splunk", "Snort", "Suricata", "OWASP ZAP", "Semgrep", "Nuclei",
      "OpenSSL", "Hashcat", "CyberChef"
    ],
    platforms: ["HackTheBox", "TryHackMe", "Root-Me", "CTFtime", "PicoCTF", "PortSwigger"]
  },
  Web: {
    subDomains: ["frontend", "backend", "fullstack", "web3"],
    tools: [
      "Next.js", "React", "Vue.js", "TypeScript", "Tailwind",
      "Node.js", "Express", "NestJS", "FastAPI", "PostgreSQL",
      "Redis", "Prisma", "Supabase", "Vercel", "tRPC"
    ]
  },
  Cloud: {
    subDomains: ["cloud", "containers", "iac", "sre"],
    tools: [
      "Docker", "Kubernetes", "Terraform", "Ansible", "AWS",
      "GCP", "Azure", "GitHub Actions", "ArgoCD", "Prometheus",
      "Grafana", "Nginx", "Helm", "Pulumi"
    ]
  },
  IA: {
    subDomains: ["ml", "llm", "data-eng", "analytics"],
    tools: [
      "Python", "PyTorch", "LangChain", "LlamaIndex", "CrewAI",
      "Hugging Face", "OpenAI SDK", "Ollama", "Pandas", "dbt",
      "Apache Spark", "Airflow", "Kafka", "BigQuery", "Chroma"
    ]
  },
  Mobile: {
    subDomains: [],
    tools: ["React Native", "Flutter", "Expo", "Swift", "Kotlin"]
  },
  Automation: {
    subDomains: [],
    tools: ["Python", "Bash", "GitHub Actions", "n8n", "Zapier", "Playwright"]
  },
  "UI/UX": {
    subDomains: [],
    tools: ["Figma", "Adobe XD", "Framer", "Spline", "Storybook", "Maze"]
  },
  Web3: {
    subDomains: [],
    tools: ["Solidity", "Ethers.js", "Hardhat", "Wagmi", "Foundry", "IPFS"]
  },
  Data: {
    subDomains: ["data-eng", "analytics"],
    tools: ["SQL", "dbt", "Airflow", "BigQuery", "Metabase", "Superset"]
  },
  DevOps: {
    subDomains: ["containers", "iac", "sre"],
    tools: ["Docker", "Kubernetes", "Terraform", "Prometheus", "Grafana", "Linux"]
  },
}



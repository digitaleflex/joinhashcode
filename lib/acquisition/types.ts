/**
 * HASHCODE — Acquisition profiling domain types.
 * Shared between client (UI state) and server (API validation).
 * Aligned with the community schema (Member model).
 */

export type Domain = "web" | "cybersecurity" | "ai";
export type Level = "beginner" | "practicing" | "autonomous" | "advanced";
export type Goal =
  | "project"
  | "employment"
  | "freelance"
  | "upskill"
  | "business"
  | "career"
  | "other";
export type Availability = "<2h" | "2-5h" | "5-10h" | "10-15h" | "15h+";
export type LearningStyle = "practice" | "path" | "group" | "mentor" | "project";
export type MentoringInterest = "no" | "maybe" | "yes";
export type Gender = "male" | "female" | "other" | "prefer_not_say";

export type ProfileStatus = "PENDING" | "APPROVED" | "REJECTED" | "WAITLIST";
export type CommunityStatus = "NOT_INVITED" | "INVITED" | "JOINED";
export type AccessLane = "immediate" | "pending";

/** All profiling answers collected through the acquisition funnel. */
export interface ProfileAnswers {
  // Identité
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  gender?: Gender;

  // Profil
  primaryDomain?: Domain;
  secondaryDomains?: Domain[];
  domainSpecialty?: string[];
  level?: Level;

  // Objectifs
  goal?: Goal;
  goalProjectStage?: string;
  goalSituation?: string;

  // Disponibilité
  availability?: Availability;
  availabilityTimes?: string;

  // Apprentissage
  learningStyle?: LearningStyle;

  // Mentorat
  mentoringInterest?: MentoringInterest;
  mentoringMaybeReason?: string;
  mentoringTypes?: string[];
  mentoringFrequency?: string;
  mentoringDomain?: string;

  // Budget
  budgetRange?: string;

  // Open
  threeMonthGoal?: string;
}

export type QuestionType =
  | "single_choice"
  | "multi_choice"
  | "text"
  | "email"
  | "longtext"
  | "country";

export interface QuestionOption {
  value: string;
  label: string;
  emoji?: string;
  description?: string;
  hint?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  helper?: string;
  placeholder?: string;
  options?: QuestionOption[];
  required: boolean;
  mapsTo: keyof ProfileAnswers;
  condition?: (a: ProfileAnswers) => boolean;
  allowMultiple?: boolean;
  minChars?: number;
  maxChars?: number;
  microcopy?: string;
  group: "profil" | "objectifs" | "rythme" | "mentorat" | "contact" | "vision";
}

export interface GeneratedProfile {
  archetype: string;
  archetypeEmoji: string;
  domainLabel: string;
  levelLabel: string;
  goalLabel: string;
  availabilityLabel: string;
  styleLabel: string;
  mentoringLabel: string;
  tags: string[];
  genderLabel?: string;
}

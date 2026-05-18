export type CriterionWeight = "REQUIRED" | "BONUS"

export interface Criterion {
  id: string
  label: string
  weight: CriterionWeight
}

export type QualityLevel = "STANDARD" | "GOOD" | "EXEMPLARY"

export const XP_MULTIPLIERS: Record<QualityLevel, number> = {
  STANDARD: 1.0,
  GOOD: 1.25,
  EXEMPLARY: 1.5,
}

export const LEVEL_REQUIREMENT: Record<string, number> = {
  INIT: 1,
  CORE: 2,
  PRO: 3,
}

export const MISSION_CRITERIA: Record<string, Criterion[]> = {
  CODE: [
    { id: "code-accessible", label: "Lien accessible (repo public ou admin invité)", weight: "REQUIRED" },
    { id: "code-readme", label: "README présent avec description du projet", weight: "REQUIRED" },
    { id: "code-functional", label: "Code fonctionnel (pas un scaffold vide)", weight: "REQUIRED" },
    { id: "code-commits", label: "Minimum 3 commits réels (historique visible)", weight: "REQUIRED" },
    { id: "code-objective", label: "Objectif de la mission clairement atteint", weight: "REQUIRED" },
    { id: "code-tests", label: "Tests présents (unitaires ou intégration)", weight: "BONUS" },
    { id: "code-deployed", label: "Déployé en production avec URL live", weight: "BONUS" },
    { id: "code-architecture", label: "Architecture lisible et documentée", weight: "BONUS" },
  ],
  DESIGN: [
    { id: "design-accessible", label: "Fichiers accessibles (Figma / PDF / lien live)", weight: "REQUIRED" },
    { id: "design-elements", label: "Tous les éléments demandés présents", weight: "REQUIRED" },
    { id: "design-coherence", label: "Cohérence visuelle démontrée", weight: "REQUIRED" },
    { id: "design-brief", label: "Brief des choix de design expliqué", weight: "REQUIRED" },
    { id: "design-variants", label: "Variantes / explorations multiples", weight: "BONUS" },
    { id: "design-guide", label: "Guide de style complet (usage, do/don't)", weight: "BONUS" },
    { id: "design-moodboard", label: "Moodboard ou sources d'inspiration documentées", weight: "BONUS" },
  ],
  BUSINESS: [
    { id: "business-structure", label: "Structure imposée respectée (sections présentes)", weight: "REQUIRED" },
    { id: "business-research", label: "Recherche évidente, non générique", weight: "REQUIRED" },
    { id: "business-conclusions", label: "Conclusions actionnables (pas juste descriptives)", weight: "REQUIRED" },
    { id: "business-clarity", label: "Clarté et qualité de l'écriture", weight: "REQUIRED" },
    { id: "business-data", label: "Données chiffrées citées avec sources", weight: "BONUS" },
    { id: "business-competition", label: "Analyse concurrentielle incluse", weight: "BONUS" },
    { id: "business-validation", label: "Validation terrain ou entretiens mentionnés", weight: "BONUS" },
  ],
  NETWORK: [
    { id: "network-proof", label: "Preuve fournie (screenshot, témoignage, recap)", weight: "REQUIRED" },
    { id: "network-context", label: "Contexte de la connexion / événement expliqué", weight: "REQUIRED" },
    { id: "network-impact", label: "Impact ou résultat concret décrit", weight: "REQUIRED" },
    { id: "network-testimony", label: "Témoignage des parties impliquées", weight: "BONUS" },
    { id: "network-photos", label: "Photos ou captures multiples", weight: "BONUS" },
    { id: "network-followup", label: "Suivi post-connexion / post-événement mentionné", weight: "BONUS" },
  ],
  GENERAL: [
    { id: "general-proof", label: "Preuve de réalisation fournie", weight: "REQUIRED" },
    { id: "general-objective", label: "Objectif de la mission atteint", weight: "REQUIRED" },
    { id: "general-description", label: "Description claire du travail effectué", weight: "REQUIRED" },
    { id: "general-impact", label: "Impact ou résultat concret décrit", weight: "BONUS" },
  ],
  INTRO: [
    { id: "intro-project", label: "Description du projet en une phrase claire", weight: "REQUIRED" },
    { id: "intro-objective", label: "Objectif 3 mois précis et actionnable", weight: "REQUIRED" },
    { id: "intro-authentic", label: "Ton personnel et authentique (pas générique)", weight: "BONUS" },
  ],
}

export function getCriteriaForMission(category: string): Criterion[] {
  return MISSION_CRITERIA[category.toUpperCase()] ?? MISSION_CRITERIA.GENERAL
}

export function computeQualityLevel(
  criteria: Criterion[],
  checked: Record<string, boolean>
): QualityLevel {
  const bonus = criteria.filter(c => c.weight === "BONUS")
  const bonusPassed = bonus.filter(c => checked[c.id]).length

  if (bonusPassed >= bonus.length && bonus.length >= 2) return "EXEMPLARY"
  if (bonusPassed >= 2 || (bonusPassed >= bonus.length && bonus.length > 0)) return "GOOD"
  return "STANDARD"
}

export function computeXp(baseXp: number, qualityLevel: QualityLevel): number {
  return Math.round(baseXp * XP_MULTIPLIERS[qualityLevel])
}

export function isEligibleReviewer(params: {
  reviewerClass: string | null
  reviewerLevel: number
  reviewerMissionsCompleted: number
  reviewerId: string
  submissionUserId: string
  missionTargetProfiles: string[]
  missionRequiredLevel: number
}): boolean {
  const {
    reviewerClass, reviewerLevel, reviewerMissionsCompleted,
    reviewerId, submissionUserId, missionTargetProfiles, missionRequiredLevel,
  } = params
  if (reviewerId === submissionUserId) return false
  if (!reviewerClass) return false
  if (!missionTargetProfiles.includes(reviewerClass.toLowerCase())) return false
  if (reviewerLevel < missionRequiredLevel + 1) return false
  if (reviewerMissionsCompleted < 3) return false
  return true
}

export function getMissingRequiredCriteria(
  criteria: Criterion[],
  checked: Record<string, boolean>
): string[] {
  return criteria
    .filter(c => c.weight === "REQUIRED" && !checked[c.id])
    .map(c => c.label)
}

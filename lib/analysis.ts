import { questions } from "./questions";
import { PROFILE_CONTENT } from "./profile-content";
import { createBayesianProfileFromQuiz } from "./bayesian-profile";

export type ProfileType = "builder" | "creator" | "strategist" | "catalyst";

export interface RecommendedSpecialization {
  id: string
  label: string
  reason: string
  goal90days: string
  goal90daysWhy: string
  goal90daysOutcomes: string[]
  steps: Array<{
    weekRange: string
    title: string
    type: "atelier" | "projet" | "validation"
  }>
  firstAction: {
    type: "atelier" | "projet" | "mentor"
    title: string
    slug: string
    duration: string
    pourquoi: string
  }
}

export interface Channel {
  name: string
  description: string
  url: string
  icon: string
}

export interface AnalysisResult {
  scores: Record<ProfileType, number>;
  percentages: Record<ProfileType, number>;
  primary: ProfileType;
  secondary: ProfileType;
  isHybrid: boolean;
  hybridLabel: string;
  level: number;
  consistencyScore: number;
  suggestedChannels: Channel[];
  recommendedSpecializations: RecommendedSpecialization[];
  bayesianState?: {
    posterior: Record<ProfileType, number>;
    uncertainty: number;
    evidenceCount: number;
  };
}

// Class display labels
const CLASS_LABELS: Record<ProfileType, string> = {
  builder:    "Builder",
  creator:    "Créateur",
  strategist: "Stratège",
  catalyst:   "Catalyseur",
};

function getSpecializationsForProfile(primary: ProfileType): RecommendedSpecialization[] {
  const content = PROFILE_CONTENT[primary]
  if (!content?.possibleSpecializations?.length) return []
  return content.possibleSpecializations.map(s => ({
    id: s.id,
    label: s.label,
    reason: s.reason,
    goal90days: s.goal90days,
    goal90daysWhy: s.goal90daysWhy,
    goal90daysOutcomes: s.goal90daysOutcomes,
    steps: s.steps,
    firstAction: s.firstAction,
  }))
}

const channelMap: Record<ProfileType, [Channel, Channel]> = {
  builder: [
    { name: "#dev-lab", description: "Le coeur technique de HASHCODE. Défis d'architecture et revue de code.", url: "/channels/dev-lab", icon: "terminal" },
    { name: "Open Source Collective", description: "Contribue à des projets qui changent le monde.", url: "/channels/os", icon: "git-branch" }
  ],
  creator: [
    { name: "#pixel-perfect", description: "Design, UI, UX et direction artistique.", url: "/channels/design", icon: "palette" },
    { name: "Content Factory", description: "Crée du contenu qui marque les esprits.", url: "/channels/content", icon: "video" }
  ],
  strategist: [
    { name: "#growth-mindset", description: "Business, scaling et optimisation de revenus.", url: "/channels/business", icon: "trending-up" },
    { name: "Product Masters", description: "Définit la vision et roadmap des produits.", url: "/channels/product", icon: "map" }
  ],
  catalyst: [
    { name: "#connect-hub", description: "Networking, partenariats et gestion de communauté.", url: "/channels/network", icon: "users" },
    { name: "Mentorship Circle", description: "Transmet ton savoir et apprends des meilleurs.", url: "/channels/mentors", icon: "award" }
  ]
};

const SPECIALIZATION_MATCH: Record<string, string[]> = {
  CYBERSECURITY: ["cybersecurite", "cloud-devops", "architecture"],
  CLOUD_DEVOPS: ["cloud-devops", "architecture", "fullstack"],
  CREATE_STARTUP: ["fullstack", "ux-design", "product-strategy"],
  FREELANCE: ["fullstack", "digital-design", "consulting"],
  MASTER_AI: ["fullstack", "architecture", "business-analytics"],
  CREATE_PRODUCTS: ["ux-design", "digital-design", "product-strategy"],
  FIND_JOB: ["fullstack", "cloud-devops", "community-management"],
  LEARN_CODE: ["fullstack", "ux-design", "content-creation"],
};

function scoreSpecializationMatch(specId: string, mainObjective: string): number {
  const preferred = SPECIALIZATION_MATCH[mainObjective]
  if (!preferred) return 0
  const idx = preferred.indexOf(specId)
  return idx >= 0 ? preferred.length - idx : 0
}

export const analyzeQuizResults = (answers: string[], responseTimes: number[] = [], mainObjective?: string): AnalysisResult => {
  const counts: Record<ProfileType, number> = {
    builder: 0,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  const timeSum: Record<ProfileType, number> = {
    builder: 0,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  let totalWeight = 0;

  answers.forEach((ans, idx) => {
    const question = questions[idx];
    if (!question) return;

    const profile = ans as ProfileType;
    const selectedOption = question.options.find(opt => opt.value === profile);

    if (selectedOption && profile in counts) {
      const weight = selectedOption.score || question.weight || 1;
      counts[profile] += weight;
      totalWeight += weight;
      timeSum[profile] += responseTimes[idx] || 0;
    }
  });

  // Guard: no answers recorded
  if (totalWeight === 0) {
    return {
      scores: counts,
      percentages: { builder: 25, creator: 25, strategist: 25, catalyst: 25 },
      primary: "builder",
      secondary: "strategist",
      isHybrid: true,
      hybridLabel: "Profil non déterminé",
      level: 1,
      consistencyScore: 0,
      suggestedChannels: [],
      recommendedSpecializations: [],
    };
  }

  const percentages: Record<ProfileType, number> = {
    builder:    Math.round((counts.builder    / totalWeight) * 100),
    creator:    Math.round((counts.creator    / totalWeight) * 100),
    strategist: Math.round((counts.strategist / totalWeight) * 100),
    catalyst:   Math.round((counts.catalyst   / totalWeight) * 100),
  };

  // Sort by weighted score, tie-break by average response time (secondary signal only)
  const sortedProfiles = (Object.keys(counts) as ProfileType[]).sort((a, b) => {
    if (counts[b] !== counts[a]) return counts[b] - counts[a];
    const avgA = counts[a] > 0 ? timeSum[a] / counts[a] : Infinity;
    const avgB = counts[b] > 0 ? timeSum[b] / counts[b] : Infinity;
    return avgA - avgB;
  });

  const primary = sortedProfiles[0];
  const secondary = sortedProfiles[1];

  // Hybrid detection: gap between primary and secondary < 15 percentage points
  const gap = percentages[primary] - percentages[secondary];
  const isHybrid = gap < 15;
  const hybridLabel = isHybrid
    ? `${CLASS_LABELS[primary]} × ${CLASS_LABELS[secondary]}`
    : CLASS_LABELS[primary];

  // Polarization score
  const mean = totalWeight / 4;
  const variance =
    Object.values(counts).reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / 4;
  const stdDev = Math.sqrt(variance);
  const maxVariance = (Math.pow(totalWeight - mean, 2) + 3 * Math.pow(mean, 2)) / 4;
  const maxStdDev = Math.sqrt(maxVariance);
  const consistencyScore = maxStdDev > 0 ? stdDev / maxStdDev : 0;

  const level = 1;

  // For hybrids, surface one channel from each dominant profile
  const channels = isHybrid
    ? [channelMap[primary][0], channelMap[secondary][0], channelMap[primary][1]]
    : [...channelMap[primary], channelMap[secondary][0]];

  const allSpecializations = getSpecializationsForProfile(primary);
  const fallback = allSpecializations.length > 0 ? allSpecializations : getSpecializationsForProfile(secondary);

  // Sort by mainObjective match if provided
  const recommendedSpecializations = mainObjective
    ? [...fallback].sort((a, b) => {
        const scoreA = scoreSpecializationMatch(a.id, mainObjective);
        const scoreB = scoreSpecializationMatch(b.id, mainObjective);
        return scoreB - scoreA;
      })
    : fallback;

  const bayesianState = createBayesianProfileFromQuiz(percentages);

  return {
    scores: counts,
    percentages,
    primary,
    secondary,
    isHybrid,
    hybridLabel,
    level,
    consistencyScore,
    suggestedChannels: channels,
    recommendedSpecializations,
    bayesianState: {
      posterior: bayesianState.posterior,
      uncertainty: bayesianState.uncertainty,
      evidenceCount: bayesianState.evidenceCount,
    },
  };
};

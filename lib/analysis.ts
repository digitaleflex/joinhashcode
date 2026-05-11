export type ProfileType = "builder" | "creator" | "strategist" | "catalyst";

export interface AnalysisResult {
  scores: Record<ProfileType, number>;
  percentages: Record<ProfileType, number>;
  primary: ProfileType;
  secondary: ProfileType;
  level: number;
  consistencyScore: number; // 0 to 1, how polarized the profile is
  suggestedChannels: {
    name: string;
    description: string;
    url: string;
    icon: string;
  }[];
}

import { questions } from "./questions";

export const analyzeQuizResults = (answers: string[], responseTimes: number[] = []): AnalysisResult => {
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

  // Process all 13 questions (behavioral, scenario, crisis)
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

  // Calculate percentages based on weighted scores
  const percentages = {
    builder: Math.round((counts.builder / totalWeight) * 100),
    creator: Math.round((counts.creator / totalWeight) * 100),
    strategist: Math.round((counts.strategist / totalWeight) * 100),
    catalyst: Math.round((counts.catalyst / totalWeight) * 100),
  };

  // Sort profiles by weighted score
  const sortedProfiles = (Object.keys(counts) as ProfileType[]).sort((a, b) => {
    if (counts[b] !== counts[a]) {
      return counts[b] - counts[a];
    }
    // Tie-breaker: Lower average response time
    const avgA = counts[a] > 0 ? timeSum[a] / (counts[a] || 1) : Infinity;
    const avgB = counts[b] > 0 ? timeSum[b] / (counts[b] || 1) : Infinity;
    return avgA - avgB;
  });

  const primary = sortedProfiles[0];
  const secondary = sortedProfiles[1];

  // Mathematical Consistency / Polarization Score (Weighted)
  const mean = totalWeight / 4;
  const variance = Object.values(counts).reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / 4;
  const stdDev = Math.sqrt(variance);
  
  // Max standard deviation is when one class has all the weight
  const maxPossibleStdDev = Math.sqrt(Math.pow(totalWeight - mean, 2) + 3 * Math.pow(0 - mean, 2)) / 2;
  const consistencyScore = stdDev / maxPossibleStdDev;

  // Level is now typically handled via onboarding or calculated from specific weights
  // For now, we'll keep a placeholder or base it on "CORE" level
  const level = 1;

  const channelMap: Record<ProfileType, any[]> = {
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

  return {
    scores: counts,
    percentages,
    primary,
    secondary,
    level,
    consistencyScore,
    suggestedChannels: [...channelMap[primary], channelMap[secondary][0]],
  };
};

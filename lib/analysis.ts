export type ProfileType = "builder" | "creator" | "strategist" | "catalyst";

export interface AnalysisResult {
  scores: Record<ProfileType, number>;
  percentages: Record<ProfileType, number>;
  primary: ProfileType;
  secondary: ProfileType;
  consistencyScore: number; // 0 to 1, how polarized the profile is
  suggestedChannels: {
    name: string;
    description: string;
    url: string;
    icon: string;
  }[];
}

export const analyzeQuizResults = (answers: string[]): AnalysisResult => {
  const counts: Record<ProfileType, number> = {
    builder: 0,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  // Count occurrences
  answers.forEach((ans) => {
    if (ans in counts) {
      counts[ans as ProfileType]++;
    }
  });

  const total = answers.length;
  const percentages = {
    builder: Math.round((counts.builder / total) * 100),
    creator: Math.round((counts.creator / total) * 100),
    strategist: Math.round((counts.strategist / total) * 100),
    catalyst: Math.round((counts.catalyst / total) * 100),
  };

  // Sort profiles by score
  const sortedProfiles = (Object.keys(counts) as ProfileType[]).sort(
    (a, b) => counts[b] - counts[a]
  );

  const primary = sortedProfiles[0];
  const secondary = sortedProfiles[1];

  // Mathematical Consistency / Polarization Score
  // Calculated as the standard deviation of scores to see if the user is specialized or generalist
  const mean = total / 4;
  const variance = Object.values(counts).reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / 4;
  const stdDev = Math.sqrt(variance);
  const maxPossibleStdDev = Math.sqrt(Math.pow(total - mean, 2) + 3 * Math.pow(0 - mean, 2)) / 2;
  const consistencyScore = stdDev / maxPossibleStdDev;

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
    consistencyScore,
    suggestedChannels: [...channelMap[primary], channelMap[secondary][0]],
  };
};

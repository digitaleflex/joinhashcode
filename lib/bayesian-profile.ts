export type ProfileType = "builder" | "creator" | "strategist" | "catalyst";

export interface ProfileDistribution {
  builder: number;
  creator: number;
  strategist: number;
  catalyst: number;
}

export interface BayesianProfileState {
  prior: ProfileDistribution;
  posterior: ProfileDistribution;
  uncertainty: number;
  evidenceCount: number;
  lastUpdated: Date;
}

export interface BayesianUpdateInput {
  missionType?: string;
  specializationScores?: Partial<ProfileDistribution>;
  performanceScore?: number;
  actionType?: "mission" | "specialization" | "behavior";
}

const DEFAULT_PRIOR: ProfileDistribution = {
  builder: 1,
  creator: 1,
  strategist: 1,
  catalyst: 1,
};

const PROFILE_LIKELIHOOD: Record<string, Partial<ProfileDistribution>> = {
  CODE: { builder: 0.7, creator: 0.15, strategist: 0.1, catalyst: 0.05 },
  DESIGN: { builder: 0.1, creator: 0.7, strategist: 0.1, catalyst: 0.1 },
  BUSINESS: { builder: 0.1, creator: 0.1, strategist: 0.7, catalyst: 0.1 },
  NETWORK: { builder: 0.05, creator: 0.1, strategist: 0.1, catalyst: 0.75 },
  GENERAL: { builder: 0.25, creator: 0.25, strategist: 0.25, catalyst: 0.25 },
};

function dirichletUpdate(
  prior: ProfileDistribution,
  likelihood: Partial<ProfileDistribution>,
  weight: number
): ProfileDistribution {
  const keys = Object.keys(prior) as ProfileType[];
  const updated: ProfileDistribution = { ...prior };

  keys.forEach((key) => {
    const p = prior[key];
    const l = likelihood[key] ?? 0.25;
    updated[key] = p + l * weight;
  });

  return updated;
}

export function initializeBayesianProfile(): BayesianProfileState {
  return {
    prior: { ...DEFAULT_PRIOR },
    posterior: { ...DEFAULT_PRIOR },
    uncertainty: 0.7,
    evidenceCount: 0,
    lastUpdated: new Date(),
  };
}

export function createBayesianProfileFromQuiz(
  percentages: Partial<ProfileDistribution>
): BayesianProfileState {
  const prior: ProfileDistribution = {
    builder: percentages.builder ?? 25,
    creator: percentages.creator ?? 25,
    strategist: percentages.strategist ?? 25,
    catalyst: percentages.catalyst ?? 25,
  };

  const total = Object.values(prior).reduce((sum, val) => sum + val, 0);
  const normalized: ProfileDistribution = {
    builder: prior.builder / total,
    creator: prior.creator / total,
    strategist: prior.strategist / total,
    catalyst: prior.catalyst / total,
  };

  return {
    prior: { ...normalized },
    posterior: { ...normalized },
    uncertainty: 0.65,
    evidenceCount: 1,
    lastUpdated: new Date(),
  };
}

export function updateBayesianProfile(
  state: BayesianProfileState,
  input: BayesianUpdateInput = {}
): BayesianProfileState {
  const weight = input.performanceScore !== undefined ? input.performanceScore * 2 : 1;
  let likelihood: Partial<ProfileDistribution> = {};

  if (input.missionType) {
    const type = input.missionType.toUpperCase();
    likelihood = PROFILE_LIKELIHOOD[type] ?? PROFILE_LIKELIHOOD.GENERAL;
  }

  if (input.specializationScores && Object.keys(input.specializationScores).length > 0) {
    const specializationTotal = Object.values(input.specializationScores).reduce(
      (sum: number, val: number | undefined) => sum + (val ?? 0),
      0
    );

    if (specializationTotal > 0) {
      const normalizedSpec: Partial<ProfileDistribution> = {};
      (Object.keys(input.specializationScores) as ProfileType[]).forEach((key) => {
        const val = input.specializationScores[key];
        if (val !== undefined) {
          normalizedSpec[key] = val / specializationTotal;
        }
      });

      likelihood = {
        builder: (likelihood.builder ?? 0.25) * 0.5 + (normalizedSpec.builder ?? 0) * 0.5,
        creator: (likelihood.creator ?? 0.25) * 0.5 + (normalizedSpec.creator ?? 0) * 0.5,
        strategist: (likelihood.strategist ?? 0.25) * 0.5 + (normalizedSpec.strategist ?? 0) * 0.5,
        catalyst: (likelihood.catalyst ?? 0.25) * 0.5 + (normalizedSpec.catalyst ?? 0) * 0.5,
      };
    }
  }

  const newPosterior = dirichletUpdate(state.posterior, likelihood, weight);

  const total = Object.values(newPosterior).reduce((sum, val) => sum + val, 0);
  const normalizedPosterior: ProfileDistribution = {
    builder: newPosterior.builder / total,
    creator: newPosterior.creator / total,
    strategist: newPosterior.strategist / total,
    catalyst: newPosterior.catalyst / total,
  };

  const sorted = Object.entries(normalizedPosterior)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key as ProfileType);

  const primary = sorted[0];
  const secondary = sorted[1];
  const newUncertainty = Math.max(0.05, state.uncertainty * 0.85);

  return {
    prior: { ...normalizedPosterior },
    posterior: { ...normalizedPosterior },
    uncertainty: Math.round(newUncertainty * 100) / 100,
    evidenceCount: state.evidenceCount + 1,
    lastUpdated: new Date(),
  };
}

export function getBayesianInsights(state: BayesianProfileState) {
  const sorted = Object.entries(state.posterior)
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => ({
      profile: key as ProfileType,
      probability: Math.round(value * 100) / 100,
      percentage: Math.round(value * 100),
    }));

  const primary = sorted[0];
  const secondary = sorted[1];
  const isHybrid = primary.percentage - secondary.percentage < 15;

  return {
    primary: primary.profile,
    secondary: secondary.profile,
    primaryProbability: primary.probability,
    secondaryProbability: secondary.probability,
    isHybrid,
    uncertainty: state.uncertainty,
    evidenceCount: state.evidenceCount,
    distribution: sorted,
  };
}

export function serializeBayesianState(state: BayesianProfileState): string {
  return JSON.stringify({
    ...state,
    lastUpdated: state.lastUpdated.toISOString(),
  });
}

export function deserializeBayesianState(data: string): BayesianProfileState | null {
  try {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      lastUpdated: new Date(parsed.lastUpdated),
    };
  } catch {
    return null;
  }
}

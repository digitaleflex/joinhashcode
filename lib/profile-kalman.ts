export type ProfileType = "builder" | "creator" | "strategist" | "catalyst";

export interface ProfileDistribution {
  builder: number;
  creator: number;
  strategist: number;
  catalyst: number;
}

export interface KalmanState {
  mean: number[];
  covariance: number[][];
  confidence: number;
  lastUpdated: Date;
}

const PROFILE_ORDER: ProfileType[] = ["builder", "creator", "strategist", "catalyst"];
const DEFAULT_MEAN: number[] = [0.25, 0.25, 0.25, 0.25];
const DEFAULT_COVARIANCE: number[][] = [
  [0.15, 0, 0, 0],
  [0, 0.15, 0, 0],
  [0, 0, 0.15, 0],
  [0, 0, 0, 0.15],
];

export function createInitialKalmanState(): KalmanState {
  return {
    mean: [...DEFAULT_MEAN],
    covariance: DEFAULT_COVARIANCE.map(row => [...row]),
    confidence: 0.3,
    lastUpdated: new Date(),
  };
}

export function createKalmanStateFromQuiz(
  percentages: Partial<ProfileDistribution>
): KalmanState {
  const mean = PROFILE_ORDER.map(profile => percentages[profile] ?? 25) ;
  const normalized = normalizeVector(mean);

  const variance = 0.08;
  const covariance = PROFILE_ORDER.map((_, i) =>
    PROFILE_ORDER.map((_, j) => (i === j ? variance : 0))
  );

  const trace = covariance.reduce((sum, row, i) => sum + row[i], 0);
  const confidence = Math.min(0.95, Math.max(0.3, 1 - trace / 4));

  return {
    mean: normalized,
    covariance,
    confidence,
    lastUpdated: new Date(),
  };
}

export function kalmanPredict(state: KalmanState): KalmanState {
  const drift = 1.01;
  const F = PROFILE_ORDER.map((_, i) =>
    PROFILE_ORDER.map((_, j) => (i === j ? drift : 0))
  );

  const processNoise = 0.012;
  const Q = PROFILE_ORDER.map((_, i) =>
    PROFILE_ORDER.map((_, j) => (i === j ? processNoise : 0))
  );

  const newMean = multiplyMatrixVector(F, state.mean);
  const Fcov = multiplyMatrices(multiplyMatrices(F, state.covariance), transpose(F));
  const newCov = addMatrices(Fcov, Q);

  return {
    mean: newMean,
    covariance: newCov,
    confidence: state.confidence,
    lastUpdated: new Date(),
  };
}

export function kalmanUpdate(
  state: KalmanState,
  observation: ProfileDistribution,
  observationNoise: number = 0.18
): KalmanState {
  const H: number[][] = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  const obsVector = PROFILE_ORDER.map(profile => observation[profile]);
  const Hx = multiplyMatrixVector(H, state.mean);
  const y = subtractVectors(obsVector, Hx);

  const S = addMatrices(
    multiplyMatrices(multiplyMatrices(H, state.covariance), transpose(H)),
    buildDiagonalMatrix(PROFILE_ORDER.map(() => observationNoise))
  );

  const K = multiplyMatrices(
    multiplyMatrices(state.covariance, transpose(H)),
    invert(S)
  );

  const newMean = addVectors(state.mean, multiplyMatrixVector(K, y));
  const KH = multiplyMatrices(K, H);
  const IKH = subtractMatrices(identity(4), KH);
  const newCov = multiplyMatrices(IKH, state.covariance);

  const trace = newCov.reduce((sum, row, i) => sum + row[i], 0);
  const confidence = Math.min(0.95, Math.max(0.05, 1 - trace / 4));

  return {
    mean: normalizeVector(newMean),
    covariance: newCov,
    confidence: Math.round(confidence * 100) / 100,
    lastUpdated: new Date(),
  };
}

export function getKalmanInsights(state: KalmanState) {
  const indexed = state.mean.map((value, index) => ({
    profile: PROFILE_ORDER[index],
    value,
    percentage: Math.round(value * 100),
  }));

  const sorted = [...indexed].sort((a, b) => b.value - a.value);
  const primary = sorted[0].profile;
  const secondary = sorted[1].profile;
  const isHybrid = sorted[0].percentage - sorted[1].percentage < 15;

  return {
    primary,
    secondary,
    primaryPercentage: sorted[0].percentage,
    secondaryPercentage: sorted[1].percentage,
    isHybrid,
    confidenceLevel: getConfidenceLevel(state.confidence),
    distribution: sorted,
  };
}

export function buildProfileDistributionFromKalman(state: KalmanState): ProfileDistribution {
  const result = {} as ProfileDistribution;
  state.mean.forEach((value, index) => {
    result[PROFILE_ORDER[index]] = Math.round(value * 100) / 100;
  });
  return result;
}

export function serializeKalmanState(state: KalmanState): string {
  return JSON.stringify({
    mean: state.mean,
    covariance: state.covariance,
    confidence: state.confidence,
    lastUpdated: state.lastUpdated.toISOString(),
  });
}

export function deserializeKalmanState(data: string): KalmanState | null {
  try {
    const parsed = JSON.parse(data);
    return {
      mean: parsed.mean,
      covariance: parsed.covariance,
      confidence: parsed.confidence,
      lastUpdated: new Date(parsed.lastUpdated),
    };
  } catch {
    return null;
  }
}

function normalizeVector(vector: number[]): number[] {
  const sum = vector.reduce((acc, value) => acc + value, 0);
  if (sum === 0) return vector.map(() => 1 / vector.length);
  return vector.map(value => value / sum);
}

function multiplyMatrixVector(matrix: number[][], vector: number[]): number[] {
  return matrix.map(row => row.reduce((sum, value, i) => sum + value * vector[i], 0));
}

function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const rows = a.length;
  const cols = b[0].length;
  const result: number[][] = [];

  for (let i = 0; i < rows; i++) {
    result[i] = [];
    for (let j = 0; j < cols; j++) {
      result[i][j] = a[i].reduce((sum, _, k) => sum + a[i][k] * b[k][j], 0);
    }
  }

  return result;
}

function transpose(matrix: number[][]): number[][] {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function addMatrices(a: number[][], b: number[][]): number[][] {
  return a.map((row, i) => row.map((value, j) => value + b[i][j]));
}

function subtractMatrices(a: number[][], b: number[][]): number[][] {
  return a.map((row, i) => row.map((value, j) => value - b[i][j]));
}

function subtractVectors(a: number[], b: number[]): number[] {
  return a.map((value, i) => value - b[i]);
}

function addVectors(a: number[], b: number[]): number[] {
  return a.map((value, i) => value + b[i]);
}

function identity(size: number): number[][] {
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
  );
}

function buildDiagonalMatrix(values: number[]): number[][] {
  const size = values.length;
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i === j ? values[i] : 0))
  );
}

function invert(matrix: number[][]): number[][] {
  const n = matrix.length;
  const augmented = matrix.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);

  for (let i = 0; i < n; i++) {
    const pivot = augmented[i][i];
    if (Math.abs(pivot) < 1e-10) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augmented[j][i]) > 1e-10) {
          [augmented[i], augmented[j]] = [augmented[j], augmented[i]];
          break;
        }
      }
    }

    const divisor = augmented[i][i];
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= divisor;
    }

    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = augmented[k][i];
      for (let j = 0; j < 2 * n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }

  return augmented.map(row => row.slice(n));
}

export function getConfidenceLevel(confidenceScore: number): string {
  if (confidenceScore < 0.4) return "Faible";
  if (confidenceScore < 0.7) return "Moyen";
  return "Élevé";
}

const MISSION_LIKELIHOODS: Record<string, ProfileDistribution> = {
  CODE: { builder: 0.65, creator: 0.15, strategist: 0.1, catalyst: 0.1 },
  DESIGN: { builder: 0.1, creator: 0.65, strategist: 0.1, catalyst: 0.15 },
  BUSINESS: { builder: 0.1, creator: 0.1, strategist: 0.65, catalyst: 0.15 },
  NETWORK: { builder: 0.1, creator: 0.15, strategist: 0.1, catalyst: 0.65 },
  GENERAL: { builder: 0.25, creator: 0.25, strategist: 0.25, catalyst: 0.25 },
};

export function updateProfileWithKalman(
  current: KalmanState,
  missionType?: string,
  performanceScore: number = 0.7
): KalmanState {
  const predicted = kalmanPredict(current);

  let likelihood: ProfileDistribution;
  if (!missionType) {
    const keys = Object.keys(MISSION_LIKELIHOODS);
    const randomKey = keys[Math.floor(Math.random() * keys.length)] as keyof typeof MISSION_LIKELIHOODS;
    likelihood = MISSION_LIKELIHOODS[randomKey];
  } else {
    const normalizedType = missionType.toUpperCase() as keyof typeof MISSION_LIKELIHOODS;
    likelihood = MISSION_LIKELIHOODS[normalizedType] ?? MISSION_LIKELIHOODS.GENERAL;
  }

  const scaledLikelihood: ProfileDistribution = {
    builder: likelihood.builder * performanceScore,
    creator: likelihood.creator * performanceScore,
    strategist: likelihood.strategist * performanceScore,
    catalyst: likelihood.catalyst * performanceScore,
  };

  return kalmanUpdate(predicted, scaledLikelihood, 0.2);
}

export function getKalmanProfileSummary(state: KalmanState) {
  const insights = getKalmanInsights(state);
  const distribution = buildProfileDistributionFromKalman(state);

  return {
    ...insights,
    distribution,
    evolution: {
      direction: getEvolutionDirection(state),
      volatility: calculateVolatility(state),
    },
  };
}

export function initializeProfileFromQuiz(
  percentages: Partial<ProfileDistribution>
): KalmanState {
  return createKalmanStateFromQuiz(percentages);
}

export function initializeEmptyProfile(): KalmanState {
  return createInitialKalmanState();
}

function getEvolutionDirection(state: KalmanState): "growing" | "stable" | "shifting" {
  const drift =
    Math.abs(state.mean[0] - DEFAULT_MEAN[0]) +
    Math.abs(state.mean[1] - DEFAULT_MEAN[1]) +
    Math.abs(state.mean[2] - DEFAULT_MEAN[2]) +
    Math.abs(state.mean[3] - DEFAULT_MEAN[3]);

  if (drift < 0.1) return "stable";
  if (drift > 0.4) return "shifting";
  return "growing";
}

function calculateVolatility(state: KalmanState): number {
  const trace = state.covariance.reduce((sum, row, i) => sum + row[i], 0);
  return Math.round((trace / 4) * 1000) / 1000;
}

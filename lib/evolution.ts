export interface BehavioralVitality {
  builder: number;
  creator: number;
  strategist: number;
  catalyst: number;
}

/**
 * Calcule la nouvelle Vitalité (somme pondérée des actions).
 */
export const updateVitality = (
  currentVitality: BehavioralVitality,
  missionWeights: BehavioralVitality,
  qualityMultiplier: number = 1 // Basé sur le feedback ou la réussite
): BehavioralVitality => {
  return {
    builder: currentVitality.builder + (missionWeights.builder * qualityMultiplier),
    creator: currentVitality.creator + (missionWeights.creator * qualityMultiplier),
    strategist: currentVitality.strategist + (missionWeights.strategist * qualityMultiplier),
    catalyst: currentVitality.catalyst + (missionWeights.catalyst * qualityMultiplier),
  };
};

/**
 * Calcule la nouvelle Vitalité avec application du "Time Decay".
 * Les scores diminuent de moitié tous les halfLifeDays si aucune activité.
 */
export const updateVitalityWithDecay = (
  currentVitality: BehavioralVitality,
  missionWeights: BehavioralVitality,
  lastUpdate: Date | null,
  now: Date = new Date(),
  halfLifeDays: number = 30
): { vitality: BehavioralVitality; decayFactor: number } => {
  if (!lastUpdate) {
    return { vitality: updateVitality(currentVitality, missionWeights), decayFactor: 1 };
  }

  const diffMs = now.getTime() - lastUpdate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const decayFactor = Math.pow(0.5, diffDays / halfLifeDays);

  // Apply threshold to avoid micro-values
  const applyDecay = (val: number) => {
    const decayed = val * decayFactor;
    return decayed < 0.01 ? 0 : decayed;
  };

  return {
    vitality: {
      builder: applyDecay(currentVitality.builder) + missionWeights.builder,
      creator: applyDecay(currentVitality.creator) + missionWeights.creator,
      strategist: applyDecay(currentVitality.strategist) + missionWeights.strategist,
      catalyst: applyDecay(currentVitality.catalyst) + missionWeights.catalyst,
    },
    decayFactor
  };
};


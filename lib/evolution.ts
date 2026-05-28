export interface BehavioralVibrancy {
  builder: number;
  creator: number;
  strategist: number;
  catalyst: number;
}

/**
 * Calcule la nouvelle "Vibrancy" (somme pondérée des actions).
 */
export const updateVibrancy = (
  currentVibrancy: BehavioralVibrancy,
  missionWeights: BehavioralVibrancy,
  qualityMultiplier: number = 1 // Basé sur le feedback ou la réussite
): BehavioralVibrancy => {
  return {
    builder: currentVibrancy.builder + (missionWeights.builder * qualityMultiplier),
    creator: currentVibrancy.creator + (missionWeights.creator * qualityMultiplier),
    strategist: currentVibrancy.strategist + (missionWeights.strategist * qualityMultiplier),
    catalyst: currentVibrancy.catalyst + (missionWeights.catalyst * qualityMultiplier),
  };
};

/**
 * Calcule la nouvelle "Vibrancy" avec application du "Time Decay" (Phase 2).
 * Les scores diminuent de moitié tous les halfLifeDays si aucune activité.
 */
export const updateVibrancyWithDecay = (
  currentVibrancy: BehavioralVibrancy,
  missionWeights: BehavioralVibrancy,
  lastUpdate: Date | null,
  now: Date = new Date(),
  halfLifeDays: number = 30
): { vibrancy: BehavioralVibrancy; decayFactor: number } => {
  if (!lastUpdate) {
    return { vibrancy: updateVibrancy(currentVibrancy, missionWeights), decayFactor: 1 };
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
    vibrancy: {
      builder: applyDecay(currentVibrancy.builder) + missionWeights.builder,
      creator: applyDecay(currentVibrancy.creator) + missionWeights.creator,
      strategist: applyDecay(currentVibrancy.strategist) + missionWeights.strategist,
      catalyst: applyDecay(currentVibrancy.catalyst) + missionWeights.catalyst,
    },
    decayFactor
  };
};


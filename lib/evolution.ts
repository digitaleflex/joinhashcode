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


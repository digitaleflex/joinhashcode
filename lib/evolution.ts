import { ProfileType } from "./analysis";

export interface BehavioralVibrancy {
  builder: number;
  creator: number;
  strategist: number;
  catalyst: number;
}

/**
 * Calcule l'évolution du Confidence Score basé sur une nouvelle action (mission).
 * Le système reste déterministe et humble (Phase 1).
 */
export const calculateNewConfidence = (
  currentScore: number,
  missionWeights: BehavioralVibrancy,
  userPrimaryClass: ProfileType,
  missionDifficulty: number = 1
): number => {
  // Gain de base par action (0.02 à 0.05 selon difficulté)
  const baseGain = 0.02 + (missionDifficulty * 0.01);
  
  // Bonus de cohérence : si la mission est dominée par la classe de l'utilisateur
  const missionPrimary = (Object.keys(missionWeights) as ProfileType[]).reduce((a, b) => 
    missionWeights[a] > missionWeights[b] ? a : b
  );
  
  const coherenceBonus = missionPrimary === userPrimaryClass ? 0.02 : 0.005;
  
  const newScore = currentScore + baseGain + coherenceBonus;
  
  // Cap à 0.95 pour toujours laisser une place à l'évolution
  return Math.min(newScore, 0.95);
};

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
 * Mesure le "Drift" (écart) entre le profil initial et les actions réelles.
 * Un drift élevé suggère une possible hybridation ou un changement de trajectoire.
 */
export const calculateDrift = (
  quizPercentages: Record<ProfileType, number>,
  vibrancy: BehavioralVibrancy
): number => {
  const totalVibrancy = vibrancy.builder + vibrancy.creator + vibrancy.strategist + vibrancy.catalyst || 1;
  
  const actionPercentages = {
    builder: (vibrancy.builder / totalVibrancy) * 100,
    creator: (vibrancy.creator / totalVibrancy) * 100,
    strategist: (vibrancy.strategist / totalVibrancy) * 100,
    catalyst: (vibrancy.catalyst / totalVibrancy) * 100,
  };

  // Somme des différences absolues (Manhattan distance)
  const drift = (Object.keys(quizPercentages) as ProfileType[]).reduce((acc, key) => {
    return acc + Math.abs(quizPercentages[key] - actionPercentages[key]);
  }, 0);

  // Normalisé entre 0 et 1 (somme max possible est 200, donc / 200)
  return drift / 200;
};

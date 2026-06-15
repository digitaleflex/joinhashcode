
interface PsychometricProperties {
  comportement: number; // 0-1
  capacite: number; // 0-1
  alignement: number; // 0-1
}

/**
 * Calcule le score de talent pour un individu en se basant sur des propriétés psychométriques et un score de confiance.
 * Pondération: 45% Comportement, 35% Capacité, 20% Alignement.
 * Un boost de 1.1x est appliqué si le score de confiance est supérieur à 0.7.
 *
 * @param psychometricProperties - Un objet contenant les scores de comportement, capacité et alignement (entre 0 et 1).
 * @param levelXp - Le niveau d'expérience (non utilisé dans le calcul actuel mais peut être étendu).
 * @param confidenceScore - Le score de confiance (entre 0 et 1).
 * @returns Le score de talent calculé.
 */
export function calculateTalentScore(
  psychometricProperties: PsychometricProperties,
  levelXp: number,
  confidenceScore: number
): number {
  const { comportement, capacite, alignement } = psychometricProperties;

  // Appliquer les pondérations
  let score =
    (comportement * 0.45) +
    (capacite * 0.35) +
    (alignement * 0.20);

  // Appliquer le boost de confiance
  if (confidenceScore > 0.7) {
    score *= 1.1;
  }

  // Normaliser le score si nécessaire, bien qu'avec les inputs 0-1 et les poids, il devrait rester dans une plage raisonnable.
  // Pour l'instant, on suppose que le score max est 1 (si tous les inputs sont 1).
  return score;
}

import { MISSIONS, Mission } from "./missions";
import { BehavioralVibrancy } from "./evolution";

/**
 * Algorithme "For You Page" pour les missions HASHCODE.
 * Sélectionne les missions les plus pertinentes basées sur la Vibrancy comportementale
 * et le profil utilisateur.
 */
export function getRecommendedMissions(
  userVibrancy: BehavioralVibrancy | null,
  userClass: string | null,
  userLevel: number,
  completedMissionIds: string[],
  limit: number = 3
): Mission[] {
  // 1. Filtrer les missions disponibles (niveau requis + non complétées)
  const availableMissions = MISSIONS.filter(m => 
    m.requiredLevel <= userLevel && 
    !completedMissionIds.includes(m.id)
  );

  if (availableMissions.length === 0) return [];

  // 2. Calculer un score de pertinence pour chaque mission
  const scoredMissions = availableMissions.map(mission => {
    let score = 0;

    // A. Bonus de Profil Initial (Poids: 30%)
    if (userClass && mission.targetProfiles.includes(userClass.toLowerCase() as any)) {
      score += 30;
    }

    // B. Bonus de Vibrancy Comportementale (Poids: 50%)
    // Si l'utilisateur fait beaucoup de "Builder", on lui propose plus de "Builder"
    if (userVibrancy) {
      const missionWeights = {
        builder: mission.weightBuilder || 0,
        creator: mission.weightCreator || 0,
        strategist: mission.weightStrategist || 0,
        catalyst: mission.weightCatalyst || 0,
      };

      // Calculer le produit scalaire (dot product) entre vibrancy et mission weights
      const vibrancyScore = 
        (userVibrancy.builder * missionWeights.builder) +
        (userVibrancy.creator * missionWeights.creator) +
        (userVibrancy.strategist * missionWeights.strategist) +
        (userVibrancy.catalyst * missionWeights.catalyst);
      
      score += vibrancyScore * 10; // Multiplicateur pour équilibrer
    }

    // C. Facteur Aléatoire (Poids: 20%) - Pour la découverte (Serendipity)
    // Évite de rester enfermé dans une bulle de filtres
    score += Math.random() * 20;

    return { mission, score };
  });

  // 3. Trier par score décroissant et retourner le top
  return scoredMissions
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(sm => sm.mission);
}

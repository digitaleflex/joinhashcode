import { MISSIONS, Mission } from "./missions";

export function getRecommendedMissions(
  userVibrancy: unknown,
  userClass: string | null,
  userLevel: number,
  completedMissionIds: string[],
  limit: number = 3
): Mission[] {
  const available = MISSIONS.filter(m =>
    m.requiredLevel <= userLevel &&
    !completedMissionIds.includes(m.id) &&
    !completedMissionIds.includes(m.slug)
  );

  if (available.length === 0) return [];

  // FORCE: Quick Win for new users (Signal d'Ouverture)
  const quickWin = available.find(m => m.id === "signal-ouverture");
  const filteredAvailable = available.filter(m => m.id !== "signal-ouverture");

  // Priorité aux missions du profil de l'utilisateur, puis les autres
  const aligned = filteredAvailable.filter(m =>
    userClass && m.targetProfiles.includes(userClass.toLowerCase() as any)
  );
  const others = filteredAvailable.filter(m =>
    !userClass || !m.targetProfiles.includes(userClass.toLowerCase() as any)
  );

  const finalMissions = quickWin ? [quickWin, ...aligned, ...others] : [...aligned, ...others];

  return finalMissions.slice(0, limit);
}

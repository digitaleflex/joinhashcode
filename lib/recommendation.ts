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
    !completedMissionIds.includes(m.id)
  );

  if (available.length === 0) return [];

  // Priorité aux missions du profil de l'utilisateur, puis les autres
  const aligned = available.filter(m =>
    userClass && m.targetProfiles.includes(userClass.toLowerCase() as any)
  );
  const others = available.filter(m =>
    !userClass || !m.targetProfiles.includes(userClass.toLowerCase() as any)
  );

  return [...aligned, ...others].slice(0, limit);
}

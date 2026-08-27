import { prisma } from "./prisma";
import { MISSIONS, type Mission, type MissionType } from "./missions";

export type UserProfileClass = "builder" | "creator" | "strategist" | "catalyst";

export interface RecommendedMission {
  mission: Mission;
  matchScore: number;
  matchReasons: string[];
}

const PROFILE_TO_MISSION_TYPE: Record<UserProfileClass, MissionType[]> = {
  builder: ["CODE", "PRODUCT", "GENERAL"],
  creator: ["DESIGN", "PRODUCT", "GENERAL"],
  strategist: ["BUSINESS", "PRODUCT", "GENERAL"],
  catalyst: ["NETWORK", "GENERAL"],
};

const PROFILE_WEIGHTS: Record<UserProfileClass, Record<string, number>> = {
  builder: { builder: 1.0, creator: 0.3, strategist: 0.4, catalyst: 0.2 },
  creator: { builder: 0.3, creator: 1.0, strategist: 0.3, catalyst: 0.4 },
  strategist: { builder: 0.4, creator: 0.3, strategist: 1.0, catalyst: 0.3 },
  catalyst: { builder: 0.2, creator: 0.4, strategist: 0.3, catalyst: 1.0 },
};

function calculateVibrancyScore(
  userVibrancy: { builder: number; creator: number; strategist: number; catalyst: number },
  profile: UserProfileClass
): number {
  const weights = PROFILE_WEIGHTS[profile];
  return (
    (userVibrancy.builder ?? 0) * weights.builder +
    (userVibrancy.creator ?? 0) * weights.creator +
    (userVibrancy.strategist ?? 0) * weights.strategist +
    (userVibrancy.catalyst ?? 0) * weights.catalyst
  );
}

function getMissionTypeMatchScore(mission: Mission, profile: UserProfileClass): number {
  const preferredTypes = PROFILE_TO_MISSION_TYPE[profile];
  if (preferredTypes.includes(mission.type)) {
    return 1.0;
  }
  if (mission.targetProfiles.includes(profile)) {
    return 0.7;
  }
  return 0.2;
}

function getMissionLevelMatchScore(mission: Mission, userLevel: number): number {
  const requiredLevel = mission.requiredLevel ?? 1;
  if (userLevel >= requiredLevel + 2) return 0.5;
  if (userLevel >= requiredLevel) return 1.0;
  if (userLevel >= requiredLevel - 1) return 0.7;
  return 0.1;
}

function getVibrancyMatchScore(mission: Mission, userVibrancy: { builder: number; creator: number; strategist: number; catalyst: number }): number {
  const missionWeights = {
    builder: mission.weightBuilder ?? 0,
    creator: mission.weightCreator ?? 0,
    strategist: mission.weightStrategist ?? 0,
    catalyst: mission.weightCatalyst ?? 0,
  };

  const totalWeight = missionWeights.builder + missionWeights.creator + missionWeights.strategist + missionWeights.catalyst;
  if (totalWeight === 0) return 0.5;

  const score =
    (userVibrancy.builder * missionWeights.builder) +
    (userVibrancy.creator * missionWeights.creator) +
    (userVibrancy.strategist * missionWeights.strategist) +
    (userVibrancy.catalyst * missionWeights.catalyst);

  const maxPossibleScore = Math.max(
    userVibrancy.builder,
    userVibrancy.creator,
    userVibrancy.strategist,
    userVibrancy.catalyst
  ) * totalWeight;

  return maxPossibleScore > 0 ? Math.min(1, score / maxPossibleScore) : 0.5;
}

export async function getRecommendedMissions(userId: string, limit: number = 5): Promise<RecommendedMission[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      class: true,
      level: true,
      behavioralVibrancy: true,
      missionSubmissions: {
        where: { status: "APPROVED" },
        select: { missionId: true },
      },
    },
  });

  if (!user) return [];

  const userClass = (user.class ?? "builder") as UserProfileClass;
  const userLevel = user.level ?? 1;
  const userVibrancy = (user.behavioralVibrancy as unknown as { builder: number; creator: number; strategist: number; catalyst: number }) || {
    builder: 0,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  const completedMissionIds = new Set(user.missionSubmissions.map((s) => s.missionId));

  const availableMissions = MISSIONS.filter(
    (m) => !m.comingSoon && !completedMissionIds.has(m.id)
  );

  const scoredMissions = availableMissions.map((mission) => {
    const typeScore = getMissionTypeMatchScore(mission, userClass);
    const levelScore = getMissionLevelMatchScore(mission, userLevel);
    const vibrancyScore = getVibrancyMatchScore(mission, userVibrancy);

    const matchScore = Math.round((typeScore * 0.4 + levelScore * 0.3 + vibrancyScore * 0.3) * 100);

    const reasons: string[] = [];
    if (typeScore >= 0.7) reasons.push(`Matches your ${userClass} profile`);
    if (levelScore >= 0.7) reasons.push("Right difficulty for your level");
    if (vibrancyScore >= 0.6) reasons.push("Aligns with your behavioral strengths");

    return {
      mission,
      matchScore,
      matchReasons: reasons.length > 0 ? reasons : ["Available for your profile"],
    };
  });

  scoredMissions.sort((a, b) => b.matchScore - a.matchScore);

  return scoredMissions.slice(0, limit);
}

export async function getMissionRecommendationsByCategory(
  userId: string,
  category: MissionType,
  limit: number = 3
): Promise<RecommendedMission[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      class: true,
      level: true,
      behavioralVibrancy: true,
      missionSubmissions: {
        where: { status: "APPROVED" },
        select: { missionId: true },
      },
    },
  });

  if (!user) return [];

  const userClass = (user.class ?? "builder") as UserProfileClass;
  const userLevel = user.level ?? 1;
  const userVibrancy = (user.behavioralVibrancy as unknown as { builder: number; creator: number; strategist: number; catalyst: number }) || {
    builder: 0,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  const completedMissionIds = new Set(user.missionSubmissions.map((s) => s.missionId));

  const availableMissions = MISSIONS.filter(
    (m) => m.type === category && !m.comingSoon && !completedMissionIds.has(m.id)
  );

  const scoredMissions = availableMissions.map((mission) => {
    const typeScore = getMissionTypeMatchScore(mission, userClass);
    const levelScore = getMissionLevelMatchScore(mission, userLevel);
    const vibrancyScore = getVibrancyMatchScore(mission, userVibrancy);

    const matchScore = Math.round((typeScore * 0.4 + levelScore * 0.3 + vibrancyScore * 0.3) * 100);

    const reasons: string[] = [];
    if (typeScore >= 0.7) reasons.push(`Matches your ${userClass} profile`);
    if (levelScore >= 0.7) reasons.push("Right difficulty for your level");
    if (vibrancyScore >= 0.6) reasons.push("Aligns with your behavioral strengths");

    return {
      mission,
      matchScore,
      matchReasons: reasons.length > 0 ? reasons : ["Available for your profile"],
    };
  });

  scoredMissions.sort((a, b) => b.matchScore - a.matchScore);

  return scoredMissions.slice(0, limit);
}
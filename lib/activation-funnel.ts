import { prisma } from "./prisma";

export type FunnelStage =
  | "landing"
  | "signin"
  | "quiz"
  | "profile_choice"
  | "orientation"
  | "first_atelier"
  | "first_evidence";

export interface FunnelStats {
  stage: FunnelStage;
  count: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface UserFunnelStage {
  userId: string;
  currentStage: FunnelStage;
  completedStages: FunnelStage[];
  stageTimestamps: Record<FunnelStage, string | null>;
}

const STAGE_ORDER: FunnelStage[] = [
  "landing",
  "signin",
  "quiz",
  "profile_choice",
  "orientation",
  "first_atelier",
  "first_evidence",
];

const STAGE_THRESHOLDS: Record<FunnelStage, number> = {
  landing: 100,
  signin: 100,
  quiz: 60,
  profile_choice: 100,
  orientation: 40,
  first_atelier: 40,
  first_evidence: 30,
};

function getStageIndex(stage: FunnelStage): number {
  return STAGE_ORDER.indexOf(stage);
}

async function countUsersAtOrBeyondStage(stage: FunnelStage, startDate: Date, endDate: Date): Promise<number> {
  const idx = getStageIndex(stage);
  if (idx === -1) return 0;

  if (stage === "landing") {
    return prisma.activityLog.count({
      where: {
        action: "USER_SIGNUP",
        createdAt: { gte: startDate, lte: endDate },
      },
    });
  }

  if (stage === "signin") {
    return prisma.activityLog.count({
      where: {
        action: "USER_SIGNIN",
        createdAt: { gte: startDate, lte: endDate },
      },
    });
  }

  if (stage === "quiz") {
    return prisma.quizResult.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    });
  }

  if (stage === "profile_choice") {
    return prisma.user.count({
      where: {
        class: { not: null },
        createdAt: { gte: startDate, lte: endDate },
      },
    });
  }

  if (stage === "orientation") {
    return prisma.activityLog.count({
      where: {
        action: "POST_QUIZ_COMPLETED",
        createdAt: { gte: startDate, lte: endDate },
      },
    });
  }

  if (stage === "first_atelier") {
    return prisma.missionAttempt.count({
      where: {
        status: { in: ["SUBMITTED", "APPROVED"] },
        submittedAt: { gte: startDate, lte: endDate },
        mission: { isOnboarding: true },
      },
    });
  }

  if (stage === "first_evidence") {
    return prisma.missionSubmission.count({
      where: {
        status: "APPROVED",
        createdAt: { gte: startDate, lte: endDate },
        mission: { isOnboarding: true },
      },
    });
  }

  return 0;
}

export async function getFunnelStats(
  startDate: Date,
  endDate: Date
): Promise<FunnelStats[]> {
  const counts: Record<FunnelStage, number> = {} as Record<FunnelStage, number>;

  for (const stage of STAGE_ORDER) {
    counts[stage] = await countUsersAtOrBeyondStage(stage, startDate, endDate);
  }

  const stats: FunnelStats[] = [];
  const landingCount = counts.landing || 1;

  for (let i = 0; i < STAGE_ORDER.length; i++) {
    const stage = STAGE_ORDER[i];
    const count = counts[stage];
    const conversionRate = landingCount > 0 ? (count / landingCount) * 100 : 0;
    let dropOffRate = 0;

    if (i > 0) {
      const prevCount = counts[STAGE_ORDER[i - 1]];
      if (prevCount > 0) {
        dropOffRate = ((prevCount - count) / prevCount) * 100;
      }
    }

    stats.push({
      stage,
      count,
      conversionRate: Math.round(conversionRate * 100) / 100,
      dropOffRate: Math.round(dropOffRate * 100) / 100,
    });
  }

  return stats;
}

export function getStageThreshold(stage: FunnelStage): number {
  return STAGE_THRESHOLDS[stage];
}

export function isStageHealthy(stage: FunnelStage, conversionRate: number): boolean {
  return conversionRate >= STAGE_THRESHOLDS[stage];
}
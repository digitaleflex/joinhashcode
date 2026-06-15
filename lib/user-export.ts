import { prisma } from "./prisma";

const PROFILE_INCLUDE = {
  psychometrics: {
    select: { builderScore: true, creatorScore: true, strategistScore: true, catalystScore: true, confidenceScore: true },
  },
  socials: {
    select: { githubUrl: true, linkedinUrl: true, twitterUrl: true, portfolioUrl: true },
  },
  stats: {
    select: { currentStreak: true, longestStreak: true, lastCheckinAt: true, lastStreakDate: true },
  },
} as const;

export async function collectUserData(userId: string) {
  const [
    raw,
    quizResults,
    submissions,
    checkins,
    squadMember,
    activityLogs,
    notifications,
    feedbacks,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, include: PROFILE_INCLUDE }),
    prisma.quizResult.findMany({
      where: { userId },
      select: { id: true, profileType: true, score: true, answers: true, createdAt: true, averageResponseTime: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.missionSubmission.findMany({
      where: { userId },
      select: {
        id: true, status: true, content: true, xpAwarded: true, qualityLevel: true,
        revisionCount: true, userDifficulty: true, userRating: true, userFeedback: true,
        improvementSuggestions: true, createdAt: true, updatedAt: true,
        mission: { select: { title: true, category: true, xp: true, missionLevel: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.dailyCheckin.findMany({
      where: { userId },
      select: { id: true, note: true, domain: true, energy: true, duration: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.member.findFirst({
      where: { userId },
      select: {
        role: true,
        createdAt: true,
        organization: { select: { name: true, slug: true, cohesionScore: true, streakCount: true, createdAt: true } },
      },
    }),
    prisma.activityLog.findMany({
      where: { userId },
      select: { action: true, entity: true, entityId: true, metadata: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 2000,
    }),
    prisma.notification.findMany({
      where: { userId },
      select: { type: true, title: true, message: true, isRead: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
    prisma.betaFeedback.findMany({
      where: { userId },
      select: { type: true, content: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const profile = raw ? {
    ...raw,
    ...raw.psychometrics,
    ...raw.socials,
    ...raw.stats,
    psychometrics: undefined,
    socials: undefined,
    stats: undefined,
  } : null

  return {
    exportedAt: new Date().toISOString(),
    platform: "HASHCODE",
    version: "1.0",
    profile,
    quiz: quizResults,
    missions: submissions,
    checkins,
    squad: squadMember
      ? { role: squadMember.role, joinedAt: squadMember.createdAt, organization: squadMember.organization }
      : null,
    activity: activityLogs,
    notifications,
    feedback: feedbacks,
  };
}

import { prisma } from "./prisma";

const PROFILE_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
  createdAt: true,
  updatedAt: true,
  level: true,
  experience: true,
  class: true,
  role: true,
  memberNumber: true,
  // Psychometric scores
  builderScore: true,
  creatorScore: true,
  strategistScore: true,
  catalystScore: true,
  confidenceScore: true,
  // Profile details
  city: true,
  country: true,
  language: true,
  bio: true,
  pseudo: true,
  githubUrl: true,
  linkedinUrl: true,
  twitterUrl: true,
  portfolioUrl: true,
  // Career
  currentSituation: true,
  mainObjective: true,
  secondaryObjectives: true,
  dreamStatement: true,
  currentFocus: true,
  mainBlocker: true,
  technicalLevel: true,
  domains: true,
  tools: true,
  badges: true,
  // Progression
  missionsCompletedCount: true,
  reviewsCompleted: true,
  currentStreak: true,
  longestStreak: true,
  lastCheckinAt: true,
  lastStreakDate: true,
} as const;

export async function collectUserData(userId: string) {
  const [
    profile,
    quizResults,
    submissions,
    checkins,
    guildMember,
    activityLogs,
    notifications,
    feedbacks,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: PROFILE_SELECT }),
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
    prisma.guildMember.findFirst({
      where: { userId },
      select: {
        role: true,
        joinedAt: true,
        guild: { select: { name: true, slug: true, cohesionScore: true, streakCount: true, createdAt: true } },
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

  return {
    exportedAt: new Date().toISOString(),
    platform: "HASHCODE",
    version: "1.0",
    profile,
    quiz: quizResults,
    missions: submissions,
    checkins,
    squad: guildMember
      ? { role: guildMember.role, joinedAt: guildMember.joinedAt, guild: guildMember.guild }
      : null,
    activity: activityLogs,
    notifications,
    feedback: feedbacks,
  };
}

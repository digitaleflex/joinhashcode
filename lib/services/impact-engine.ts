import { prisma } from '../prisma';

export const IMPACT_WEIGHTS = {
  xp: 0.40,
  consistency: 0.20,
  quality: 0.15,
  contribution: 0.15,
  trust: 0.10
};

export async function calculateImpact(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // 1. XP Score (40%)
  const xpData = await prisma.xpTransaction.aggregate({
    where: { userId, createdAt: { gte: startDate } },
    _sum: { amount: true }
  });
  const totalXp = xpData._sum.amount || 0;
  const xpScore = totalXp * 0.1;

  // 5. Trust Score (10%)
  const psychometric = await prisma.psychometric.findUnique({
    where: { userId }
  });
  const trustScore = (psychometric?.confidenceScore || 0) * 100;

  // Partial Score (Remaining components are 0 for now)
  const totalScore = (xpScore * IMPACT_WEIGHTS.xp) + (trustScore * IMPACT_WEIGHTS.trust);
  
  return totalScore;
}

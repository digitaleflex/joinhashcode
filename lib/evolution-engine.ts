import { prisma } from './prisma';
import { BehavioralVibrancy, updateVibrancyWithDecay, calculateDrift } from './evolution';
import { ProfileType } from './analysis';

export const CHECKIN_WEIGHTS: Record<string, Partial<BehavioralVibrancy>> = {
  'Code': { builder: 1 },
  'Design': { creator: 1 },
  'Business': { strategist: 1 },
  'Community': { catalyst: 1 },
  'Growth': { strategist: 0.7, catalyst: 0.3 },
  'Product': { strategist: 0.5, builder: 0.5 },
};

export function calculateNewVibrancy(
  currentVibrancy: BehavioralVibrancy,
  actionWeights: BehavioralVibrancy,
  lastUpdate: Date | null = null
) {
  return updateVibrancyWithDecay(currentVibrancy, actionWeights, lastUpdate).vibrancy;
}

export function calculateDriftScore(
  quizScores: { builderScore: number; creatorScore: number; strategistScore: number; catalystScore: number },
  vibrancy: BehavioralVibrancy
) {
  const total = quizScores.builderScore + quizScores.creatorScore + quizScores.strategistScore + quizScores.catalystScore || 1;
  const quizPercentages: Record<ProfileType, number> = {
    builder: (quizScores.builderScore / total) * 100,
    creator: (quizScores.creatorScore / total) * 100,
    strategist: (quizScores.strategistScore / total) * 100,
    catalyst: (quizScores.catalystScore / total) * 100,
  };
  return calculateDrift(quizPercentages, vibrancy);
}

export async function updateUserEvolution(
  userId: string,
  actionWeights: BehavioralVibrancy,
  confidenceGain: number,
  tx?: any
) {
  const client = tx || prisma;
  
  const user = await client.user.findUnique({
    where: { id: userId },
    select: {
      behavioralVibrancy: true,
      confidenceScore: true,
      lastHypothesisUpdate: true,
      builderScore: true,
      creatorScore: true,
      strategistScore: true,
      catalystScore: true,
      class: true,
    }
  });

  if (!user) return;

  const currentVibrancy = (user.behavioralVibrancy as any) || {
    builder: 0,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  const newVibrancy = calculateNewVibrancy(currentVibrancy, actionWeights, user.lastHypothesisUpdate);
  const newDrift = calculateDriftScore(
    {
      builderScore: user.builderScore,
      creatorScore: user.creatorScore,
      strategistScore: user.strategistScore,
      catalystScore: user.catalystScore,
    },
    newVibrancy
  );

  const newConfidence = Math.min(user.confidenceScore + confidenceGain, 1.0);

  return await client.user.update({
    where: { id: userId },
    data: {
      behavioralVibrancy: newVibrancy as any,
      confidenceScore: newConfidence,
      profileDrift: newDrift,
      lastHypothesisUpdate: new Date(),
    }
  });
}

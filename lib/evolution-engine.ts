import { prisma } from './prisma';
import { BehavioralVibrancy, updateVibrancyWithDecay } from './evolution';

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
  const newConfidence = Math.min(user.confidenceScore + confidenceGain, 1.0);

  return await client.user.update({
    where: { id: userId },
    data: {
      behavioralVibrancy: newVibrancy as any,
      confidenceScore: newConfidence,
      lastHypothesisUpdate: new Date(),
    }
  });
}

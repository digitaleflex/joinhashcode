import { prisma } from './prisma';
import { BehavioralVitality } from './types';
import { Prisma } from '../generated/prisma/client';

export const CHECKIN_WEIGHTS: Record<string, Partial<BehavioralVitality>> = {
  'Code': { builder: 1 },
  'Design': { creator: 1 },
  'Business': { strategist: 1 },
  'Community': { catalyst: 1 },
  'Growth': { strategist: 0.7, catalyst: 0.3 },
  'Product': { strategist: 0.5, builder: 0.5 },
};

export { LEVEL_THRESHOLDS, getLevelProgress } from './level-utils';

export async function updateUserEvolution(
  userId: string,
  actionWeights: BehavioralVitality,
  confidenceGain: number,
  tx?: Prisma.TransactionClient
) {
  const client = tx || prisma;

  const user = await client.user.findUnique({
    where: { id: userId },
    select: {
      behavioralVibrancy: true,
      builderScore: true,
      creatorScore: true,
      strategistScore: true,
      catalystScore: true,
      confidenceScore: true,
    }
  });

  if (!user) return;

  const currentVitality = (user.behavioralVibrancy as unknown as BehavioralVitality) || {
    builder: 0,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  const newVitality = {
    builder: currentVitality.builder + (actionWeights.builder || 0),
    creator: currentVitality.creator + (actionWeights.creator || 0),
    strategist: currentVitality.strategist + (actionWeights.strategist || 0),
    catalyst: currentVitality.catalyst + (actionWeights.catalyst || 0),
  };
  const newConfidence = Math.min((user.confidenceScore ?? 0.25) + confidenceGain, 1.0);

  await client.user.update({
    where: { id: userId },
    data: {
      behavioralVibrancy: newVitality as unknown as Prisma.InputJsonValue,
      builderScore: { increment: actionWeights.builder || 0 },
      creatorScore: { increment: actionWeights.creator || 0 },
      strategistScore: { increment: actionWeights.strategist || 0 },
      catalystScore: { increment: actionWeights.catalyst || 0 },
      confidenceScore: newConfidence,
    }
  });
}

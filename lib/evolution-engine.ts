import { prisma } from './prisma';
import { BehavioralVibrancy, updateVibrancyWithDecay } from './evolution';
import { Prisma } from '../generated/prisma';

export const CHECKIN_WEIGHTS: Record<string, Partial<BehavioralVibrancy>> = {
  'Code': { builder: 1 },
  'Design': { creator: 1 },
  'Business': { strategist: 1 },
  'Community': { catalyst: 1 },
  'Growth': { strategist: 0.7, catalyst: 0.3 },
  'Product': { strategist: 0.5, builder: 0.5 },
};

export { LEVEL_THRESHOLDS, getLevelProgress } from './level-utils';

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
  tx?: Prisma.TransactionClient
) {
  const client = tx || prisma;

  const user = await client.user.findUnique({
    where: { id: userId },
    select: {
      behavioralVibrancy: true,
      lastHypothesisUpdate: true,
      psychometrics: {
        select: {
          confidenceScore: true,
        }
      }
    }
  });

  if (!user) return;

  const currentVibrancy = (user.behavioralVibrancy as unknown as BehavioralVibrancy) || {
    builder: 0,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  const newVibrancy = calculateNewVibrancy(currentVibrancy, actionWeights, user.lastHypothesisUpdate);
  const currentConfidence = user.psychometrics?.confidenceScore ?? 0.25;
  const newConfidence = Math.min(currentConfidence + confidenceGain, 1.0);

  // Update both User (vibrancy) and Psychometric (confidence)
  await client.user.update({
    where: { id: userId },
    data: {
      behavioralVibrancy: newVibrancy as unknown as Prisma.InputJsonValue,
      lastHypothesisUpdate: new Date(),
    }
  });

  return await client.psychometric.upsert({
    where: { userId },
    create: {
      userId,
      confidenceScore: newConfidence,
    },
    update: {
      confidenceScore: newConfidence,
    }
  });
}

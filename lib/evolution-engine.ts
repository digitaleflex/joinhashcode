import { prisma } from './prisma';
import { BehavioralVitality, updateVitalityWithDecay } from './evolution';
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

export function calculateNewVitality(
  currentVitality: BehavioralVitality,
  actionWeights: BehavioralVitality,
  lastUpdate: Date | null = null
) {
  return updateVitalityWithDecay(currentVitality, actionWeights, lastUpdate).vitality;
}

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
      lastHypothesisUpdate: true,
      psychometrics: {
        select: {
          confidenceScore: true,
        }
      }
    }
  });

  if (!user) return;

  const currentVitality = (user.behavioralVibrancy as unknown as BehavioralVitality) || {
    builder: 0,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  const newVitality = calculateNewVitality(currentVitality, actionWeights, user.lastHypothesisUpdate);
  const currentConfidence = user.psychometrics?.confidenceScore ?? 0.25;
  const newConfidence = Math.min(currentConfidence + confidenceGain, 1.0);

  // Update both User (vibrancy) and Psychometric (confidence)
  await client.user.update({
    where: { id: userId },
    data: {
      behavioralVibrancy: newVitality as unknown as Prisma.InputJsonValue,
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

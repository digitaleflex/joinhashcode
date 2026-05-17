import { describe, it, expect } from 'vitest';
import { calculateNewVibrancy, calculateDriftScore } from '../lib/evolution-engine';
import { BehavioralVibrancy } from '../lib/evolution';

describe('Evolution Engine Utilities', () => {
  it('should calculate new vibrancy correctly', () => {
    const currentVibrancy: BehavioralVibrancy = { builder: 10, creator: 5, strategist: 2, catalyst: 0 };
    const actionWeights: BehavioralVibrancy = { builder: 1, creator: 0, strategist: 0, catalyst: 0 };
    const result = calculateNewVibrancy(currentVibrancy, actionWeights);
    expect(result.builder).toBeGreaterThan(10);
  });

  it('should calculate drift correctly', () => {
    const quizScores = { builderScore: 100, creatorScore: 0, strategistScore: 0, catalystScore: 0 }; // 100% builder
    const vibrancy: BehavioralVibrancy = { builder: 0, creator: 100, strategist: 0, catalyst: 0 }; // 100% creator
    const drift = calculateDriftScore(quizScores, vibrancy);
    expect(drift).toBeCloseTo(1.0); // Max drift
  });
});

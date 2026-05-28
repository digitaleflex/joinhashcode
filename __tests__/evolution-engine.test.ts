import { describe, it, expect } from 'vitest';
import { calculateNewVibrancy } from '../lib/evolution-engine';
import { BehavioralVibrancy } from '../lib/evolution';

describe('Evolution Engine Utilities', () => {
  it('should calculate new vibrancy correctly', () => {
    const currentVibrancy: BehavioralVibrancy = { builder: 10, creator: 5, strategist: 2, catalyst: 0 };
    const actionWeights: BehavioralVibrancy = { builder: 1, creator: 0, strategist: 0, catalyst: 0 };
    const result = calculateNewVibrancy(currentVibrancy, actionWeights);
    expect(result.builder).toBeGreaterThan(10);
  });
});

import { describe, it, expect } from 'vitest';
import { calculateNewVitality } from '../lib/evolution-engine';
import { BehavioralVitality } from '../lib/evolution';

describe('Evolution Engine Utilities', () => {
  it('should calculate new vitality correctly', () => {
    const currentVitality: BehavioralVitality = { builder: 10, creator: 5, strategist: 2, catalyst: 0 };
    const actionWeights: BehavioralVitality = { builder: 1, creator: 0, strategist: 0, catalyst: 0 };
    const result = calculateNewVitality(currentVitality, actionWeights);
    expect(result.builder).toBeGreaterThan(10);
  });
});

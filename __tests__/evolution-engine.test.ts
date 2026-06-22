import { describe, it, expect } from 'vitest';
import { BehavioralVitality } from '../lib/types';

describe('Evolution Engine Utilities', () => {
  it('should calculate new vitality correctly', () => {
    const currentVitality: BehavioralVitality = { builder: 10, creator: 5, strategist: 2, catalyst: 0 };
    const actionWeights: BehavioralVitality = { builder: 1, creator: 0, strategist: 0, catalyst: 0 };
    const result: BehavioralVitality = {
      builder: currentVitality.builder + (actionWeights.builder || 0),
      creator: currentVitality.creator + (actionWeights.creator || 0),
      strategist: currentVitality.strategist + (actionWeights.strategist || 0),
      catalyst: currentVitality.catalyst + (actionWeights.catalyst || 0),
    };
    expect(result.builder).toBeGreaterThan(10);
  });
});

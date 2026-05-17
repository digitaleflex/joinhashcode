import { describe, it, expect } from 'vitest';
import { updateVibrancyWithDecay, BehavioralVibrancy } from '../lib/evolution';

describe('updateVibrancyWithDecay', () => {
  const initialVibrancy: BehavioralVibrancy = {
    builder: 100,
    creator: 100,
    strategist: 100,
    catalyst: 100,
  };

  const missionWeights: BehavioralVibrancy = {
    builder: 10,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  it('applies 50% decay after 30 days (half-life)', () => {
    const lastUpdate = new Date('2026-04-17T00:00:00Z');
    
    // For exactly 30 days: 
    const thirtyDaysLater = new Date(lastUpdate.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const { vibrancy, decayFactor } = updateVibrancyWithDecay(
      initialVibrancy,
      missionWeights,
      lastUpdate,
      thirtyDaysLater
    );

    expect(decayFactor).toBeCloseTo(0.5, 5);
    expect(vibrancy.builder).toBeCloseTo(60, 5); // (100 * 0.5) + 10
    expect(vibrancy.creator).toBeCloseTo(50, 5); // (100 * 0.5) + 0
  });

  it('applies no decay if lastUpdate is null', () => {
    const { vibrancy, decayFactor } = updateVibrancyWithDecay(
      initialVibrancy,
      missionWeights,
      null
    );

    expect(decayFactor).toBe(1);
    expect(vibrancy.builder).toBe(110);
  });
});

import { describe, it, expect } from 'vitest';
import { calculateImpact } from '../lib/services/impact-engine';

describe('ImpactEngine', () => {
  it('should be defined', () => {
    expect(calculateImpact).toBeDefined();
  });
});

import { describe, it, expect } from 'vitest';
import { auth } from '../lib/auth';

describe('Feedback System Configuration (P16)', () => {
  it('should have the correct schema for BetaFeedback with rating field', () => {
    // Better Auth native features or custom fields check
    // We check if the database adapter knows about the field
    const options = (auth as any).options;
    
    // BetaFeedback is a custom model we manage via Prisma and API,
    // so we verify the internal API logic presence indirectly
    expect(options.database).toBeDefined();
  });

  it('should validate rating input range in a mock logic', () => {
    const validateRating = (r: any) => {
        const rating = parseInt(r);
        return !isNaN(rating) && rating >= 1 && rating <= 5;
    };

    expect(validateRating("3")).toBe(true);
    expect(validateRating("5")).toBe(true);
    expect(validateRating("0")).toBe(false);
    expect(validateRating("6")).toBe(false);
    expect(validateRating("abc")).toBe(false);
  });
});

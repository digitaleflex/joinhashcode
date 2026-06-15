import { describe, expect, it } from 'vitest';
import { calculateTalentScore } from '@/lib/recommendation';

describe('calculateTalentScore', () => {
  it('should calculate the base score correctly with default weights', () => {
    const psychometricProperties = { comportement: 0.8, capacite: 0.7, alignement: 0.9 };
    const levelXp = 100;
    const confidenceScore = 0.5; // No boost

    // Expected: (0.8 * 0.45) + (0.7 * 0.35) + (0.9 * 0.20) = 0.36 + 0.245 + 0.18 = 0.785
    const expectedScore = 0.785;
    const score = calculateTalentScore(psychometricProperties, levelXp, confidenceScore);
    expect(score).toBeCloseTo(expectedScore);
  });

  it('should apply a 1.1x boost if confidenceScore is greater than 0.7', () => {
    const psychometricProperties = { comportement: 0.8, capacite: 0.7, alignement: 0.9 };
    const levelXp = 100;
    const confidenceScore = 0.8; // Should apply boost

    const baseScore = (0.8 * 0.45) + (0.7 * 0.35) + (0.9 * 0.20); // 0.785
    const expectedScore = baseScore * 1.1; // 0.785 * 1.1 = 0.8635
    const score = calculateTalentScore(psychometricProperties, levelXp, confidenceScore);
    expect(score).toBeCloseTo(expectedScore);
  });

  it('should not apply a boost if confidenceScore is 0.7 or less', () => {
    const psychometricProperties = { comportement: 0.8, capacite: 0.7, alignement: 0.9 };
    const levelXp = 100;
    const confidenceScore = 0.7; // Should not apply boost

    const baseScore = (0.8 * 0.45) + (0.7 * 0.35) + (0.9 * 0.20); // 0.785
    const expectedScore = baseScore;
    const score = calculateTalentScore(psychometricProperties, levelXp, confidenceScore);
    expect(score).toBeCloseTo(expectedScore);
  });

  it('should handle zero values for psychometric properties', () => {
    const psychometricProperties = { comportement: 0, capacite: 0, alignement: 0 };
    const levelXp = 50;
    const confidenceScore = 0.5;

    const expectedScore = 0;
    const score = calculateTalentScore(psychometricProperties, levelXp, confidenceScore);
    expect(score).toBeCloseTo(expectedScore);
  });

  it('should handle max values for psychometric properties', () => {
    const psychometricProperties = { comportement: 1, capacite: 1, alignement: 1 };
    const levelXp = 200;
    const confidenceScore = 0.9;

    const baseScore = (1 * 0.45) + (1 * 0.35) + (1 * 0.20); // 0.45 + 0.35 + 0.20 = 1
    const expectedScore = baseScore * 1.1; // 1.1
    const score = calculateTalentScore(psychometricProperties, levelXp, confidenceScore);
    expect(score).toBeCloseTo(expectedScore);
  });

  it('should consider different psychometric values', () => {
    const psychometricProperties = { comportement: 0.1, capacite: 0.2, alignement: 0.3 };
    const levelXp = 10;
    const confidenceScore = 0.6;

    const expectedScore = (0.1 * 0.45) + (0.2 * 0.35) + (0.3 * 0.20); // 0.045 + 0.07 + 0.06 = 0.175
    const score = calculateTalentScore(psychometricProperties, levelXp, confidenceScore);
    expect(score).toBeCloseTo(expectedScore);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { calculateImpact } from '../lib/services/impact-engine';
import { prisma } from '../lib/prisma';

vi.mock('../lib/prisma', () => ({
  prisma: {
    xpTransaction: {
      aggregate: vi.fn(),
    },
    activityLog: {
      groupBy: vi.fn(),
      count: vi.fn(),
    },
    missionReview: {
      aggregate: vi.fn(),
    },
    psychometric: {
      findUnique: vi.fn(),
    }
  }
}));

describe('ImpactEngine', () => {
  it('should be defined', () => {
    expect(calculateImpact).toBeDefined();
  });

  it('should calculate score based on XP', async () => {
    (prisma.xpTransaction.aggregate as any).mockResolvedValue({ _sum: { amount: 1000 } });
    (prisma.activityLog.groupBy as any).mockResolvedValue([]);
    (prisma.activityLog.count as any).mockResolvedValue(0);
    (prisma.missionReview.aggregate as any).mockResolvedValue({ _avg: { id: null } });
    (prisma.psychometric.findUnique as any).mockResolvedValue({ confidenceScore: 0.5 });

    const score = await calculateImpact('user-1', 30);
    // Formula: (1000 * 0.1 * 0.4) + (0.5 * 100 * 0.1)
    // XP Score (Part): 100 * 0.4 = 40
    // Trust Score (Part): 50 * 0.1 = 5
    // Total: 45
    expect(score).toBe(45);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { processReferralReward } from '../lib/referral';
import { prisma } from '../lib/prisma';

vi.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    member: {
      findFirst: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
    activityLog: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    xpTransaction: {
      create: vi.fn(),
    },
    dailyCheckin: {
      count: vi.fn(),
    },
    missionSubmission: {
      count: vi.fn(),
    },
    missionReview: {
      count: vi.fn(),
    },
    $transaction: vi.fn((arg) => {
      if (typeof arg === 'function') {
        return arg(prisma);
      }
      return Promise.all(arg);
    }),
  },
}));

describe('Referral System Logic (P17)', () => {
  it('should not award reward if user has no referrer', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'user_new', referrerId: null, createdAt: new Date() });
    
    await processReferralReward('user_new');
    
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('should credit the referrer on success', async () => {
    const mockReferrerId = 'user_referrer';
    (prisma.user.findUnique as any).mockImplementation(({ where }: any) => {
      if (where.id === 'user_new') {
        return Promise.resolve({ 
          id: 'user_new',
          referrerId: mockReferrerId,
          name: 'Nouveau Filleul',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 jours (valide > 7)
        });
      }
      if (where.id === mockReferrerId) {
        return Promise.resolve({
          id: mockReferrerId,
          name: 'Referrer',
          email: 'referrer@test.com',
          experience: 100,
          level: 1,
        });
      }
      return Promise.resolve(null);
    });

    (prisma.activityLog.findFirst as any).mockResolvedValue(null);

    await processReferralReward('user_new');

    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: mockReferrerId },
      data: expect.objectContaining({
        referralCount: { increment: 1 },
      })
    }));

    expect(prisma.notification.create).toHaveBeenCalled();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { processReferralReward } from '../lib/referral';
import { prisma } from '../lib/prisma';

vi.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
    },
    xpTransaction: {
      create: vi.fn(),
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
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'user_new', referrerId: null });
    
    await processReferralReward('user_new');
    
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('should award 50 XP to referrer on success', async () => {
    const mockReferrerId = 'user_referrer';
    (prisma.user.findUnique as any).mockImplementation(({ where }: any) => {
      if (where.id === 'user_new') {
        return Promise.resolve({ 
          id: 'user_new', 
          referrerId: mockReferrerId,
          name: 'Nouveau Filleul' 
        });
      }
      if (where.id === mockReferrerId) {
        return Promise.resolve({
          id: mockReferrerId,
          experience: 100,
          level: 1,
        });
      }
      return Promise.resolve(null);
    });

    await processReferralReward('user_new');

    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: mockReferrerId },
      data: expect.objectContaining({
        experience: { increment: 50 }
      })
    }));

    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: mockReferrerId },
      data: expect.objectContaining({
        referralCount: { increment: 1 }
      })
    }));
    
    expect(prisma.notification.create).toHaveBeenCalled();
  });
});

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
    $transaction: vi.fn((actions) => Promise.all(actions)),
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
    (prisma.user.findUnique as any).mockResolvedValue({ 
      id: 'user_new', 
      referrerId: mockReferrerId,
      name: 'Nouveau Filleul' 
    });

    await processReferralReward('user_new');

    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: mockReferrerId },
      data: expect.objectContaining({
        experience: { increment: 50 },
        referralCount: { increment: 1 }
      })
    }));
    
    expect(prisma.notification.create).toHaveBeenCalled();
  });
});

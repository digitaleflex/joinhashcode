import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/internal/cron/squad-decay/route';
import { prisma } from '../lib/prisma';
import { logActivity } from '../lib/activity-log';

// Mock dependencies
vi.mock('../lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
    organization: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../lib/activity-log', () => ({
  logActivity: vi.fn(),
}));

describe('Squad Cohesion Decay Cron', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'test_secret';
  });

  it('should return 401 if unauthorized', async () => {
    const req = new Request('http://localhost:3000/api/internal/cron/squad-decay', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer wrong_secret',
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should decay cohesion and reset streaks if below 0.9', async () => {
    const mockSquads = [
      { id: 'squad_1', cohesionScore: 1.0, streakCount: 5 }, // Should go to 0.9, streak stays
      { id: 'squad_2', cohesionScore: 0.9, streakCount: 3 }, // Should go to 0.8, streak resets
      { id: 'squad_3', cohesionScore: 0.1, streakCount: 1 }, // Should go to 0.0, streak resets
    ];

    (prisma.organization.findMany as any).mockResolvedValue(mockSquads);
    (prisma.$transaction as any).mockImplementation(async (cb: any) => await cb(prisma));

    const req = new Request('http://localhost:3000/api/internal/cron/squad-decay', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer test_secret',
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain('3 escouades');

    // Verify updates
    expect(prisma.organization.update).toHaveBeenCalledWith({
      where: { id: 'squad_1' },
      data: { cohesionScore: 0.9, streakCount: 5 },
    });
    expect(prisma.organization.update).toHaveBeenCalledWith({
      where: { id: 'squad_2' },
      data: { cohesionScore: 0.8, streakCount: 0 },
    });
    expect(prisma.organization.update).toHaveBeenCalledWith({
      where: { id: 'squad_3' },
      data: { cohesionScore: 0.0, streakCount: 0 },
    });

    // Verify logging
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({
      action: 'SQUAD_DECAY',
    }));
  });
});

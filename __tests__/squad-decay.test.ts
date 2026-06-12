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
      updateMany: vi.fn(),
      count: vi.fn(),
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
    (prisma.organization.count as any).mockResolvedValue(3);

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
    expect(prisma.organization.updateMany).toHaveBeenCalledTimes(3);

    expect(prisma.organization.updateMany).toHaveBeenNthCalledWith(1, {
      data: { cohesionScore: { decrement: 0.1 } },
    });
    expect(prisma.organization.updateMany).toHaveBeenNthCalledWith(2, {
      where: { cohesionScore: { lt: 0 } },
      data: { cohesionScore: 0 },
    });
    expect(prisma.organization.updateMany).toHaveBeenNthCalledWith(3, {
      where: { cohesionScore: { lt: 0.9 } },
      data: { streakCount: 0 },
    });

    // Verify logging
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({
      action: 'SQUAD_DECAY',
    }));
  });
});

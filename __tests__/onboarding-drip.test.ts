import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/internal/cron/onboarding-drip/route';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/email', () => ({
  emailService: {
    sendMissionProtocolEmail: vi.fn(),
    sendDigitalIdentityEmail: vi.fn(),
  },
}));

describe('Onboarding Drip Cron', () => {
  const CRON_SECRET = 'test-secret';
  process.env.CRON_SECRET = CRON_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if secret is invalid', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'authorization': 'Bearer wrong' },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should process users for Day 1 and Day 7', async () => {
    const mockUsers = [
      { id: 'user-1', email: 'user1@test.com', name: 'User 1', class: 'BUILDER' },
    ];

    // Mock findMany to return users only for the first step (Day 1) to simplify
    vi.mocked(prisma.user.findMany)
      .mockResolvedValueOnce(mockUsers as any) // Day 1
      .mockResolvedValueOnce([]);       // Day 7

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${CRON_SECRET}` },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(emailService.sendMissionProtocolEmail).toHaveBeenCalledWith({
      email: 'user1@test.com',
      name: 'User 1',
      userClass: 'BUILDER',
    });
  });

  it('ne fabrique aucun profil pour un membre sans quiz (D-030)', async () => {
    vi.mocked(prisma.user.findMany)
      .mockResolvedValueOnce([
        { id: 'user-2', email: 'user2@test.com', name: 'User 2', class: null },
      ] as any) // Day 1
      .mockResolvedValueOnce([]); // Day 7

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${CRON_SECRET}` },
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(emailService.sendMissionProtocolEmail).toHaveBeenCalledWith({
      email: 'user2@test.com',
      name: 'User 2',
      userClass: null,
    });
  });
});

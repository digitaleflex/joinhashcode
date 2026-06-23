import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../app/api/squad/public/route';
import { prisma } from '../lib/prisma';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('../lib/prisma', () => ({
  prisma: {
    organization: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

describe('Squad Public API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return public squads without authentication', async () => {
    const mockSquads = [
      {
        id: 'org_1',
        name: 'Protocole Alpha',
        slug: 'protocole-alpha',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        members: [
          {
            user: {
              id: 'user_1',
              name: 'John Doe',
              pseudo: 'johndoe',
              image: 'https://example.com/avatar1.jpg',
              class: 'BUILDER',
              progress: { level: 5 },
            },
          },
        ],
      },
      {
        id: 'org_2',
        name: 'Signal Omega',
        slug: 'signal-omega',
        createdAt: new Date('2024-01-02T00:00:00.000Z'),
        members: [
          {
            user: {
              id: 'user_2',
              name: 'Jane Smith',
              pseudo: 'janesmith',
              image: 'https://example.com/avatar2.jpg',
              class: 'CREATOR',
              progress: { level: 3 },
            },
          },
        ],
      },
    ];

    (prisma.organization.findMany as any).mockResolvedValue(mockSquads);

    const req = new NextRequest('http://localhost:3000/api/squad/public');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].name).toBe('Protocole Alpha');
    expect(data[0].memberCount).toBe(1);
    expect(data[0].members[0].name).toBe('John Doe');
    expect(data[0].members[0].level).toBe(5);
    expect(data[1].name).toBe('Signal Omega');
  });

  it('should respect limit parameter', async () => {
    const mockSquads = [
      {
        id: 'org_1',
        name: 'Protocole Alpha',
        slug: 'protocole-alpha',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        members: [{ user: { id: 'user_1', name: 'John Doe', pseudo: 'johndoe', image: null, class: 'BUILDER', progress: { level: 5 } } }],
      },
      {
        id: 'org_2',
        name: 'Signal Omega',
        slug: 'signal-omega',
        createdAt: new Date('2024-01-02T00:00:00.000Z'),
        members: [{ user: { id: 'user_2', name: 'Jane Smith', pseudo: 'janesmith', image: null, class: 'CREATOR', progress: { level: 3 } } }],
      },
    ];

    (prisma.organization.findMany as any).mockImplementation((args: any) => {
      const take = args?.take || 0;
      const limitedSquads = take ? mockSquads.slice(0, take) : mockSquads;
      return Promise.resolve(limitedSquads);
    });

    const req = new NextRequest('http://localhost:3000/api/squad/public?limit=1');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe('Protocole Alpha');
  });

  it('should return empty array when no squads exist', async () => {
    (prisma.organization.findMany as any).mockResolvedValue([]);

    const req = new NextRequest('http://localhost:3000/api/squad/public');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(0);
  });
});

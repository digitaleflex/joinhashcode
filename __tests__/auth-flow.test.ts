import { describe, it, expect, vi, beforeEach } from 'vitest';
import { middleware } from '../middleware';
import { NextRequest, NextResponse } from 'next/server';

// Helper to create a request
function createRequest(path: string, cookie?: string) {
  const url = `http://localhost:3000${path}`;
  return new NextRequest(url, {
    headers: {
      cookie: cookie || '',
    },
  });
}

// Mock fetch globally
global.fetch = vi.fn();

describe('Middleware Auth & Onboarding Funnel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to /signin if no session on protected path', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ session: null, user: null }),
    });

    const req = createRequest('/dashboard');
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost:3000/signin');
  });

  it('should redirect to /onboarding if user has no currentSituation', async () => {
    const userData = { id: 'user_1', currentSituation: null, betaKeyId: 'key_1' };
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          session: { id: 'sess_1' },
          user: userData
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => userData,
      });

    const req = createRequest('/dashboard');
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost:3000/onboarding');
  });

  it('should redirect to /quiz if user has situation but no class', async () => {
    const userData = { id: 'user_1', currentSituation: 'STUDENT', class: null, betaKeyId: 'key_1' };
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          session: { id: 'sess_1' },
          user: userData
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => userData,
      });

    const req = createRequest('/dashboard');
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost:3000/quiz');
  });

  it('should allow access to dashboard if user is fully onboarded', async () => {
    const userData = { 
      id: 'user_1', 
      currentSituation: 'STUDENT', 
      class: 'BUILDER', 
      betaKeyId: 'key_1'
    };
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          session: { id: 'sess_1' },
          user: userData
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => userData,
      });

    const req = createRequest('/dashboard');
    const res = await middleware(req);

    expect(res?.status).not.toBe(307);
  });
});

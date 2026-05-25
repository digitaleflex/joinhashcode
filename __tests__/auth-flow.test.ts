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
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        session: { id: 'sess_1' },
        user: { id: 'user_1', currentSituation: null }
      }),
    });

    const req = createRequest('/dashboard');
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost:3000/onboarding');
  });

  it('should redirect to /quiz if user has situation but no class', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        session: { id: 'sess_1' },
        user: { id: 'user_1', currentSituation: 'STUDENT', class: null }
      }),
    });

    const req = createRequest('/dashboard');
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost:3000/quiz');
  });

  it('should redirect to /onboarding/post-quiz if user has class but no dreamStatement', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        session: { id: 'sess_1' },
        user: { id: 'user_1', currentSituation: 'STUDENT', class: 'BUILDER', dreamStatement: null }
      }),
    });

    const req = createRequest('/dashboard');
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost:3000/onboarding/post-quiz');
  });

  it('should allow access to dashboard if user is fully onboarded', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        session: { id: 'sess_1' },
        user: { 
            id: 'user_1', 
            currentSituation: 'STUDENT', 
            class: 'BUILDER', 
            dreamStatement: 'I want to build a SaaS' 
        }
      }),
    });

    const req = createRequest('/dashboard');
    const res = await middleware(req);

    // NextResponse.next() returns a response with null status or implicit 200 depending on implementation
    // But it shouldn't be a redirect
    expect(res?.status).not.toBe(307);
  });
});

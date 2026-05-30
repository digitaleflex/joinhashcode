import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/contact/route';
import { prisma } from '../lib/prisma';
import { emailService } from '../lib/email';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('../lib/prisma', () => ({
  prisma: {
    contactMessage: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../lib/email', () => ({
  emailService: {
    sendContactNotification: vi.fn(),
  },
}));

describe('Contact API - Honeypot Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process legitimate requests', async () => {
    const body = {
      type: 'BUG',
      email: 'user@example.com',
      subject: 'Test Subject',
      content: 'This is a test message.',
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    (prisma.contactMessage.create as any).mockResolvedValue({ id: 'msg_1' });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.contactMessage.create).toHaveBeenCalled();
    expect(emailService.sendContactNotification).toHaveBeenCalled();
  });

  it('should silently fail if honeypot is filled', async () => {
    const body = {
      type: 'BUG',
      email: 'bot@spam.com',
      subject: 'Spam',
      content: 'I am a bot.',
      honeypot: 'bot-trap-triggered',
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200); // Success response to the bot
    expect(data.success).toBe(true);
    
    // BUT no database record should be created and no email sent
    expect(prisma.contactMessage.create).not.toHaveBeenCalled();
    expect(emailService.sendContactNotification).not.toHaveBeenCalled();
  });
});

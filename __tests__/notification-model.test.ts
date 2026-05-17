import { PrismaClient } from '../generated/prisma';
import { expect, it, describe } from 'vitest';

const prisma = new PrismaClient();

describe('Notification Model', () => {
  it('should be able to create a notification for a user', async () => {
    // We need a user first
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found to test notifications. Skipping creation test.');
      return;
    }

    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        title: 'Test Notification',
        message: 'This is a test notification',
      },
    });

    expect(notification).toBeDefined();
    expect(notification.title).toBe('Test Notification');
    expect(notification.isRead).toBe(false);

    // Cleanup
    await prisma.notification.delete({
      where: { id: notification.id },
    });
  });
});

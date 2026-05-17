# Notification Database Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the `Notification` model in Prisma schema and link it to the `User` model.

**Architecture:** Add a new `Notification` model with a relation to `User`. Update the database schema and regenerate the Prisma Client.

**Tech Stack:** Prisma, PostgreSQL, TypeScript

---

### Task 1: Update Prisma Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add Notification model**

Add the following model to the end of `prisma/schema.prisma`:

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // MISSION_APPROVED, LEVEL_UP, DAILY_REMINDER, SYSTEM
  title     String
  message   String   @db.Text
  link      String?  // e.g., /missions
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([isRead])
  @@map("notification")
}
```

- [ ] **Step 2: Update User model relation**

Locate the `User` model and add the `notifications` field:

```prisma
model User {
  // ... existing fields ...
  notifications      Notification[]
  // ...
}
```

- [ ] **Step 3: Validate schema**

Run: `npx prisma validate`
Expected: Schema is valid.

- [ ] **Step 4: Commit schema changes**

```bash
git add prisma/schema.prisma
git commit -m "db: add Notification model to schema"
```

### Task 2: Apply Database Changes

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Push database changes**

Run: `npx prisma db push`
Expected: Database schema updated successfully.

- [ ] **Step 2: Regenerate Prisma Client**

Run: `npx prisma generate`
Expected: Prisma Client generated successfully.

- [ ] **Step 3: Commit lock file (if changed)**

```bash
git add pnpm-lock.yaml
git commit -m "db: update prisma client and lockfile"
```

### Task 3: Verification

**Files:**
- Create: `__tests__/notification-model.test.ts`

- [ ] **Step 1: Create a verification test**

```typescript
import { PrismaClient } from '../generated/prisma';
import { expect, it, describe, beforeAll, afterAll } from 'vitest';

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
```

- [ ] **Step 2: Run the test**

Run: `npx vitest __tests__/notification-model.test.ts --run`
Expected: Test passes or skips if no user.

- [ ] **Step 3: Cleanup verification test**

Run: `rm __tests__/notification-model.test.ts`
Expected: File removed.

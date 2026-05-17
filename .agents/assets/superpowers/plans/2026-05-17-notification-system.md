# Notification System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a unified notification system (internal + email) using QStash for background processing and Resend for emails.

**Architecture:** A hybrid system using QStash for reliable delivery. Direct triggers (like mission validation) publish to QStash, which then hits an internal worker endpoint to update the DB and send emails. A daily cron job checks for inactivity.

**Tech Stack:** Prisma, Upstash QStash, Resend, Framer Motion, Radix UI.

---

### Task 1: Database & Model Setup

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add Notification model to schema**

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

- [ ] **Step 2: Update User relation**

Add `notifications Notification[]` to the `User` model.

- [ ] **Step 3: Run migration & regenerate client**

Run: `npx prisma db push ; npx prisma generate`
Expected: Database in sync.

---

### Task 2: QStash Integration Layer

**Files:**
- Create: `lib/qstash.ts`

- [ ] **Step 1: Setup QStash client**

```typescript
import { Client } from "@upstash/qstash";

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});
```

- [ ] **Step 2: Create universal notification trigger**

```typescript
// Add to lib/qstash.ts
export async function triggerNotification(payload: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://joinhashcode.com";
  return await qstash.publishJSON({
    url: `${APP_URL}/api/internal/notify`,
    body: payload,
    // Add signature header in production if needed, or rely on internal check
  });
}
```

---

### Task 3: Internal Worker Endpoint

**Files:**
- Create: `app/api/internal/notify/route.ts`

- [ ] **Step 1: Implement the worker logic**

```typescript
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: Request) {
  // Signature verification (only in production)
  if (process.env.NODE_ENV === "production") {
    const signature = req.headers.get("upstash-signature");
    const body = await req.text();
    const isValid = await receiver.verify({ signature: signature!, body });
    if (!isValid) return new NextResponse("Unauthorized", { status: 401 });
  }

  const { userId, type, title, message, link } = await req.json();

  // 1. Persist to DB
  const notification = await prisma.notification.create({
    data: { userId, type, title, message, link },
    include: { user: true }
  });

  // 2. Trigger Email (if applicable)
  if (type === "MISSION_APPROVED") {
    await emailService.sendMissionApproval({
      email: notification.user.email,
      name: notification.user.name,
      missionTitle: title.replace("Mission validée : ", ""),
      xp: 0, // Should be passed in payload or derived
    });
  }

  return NextResponse.json({ success: true });
}
```

---

### Task 4: UI — Notification Bell

**Files:**
- Create: `components/dashboard/notification-bell.tsx`
- Modify: `components/dashboard/user-topbar.tsx`

- [ ] **Step 1: Create the bell component with dropdown**

Use Shadcn DropdownMenu and Framer Motion for the unread badge glow.

- [ ] **Step 2: Implement polling for new notifications**

Simple `useEffect` to fetch `/api/user/notifications` every 60s.

---

### Task 5: Daily Activity Cron

**Files:**
- Create: `app/api/internal/cron/check-activity/route.ts`

- [ ] **Step 1: Logic to find inactive users and publish to QStash**

```typescript
import { prisma } from "@/lib/prisma";
import { triggerNotification } from "@/lib/qstash";
import { subHours } from "date-fns";

export async function GET() {
  const 24HoursAgo = subHours(new Date(), 24);
  const inactiveUsers = await prisma.user.findMany({
    where: {
      lastCheckinAt: { lt: 24HoursAgo },
      // Add other conditions like "is active member"
    }
  });

  for (const user of inactiveUsers) {
    await triggerNotification({
      userId: user.id,
      type: "DAILY_REMINDER",
      title: "Ton build t'attend",
      message: "Tu n'as pas signé ton check-in aujourd'hui. Garde le rythme !",
      link: "/dashboard"
    });
  }

  return Response.json({ count: inactiveUsers.length });
}
```

---

### Task 6: Final Integration

**Files:**
- Modify: `app/api/missions/route.ts`
- Modify: `app/api/onboarding/post-quiz/route.ts`

- [ ] **Step 1: Replace direct email calls with triggerNotification**

This ensures the user gets BOTH the DB entry and the email, with QStash handling the background work.

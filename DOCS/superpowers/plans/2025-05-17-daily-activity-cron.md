# Implementation Plan - Task 5: Daily Activity Cron

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a daily activity check cron job that reminds inactive users to sign their check-in.

**Architecture:** Create an internal API route `app/api/internal/cron/check-activity/route.ts` that finds users who haven't checked in for 24 hours and triggers a notification via QStash. The route is protected by QStash signature verification.

**Tech Stack:** Next.js, Prisma, Upstash QStash, date-fns.

---

### Task 1: Create the Cron Route

**Files:**
- Create: `app/api/internal/cron/check-activity/route.ts`

- [ ] **Step 1: Write the cron route with logic to find inactive users and trigger notifications**

```typescript
import { prisma } from "@/lib/prisma";
import { triggerNotification } from "@/lib/qstash";
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { subHours } from "date-fns";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "test_key",
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "test_key",
});

export async function POST(req: Request) {
  try {
    // Signature verification (only in production)
    if (process.env.NODE_ENV === "production") {
      const signature = req.headers.get("upstash-signature");
      const body = await req.text();
      const isValid = await receiver.verify({ signature: signature!, body });
      if (!isValid) return new NextResponse("Unauthorized", { status: 401 });
    }

    const twentyFourHoursAgo = subHours(new Date(), 24);

    // Find users whose lastCheckinAt is older than 24h OR null, and who have completed onboarding (class is not null)
    const inactiveUsers = await prisma.user.findMany({
      where: {
        class: { not: null },
        OR: [
          { lastCheckinAt: { lt: twentyFourHoursAgo } },
          { lastCheckinAt: null },
        ],
      },
      select: { id: true },
    });

    console.log(`[CRON_CHECK_ACTIVITY] Found ${inactiveUsers.length} inactive users.`);

    // Trigger notifications
    const notificationPromises = inactiveUsers.map((user) =>
      triggerNotification({
        userId: user.id,
        type: "DAILY_REMINDER",
        title: "Ton build t'attend",
        message: "Tu n'as pas signé ton check-in aujourd'hui. Garde le rythme !",
        link: "/dashboard",
      })
    );

    await Promise.all(notificationPromises);

    console.log(`[CRON_CHECK_ACTIVITY] Triggered ${inactiveUsers.length} notifications.`);

    return NextResponse.json({ 
      success: true, 
      processed: inactiveUsers.length 
    });
  } catch (error) {
    console.error("[CRON_CHECK_ACTIVITY_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/internal/cron/check-activity/route.ts
git commit -m "feat: add daily activity check cron job"
```

### Task 2: Verification

- [ ] **Step 1: Create a temporary test script or use a test case to verify the logic**
Since this is an internal cron route, I'll create a vitest test case.

**Files:**
- Create: `__tests__/check-activity-cron.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/internal/cron/check-activity/route";
import { prisma } from "@/lib/prisma";
import { triggerNotification } from "@/lib/qstash";
import { subHours, addHours } from "date-fns";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/qstash", () => ({
  triggerNotification: vi.fn(),
}));

describe("Daily Activity Cron", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should trigger notifications for inactive users", async () => {
    const mockUsers = [
      { id: "user1" },
      { id: "user2" },
    ];
    (prisma.user.findMany as any).mockResolvedValue(mockUsers);
    (triggerNotification as any).mockResolvedValue({ messageId: "msg1" });

    const req = new Request("http://localhost/api/internal/cron/check-activity", {
      method: "POST",
    });

    const response = await POST(req);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.processed).toBe(2);
    expect(prisma.user.findMany).toHaveBeenCalled();
    expect(triggerNotification).toHaveBeenCalledTimes(2);
    expect(triggerNotification).toHaveBeenCalledWith(expect.objectContaining({
      userId: "user1",
      type: "DAILY_REMINDER",
    }));
  });
});
```

- [ ] **Step 2: Run the test**

Run: `npm test __tests__/check-activity-cron.test.ts`
Expected: PASS

- [ ] **Step 3: Remove the test file before finishing (if requested, but usually better to keep it)**
I'll keep it for future regressions.

- [ ] **Step 4: Commit tests**

```bash
git add __tests__/check-activity-cron.test.ts
git commit -m "test: add tests for daily activity check cron"
```

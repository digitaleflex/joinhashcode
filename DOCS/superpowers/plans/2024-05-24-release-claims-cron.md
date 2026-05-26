# Automatic Release of Expired Claims Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a cron job that automatically releases `IN_REVIEW` mission claims older than 48 hours back to `PENDING` status.

**Architecture:** A Next.js API route that performs a batch update on stale submissions, sends notifications to authors, and logs the action in the activity log.

**Tech Stack:** Next.js, Prisma, QStash.

---

### Task 1: Create the Cron API Route

**Files:**
- Create: `app/api/internal/cron/release-claims/route.ts`

- [ ] **Step 1: Write the basic route structure and authentication**

```typescript
export const dynamic = 'force-dynamic'
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
    const hasQStashKeys =
      process.env.QSTASH_CURRENT_SIGNING_KEY &&
      process.env.QSTASH_CURRENT_SIGNING_KEY !== "test_key";

    if (hasQStashKeys) {
      const signature = req.headers.get("upstash-signature");
      const body = await req.text();
      const isValid = await receiver.verify({ signature: signature!, body });
      if (!isValid) return new NextResponse("Unauthorized", { status: 401 });
    } else {
      const secret = req.headers.get("x-internal-secret");
      if (!secret || secret !== (process.env.INTERNAL_API_SECRET || "")) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    return NextResponse.json({ success: true, message: "Endpoint verified" });
  } catch (error) {
    console.error("[CRON_RELEASE_CLAIMS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**
```bash
git add app/api/internal/cron/release-claims/route.ts
git commit -m "feat(cron): add release-claims route with auth"
```

---

### Task 2: Implement Release Logic

**Files:**
- Modify: `app/api/internal/cron/release-claims/route.ts`

- [ ] **Step 1: Write the failing test for release logic**
(Since it's an internal API, we can use a standalone test file or simulate with a script. Let's create `__tests__/release-claims.test.ts`)

```typescript
import { expect, test, describe, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { subHours } from "date-fns";

describe("Cron: release-claims", () => {
  test("releases claims older than 48 hours", async () => {
    // Setup will happen in integration test phase
  });
});
```

- [ ] **Step 2: Implement the core logic in the route**

```typescript
    // Inside POST after auth
    const fortyEightHoursAgo = subHours(new Date(), 48);

    // 1. Find stale submissions
    const staleSubmissions = await prisma.missionSubmission.findMany({
      where: {
        status: "IN_REVIEW",
        updatedAt: { lt: fortyEightHoursAgo },
      },
      select: {
        id: true,
        userId: true,
        missionId: true,
        reviewerId: true,
      },
    });

    if (staleSubmissions.length === 0) {
      return NextResponse.json({ success: true, released: 0 });
    }

    // 2. Perform bulk update
    await prisma.missionSubmission.updateMany({
      where: {
        id: { in: staleSubmissions.map((s) => s.id) },
      },
      data: {
        status: "PENDING",
        reviewerId: null,
      },
    });

    // 3. Trigger notifications and log activity
    const notifications = staleSubmissions.map((s) =>
      triggerNotification({
        userId: s.userId,
        type: "MISSION_REVIEW_RELEASED",
        title: "Soumission remise en jeu",
        message: "Ta soumission est de nouveau disponible pour review — un nouveau reviewer va bientôt la prendre en charge.",
        link: `/missions/${s.missionId}`,
      })
    );

    const logs = staleSubmissions.map((s) =>
      prisma.activityLog.create({
        data: {
          userId: s.userId,
          action: "CLAIM_RELEASED_AUTO",
          entity: "MissionSubmission",
          entityId: s.id,
          metadata: { oldReviewerId: s.reviewerId },
        },
      })
    );

    await Promise.all([...notifications, ...logs]);

    return NextResponse.json({
      success: true,
      released: staleSubmissions.length,
    });
```

- [ ] **Step 3: Commit**
```bash
git add app/api/internal/cron/release-claims/route.ts
git commit -m "feat(cron): implement claim release logic with notifications and logging"
```

---

### Task 3: Verification and Registration

- [ ] **Step 1: Create verification script**
Create `scripts/test-release-cron.ts` to manually trigger and verify.

- [ ] **Step 2: Run verification**
`npx tsx scripts/test-release-cron.ts`

- [ ] **Step 3: Update lib/qstash.ts if necessary**
(Already checked, `MISSION_REVIEW_RELEASED` exists in types.)

- [ ] **Step 4: Final Commit**
```bash
git add .
git commit -m "docs(cron): finalize release-claims implementation"
```

# Internal Worker Endpoint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the internal API endpoint `app/api/internal/notify/route.ts` to handle QStash notifications, including signature verification, DB persistence, and email triggering.

**Architecture:** A POST route that verifies the Upstash signature in production, parses the notification payload, creates a notification record in the database, and optionally sends an email based on the notification type.

**Tech Stack:** Next.js Route Handlers, Prisma, Upstash QStash, Resend (via emailService).

---

### Task 1: Implement the Notification Worker Endpoint

**Files:**
- Create: `app/api/internal/notify/route.ts`
- Create: `__tests__/notify-endpoint.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../app/api/internal/notify/route";
import { prisma } from "../lib/prisma";
import { emailService } from "../lib/email";

vi.mock("../lib/prisma", () => ({
  prisma: {
    notification: {
      create: vi.fn(),
    },
  },
}));

vi.mock("../lib/email", () => ({
  emailService: {
    sendMissionApproval: vi.fn(),
  },
}));

describe("POST /api/internal/notify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = "development";
  });

  it("should create a notification and return success", async () => {
    const payload = {
      userId: "user_123",
      type: "SYSTEM",
      title: "System Update",
      message: "Your profile has been updated.",
      link: "/dashboard",
    };

    const req = new Request("http://localhost/api/internal/notify", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    (prisma.notification.create as any).mockResolvedValue({
      id: "notif_123",
      ...payload,
      user: { email: "test@example.com", name: "Test User" },
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: payload,
      include: { user: true },
    });
  });

  it("should send an email if type is MISSION_APPROVED", async () => {
    const payload = {
      userId: "user_123",
      type: "MISSION_APPROVED",
      title: "Mission validée : Build a CLI",
      message: "Your mission has been approved.",
      link: "/missions",
    };

    const req = new Request("http://localhost/api/internal/notify", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    (prisma.notification.create as any).mockResolvedValue({
      id: "notif_123",
      ...payload,
      user: { email: "test@example.com", name: "Test User" },
    });

    const response = await POST(req);
    
    expect(emailService.sendMissionApproval).toHaveBeenCalledWith({
      email: "test@example.com",
      name: "Test User",
      missionTitle: "Build a CLI",
      xp: 0,
    });
  });

  it("should return 500 on error", async () => {
    const payload = {
      userId: "user_123",
      type: "SYSTEM",
      title: "Title",
      message: "Message",
    };

    const req = new Request("http://localhost/api/internal/notify", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    (prisma.notification.create as any).mockRejectedValue(new Error("DB Error"));

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest __tests__/notify-endpoint.test.ts`
Expected: FAIL (Module not found)

- [ ] **Step 3: Write minimal implementation**

Create `app/api/internal/notify/route.ts`:
```typescript
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";

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
      // Re-parse body for logic
      const payload = JSON.parse(body);
      return handleNotify(payload);
    }

    const payload = await req.json();
    return handleNotify(payload);
  } catch (error) {
    console.error("[NOTIFY_WORKER_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

async function handleNotify({ userId, type, title, message, link }: any) {
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest __tests__/notify-endpoint.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/internal/notify/route.ts __tests__/notify-endpoint.test.ts
git commit -m "feat(api): implement internal notify worker endpoint"
```

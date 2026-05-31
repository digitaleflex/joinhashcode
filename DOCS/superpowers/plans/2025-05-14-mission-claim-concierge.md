# Concierge Moderation Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restrict mission claiming to ADMIN and MODERATOR roles in `app/api/missions/[id]/claim/route.ts`.

**Architecture:** Add an early role check in the `POST` handler of the claim route. Users without `ADMIN` or `MODERATOR` roles will receive a `403 Forbidden` response.

**Tech Stack:** Next.js, Prisma, Vitest, Better Auth.

---

### Task 1: Create Failing Test for Unauthorized Claim

**Files:**
- Create: `__tests__/mission-claim-concierge.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/missions/[id]/claim/route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const { mockPrisma } = vi.hoisted(() => {
  const m = {
    user: {
      findUnique: vi.fn(),
    },
    missionSubmission: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
    },
  };
  return { mockPrisma: m };
});

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

vi.mock("@/lib/activity-log", () => ({
  logActivity: vi.fn(),
}));

describe("Mission Claim API - Concierge Mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 403 if user is a MEMBER", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "user1" } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: "user1", role: "MEMBER" });
    
    const req = new Request("http://localhost/api/missions/sub1/claim", {
      method: "POST",
    });
    
    const res = await POST(req, { params: Promise.resolve({ id: "sub1" }) });
    expect(res.status).toBe(403);
    const body = await res.text();
    expect(body).toContain("réservé à la modération");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest __tests__/mission-claim-concierge.test.ts`
Expected: FAIL (status 200 or 404 instead of 403, or text mismatch)

---

### Task 2: Implement Role Check in API Route

**Files:**
- Modify: `app/api/missions/[id]/claim/route.ts`

- [ ] **Step 1: Add role check code**

```typescript
// Replace part of the user retrieval and eligibility check
    const [submission, reviewer] = await Promise.all([
      prisma.missionSubmission.findUnique({
        where: { id: submissionId },
        include: { mission: true },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, class: true, level: true, missionsCompletedCount: true, role: true }, // Added role
      }),
    ]);

    if (!submission) return new NextResponse("Soumission introuvable.", { status: 404 });
    if (!reviewer) return new NextResponse("Utilisateur introuvable.", { status: 404 });

    // Concierge Mode: Restrict to ADMIN or MODERATOR
    if (reviewer.role !== "ADMIN" && reviewer.role !== "MODERATOR") {
      return new NextResponse("Le claim de mission est réservé à la modération.", { status: 403 });
    }
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest __tests__/mission-claim-concierge.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/api/missions/[id]/claim/route.ts __tests__/mission-claim-concierge.test.ts
git commit -m "feat(missions): implement Concierge Moderation Mode for mission claims"
```

---

### Task 3: Verify Admin/Moderator Success Cases

**Files:**
- Modify: `__tests__/mission-claim-concierge.test.ts`

- [ ] **Step 1: Add success tests**

```typescript
  it("should allow ADMIN to claim", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "admin1" } });
    (prisma.user.findUnique as any).mockResolvedValue({ 
      id: "admin1", 
      role: "ADMIN", 
      class: "code", 
      level: 5, 
      missionsCompletedCount: 10 
    });
    
    (prisma.missionSubmission.findUnique as any).mockResolvedValue({
      id: "sub1",
      status: "PENDING",
      userId: "other-user",
      mission: { missionLevel: "INIT", targetProfiles: ["code"] }
    });

    const req = new Request("http://localhost/api/missions/sub1/claim", {
      method: "POST",
    });
    
    const res = await POST(req, { params: Promise.resolve({ id: "sub1" }) });
    expect(res.status).toBe(200);
  });
```

- [ ] **Step 2: Run tests**

Run: `npx vitest __tests__/mission-claim-concierge.test.ts`
Expected: ALL PASS

---

### Task 4: Final Validation and Cleanup

- [ ] **Step 1: Run npx prisma generate**

Run: `npx prisma generate`

- [ ] **Step 2: Run all tests**

Run: `npm test` or `npx vitest`
Expected: No regressions

- [ ] **Step 3: Final Commit**

```bash
git add .
git commit -m "chore: final concierge mode validation"
```

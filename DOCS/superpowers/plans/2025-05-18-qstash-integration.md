# QStash Integration Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a unified QStash integration layer to trigger notifications via an internal API.

**Architecture:** Use `@upstash/qstash` client to publish JSON payloads to a dedicated internal endpoint. This decouples the notification trigger from the processing logic.

**Tech Stack:** TypeScript, `@upstash/qstash`, Next.js Environment Variables.

---

### Task 1: Environment and Dependency Setup

**Files:**
- Modify: `package.json`
- Modify: `.env.example`

- [ ] **Step 1: Install @upstash/qstash**
Run: `pnpm add @upstash/qstash`

- [ ] **Step 2: Add QSTASH_TOKEN to .env.example**
Add `QSTASH_TOKEN=""` to the `.env.example` file.

- [ ] **Step 3: Commit**
```bash
git add package.json pnpm-lock.yaml .env.example
git commit -m "chore: add qstash dependency and env example"
```

### Task 2: Implement QStash Client and Trigger

**Files:**
- Create: `lib/qstash.ts`

- [ ] **Step 1: Create lib/qstash.ts with Client and triggerNotification**

```typescript
import { Client } from "@upstash/qstash";

if (!process.env.QSTASH_TOKEN) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("QSTASH_TOKEN is required in production");
  }
}

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN || "development_token",
});

export interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}

export async function triggerNotification(payload: NotificationPayload) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  return await qstash.publishJSON({
    url: `${APP_URL}/api/internal/notify`,
    body: payload,
  });
}
```

- [ ] **Step 2: Commit**
```bash
git add lib/qstash.ts
git commit -m "feat: implement qstash client and triggerNotification"
```

### Task 3: Verification (Mocked)

**Files:**
- Create: `__tests__/qstash.test.ts`

- [ ] **Step 1: Write test for triggerNotification**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { triggerNotification, qstash } from "../lib/qstash";

vi.mock("@upstash/qstash", () => {
  return {
    Client: vi.fn().mockImplementation(() => ({
      publishJSON: vi.fn().mockResolvedValue({ messageId: "msg_123" }),
    })),
  };
});

describe("triggerNotification", () => {
  it("should call qstash.publishJSON with correct parameters", async () => {
    const payload = {
      userId: "user_123",
      type: "TEST",
      title: "Test Title",
      message: "Test Message",
    };

    const result = await triggerNotification(payload);

    expect(qstash.publishJSON).toHaveBeenCalledWith({
      url: expect.stringContaining("/api/internal/notify"),
      body: payload,
    });
    expect(result).toEqual({ messageId: "msg_123" });
  });
});
```

- [ ] **Step 2: Run tests**
Run: `npm test __tests__/qstash.test.ts`

- [ ] **Step 3: Commit**
```bash
git add __tests__/qstash.test.ts
git commit -m "test: add qstash integration tests"
```

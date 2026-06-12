# SEC-011 - Redis-backed Rate Limiting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify rate limiting across the application using the existing Upstash Redis instance to ensure state persists across restarts and is shared across replicas.

**Architecture:** 
- Leverage the existing Upstash Redis client in `lib/ratelimit.ts`.
- Ensure Better Auth uses this Redis client for its `secondaryStorage`, which handles rate limiting state.
- Replace the in-memory `Map` rate limiter in the Contact API with a Redis-backed `Ratelimit` instance.

**Tech Stack:** 
- Next.js (App Router)
- Better Auth v1
- @upstash/ratelimit
- @upstash/redis

---

### Task 1: Verify Better Auth Redis Storage

**Files:**
- Modify: `lib/auth.ts`

- [ ] **Step 1: Check existing Redis integration**
Review `lib/auth.ts` to ensure the `secondaryStorage` is correctly configured to use the `redis` client from `lib/ratelimit.ts`. It seems already partially implemented but I should verify if it's actually being used for rate limiting.

- [ ] **Step 2: Ensure rateLimit config uses secondaryStorage**
Better Auth's `rateLimit` uses `secondaryStorage` if provided. I'll make sure it's enabled and correctly configured.

- [ ] **Step 3: Run build to verify type safety**
Run: `pnpm tsc`
Expected: No type errors in `lib/auth.ts`.

---

### Task 2: Replace Contact API Rate Limiter

**Files:**
- Modify: `app/api/contact/route.ts`

- [ ] **Step 1: Update Contact API to use Redis limiter**

```typescript
// app/api/contact/route.ts
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";

// ... remove rateLimitMap and isRateLimited function ...

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    
    // Replace custom check with standard limiter
    const { limited, reset } = await checkRateLimit(mutationLimiter, ip);

    if (limited) {
      return NextResponse.json(
        { error: "Trop de messages envoyés. Réessaie plus tard." },
        { status: 429, headers: { "X-RateLimit-Reset": reset?.toString() ?? "" } }
      );
    }
    // ...
  }
}
```

- [ ] **Step 2: Commit changes**
Run: `git add app/api/contact/route.ts && git commit -m "feat: replace in-memory rate limiting with Redis-backed limiter in Contact API"`

---

### Task 3: Final Verification

- [ ] **Step 1: Run build**
Run: `pnpm build`
Expected: Successful build.

- [ ] **Step 2: Verify `lib/ratelimit.ts` exports**
Ensure `mutationLimiter` and `checkRateLimit` are correctly exported and used.

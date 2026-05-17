# Vibrancy Time-Decay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a time-based decay for user vibrancy scores to ensure the profile reflects recent activity.

**Architecture:** Add a lazy-calculation decay function in `lib/evolution.ts` and integrate it into the mission submission API route.

**Tech Stack:** TypeScript, Prisma, Vitest.

---

### Task 1: Core Logic in `lib/evolution.ts`

**Files:**
- Modify: `lib/evolution.ts`
- Create: `__tests__/evolution.test.ts`

- [ ] **Step 1: Create the test file with failing tests for decay**

```typescript
import { describe, it, expect } from 'vitest';
import { updateVibrancyWithDecay, BehavioralVibrancy } from '../lib/evolution';

describe('updateVibrancyWithDecay', () => {
  const initialVibrancy: BehavioralVibrancy = {
    builder: 100,
    creator: 100,
    strategist: 100,
    catalyst: 100,
  };

  const missionWeights: BehavioralVibrancy = {
    builder: 10,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  it('applies 50% decay after 30 days (half-life)', () => {
    const lastUpdate = new Date('2026-04-17T00:00:00Z');
    const now = new Date('2026-05-17T00:00:00Z'); // 30.8 days approx but we use exact days
    
    // For exactly 30 days: 
    const thirtyDaysLater = new Date(lastUpdate.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const { vibrancy, decayFactor } = updateVibrancyWithDecay(
      initialVibrancy,
      missionWeights,
      lastUpdate,
      thirtyDaysLater
    );

    expect(decayFactor).toBeCloseTo(0.5, 5);
    expect(vibrancy.builder).toBeCloseTo(60, 5); // (100 * 0.5) + 10
    expect(vibrancy.creator).toBeCloseTo(50, 5); // (100 * 0.5) + 0
  });

  it('applies no decay if lastUpdate is null', () => {
    const { vibrancy, decayFactor } = updateVibrancyWithDecay(
      initialVibrancy,
      missionWeights,
      null
    );

    expect(decayFactor).toBe(1);
    expect(vibrancy.builder).toBe(110);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npx vitest __tests__/evolution.test.ts`
Expected: FAIL (updateVibrancyWithDecay is not defined)

- [ ] **Step 3: Implement `updateVibrancyWithDecay` in `lib/evolution.ts`**

```typescript
export const updateVibrancyWithDecay = (
  currentVibrancy: BehavioralVibrancy,
  missionWeights: BehavioralVibrancy,
  lastUpdate: Date | null,
  now: Date = new Date(),
  halfLifeDays: number = 30
): { vibrancy: BehavioralVibrancy; decayFactor: number } => {
  if (!lastUpdate) {
    return { vibrancy: updateVibrancy(currentVibrancy, missionWeights), decayFactor: 1 };
  }

  const diffMs = now.getTime() - lastUpdate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const decayFactor = Math.pow(0.5, diffDays / halfLifeDays);

  // Apply threshold to avoid micro-values
  const applyDecay = (val: number) => {
    const decayed = val * decayFactor;
    return decayed < 0.01 ? 0 : decayed;
  };

  return {
    vibrancy: {
      builder: applyDecay(currentVibrancy.builder) + missionWeights.builder,
      creator: applyDecay(currentVibrancy.creator) + missionWeights.creator,
      strategist: applyDecay(currentVibrancy.strategist) + missionWeights.strategist,
      catalyst: applyDecay(currentVibrancy.catalyst) + missionWeights.catalyst,
    },
    decayFactor
  };
};
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest __tests__/evolution.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/evolution.ts __tests__/evolution.test.ts
git commit -m "feat(evolution): implement time-decay for vibrancy scores"
```

---

### Task 2: Fix Core Data & Integration in Mission API

**Files:**
- Modify: `lib/missions.ts`
- Modify: `app/api/missions/route.ts`

- [ ] **Step 1: Add weight fields to `Mission` interface and `MISSIONS` constant in `lib/missions.ts`**

```typescript
export interface Mission {
  // ... existing fields ...
  weightBuilder?: number;
  weightCreator?: number;
  weightStrategist?: number;
  weightCatalyst?: number;
}

// In MISSIONS, add weights matching targetProfiles. 
// e.g. targetProfiles: ["builder"] -> weightBuilder: 1.0, others: 0
```

- [ ] **Step 2: Update the API route to apply decay and update all counters**

```typescript
// Add imports at top
import { updateVibrancyWithDecay, BehavioralVibrancy } from "@/lib/evolution";

// Inside the POST function, update the user update transaction
await tx.user.update({
  where: { id: session.user.id },
  data: {
    experience: newXp,
    level: newLevel,
    missionsCompletedCount: { increment: 1 },
    behavioralVibrancy: newVibrancy as any,
    lastHypothesisUpdate: new Date(),
  }
});
```

- [ ] **Step 3: Commit**

```bash
git add lib/missions.ts app/api/missions/route.ts
git commit -m "feat(api): fix mission weights and integrate vibrancy time-decay"
```

---

### Task 3: Final Verification

- [ ] **Step 1: Run all tests to ensure no regressions**

Run: `npm test`
Expected: All tests pass.

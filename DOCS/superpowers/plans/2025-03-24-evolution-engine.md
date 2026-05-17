# Evolution Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Evolution Engine" that tracks user profile changes based on their actions (check-ins and missions).

**Architecture:** A centralized engine in `lib/evolution-engine.ts` that calculates new vibrancy, confidence scores, and profile drift. It will be triggered by API routes for check-ins and missions.

**Tech Stack:** TypeScript, Prisma, Vitest for testing.

---

### Task 1: Foundation and Utilities

**Files:**
- Create: `lib/evolution-engine.ts`
- Test: `__tests__/evolution-engine.test.ts`

- [ ] **Step 1: Write failing tests for vibrancy and drift calculation**

```typescript
import { calculateNewVibrancy, calculateDriftScore } from '../lib/evolution-engine';
import { BehavioralVibrancy } from '../lib/evolution';

describe('Evolution Engine Utilities', () => {
  it('should calculate new vibrancy correctly', () => {
    const currentVibrancy: BehavioralVibrancy = { builder: 10, creator: 5, strategist: 2, catalyst: 0 };
    const actionWeights: BehavioralVibrancy = { builder: 1, creator: 0, strategist: 0, catalyst: 0 };
    const result = calculateNewVibrancy(currentVibrancy, actionWeights);
    expect(result.builder).toBeGreaterThan(10);
  });

  it('should calculate drift correctly', () => {
    const quizScores = { builder: 100, creator: 0, strategist: 0, catalyst: 0 }; // 100% builder
    const vibrancy: BehavioralVibrancy = { builder: 0, creator: 100, strategist: 0, catalyst: 0 }; // 100% creator
    const drift = calculateDriftScore(quizScores, vibrancy);
    expect(drift).toBeCloseTo(1.0); // Max drift
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

- [ ] **Step 3: Implement the utilities in `lib/evolution-engine.ts`**

```typescript
import { prisma } from './prisma';
import { BehavioralVibrancy, updateVibrancyWithDecay, calculateDrift } from './evolution';
import { ProfileType } from './analysis';

export const CHECKIN_WEIGHTS: Record<string, Partial<BehavioralVibrancy>> = {
  'Code': { builder: 1 },
  'Design': { creator: 1 },
  'Business': { strategist: 1 },
  'Community': { catalyst: 1 },
  'Growth': { strategist: 0.7, catalyst: 0.3 },
  'Product': { strategist: 0.5, builder: 0.5 },
};

export function calculateNewVibrancy(
  currentVibrancy: BehavioralVibrancy,
  actionWeights: BehavioralVibrancy,
  lastUpdate: Date | null = null
) {
  return updateVibrancyWithDecay(currentVibrancy, actionWeights, lastUpdate).vibrancy;
}

export function calculateDriftScore(
  quizScores: { builderScore: number; creatorScore: number; strategistScore: number; catalystScore: number },
  vibrancy: BehavioralVibrancy
) {
  const total = quizScores.builderScore + quizScores.creatorScore + quizScores.strategistScore + quizScores.catalystScore || 1;
  const quizPercentages: Record<ProfileType, number> = {
    builder: (quizScores.builderScore / total) * 100,
    creator: (quizScores.creatorScore / total) * 100,
    strategist: (quizScores.strategistScore / total) * 100,
    catalyst: (quizScores.catalystScore / total) * 100,
  };
  return calculateDrift(quizPercentages, vibrancy);
}
```

- [ ] **Step 4: Run tests to verify they pass**

- [ ] **Step 5: Commit**

### Task 2: Orchestration Logic

**Files:**
- Modify: `lib/evolution-engine.ts`

- [ ] **Step 1: Add `updateUserEvolution` to `lib/evolution-engine.ts`**

```typescript
export async function updateUserEvolution(
  userId: string,
  actionWeights: BehavioralVibrancy,
  confidenceGain: number
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      behavioralVibrancy: true,
      confidenceScore: true,
      lastHypothesisUpdate: true,
      builderScore: true,
      creatorScore: true,
      strategistScore: true,
      catalystScore: true,
      class: true,
    }
  });

  if (!user) return;

  const currentVibrancy = (user.behavioralVibrancy as any) || {
    builder: 0,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  const newVibrancy = calculateNewVibrancy(currentVibrancy, actionWeights, user.lastHypothesisUpdate);
  const newDrift = calculateDriftScore(
    {
      builderScore: user.builderScore,
      creatorScore: user.creatorScore,
      strategistScore: user.strategistScore,
      catalystScore: user.catalystScore,
    },
    newVibrancy
  );

  const newConfidence = Math.min(user.confidenceScore + confidenceGain, 1.0);

  return await prisma.user.update({
    where: { id: userId },
    data: {
      behavioralVibrancy: newVibrancy as any,
      confidenceScore: newConfidence,
      profileDrift: newDrift,
      lastHypothesisUpdate: new Date(),
    }
  });
}
```

- [ ] **Step 2: Commit**

### Task 3: Trigger Updates in API Routes

**Files:**
- Modify: `app/api/user/checkin/route.ts`
- Modify: `app/api/missions/route.ts`

- [ ] **Step 1: Update `app/api/user/checkin/route.ts` to trigger evolution**

- [ ] **Step 2: Update `app/api/missions/route.ts` to use the engine**

- [ ] **Step 3: Verify integration with a manual check or integration test**

- [ ] **Step 4: Commit**

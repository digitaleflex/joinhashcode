---
name: cycle-aware-submissions
description: Use when implementing repeatable tasks or challenges (e.g., weekly/daily missions) that require periodic reset while preserving history and preventing spam.
---

# Cycle-Aware Submissions Pattern

## Overview
This pattern allows users to complete the same task multiple times across different time cycles (weeks, months) by using a unique `cycleKey`.

## Core Logic
1. **Database Schema:** Add a `cycleKey` field to your submission model.
2. **Compound Constraint:** Use `@@unique([userId, missionId, cycleKey])`.
3. **Key Generation:** For periodic tasks, use a time-based string (e.g., `2026-W21`). Use `PERMANENT` for one-time tasks.

## Implementation (Prisma)
```typescript
// Key generation helper
function getCycleKey(isPeriodic: boolean) {
  if (!isPeriodic) return "PERMANENT";
  const now = new Date();
  return `${now.getFullYear()}-W${getISOWeek(now)}`;
}

// API Submission Logic (Safe)
const result = await prisma.$transaction(async (tx) => {
  // 1. Check if already APPROVED for THIS cycle
  const existing = await tx.submission.findUnique({
    where: { userId_taskId_cycleKey: { userId, taskId, cycleKey } }
  });
  
  if (existing?.status === "APPROVED") throw new Error("Already completed this cycle.");

  // 2. Upsert and award points
  return tx.submission.upsert({ ... });
});
```

## Common Mistakes
- **XP Double-Dipping:** Forgetting to check the status before awarding experience in an `upsert` update block.
- **Cycle Collision:** Using non-standard week formats that might overlap at the end of the year. Always use ISO-8601.

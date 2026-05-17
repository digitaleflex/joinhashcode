# Spec: Vibrancy Time-Decay System

**Status:** Draft
**Author:** Gemini CLI (Augmented Engineering Cockpit)
**Date:** 2026-05-17
**Topic:** Evolution Engine Optimization

## 1. Purpose
The current evolution engine in HASHCODE accumulates behavioral vibrancy scores linearly. This creates "cognitive inertia" where an old profile dominates even if the user changes their behavior. The Time-Decay system introduces a half-life for past actions, ensuring the profile reflects recent expertise while maintaining a trace of the past.

## 2. Success Criteria
- Recent missions have a higher impact on the `dominantClass` than missions from months ago.
- An inactive user's vibrancy scores decrease over time, requiring regular activity to maintain high "power" levels.
- The system remains deterministic and computationally efficient (Lazy calculation).

## 3. Technical Design

### 3.1 Data Model
- **Model:** `User`
- **Field:** `lastHypothesisUpdate` (DateTime) - Used to track the timestamp of the last decay/update.
- **Field:** `behavioralVibrancy` (Json/BehavioralVibrancy) - The 4-vector to be decayed.

### 3.2 Mathematical Formula
We use an exponential decay formula based on a 30-day half-life.

$$V_{new} = (V_{current} \times 0.5^{\frac{\Delta t}{30}}) + V_{mission}$$

Where:
- $\Delta t$ is the time elapsed in days since `lastHypothesisUpdate`.
- $V_{current}$ is the existing vibrancy vector.
- $V_{mission}$ is the weight of the new mission being submitted.

### 3.3 Implementation Details (`lib/evolution.ts`)
We will refactor `updateVibrancy` to include the decay logic:

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

  return {
    vibrancy: {
      builder: (currentVibrancy.builder * decayFactor) + missionWeights.builder,
      creator: (currentVibrancy.creator * decayFactor) + missionWeights.creator,
      strategist: (currentVibrancy.strategist * decayFactor) + missionWeights.strategist,
      catalyst: (currentVibrancy.catalyst * decayFactor) + missionWeights.catalyst,
    },
    decayFactor
  };
};
```

### 3.4 Integration (`app/api/missions/route.ts`)
1. Fetch `behavioralVibrancy` and `lastHypothesisUpdate` from the DB.
2. Apply `updateVibrancyWithDecay`.
3. Save the new vibrancy and set `lastHypothesisUpdate` to the current timestamp in the same transaction as the mission submission.

## 4. Testing Strategy
- **Unit Test:** Verify that after 30 days, a score of 100 becomes 50.
- **Unit Test:** Verify that without a `lastUpdate` (new user), no decay is applied.
- **Integration Test:** Verify that `lastHypothesisUpdate` is correctly updated in the DB after a submission.

## 5. Risks & Mitigations
- **Risk:** Floating point precision errors after many years.
- **Mitigation:** Use a minimum threshold (e.g., if a score falls below 0.01, set it to 0).
- **Risk:** Timezone issues.
- **Mitigation:** Always use UTC timestamps on the server.

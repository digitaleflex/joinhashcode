# HASHCODE Evolution Engine Skill

## Overview
This skill codifies the mathematical and logical rules governing user evolution in HASHCODE. It handles calculations for Vibrancy, Drift, and Confidence Score.

## Core Concepts (from lib/evolution.ts)

### 1. Confidence Score
- **Base Gain:** 0.02 to 0.05 based on mission difficulty.
- **Coherence Bonus:** +0.02 if the mission's primary class matches the user's primary class (otherwise +0.005).
- **Cap:** 0.95 (always room for growth).

### 2. Vibrancy (Behavioral Signature)
- Calculated as a weighted sum of all approved missions.
- Each mission has weights for: Builder, Creator, Strategist, Catalyst.

### 3. Drift
- Measures the gap between the initial quiz profile and real-world actions (Vibrancy).
- Calculated using Manhattan distance, normalized between 0 and 1.

## When to use this skill
- When modifying `lib/evolution.ts` or `lib/analysis.ts`.
- When updating user XP or level logic in `app/api/missions/route.ts`.
- When debugging issues related to user progress or profile display.

## Instructions
1. Always maintain the deterministic nature of calculations.
2. Ensure new missions have balanced weights across the four archetypes.
3. When calculating level-ups, always refer to `XP_THRESHOLDS` in `lib/missions.ts`.

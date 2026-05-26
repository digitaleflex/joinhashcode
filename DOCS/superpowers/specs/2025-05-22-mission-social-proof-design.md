# Design Spec: Mission Card Social Proof (Roadmap P5)

**Status:** Draft
**Date:** 2025-05-22
**Author:** Gemini CLI

## 1. Problem Statement
Users currently cannot see the popularity or quality of missions in the `MissionsList`. This lacks "social proof" and makes it harder for users to decide which mission to tackle first. The data (approved completions and user ratings) already exists in the database but is not being used.

## 2. Proposed Solution
Enrich the `MISSIONS` list with live statistics from the database in the `MissionsPage` (Server Component) and display them in the `MissionsList` cards.

### 2.1 Data Enrichment (app/missions/page.tsx)
The `MissionsPage` will:
1. Fetch all missions from the static `MISSIONS` array.
2. Query the database for approved submission counts and average ratings grouped by `missionId`.
3. Merge this data into a new `enrichedMissions` array.
4. Pass `enrichedMissions` to the `MissionsList` component.

### 2.2 Component Updates (components/missions/missions-list.tsx)
The `MissionsList` will:
1. Update its interface to accept missions with stats.
2. Render a new social proof block at the bottom of each mission card.
3. Follow display rules for counts and ratings:
    - 0 completions: "Sois le premier"
    - 1-2 completions: "1/2 complétion(s)"
    - 3+ completions: Show count and rating (if rating count >= 3).

## 3. Implementation Details

### 3.1 Data Aggregation Logic
```ts
// Fetch counts of approved submissions
const countsRaw = await prisma.missionSubmission.groupBy({
  by: ["missionId"],
  where: { status: "APPROVED" },
  _count: { _all: true },
});

// Fetch average ratings for approved submissions
const ratingsRaw = await prisma.missionSubmission.groupBy({
  by: ["missionId"],
  where: {
    status: "APPROVED",
    userRating: { not: null },
  },
  _avg: { userRating: true },
  _count: { userRating: true },
});
```

### 3.2 UI Design
The social proof block will be placed just above the action button, separated by a thin border.
- **Completions:** Emerald dot + text (e.g., "12 complétions").
- **Ratings:** Amber stars (★) + numeric average (e.g., "4.5").

## 4. Testing Strategy
- **Manual Verification:** Add mock submissions in the database and verify the counts and ratings appear correctly.
- **Display Rules:** Verify that ratings only appear when there are 3 or more ratings for a mission.
- **Empty State:** Verify "Sois le premier" shows for missions with no approved submissions.

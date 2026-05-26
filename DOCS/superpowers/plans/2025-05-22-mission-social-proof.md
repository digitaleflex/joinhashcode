# Mission Card Social Proof Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the number of completions and average rating on mission cards to increase trust.

**Architecture:** Enrich static mission data with database aggregations in the Server Component (`app/missions/page.tsx`) and pass it to the Client Component (`MissionsList`).

**Tech Stack:** Next.js, Prisma, Tailwind CSS.

---

### Task 1: Update Types

**Files:**
- Modify: `components/missions/missions-list.tsx`

- [ ] **Step 1: Update Mission interface and component props**

Modify `components/missions/missions-list.tsx` to include the new stats fields.

```typescript
// Add this interface above MissionsList component or update existing Mission import if needed
export interface MissionWithStats extends Mission {
  completionsCount: number;
  avgRating: number | null;
  ratingsCount: number;
}

// Update MissionsList prop type
export function MissionsList({ 
  userLevel, 
  userXp, 
  submissions,
  userClass,
  missions // New prop
}: { 
  userLevel: number; 
  userXp: number;
  submissions: Record<string, string>;
  userClass?: string | null;
  missions: MissionWithStats[]; // Add this
}) {
  // ...
}
```

- [ ] **Step 2: Commit**

```bash
git add components/missions/missions-list.tsx
git commit -m "chore: update MissionsList types for social proof"
```

---

### Task 2: Data Enrichment in Server Component

**Files:**
- Modify: `app/missions/page.tsx`

- [ ] **Step 1: Implement database aggregations and data merging**

Update `app/missions/page.tsx` to fetch stats and pass enriched missions.

```typescript
// Inside MissionsPage component, after fetching finalDbUser
import { MISSIONS } from "@/lib/missions";

// 1. Fetch completions count
const completionsRaw = await prisma.missionSubmission.groupBy({
  by: ["missionId"],
  where: { status: "APPROVED" },
  _count: { _all: true },
});

// 2. Fetch average ratings
const ratingsRaw = await prisma.missionSubmission.groupBy({
  by: ["missionId"],
  where: {
    status: "APPROVED",
    userRating: { not: null },
  },
  _avg: { userRating: true },
  _count: { userRating: true },
});

// 3. Build maps
const completionsMap = Object.fromEntries(
  completionsRaw.map(c => [c.missionId, c._count._all])
);

const ratingsMap = Object.fromEntries(
  ratingsRaw.map(r => [r.missionId, {
    avg: r._avg.userRating,
    count: r._count.userRating,
  }])
);

// 4. Enrich MISSIONS
const enrichedMissions = MISSIONS.map(m => ({
  ...m,
  completionsCount: completionsMap[m.id] || 0,
  avgRating: ratingsMap[m.id]?.avg || null,
  ratingsCount: ratingsMap[m.id]?.count || 0,
}));

// 5. Pass to MissionsList
// <MissionsList ... missions={enrichedMissions} />
```

- [ ] **Step 2: Commit**

```bash
git add app/missions/page.tsx
git commit -m "feat: enrich missions with social proof data in Server Component"
```

---

### Task 3: Render Social Proof in Mission Card

**Files:**
- Modify: `components/missions/missions-list.tsx`

- [ ] **Step 1: Add social proof block to mission card**

Update the `renderMission` function to display completions and ratings.

```tsx
{/* Insert this block before the action button in renderMission */}
<div className="flex items-center gap-4 pt-3 border-t border-white/5 mt-3">
  <div className="flex items-center gap-1.5">
    <div className="size-1.5 rounded-full bg-emerald-500/60" />
    <span className="text-[9px] font-mono text-zinc-500 uppercase">
      {mission.completionsCount > 0
        ? `${mission.completionsCount} complét${mission.completionsCount > 1 ? "ions" : "ion"}`
        : "Sois le premier"}
    </span>
  </div>

  {mission.avgRating !== null && mission.ratingsCount >= 3 && (
    <div className="flex items-center gap-1">
      <span className="text-[9px] font-mono text-amber-400">
        {"★".repeat(Math.round(mission.avgRating))}{"☆".repeat(5 - Math.round(mission.avgRating))}
      </span>
      <span className="text-[8px] text-zinc-600 font-mono">
        {mission.avgRating.toFixed(1)}
      </span>
    </div>
  )}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add components/missions/missions-list.tsx
git commit -m "feat: render social proof on mission cards"
```

---

### Task 4: Verification

- [ ] **Step 1: Verify data flow**
Check if missions are correctly passed and rendered.

- [ ] **Step 2: Verify display rules**
- If 0 completions, check if "Sois le premier" is shown.
- If >= 3 ratings, check if stars and average are shown.
- If < 3 ratings, check if stars are hidden.

# Mission Schema Evolution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the Prisma schema to support rich briefings, manual validation, and specific submission methods for missions.

**Architecture:** Update `Mission` and `MissionSubmission` models in `prisma/schema.prisma` with new fields and default values. Apply changes using `prisma db push` and regenerate the client.

**Tech Stack:** Prisma, PostgreSQL

---

### Task 1: Update Mission Model

**Files:**
- Modify: `prisma/schema.prisma`

- [x] **Step 1: Add new fields to Mission model**
Add `fullBriefing`, `submissionMethod`, and `deliverables` to the `Mission` model.

```prisma
model Mission {
  // ... existing fields ...
  fullBriefing      String?  @db.Text
  submissionMethod  String   @default("ANY_LINK")
  deliverables      String[]
  // ... existing fields ...
}
```

- [x] **Step 2: Verify Mission model**
Check that the fields are correctly placed and follow naming conventions.

---

### Task 2: Update MissionSubmission Model

**Files:**
- Modify: `prisma/schema.prisma`

- [x] **Step 1: Update MissionSubmission model fields**
Ensure `status` defaults to `"PENDING"`, and add `adminFeedback` and `reviewerId`.

```prisma
model MissionSubmission {
  // ... existing fields ...
  status                String   @default("PENDING")
  adminFeedback         String?  @db.Text
  reviewerId            String?
  // ... existing fields ...
}
```

- [x] **Step 2: Verify MissionSubmission model**
Check for consistency with requirements.

---

### Task 3: Database Sync & Client Generation

**Files:**
- Modify: N/A (Internal DB state and generated client)

- [x] **Step 1: Run db push**
Run: `npx prisma db push`

- [x] **Step 2: Run generate**
Run: `npx prisma generate`

- [x] **Step 3: Commit changes**
Commit the `prisma/schema.prisma` file.

```bash
git add prisma/schema.prisma
git commit -m "feat(database): evolve mission and submission schema for V2"
```

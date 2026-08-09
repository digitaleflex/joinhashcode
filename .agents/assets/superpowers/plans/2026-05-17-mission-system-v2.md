# Mission System V2 & Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the mission system into a professional briefing and manual validation workflow with a dedicated admin panel.

**Architecture:**
- **Schema Update:** Add rich content fields to `Mission` and tracking fields to `MissionSubmission`.
- **Dynamic Briefings:** Implement `/missions/[id]` for detailed instructions.
- **Admin Dashboard:** Implement `/admin/submissions` for manual review.
- **Background Actions:** Update QStash/Email triggers to fire upon manual approval.

**Tech Stack:** Next.js (App Router), Prisma, Tailwind CSS, Shadcn/UI, Lucide React, Resend.

---

### Task 1: Database & Schema Evolution

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Update Mission model**

```prisma
model Mission {
  // ... existing fields ...
  fullBriefing      String?  @db.Text
  submissionMethod  String   @default("ANY_LINK") // GITHUB_PR, GOOGLE_DRIVE, ANY_LINK
  deliverables      String[]
  // ... rest of fields ...
}
```

- [ ] **Step 2: Update MissionSubmission model**

```prisma
model MissionSubmission {
  // ... existing fields ...
  status            String   @default("PENDING") // PENDING, APPROVED, REJECTED
  adminFeedback     String?  @db.Text
  reviewerId        String?
  // ... rest of fields ...
}
```

- [ ] **Step 3: Run db push & generate**

Run: `npx prisma db push ; npx prisma generate`

---

### Task 2: Mission Seed Enrichment

**Files:**
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add briefings to existing missions**

Update the `MISSIONS` constant in `seed.ts` with real `fullBriefing` and `deliverables`.

- [ ] **Step 2: Re-run seed**

Run: `npx tsx prisma/seed.ts`

---

### Task 3: Mission Briefing Page

**Files:**
- Create: `app/missions/[id]/page.tsx`
- Modify: `components/missions/missions-list.tsx`

- [ ] **Step 1: Implement detail page UI**

Create a responsive layout with Markdown rendering for the briefing and a submission form.

- [ ] **Step 2: Update list to link to detail**

Change "Démarrer la mission" to link to `/missions/[id]`.

---

### Task 4: Admin Submissions Dashboard

**Files:**
- Create: `app/admin/submissions/page.tsx`
- Create: `app/api/admin/submissions/[id]/route.ts`

- [ ] **Step 1: Build the validation interface**

A table view of `PENDING` submissions with Approve/Reject actions.

- [ ] **Step 2: Implement approval logic**

Create the API that updates status, grants XP, and triggers the "Mission Validée" email.

---

### Task 5: Security & Role Check

**Files:**
- Modify: `proxy.ts`

- [ ] **Step 1: Protect admin routes**

Ensure only users with `role === 'ADMIN'` can access `/admin/*`.

---

### Task 6: Final Polish & Notification Tuning

**Files:**
- Modify: `lib/email.ts`

- [ ] **Step 1: Add "Mission Rejected" email template**

- [ ] **Step 2: Final test of the end-to-end flow**

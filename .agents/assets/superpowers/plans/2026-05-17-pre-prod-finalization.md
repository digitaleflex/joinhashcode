# HASHCODE — Pre-Production Finalization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Secure the platform, enable real profile evolution, and complete critical user features before production launch.

**Architecture:**

- **Evolution Engine:** A background logic layer that updates user vectors based on activity.
- **Security Middleware:** Rate limiting and input sanitization layers.
- **Storage Integration:** Object Storage for user media.

---

### Task 1: Security & Abuse Prevention (Evil Stories)

**Files:**

- Modify: `app/api/user/checkin/route.ts`
- Modify: `app/api/user/update/route.ts`

- [ ] **Step 1: Implement Check-in Frequency Limit**
      Check if a `daily_checkin` already exists for the user in the last 20 hours before allowing a new one. Return 429 if too soon.

- [ ] **Step 2: Input Sanitization (XSS Protection)**
      Use `zod` and a sanitization helper to strip HTML tags from `bio`, `pseudo`, and `note` fields.

- [ ] **Step 3: Rate Limiting (Update API)**
      Add a simple rate limit check (via Upstash Redis if available, or a simpler memory/DB check) to prevent pseudo brute-forcing.

---

### Task 2: The Evolution Engine (Vibrance & Drift)

**Files:**

- Create: `lib/evolution-engine.ts`
- Modify: `app/api/user/checkin/route.ts`
- Modify: `app/api/missions/route.ts`

- [ ] **Step 1: Create the Mathematical Engine**
      Implement `calculateNewVibrancy(currentVibrancy, actionType)` and `calculateConfidenceScore(totalActions)`.

- [ ] **Step 2: Trigger Updates on Action**
      Ensure every check-in and every mission validation updates the user's `behavioralVibrancy` and `confidenceScore` in the DB.

- [ ] **Step 3: Calculate Profile Drift**
      Compare the user's current `behavioralVibrancy` with their initial `QuizResult` to update the `profileDrift` field.

---

### Task 3: Media & Avatar Integration (User Story)

**Files:**

- Create: `app/api/user/avatar/route.ts`
- Modify: `app/settings/page.tsx`

- [ ] **Step 1: Setup Object Storage**
      Create a bucket named `avatars` with public read access.

- [ ] **Step 2: Implement Upload Endpoint**
      Create an API route that accepts a file, uploads it to object storage, and returns the public URL.

- [ ] **Step 3: Update UI**
      Wire the camera button in the Settings page to trigger the file upload and update the user's `image` field.

---

### Task 4: Final Production Audit & Polish

- [ ] **Step 1: Check Metadata & SEO**
      Ensure `NEXT_PUBLIC_APP_URL` is used correctly in all layouts and social tags.

- [ ] **Step 2: Email Deliverability Test**
      Send a real test email via Resend to verify the branded template on mobile devices.

- [ ] **Step 3: Database Indexing Audit**
      Verify that all foreign keys and frequently queried fields (`userId`, `type`, `createdAt`) have proper indexes.

---

### Task 5: Launch Readiness Checklist

- [ ] Verify environment variables in host provider.
- [ ] Run final type check (`npx tsc --noEmit`).
- [ ] Clear test data from production DB.
- [ ] Activate QStash Cron jobs.

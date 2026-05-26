# Design Spec: Mission Submission Timeline (P4)

**Goal:** Provide users with clear visibility into their mission submission status through a visual timeline, reducing uncertainty after submission.

**Architecture:**
- **Data Layer:** Enhance the existing mission page query to include reviewer details.
- **UI Layer:** Create a new `SubmissionTimeline` client component that visualizes the submission's progress through its lifecycle.
- **Integration:** Embed the timeline in the mission detail page sidebar when a submission exists but isn't yet approved.

## 1. Data Requirements
The `MissionSubmission` model needs to include the `reviewer` relation.
In `app/missions/[id]/page.tsx`:
- Include `reviewer` in the submission fetch.
- Select `id`, `pseudo`, and `image` from the `User` model for the reviewer.

## 2. UI Component: `SubmissionTimeline`
- **Location:** `components/missions/submission-timeline.tsx`
- **Props:** Accepts the `submission` object (including `createdAt`, `updatedAt`, `status`, `revisionCount`, `reviewerFeedback`, `adminFeedback`, and `reviewer`).
- **Visuals:**
  - Status steps: "Submitted", "In Review" (or "Revision Requested"), "Approved".
  - Icon-based progress indicators using `lucide-react`.
  - Conditional display of revision counts.
  - Informational sub-labels based on status and reviewer availability.

## 3. Page Integration
In `app/missions/[id]/page.tsx`:
- Import `SubmissionTimeline`.
- Display the timeline in the right sidebar below the status card if a submission exists and `status !== "APPROVED"`.

## 4. Success Criteria
- User sees a timeline after submitting a mission.
- Timeline correctly reflects "Pending", "In Review", or "Needs Revision" states.
- Reviewer pseudo is shown when the submission is claimed.
- Revision history (count) is visible if applicable.

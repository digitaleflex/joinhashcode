# Design Spec: Automatic Release of Expired Claims Cron

**Date:** 2024-05-24
**Status:** Approved
**Topic:** Roadmap P3 - Cron for automatic release of expired claims

## 1. Problem Statement
When a reviewer claims a submission, it enters the `IN_REVIEW` status. If the reviewer fails to complete the review, the submission remains locked indefinitely, preventing other reviewers from picking it up and leaving the author waiting.

## 2. Success Criteria
- Submissions in `IN_REVIEW` status for more than 48 hours are automatically reset to `PENDING`.
- The `reviewerId` is cleared for these submissions.
- The author of the submission is notified that their submission is back in the pool.
- The operation is secure and only callable by authorized services (QStash).
- Audit logs are maintained for each release.

## 3. Architecture
A new internal API route will be implemented as a cron job.

- **Endpoint:** `POST /api/internal/cron/release-claims`
- **Schedule:** Every 6 hours (recommended: `0 */6 * * *`)
- **Authentication:** 
    - Upstash QStash signature verification.
    - Fallback to `x-internal-secret` for local development.

## 4. Implementation Details

### Database Operations
Using Prisma:
1. Find all submissions with `status: "IN_REVIEW"` and `updatedAt < now - 48h`.
2. Update them in bulk to `status: "PENDING"` and `reviewerId: null`.

### Notifications
For each released submission:
- Type: `MISSION_REVIEW_RELEASED`
- Message: "Ta soumission est de nouveau disponible pour review — un nouveau reviewer va bientôt la prendre en charge."
- User: `submission.userId`

### Audit Logging
For each released submission:
- Action: `CLAIM_RELEASED_AUTO`
- Entity: `MissionSubmission`
- Metadata: `{ submissionId, oldReviewerId }`

## 5. Security Considerations
- The route is under `/api/internal/` which should be restricted.
- Mandatory signature check for production environments.
- Use of `force-dynamic` to ensure no caching.

## 6. Testing Plan
- **Mocked DB test:** Verify the time cutoff calculation.
- **Integration test:** 
    - Create a submission.
    - Manually update its `updatedAt` to > 48h ago in the database.
    - Call the API.
    - Verify status is `PENDING` and reviewer is null.
    - Verify notification was sent.

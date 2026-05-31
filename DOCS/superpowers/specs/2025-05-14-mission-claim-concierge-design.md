# Design Spec: Concierge Moderation Mode for Mission Claiming

## Overview
Restrict claiming missions for review to ONLY users with the 'role' ADMIN or MODERATOR. This ensures a higher quality of review by limiting it to authorized personnel.

## Architecture
The restriction will be implemented at the API route level in `app/api/missions/[id]/claim/route.ts`. 

## Components
### 1. API Route Handler (`app/api/missions/[id]/claim/route.ts`)
- Fetch the user's role from the database.
- Verify if the role is `ADMIN` or `MODERATOR`.
- Return `403 Forbidden` if the role is not authorized.
- This check should happen early, right after user retrieval.

## Data Flow
1. User sends a POST request to `/api/missions/[id]/claim`.
2. Server validates the session.
3. Server fetches the user from the DB, including the `role`.
4. Server checks if `user.role` is in `['ADMIN', 'MODERATOR']`.
5. If unauthorized, return `403`.
6. If authorized, proceed with the existing eligibility checks (which are now secondary to the role check).

## Error Handling
- **401 Unauthorized**: User not logged in.
- **403 Forbidden**: User logged in but does not have the required role.
- **404 Not Found**: Mission or user not found.
- **400 Bad Request**: Submission not in PENDING status.

## Testing Strategy (TDD)
### Test Cases
- **Failure Case**: A user with `role: 'MEMBER'` attempts to claim a mission. Expected: `403 Forbidden`.
- **Success Case**: A user with `role: 'ADMIN'` attempts to claim a mission. Expected: `200 OK`.
- **Success Case**: A user with `role: 'MODERATOR'` attempts to claim a mission. Expected: `200 OK`.

### Implementation Plan
1. Create `__tests__/mission-claim-concierge.test.ts` with the failing tests.
2. Verify tests fail (RED).
3. Modify `app/api/missions/[id]/claim/route.ts` to implement the role check.
4. Verify tests pass (GREEN).
5. Clean up and run full test suite.

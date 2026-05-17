# Daily Activity Cron Design

## Goal
Implement a cron job that triggers every 24 hours (configured in Upstash QStash) to remind inactive users to perform their daily check-in.

## Architecture
- **Route:** `app/api/internal/cron/check-activity/route.ts`
- **Security:** QStash signature verification.
- **Logic:**
  1. Calculate the cutoff time (now - 24 hours).
  2. Query users: `class != null` AND (`lastCheckinAt < cutoff` OR `lastCheckinAt == null`).
  3. For each user, call `triggerNotification`.

## Notification Details
- **Type:** `DAILY_REMINDER`
- **Title:** "Ton build t'attend"
- **Message:** "Tu n'as pas signé ton check-in aujourd'hui. Garde le rythme !"
- **Link:** "/dashboard"

## Testing
- Integration test for the route.
- Mocking Prisma and QStash.
- Verify filtering logic and trigger calls.

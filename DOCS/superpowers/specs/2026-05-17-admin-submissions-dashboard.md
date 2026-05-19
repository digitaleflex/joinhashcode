# Admin Submissions Dashboard Design

## Goal
Implement a manual validation interface for HASHCODE admins to review, approve, or reject mission submissions.

## Architecture
- **Page**: `app/admin/submissions/page.tsx` (Server Component for initial fetch, Client Component for interactivity).
- **API**: `app/api/admin/submissions/[id]/route.ts` (Handles approval/rejection logic).
- **Service Layer**: Reuses `evolution-engine.ts` for user growth and `qstash.ts` for notifications.

## Data Flow
1. Admin opens `/admin/submissions`.
2. Server fetches all `PENDING` submissions.
3. Admin clicks "Approve":
   - Calls `PATCH /api/admin/submissions/[id]` with `action: 'APPROVE'`.
   - Backend updates submission status, user XP/Level, evolution, and sends notification.
4. Admin clicks "Reject":
   - Admin enters feedback.
   - Calls `PATCH /api/admin/submissions/[id]` with `action: 'REJECT'` and `feedback`.
   - Backend updates status and sends notification with feedback.

## UI/UX
- Consistent with `app/admin/page.tsx`.
- Dark theme (`bg-zinc-950`).
- Responsive table with clear action buttons.
- Feedback prompt for rejections.

## Security
- Server-side role check (`role === 'ADMIN'`).
- CSRF protection via Next.js and Better Auth.
- Input validation for feedback.

## Testing Strategy
- Manual verification of XP/Level updates.
- Verification of notification delivery.
- Ensure only admins can access the routes.

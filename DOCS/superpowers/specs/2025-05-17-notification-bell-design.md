# Design Spec: Notification Bell System
**Date:** 2025-05-17
**Topic:** Notification UI & Integration

## 1. Overview
Implementation of a notification bell in the dashboard top bar to display the 10 most recent notifications for the authenticated user.

## 2. Architecture
- **API Endpoint:** `/api/user/notifications`
    - `GET`: Fetch latest 10 notifications + unread count.
    - `PATCH`: Mark all notifications as read.
- **Frontend Component:** `components/dashboard/notification-bell.tsx`
    - Uses `useSWR` for data fetching and caching.
    - Uses `framer-motion` for animations.
    - Integrated into `UserTopBar`.

## 3. Detailed Components

### 3.1 API Route (`app/api/user/notifications/route.ts`)
- **Authentication:** Use `auth.getSession(req)` to identify the user.
- **GET Logic:** 
    - Query Prisma for notifications where `userId` matches, ordered by `createdAt` desc, take 10.
    - Count notifications where `userId` matches and `isRead` is false.
- **PATCH Logic:** 
    - Update all notifications for the user to `isRead: true`.

### 3.2 Notification Bell UI
- **Trigger:**
    - Button with `Bell` icon.
    - Animated indicator (ping) if unread count > 0.
- **Dropdown:**
    - `DropdownMenuContent` with consistent styling (blur, border).
    - Header with "Mark all as read" button.
    - Individual items with:
        - Icon mapping (e.g., `CheckCircle` for MISSION_APPROVED).
        - Relative timestamp (using `date-fns`).
        - Unread indicator (blue dot).
    - Empty state message.

## 4. Testing Strategy
- **Manual Verification:**
    - Check if bell shows correct count.
    - Check if clicking "Mark all as read" updates the UI.
    - Check if dropdown displays notifications correctly.
    - Verify empty state.
- **Automated Tests:**
    - Create a test for the API route to ensure it returns correct data for the authenticated user.

## 5. Success Criteria
- [ ] Users can see unread notifications at a glance.
- [ ] Notifications can be marked as read.
- [ ] UI is responsive and accessible.
- [ ] Loading and empty states are handled gracefully.

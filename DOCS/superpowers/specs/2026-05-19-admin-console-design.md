# HASHCODE Admin Console Design Spec

## 1. Overview
Implement user management and moderation tools using the Better Auth `admin` plugin, expanding the existing HASHCODE admin area. The design separates statistical KPIs from active moderation tasks to keep the interface clean and focused.

## 2. Architecture & Navigation

The `/admin` area will be restructured with a sub-navigation menu to switch between views:
- **`/admin` (Dashboard)**: The existing KPI and statistics page.
- **`/admin/users` (Membres)**: The new user management view.
- **`/admin/submissions` (Missions)**: The existing mission validation view.

## 3. Better Auth Integration

### Server-Side (`lib/auth.ts`)
- Import and configure the `admin()` plugin.
- Configure access control to ensure only users with the `ADMIN` role can execute admin actions.

### Client-Side (`lib/auth-client.ts`)
- Import and configure the `adminClient()` plugin to expose management endpoints to the frontend.

## 4. User Management Interface (`/admin/users`)

This page will feature a data table architecture designed for moderation:

### Toolbar
- **Search**: Input field to filter users by name or email.
- **Filter**: Dropdown to filter by Role (Admin, Moderator, Member).

### Data Table
- **Columns**: 
  - User (Avatar, Name, Email)
  - Role (Badge format)
  - Class/Profile (Builder, Creator, etc.)
  - Joined Date
  - Status (Active / Banned)
- **Pagination**: Basic prev/next controls relying on Better Auth's `listUsers` query limits.

### Actions (Row-level Dropdown Menu)
For each user row, an action menu (using Lucide icons) will provide:
1. **Assign Role**: A sub-menu or modal to change the user's role (e.g., promote to Moderator).
2. **Impersonate**: Allows the admin to log in as the user for support purposes (`adminClient.impersonate`). A clear UI indicator must show when an admin is impersonating someone, with a quick action to `stopImpersonating`.
3. **Ban User**: A modal that prompts for a reason and duration, then calls `adminClient.banUser`.

## 5. Security & Constraints
- The `admin` plugin automatically protects endpoints, but UI elements must also be conditionally rendered based on the current user's session role to prevent unauthorized access attempts.
- Prevent an admin from banning themselves or modifying their own role to lower privileges accidentally.

## 6. Testing Strategy
- Ensure `admin` and `adminClient` plugins load correctly.
- Verify that non-admin users attempting to access `/admin/users` are redirected to the dashboard.
- Confirm that role changes and ban actions reflect in the database and block the target user's access appropriately.

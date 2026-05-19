# HASHCODE Admin Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a robust admin interface for HASHCODE Community using Better Auth's `admin` plugin, allowing user management, role assignment, and moderation.

**Architecture:** Extend the existing `/admin` route by adding a dedicated `/admin/users` page and a shared navigation layout. Use Better Auth's server and client plugins for secure moderation actions.

**Tech Stack:** Next.js (App Router), Better Auth (Admin Plugin), Prisma, Lucide React, Shadcn/UI.

---

### Task 1: Update Database Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add ban fields to User model**
Modify the `User` model in `prisma/schema.prisma` to include fields required by the Better Auth admin plugin.

```prisma
model User {
  // ... existing fields
  role                     String              @default("MEMBER")
  banned                   Boolean?            @default(false)
  banReason                String?
  banExpires               DateTime?
  // ... rest of the model
}
```

- [ ] **Step 2: Run Prisma Generate**
Run: `npx prisma generate`
Expected: Prisma client updated.

- [ ] **Step 3: Commit schema changes**
```bash
git add prisma/schema.prisma
git commit -m "db: add ban fields to User model for Better Auth admin plugin"
```

### Task 2: Configure Better Auth Admin Plugin

**Files:**
- Modify: `lib/auth.ts`
- Modify: `lib/auth-client.ts`

- [ ] **Step 1: Add admin plugin to server-side auth**
Update `lib/auth.ts` to include the `admin` plugin. Configure it to use the existing `role` field.

```typescript
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  // ...
  plugins: [
    admin({
      // We use the 'role' field already present in our User model
    }),
    // ... other plugins
  ],
});
```

- [ ] **Step 2: Add adminClient plugin to client-side auth**
Update `lib/auth-client.ts` to include the `adminClient` plugin.

```typescript
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    // ...
  ],
});
```

- [ ] **Step 3: Commit auth configuration**
```bash
git add lib/auth.ts lib/auth-client.ts
git commit -m "feat: configure Better Auth admin and adminClient plugins"
```

### Task 3: Create Admin Shared Layout

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `components/admin/AdminNav.tsx`

- [ ] **Step 1: Create Admin Navigation component**
Create `components/admin/AdminNav.tsx` with links to Dashboard, Membres, and Missions.

```tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FileCheck } from "lucide-react"

export function AdminNav() {
  const pathname = usePathname()
  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Membres", icon: Users },
    { href: "/admin/submissions", label: "Missions", icon: FileCheck },
  ]

  return (
    <nav className="flex gap-4 border-b border-white/5 px-8 py-2">
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${
              isActive ? "text-primary border-b border-primary" : "text-muted-foreground hover:text-white"
            }`}
          >
            <link.icon className="h-3 w-3" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: Create Admin Layout**
Create `app/admin/layout.tsx` to include the header and navigation.

```tsx
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin/AdminNav"
import { Activity } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Activity className="h-3 w-3 text-primary" />
          </div>
          <span className="font-mono text-sm font-bold text-white">HASHCODE · ADMIN</span>
        </div>
        <a href="/dashboard" className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
          ← Dashboard
        </a>
      </div>
      <AdminNav />
      <main>{children}</main>
    </div>
  )
}
```

- [ ] **Step 3: Commit Admin Layout**
```bash
git add app/admin/layout.tsx components/admin/AdminNav.tsx
git commit -m "ui: add admin layout and navigation"
```

### Task 4: Implement User Management Interface

**Files:**
- Create: `app/admin/users/page.tsx`
- Create: `components/admin/UserManagementTable.tsx`
- Create: `components/admin/UserRowActions.tsx`

- [ ] **Step 1: Create UserRowActions component**
Implement actions for Ban, Change Role, and Impersonate.

- [ ] **Step 2: Create UserManagementTable component**
Use `authClient.admin.listUsers` to fetch and display users with pagination.

- [ ] **Step 3: Create /admin/users page**
Assemble the page using the `UserManagementTable`.

- [ ] **Step 4: Commit User Management UI**
```bash
git add app/admin/users/page.tsx components/admin/UserManagementTable.tsx components/admin/UserRowActions.tsx
git commit -m "feat: implement user management table with Better Auth actions"
```

### Task 5: Cleanup Existing Admin Page

**Files:**
- Modify: `app/admin/page.tsx`

- [ ] **Step 1: Remove redundant layout from /admin/page.tsx**
Since we now have a shared layout, remove the header and redundant session checks from the main page.

- [ ] **Step 2: Commit cleanup**
```bash
git add app/admin/page.tsx
git commit -m "refactor: clean up admin dashboard to use shared layout"
```

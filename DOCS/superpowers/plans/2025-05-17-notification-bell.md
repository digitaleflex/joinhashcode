# Notification Bell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a functional notification bell in the dashboard top bar with a dropdown menu showing recent notifications.

**Architecture:** Use `useSWR` for client-side fetching from a new Next.js API route. Prisma is used for database operations. Shadcn/UI components provide the base for the dropdown.

**Tech Stack:** Next.js (App Router), Prisma, Shadcn/UI, Lucide-React, useSWR, Framer Motion, date-fns.

---

### Task 1: API Route Implementation

**Files:**
- Create: `app/api/user/notifications/route.ts`
- Create: `__tests__/notifications-api.test.ts`

- [ ] **Step 1: Write the failing test for GET**

```typescript
import { expect, test, describe, beforeAll, afterAll } from "vitest";
import { GET } from "../app/api/user/notifications/route";
import { NextRequest } from "next/server";

describe("Notifications API", () => {
  test("GET returns 401 if not authenticated", async () => {
    const req = new NextRequest("http://localhost/api/user/notifications");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest __tests__/notifications-api.test.ts`
Expected: FAIL (route doesn't exist)

- [ ] **Step 3: Implement GET handler**

```typescript
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: session.user.id, isRead: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}
```

- [ ] **Step 4: Implement PATCH handler (Mark all as read)**

```typescript
export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 5: Run tests to verify pass**

Run: `pnpm vitest __tests__/notifications-api.test.ts`
Expected: PASS (Update test to mock auth if needed)

- [ ] **Step 6: Commit**

```bash
git add app/api/user/notifications/route.ts __tests__/notifications-api.test.ts
git commit -m "feat(api): add notifications route"
```

---

### Task 2: Notification Bell Component

**Files:**
- Create: `components/dashboard/notification-bell.tsx`

- [ ] **Step 1: Create the basic component structure**

```tsx
"use client"

import { Bell, CheckCircle, Info, AlertTriangle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const iconMap: Record<string, any> = {
  MISSION_APPROVED: CheckCircle,
  LEVEL_UP: Star,
  DAILY_REMINDER: Info,
  SYSTEM: AlertTriangle,
}

export function NotificationBell() {
  const { data, mutate } = useSWR("/api/user/notifications", fetcher, {
    refreshInterval: 60000, // Refresh every minute
  })

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || 0

  const markAllAsRead = async () => {
    await fetch("/api/user/notifications", { method: "PATCH" })
    mutate({ ...data, unreadCount: 0, notifications: notifications.map((n: any) => ({ ...n, isRead: true })) }, false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]"
            >
              <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></span>
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-card/95 backdrop-blur-xl border-border/40 rounded-2xl p-2">
        <div className="flex items-center justify-between p-3">
          <DropdownMenuLabel className="font-mono text-[10px] uppercase text-muted-foreground p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-[10px] text-primary hover:underline font-medium"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-border/40" />
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Aucune notification pour le moment.
            </div>
          ) : (
            notifications.map((notif: any) => {
              const Icon = iconMap[notif.type] || Info
              return (
                <DropdownMenuItem key={notif.id} className="rounded-xl focus:bg-primary/10 p-3 flex gap-3 cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-muted/50' : 'bg-primary/20 text-primary'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <p className={`text-xs font-semibold truncate ${notif.isRead ? 'text-muted-foreground' : 'text-white'}`}>
                      {notif.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-mono">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 self-center" />
                  )}
                </DropdownMenuItem>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/dashboard/notification-bell.tsx
git commit -m "feat(ui): add notification bell component"
```

---

### Task 3: Integration into UserTopBar

**Files:**
- Modify: `components/dashboard/user-topbar.tsx`

- [ ] **Step 1: Replace placeholder with NotificationBell**

```tsx
// Import NotificationBell
import { NotificationBell } from "./notification-bell"

// Replace the old button with <NotificationBell />
// In UserTopBar component:
<div className="flex items-center gap-2 md:gap-4">
  <NotificationBell />
  <DropdownMenu>
    {/* ... Profile Dropdown ... */}
  </DropdownMenu>
</div>
```

- [ ] **Step 2: Verify visual integration**

Check dashboard and ensure bell is present and looks correct.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/user-topbar.tsx
git commit -m "feat(ui): integrate notification bell into topbar"
```

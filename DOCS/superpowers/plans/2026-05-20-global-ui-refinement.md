# Global UI Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement industrial-grade responsive design standards, fluid typography, and navigation consistency across the HASHCODE platform.

**Architecture:** Global CSS variables for fluid scaling, structural component updates for overflow prevention, and layout-level integration for mobile navigation.

**Tech Stack:** Next.js (App Router), Tailwind CSS v4, Lucide React, Framer Motion.

---

### Task 1: Fluid Typography & Global Reset

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Define fluid typography variables**

Replace existing `:root` variables in `app/globals.css` with fluid scales using `clamp()`.

```css
:root {
  /* ... existing colors ... */
  
  /* Fluid Typography - Industry Standard Scales */
  --h1-size: clamp(2rem, 8vw, 4.5rem);
  --h2-size: clamp(1.5rem, 6vw, 3rem);
  --h3-size: clamp(1.25rem, 4vw, 2.25rem);
  --body-lg: clamp(1rem, 2vw, 1.25rem);
  
  --radius: 0.75rem;
  --bottom-nav-height: 5rem;
}
```

- [ ] **Step 2: Apply global overflow prevention**

Update the `html` and `body` rules in `app/globals.css`.

```css
html {
  @apply bg-background overflow-x-hidden w-full;
  scroll-behavior: smooth;
}
body {
  @apply bg-background text-foreground overflow-x-hidden relative min-h-screen font-syne antialiased w-full;
  font-feature-settings: 'cv11', 'ss01';
}
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: implement fluid typography and global overflow reset"
```

---

### Task 2: Structural Integrity for Cards

**Files:**
- Modify: `components/ui/card.tsx`

- [ ] **Step 1: Add overflow-hidden and transition to Card component**

Ensure cards don't let content bleed out and have smooth hover states.

```tsx
// components/ui/card.tsx
function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm transition-all duration-300 overflow-hidden',
        variant === 'premium' && 'glass-card hover:border-primary/30',
        className,
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/card.tsx
git commit -m "style: add overflow-hidden to base Card component"
```

---

### Task 3: Mobile Navigation Integration

**Files:**
- Modify: `components/dashboard/dashboard-shell.tsx`

- [ ] **Step 1: Import and add BottomNav to DashboardShell**

Make sure the bottom navigation is part of the core dashboard layout.

```tsx
// components/dashboard/dashboard-shell.tsx
import { BottomNav } from "./bottom-nav"

// ... inside DashboardShell return ...
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="bg-background relative bg-gradient-mesh overflow-hidden">
        <div className="scanline"></div>
        <UserTopBar user={user} />

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
            {/* ... rest of content ... */}
        </main>
        
        {/* Mobile Navigation */}
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
```

- [ ] **Step 2: Commit**

```bash
git add components/dashboard/dashboard-shell.tsx
git commit -m "feat: integrate BottomNav into DashboardShell"
```

---

### Task 4: Welcome Banner Responsive Fix

**Files:**
- Modify: `components/dashboard/dashboard-shell.tsx`

- [ ] **Step 1: Update typography classes for the Welcome Banner**

Replace hardcoded `text-4xl sm:text-6xl` with more conservative responsive scales.

```tsx
// components/dashboard/dashboard-shell.tsx
// Find the <h2> inside the welcome banner
<h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-[-0.04em] leading-tight text-white">
  Bienvenue, <span className={config.color}><ScrambleText text={user.name.split(' ')[0]} duration={1000} /></span>.
</h2>
```

- [ ] **Step 2: Adjust mobile padding**

```tsx
// Find the welcome banner div
<div className={`p-6 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] glass-card relative overflow-hidden group border-white/5`}>
```

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/dashboard-shell.tsx
git commit -m "style: fix responsive typography and padding in Welcome Banner"
```

---

### Task 5: Final Validation

- [ ] **Step 1: Verify build and lint**

Run: `npm run build`
Expected: Success

- [ ] **Step 2: Manual mobile check simulation**

Check that `overflow-x-hidden` is present on `html` and `body` in the built output.
Verify `BottomNav` appears in the DOM.

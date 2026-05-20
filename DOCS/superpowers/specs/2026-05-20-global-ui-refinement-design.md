# Design Spec: Global UI Refinement & Mobile Optimization

**Date:** 2026-05-20
**Status:** Draft
**Topic:** Mobile Typography, Overflow Fixes, and Layout Integration

## 1. Executive Summary
This spec outlines the global UI refinements for the HASHCODE community platform, focusing on mobile responsiveness and industrial design standards. The goal is to eliminate visual "aggression" (overly large fonts on mobile), fix layout overflows, and ensure a seamless mobile navigation experience via a persistent Bottom Navigation bar.

## 2. Goals & Success Criteria
- **Fluid Typography:** Headings scale smoothly between mobile and desktop without manual breakpoint management for every element.
- **Zero Horizontal Overflow:** Root-level constraints to prevent the common mobile "side-scrolling" bug.
- **Persistent Mobile Navigation:** BottomNav visible and correctly positioned on all main app surfaces.
- **Structural Integrity:** Actions (buttons) are strictly encapsulated within their respective cards.

## 3. Technical Approach

### 3.1 Fluid Typography System
Instead of fixed `text-4xl` or `text-6xl`, we will introduce CSS variables using the `clamp()` function in `globals.css`:
```css
:root {
  --h1-size: clamp(2rem, 5vw + 1rem, 5rem); /* Dynamic scale */
  --h2-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}
```
We will then replace hardcoded Tailwind classes in key components (e.g., Welcome Banner, Hero) with these variables or equivalent responsive Tailwind utilities (e.g., `text-2xl sm:text-4xl md:text-6xl`).

### 3.2 Layout & Navigation
- **DashboardShell Integration:** The `BottomNav` component will be added to the `DashboardShell` to ensure it appears on the main dashboard page.
- **Viewport Constraints:** Add `max-w-full overflow-x-hidden` to the main `SidebarInset` and `main` tags.

### 3.3 Component Updates
- **Card Component:** Ensure `CardFooter` is used for all actions. Update `Card` to include `overflow-hidden` by default to clip any internal overflows.
- **Welcome Banner:** Reduce mobile padding and font-size tracking. Use `leading-tight` instead of `leading-[0.9]` on small screens to prevent text overlap.

## 4. Components Affected
- `app/globals.css`: Root variables and base styles.
- `components/dashboard/dashboard-shell.tsx`: Main layout structure.
- `components/ui/card.tsx`: Base card component.
- `components/dashboard/bottom-nav.tsx`: Fixed positioning and safe-area-insets.

## 5. Verification Plan
- **Mobile Viewport Check:** Inspect at 360px and 390px (iPhone/Android standard) to ensure zero horizontal scroll.
- **Typography Audit:** Verify that "Bienvenue" and other large headings don't break the layout on mobile.
- **Interaction Test:** Ensure the BottomNav doesn't overlap critical content or buttons.
- **Lighthouse/A11y:** Check that touch targets remain >= 44px.

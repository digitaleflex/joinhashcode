# HASHCODE UI/UX - Component Standards

## Design System
- **Theme:** Dark Mode by default.
- **Aesthetic:** "Cyber-Modern" (Glows, glassmorphism, mono fonts for data, sans-serif for content).
- **Colors:** Primary (Cyan/Blue glow), Secondary (Purple/Indigo), Background (Deep black/Zinc).

## Component Rules
- **Shadcn/UI:** Use existing components from `components/ui/`.
- **Accessibility:** Use Radix primitives (via Shadcn) for ARIA compliance.
- **Performance:** Use `use client` sparingly. Only for interactive elements.
- **Icons:** Use Lucide React exclusively for consistency.

## Layouts
- **Dashboard:** Sidebar-based navigation with a top-bar for user status.
- **Mobile:** Bottom navigation bar for core features.

## Visual Fidelity
- Use `framer-motion` (if available) or CSS transitions for all state changes.
- Apply `btn-primary-glow` class for main CTAs.
- Use mono-spaced fonts (`font-mono`) for numerical data, XP, and status tags.

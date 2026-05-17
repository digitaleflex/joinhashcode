# HASHCODE UI/UX Skill

## Overview
Enforces the visual identity and user experience standards of HASHCODE.

## Visual Standards
- **Font:** Use `font-mono` for all system status, XP counts, and numerical data.
- **Colors:** Cyan/Blue for primary actions, Indigo for secondary, Emerald for success, Rose for errors.
- **Glows:** Apply `shadow-[0_0_10px_rgba(var(--primary),0.5)]` or the `btn-primary-glow` class for interactive elements.

## Reusable Patterns
- **Cards:** Use `bg-card/30 border-border/40 backdrop-blur-xl` for a glassmorphism effect.
- **Progress Bars:** Always show percentage and use a subtle glow on the progress fill.
- **Transitions:** Use `animate-in fade-in duration-500` for content entry.

## Branding Assets
- Logo: `/hashcode-logo.png`
- App Icon: `/app-icon.png`
- Full Branding Guide: `.agents/assets/branding/` (or wherever moved).

## Instructions
- Every new component must be checked for "Visual Fidelity" (spacing, contrast, and theme alignment).
- Avoid cluttered layouts; prioritize focus and readability.
- Ensure mobile responsiveness for all mission-related UIs.

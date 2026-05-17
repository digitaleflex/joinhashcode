# HASHCODE Mission Architect Skill

## Overview
This skill provides the standard operating procedure for creating and validating missions within the HASHCODE ecosystem.

## Mission Structure
Missions are defined in `lib/missions.ts` and seeded in `prisma/seed.ts`.

## Step-by-Step Workflow
1.  **Define the Mission:** Add the mission object to `MISSIONS` array in `lib/missions.ts`.
2.  **Seed the Database:** Add the mission to the `main()` function in `prisma/seed.ts`.
3.  **Implement Validation:**
    *   **Generic:** Use the standard GitHub/Link submission in `components/missions/missions-list.tsx`.
    *   **Specialized:** (e.g., social clicks, quiz) Implement custom logic in the UI and create a specific API route if needed.
4.  **Verify Evolution:** Ensure the mission weights (Builder, Creator, etc.) align with the mission's intent to maintain accurate Vibrancy tracking.

## Validation Types
- `INTRO`: Two-sentence introduction.
- `NETWORK`: Social link clicks (Telegram, Discord, WhatsApp).
- `CODE/DESIGN/BUSINESS`: Project link submission (GitHub, Figma, URL).

## Instructions
- Keep mission descriptions concise and motivating.
- Ensure XP rewards are balanced with the effort required.
- Always run `npx prisma db seed` after adding new missions to local DB.

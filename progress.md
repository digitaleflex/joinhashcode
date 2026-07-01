# Progress

## Done

- Replace "Voir le Dossier" with "Inviter dans mon escouade" for squad owners/admins (others still see "Voir le Dossier")
- Created `InviteAnalysisDialog` with synergy score (0–100%), class composition bars, tool overlap detection, and coach-style advice
- Post-invite: shows "Voir le dossier" link after successful send
- Created `POST /api/squad/invite/route.ts` — validates auth, owner/admin role, cognitive balance (max 2 per class), squad size (max 5), duplicate check; creates Invitation in DB; fires in-app notification + email
- Fixed `welcome-modal.tsx` close button (X) z-index conflict (`z-10` → `z-20`)
- Created `scripts/deploy.sh` — git pull, build, docker build, docker compose up, health check, auto-rollback
- **Privacy defaults**: `talentVisible` default changed to `false`; existing users updated via raw SQL
- **Settings**: added `talentVisible` to allowed fields + Zod schema
- **Public API**: removed all psychometric scores from `/api/public/talent`
- **Public profile `/u/[pseudo]`**: privacy check — no email, scores, behavioralVibrancy, activityLogs, missionSubmissions, squad roster, referral count, streak exposed
- **DossierView**: `isPrivate` prop, "Profil Privé" banner; Neuro-Mapping, Neural Sync, Performance Indexes, Radar, XP Growth, Missions hidden when `isPublic`
- **Free Agent filter**: new button in talent directory to show only users not in any squad
- **Free Agent badge**: green "Free" badge on cards for unaffiliated users

## In Progress

_(none)_

## Blocked

_(none)_

## Next Steps

_(none — feature complete per current scope)_

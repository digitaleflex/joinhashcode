# Audit 00 — Project Inventory & Reality Map

> Baseline: `main` — 2026-09-08  
> Scope: inventory-level audit based on repository tree and targeted inspection. This is **not yet** a full feature-by-feature verification.

## Executive Summary

JoinHashCode is a large Next.js 16 full-stack application built around Prisma 7/PostgreSQL and Better Auth. The repository already contains substantial implementation for authentication, onboarding, missions, submissions, reviews, gamification, squads, notifications, admin operations and testing.

The primary audit risk is **documentation/code drift**: the repository contains an architecture audit recommending removal or freezing of several systems, while the current code still actively configures or references some of them.

## Observed Stack

- Next.js 16.3
- React 19
- TypeScript
- Prisma 7 + PostgreSQL
- Better Auth
- TanStack React Query
- Upstash Redis / Rate Limit
- Resend
- Vitest + Playwright
- Tailwind CSS 4

Evidence:
- `package.json`
- `prisma/schema.prisma`
- `lib/auth.ts`
- `lib/prisma.ts`

## Reality Findings

### INV-001 — Authentication is materially implemented
**Status:** IMPLEMENTED  
**Confidence:** HIGH

Evidence:
- Google OAuth configured in `lib/auth.ts`
- GitHub OAuth configured in `lib/auth.ts`
- Magic Link plugin configured
- Email OTP configured
- multiSession configured
- twoFactor configured
- admin RBAC configured
- Better Auth catch-all route exists at `app/api/auth/[...all]/route.ts`

### INV-002 — Mission system is materially implemented
**Status:** IMPLEMENTED / PARTIAL verification  
**Confidence:** HIGH

Evidence:
- Mission and MissionSubmission Prisma models
- GET/POST mission route at `app/api/missions/route.ts`
- transactional submission handling
- level requirements
- revision limits
- cycle keys
- XP side effects
- notification/email side effects
- review claim route at `app/api/missions/[id]/claim/route.ts`
- dedicated mission tests in `__tests__/`

### INV-003 — Rate limiting is active in inspected mission flows
**Status:** IMPLEMENTED  
**Confidence:** HIGH

Evidence:
- `mutationLimiter` used for mission submission
- `claimLimiter` used for review claim
- auth-level rate limiting configured in Better Auth

**Impact:** Existing issue #317 must be re-validated against the current branch before remediation.

### INV-004 — Documentation conflicts with current authentication code
**Status:** DOCUMENTATION_DRIFT  
**Confidence:** HIGH

`ARCHITECTURE_AUDIT.md` recommends removing/freezing GitHub OAuth and 2FA, but `lib/auth.ts` currently configures:
- GitHub OAuth
- twoFactor plugin
- multi-session
- organization/squad support

These are active code paths, not merely documentation.

### INV-005 — Architecture audit itself is a recommendation, not ground truth
**Status:** CONFIRMED AUDIT RULE  
**Confidence:** HIGH

The repository's `ARCHITECTURE_AUDIT.md` proposes aggressive simplification:
- fewer API routes
- fewer Prisma models
- removal/freezing of feature flags and squads capabilities
- MVA architecture

None of these recommendations should be executed automatically without usage/dependency verification.

### INV-006 — Prisma User model is highly central
**Status:** IMPLEMENTED / ARCHITECTURAL RISK  
**Confidence:** HIGH

The User model contains profile, psychometric, progression, streak, 2FA, referral, social, beta and lifecycle concerns. It has extensive relations.

This validates the need for a dedicated Database audit before executing issue #252.

### INV-007 — Squads are implemented through Better Auth Organization
**Status:** IMPLEMENTED / PARTIAL verification  
**Confidence:** HIGH

Evidence:
- `Organization`, `Member`, `Invitation`, `JoinRequest` models
- organization plugin in `lib/auth.ts`
- dashboard queries active membership data

The product terminology and underlying Better Auth organization model should be audited for lifecycle and authorization consistency.

### INV-008 — XP and side effects are already coupled to mission submission
**Status:** IMPLEMENTED / NEEDS TRANSVERSE AUDIT  
**Confidence:** HIGH

Mission submission performs:
- DB transaction
- XP award
- mission completion count update
- analytics event
- notification
- email

The transaction boundary and failure behavior of post-transaction side effects require Cross-Feature verification.

### INV-009 — Significant automated test surface exists
**Status:** IMPLEMENTED  
**Confidence:** HIGH

Observed tests include:
- auth-flow
- onboarding API
- mission engine
- mission attempt/review
- admin submissions
- evolution engine
- activation checklist
- accessibility-related tooling

Coverage quality remains UNKNOWN until Test Audit.

## Preliminary Domain Registry

| Domain | Status | Confidence | Notes |
|---|---|---:|---|
| Authentication | IMPLEMENTED | HIGH | Dedicated audit required |
| Account lifecycle | PARTIAL | MEDIUM | Delete/deactivate/ban must be traced |
| Onboarding | IMPLEMENTED/PARTIAL | MEDIUM | API tests observed |
| Psychometric quiz | IMPLEMENTED/PARTIAL | MEDIUM | Scores stored on User + QuizResult |
| Missions | IMPLEMENTED | HIGH | Strong code/test evidence |
| Reviews | IMPLEMENTED/PARTIAL | HIGH | Claim route inspected |
| XP/Gamification | IMPLEMENTED/PARTIAL | HIGH | Coupled side effects |
| Squads | IMPLEMENTED/PARTIAL | HIGH | Organization plugin |
| Notifications | IMPLEMENTED/PARTIAL | MEDIUM | Trigger observed |
| Admin | IMPLEMENTED/PARTIAL | MEDIUM | Tests/docs/routes require audit |
| Database | IMPLEMENTED | HIGH | Complex central schema |
| API | IMPLEMENTED | HIGH | Full inventory pending |
| Testing | IMPLEMENTED | HIGH | Quality pending |
| DevOps | PARTIAL | MEDIUM | Workflow inventory pending |
| Security | PARTIAL | MEDIUM | Controls observed, full threat audit pending |

## Priority Findings

### P0
1. **INV-P0-001:** Do not execute model-deletion/simplification issue #252 before dependency mapping.
2. **INV-P0-002:** Validate account deletion/privacy lifecycle independently; schema contains many cascading relationships.
3. **INV-P0-003:** Audit mission side effects end-to-end: submission → review → XP → notification → email → analytics.

### P1
4. Resolve documentation/code contradictions around GitHub OAuth, 2FA, Redis and squads.
5. Complete API route inventory and authorization matrix.
6. Audit test quality rather than counting tests.

## Recommended Next Audits

1. Authentication & Account Lifecycle
2. Mission Engine
3. Submission & Review
4. Database / Prisma
5. Security & Threat Model
6. Cross-Feature Consistency

## Important Correction to Existing Backlog Assumptions

Issue #317 cannot currently be treated as an unverified missing feature: inspected mission claim/submission routes already use rate limiters. The issue must be classified after complete scope verification.

## Audit Status

**Audit 00:** STARTED  
**Inventory confidence:** MEDIUM-HIGH  
**Full repository feature registry:** PENDING

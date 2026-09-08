# Audit 01 — Authentication & Account Lifecycle

> Baseline inspected: main, 2026-09-08
> Status: INITIAL FINDINGS — full endpoint matrix pending

## Executive Summary

The authentication foundation is materially implemented through Better Auth with Google, GitHub, Magic Link, Email OTP, multi-session, TOTP 2FA, RBAC and organization support.

The account deletion flow is also materially implemented at `app/api/user/delete/route.ts`. This changes the baseline assumption behind issue #318: the question is no longer whether deletion exists, but whether the lifecycle is complete, correct and regression-tested.

## Confirmed Capabilities

| Capability | Status | Evidence |
|---|---|---|
| Google OAuth | IMPLEMENTED | lib/auth.ts |
| GitHub OAuth | IMPLEMENTED | lib/auth.ts |
| Magic Link | IMPLEMENTED | lib/auth.ts |
| Email OTP | IMPLEMENTED | lib/auth.ts |
| TOTP 2FA | IMPLEMENTED | lib/auth.ts |
| Multi-session | IMPLEMENTED | lib/auth.ts |
| Admin/Moderator RBAC | IMPLEMENTED | lib/auth.ts |
| Session management | IMPLEMENTED/PARTIAL | multiSession + RBAC permissions |
| Account deletion | IMPLEMENTED | app/api/user/delete/route.ts |
| Auth rate limiting | IMPLEMENTED | lib/auth.ts |
| Account lifecycle rate limiting | IMPLEMENTED | app/api/user/delete/route.ts |

## AUTH-001 — Sensitive error detail leakage risk

**Status:** CONFIRMED
**Priority:** P1

The auth catch-all wrapper returns the caught error message in JSON:

```text
{ error: "Internal Server Error", message }
```

Internal provider/database/authentication details should not be returned to clients on unexpected 500 errors.

### Required correction
Return a generic client message and log the detailed error server-side only.

## AUTH-002 — Account deletion exists but post-deletion lifecycle is asynchronous

**Status:** PARTIALLY_CONFIRMED
**Priority:** P0/P1 validation

The deletion route:
- checks CSRF origin
- requires session
- rate-limits lifecycle actions
- anonymizes attempts/submissions/reviews
- deletes the user transactionally
- logs purge activity
- sends confirmation/admin emails after deletion

The post-transaction email operations are not awaited. This is reasonable for availability, but delivery failure must not be interpreted as lifecycle failure.

### Required audit
Verify:
- all related models are covered
- cascades are intentional
- public profile is inaccessible
- sessions/tokens cannot remain valid
- deleted user cannot authenticate
- activity metadata cannot re-identify the user
- tests cover the lifecycle

## AUTH-003 — Documentation/code drift confirmed

**Status:** CONFIRMED
**Priority:** P1

GitHub OAuth and TOTP 2FA are active in `lib/auth.ts` despite contrary simplification recommendations in architecture documentation.

## AUTH-004 — Trusted origins require environment audit

**Status:** PARTIAL
**Priority:** P1

Trusted origins are dynamically assembled from environment URLs plus localhost in non-production. Production environment values and deployment topology must be audited to ensure no unintended origins are trusted.

## AUTH-005 — Global auth rate limit exists

**Status:** IMPLEMENTED

Configured:
- global 50 requests / 60 seconds
- OTP send 2 / 60 seconds
- OTP sign-in 3 / 60 seconds

Production Redis/secondary storage behavior still requires runtime verification.

## Updated Issue Interpretation

### #318
**Do not treat as MISSING IMPLEMENTATION.**
Reclassify to lifecycle completeness and privacy validation.

### #344
Confirmed documentation/code alignment work.

## Next Actions

1. Create issue for AUTH-001 error leakage correction.
2. Expand #342 with lifecycle test matrix rather than rebuilding deletion.
3. Audit session revocation and deleted-user authentication behavior.
4. Verify production trusted origins.

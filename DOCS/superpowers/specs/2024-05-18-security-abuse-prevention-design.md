# Design Spec: Security & Abuse Prevention (Task 1)

Date: 2024-05-18
Topic: Security & Abuse Prevention

## 1. Overview
Implement anti-abuse measures for the HASHCODE platform, focusing on check-in frequency limits, input sanitization, and profile update rate limiting.

## 2. Goals
- Prevent users from spamming check-ins (limit: once every 20 hours).
- Sanitize user-submitted text (note, bio, pseudo) to prevent XSS by stripping all HTML tags.
- Implement a basic rate limit for profile updates to prevent spamming the database.

## 3. Architecture & Implementation

### 3.1 Sanitization Utility
Add a helper in `lib/utils.ts`:
```typescript
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>?/gm, "").trim();
}
```

### 3.2 Check-in Frequency (api/user/checkin/route.ts)
- **Logic**: Check for a `DailyCheckin` record for the current user created within the last 20 hours.
- **Error**: 429 "Tu as déjà signé ton check-in aujourd'hui. Garde ton énergie pour demain !".
- **Sanitization**: Apply `stripHtml` to the `note` field via Zod `.transform()`.

### 3.3 User Update Security (api/user/update/route.ts)
- **Rate Limit**: Check `user.updatedAt`. If less than 60 seconds ago, return 429 "Doucement ! Tu as mis à jour ton profil il y a moins d'une minute.".
- **Sanitization**: Apply `stripHtml` to `pseudo` and `bio` fields via Zod `.transform()`.

## 4. Testing Plan
- **Check-in**:
  - Test 1: Submit a check-in. Should succeed.
  - Test 2: Submit another check-in immediately. Should fail with 429.
  - Test 3: Submit with HTML tags in `note`. Tags should be stripped in the DB.
- **Update**:
  - Test 1: Update profile. Should succeed.
  - Test 2: Update again within 60s. Should fail with 429.
  - Test 3: Submit with HTML tags in `pseudo` or `bio`. Tags should be stripped.

## 5. Security Validation
- Verified that all external inputs for these routes are sanitized.
- Verified that rate limits are enforced server-side.

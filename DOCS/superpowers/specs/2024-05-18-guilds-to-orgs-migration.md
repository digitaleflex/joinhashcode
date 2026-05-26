# Design Spec: Migrate Guilds to Better Auth Organizations

**Status:** Draft
**Author:** Gemini CLI
**Date:** 2024-05-18

## 1. Overview
HASHCODE currently uses a legacy `Guild` and `GuildMember` system for squads. We are migrating to Better Auth's `organization` plugin, which uses `Organization`, `Member`, and `Invitation` models.

## 2. Data Migration Mapping

### 2.1 Guild -> Organization
| Guild Field | Organization Field | Note |
|-------------|--------------------|------|
| `id`        | `id`               | Keep IDs to preserve relations |
| `name`      | `name`             | |
| `slug`      | `slug`             | |
| `cohesionScore` | `cohesionScore` | Custom field in Better Auth schema |
| `streakCount` | `streakCount` | Custom field in Better Auth schema |
| `lastStreakAt` | `lastStreakAt` | Custom field in Better Auth schema |
| `requiredLevel` | `requiredLevel` | Custom field in Better Auth schema |
| `isPrivate` | `isPrivate` | Custom field in Better Auth schema |
| `createdAt` | `createdAt` | |
| `updatedAt` | `metadata` (JSON) | Optional, or just ignore |

### 2.2 GuildMember -> Member
| GuildMember Field | Member Field | Note |
|-------------------|--------------|------|
| `id`              | `id`         | |
| `userId`          | `userId`     | |
| `guildId`         | `organizationId` | |
| `role`            | `role`       | `LEADER` -> `owner`, `MEMBER` -> `member` |
| `joinedAt`        | `createdAt`  | |

## 3. Implementation Plan

### 3.1 Migration Script
Create `scripts/migrate-guilds-to-orgs.ts` using `tsx`.
- Use `pdd5ViZYZqsOLCQul9YWzCavRUCFu3f7` (E-FLEX) as the default creator for archetype guilds.

### 3.2 Logic Refactoring
- **`lib/squad-logic.ts`**: Update all functions to use `Organization` and `Member`.
- **`app/actions/quiz.ts`**: Update the transaction to enroll users in `Organization` instead of `Guild`.

### 3.3 Verification
- Run the migration script.
- Verify user dashboard shows the correct organization.
- Verify squad cohesion updates still work.

## 4. Risks & Mitigations
- **Role Mismatch**: Better Auth roles are `owner`, `admin`, `member`. We map `LEADER` to `owner`.
- **Custom Fields**: Ensure `lib/auth.ts` has the `additionalFields` defined (already verified).

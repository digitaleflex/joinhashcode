# Squads to Organizations Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate legacy `Guild` and `GuildMember` data to Better Auth `Organization` and `Member` models, and refactor the core logic to use the new system.

**Architecture:** Use a standalone TypeScript script for data migration. Refactor `lib/squad-logic.ts` and `app/actions/quiz.ts` to use Prisma queries on the new models, while maintaining the same business logic (cohesion, streaks, notifications).

**Tech Stack:** Next.js, Prisma, Better Auth, tsx.

---

### Task 1: Migration Script Creation

**Files:**
- Create: `scripts/migrate-guilds-to-orgs.ts`

- [ ] **Step 1: Write the migration script**
  
```typescript
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEFAULT_CREATOR_ID = "pdd5ViZYZqsOLCQul9YWzCavRUCFu3f7"; // E-FLEX

async function main() {
  console.log("🚀 Starting Squads to Organizations migration...");

  const guilds = await prisma.guild.findMany({
    include: { members: true },
  });

  console.log(`Found ${guilds.length} guilds to migrate.`);

  for (const guild of guilds) {
    console.log(`Migrating Guild: ${guild.name} (${guild.slug})...`);

    // Determine owner/creator
    const leader = guild.members.find(m => m.role === "LEADER");
    const creatorId = leader ? leader.userId : DEFAULT_CREATOR_ID;

    await prisma.organization.upsert({
      where: { id: guild.id },
      update: {},
      create: {
        id: guild.id,
        name: guild.name,
        slug: guild.slug,
        createdAt: guild.createdAt,
        cohesionScore: guild.cohesionScore,
        streakCount: guild.streakCount,
        lastStreakAt: guild.lastStreakAt,
        requiredLevel: guild.requiredLevel,
        isPrivate: guild.isPrivate,
      },
    });

    for (const member of guild.members) {
      await prisma.member.upsert({
        where: { id: member.id },
        update: {},
        create: {
          id: member.id,
          organizationId: guild.id,
          userId: member.userId,
          role: member.role === "LEADER" ? "owner" : "member",
          createdAt: member.joinedAt,
        },
      });
    }
  }

  console.log("✅ Migration completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
```

- [ ] **Step 2: Run the migration script**
Run: `npx tsx scripts/migrate-guilds-to-orgs.ts`
Expected: Success message with count of guilds migrated.

### Task 2: Refactor lib/squad-logic.ts

**Files:**
- Modify: `lib/squad-logic.ts`

- [ ] **Step 1: Replace Guild/GuildMember with Organization/Member**

```typescript
// Replace prisma.guild -> prisma.organization
// Replace prisma.guildMember -> prisma.member
// Replace role: "LEADER" -> role: "owner"
```

- [ ] **Step 2: Update notifySquadMembers**

```typescript
async function notifySquadMembers(
  organizationId: string,
  type: string,
  title: string,
  message: string,
  link?: string
) {
  const members = await prisma.member.findMany({
    where: { organizationId },
    select: { userId: true },
  });
  // ... rest of logic
}
```

- [ ] **Step 3: Update updateSquadCohesion and decay logic**
Target `prisma.organization` instead of `prisma.guild`.

### Task 3: Update app/actions/quiz.ts

**Files:**
- Modify: `app/actions/quiz.ts`

- [ ] **Step 1: Update post-quiz enrollment**
Update the transaction to find `Organization` by slug and create `Member`.

### Task 4: Cleanup & Validation

- [ ] **Step 1: Verify all references are updated**
Run: `grep -r "guild" .` (to ensure no missed logic)
- [ ] **Step 2: Run existing tests**
Run: `npm test`
- [ ] **Step 3: Commit changes**
```bash
git add .
git commit -m "chore: migrate squads to better-auth organizations"
```

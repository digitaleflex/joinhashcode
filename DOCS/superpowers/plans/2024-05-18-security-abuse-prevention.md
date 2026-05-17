# Security & Abuse Prevention Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement anti-abuse measures: 20h check-in cooldown, 60s profile update cooldown, and HTML sanitization for user-submitted text.

**Architecture:** 
- Add a shared `stripHtml` utility.
- Use Zod `.transform()` to sanitize inputs during parsing.
- Query the database for recent activity before allowing new actions.

**Tech Stack:** Next.js, Prisma, Zod.

---

### Task 1: Sanitization Utility

**Files:**
- Modify: `lib/utils.ts`

- [ ] **Step 1: Add stripHtml helper**
Add this function to `lib/utils.ts`:
```typescript
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>?/gm, "").trim();
}
```

- [ ] **Step 2: Commit utility**
```bash
git add lib/utils.ts
git commit -m "security: add stripHtml utility"
```

---

### Task 2: Check-in Frequency & Sanitization

**Files:**
- Modify: `app/api/user/checkin/route.ts`

- [ ] **Step 1: Implement cooldown and sanitization**
Modify the POST handler to check for recent check-ins and sanitize the note.

```typescript
import { stripHtml } from "@/lib/utils";

// ... inside POST
const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) {
  return new NextResponse("Unauthorized", { status: 401 });
}

// 1. Check cooldown (20 hours)
const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000);
const existingCheckin = await prisma.dailyCheckin.findFirst({
  where: {
    userId: session.user.id,
    createdAt: { gte: twentyHoursAgo },
  },
});

if (existingCheckin) {
  return new NextResponse("Tu as déjà signé ton check-in aujourd'hui. Garde ton énergie pour demain !", { status: 429 });
}

// 2. Update schema with sanitization
const checkinSchema = z.object({
  note: z.string().min(1).max(1000).transform(stripHtml),
  domain: z.string().min(1).max(100),
  energy: z.number().int().min(1).max(5),
  duration: z.number().int().min(1).max(1440),
});
```

- [ ] **Step 2: Commit check-in changes**
```bash
git add app/api/user/checkin/route.ts
git commit -m "security: implement check-in cooldown and sanitization"
```

---

### Task 3: User Update Rate Limit & Sanitization

**Files:**
- Modify: `app/api/user/update/route.ts`

- [ ] **Step 1: Implement rate limit and sanitization**
Modify the PATCH handler to check `updatedAt` and sanitize `pseudo`/`bio`.

```typescript
import { stripHtml } from "@/lib/utils";

// ... inside PATCH
const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) {
  return new NextResponse("Unauthorized", { status: 401 });
}

// 1. Check rate limit (60 seconds)
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { updatedAt: true }
});

if (user?.updatedAt && (Date.now() - user.updatedAt.getTime() < 60000)) {
  return new NextResponse("Doucement ! Tu as mis à jour ton profil il y a moins d'une minute.", { status: 429 });
}

// 2. Update schema with sanitization
const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  pseudo: z.string()
    .regex(/^[a-zA-Z0-9_]{3,20}$/, "Le pseudo doit contenir entre 3 et 20 caractères (lettres, chiffres et '_' uniquement).")
    .transform(stripHtml)
    .optional(),
  bio: z.string().max(500).transform(stripHtml).optional(),
  // ... rest of fields
});
```

- [ ] **Step 2: Commit update changes**
```bash
git add app/api/user/update/route.ts
git commit -m "security: implement profile update rate limit and sanitization"
```

---

### Task 4: Verification

- [ ] **Step 1: Verify check-in cooldown**
Attempt to check in twice within 20 hours. Verify 429 response.

- [ ] **Step 2: Verify sanitization**
Send check-in note or bio with `<b>test</b>`. Verify it's saved as `test`.

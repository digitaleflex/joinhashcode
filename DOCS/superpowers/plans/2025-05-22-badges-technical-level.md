# Badges & Technical Level Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the 'Badges & Distinctions' section and display the 'Technical Level' in the `/dossier` page.

**Architecture:** Integration into the existing `app/dossier/page.tsx` file using Prisma data and Shadcn UI components. Technical Level will be added to the header, and Badges will have their own tactical section.

**Tech Stack:** Next.js (App Router), Prisma, Tailwind CSS, Shadcn UI (Badge, Card), Lucide React.

---

### Task 1: Display Technical Level in Header

**Files:**
- Modify: `app/dossier/page.tsx`

- [ ] **Step 1: Add Technical Level display in the header section**

Locate the header area (around line 110) and add the `user.technicalLevel` display near the Status badge.

```tsx
// Around line 112
<div className="flex items-center gap-1.5">
    <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
    <span className="text-[9px] font-mono text-emerald-500/60 uppercase tracking-wider">Status: Actif</span>
</div>
{/* ADD THIS */}
{user.technicalLevel && (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
        <span className="text-[9px] font-mono font-black text-primary uppercase tracking-tighter">CLASSE: {user.technicalLevel}</span>
    </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add app/dossier/page.tsx
git commit -m "feat(dossier): add technical level to header"
```

---

### Task 2: Implement Badges & Distinctions Section

**Files:**
- Modify: `app/dossier/page.tsx`

- [ ] **Step 1: Import Medallion icon**

Add `Medal` to the lucide-react imports.

```tsx
import { 
  // ...
  Target, 
  ShieldCheck,
  Zap,
  Medal, // Add this
  ChevronRight,
  // ...
} from "lucide-react";
```

- [ ] **Step 2: Add the Badges section after Neuro-Analysis Results**

Insert the new section after the `Neuro-Analysis Results` card (around line 200).

```tsx
{/* Badges & Distinctions */}
<div className="space-y-6">
    <div className="flex items-center gap-3">
        <Medal className="size-5 text-primary" />
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Distinctions Système</h2>
    </div>
    
    <Card className="glass-card rounded-[2rem] p-8">
        <div className="flex flex-wrap gap-4">
            {user.badges.length > 0 ? (
                user.badges.map((badge: string) => (
                    <Badge key={badge} className="bg-primary/20 text-primary border-primary/30 text-[11px] font-black uppercase py-2 px-4 rounded-xl shadow-[0_0_15px_rgba(197,244,65,0.1)]">
                        {badge}
                    </Badge>
                ))
            ) : (
                <div className="w-full py-6 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">[ AUCUN_INSIGNE_DÉTECTÉ ]</span>
                    <p className="text-[9px] text-zinc-700 font-mono mt-2 italic">-- En attente de faits d'armes remarquables --</p>
                </div>
            )}
        </div>
    </Card>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add app/dossier/page.tsx
git commit -m "feat(dossier): add badges and distinctions section"
```

---

### Task 3: Verification & Final Polish

- [ ] **Step 1: Verify layout responsiveness**
- [ ] **Step 2: Check for any linting errors**

Run: `npm run lint` or `next lint`
Expected: No errors related to `app/dossier/page.tsx`.

- [ ] **Step 3: Final Commit**

```bash
git commit --allow-empty -m "chore(dossier): final layout verification"
```

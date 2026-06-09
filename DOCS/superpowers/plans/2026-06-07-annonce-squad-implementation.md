# Alerte Tactique (Annonce Squad) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implémenter un encadré haute visibilité pour les annonces épinglées sur la page de la squad.

**Architecture:** Modifier le composant `SquadJourney` pour remplacer la bannière actuelle par une version "Alerte Tactique".

**Tech Stack:** Next.js, Tailwind CSS, Lucide React.

---

### Task 1: Création du test d'affichage

**Files:**
- Modify: `__tests__/smoke.test.tsx` (Ajouter un test pour vérifier la présence du bloc annonce)

- [ ] **Step 1: Ajouter un test smoke pour l'annonce**

```tsx
// Ajout dans __tests__/smoke.test.tsx
test("affiche l'annonce si elle existe", () => {
  const squadWithAnnouncement = { ...mockSquad, announcement: "Test annonce" };
  render(<SquadJourney user={mockUser} squad={squadWithAnnouncement} />);
  expect(screen.getByText("ANNONCE ÉPINGLÉE")).toBeDefined();
  expect(screen.getByText("Test annonce")).toBeDefined();
});
```

- [ ] **Step 2: Lancer les tests**

Run: `pnpm test __tests__/smoke.test.tsx`
Expected: FAIL (car le texte "ANNONCE ÉPINGLÉE" n'existe pas encore)

- [ ] **Step 3: Commit**

```bash
git add __tests__/smoke.test.tsx
git commit -m "test: ajouter test pour annonce squad"
```

### Task 2: Implémentation du composant Alerte Tactique

**Files:**
- Modify: `components/dashboard/squad-journey.tsx`

- [ ] **Step 1: Modifier la bannière dans SquadJourney**

```tsx
{/* ── Replacement for old announcement banner ──────────────── */}
{squad?.announcement && (
  <div className="relative p-6 rounded-2xl border-2 border-primary bg-primary/5 animate-pulse-slow my-6">
    <div className="flex items-center gap-3 mb-3">
        <Megaphone className="size-5 text-primary drop-shadow-[0_0_8px_rgba(197,244,65,0.8)]" />
        <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase">
            Annonce Épinglée
        </span>
    </div>
    <p className="text-base text-white leading-relaxed font-sans">
        {squad.announcement}
    </p>
  </div>
)}
```

- [ ] **Step 2: Lancer les tests**

Run: `pnpm test __tests__/smoke.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/squad-journey.tsx __tests__/smoke.test.tsx
git commit -m "feat: implémenter alerte tactique pour annonce squad"
```

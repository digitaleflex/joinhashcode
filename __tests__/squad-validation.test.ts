import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateSquadCognitiveBalance } from "../lib/squad-validation";
import { prisma } from "../lib/prisma";

// Mock dependencies
vi.mock("../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    member: {
      findMany: vi.fn(),
    },
  },
}));

describe("validateSquadCognitiveBalance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should allow candidates without a class (Initiates)", async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      class: null,
      name: "Jean Dupont",
    });

    const result = await validateSquadCognitiveBalance("squad-1", "user-1");
    expect(result.allowed).toBe(true);
  });

  it("should allow candidate if their class is represented less than 2 times in the squad", async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      class: "Builder",
      name: "Jean Dupont",
    });

    // La squad a 1 Builder et 1 Créateur
    (prisma.member.findMany as any).mockResolvedValue([
      { user: { class: "Builder" } },
      { user: { class: "Creator" } },
    ]);

    const result = await validateSquadCognitiveBalance("squad-1", "user-1");
    expect(result.allowed).toBe(true);
  });

  it("should block candidate if their class is represented 2 or more times", async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      class: "Builder",
      name: "Jean Dupont",
    });

    // La squad a déjà 2 Builders
    (prisma.member.findMany as any).mockResolvedValue([
      { user: { class: "Builder" } },
      { user: { class: "Builder" } },
      { user: { class: "Creator" } },
    ]);

    const result = await validateSquadCognitiveBalance("squad-1", "user-1");
    expect(result.allowed).toBe(false);
    expect(result.message).toContain("Déséquilibre cognitif détecté");
    expect(result.message).toContain("déjà 2 représentants du profil Builder");
    expect(result.message).toContain("l'escouade recherche plutôt des profils");
  });
});

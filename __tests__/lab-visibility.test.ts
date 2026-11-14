import { describe, it, expect } from "vitest";
import { canViewMission, isUnpublishedCyberLab } from "@/lib/lab-visibility";

const draftCyber = { status: "DRAFT", tags: ["CYBER", "LAB"] };

describe("lab-visibility", () => {
  it("cache un lab cyber non publié à un membre", () => {
    expect(isUnpublishedCyberLab(draftCyber)).toBe(true);
    expect(canViewMission(draftCyber, "USER")).toBe(false);
    expect(canViewMission(draftCyber, undefined)).toBe(false);
  });

  it("laisse l'équipe relire un brouillon", () => {
    expect(canViewMission(draftCyber, "ADMIN")).toBe(true);
    expect(canViewMission(draftCyber, "MODERATOR")).toBe(true);
  });

  it("montre un lab cyber publié", () => {
    expect(canViewMission({ status: "PUBLISHED", tags: ["CYBER"] }, "USER")).toBe(true);
  });

  it("ne touche pas aux missions historiques, même en DRAFT en base", () => {
    expect(canViewMission({ status: "DRAFT", tags: [] }, "USER")).toBe(true);
    expect(canViewMission({ status: "DRAFT", tags: ["HEF", "LAB"] }, "USER")).toBe(true);
  });
});

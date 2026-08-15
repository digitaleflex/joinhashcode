import { describe, it, expect } from "vitest";
import {
  getStepMissionDef,
  isStepMission,
  computeStepCompleteness,
  isStepComplete,
  computeGlobalScore,
  computeScorePercent,
  createDefaultAttemptData,
} from "../lib/mission-engine";
import { ONBOARDING_MISSION } from "../lib/onboarding-mission";

describe("mission-engine : résolveur de définition", () => {
  it("résout la Mission 01 par slug", () => {
    expect(getStepMissionDef("mission-01-decouverte")).not.toBeNull();
    expect(getStepMissionDef("mission-01-decouverte")?.steps.length).toBe(10);
  });

  it("retourne null pour une mission inconnue", () => {
    expect(getStepMissionDef("mission-inconnue")).toBeNull();
    expect(getStepMissionDef(null)).toBeNull();
  });

  it("isStepMission détecte le workflow", () => {
    expect(isStepMission("mission-01-decouverte")).toBe(true);
    expect(isStepMission("autre-mission")).toBe(false);
  });
});

describe("mission-engine : complétude des étapes", () => {
  const step = ONBOARDING_MISSION.steps[0]; // Présentation (3 champs requis)
  it("0 quand vide", () => {
    expect(computeStepCompleteness(step, {})).toBe(0);
    expect(isStepComplete(step, {})).toBe(false);
  });

  it("complète quand tous les champs requis sont remplis", () => {
    const data = { firstName: "A", pseudo: "B", presentation: "x".repeat(50) };
    expect(computeStepCompleteness(step, data)).toBe(1);
    expect(isStepComplete(step, data)).toBe(true);
  });

  it("partielle quand certains champs manquent", () => {
    const data = { firstName: "A" };
    expect(computeStepCompleteness(step, data)).toBeCloseTo(1 / 3);
  });

  it("multi-select : rempli si tableau non vide", () => {
    const step2 = ONBOARDING_MISSION.steps[1];
    expect(computeStepCompleteness(step2, { domains: [], pourquoi: "x" })).toBeCloseTo(0.5);
    expect(computeStepCompleteness(step2, { domains: ["web"], pourquoi: "x" })).toBe(1);
  });
});

describe("mission-engine : scoring global", () => {
  it("calcule le score /25", () => {
    const grid = ONBOARDING_MISSION.scoringGrid;
    const scores = { completude: 5, clarte: 4, reflexion: 3, coherence_objectif: 5, qualite_presentation: 4 };
    expect(computeGlobalScore(grid, scores)).toBe(21);
    expect(computeScorePercent(21, 25)).toBe(84);
  });

  it("clamp les scores hors bornes", () => {
    const grid = ONBOARDING_MISSION.scoringGrid;
    expect(computeGlobalScore(grid, { completude: 99, clarte: -3 })).toBe(5);
  });

  it("createDefaultAttemptData initialise les valeurs", () => {
    const data = createDefaultAttemptData(ONBOARDING_MISSION);
    expect(data.firstName).toBe("");
    expect(Array.isArray(data.domains)).toBe(true);
    expect(Array.isArray(data.skills)).toBe(true);
  });
});

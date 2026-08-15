import { describe, it, expect } from "vitest";
import {
  getStepMissionDef,
  isStepMission,
  computeStepCompleteness,
  isStepComplete,
  computeGlobalScore,
  computeScorePercent,
  computeCriteriaScore,
  createDefaultAttemptData,
} from "../lib/mission-engine";
import { ONBOARDING_MISSION } from "../lib/onboarding-mission";
import { PROJECT_MISSION } from "../lib/project-mission";

describe("mission-engine : résolveur de définition", () => {
  it("résout la Mission 01 par slug", () => {
    expect(getStepMissionDef("mission-01-decouverte")).not.toBeNull();
    expect(getStepMissionDef("mission-01-decouverte")?.steps.length).toBe(10);
  });

  it("résout la Mission 02 par slug", () => {
    expect(getStepMissionDef("mission-02-de-l-idee-au-projet")).not.toBeNull();
    expect(getStepMissionDef("mission-02-de-l-idee-au-projet")?.steps.length).toBe(10);
    expect(PROJECT_MISSION.scoringGrid.reduce((s, c) => s + c.max, 0)).toBe(50);
  });

  it("retourne null pour une mission inconnue", () => {
    expect(getStepMissionDef("mission-inconnue")).toBeNull();
    expect(getStepMissionDef(null)).toBeNull();
  });

  it("isStepMission détecte le workflow", () => {
    expect(isStepMission("mission-01-decouverte")).toBe(true);
    expect(isStepMission("mission-02-de-l-idee-au-projet")).toBe(true);
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

  it("calcule le score /50 de la Mission 02", () => {
    const grid = PROJECT_MISSION.scoringGrid;
    const scores = {
      probleme: 4, analyse: 4, preuves: 3, marche: 4, valeur: 4,
      objectifs: 5, priorisation: 4, roadmap: 4, risques: 3, clarte: 5,
    };
    expect(computeGlobalScore(grid, scores)).toBe(40);
    expect(grid.length).toBe(10);
  });

  it("createDefaultAttemptData initialise les valeurs", () => {
    const data = createDefaultAttemptData(ONBOARDING_MISSION);
    expect(data.firstName).toBe("");
    expect(Array.isArray(data.domains)).toBe(true);
    expect(Array.isArray(data.skills)).toBe(true);
  });

  it("createDefaultAttemptData initialise les champs complexes Mission 02", () => {
    const data = createDefaultAttemptData(PROJECT_MISSION);
    expect((data.criteria as Record<string, { score: number; justification: string }>)["douleur"].score).toBe(0);
    expect(Array.isArray(data.solutions)).toBe(true);
    expect((data.quadrants as Record<string, string[]>)["important-urgent"]).toEqual([]);
    expect((data.months as unknown[]).length).toBe(6);
    expect(Array.isArray(data.risks)).toBe(true);
    expect((data.goals as unknown[]).length).toBe(3);
  });

  it("computeCriteriaScore additionne les notes /50", () => {
    const field = PROJECT_MISSION.steps[3].fields.find((f) => f.type === "SCORED_CRITERIA")!;
    const value = {
      douleur: { score: 8, justification: "x" },
      urgence: { score: 7, justification: "x" },
      etendue: { score: 6, justification: "x" },
      frequence: { score: 9, justification: "x" },
      valeur: { score: 7, justification: "x" },
    };
    const { total, max } = computeCriteriaScore(field, value);
    expect(total).toBe(37);
    expect(max).toBe(50);
  });
});

describe("mission-engine : complétude des champs complexes Mission 02", () => {
  const def = PROJECT_MISSION;
  const completeCriteria = Object.fromEntries(
    ["douleur", "urgence", "etendue", "frequence", "valeur"].map((k) => [k, { score: 7, justification: "justif", preuves: "source", confiance: "Moyen" }])
  );

  it("validation du problème : complète si tous les critères notés et justifiés", () => {
    const step = def.steps[3];
    expect(computeStepCompleteness(step, { criteria: {} })).toBe(0);
    expect(computeStepCompleteness(step, { criteria: completeCriteria })).toBe(1);
    expect(isStepComplete(step, { criteria: completeCriteria })).toBe(true);
  });

  it("validation du problème : incomplète si un critère manque", () => {
    const step = def.steps[3];
    const partial = { ...completeCriteria };
    delete partial["douleur"];
    expect(computeStepCompleteness(step, { criteria: partial })).toBe(0);
  });

  it("marché : au moins 3 solutions nommées", () => {
    const step = def.steps[4];
    expect(computeStepCompleteness(step, {})).toBe(0);
    const two = Array.from({ length: 2 }, () => ({ nom: "x", type: "Alternative", public: "", forces: "", faiblesses: "" }));
    const three = [...two, { nom: "y", type: "Concurrent direct", public: "", forces: "", faiblesses: "" }];
    const insuffisance = "car les solutions actuelles manquent de X";
    const difference = "parce que mon projet apporte Y";
    // 2 solutions < 3 → champ solutions non rempli → incomplet
    expect(isStepComplete(step, { solutions: two, insuffisance, difference })).toBe(false);
    expect(isStepComplete(step, { solutions: three, insuffisance, difference })).toBe(true);
  });

  it("Eisenhower : complète avec au moins une action", () => {
    const step = def.steps[6];
    const quadrants = { "important-urgent": ["Valider le besoin"], "important-non-urgent": [], "non-important-urgent": [], "non-important-non-urgent": [] };
    expect(computeStepCompleteness(step, { quadrants, actionPrincipale: "Valider le besoin car..." })).toBe(1);
  });

  it("roadmap : 6 mois avec objectif rempli", () => {
    const step = def.steps[7];
    const months = Array.from({ length: 6 }, (_, i) => ({ mois: `Mois ${i + 1}`, objectif: `objectif ${i}`, resultat: "" }));
    const partial = months.map((m, i) => (i === 5 ? { ...m, objectif: "" } : m));
    expect(computeStepCompleteness(step, { months: partial })).toBe(0);
    expect(computeStepCompleteness(step, { months })).toBe(1);
  });

  it("risques : au moins 5 risques", () => {
    const step = def.steps[8];
    const risks = Array.from({ length: 5 }, () => ({ nom: "risque", probabilite: 3, impact: 4, attenuation: "mitigation" }));
    expect(computeStepCompleteness(step, { risks: risks.slice(0, 4) })).toBe(0);
    expect(computeStepCompleteness(step, { risks })).toBe(1);
  });

  it("objectifs SMART : 3 objectifs avec objectif+indicateur+date", () => {
    const step = def.steps[5];
    const goal = (type: string) => ({ type, objectif: "obj", indicateur: "ind", date: "2026-12-31" });
    const goals = [goal("Projet"), goal("Personnel"), goal("Apprentissage")];
    expect(computeStepCompleteness(step, { goals: goals.slice(0, 2) })).toBe(0);
    expect(computeStepCompleteness(step, { goals })).toBe(1);
  });

  it("auto-évaluation : complète quand tous les champs de synthèse sont remplis", () => {
    const step = def.steps[9];
    expect(computeStepCompleteness(step, {})).toBe(0);
    const vision = "x".repeat(40), preuves = "x".repeat(30), test = "x".repeat(40), synthese = "x".repeat(40);
    const base = { vision, preuves, test_realite: test, synthese };
    // autoEval seul → 1/5
    expect(computeStepCompleteness(step, { ...base, autoEval: {} })).toBeCloseTo(4 / 5);
    expect(computeStepCompleteness(step, { ...base, autoEval: { probleme: 4 } })).toBe(1);
    expect(isStepComplete(step, { ...base, autoEval: { probleme: 4 } })).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import { buildStepPrefill } from "@/lib/mission-prefill";

describe("buildStepPrefill", () => {
  it("prefills identity from auth data", () => {
    const prefill = buildStepPrefill({ name: "Awa Diop", pseudo: "awa" });
    expect(prefill.presentation).toEqual({ firstName: "Awa Diop", pseudo: "awa" });
  });

  it("maps stored domain labels to MULTI_SELECT values", () => {
    const prefill = buildStepPrefill({
      domains: ["Web", "DevOps", "Cybersecurity", "Inconnu"],
    });
    expect(prefill.interets).toEqual({ domains: ["web", "cloud", "cyber"] });
  });

  it("is accent and case insensitive on domains", () => {
    const prefill = buildStepPrefill({ domains: ["Réseaux", "Intelligence Artificielle"] });
    expect(prefill.interets).toEqual({ domains: ["reseaux", "ai"] });
  });

  it("converts tools into skills rows with default level", () => {
    const prefill = buildStepPrefill({ tools: ["React", "PostgreSQL", "  "] });
    expect(prefill.competences).toEqual({
      skills: [
        { name: "React", level: "Découverte" },
        { name: "PostgreSQL", level: "Découverte" },
      ],
    });
  });

  it("seeds ambition with the dream statement verbatim", () => {
    const prefill = buildStepPrefill({ dreamStatement: "Devenir pentester reconnu" });
    expect(prefill.ambition).toEqual({ vision: "Devenir pentester reconnu" });
  });

  it("maps quiz class to contribution modes", () => {
    expect(buildStepPrefill({ class: "Bâtisseur" }).contribution).toEqual({ modes: ["construire"] });
    expect(buildStepPrefill({ class: "Stratège" }).contribution).toEqual({ modes: ["analyser", "organiser"] });
    expect(buildStepPrefill({ class: "Catalyseur" }).contribution).toEqual({ modes: ["former", "communiquer"] });
  });

  it("seeds objective from mainObjective", () => {
    const prefill = buildStepPrefill({ mainObjective: "Maîtriser Kubernetes" });
    expect(prefill.objectif).toEqual({ objectif: "Maîtriser Kubernetes" });
  });

  it("omits steps with no meaningful data", () => {
    const prefill = buildStepPrefill({});
    expect(prefill.presentation).toBeDefined();
    expect(prefill.interets).toBeUndefined();
    expect(prefill.competences).toBeUndefined();
    expect(prefill.ambition).toBeUndefined();
    expect(prefill.contribution).toBeUndefined();
    expect(prefill.objectif).toBeUndefined();
  });
});

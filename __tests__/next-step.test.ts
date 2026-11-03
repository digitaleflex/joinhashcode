import { describe, it, expect } from "vitest";
import { getMemberNextStep } from "@/lib/next-step";

describe("getMemberNextStep", () => {
  it("priorise les corrections quand un Lab est à réviser", () => {
    const step = getMemberNextStep(
      [{ status: "APPROVED" }, { status: "NEEDS_REVISION" }],
      1,
    );
    expect(step.tone).toBe("warning");
    expect(step.cta).toBe("Corriger mon Lab");
    expect(step.href).toBe("/missions");
  });

  it("propose une première preuve quand aucun Lab n'est validé", () => {
    const step = getMemberNextStep([], 0);
    expect(step.tone).toBe("primary");
    expect(step.cta).toBe("Choisir un Lab");
  });

  it("indique la relecture quand une soumission est en attente", () => {
    const step = getMemberNextStep([{ status: "IN_REVIEW" }], 1);
    expect(step.tone).toBe("info");
    expect(step.cta).toBe("Voir mes Labs");
  });

  it("renvoie vers le portfolio quand une preuve est validée", () => {
    const step = getMemberNextStep([{ status: "APPROVED" }], 1);
    expect(step.tone).toBe("success");
    expect(step.href).toBe("/dossier");
    expect(step.cta).toBe("Voir mon portfolio");
  });
});

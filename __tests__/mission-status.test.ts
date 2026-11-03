import { describe, it, expect } from "vitest";
import { getMissionStatusMeta } from "@/lib/mission-status";

describe("getMissionStatusMeta", () => {
  it.each([
    ["APPROVED", "Validé", "completed"],
    ["NEEDS_REVISION", "À corriger", "action_required"],
    ["IN_REVIEW", "En relecture", "in_progress"],
    ["PENDING", "En attente", "in_progress"],
    ["REJECTED", "Refusé", "rejected"],
  ])("mappe %s vers un libellé clair", (raw, label, key) => {
    const meta = getMissionStatusMeta(raw);
    expect(meta.label).toBe(label);
    expect(meta.key).toBe(key);
    expect(meta.className).toContain("border");
  });

  it("retombe sur « À commencer » sans statut", () => {
    expect(getMissionStatusMeta(undefined).label).toBe("À commencer");
    expect(getMissionStatusMeta(null).label).toBe("À commencer");
    expect(getMissionStatusMeta("UNKNOWN").label).toBe("À commencer");
  });
});

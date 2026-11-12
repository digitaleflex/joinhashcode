import { describe, it, expect } from "vitest";
import { getFirstAction, normalizeDomain } from "@/lib/first-action";

describe("normalizeDomain", () => {
  it("reconnaît les variantes web", () => {
    expect(normalizeDomain("web")).toBe("web");
    expect(normalizeDomain("web-development")).toBe("web");
    expect(normalizeDomain("WEB")).toBe("web");
  });

  it("reconnaît les variantes cyber", () => {
    expect(normalizeDomain("cybersecurity")).toBe("cybersecurity");
    expect(normalizeDomain("cyber")).toBe("cybersecurity");
    expect(normalizeDomain("cybersécurité")).toBe("cybersecurity");
  });

  it("reconnaît les variantes IA", () => {
    expect(normalizeDomain("ai")).toBe("ai");
    expect(normalizeDomain("applied-ai")).toBe("ai");
    expect(normalizeDomain("ia")).toBe("ai");
  });

  it("retombe sur unknown", () => {
    expect(normalizeDomain(null)).toBe("unknown");
    expect(normalizeDomain(undefined)).toBe("unknown");
    expect(normalizeDomain("marketing")).toBe("unknown");
  });
});

describe("getFirstAction", () => {
  it.each(["web", "cybersecurity", "ai"] as const)(
    "propose une action réelle pour %s",
    (domain) => {
      const action = getFirstAction(domain);
      expect(action.status).toBe("ready");
      expect(action.domain).toBe(domain);
      // La première action mène au catalogue de Labs (D-030) : pas de contenu intermédiaire.
      expect(action.href).toBe("/missions");
      expect(action.source).toBe("lab");
    },
  );

  it("propose une orientation honnête quand le domaine est inconnu", () => {
    const action = getFirstAction(null);
    expect(action.status).toBe("coming_soon");
    expect(action.href).toBe("/programs");
    expect(action.source).toBe("community");
  });
});

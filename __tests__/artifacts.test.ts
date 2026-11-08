import { describe, it, expect } from "vitest";
import {
  parseSubmissionSchema,
  validateArtifactsAgainstSchema,
  ArtifactValidationError,
} from "../lib/validation/artifacts";

const SCHEMA = parseSubmissionSchema([
  { key: "code", label: "Dépôt de code", type: "REPO", required: true, accepts: ["github", "zip"] },
  { key: "report", label: "Rapport", type: "DOC", required: true, minItems: 2 },
  { key: "reflection", label: "Réflexion", type: "TEXT", required: true, minLength: 80 },
  { key: "bonus", label: "Bonus", type: "LINK", required: false },
]);

describe("parseSubmissionSchema", () => {
  it("ignore les entrées non conformes", () => {
    expect(parseSubmissionSchema(null)).toEqual([]);
    expect(parseSubmissionSchema("x")).toEqual([]);
    expect(parseSubmissionSchema([{ key: "", label: "" }])).toEqual([]);
  });

  it("normalise les artefacts valides", () => {
    expect(SCHEMA).toHaveLength(4);
    expect(SCHEMA[0]).toMatchObject({ key: "code", type: "REPO", required: true });
  });
});

describe("validateArtifactsAgainstSchema", () => {
  const valid = [
    { key: "code", type: "REPO", value: "https://github.com/org/repo" },
    { key: "report", type: "DOC", value: "partie 1\npartie 2" },
    { key: "reflection", type: "TEXT", value: "a".repeat(80) },
  ];

  it("accepte une soumission complète valide", () => {
    expect(() => validateArtifactsAgainstSchema(SCHEMA, valid)).not.toThrow();
  });

  it("rejette les artefacts manquants requis", () => {
    try {
      validateArtifactsAgainstSchema(SCHEMA, [valid[0]]);
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(ArtifactValidationError);
      const details = (e as ArtifactValidationError).details;
      expect(details.some((d) => d.includes("Rapport"))).toBe(true);
      expect(details.some((d) => d.includes("Réflexion"))).toBe(true);
    }
  });

  it("rejette les clés inconnues", () => {
    try {
      validateArtifactsAgainstSchema(SCHEMA, [
        ...valid,
        { key: "nope", type: "DOC", value: "x" },
      ]);
      expect.unreachable();
    } catch (e) {
      expect((e as ArtifactValidationError).details.some((d) => d.includes("nope"))).toBe(true);
    }
  });

  it("rejette les URL de dépôt non http(s)", () => {
    try {
      validateArtifactsAgainstSchema(SCHEMA, [
        { ...valid[0], value: "javascript:alert(1)" },
        valid[1],
        valid[2],
      ]);
      expect.unreachable();
    } catch (e) {
      expect((e as ArtifactValidationError).details.some((d) => d.includes("Dépôt de code"))).toBe(true);
    }
  });

  it("rejette les fileUrl forgées hors /uploads et http(s)", () => {
    try {
      validateArtifactsAgainstSchema(SCHEMA, [
        valid[0],
        { ...valid[1], value: "", fileUrl: "https://evil.example/x" },
        valid[2],
      ]);
      // https externe reste accepté comme lien, mais pas comme fichier :
      // ici le rapport est DOC avec fileUrl https -> accepté
      expect(true).toBe(true);
    } catch {
      expect.unreachable("une fileUrl https ne doit pas être rejetée");
    }

    try {
      validateArtifactsAgainstSchema(SCHEMA, [
        valid[0],
        { ...valid[1], value: "", fileUrl: "javascript:alert(1)" },
        valid[2],
      ]);
      expect.unreachable();
    } catch (e) {
      expect((e as ArtifactValidationError).details.some((d) => d.includes("Rapport"))).toBe(true);
    }

    try {
      validateArtifactsAgainstSchema(SCHEMA, [
        valid[0],
        { ...valid[1], value: "", fileUrl: "/uploads/missions/m1/code/123.zip" },
        valid[2],
      ]);
      expect(true).toBe(true);
    } catch {
      expect.unreachable("une fileUrl /uploads ne doit pas être rejetée");
    }
  });

  it("applique minItems et minLength", () => {
    try {
      validateArtifactsAgainstSchema(SCHEMA, [
        valid[0],
        { ...valid[1], value: "une seule ligne" },
        valid[2],
      ]);
      expect.unreachable();
    } catch (e) {
      expect((e as ArtifactValidationError).details.some((d) => d.includes("au moins 2"))).toBe(true);
    }

    try {
      validateArtifactsAgainstSchema(SCHEMA, [
        valid[0],
        valid[1],
        { ...valid[2], value: "trop court" },
      ]);
      expect.unreachable();
    } catch (e) {
      expect((e as ArtifactValidationError).details.some((d) => d.includes("80"))).toBe(true);
    }
  });

  it("force le type depuis le contrat, pas depuis le client", () => {
    const out = validateArtifactsAgainstSchema(SCHEMA, [
      { ...valid[0], type: "TEXT" },
      valid[1],
      valid[2],
    ]);
    expect(out[0].type).toBe("REPO");
    expect(out[0].metadata).toMatchObject({ label: "Dépôt de code" });
  });
});

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "content/hef/v1/modules");
const modules = readdirSync(dir)
  .filter((file) => file.endsWith(".json"))
  .sort()
  .map((file) => JSON.parse(readFileSync(path.join(dir, file), "utf8")).module);

const hef000 = modules.find((m) => m.code === "HEF-000");

describe("artefacts HEF", () => {
  it("contient les 17 modules", () => {
    expect(modules.map((m) => m.code)).toEqual([
      "HEF-000",
      "HEF-010",
      "HEF-020",
      "HEF-030",
      "HEF-040",
      "HEF-050",
      "HEF-060",
      "HEF-070",
      "HEF-080",
      "HEF-090",
      "HEF-100",
      "HEF-110",
      "HEF-120",
      "HEF-130",
      "HEF-140",
      "HEF-150",
      "HEF-160",
    ]);
  });

  it("couvre les 169 missions du curriculum", () => {
    const total = modules.reduce((sum, m) => sum + m.missions.length, 0);
    expect(total).toBe(169);
  });

  it("mappe chaque module sur un pilier unique", () => {
    const pillars = modules.map((m) => m.pillarSlug);
    expect(new Set(pillars).size).toBe(modules.length);
    for (const pillar of pillars) {
      expect(pillar).toBeTruthy();
    }
  });

  it("fournit un lab et un projet structurés pour chaque module", () => {
    for (const mod of modules) {
      expect(mod.labs.length).toBeGreaterThan(0);
      expect(mod.labs[0].deliverables.length).toBeGreaterThan(0);
      expect(mod.project).toBeTruthy();
      expect(mod.project.deliverables.length).toBeGreaterThan(0);
      const weight = mod.project.criteria.reduce(
        (sum: number, criterion: { weight: number }) => sum + criterion.weight,
        0,
      );
      expect(weight).toBe(100);
    }
  });

  it("conserve les 4 phases du programme", () => {
    const phases = [...new Set(modules.map((m) => m.phase))].sort();
    expect(phases).toEqual([1, 2, 3, 4]);
  });
});

describe("artefact HEF-000", () => {
  it("décrit le module et son pilier", () => {
    expect(hef000.code).toBe("HEF-000");
    expect(hef000.slug).toBe("hef-000-mentalite-d-ingenieur");
    expect(hef000.pillarSlug).toBe("mentalite-ingenieur");
    expect(hef000.level).toBe("BEGINNER");
    expect(hef000.phase).toBe(1);
  });

  it("contient les 9 missions avec un corps Markdown", () => {
    expect(hef000.missions).toHaveLength(9);
    for (const mission of hef000.missions) {
      expect(mission.slug).toBeTruthy();
      expect(mission.title).toBeTruthy();
      expect(mission.body.length).toBeGreaterThan(200);
      expect(mission.body).toContain("/hef/parcours/");
    }
  });

  it("n'a pas de slug de mission dupliqué", () => {
    const slugs = hef000.missions.map((m: { slug: string }) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("inclut atelier, évaluation, projet et ressources", () => {
    expect(hef000.labs.length).toBeGreaterThan(0);
    expect(hef000.assessment?.body).toBeTruthy();
    expect(hef000.project?.body).toBeTruthy();
    expect(hef000.resources.length).toBeGreaterThan(0);
  });
});

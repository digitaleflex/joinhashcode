import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const payload = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "content/hef/v1/modules/HEF-000.json"),
    "utf8",
  ),
);

describe("artefact HEF-000", () => {
  it("décrit le module et son pilier", () => {
    expect(payload.module.code).toBe("HEF-000");
    expect(payload.module.slug).toBe("hef-000-mentalite-d-ingenieur");
    expect(payload.module.pillarSlug).toBe("mentalite-ingenieur");
    expect(payload.module.level).toBe("BEGINNER");
    expect(payload.module.phase).toBe(1);
  });

  it("contient les 9 missions avec un corps Markdown", () => {
    expect(payload.module.missions).toHaveLength(9);
    for (const mission of payload.module.missions) {
      expect(mission.slug).toBeTruthy();
      expect(mission.title).toBeTruthy();
      expect(mission.body.length).toBeGreaterThan(200);
    }
  });

  it("n'a pas de slug de mission dupliqué", () => {
    const slugs = payload.module.missions.map((m: { slug: string }) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("inclut atelier, évaluation, projet et ressources", () => {
    expect(payload.module.labs.length).toBeGreaterThan(0);
    expect(payload.module.assessment?.body).toBeTruthy();
    expect(payload.module.project?.body).toBeTruthy();
    expect(payload.module.resources.length).toBeGreaterThan(0);
  });
});

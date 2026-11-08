import { describe, it, expect } from "vitest";
import {
  groupMissionsByCourse,
  groupMissionsByLevel,
  sortMissionsForCompactView,
} from "../lib/site-data";

function mission(slug: string, course: { slug: string; title: string } | null) {
  return { id: slug, slug, title: slug, course };
}

function leveled(slug: string, missionLevel: string | null, courseSlug = "hef-000-x") {
  return { id: slug, slug, title: slug, missionLevel, course: { slug: courseSlug, title: courseSlug } };
}

describe("groupMissionsByCourse", () => {
  it("groupe les missions par cours sans liste à plat", () => {
    const groups = groupMissionsByCourse([
      mission("lab-a", { slug: "hef-010-x", title: "B" }),
      mission("lab-b", { slug: "hef-000-x", title: "A" }),
      mission("lab-c", { slug: "hef-010-x", title: "B" }),
    ]);

    expect(groups).toHaveLength(2);
    // Ordre par slug de cours croissant
    expect(groups[0].course?.slug).toBe("hef-000-x");
    expect(groups[0].missions.map((m) => m.slug)).toEqual(["lab-b"]);
    expect(groups[1].course?.slug).toBe("hef-010-x");
    expect(groups[1].missions.map((m) => m.slug)).toEqual(["lab-a", "lab-c"]);
  });

  it("relègue les missions sans cours en groupe orphelin final", () => {
    const groups = groupMissionsByCourse([
      mission("orpheline", null),
      mission("lab-a", { slug: "hef-000-x", title: "A" }),
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0].course?.slug).toBe("hef-000-x");
    expect(groups[1].course).toBeNull();
    expect(groups[1].missions.map((m) => m.slug)).toEqual(["orpheline"]);
  });

  it("retourne une liste vide sans mission", () => {
    expect(groupMissionsByCourse([])).toEqual([]);
  });
});

describe("groupMissionsByLevel", () => {
  it("ordonne INIT puis CORE puis PRO, sans niveau en fin", () => {
    const groups = groupMissionsByLevel([
      leveled("pro", "PRO"),
      leveled("sans", null),
      leveled("init", "INIT"),
      leveled("core", "CORE"),
    ]);

    expect(groups.map((g) => g.level)).toEqual(["INIT", "CORE", "PRO", null]);
    expect(groups[0].label).toBe("Initiation");
    expect(groups[3].label).toBe("Sans niveau");
  });

  it("omet les niveaux vides", () => {
    const groups = groupMissionsByLevel([leveled("a", "CORE"), leveled("b", "CORE")]);
    expect(groups).toHaveLength(1);
    expect(groups[0].missions.map((m) => m.slug)).toEqual(["a", "b"]);
  });
});

describe("sortMissionsForCompactView", () => {
  it("trie par cours puis par titre, orphelins en fin", () => {
    const sorted = sortMissionsForCompactView([
      { ...mission("b2", { slug: "hef-010-x", title: "B" }), title: "b2" },
      { ...mission("orphe", null), title: "orphe" },
      { ...mission("a1", { slug: "hef-000-x", title: "A" }), title: "a1" },
    ]);
    expect(sorted.map((m) => m.slug)).toEqual(["a1", "b2", "orphe"]);
  });
});

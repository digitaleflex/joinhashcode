import { describe, it, expect } from "vitest";
import { groupMissionsByCourse } from "../lib/site-data";

function mission(slug: string, course: { slug: string; title: string } | null) {
  return { id: slug, slug, title: slug, course };
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

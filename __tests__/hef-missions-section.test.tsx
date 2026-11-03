import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HefMissionsSection } from "@/components/missions/hef-missions-section";

const missions = [
  {
    slug: "hef-000-lab-01",
    title: "Labo — Investiguer une requête lente",
    shortDesc: "Reproduire, mesurer et documenter.",
    category: "CODE",
    xp: 100,
    missionLevel: "INIT",
    tags: ["HEF", "HEF-000", "LAB"],
  },
  {
    slug: "hef-000-project",
    title: "Projet — Dossier d'investigation",
    shortDesc: "Un incident documenté de bout en bout.",
    category: "GENERAL",
    xp: 300,
    missionLevel: "INIT",
    tags: ["HEF", "HEF-000", "PROJECT"],
  },
];

describe("HefMissionsSection", () => {
  it("affiche les labs et projets avec leur statut", () => {
    render(
      <HefMissionsSection
        missions={missions}
        submissions={{ "hef-000-lab-01": "APPROVED" }}
      />,
    );

    expect(screen.getByText("Labs & projets à soumettre")).toBeInTheDocument();
    expect(screen.getByText("Labo — Investiguer une requête lente")).toBeInTheDocument();
    expect(screen.getByText("Projet — Dossier d'investigation")).toBeInTheDocument();
    expect(screen.getByText("Validé")).toBeInTheDocument();
    expect(screen.getAllByText("À commencer").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Labo — Investiguer/ })).toHaveAttribute(
      "href",
      "/missions/hef-000-lab-01",
    );
  });

  it("ne rend rien sans mission HEF", () => {
    const { container } = render(
      <HefMissionsSection missions={[]} submissions={{}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

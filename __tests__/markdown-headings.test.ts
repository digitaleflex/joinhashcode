import { describe, it, expect } from "vitest";
import { extractHeadings, slugifyHeading } from "@/lib/markdown-headings";

describe("slugifyHeading", () => {
  it("normalise accents, espaces et ponctuation", () => {
    expect(slugifyHeading("Sécurité & données sensibles")).toBe(
      "securite-donnees-sensibles",
    );
  });

  it("produit un id stable et vide si aucun texte", () => {
    expect(slugifyHeading("🎬 L'histoire")).toBe("l-histoire");
    expect(slugifyHeading("!!!")).toBe("");
  });
});

describe("extractHeadings", () => {
  const markdown = [
    "## Introduction",
    "Texte",
    "### Sous-section",
    "```python",
    "## Pas un titre (dans le code)",
    "```",
    "## Introduction",
    "## Conclusion",
  ].join("\n");

  it("extrait h2/h3 et ignore les blocs de code", () => {
    const headings = extractHeadings(markdown);
    expect(headings.map((heading) => heading.text)).toEqual([
      "Introduction",
      "Sous-section",
      "Introduction",
      "Conclusion",
    ]);
    expect(headings.map((heading) => heading.level)).toEqual([2, 3, 2, 2]);
  });

  it("dédoublonne les ancres", () => {
    const headings = extractHeadings(markdown);
    expect(headings[0].id).toBe("introduction");
    expect(headings[2].id).toBe("introduction-2");
  });

  it("nettoie le markdown dans les titres", () => {
    const headings = extractHeadings("## **Important** et `code`");
    expect(headings[0].text).toBe("Important et code");
    expect(headings[0].id).toBe("important-et-code");
  });
});

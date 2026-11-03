import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownContent } from "@/components/academy/markdown-content";

describe("MarkdownContent", () => {
  it("rend les titres, le gras et les listes", () => {
    render(
      <MarkdownContent>
        {"# Titre\n\n**Important**\n\n- premier\n- second"}
      </MarkdownContent>,
    );

    expect(screen.getByText("Titre")).toBeInTheDocument();
    expect(screen.getByText("Important")).toBeInTheDocument();
    expect(screen.getByText("premier")).toBeInTheDocument();
  });

  it("rend les blocs <details> du contenu HEF", () => {
    render(
      <MarkdownContent>
        {"<details><summary>Réponse</summary>42</details>"}
      </MarkdownContent>,
    );

    expect(screen.getByText("Réponse")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("neutralise le HTML dangereux", () => {
    const { container } = render(
      <MarkdownContent>
        {'<script>alert("xss")</script><b>ok</b>'}
      </MarkdownContent>,
    );

    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});

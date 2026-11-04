import * as React from "react";

export interface MarkdownHeading {
  level: 2 | 3;
  text: string;
  id: string;
}

/** Stable anchor id shared by the renderer and the table of contents. */
export function slugifyHeading(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

/** Extract h2/h3 headings, ignoring fenced code blocks. */
export function extractHeadings(markdown: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const used = new Map<string, number>();
  let inCode = false;

  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const match = line.match(/^(##|###)\s+(.+?)\s*$/);
    if (!match) continue;

    const text = match[2]
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .trim();
    if (!text) continue;

    const base = slugifyHeading(text);
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    headings.push({
      level: match[1] === "##" ? 2 : 3,
      text,
      id: count === 0 ? base : `${base}-${count + 1}`,
    });
  }

  return headings;
}

/** Best-effort text extraction for ReactMarkdown heading children. */
export function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

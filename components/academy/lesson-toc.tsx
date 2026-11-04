"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { MarkdownHeading } from "@/lib/markdown-headings";

export function LessonToc({ headings }: { headings: MarkdownHeading[] }) {
  const [active, setActive] = React.useState<string | null>(headings[0]?.id ?? null);

  React.useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: [0, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Sommaire de la leçon" className="rounded-2xl border border-border bg-card p-4">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        Sur cette page
      </p>
      <ul className="mt-3 space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block rounded-lg px-2 py-1.5 text-xs leading-snug transition-colors",
                heading.level === 3 && "ml-3",
                active === heading.id
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

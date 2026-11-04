import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { slugifyHeading, textOf } from "@/lib/markdown-headings";

/**
 * HEF content is Markdown with a few trusted HTML blocks (`<details>` for
 * answers). Raw HTML is enabled then sanitized with an explicit allow-list so
 * imported content can never inject scripts.
 */
const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "details", "summary"],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className"],
    summary: [],
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
    img: [...(defaultSchema.attributes?.img ?? []), "width", "height", "align"],
  },
};

export function MarkdownContent({ children }: { children: string }) {
  return (
    <div className="text-sm leading-relaxed text-zinc-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema], rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-10 mb-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => {
            const id = slugifyHeading(textOf(children));
            return (
              <h2
                id={id || undefined}
                className="mt-12 mb-4 scroll-mt-24 border-t border-white/10 pt-8 text-xl font-black tracking-tight text-white"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = slugifyHeading(textOf(children));
            return (
              <h3
                id={id || undefined}
                className="mt-8 mb-2 flex scroll-mt-24 items-center gap-2 text-base font-bold text-white"
              >
                <span className="h-3.5 w-1 rounded-full bg-primary/60" aria-hidden />
                {children}
              </h3>
            );
          },
          h4: ({ children }) => (
            <h4 className="mt-6 mb-2 text-sm font-bold text-white">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="my-3 text-[15px] leading-7 text-zinc-300">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 list-disc space-y-1 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 list-decimal space-y-1 pl-6">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-zinc-200">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="my-5 rounded-r-xl border-l-2 border-primary/50 bg-primary/[0.04] py-2 pl-5 pr-4 text-zinc-300 italic">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isBlock = typeof className === "string" && className.includes("language-");
            if (isBlock) {
              return <code className="hljs font-mono text-xs text-zinc-200">{children}</code>;
            }
            return (
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-xs text-primary">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-5 overflow-x-auto rounded-xl border border-white/10 bg-[#0b0b0d] p-4 text-[13px] leading-relaxed shadow-inner">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full border-collapse text-xs">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-white/10 bg-white/[0.05] px-3 py-2 text-left font-bold text-white">
              {children}
            </th>
          ),
          tr: ({ children }) => (
            <tr className="odd:bg-white/[0.015]">{children}</tr>
          ),
          td: ({ children }) => (
            <td className="border-t border-white/10 px-3 py-2 align-top">{children}</td>
          ),
          hr: () => <hr className="my-8 border-white/10" />,
          img: ({ src, alt, width }) => {
            const numericWidth =
              typeof width === "number" ? width : Number.parseInt(String(width ?? ""), 10);
            const small = Number.isFinite(numericWidth) && numericWidth <= 140;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={typeof src === "string" ? src : undefined}
                alt={alt ?? ""}
                style={small ? { width: numericWidth } : undefined}
                className={
                  small
                    ? "float-right ml-4 mb-3 max-w-[140px] rounded-xl border border-white/10"
                    : "my-4 max-w-full rounded-xl border border-white/10"
                }
              />
            );
          },
          details: ({ children }) => (
            <details className="my-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              {children}
            </details>
          ),
          summary: ({ children }) => (
            <summary className="cursor-pointer font-semibold text-primary">
              {children}
            </summary>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

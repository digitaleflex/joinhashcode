"use client"

import { useMemo, useRef } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import rehypeHighlight from "rehype-highlight"
import { TableOfContents, extractTocItems, generateId } from "./table-of-contents"
import { ScrollProgress } from "./scroll-progress"

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "details", "summary"],
  attributes: {
    ...defaultSchema.attributes,
    summary: [],
    img: [...(defaultSchema.attributes?.img ?? []), "width", "height", "align"],
  },
}

interface MissionBriefingProps {
  content: string
  showToc?: boolean
  showProgress?: boolean
}

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join("")
  if (children && typeof children === "object" && "props" in children) {
    return extractTextFromChildren((children as { props: { children?: React.ReactNode } }).props.children)
  }
  return ""
}

function makeHeading(level: 2 | 3 | 4) {
  const HeadingComponent = ({ children }: { children?: React.ReactNode }) => {
    const text = extractTextFromChildren(children)
    const id = generateId(text)
    const Tag = `h${level}` as "h2" | "h3" | "h4"
    const sizeClass =
      level === 2
        ? "text-2xl font-bold mt-10 mb-5 first:mt-0 scroll-mt-20"
        : level === 3
          ? "text-base font-semibold mt-7 mb-3 uppercase tracking-wider font-mono scroll-mt-20"
          : "text-sm font-semibold mt-4 mb-2 uppercase tracking-wider font-mono text-zinc-300 scroll-mt-20"
    return (
      <Tag id={id} className={`text-white ${sizeClass}`}>
        {children}
      </Tag>
    )
  }
  HeadingComponent.displayName = `H${level}`
  return HeadingComponent
}

export function MissionBriefing({ content, showToc = true, showProgress = true }: MissionBriefingProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const tocItems = useMemo(() => extractTocItems(content), [content])

  const components: Components = {
    h1: makeHeading(2), // Treat h1 as h2 (most briefings start with #)
    h2: makeHeading(2),
    h3: makeHeading(3),
    h4: makeHeading(4),
    p: ({ children }) => (
      <p className="text-sm text-zinc-300 leading-7 mb-4 last:mb-0">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="space-y-2 mb-5 ml-1">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="space-y-2 mb-5 ml-4 list-decimal marker:text-primary marker:font-mono text-sm">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed [&>p]:mb-0">
        <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-primary/60" />
        <span className="flex-1">{children}</span>
      </li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-white">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-zinc-400">
        {children}
      </em>
    ),
    code: ({ children, className }) => {
      const isBlock = className?.includes("language-")
      if (isBlock) {
        return (
          <code className="block bg-zinc-900 border border-border/50 rounded-xl px-4 py-3 text-xs font-mono text-primary/90 leading-relaxed overflow-x-auto my-4">
            {children}
          </code>
        )
      }
      return (
        <code className="bg-zinc-900 border border-border/40 rounded px-1.5 py-0.5 text-xs font-mono text-primary/80">
          {children}
        </code>
      )
    },
    pre: ({ children }) => (
      <pre className="bg-zinc-900 border border-border/50 rounded-xl p-4 overflow-x-auto my-4 text-xs font-mono leading-relaxed">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary/40 pl-4 my-4 text-sm text-zinc-400 italic bg-primary/5 py-3 rounded-r-lg">
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr className="border-border/30 my-6" />
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full text-xs border-collapse border border-border/30 rounded-xl overflow-hidden">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-primary/5 border-b border-border/30">
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 border-t border-border/20 text-zinc-300">
        {children}
      </td>
    ),
    input: ({ type, checked, disabled }) => {
      if (type === "checkbox") {
        return (
          <span
            className="inline-block w-4 h-4 mr-2 border-2 border-primary/40 rounded bg-zinc-900 align-middle relative"
            aria-label={checked ? "checked" : "unchecked"}
          >
            {checked && (
              <span className="absolute inset-0 flex items-center justify-center text-primary text-xs">
                ✓
              </span>
            )}
          </span>
        )
      }
      return null
    },
    details: ({ children }) => (
      <details className="my-4 rounded-xl border border-border/40 bg-white/[0.02] p-4">
        {children}
      </details>
    ),
    summary: ({ children }) => (
      <summary className="cursor-pointer text-sm font-semibold text-primary">
        {children}
      </summary>
    ),
  }

  return (
    <div className="relative">
      {showProgress && <ScrollProgress targetRef={contentRef} />}

      <div className="grid md:grid-cols-[180px_1fr] gap-6">
        {/* Sidebar TOC (desktop) */}
        {showToc && tocItems.length > 0 && (
          <aside className="hidden md:block sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none">
            <TableOfContents items={tocItems} contentRef={contentRef} />
          </aside>
        )}

        {/* Content */}
        <div
          ref={contentRef}
          className="prose-sm max-w-none"
          data-testid="mission-briefing"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema], rehypeHighlight]}
            components={components}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

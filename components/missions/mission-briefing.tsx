"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MissionBriefingProps {
  content: string
}

export function MissionBriefing({ content }: MissionBriefingProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-white mt-8 mb-4 first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-bold text-white mt-6 mb-3 first:mt-0 uppercase tracking-wide font-mono">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold text-zinc-200 mt-4 mb-2 uppercase tracking-wide font-mono">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-sm text-zinc-300 leading-7 mb-4 last:mb-0">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-2 mb-4 ml-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-2 mb-4 ml-1 list-none counter-reset-item">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed">
            <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-primary/60" />
            <span>{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-zinc-400">{children}</em>
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
          <blockquote className="border-l-2 border-primary/40 pl-4 my-4 text-sm text-zinc-400 italic">
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
          <thead className="bg-primary/5 border-b border-border/30">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 border-t border-border/20 text-zinc-300">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

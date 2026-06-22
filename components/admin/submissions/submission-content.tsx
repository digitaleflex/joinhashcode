"use client"

import { ExternalLink, FileText } from "lucide-react"

const URL_METHODS = ["ANY_LINK", "LIVE_URL", "DOCUMENT_LINK", "GITHUB_REPO", "GITHUB_LINK"]

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

interface SubmissionContentProps {
  content: string | null
  submissionMethod: string
  deliverables?: string[]
  expanded?: boolean
}

export function SubmissionContent({
  content,
  submissionMethod,
  deliverables,
  expanded = false,
}: SubmissionContentProps) {
  if (!content) return <span className="text-xs text-muted-foreground italic">Aucun contenu</span>

  if (URL_METHODS.includes(submissionMethod) && isValidUrl(content)) {
    return (
      <div className="flex items-center gap-2">
        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
        <a
          href={content}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs text-primary hover:underline ${expanded ? "break-all" : "truncate block max-w-xs"}`}
        >
          {content}
        </a>
      </div>
    )
  }

  if (expanded) {
    return (
      <div className="space-y-3">
        {deliverables && deliverables.length > 0 && (
          <div className="space-y-1">
            <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60">Livrables attendus</p>
            <ul className="space-y-0.5">
              {deliverables.map((d, i) => (
                <li key={i} className="text-[11px] text-zinc-500 font-mono">— {d}</li>
              ))}
            </ul>
          </div>
        )}
        <pre className="text-sm text-zinc-200 whitespace-pre-wrap break-words font-sans leading-relaxed bg-white/3 border border-white/5 rounded-xl p-4">
          {content}
        </pre>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      <FileText className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{content}</p>
    </div>
  )
}

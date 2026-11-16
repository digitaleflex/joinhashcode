import Link from "next/link"
import { ArrowRight, Clock, FlaskConical, FolderKanban } from "lucide-react"
import { cn } from "@/lib/utils"
import { LabStatusBadge } from "./lab-status-badge"

export interface LabCardMission {
  id?: string
  slug: string
  title: string
  shortDesc?: string | null
  description?: string | null
  category: string
  missionLevel?: string | null
  duration?: string | null
  tags?: string[]
  course?: { slug: string; title: string } | null
  deliverables?: { length: number }[] | { length: number }
}

interface LabCardProps {
  mission: LabCardMission
  variant?: "public" | "hef"
  showCourse?: boolean
  submissions?: Record<string, string>
  fallbackCode?: string
  className?: string
}

function preuvesLabel(count: number): string {
  return `${count} preuve${count > 1 ? "s" : ""} attendue${count > 1 ? "s" : ""}`
}

function deliverablesCount(m: LabCardMission): number {
  if (Array.isArray(m.deliverables)) return m.deliverables.length
  if (m.deliverables && typeof m.deliverables === "object" && "length" in m.deliverables) {
    return (m.deliverables as { length: number }).length
  }
  return 0
}

export function LabCard({
  mission: m,
  variant = "public",
  showCourse = false,
  submissions,
  fallbackCode = "HEF",
  className,
}: LabCardProps) {
  const status = submissions ? submissions[m.slug] : undefined

  if (variant === "hef") {
    const isProject = (m.tags ?? []).includes("PROJECT")
    const Icon = isProject ? FolderKanban : FlaskConical
    const moduleCode =
      (m.tags ?? []).find((tag) => tag.startsWith("HEF-")) ?? fallbackCode
    const href = `/missions/${m.slug}`

    return (
      <Link
        href={href}
        className={cn(
          "group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-primary">
            <Icon className="h-3 w-3" aria-hidden />
            {isProject ? "Projet" : "Lab"}
          </span>
          <LabStatusBadge status={status} />
        </div>
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {moduleCode}
        </p>
        <h3 className="mt-1 text-sm font-bold leading-snug text-foreground group-hover:text-primary">
          {m.title}
        </h3>
        {m.shortDesc && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {m.shortDesc}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4 text-[11px] font-semibold text-muted-foreground">
          <span />
          <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Ouvrir →
          </span>
        </div>
      </Link>
    )
  }

  // variant === "public"
  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-muted-foreground">
          {m.category}
        </span>
        {m.missionLevel && (
          <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-primary">
            {m.missionLevel}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-syne text-xl font-bold text-foreground">{m.title}</h3>
      {showCourse && m.course && (
        <p className="mt-1 text-xs font-semibold text-primary">
          <Link href={`/academy/courses/${m.course.slug}`} className="hover:underline">
            {m.course.title}
          </Link>
        </p>
      )}
      {(m.shortDesc || m.description) && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {m.shortDesc || (m.description ? m.description.slice(0, 140) : "")}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {m.duration && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {m.duration}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden />
          {preuvesLabel(deliverablesCount(m))}
        </span>
      </div>
      <Link
        href={`/missions/${m.slug}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        Voir le lab <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </article>
  )
}


import Link from "next/link"
import { FlaskConical, FolderKanban } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getMissionStatusMeta } from "@/lib/mission-status"

export interface HefMissionCard {
  slug: string
  title: string
  shortDesc?: string | null
  category: string
  xp: number
  missionLevel?: string | null
  tags: string[]
}

export function HefMissionsSection({
  missions,
  submissions,
  kicker = "Parcours HEF",
  title = "Labs & projets à soumettre",
  description,
  fallbackCode = "HEF",
}: {
  missions: HefMissionCard[]
  submissions: Record<string, string>
  kicker?: string
  title?: string
  description?: string
  fallbackCode?: string
}) {
  if (missions.length === 0) return null

  const labs = missions.filter((mission) => mission.tags.includes("LAB"))
  const projects = missions.filter((mission) => mission.tags.includes("PROJECT"))

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {kicker}
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {description ?? `${labs.length} labs et ${projects.length} projets issus du socle Engineering Foundations.`}
          </p>
        </div>
        <Link
          href="/academy/courses"
          className="text-xs font-bold text-primary hover:underline"
        >
          Voir les cours Academy →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {missions.map((mission) => {
          const status = getMissionStatusMeta(submissions[mission.slug])
          const isProject = mission.tags.includes("PROJECT")
          const Icon = isProject ? FolderKanban : FlaskConical
          const moduleCode = mission.tags.find((tag) => tag.startsWith("HEF-")) ?? fallbackCode

          return (
            <Link
              key={mission.slug}
              href={`/missions/${mission.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-primary">
                  <Icon className="h-3 w-3" aria-hidden />
                  {isProject ? "Projet" : "Lab"}
                </span>
                <Badge className={`border font-mono text-xs ${status.className}`}>
                  {status.label}
                </Badge>
              </div>
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {moduleCode}
              </p>
              <h3 className="mt-1 text-sm font-bold leading-snug text-foreground group-hover:text-primary">
                {mission.title}
              </h3>
              {mission.shortDesc && (
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {mission.shortDesc}
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
        })}
      </div>
    </section>
  )
}

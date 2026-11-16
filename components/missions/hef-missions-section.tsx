import Link from "next/link"
import { LabCard, type LabCardMission } from "./lab-card"

export type { LabCardMission as HefMissionCard }

export function HefMissionsSection({
  missions,
  submissions,
  kicker = "Parcours HEF",
  title = "Labs & projets à soumettre",
  description,
  fallbackCode = "HEF",
}: {
  missions: LabCardMission[]
  submissions: Record<string, string>
  kicker?: string
  title?: string
  description?: string
  fallbackCode?: string
}) {
  if (missions.length === 0) return null

  const labs = missions.filter((mission) => (mission.tags ?? []).includes("LAB"))
  const projects = missions.filter((mission) => (mission.tags ?? []).includes("PROJECT"))

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
        {missions.map((mission) => (
          <LabCard
            key={mission.slug}
            mission={mission}
            variant="hef"
            submissions={submissions}
            fallbackCode={fallbackCode}
          />
        ))}
      </div>
    </section>
  )
}
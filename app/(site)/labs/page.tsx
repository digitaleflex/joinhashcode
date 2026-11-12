import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, FlaskConical } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import {
  getPublishedMissions,
  getActiveAteliers,
  groupMissionsByCourse,
  groupMissionsByLevel,
  sortMissionsForCompactView,
} from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Labs",
  description: "Apprends par la pratique dans les labs des cours du parcours HashCode.",
}

export const dynamic = "force-dynamic"

type LabsView = "parcours" | "niveaux" | "compacte"

const VIEW_TABS: { key: LabsView; label: string; href: string; hint: string }[] = [
  { key: "parcours", label: "Parcours", href: "/labs", hint: "Labs regroupés par cours" },
  { key: "niveaux", label: "Niveaux", href: "/labs?vue=niveaux", hint: "Initiation, cœur, pro" },
  { key: "compacte", label: "Liste", href: "/labs?vue=compacte", hint: "Vue dense, tout d'un coup d'œil" },
]

type LabMission = Awaited<ReturnType<typeof getPublishedMissions>>[number]

function preuvesLabel(count: number): string {
  return `${count} preuve${count > 1 ? "s" : ""} attendue${count > 1 ? "s" : ""}`
}

function LabCard({ m, showCourse }: { m: LabMission; showCourse?: boolean }) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md">
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
          {m.shortDesc || m.description.slice(0, 140)}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {m.duration && (
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{m.duration}</span>
        )}
        <span className="inline-flex items-center gap-1"><FlaskConical className="h-3.5 w-3.5" aria-hidden />{preuvesLabel(m.deliverables.length)}</span>
      </div>
      <Link href={`/missions/${m.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        Voir le lab <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </article>
  )
}

export default async function LabsPage({
  searchParams,
}: {
  searchParams: Promise<{ vue?: string }>
}) {
  const { vue } = await searchParams
  const activeView: LabsView = vue === "niveaux" || vue === "compacte" ? vue : "parcours"

  const [missions, ateliers] = await Promise.all([getPublishedMissions(), getActiveAteliers()])
  // Les labs appartiennent toujours à un cours : jamais de liste à plat.
  const labs = missions.filter((m) => !m.isWeeklyChallenge)
  const groups = groupMissionsByCourse(labs)

  // Point de départ recommandé : HEF-000, sinon le premier cours.
  const startGroup =
    groups.find((g) => g.course?.slug.startsWith("hef-000")) ?? groups[0] ?? null
  const startLab = startGroup?.missions[0] ?? null

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <SectionHeading
          level={1}
          kicker="Labs"
          title="Apprendre en pratiquant. Progresser par l'expérience."
          description="Chaque lab appartient à un cours du parcours : choisis ton cours, puis pratique avec ses labs et son projet."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/academy/courses" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
            Explorer les cours <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {/* Sélecteur de vue — liens URL, sans JS */}
        <nav aria-label="Modes d'affichage" className="mt-8 flex flex-wrap gap-2">
          {VIEW_TABS.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={activeView === tab.key ? "page" : undefined}
              title={tab.hint}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                activeView === tab.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </section>

      {/* Bloc départ recommandé */}
      {startGroup?.course && startLab && (
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 sm:p-10">
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              Commence ici
            </p>
            <h2 className="mt-2 font-syne text-2xl font-bold text-foreground sm:text-3xl">
              {startGroup.course.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Premier pas recommandé : {startLab.title}. Le parcours se suit dans l'ordre,
              chaque cours prépare le suivant.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/academy/courses/${startGroup.course.slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Commencer par ce cours <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={`/missions/${startLab.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground hover:border-primary/40"
              >
                Voir le premier lab
              </Link>
            </div>
          </div>
        </section>
      )}

      {labs.length === 0 ? (
        <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-base font-semibold text-foreground">De nouveaux labs sont publiés régulièrement.</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Les membres accèdent aux labs de leurs cours, peuvent soumettre leurs preuves et recevoir des retours.{" "}
              <Link href="/signin" className="font-semibold text-primary hover:underline">Connecte-toi</Link>{" "}
              pour retrouver ton parcours.
            </p>
          </div>
        </section>
      ) : activeView === "niveaux" ? (
        /* Vue par niveaux : initiation → cœur → pro */
        groupMissionsByLevel(labs).map((group) => (
          <section key={group.level ?? "sans"} className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" aria-hidden />
              <h2 className="font-syne text-xl font-bold text-foreground sm:text-2xl">
                {group.label}
                <span className="ml-3 font-mono text-xs font-bold text-muted-foreground">
                  {group.missions.length} lab{group.missions.length > 1 ? "s" : ""}
                </span>
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {group.missions.map((m) => (
                <LabCard key={m.id} m={m} showCourse />
              ))}
            </div>
          </section>
        ))
      ) : activeView === "compacte" ? (
        /* Vue liste dense : tout d'un coup d'œil */
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <ul className="divide-y divide-border">
              {sortMissionsForCompactView(labs).map((m) => (
                <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 transition-colors hover:bg-muted/40">
                  <Link href={`/missions/${m.slug}`} className="min-w-0 flex-1 text-sm font-bold text-foreground hover:text-primary hover:underline">
                    {m.title}
                  </Link>
                  {m.course ? (
                    <Link href={`/academy/courses/${m.course.slug}`} className="text-xs font-semibold text-primary hover:underline">
                      {m.course.title}
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sans cours</span>
                  )}
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-bold uppercase text-muted-foreground">
                    {m.category}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {preuvesLabel(m.deliverables.length)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        /* Vue parcours : un bloc repliable par cours, le premier ouvert */
        groups.map((group, index) => (
          <section key={group.course?.slug ?? "autres"} className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
            <details
              open={index === 0}
              className="group overflow-hidden rounded-2xl border border-border bg-card open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-5 transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black text-primary/50">
                    {group.course ? String(index + 1).padStart(2, "0") : "•"}
                  </span>
                  <span className="font-syne text-lg font-bold text-foreground sm:text-xl">
                    {group.course ? group.course.title : "Autres missions"}
                  </span>
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    {group.missions.length} lab{group.missions.length > 1 ? "s" : ""}
                  </span>
                </span>
                <span className="text-muted-foreground transition-transform group-open:rotate-180" aria-hidden>
                  ⌄
                </span>
              </summary>
              <div className="border-t border-border p-5">
                {group.course && (
                  <Link
                    href={`/academy/courses/${group.course.slug}`}
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Voir le cours : {group.course.title} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  {group.missions.map((m) => (
                    <LabCard key={m.id} m={m} />
                  ))}
                </div>
              </div>
            </details>
          </section>
        ))
      )}

      {/* Workshops */}
      {ateliers.length > 0 && (
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" aria-hidden />
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Ateliers</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ateliers.map((a) => (
                <article key={a.id} className="rounded-2xl border border-border bg-background p-6">
                  <h3 className="font-syne text-lg font-bold text-foreground">{a.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{a.specializationLabel}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    {a.duration && (
                      <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{a.duration}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Access note */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary p-8 sm:p-10">
          <h2 className="max-w-xl font-syne text-2xl font-bold text-primary-foreground sm:text-3xl">
            Les Labs s'ouvrent après ton inscription.
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-primary-foreground/90">
            Les missions peuvent inclure des soumissions et des évaluations. Connecte-toi pour retrouver les activités auxquelles tu as accès, transmettre tes travaux et consulter les retours disponibles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signin" className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-5 py-3 text-sm font-bold text-primary transition-transform hover:scale-[1.02]">
              Rejoindre HashCode <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/programs" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10">
              Explorer les domaines
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

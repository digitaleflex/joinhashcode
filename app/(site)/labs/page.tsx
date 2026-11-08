import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, FlaskConical, Zap } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { getPublishedMissions, getActiveAteliers, groupMissionsByCourse } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Labs",
  description: "Apprends par la pratique dans les labs des cours du parcours HashCode.",
}

export const dynamic = "force-dynamic"

export default async function LabsPage() {
  const [missions, ateliers] = await Promise.all([getPublishedMissions(), getActiveAteliers()])
  // Les labs appartiennent toujours à un cours : jamais de liste à plat.
  const groups = groupMissionsByCourse(missions.filter((m) => !m.isWeeklyChallenge))

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <SectionHeading
          level={1}
          kicker="Labs"
          title="Apprendre en pratiquant. Progresser par l'expérience."
          description="Chaque lab appartient à un cours du parcours : choisis ton cours, puis pratique avec ses labs et son projet."
        />
        <div className="mt-6">
          <Link href="/academy/courses" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
            Explorer les cours <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* Labs groupés par cours */}
      {groups.length === 0 ? (
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
      ) : (
        groups.map((group) => (
          <section key={group.course?.slug ?? "autres"} className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-primary" aria-hidden />
                <h2 className="font-syne text-xl font-bold text-foreground sm:text-2xl">
                  {group.course ? group.course.title : "Autres missions"}
                </h2>
              </div>
              {group.course && (
                <Link
                  href={`/academy/courses/${group.course.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Voir le cours <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {group.missions.map((m) => (
                <article key={m.id} className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md">
                  <div className="flex items-center gap-2">
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
                  {(m.shortDesc || m.description) && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {m.shortDesc || m.description.slice(0, 140)}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    {m.duration && (
                      <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{m.duration}</span>
                    )}
                    <span className="inline-flex items-center gap-1"><FlaskConical className="h-3.5 w-3.5" aria-hidden />{m.deliverables.length} preuve{m.deliverables.length > 1 ? "s" : ""} attendue{m.deliverables.length > 1 ? "s" : ""}</span>
                  </div>
                  <Link href={`/missions/${m.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    Voir le lab <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </article>
              ))}
            </div>
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
                    <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5" aria-hidden />{a.xpReward} XP</span>
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

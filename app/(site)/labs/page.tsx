import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, Zap } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { getPublishedMissions, getActiveAteliers } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Labs",
  description: "Apprends par la pratique grâce aux missions guidées, défis et ateliers disponibles dans les Labs.",
}

export const dynamic = "force-dynamic"

export default async function LabsPage() {
  const [missions, ateliers] = await Promise.all([getPublishedMissions(), getActiveAteliers()])
  const weeklies = missions.filter((m) => m.isWeeklyChallenge)
  const guided = missions.filter((m) => !m.isWeeklyChallenge)

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <SectionHeading
          kicker="Labs"
          title="Apprendre en pratiquant. Progresser par l'expérience."
          description="Découvre des activités concrètes pour expérimenter, résoudre des problèmes et renforcer tes compétences techniques."
        />
      </section>

      {/* Guided missions */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-8 bg-primary" aria-hidden />
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Missions guidées</h2>
        </div>
        {guided.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-base font-semibold text-foreground">De nouvelles missions sont publiées régulièrement.</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Les membres accèdent aux missions guidées, peuvent soumettre leurs travaux et recevoir des retours.{" "}
              <Link href="/signin" className="font-semibold text-primary hover:underline">Connecte-toi</Link>{" "}
              to see what is available to you.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {guided.map((m) => (
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
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  {m.duration && (
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{m.duration}</span>
                  )}
                  <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5" aria-hidden />{m.xp} XP</span>
                </div>
                <Link href={`/missions/${m.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  Voir la mission <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Weekly challenges */}
      {weeklies.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" aria-hidden />
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Défis de la semaine</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {weeklies.map((m) => (
              <article key={m.id} className="rounded-2xl border border-border bg-card p-5">
                <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-muted-foreground">
                  Hebdomadaire
                </span>
                <h3 className="mt-3 font-syne text-base font-bold leading-snug text-foreground">{m.title}</h3>
                <Link href={`/missions/${m.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  Participer <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </section>
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
              Explore programs
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

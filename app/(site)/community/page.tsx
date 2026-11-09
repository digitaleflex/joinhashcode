import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { getPublicStats, getPublishedInterventions, getPublicTalentsPreview } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Communauté",
  description: "Rejoins une communauté de personnes passionnées par la technologie, l'apprentissage et la création de projets utiles.",
}

export const dynamic = "force-dynamic"

export default async function CommunityPage() {
  const [stats, interventions, talents] = await Promise.all([
    getPublicStats(),
    getPublishedInterventions(),
    getPublicTalentsPreview(6),
  ])

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <SectionHeading
          level={1}
          kicker="Communauté"
          title="Une communauté portée par la curiosité et la création."
          description="HashCode rassemble des personnes qui partagent le goût de la technologie, de l'apprentissage et de la création."
        />
        {/* Verified band — hidden if stats unavailable (never show 0 as fact) */}
        {stats.totalMembers !== null && stats.approvedSubmissions !== null && stats.publishedCourses !== null && (
        <div className="mt-10 grid grid-cols-1 gap-4 rounded-3xl border border-border bg-card p-8 sm:grid-cols-3">
          <div>
            <p className="font-syne text-4xl font-bold text-foreground">{stats.totalMembers.toLocaleString("fr-FR")}</p>
            <p className="mt-1 text-sm text-muted-foreground">Membres qui apprennent et construisent</p>
          </div>
          <div>
            <p className="font-syne text-4xl font-bold text-foreground">{stats.approvedSubmissions.toLocaleString("fr-FR")}</p>
            <p className="mt-1 text-sm text-muted-foreground">Travaux validés par les évaluateurs</p>
          </div>
          <div>
            <p className="font-syne text-4xl font-bold text-foreground">{stats.publishedCourses.toLocaleString("fr-FR")}</p>
            <p className="mt-1 text-sm text-muted-foreground">Cours publiés dans l'Academy</p>
          </div>
        </div>
        )}
      </section>

      {/* Events & interventions */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-8 bg-primary" aria-hidden />
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Événements et sessions</h2>
        </div>
        {interventions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm leading-relaxed text-muted-foreground">
            Les prochaines sessions sont annoncées en priorité aux membres.{" "}
            <Link href="/signin" className="font-semibold text-primary hover:underline">Rejoindre la communauté</Link>{" "}
            to be notified of the next ones.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {interventions.map((ev) => (
              <article key={ev.id} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-syne text-lg font-bold leading-snug text-foreground">{ev.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{ev.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    {new Date(ev.date).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                  {ev.speaker && <span>by {ev.speaker}</span>}
                  {ev.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />{ev.location}
                    </span>
                  )}
                </div>
                {ev.recordingUrl && (
                  <Link href={ev.recordingUrl} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    Voir le replay <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Membres */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" aria-hidden />
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Membres qui partagent leurs réalisations</h2>
          </div>
          <Link href="/talents" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            Tous les talents <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        {talents.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm leading-relaxed text-muted-foreground">
            Les profils publics apparaissent lorsque les membres ont des missions validées et choisissent de rendre leur profil visible
            and opt in to visibility.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {talents.map((t) => (
              <Link
                key={t.pseudo}
                href={`/u/${t.pseudo}`}
                className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-foreground">@{t.pseudo}</p>
                  {t.class && (
                    <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-primary">
                      {t.class}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t.missionsCompletedCount} mission{t.missionsCompletedCount > 1 ? "s" : ""} validée{t.missionsCompletedCount > 1 ? "s" : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Contribute */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
          <h2 className="max-w-xl font-syne text-2xl font-bold text-foreground sm:text-3xl">
            Grandir ensemble. Partager les connaissances. Construire ensemble.
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Contribue en réalisant les activités, en partageant tes apprentissages et en aidant les autres membres à progresser. La reconnaissance repose sur les contributions et les réalisations démontrées.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signin" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
              Rejoindre la communauté <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground hover:border-primary/50">
              Notre philosophie
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

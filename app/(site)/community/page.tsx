import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { getPublicStats, getPublishedInterventions, getPublicTalentsPreview } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Community",
  description: "HASHCODE brings together people who share a passion for technology, learning and building meaningful things.",
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
          kicker="Community"
          title="A community driven by curiosity and creation."
          description="HASHCODE brings together people who share a passion for technology, learning and building meaningful things."
        />
        {/* Verified band */}
        <div className="mt-10 grid grid-cols-1 gap-4 rounded-3xl border border-border bg-card p-8 sm:grid-cols-3">
          <div>
            <p className="font-syne text-4xl font-bold text-foreground">{stats.totalMembers.toLocaleString("en-US")}</p>
            <p className="mt-1 text-sm text-muted-foreground">Members learning and building</p>
          </div>
          <div>
            <p className="font-syne text-4xl font-bold text-foreground">{stats.approvedSubmissions.toLocaleString("en-US")}</p>
            <p className="mt-1 text-sm text-muted-foreground">Submissions approved by reviewers</p>
          </div>
          <div>
            <p className="font-syne text-4xl font-bold text-foreground">{stats.publishedCourses.toLocaleString("en-US")}</p>
            <p className="mt-1 text-sm text-muted-foreground">Academy courses published</p>
          </div>
        </div>
      </section>

      {/* Events & interventions */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-8 bg-primary" aria-hidden />
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Events & sessions</h2>
        </div>
        {interventions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm leading-relaxed text-muted-foreground">
            Sessions are announced to members first.{" "}
            <Link href="/signin" className="font-semibold text-primary hover:underline">Join the community</Link>{" "}
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
                    {new Date(ev.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
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
                    Watch recording <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Members */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" aria-hidden />
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Members who build in public</h2>
          </div>
          <Link href="/talents" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            All talents <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        {talents.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm leading-relaxed text-muted-foreground">
            Public profiles appear here as soon as members complete validated missions
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
                  {t.missionsCompletedCount} mission{t.missionsCompletedCount > 1 ? "s" : ""} validated · Level {t.level}
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
            Grow together. Share knowledge. Build together.
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Contribute by completing labs, reviewing peers&apos; work, sharing what you
            learn and helping the next member progress. Recognition follows contribution —
            mentors emerge from members with proven work.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signin" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
              Join the community <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground hover:border-primary/50">
              Our philosophy
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

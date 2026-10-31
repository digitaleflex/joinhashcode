import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { SectionHeading } from "@/components/site/section-heading"

export const metadata: Metadata = {
  title: "Talent Network",
  description: "Discover verified HASHCODE talents — skills proven through labs, missions and peer reviews.",
}

export const revalidate = 300

export default async function TalentsVitrinePage() {
  const talents = await prisma.user.findMany({
    where: {
      class: { not: null },
      pseudo: { not: null },
      talentVisible: true,
      missionsCompletedCount: { gte: 1 },
      OR: [{ banned: { not: true } }, { banned: null }],
    },
    select: {
      pseudo: true,
      class: true,
      country: true,
      city: true,
      bio: true,
      tools: true,
      level: true,
      missionsCompletedCount: true,
    },
    orderBy: [{ missionsCompletedCount: "desc" }, { level: "desc" }],
    take: 50,
  })

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <SectionHeading
          kicker="Talent Network"
          title="Proof, not promises."
          description="Every profile below opted in to be public and completed at least one validated mission. Skills proven through labs and reviews — not self-declared."
        />
        {talents.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-base font-semibold text-foreground">The network is warming up.</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Public profiles appear here as soon as members complete validated missions
              and opt in to visibility.{" "}
              <Link href="/signin" className="font-semibold text-primary hover:underline">
                Join the community
              </Link>{" "}
              to be among the first.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {talents.map((t) => (
              <Link
                key={t.pseudo}
                href={`/u/${t.pseudo}`}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-bold text-foreground">@{t.pseudo}</p>
                  {t.class && (
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-primary">
                      {t.class}
                    </span>
                  )}
                </div>
                {(t.city || t.country) && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[t.city, t.country].filter(Boolean).join(", ")}
                  </p>
                )}
                {t.bio && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{t.bio}</p>}
                {t.tools.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {t.tools.slice(0, 5).map((tool) => (
                      <span key={tool} className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>Level {t.level}</span>
                  <span>{t.missionsCompletedCount} mission{t.missionsCompletedCount > 1 ? "s" : ""} validated</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

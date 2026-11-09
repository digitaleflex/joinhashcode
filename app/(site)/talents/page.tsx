import type { Metadata } from "next"
import Link from "next/link"
import { getPublicTalentsPreview } from "@/lib/site-data"
import { SectionHeading } from "@/components/site/section-heading"

export const metadata: Metadata = {
  title: "Réseau de talents",
  description: "Découvre les profils publics HashCode et les compétences démontrées à travers les missions et réalisations validées.",
}

// Données DB à chaque requête : le prerender build ne doit jamais
// dépendre de la base (EAI_AGAIN en CI/preview = build cassé).
export const dynamic = "force-dynamic"

export default async function TalentsVitrinePage() {
  const talents = await getPublicTalentsPreview(50)

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <SectionHeading
          level={1}
          kicker="Réseau de talents"
          title="Des preuves, pas de simples déclarations."
          description="Les profils affichés ont choisi d'être publics. Les réalisations validées sont distinguées des compétences simplement déclarées."
        />
        {talents.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-base font-semibold text-foreground">Le réseau se construit progressivement.</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Les profils apparaissent lorsque des membres disposent de réalisations validées et choisissent de rendre leur profil visible.{" "}
              <Link href="/signin" className="font-semibold text-primary hover:underline">
                Rejoindre la communauté
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
                  <span>{t.missionsCompletedCount} mission{t.missionsCompletedCount > 1 ? "s" : ""} validée{t.missionsCompletedCount > 1 ? "s" : ""}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

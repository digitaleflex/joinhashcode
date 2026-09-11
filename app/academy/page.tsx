import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Academy — HASHCODE",
  description: "Accède aux cours et parcours de formation HASHCODE.",
}

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white italic">
            Academy — Bientôt
          </h1>
          <p className="mt-4 text-zinc-400 text-sm md:text-lg font-light">
            Les cours et parcours pédagogiques seront importés ici.
          </p>
        </div>
      </section>
    </main>
  )
}

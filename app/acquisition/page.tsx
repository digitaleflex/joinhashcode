import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Acquisition — HASHCODE",
  description: "Découvre comment rejoindre HASHCODE et accélérer ta carrière tech.",
}

export default function AcquisitionPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white italic">
            Acquisition — Bientôt
          </h1>
          <p className="mt-4 text-zinc-400 text-sm md:text-lg font-light">
            La page de lancement et le funnel d&apos;acquisition seront importés ici.
          </p>
        </div>
      </section>
    </main>
  )
}

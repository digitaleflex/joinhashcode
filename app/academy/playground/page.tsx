import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Playground Python — Academy",
  description:
    "Écris et exécute du Python directement dans ton navigateur : défis HEF, indices, XP et badges.",
}

export default function PlaygroundPage() {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Academy
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Playground Python
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Écris, exécute et débogue du Python directement dans ton navigateur.
            17 défis reliés aux missions HEF, indices progressifs et validation automatique.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <iframe
            src="/playground/index.html"
            title="Playground Python HashCode"
            className="h-[calc(100vh-16rem)] min-h-[640px] w-full"
          />
        </div>
      </div>
    </main>
  )
}

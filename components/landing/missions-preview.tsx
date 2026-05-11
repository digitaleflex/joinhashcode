import { Zap, Code, Cloud, Cpu } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const tracks = [
  {
    title: "AI Builders",
    icon: Code,
    desc: "Next.js, TypeScript, AI Workflows & SaaS Architecture.",
    color: "text-blue-500",
  },
  {
    title: "Product Systems",
    icon: Zap,
    desc: "UX, Systems Thinking & High-traffic Orchestration.",
    color: "text-purple-500",
  },
  {
    title: "Cloud Foundations",
    icon: Cloud,
    desc: "Serverless, Edge Computing & Scalable Infrastructure.",
    color: "text-emerald-500",
  },
  {
    title: "Automation & AI",
    icon: Cpu,
    desc: "AI Agents, Autonomous Workflows & Productivity.",
    color: "text-orange-500",
  },
]

export function MissionsPreview() {
  return (
    <section id="missions" className="border-b border-border/60 bg-zinc-950/20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Les Piliers
            </span>
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
            Quatre Tracks. <span className="text-primary">Une Destination.</span>
          </h2>
          <p className="max-w-2xl text-zinc-400 text-lg">
            Découvre les domaines d'expertise de HASHCODE. Chaque track est conçu pour t'amener de l'hypothèse à la maîtrise opérationnelle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track, i) => (
            <Card key={i} className="bg-zinc-900/50 border-white/5 hover:border-primary/30 transition-all group overflow-hidden">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${track.color}`}>
                  <track.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl text-white">{track.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {track.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

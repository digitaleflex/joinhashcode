import { Zap, Target, Users } from "lucide-react"

const steps = [
  {
    n: "01",
    title: "Profile-toi",
    icon: Target,
    body: "Réponds à 13 questions ciblées en 3 minutes. Identité, parcours, objectifs, mode de travail.",
  },
  {
    n: "02",
    title: "Découvre ton profil",
    icon: Zap,
    body: "L'algorithme identifie ton type dominant parmi quatre : Builder, Créateur, Stratège ou Catalyseur. Beaucoup de membres sont hybrides.",
  },
  {
    n: "03",
    title: "Rejoins ta guilde",
    icon: Users,
    body: "Accède à un dashboard personnalisé, des missions adaptées et une communauté de pairs au même niveau que toi.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden border-b border-white/5 bg-zinc-950 py-24 sm:py-32">
      {/* Subtle Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(197,244,65,0.05),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary">
              Comment ça marche
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl uppercase italic leading-none">
            Trois étapes.<br />
            <span className="text-zinc-500">Pas une de plus.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="group relative flex flex-col gap-6 bg-white/[0.01] border border-white/[0.05] p-8 rounded-[2rem] transition-all duration-500 hover:bg-white/[0.03] hover:border-primary/30 hover:-translate-y-1 overflow-hidden"
            >
              {/* Step number background */}
              <div className="absolute -right-4 -top-8 text-9xl font-black text-white/[0.02] italic select-none group-hover:text-primary/[0.03] transition-colors">
                {step.n}
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  {step.n}
                </span>
              </div>

              <div className="space-y-3 relative z-10">
                <h3 className="text-xl font-black tracking-tight text-white uppercase italic">
                  {step.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                  {step.body}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="relative mt-auto pt-6 overflow-hidden">
                <div className="h-px w-full bg-white/5" />
                <div className="absolute top-6 left-0 h-px w-0 bg-primary transition-all duration-700 group-hover:w-full shadow-[0_0_8px_#B8FF3B]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

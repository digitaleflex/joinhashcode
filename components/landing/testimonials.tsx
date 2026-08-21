"use client"

const MEMBERS = [
  { pseudo: "neltech52", name: "Nelkaël T.", profile: "Builder", city: "Bénin", member: 5 },
  { pseudo: "edjrosse", name: "Steve E.", profile: "Strategist", city: "Akassato", member: 6 },
  { pseudo: "No_Name", name: "Malick R.", profile: "Strategist", city: "Cotonou", member: 8 },
  { pseudo: "Daniella", name: "Danie D.", profile: "Strategist", city: "Bénin", member: 11 },
  { pseudo: "Joanice", name: "Joanice A.", profile: "Strategist", city: "Bénin", member: 13 },
]

const PROFILE_COLORS: Record<string, string> = {
  Builder: "text-emerald-400",
  Strategist: "text-amber-400",
}

export function Testimonials() {
  return (
    <section className="border-b border-border/60 bg-zinc-950 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase text-primary">Membres fondateurs</span>
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl uppercase italic leading-none">
            Ils ont déjà franchi le pas.
          </h2>
          <p className="mt-4 max-w-xl text-zinc-500 text-sm leading-relaxed">
            Les 13 premiers membres de HASHCODE — tous réels, tous basés au Bénin.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {MEMBERS.map((m) => (
            <div
              key={m.pseudo}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.01] p-5 hover:border-primary/20 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="font-mono text-xs font-black text-primary">
                  #{m.member}
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-white">{m.name}</p>
                <p className={`text-[10px] font-bold uppercase tracking-tight ${PROFILE_COLORS[m.profile] ?? "text-zinc-400"}`}>
                  {m.profile}
                </p>
                <p className="text-[10px] text-zinc-600 mt-1">{m.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

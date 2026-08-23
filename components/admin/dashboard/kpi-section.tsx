import {
  Activity, BarChart3, Route, GraduationCap, Target, FileCheck,
  HeartHandshake, Shield, Zap,
} from "lucide-react"

interface KpiSectionProps {
  userCount: number
  activeRecently: number
  quizTotal: number
  parcoursDemarres: number | null
  ateliersSuivis: number | null
  projetsEnCours: number | null
  evidencesValidees: number | null
  objectifsAtteints: number | null
  mentorsActifs: number | null
  retention30: number
  retention60: number
  retention90: number
}

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string
  value: number | string | null
  icon: React.ElementType
  color: string
  sub?: string
}) {
  const displayValue = value === null || value === undefined ? "—" : value
  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-3 shadow-sm hover:border-white/10 transition-colors cursor-pointer">
      <div className={`flex items-center gap-2 ${color}`}>
        <Icon className="h-4 w-4" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold text-white tracking-tight">{displayValue}</div>
      </div>
      {sub && <p className="text-[10px] font-mono text-muted-foreground">{sub}</p>}
    </div>
  )
}

export function KpiSection({
  userCount,
  activeRecently,
  quizTotal,
  parcoursDemarres,
  ateliersSuivis,
  projetsEnCours,
  evidencesValidees,
  objectifsAtteints,
  mentorsActifs,
  retention30,
  retention60,
  retention90,
}: KpiSectionProps) {
  const kpis = [
    { label: "Membres actifs (7j)", value: activeRecently, icon: Activity, color: "text-primary", sub: `sur ${userCount} inscrits` },
    { label: "Quiz terminés", value: quizTotal, icon: BarChart3, color: "text-primary" },
    { label: "Parcours démarrés", value: parcoursDemarres, icon: Route, color: "text-primary" },
    { label: "Ateliers suivis (7j)", value: ateliersSuivis, icon: GraduationCap, color: "text-primary" },
    { label: "Projets en cours", value: projetsEnCours, icon: Target, color: "text-primary" },
    { label: "Évidences validées", value: evidencesValidees, icon: FileCheck, color: "text-emerald-400" },
    { label: "Objectifs 90j atteints", value: objectifsAtteints, icon: Zap, color: "text-yellow-400" },
    { label: "Mentors actifs", value: mentorsActifs, icon: HeartHandshake, color: "text-rose-400" },
    { label: "Rétention", value: `${retention30}%`, icon: Shield, color: retention30 >= 70 ? "text-emerald-400" : "text-amber-400", sub: `J30 ${retention30}% · J60 ${retention60}% · J90 ${retention90}%` },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} />
      ))}
    </div>
  )
}

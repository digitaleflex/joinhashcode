import type { ComponentType } from "react"
import { Layout, Target, FileText, Compass, ClipboardCheck } from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  tooltip: string
}

// Pivot Pipeline Cyber (DOCS/PIVOT_CYBER.md) — nav réorientée :
// Parcours → Labs → Portfolio → Vivier. Les entrées gelées (/ateliers, /guide,
// /squad, /leaderboard) sont retirées de la navigation.
export const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Mon Parcours", icon: Layout, tooltip: "Ta prochaine étape du parcours." },
  { href: "/missions", label: "Labs", icon: Target, tooltip: "Les labs de la filière cyber : prouve tes compétences." },
  { href: "/academy", label: "Parcours", icon: ClipboardCheck, tooltip: "Ton parcours N0→N1 : fiches méthode et étapes." },
  { href: "/dossier", label: "Portfolio", icon: FileText, tooltip: "Tes evidences et livrables vérifiés." },
  { href: "/talents", label: "Vivier", icon: Compass, tooltip: "Le vivier d'analystes HashCode." },
]

// Anciennes entrées gelées (référence Vague 5) :
// /ateliers — ateliers multi-domaines, fusionné dans le parcours
// /guide — guide de l'Agent (XP/squads), hors vision

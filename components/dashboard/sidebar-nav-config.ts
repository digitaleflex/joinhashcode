import type { ComponentType } from "react"
import { Layout, Target, FileText, ClipboardCheck } from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  tooltip: string
}

// Navigation membre alignée sur D-024 et D-030 : Parcours → Labs → Portfolio.
// Les entrées gelées (/guide, /squad, /leaderboard) restent hors navigation.
export const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Mon Parcours", icon: Layout, tooltip: "Ta prochaine étape du parcours." },
  { href: "/missions", label: "Labs", icon: Target, tooltip: "Les Labs des trois domaines : livre une action concrète et fais-la valider." },
  { href: "/academy", label: "Parcours", icon: ClipboardCheck, tooltip: "Ton parcours d'apprentissage : étapes, ressources et progression." },
  { href: "/dossier", label: "Portfolio", icon: FileText, tooltip: "Tes preuves de compétence et livrables vérifiés." },
]

// Anciennes entrées gelées (référence Vague 5) :
// /ateliers — ateliers multi-domaines, fusionné dans le parcours
// /guide — guide de l'Agent (XP/squads), hors vision

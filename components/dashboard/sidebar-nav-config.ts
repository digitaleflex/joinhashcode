import type { ComponentType } from "react"
import { Layout, Target, FileText, Compass, BookOpen, GraduationCap } from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  tooltip: string
}

export const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Console", icon: Layout, tooltip: "Accède à ton centre de commande et ton résumé d'activité." },
  { href: "/missions", label: "Missions", icon: Target, tooltip: "Relève des défis techniques réels pour booster ton XP." },
  { href: "/ateliers", label: "Ateliers", icon: GraduationCap, tooltip: "Explore les ateliers pour démarrer ta spécialisation." },
  { href: "/dossier", label: "Mon Dossier", icon: FileText, tooltip: "Consulte ton portfolio, tes badges et ton radar de compétences." },
  { href: "/talents", label: "Membres", icon: Compass, tooltip: "Consulte l'annuaire de tous les membres de HASHCODE." },
  { href: "/guide", label: "Guide de l'Agent", icon: BookOpen, tooltip: "Consulte les règles, le radar psychométrique et le fonctionnement de HASHCODE." },
]

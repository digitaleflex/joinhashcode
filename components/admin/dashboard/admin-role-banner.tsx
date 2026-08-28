import { BrainCircuit, Shield } from "lucide-react"

const roleConfig: Record<string, { label: string; description: string; icon: React.ElementType; accent: string }> = {
  ADMIN: {
    label: "Super Admin",
    description: "Pilotage global — tous les modules disponibles",
    icon: Shield,
    accent: "text-primary",
  },
  MODERATOR: {
    label: "Product Admin",
    description: "Pilotage de la progression — Dashboard, Talents, CORE, Analytics",
    icon: BrainCircuit,
    accent: "text-[#22D3EE]",
  },
}

export async function AdminRoleBanner({ role }: { role: string }) {
  const config = roleConfig[role] ?? roleConfig.ADMIN
  const Icon = config.icon

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-3">
            <Icon className={`h-6 w-6 ${config.accent}`} />
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            {config.description}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-zinc-900/60">
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${config.accent}`}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  )
}

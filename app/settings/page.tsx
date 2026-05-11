import { Nav } from "@/components/landing/nav"
import { Settings, User, ShieldCheck, Bell, Trash2 } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-10">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Configuration Système</h1>
        </div>

        <div className="grid gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border/50 flex flex-col sm:flex-row gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Profil Holographique</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Les modules de modification de profil sont actuellement verrouillés pendant la phase d'initialisation.
              </p>
              <div className="h-10 bg-muted/30 rounded-lg border border-border/40 w-full max-w-md animate-pulse" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 flex flex-col sm:flex-row gap-6 opacity-75">
            <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Sécurité & Authentification</h2>
              <p className="text-sm text-muted-foreground">
                Gérez vos méthodes de connexion, la double authentification (2FA) et les sessions actives.
              </p>
              <div className="mt-4 inline-block px-3 py-1 bg-background border border-border rounded text-xs font-mono">
                STATUT: SÉCURISÉ
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 flex flex-col sm:flex-row gap-6 opacity-75">
            <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Centre de Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Définissez comment le système interagit avec vous. Emails, alertes In-App, Pings de Guilde.
              </p>
            </div>
          </div>

          <div className="mt-10 p-8 rounded-2xl border border-destructive/20 bg-destructive/5 space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <Trash2 className="w-5 h-5" />
              <h2 className="text-xl font-semibold uppercase tracking-tight font-mono">Droit à l&apos;Oubli</h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              La suppression de votre compte est irréversible. Toutes vos données comportementales, votre progression dans les missions et votre Confidence Score seront définitivement purgés de nos systèmes.
            </p>
            <button className="px-5 py-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold uppercase tracking-widest hover:bg-destructive hover:text-white transition-all">
              Initialiser la suppression
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

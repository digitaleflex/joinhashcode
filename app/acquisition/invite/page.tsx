import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Invitation WhatsApp — HASHCODE",
  description: "Rejoins le groupe WhatsApp HASHCODE et commence ton évolution.",
}

export default function InvitePage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto size-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <span className="text-3xl">💚</span>
        </div>
        <h1 className="mt-6 font-syne font-extrabold italic tracking-tight text-3xl sm:text-4xl text-foreground">
          Rejoins la communauté
        </h1>
        <p className="mt-3 text-muted-foreground text-base sm:text-lg leading-relaxed">
          Tu es presque là. Ajoute-nous sur WhatsApp pour recevoir ton invitation
          et ton premier challenge.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-card p-6 space-y-4 text-left">
          <div className="flex items-start gap-3">
            <span className="shrink-0 size-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-sm">1</span>
            <div>
              <p className="font-medium text-foreground text-sm">Sauvegarde le numéro</p>
              <p className="text-muted-foreground text-xs mt-0.5">+229 XX XX XX XX (HASHCODE Community)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="shrink-0 size-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-sm">2</span>
            <div>
              <p className="font-medium text-foreground text-sm">Envoie le code de vérification</p>
              <p className="text-muted-foreground text-xs mt-0.5">Tu recevras un code à 6 chiffres.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="shrink-0 size-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-sm">3</span>
            <div>
              <p className="font-medium text-foreground text-sm">Reçois ton accès</p>
              <p className="text-muted-foreground text-xs mt-0.5">Ton profil + premier challenge dans la foulée.</p>
            </div>
          </div>
        </div>

        <Button asChild size="lg" className="mt-8 w-full sm:w-auto">
          <a href="https://wa.me/229XXXXXXXXXX" target="_blank" rel="noopener noreferrer">
            Ouvrir WhatsApp
          </a>
        </Button>

        <p className="mt-4 text-xs text-muted-foreground">
          Zéro spam. Tu peux quitter le groupe à tout moment.
        </p>
      </div>
    </main>
  )
}

import { Button } from "@/components/ui/button"

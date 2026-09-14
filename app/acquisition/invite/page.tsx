import { Metadata } from "next"
import { COMMUNITY_LINKS } from "@/lib/config"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Rejoins la communauté — HASHCODE",
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
          Ton profil est prêt. Rejoins le groupe WhatsApp pour recevoir ton
          parcours et ton premier challenge.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-card p-6 space-y-4 text-left">
          <div className="flex items-start gap-3">
            <span className="shrink-0 size-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-sm">
              1
            </span>
            <div>
              <p className="font-medium text-foreground text-sm">
                Rejoins le groupe WhatsApp
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Un seul clic — aucun numéro à enregistrer.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="shrink-0 size-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-sm">
              2
            </span>
            <div>
              <p className="font-medium text-foreground text-sm">
                Présente-toi au groupe
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Ton domaine et ton objectif, en deux lignes.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="shrink-0 size-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-sm">
              3
            </span>
            <div>
              <p className="font-medium text-foreground text-sm">
                Reçois ton parcours
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Un mentor t&apos;oriente vers les cours adaptés à ton profil.
              </p>
            </div>
          </div>
        </div>

        <Button asChild size="lg" className="mt-8 w-full sm:w-auto">
          <a
            href={COMMUNITY_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            Rejoindre le groupe WhatsApp
          </a>
        </Button>

        <p className="mt-4 text-xs text-muted-foreground">
          Zéro spam. Tu peux quitter le groupe à tout moment.
        </p>
      </div>
    </main>
  )
}

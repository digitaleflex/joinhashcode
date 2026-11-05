"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, MailX, CheckCircle2, AlertTriangle } from "lucide-react"

interface UnsubscribeFormProps {
  u: string
  t: string
  s: string
  valid: boolean
}

export function UnsubscribeForm({ u, t, s, valid }: UnsubscribeFormProps) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    valid ? "idle" : "error",
  )

  const confirm = async () => {
    setState("loading")
    try {
      const res = await fetch("/api/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u, t, s }),
      })
      setState(res.ok ? "done" : "error")
    } catch {
      setState("error")
    }
  }

  if (state === "done") {
    return (
      <div className="space-y-4 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <p className="text-sm text-zinc-300">
          C'est fait. Tu ne recevras plus de relances d'activation.
        </p>
        <p className="text-xs text-zinc-500">
          Les emails indispensables à ton compte (connexion, sécurité) restent
          envoyés.
        </p>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="space-y-4 text-center">
        <AlertTriangle className="mx-auto size-10 text-amber-500" />
        <p className="text-sm text-zinc-300">
          Ce lien est invalide ou a expiré.
        </p>
        <p className="text-xs text-zinc-500">
          Si tu veux te désabonner, réponds directement à l'email reçu.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5 text-center">
      <MailX className="mx-auto size-10 text-zinc-400" />
      <p className="text-sm leading-relaxed text-zinc-300">
        Confirme que tu ne souhaites plus recevoir les relances d'activation
        HASHCODE.
      </p>
      <Button
        onClick={confirm}
        disabled={state === "loading"}
        className="btn-primary-glow h-11 w-full rounded-xl text-sm font-bold uppercase tracking-wider"
      >
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Me désabonner"
        )}
      </Button>
      <p className="text-xs text-zinc-500">
        Les emails indispensables à ton compte (connexion, sécurité) ne sont pas
        concernés.
      </p>
    </div>
  )
}

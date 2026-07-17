"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Loader2, Users, CheckCircle2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function AcceptInvitationClient({
  invitationId,
  squadName,
  squadDescription,
  squadSlug,
}: {
  invitationId: string
  squadName: string
  squadDescription: string | null
  squadSlug: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleAccept = async () => {
    setStatus("loading")
    try {
      const { error } = await authClient.organization.acceptInvitation({ invitationId })
      if (error) throw new Error(error.message || "Erreur lors de l'acceptation.")
      setStatus("success")
      setTimeout(() => router.push("/squad"), 1500)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue")
      setStatus("error")
    }
  }

  const handleReject = async () => {
    setStatus("loading")
    try {
      await authClient.organization.rejectInvitation({ invitationId })
      router.push("/squad")
    } catch {
      router.push("/squad")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <Users className="size-7 text-primary" />
            </div>
          </div>

          {status === "success" ? (
            <div className="space-y-2">
              <CheckCircle2 className="size-10 text-emerald-400 mx-auto" />
              <h2 className="text-lg font-bold text-white uppercase tracking-tight">Bienvenue dans l&apos;escouade !</h2>
              <p className="text-xs text-zinc-500 font-mono">Redirection en cours...</p>
            </div>
          ) : status === "error" ? (
            <div className="space-y-3">
              <XCircle className="size-10 text-red-400 mx-auto" />
              <h2 className="text-lg font-bold text-white">Erreur</h2>
              <p className="text-sm text-red-400">{errorMsg}</p>
              <Button variant="outline" className="border-white/10 w-full" onClick={() => router.push("/squad")}>
                Retour
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Invitation à rejoindre</p>
                <h2 className="text-2xl font-extrabold text-white uppercase italic tracking-tight">{squadName}</h2>
                {squadDescription && (
                  <p className="text-sm text-zinc-400 leading-relaxed">{squadDescription}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleAccept}
                  disabled={status === "loading"}
                  className="w-full h-12 btn-primary-glow font-bold uppercase tracking-wide"
                >
                  {status === "loading" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Rejoindre l'escouade"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleReject}
                  disabled={status === "loading"}
                  className="w-full text-zinc-500 hover:text-zinc-300 text-sm"
                >
                  Refuser
                </Button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-[10px] font-mono text-zinc-700">
          HASHCODE · Protocol_Escouade
        </p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"

interface SquadDisbandPanelProps {
  localName: string
}

export function SquadDisbandPanel({ localName }: SquadDisbandPanelProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isDisbanding, setIsDisbanding] = useState(false)

  const disbandSquad = async () => {
    setIsDisbanding(true)
    try {
      const res = await fetch("/api/squad/disband", { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      toast.success("Escouade dissoute.")
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la dissolution.")
    } finally {
      setIsDisbanding(false)
      setOpen(false)
    }
  }

  return (
    <>
      <div className="rounded-3xl border border-red-500/15 bg-red-500/3 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-3.5 text-red-400" />
          <span className="text-[10px] font-mono font-bold text-red-400/70 uppercase tracking-wider">Zone de danger</span>
        </div>
        <Button
          variant="outline"
          className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10"
          onClick={() => setOpen(true)}
        >
          Dissoudre l&apos;escouade
        </Button>
      </div>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Dissoudre l&apos;escouade"
        description={`Tous les membres seront retirés. La cohésion, le streak et l&apos;historique seront perdus définitivement.`}
        confirmText={isDisbanding ? "Dissolution..." : "Dissoudre"}
        cancelText="Annuler"
        variant="destructive"
        onConfirm={disbandSquad}
      />
    </>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SquadDisbandPanelProps {
  localName: string
}

export function SquadDisbandPanel({ localName }: SquadDisbandPanelProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isDisbanding, setIsDisbanding] = useState(false)

  const disbandSquad = async () => {
    setIsDisbanding(true)
    try {
      const res = await fetch("/api/squad/disband", { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      toast.success("Escouade dissoute.")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la dissolution.")
    } finally {
      setIsDisbanding(false)
      setShowModal(false)
    }
  }

  return (
    <>
      <div className="rounded-3xl border border-red-500/15 bg-red-500/3 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-3.5 text-red-400" />
          <span className="text-[9px] font-mono font-bold text-red-400/70 uppercase tracking-wider">Zone de danger</span>
        </div>
        <button
          onClick={() => { setShowModal(true); setConfirmText("") }}
          className="w-full text-[11px] font-mono font-bold text-red-400 border border-red-500/20 rounded-xl py-2 hover:bg-red-500/10 transition-colors"
        >
          Dissoudre l&apos;escouade
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-red-500/20 bg-zinc-950 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="size-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Dissoudre l&apos;escouade</h3>
                <p className="text-[11px] text-zinc-500 font-mono">Action irréversible</p>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Tous les membres seront retirés. La cohésion, le streak et l&apos;historique seront perdus définitivement.
            </p>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Tape <span className="text-red-400 font-bold">{localName}</span> pour confirmer
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500/40 transition-colors"
                placeholder={localName}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-white/10 text-zinc-400" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={disbandSquad}
                disabled={isDisbanding || confirmText !== localName}
              >
                {isDisbanding ? <Loader2 className="size-4 animate-spin" /> : "Dissoudre"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

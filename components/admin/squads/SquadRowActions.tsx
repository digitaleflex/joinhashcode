"use client"

import { useState } from "react"
import { MoreHorizontal, ShieldAlert, Crown, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SquadRowActionsProps {
  squad: {
    id: string
    name: string
    members: {
      id: string
      role: string
      user: {
        id: string
        name: string
        pseudo: string | null
      }
    }[]
  }
}

export function SquadRowActions({ squad }: SquadRowActionsProps) {
  const [isDisbandDialogOpen, setIsDisbandDialogOpen] = useState(false)
  const [disbandConfirmText, setDisbandConfirmText] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)

  const handleTransferLeadership = async (memberId: string, memberName: string) => {
    setIsTransferring(true)
    try {
      const res = await fetch("/api/admin/squads/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: squad.id, targetMemberId: memberId })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Erreur lors du transfert.")
      }
      toast.success(`Leadership transféré à ${memberName}`)
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsTransferring(false)
    }
  }

  const handleDisband = async () => {
    setIsPending(true)
    try {
      const res = await fetch("/api/admin/squads/disband", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: squad.id })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Erreur lors de la dissolution.")
      }
      toast.success("Escouade dissoute (Force admin)")
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsPending(false)
      setIsDisbandDialogOpen(false)
    }
  }

  const currentLeader = squad.members.find(m => m.role === "owner" || m.role === "LEADER")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/5">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10 text-zinc-400">
          <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Force Admin
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/5" />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:bg-white/5 cursor-pointer">
              <Crown className="mr-2 h-4 w-4" />
              <span>Transférer le Leader</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-zinc-950 border-white/10 text-zinc-400">
                {squad.members.map(member => (
                  <DropdownMenuItem 
                    key={member.id}
                    disabled={member.id === currentLeader?.id || isTransferring}
                    onClick={() => handleTransferLeadership(member.id, member.user.pseudo || member.user.name)} 
                    className="hover:bg-primary/10 hover:text-primary cursor-pointer disabled:opacity-50"
                  >
                    {member.user.pseudo || member.user.name}
                    {member.id === currentLeader?.id && " (Actuel)"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem 
            onClick={() => { setIsDisbandDialogOpen(true); setDisbandConfirmText("") }} 
            className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer mt-1"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Dissoudre l'Escouade</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDisbandDialogOpen} onOpenChange={setIsDisbandDialogOpen}>
        <DialogContent className="bg-zinc-950 border-red-500/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <ShieldAlert className="size-5 text-red-500" />
              Dissolution Forcée (Admin)
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Vous êtes sur le point de supprimer l'escouade <strong className="text-white">{squad.name}</strong>. Tous ses membres perdront leur progression de groupe.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-zinc-400">
                Tapez <span className="text-red-400 font-mono select-none">{squad.name}</span> pour confirmer
              </Label>
              <Input
                id="reason"
                value={disbandConfirmText}
                onChange={(e) => setDisbandConfirmText(e.target.value)}
                placeholder={squad.name}
                className="bg-zinc-900 border-white/5 text-white font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDisbandDialogOpen(false)} className="text-zinc-400 hover:bg-white/5">
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDisband} 
              disabled={isPending || disbandConfirmText !== squad.name}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {isPending ? "Exécution..." : "Confirmer la Dissolution"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

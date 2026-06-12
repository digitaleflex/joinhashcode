"use client"

import { useState } from "react"
import { MoreHorizontal, Shield, Ban, UserCheck, LogIn } from "lucide-react"
import { authClient } from "@/lib/auth-client"
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

interface UserRowActionsProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    banned?: boolean | null
  }
}

export function UserRowActions({ user }: UserRowActionsProps) {
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
  const [banReason, setBanReason] = useState("")
  const [isPending, setIsPending] = useState(false)

  const handleSetRole = async (role: string) => {
    try {
      await authClient.admin.setRole({
        userId: user.id,
        role: role as any,
      })
      
      await fetch("/api/admin/log", {
        method: "POST",
        body: JSON.stringify({
          action: "ADMIN_ROLE_UPDATED",
          entityId: user.id,
          metadata: { targetEmail: user.email, newRole: role }
        })
      });

      toast.success(`Rôle mis à jour : ${role}`)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du rôle")
    }
  }

  const handleBanUser = async () => {
    setIsPending(true)
    try {
      await authClient.admin.banUser({
        userId: user.id,
        banReason: banReason,
      })

      await fetch("/api/admin/log", {
        method: "POST",
        body: JSON.stringify({
          action: "ADMIN_USER_BANNED",
          entityId: user.id,
          metadata: { targetEmail: user.email, reason: banReason }
        })
      });

      toast.success("Utilisateur banni")
      setIsBanDialogOpen(false)
    } catch (error) {
      toast.error("Erreur lors du bannissement")
    } finally {
      setIsPending(false)
    }
  }

  const handleUnbanUser = async () => {
    try {
      await authClient.admin.unbanUser({
        userId: user.id,
      })

      await fetch("/api/admin/log", {
        method: "POST",
        body: JSON.stringify({
          action: "ADMIN_USER_UNBANNED",
          entityId: user.id,
          metadata: { targetEmail: user.email }
        })
      });

      toast.success("Utilisateur débanni")
    } catch (error) {
      toast.error("Erreur lors du débannissement")
    }
  }

  const handleImpersonate = async () => {
    try {
      await authClient.admin.impersonate({
        userId: user.id,
      })

      await fetch("/api/admin/log", {
        method: "POST",
        body: JSON.stringify({
          action: "ADMIN_USER_IMPERSONATED",
          entityId: user.id,
          metadata: { targetEmail: user.email }
        })
      });

      toast.success(`Impersonification de ${user.name}`)
      window.location.href = "/dashboard"
    } catch (error) {
      toast.error("Erreur d'impersonification")
    }
  }

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
          <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleImpersonate} className="hover:bg-primary/10 hover:text-primary cursor-pointer">
            <LogIn className="mr-2 h-4 w-4" />
            <span>Impersonner</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/5" />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:bg-white/5 cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Changer le rôle</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-zinc-950 border-white/10 text-zinc-400">
                <DropdownMenuItem onClick={() => handleSetRole("ADMIN")} className="hover:bg-primary/10 hover:text-primary cursor-pointer">
                  ADMIN
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetRole("MODERATOR")} className="hover:bg-primary/10 hover:text-primary cursor-pointer">
                  MODERATOR
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetRole("MEMBER")} className="hover:bg-primary/10 hover:text-primary cursor-pointer">
                  MEMBER
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {user.banned ? (
            <DropdownMenuItem onClick={handleUnbanUser} className="text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer">
              <UserCheck className="mr-2 h-4 w-4" />
              <span>Débannir</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setIsBanDialogOpen(true)} className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer">
              <Ban className="mr-2 h-4 w-4" />
              <span>Bannir</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Bannir l'utilisateur</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Veuillez fournir une raison pour le bannissement de {user.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-zinc-400">Raison</Label>
              <Input
                id="reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Violation des règles de la communauté"
                className="bg-zinc-900 border-white/5 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsBanDialogOpen(false)} className="text-zinc-400 hover:bg-white/5">
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleBanUser} 
              disabled={isPending || !banReason}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isPending ? "Bannissement..." : "Bannir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

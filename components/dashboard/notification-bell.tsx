"use client"

import { Bell, CheckCircle, Info, AlertTriangle, Star, Users, Zap, Activity, Mail, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const iconMap: Record<string, any> = {
  MISSION_APPROVED: CheckCircle,
  LEVEL_UP: Star,
  DAILY_REMINDER: Info,
  SYSTEM: AlertTriangle,
  SQUAD_COHESION_LOW: Users,
  SQUAD_COHESION_CRITICAL: AlertTriangle,
  SQUAD_COHESION_MAX: Zap,
  SQUAD_MEMBER_CHECKIN: Activity,
  SQUAD_STREAK_3: Zap,
  SQUAD_STREAK_7: Zap,
  STREAK_MILESTONE: Star,
  STREAK_BROKEN: Info,
  SQUAD_INVITATION: Mail,
}

export function NotificationBell() {
  const queryClient = useQueryClient()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetcher("/api/user/notifications"),
    refetchInterval: 30_000,
  })

  const markAllRead = useMutation({
    mutationFn: () => fetch("/api/user/notifications", { method: "PATCH" }).then(r => r.json()),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] })
      const prev = queryClient.getQueryData(["notifications"])
      queryClient.setQueryData(["notifications"], (old: any) => ({
        ...old,
        unreadCount: 0,
        notifications: old?.notifications?.map((n: any) => ({ ...n, isRead: true })) ?? [],
      }))
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["notifications"], ctx?.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })

  const handleSquadInvitation = async (invitationId: string, action: 'accept' | 'reject', notificationId: string) => {
    setProcessingId(notificationId)
    try {
      if (action === 'accept') {
        const { error } = await authClient.organization.acceptInvitation({ invitationId })
        if (error) throw new Error(error.message || "Erreur lors de l'acceptation.")
        toast.success("Bienvenue dans l'escouade !")
      } else {
        await authClient.organization.rejectInvitation({ invitationId })
        toast.info("Invitation refusée.")
      }
      
      // Invalidate both notifications and potential squad data
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      // If there's a specific squad query, it should be invalidated here too
      // queryClient.invalidateQueries({ queryKey: ["squad"] })
      
      // Optionally mark this specific notification as read or delete it
      // For simplicity, we just refetch everything
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue")
    } finally {
      setProcessingId(null)
    }
  }

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]"
            >
              <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-card/95 backdrop-blur-xl border-border/40 rounded-2xl p-2 z-50">
        <div className="flex items-center justify-between p-3">
          <DropdownMenuLabel className="font-mono text-[10px] uppercase text-muted-foreground p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={(e) => { e.preventDefault(); markAllRead.mutate() }}
              className="text-[10px] text-primary hover:underline font-medium"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-border/40" />
        <div className="max-h-[400px] overflow-y-auto scrollbar-none">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center text-sm text-muted-foreground"
              >
                Aucune notification pour le moment.
              </motion.div>
            ) : (
              notifications.map((notif: any) => {
                const Icon = iconMap[notif.type] || Info
                const isInvitation = notif.type === "SQUAD_INVITATION"
                const invitationId = notif.link?.split("id=")[1]
                const isProcessing = processingId === notif.id

                return (
                  <DropdownMenuItem
                    key={notif.id}
                    className="rounded-xl focus:bg-primary/10 p-3 flex flex-col gap-2 cursor-default outline-none border border-transparent focus:border-primary/20 transition-all mb-1"
                    onSelect={(e) => {
                        // Prevent closing the menu when clicking anywhere on the invitation item
                        if (isInvitation) e.preventDefault();
                    }}
                  >
                    <div 
                      className="flex gap-3 w-full" 
                      onClick={(e) => { 
                        if (isInvitation) {
                          e.stopPropagation(); // Prevent trigger menu close
                        } else if (notif.link) {
                          window.location.href = notif.link;
                        }
                      }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.isRead ? "bg-muted/50" : "bg-primary/20 text-primary"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-1 overflow-hidden flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-semibold truncate ${notif.isRead ? "text-muted-foreground" : "text-white"}`}>
                            {notif.title}
                          </p>
                          {!notif.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">{notif.message}</p>
                        <p className="text-[9px] text-muted-foreground font-mono mt-0.5">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                    </div>

                    {isInvitation && invitationId && (
                      <div className="flex items-center gap-2 mt-1 w-full pl-11">
                        <Button
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleSquadInvitation(invitationId, 'accept', notif.id)}
                          className="h-7 px-3 bg-primary/20 hover:bg-primary text-primary hover:text-black text-[9px] font-black uppercase rounded-lg transition-all flex-1"
                        >
                          {isProcessing ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3 mr-1" />}
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isProcessing}
                          onClick={() => handleSquadInvitation(invitationId, 'reject', notif.id)}
                          className="h-7 px-3 hover:bg-destructive/20 text-muted-foreground hover:text-destructive text-[9px] font-bold uppercase rounded-lg transition-all"
                        >
                          {isProcessing ? <Loader2 className="size-3 animate-spin" /> : <X className="size-3 mr-1" />}
                          Refuser
                        </Button>
                      </div>
                    )}
                  </DropdownMenuItem>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

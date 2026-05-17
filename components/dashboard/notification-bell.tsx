"use client"

import { Bell, CheckCircle, Info, AlertTriangle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { motion } from "framer-motion"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const iconMap: Record<string, any> = {
  MISSION_APPROVED: CheckCircle,
  LEVEL_UP: Star,
  DAILY_REMINDER: Info,
  SYSTEM: AlertTriangle,
}

export function NotificationBell() {
  const { data, mutate } = useSWR("/api/user/notifications", fetcher, {
    refreshInterval: 60000, // Refresh every minute
  })

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || 0

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/user/notifications", { method: "PATCH" })
      if (response.ok) {
        mutate({ ...data, unreadCount: 0, notifications: notifications.map((n: any) => ({ ...n, isRead: true })) }, false)
      }
    } catch (error) {
      console.error("Failed to mark notifications as read", error)
    }
  }

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
              <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></span>
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-card/95 backdrop-blur-xl border-border/40 rounded-2xl p-2 z-50">
        <div className="flex items-center justify-between p-3">
          <DropdownMenuLabel className="font-mono text-[10px] uppercase text-muted-foreground p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button 
              onClick={(e) => {
                e.preventDefault()
                markAllAsRead()
              }}
              className="text-[10px] text-primary hover:underline font-medium"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-border/40" />
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Aucune notification pour le moment.
            </div>
          ) : (
            notifications.map((notif: any) => {
              const Icon = iconMap[notif.type] || Info
              return (
                <DropdownMenuItem 
                  key={notif.id} 
                  className="rounded-xl focus:bg-primary/10 p-3 flex gap-3 cursor-pointer outline-none"
                  onSelect={(e) => {
                    if (notif.link) {
                      window.location.href = notif.link
                    }
                  }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-muted/50' : 'bg-primary/20 text-primary'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <p className={`text-xs font-semibold truncate ${notif.isRead ? 'text-muted-foreground' : 'text-white'}`}>
                      {notif.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-mono">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 self-center" />
                  )}
                </DropdownMenuItem>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

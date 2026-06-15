"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, Loader2, User as UserIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { motion } from "framer-motion"
import Image from "next/image"
import { toast } from "sonner"
import { useMobile } from "@/hooks/use-mobile"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const fetchMessages = () => fetch("/api/squad/messages").then((res) => res.json())

export function SquadChatWidget({ userId }: { userId: string }) {
  const isMobile = useMobile()
  const queryClient = useQueryClient()
  const [content, setContent] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [lastViewedAt, setLastViewedAt] = useState<string | null>(null)

  // Load lastViewedAt from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`squad_chat_last_viewed_${userId}`)
    if (saved) setLastViewedAt(saved)
  }, [userId])

  const { data, isLoading } = useQuery({
    queryKey: ["squad-messages"],
    queryFn: fetchMessages,
    refetchInterval: isOpen ? 3000 : 10000, 
    enabled: !!userId,
  })

  const messages = data?.messages ?? []
  
  // Logic for unread indicator
  const hasUnread = messages.length > 0 && (!lastViewedAt || new Date(messages[messages.length - 1].createdAt) > new Date(lastViewedAt))

  // Update lastViewedAt when chat is opened
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      const now = new Date().toISOString()
      setLastViewedAt(now)
      localStorage.setItem(`squad_chat_last_viewed_${userId}`, now)
    }
  }, [isOpen, messages, userId])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const sendMessage = useMutation({
    mutationFn: (newContent: string) =>
      fetch("/api/squad/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      }).then((r) => r.json()),
    onMutate: async (newContent) => {
      await queryClient.cancelQueries({ queryKey: ["squad-messages"] })
      const previousMessages = queryClient.getQueryData(["squad-messages"])
      
      queryClient.setQueryData(["squad-messages"], (old: any) => ({
        ...old,
        messages: [
          ...(old?.messages ?? []),
          {
            id: "temp-" + Date.now(),
            content: newContent,
            userId,
            createdAt: new Date().toISOString(),
            user: { id: userId, name: "Moi", pseudo: "Moi", image: null },
            isOptimistic: true,
          },
        ],
      }))
      
      return { previousMessages }
    },
    onError: (err, _newContent, context) => {
      queryClient.setQueryData(["squad-messages"], context?.previousMessages)
      toast.error("Échec de l'envoi")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["squad-messages"] })
    },
  })

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!content.trim() || sendMessage.isPending) return
    sendMessage.mutate(content.trim())
    setContent("")
  }

  const ChatContent = (
    <div className="flex flex-col h-full bg-card/95 backdrop-blur-xl border-border/40 rounded-t-3xl sm:rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
        <h3 className="text-[10px] font-mono font-black uppercase text-primary tracking-widest flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-primary animate-pulse" />
          Canal Tactique Escouade
        </h3>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full size-8">
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none"
      >
        {isLoading && messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="size-6 text-primary animate-spin opacity-20" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <MessageSquare className="size-12 mb-4" />
            <p className="text-[10px] font-mono uppercase">Aucune transmission détectée.</p>
            <p className="text-[9px] mt-1 italic">Soyez le premier à envoyer un message.</p>
          </div>
        ) : (
          messages.map((msg: any) => {
            const isMe = msg.userId === userId
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/20">
                  {msg.user?.image ? (
                    <Image src={msg.user.image} alt={msg.user.name} width={32} height={32} />
                  ) : (
                    <UserIcon className="size-4 text-muted-foreground" />
                  )}
                </div>
                <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">{msg.user?.pseudo || msg.user?.name?.split(' ')[0]}</span>
                    <span className="text-[8px] font-mono text-zinc-600">
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                  <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    isMe 
                      ? "bg-primary text-black font-medium rounded-tr-none" 
                      : "bg-muted text-white rounded-tl-none border border-border/20"
                  } ${msg.isOptimistic ? "opacity-70 italic" : ""}`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-muted/30 border-t border-border/40 flex items-center gap-2 mb-safe">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 bg-background/50 border border-border/20 h-10 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!content.trim() || sendMessage.isPending}
          className="rounded-xl size-10 bg-primary hover:bg-primary/80 text-black shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.3)]"
        >
          {sendMessage.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  )

  const TriggerButton = (
    <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
      <MessageSquare className="w-5 h-5" />
      {hasUnread && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
      )}
    </Button>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          {TriggerButton}
        </DrawerTrigger>
        <DrawerContent className="h-[85vh] bg-transparent border-none p-0 focus:outline-none">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Chat d'Escouade</DrawerTitle>
          </DrawerHeader>
          {ChatContent}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 overflow-hidden z-50 h-[500px] border-none bg-transparent shadow-2xl">
        {ChatContent}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

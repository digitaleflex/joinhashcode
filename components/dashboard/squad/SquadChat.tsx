"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MessageSquare, Send, Trash2, Loader2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ChatMessage {
  id: string
  content: string
  userId: string
  organizationId: string
  createdAt: string
  user: {
    id: string
    name: string
    image: string | null
    pseudo: string | null
  }
}

interface SquadChatProps {
  organizationId: string
  userId: string
  userRole?: string
}

export function SquadChat({ organizationId, userId, userRole = "member" }: SquadChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const isModerator = userRole === "owner" || userRole === "admin"

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/squad/message?organizationId=${organizationId}&limit=50`)
      if (!res.ok) return
      const data = await res.json()
      setMessages(data.messages || [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 15000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return
    setSending(true)
    setInput("")
    try {
      const res = await fetch("/api/squad/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, organizationId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Erreur")
      }
      const data = await res.json()
      setMessages((prev) => [...prev, data.message])
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'envoi")
      setInput(text)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const deleteMessage = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/squad/message?id=${id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Erreur")
      }
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression")
    } finally {
      setDeletingId(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="rounded-3xl border border-white/5 bg-zinc-900/60 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
        <MessageSquare className="size-4 text-primary" />
        <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wide">Chat Escouade</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px] scrollbar-thin">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="size-5 text-zinc-600 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <MessageSquare className="size-8 text-zinc-700" />
            <p className="text-[11px] text-zinc-600 font-mono">Aucun message pour le moment</p>
            <p className="text-[10px] text-zinc-700">Sois le premier à écrire dans le canal !</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.userId === userId
            return (
              <div
                key={msg.id}
                className={cn("flex gap-3 group", isOwn && "flex-row-reverse")}
              >
                <div className="size-7 rounded-full bg-zinc-800 border border-white/5 overflow-hidden shrink-0 mt-0.5">
                  {msg.user.image ? (
                    <img src={msg.user.image} alt="" className="size-full object-cover" />
                  ) : (
                    <div className="size-full flex items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">
                      {msg.user.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className={cn("space-y-1 max-w-[80%]", isOwn && "items-end flex flex-col")}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 font-mono">
                      {msg.user.pseudo || msg.user.name}
                    </span>
                    <span className="text-[9px] text-zinc-700 flex items-center gap-1">
                      <Clock className="size-2.5" />
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 text-sm leading-relaxed break-words",
                      isOwn
                        ? "bg-primary/10 border border-primary/20 text-white"
                        : "bg-zinc-950/60 border border-white/5 text-zinc-300"
                    )}
                  >
                    {msg.content}
                  </div>
                  {(isOwn || isModerator) && (
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      disabled={deletingId === msg.id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-red-500 hover:text-red-400 font-mono flex items-center gap-1"
                    >
                      {deletingId === msg.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Trash2 className="size-3" />
                      )}
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/5 p-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écris un message..."
            rows={1}
            maxLength={2000}
            className="flex-1 bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 resize-none outline-none focus:border-primary/40 transition-colors font-mono"
          />
          <Button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            size="icon"
            className="size-11 rounded-xl bg-primary text-black hover:bg-primary/90 shrink-0"
          >
            {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
        <p className="text-[9px] text-zinc-700 mt-2 font-mono">Entrée pour envoyer · Shift+Entrée pour sauter une ligne</p>
      </div>
    </div>
  )
}

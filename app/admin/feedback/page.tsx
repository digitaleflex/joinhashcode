import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { MessageSquare, AlertTriangle, Lightbulb, User, Clock, Paperclip } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { FeedbackStatusToggle } from "./status-toggle"

export default async function AdminFeedbackPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/signin")

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) redirect("/dashboard")

  const feedbacks = await prisma.betaFeedback.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          class: true,
        }
      }
    }
  })

  const typeIcons: Record<string, any> = {
    BUG: { icon: AlertTriangle, color: "text-red-500", label: "Bug" },
    FEATURE_REQUEST: { icon: Lightbulb, color: "text-blue-500", label: "Idée" },
    GENERAL: { icon: MessageSquare, color: "text-zinc-500", label: "Général" },
  }

  const statusColors: Record<string, string> = {
    NEW: "bg-red-500/10 text-red-500 border-red-500/20",
    REVIEWED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-lg font-bold tracking-tight text-white">Feedback</h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Retours & suggestions bêta</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-primary">{feedbacks.length}</div>
          <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">total</div>
        </div>
      </div>

      <div className="grid gap-4">
        {feedbacks.map((f) => {
          const type = typeIcons[f.type] || typeIcons.GENERAL
          const Icon = type.icon

          return (
            <div key={f.id} className="group relative rounded-2xl border border-white/5 bg-zinc-900/40 p-6 transition-all hover:bg-zinc-900/60 hover:border-white/10">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column: Type & Status */}
                <div className="flex md:flex-col gap-3 md:w-32 shrink-0">
                   <div className={`flex items-center gap-2 ${type.color}`}>
                     <Icon className="size-4" />
                     <span className="text-[10px] font-black uppercase tracking-wider">{type.label}</span>
                   </div>
                   <Badge className={`w-fit text-[9px] uppercase font-bold ${statusColors[f.status]}`}>
                     {f.status}
                   </Badge>
                </div>

                {/* Middle Column: Content */}
                <div className="flex-1 space-y-4">
                  <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap italic">
                    &quot;{f.content}&quot;
                  </p>
                  
                  {f.attachmentUrl && (
                    <div className="pt-1">
                      <a
                        href={f.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all font-mono text-[9px] uppercase tracking-wider"
                      >
                        <Paperclip className="size-3.5" />
                        Voir la pièce jointe
                      </a>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-zinc-500 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-1.5">
                      <User className="size-3" />
                      <span className="text-zinc-300">{f.user.name}</span>
                      <span className="text-zinc-600">({f.user.email})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3" />
                      <span>{formatDistanceToNow(new Date(f.createdAt), { addSuffix: true, locale: fr })}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Actions */}
                <div className="flex items-start justify-end shrink-0">
                  <FeedbackStatusToggle id={f.id} currentStatus={f.status} />
                </div>
              </div>
            </div>
          )
        })}

        {feedbacks.length === 0 && (
          <div className="py-20 text-center rounded-3xl border border-dashed border-white/5">
            <MessageSquare className="size-10 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500 font-mono text-sm uppercase tracking-wide">Aucun feedback reçu pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}

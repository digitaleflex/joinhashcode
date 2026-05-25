"use client"

import { Construction, Mail, Info } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DevNoticeProps {
  title?: string;
  className?: string;
}

export function DevNotice({ title, className }: DevNoticeProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl border border-dashed border-primary/20 bg-primary/[0.02] p-8 flex flex-col items-center justify-center text-center space-y-4 group",
      className
    )}>
      {/* Animated background element */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,244,65,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative">
        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 mx-auto border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
          <Construction className="size-6" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">
            {title || "Fonctionnalité en cours"}
          </h3>
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-primary/60 uppercase tracking-tighter">
            <span className="size-1 bg-primary rounded-full animate-ping" />
            System_Build_In_Progress
          </div>
        </div>
      </div>

      <div className="relative max-w-sm space-y-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Cette fonctionnalité est en cours de développement par l&apos;équipe <span className="text-white font-bold tracking-tighter italic">HASHCODE</span>. Nos ingénieurs finalisent les protocoles de transmission.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-medium text-zinc-400">
          <Mail className="size-3 text-primary" />
          Tu recevras une notification par e-mail dès l&apos;activation.
        </div>
      </div>

      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
        <Info className="size-4" />
      </div>
    </div>
  )
}

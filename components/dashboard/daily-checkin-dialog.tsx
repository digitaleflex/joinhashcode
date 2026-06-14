"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { DailyCheckinWidget } from "./daily-checkin-widget"

export function DailyCheckinDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-start gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary h-9 rounded-xl px-3 group"
          >
            <Zap className="size-4 group-hover:animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Neural Check-in</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/5 p-0 overflow-hidden rounded-[2rem]">
        <DailyCheckinWidget isModal onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

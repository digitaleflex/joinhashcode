"use client"

import { MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function FloatingFeedbackButton() {
    const pathname = usePathname()
    
    // Don't show the button on the feedback page itself
    if (pathname === "/feedback") return null

    return (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
            <Button
                asChild
                className="pointer-events-auto h-12 w-12 sm:w-auto sm:px-4 rounded-full btn-primary-glow shadow-[0_0_20px_rgba(197,244,65,0.3)] transition-all hover:scale-105 active:scale-95"
            >
                <Link href="/feedback">
                    <MessageSquarePlus className="size-5 sm:mr-2" />
                    <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">
                        Donner mon avis
                    </span>
                </Link>
            </Button>
        </div>
    )
}

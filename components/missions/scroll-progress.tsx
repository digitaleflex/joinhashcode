"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollProgressProps {
  targetRef: React.RefObject<HTMLElement | null>
  className?: string
}

export function ScrollProgress({ targetRef, className }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const handleScroll = () => {
      const rect = target.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const targetTop = rect.top
      const targetHeight = rect.height

      // Progress: 0 when target bottom hits window bottom, 1 when target top hits window top
      const totalScrollDistance = targetHeight + windowHeight
      const currentScroll = windowHeight - targetTop
      const pct = Math.min(1, Math.max(0, currentScroll / totalScrollDistance))
      setProgress(pct)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [targetRef])

  return (
    <div className={cn("fixed top-0 left-0 right-0 h-0.5 z-50 bg-transparent", className)}>
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{
          width: `${progress * 100}%`,
          boxShadow: "0 0 8px var(--primary, #C5F441), 0 0 16px var(--primary, #C5F441)",
        }}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

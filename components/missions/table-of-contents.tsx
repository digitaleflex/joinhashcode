"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface TocItem {
  id: string
  text: string
  level: 2 | 3 | 4
}

interface TableOfContentsProps {
  items: TocItem[]
  contentRef?: React.RefObject<HTMLElement | null>
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function generateId(text: string): string {
  return slugify(text)
}

export function extractTocItems(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const items: TocItem[] = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length as 2 | 3 | 4
    const text = match[2].replace(/\*\*(.+?)\*\*/g, "$1").replace(/`(.+?)`/g, "$1").replace(/__(.+?)__/g, "$1")
    const id = generateId(text)
    items.push({ id, text, level })
  }

  return items
}

export function TableOfContents({ items, contentRef }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!contentRef?.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    )

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items, contentRef])

  if (items.length === 0) return null

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveId(id)
      setIsExpanded(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-3xs font-mono uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors mb-3 md:hidden"
      >
        <span>📋 Sommaire</span>
        <span className={cn("transition-transform", isExpanded ? "rotate-180" : "")}>▼</span>
      </button>

      <nav
        className={cn(
          "space-y-0.5",
          !isExpanded && "hidden md:block"
        )}
        aria-label="Table of contents"
      >
        <p className="text-3xs font-mono uppercase tracking-widest text-zinc-600 mb-2 hidden md:block">
          Sommaire
        </p>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={cn(
              "block w-full text-left text-xs py-1 transition-all duration-200 border-l-2 pl-3",
              item.level === 2 ? "font-medium" : "font-normal pl-5",
              activeId === item.id
                ? "border-primary text-primary"
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-white/20"
            )}
          >
            <span className="line-clamp-2">{item.text}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export { slugify }

"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // next-themes : le thème n'est connu qu'après le montage (SSR → undefined)
  // — on n'affiche le libellé qu'après pour éviter le mismatch hydration
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <SidebarMenuButton
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      tooltip="Basculer le thème"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span>Thème {mounted ? (theme === "dark" ? "clair" : "sombre") : ""}</span>
    </SidebarMenuButton>
  )
}

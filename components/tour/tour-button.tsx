"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { getStepsForPath } from "@/lib/tours"
import { useEffect } from "react"

export function TourButton({ autoStart = false }: { autoStart?: boolean }) {
  const pathname = usePathname()

  const startTour = (isAuto = false) => {
    // Prevent auto-start if already done in this session or globally
    if (isAuto && localStorage.getItem(`tour_completed_${pathname}`)) return

    const steps = getStepsForPath(pathname)
    if (!steps || steps.length === 0) return

    const driverObj = driver({
      showProgress: true,
      nextBtnText: 'Suivant',
      prevBtnText: 'Précédent',
      doneBtnText: 'Terminer',
      popoverClass: 'driverjs-theme',
      steps: steps,
      onDestroyStarted: () => {
        if (!driverObj.hasNextStep() || confirm("Voulez-vous vraiment quitter le guide ?")) {
          localStorage.setItem(`tour_completed_${pathname}`, "true")
          driverObj.destroy();
        }
      },
    });
    
    driverObj.drive();
  }

  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(() => startTour(true), 1500) // Delay to ensure page is settled
      return () => clearTimeout(timer)
    }
  }, [autoStart, pathname])

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => startTour(false)}
      title="Guide interactif"
      className="h-10 w-10 rounded-xl hover:bg-primary/10 text-zinc-400 hover:text-primary transition-all group"
    >
      <HelpCircle className="size-5 group-hover:scale-110 transition-transform" />
    </Button>
  )
}

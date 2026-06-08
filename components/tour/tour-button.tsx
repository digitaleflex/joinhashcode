"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { getStepsForPath } from "@/lib/tours"
import { useEffect } from "react"

export function TourButton() {
  const pathname = usePathname()

  const startTour = () => {
    const steps = getStepsForPath(pathname)
    if (!steps || steps.length === 0) return

    const driverObj = driver({
      showProgress: true,
      nextBtnText: 'Suivant',
      prevBtnText: 'Précédent',
      doneBtnText: 'Terminer',
      popoverClass: 'driverjs-theme', // We will add custom css in globals.css
      steps: steps,
      onDestroyStarted: () => {
        if (!driverObj.hasNextStep() || confirm("Voulez-vous vraiment quitter le guide ?")) {
          driverObj.destroy();
        }
      },
    });
    
    driverObj.drive();
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={startTour}
      title="Guide interactif"
      className="h-10 w-10 rounded-xl hover:bg-primary/10 text-zinc-400 hover:text-primary transition-all group"
    >
      <HelpCircle className="size-5 group-hover:scale-110 transition-transform" />
    </Button>
  )
}

"use client"

import { driver } from "driver.js"
import "driver.js/dist/driver.css"

export const startDashboardTour = () => {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    overlayColor: 'rgba(0, 0, 0, 0.85)',
    popoverClass: 'hc-driver-popover',
    progressText: 'Step {{current}} / {{total}}',
    nextBtnText: 'Suivant',
    prevBtnText: 'Précédent',
    doneBtnText: 'Terminer',
    steps: [
      { 
        element: '#tour-welcome', 
        popover: { 
            title: 'Bienvenue dans ton Terminal', 
            description: 'Ici commence ton ascension. C\'est ton centre de commandement pour tout l\'écosystème HASHCODE.',
            side: "bottom", 
            align: 'start' 
        } 
      },
      { 
        element: '#tour-squad', 
        popover: { 
            title: 'Ton Escouade', 
            description: 'Le Protocole d\'Assemblage est actif. Tu as besoin de 5 membres pour déverrouiller ton arsenal complet.',
            side: "bottom", 
            align: 'center' 
        } 
      },
      { 
        element: '#tour-evolution', 
        popover: { 
            title: 'Évolution en Temps Réel', 
            description: 'Suis ton niveau d\'habilitation et ton score de confiance. Chaque action te fait progresser.',
            side: "left", 
            align: 'start' 
        } 
      },
      { 
        element: '#tour-checkin', 
        popover: { 
            title: 'Check-in Quotidien', 
            description: 'N\'oublie pas de signer ta présence chaque jour pour stabiliser ton signal et booster ta cohésion.',
            side: "bottom", 
            align: 'center' 
        } 
      }
    ]
  });

  driverObj.drive();
};

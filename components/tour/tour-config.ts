import type { Tour } from "nextstepjs"

export const getDashboardTour = (isMobile: boolean): Tour => ({
  tour: "dashboard",
  steps: [
    ...(isMobile
      ? [
          {
            icon: "☰",
            title: "Menu de navigation",
            content: "Tape ici pour ouvrir le menu et accéder à toutes les sections.",
            selector: "#tour-sidebar-trigger",
            side: "bottom" as const,
            showControls: true,
            showSkip: true,
          },
        ]
      : [
          {
            icon: "📋",
            title: "Navigation",
            content: "Accède à toutes les sections depuis le menu latéral : missions, dossier, talents et guide.",
            selector: "#tour-sidebar",
            side: "right" as const,
            showControls: true,
            showSkip: true,
          },
        ]),
    {
      icon: "🎯",
      title: "Missions recommandées",
      content: "Des missions adaptées à ton profil. Commence par la plus urgente.",
      selector: "#tour-missions",
      side: "bottom",
      showControls: true,
      showSkip: true,
    },
    {
      icon: "📡",
      title: "Fil d'activité",
      content: "Consulte les dernières actions de la communauté en temps réel.",
      selector: "#tour-feed",
      side: "left",
      showControls: true,
      showSkip: true,
    },
    {
      icon: "📈",
      title: "Ta progression",
      content: "Suis tes labs validés : chacun est une preuve de compétence dans ton Portfolio.",
      selector: "#tour-progression",
      side: "top",
      showControls: true,
      showSkip: true,
    },
  ],
})

export const missionsTour: Tour = {
  tour: "missions",
  steps: [
    {
      icon: "🏆",
      title: "Défi de la semaine",
      content: "Un nouveau défi chaque lundi. Termine-le avant dimanche pour gagner des points bonus.",
      selector: "#tour-weekly-challenge",
      side: "bottom",
      showControls: true,
      showSkip: true,
    },
    {
      icon: "📋",
      title: "Toutes tes missions",
      content: "Parcours les missions disponibles et choisis celle qui correspond à ton niveau.",
      selector: "#tour-missions-list",
      side: "top",
      showControls: true,
      showSkip: true,
    },
  ],
}

export const dossierTour: Tour = {
  tour: "dossier",
  steps: [
    {
      icon: "💡",
      title: "Conseils d'évolution",
      content: "Des recommandations personnalisées pour progresser plus vite.",
      selector: "#tour-dossier-tips",
      side: "bottom",
      showControls: true,
      showSkip: true,
    },
    {
      icon: "📋",
      title: "Missions récentes",
      content: "Retrouve l'historique de tes missions complétées.",
      selector: "#tour-dossier-missions",
      side: "top",
      showControls: true,
      showSkip: true,
    },
  ],
}

export const getAllTours = (isMobile: boolean): Tour[] => [
  getDashboardTour(isMobile),
  missionsTour,
  dossierTour,
]

export const TOUR_NAMES = {
  DASHBOARD: "dashboard",
  MISSIONS: "missions",
  DOSSIER: "dossier",
} as const

export type TourName = (typeof TOUR_NAMES)[keyof typeof TOUR_NAMES]

import { DriveStep } from "driver.js";

export function getStepsForPath(pathname: string): DriveStep[] {
  if (pathname === "/dashboard") {
    return [
      {
        popover: {
          title: "Bienvenue dans la Console HASHCODE",
          description: "Ceci est ton hub d'opérations. Laisse-moi te guider à travers les éléments clés pour bien démarrer.",
          side: "over",
          align: "center"
        }
      },
      {
        element: "#tour-sidebar",
        popover: {
          title: "Navigation Globale",
          description: "Accède ici à tes Missions, ton Dossier, et ton Escouade. Si tu as le niveau, c'est aussi ici que tu trouveras tes accès Leadership.",
          side: "right",
          align: "start"
        }
      },
      {
        element: "#tour-checkin",
        popover: {
          title: "Neural Check-in",
          description: "L'action la plus importante de ta journée. Prends 30 secondes chaque jour pour signaler ton avancement. Cela booste ton XP et ton score de vitalité.",
          side: "right",
          align: "start"
        }
      },
      {
        element: "#tour-missions",
        popover: {
          title: "Missions Recommandées",
          description: "Le système analyse ton profil et te propose les défis les plus adaptés pour monter en niveau rapidement.",
          side: "top",
          align: "center"
        }
      },
      {
        element: "#tour-feed",
        popover: {
          title: "Flux Neural (Activité)",
          description: "Reste connecté avec le reste de la communauté. Ici s'affichent les validations de missions et la formation de nouvelles escouades en temps réel.",
          side: "left",
          align: "start"
        }
      },
      {
        element: "#tour-progression",
        popover: {
          title: "Ta Progression",
          description: "Suis ton évolution de XP vers le niveau supérieur. Chaque mission validée remplit cette jauge.",
          side: "top",
          align: "start"
        }
      },
      {
        element: "#tour-member-card",
        popover: {
          title: "Carte de Membre",
          description: "Ta carte officielle HASHCODE. Elle se met à jour automatiquement avec ton niveau et tes spécialités. Partage-la pour prouver ton implication !",
          side: "top",
          align: "center"
        }
      }
    ];
  }

  // Default tour for unknown pages
  return [
    {
      popover: {
        title: "Navigation",
        description: "Utilise le menu sur la gauche pour naviguer dans l'application.",
        side: "over",
        align: "center"
      }
    }
  ];
}

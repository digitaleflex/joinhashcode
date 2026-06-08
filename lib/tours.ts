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

  if (pathname.startsWith("/missions")) {
    return [
      {
        popover: {
          title: "Arsenal des Missions",
          description: "C'est ici que tu prouves ta valeur. Les missions sont classées par difficulté (INIT, CORE, PRO).",
          side: "over",
          align: "center"
        }
      },
      {
        element: "#tour-weekly-challenge",
        popover: {
          title: "Challenge Hebdomadaire",
          description: "Un défi unique disponible uniquement cette semaine. Le réussir te donne un bonus massif d'XP.",
          side: "bottom",
          align: "center"
        }
      },
      {
        element: "#tour-missions-list",
        popover: {
          title: "Liste des Missions",
          description: "Sélectionne une mission adaptée à ton niveau. Les missions grisées nécessitent de monter de niveau d'abord.",
          side: "top",
          align: "center"
        }
      }
    ];
  }

  if (pathname.startsWith("/dossier")) {
    return [
      {
        popover: {
          title: "Fiche Profil & Dossier",
          description: "Ton identité numérique HASHCODE complète. C'est ce que voient les autres membres et les recruteurs.",
          side: "over",
          align: "center"
        }
      },
      {
        element: "#tour-dossier-radar",
        popover: {
          title: "Cartographie de Compétences",
          description: "Ce radar évolue à chaque fois que tu valides une mission. Il détermine si tu es plutôt Builder, Strategist, Creator ou Catalyst.",
          side: "top",
          align: "start"
        }
      },
      {
        element: "#tour-dossier-xp",
        popover: {
          title: "Dynamique de Croissance",
          description: "L'historique de ton activité et de ton XP sur les 7 derniers jours.",
          side: "top",
          align: "start"
        }
      },
      {
        element: "#tour-dossier-missions",
        popover: {
          title: "Historique des Opérations",
          description: "Toutes tes missions complétées et validées par les Reviewers s'affichent ici, servant de portfolio prouvé.",
          side: "top",
          align: "start"
        }
      },
      {
        element: "#tour-dossier-tips",
        popover: {
          title: "Recommandations Système",
          description: "Le système analyse ton profil et te donne des conseils personnalisés pour accélérer ta progression.",
          side: "bottom",
          align: "start"
        }
      }
    ];
  }

  if (pathname.startsWith("/squad")) {
    return [
      {
        popover: {
          title: "Hub de l'Escouade",
          description: "HASHCODE se joue en multijoueur. Ton escouade est ton équipe rapprochée de 5 talents complémentaires.",
          side: "over",
          align: "center"
        }
      },
      {
        element: "#tour-squad-journey",
        popover: {
          title: "Gestion d'Équipe",
          description: "Ici, tu peux voir le statut de tes coéquipiers, inviter de nouveaux membres ou rejoindre une escouade si tu es seul.",
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

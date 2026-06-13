import { DriveStep } from "driver.js";

export function getStepsForPath(pathname: string): DriveStep[] {
  if (pathname === "/dashboard") {
    return [
      {
        popover: {
          title: "Console HASHCODE : Ton Hub Stratégique",
          description: "Bienvenue, Talent. C'est ici que ton évolution commence. Ce dashboard n'est pas qu'un tableau de bord, c'est l'interface de ton identité numérique. Chaque donnée ici influe sur ta réputation communautaire.",
          side: "over",
          align: "center"
        }
      },
      {
        element: "#tour-sidebar",
        popover: {
          title: "Navigation & Accès",
          description: "Ton arsenal complet. Missions pour l'XP, Dossier pour ton portfolio, et Escouade pour le travail d'équipe. Plus tu montes en niveau, plus de nouvelles options s'ouvriront ici (Leadership, Lab, etc.).",
          side: "right",
          align: "start"
        }
      },
      {
        element: "#tour-checkin",
        popover: {
          title: "Neural Check-in (Vitalité)",
          description: "L'action la plus critique. Signaler ton avancement quotidien maintient ta 'Vibrance'. Une Vibrance haute multiplie tes gains d'XP et signale aux autres que tu es un membre actif et fiable.",
          side: "right",
          align: "start"
        }
      },
      {
        element: "#tour-missions",
        popover: {
          title: "Missions Recommandées (FYP)",
          description: "Le système analyse tes compétences actuelles (Radar) et tes objectifs pour te proposer les défis optimaux. Compléter ces missions est la voie la plus rapide vers le niveau supérieur.",
          side: "top",
          align: "center"
        }
      },
      {
        element: "#tour-feed",
        popover: {
          title: "Flux Neural (Intelligence)",
          description: "Ne reste pas isolé. Le flux te montre les succès de tes pairs. S'inspirer des soumissions validées des autres est un excellent moyen d'apprendre les standards de qualité HASHCODE.",
          side: "left",
          align: "start"
        }
      },
      {
        element: "#tour-progression",
        popover: {
          title: "Progression & Niveau",
          description: "Ton niveau définit tes privilèges. Chaque mission validée remplit cette jauge. À chaque passage de niveau (CORE, PRO, ELITE), tu débloques des missions plus complexes et mieux récompensées.",
          side: "top",
          align: "start"
        }
      },
      {
        element: "#tour-member-card",
        popover: {
          title: "Carte de Membre Holographique",
          description: "C'est ton badge d'honneur. Il contient ton Score de Confiance (basé sur la qualité de tes preuves). Partage-le sur LinkedIn pour prouver ton implication réelle dans des projets concrets.",
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
          description: "Ici, la théorie s'arrête et l'action commence. Choisis des missions qui correspondent à tes objectifs de carrière pour construire un portfolio cohérent.",
          side: "over",
          align: "center"
        }
      },
      {
        element: "#tour-weekly-challenge",
        popover: {
          title: "Challenge Hebdomadaire (Rare)",
          description: "Un défi temporaire à haute intensité. Le réussir te donne des badges exclusifs et un bonus massif de progression. C'est le meilleur moyen de se faire remarquer par les recruteurs du réseau.",
          side: "bottom",
          align: "center"
        }
      },
      {
        element: "#tour-missions-list",
        popover: {
          title: "Hiérarchie des Missions",
          description: "INIT pour les bases, CORE pour les compétences techniques, PRO pour les projets complexes. Respecte la courbe d'apprentissage pour bâtir une expertise solide.",
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

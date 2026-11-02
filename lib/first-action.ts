import { getAtelier } from "@/lib/ateliers";

export type FirstActionDomain = "web" | "cybersecurity" | "ai" | "unknown";

export interface FirstAction {
  domain: FirstActionDomain;
  status: "ready" | "coming_soon";
  title: string;
  description: string;
  href?: string;
  duration?: string;
  source?: "atelier" | "community";
}

/**
 * Normalise les différents vocabulaires utilisés par le produit :
 * `web` / `web-development`, `ai` / `applied-ai`, etc.
 */
export function normalizeDomain(input?: string | null): FirstActionDomain {
  const value = (input ?? "").toLowerCase();
  if (value === "web" || value === "web-development" || value === "webdev") {
    return "web";
  }
  if (
    value === "cybersecurity" ||
    value === "cyber" ||
    value === "cybersécurité" ||
    value === "securite" ||
    value === "sécurité"
  ) {
    return "cybersecurity";
  }
  if (value === "ai" || value === "applied-ai" || value === "ia") {
    return "ai";
  }
  return "unknown";
}

// Each mapping points to a real, published atelier (see lib/ateliers.ts).
// The atelier is checked at runtime so the UI never promises missing content.
const DOMAIN_ACTIONS: Record<
  Exclude<FirstActionDomain, "unknown">,
  { slug: string; rationale: string }
> = {
  web: {
    slug: "html-css-responsive",
    rationale:
      "La porte d'entrée du développement web : une page responsive réelle, livrable en une session.",
  },
  cybersecurity: {
    slug: "linux-cloud-basics",
    rationale:
      "Le socle indispensable avant tout travail de sécurité : comprendre un serveur Linux et ses permissions.",
  },
  ai: {
    slug: "data-analysis-intro",
    rationale:
      "La base de toute application IA : comprendre, nettoyer et interpréter des données réelles.",
  },
};

/**
 * Retourne une première action honnête pour un domaine :
 * - `ready` si l'atelier existe réellement ;
 * - `coming_soon` sinon, avec une alternative communautaire (jamais de faux contenu).
 */
export function getFirstAction(domainInput?: string | null): FirstAction {
  const domain = normalizeDomain(domainInput);

  if (domain === "unknown") {
    return {
      domain,
      status: "coming_soon",
      title: "Choisis ton domaine pour démarrer",
      description:
        "Explore les trois domaines actifs et sélectionne celui qui correspond à ton objectif. Ta première action apparaîtra ici.",
      href: "/programs",
      source: "community",
    };
  }

  const mapping = DOMAIN_ACTIONS[domain];
  const atelier = getAtelier(mapping.slug);

  if (!atelier) {
    return {
      domain,
      status: "coming_soon",
      title: "Ta première action arrive bientôt",
      description:
        "Le contenu de ce domaine est en préparation. En attendant, rejoins la communauté pour être prévenu dès sa publication.",
      href: "/community",
      source: "community",
    };
  }

  return {
    domain,
    status: "ready",
    title: atelier.title,
    description: mapping.rationale,
    href: `/ateliers/${atelier.slug}`,
    duration: atelier.duration,
    source: "atelier",
  };
}

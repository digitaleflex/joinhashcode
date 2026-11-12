export type FirstActionDomain = "web" | "cybersecurity" | "ai" | "unknown";

export interface FirstAction {
  domain: FirstActionDomain;
  status: "ready" | "coming_soon";
  title: string;
  description: string;
  href?: string;
  source?: "lab" | "community";
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

/**
 * Retourne la première action d'un membre (D-030) : choisir un Lab, le livrer,
 * le faire relire par un pair. Tant que le domaine est inconnu, on invite à le choisir.
 * Le domaine est conservé pour la mesure d'activation, pas pour router vers un contenu
 * qui pourrait ne pas exister (jamais de faux contenu).
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

  return {
    domain,
    status: "ready",
    title: "Choisis ton premier lab",
    description:
      "Livre une action concrète et fais-la relire par un pair : elle devient ta première preuve.",
    href: "/missions",
    source: "lab",
  };
}

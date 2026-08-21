// Pré-remplissage des étapes de la Mission 01 à partir des données
// déjà collectées pendant l'onboarding, le quiz et la spécialisation.
//
// Principe (endowed progress) : l'utilisateur ne re-déclare pas ce qu'il a
// déjà dit — il confirme. Chaque étape pré-remplie compte comme complétée,
// la barre démarre donc élevée.

export interface PrefillContext {
  name?: string | null;
  pseudo?: string | null;
  mainObjective?: string | null;
  domains?: string[] | null;
  tools?: string[] | null;
  class?: string | null;
  dreamStatement?: string | null;
}

/** stepKey → fieldKey → valeur pré-remplie */
export type StepPrefill = Record<string, Record<string, unknown>>;

// user.domains stocke des libellés FR ("Web", "DevOps", "Cybersecurity"…)
// alors que le champ MULTI_SELECT utilise des values ("web", "cloud", "cyber"…).
const DOMAIN_ALIASES: Record<string, string> = {
  web: "web",
  "developpement web": "web",
  dev: "web",
  cyber: "cyber",
  cybersecurity: "cyber",
  "cybersecurite": "cyber",
  "securite": "cyber",
  cloud: "cloud",
  devops: "cloud",
  "cloud & devops": "cloud",
  ai: "ai",
  ia: "ai",
  "intelligence artificielle": "ai",
  data: "data",
  donnees: "data",
  reseaux: "reseaux",
  "reseaux & infrastructure": "reseaux",
  reseau: "reseaux",
  linux: "linux",
  "systemes & linux": "linux",
  "systemes": "linux",
  qa: "qa",
  testing: "qa",
  "qa / testing": "qa",
  uxui: "uxui",
  "ux/ui": "uxui",
  design: "uxui",
  produit: "produit",
  product: "produit",
  business: "business",
  entrepreneuriat: "business",
  automation: "automation",
  automatisation: "automation",
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function mapDomains(stored: string[] | null | undefined): string[] {
  if (!stored?.length) return [];
  const out = new Set<string>();
  for (const raw of stored) {
    const key = normalize(raw);
    const mapped = DOMAIN_ALIASES[key];
    if (mapped) out.add(mapped);
  }
  return Array.from(out);
}

// Profil quiz → modes de contribution pré-cochés.
const CLASS_TO_MODES: Record<string, string[]> = {
  builder: ["construire"],
  batisseur: ["construire"],
  creator: ["creer"],
  createur: ["creer"],
  strategist: ["analyser", "organiser"],
  stratege: ["analyser", "organiser"],
  catalyst: ["former", "communiquer"],
  catalyseur: ["former", "communiquer"],
};

function mapClassToModes(classLabel: string | null | undefined): string[] {
  if (!classLabel) return [];
  return CLASS_TO_MODES[normalize(classLabel)] ?? [];
}

export function buildStepPrefill(ctx: PrefillContext): StepPrefill {
  const prefill: StepPrefill = {};

  prefill.presentation = {
    firstName: ctx.name ?? "",
    pseudo: ctx.pseudo ?? "",
  };

  const domains = mapDomains(ctx.domains);
  if (domains.length > 0) {
    prefill.interets = { domains };
  }

  const skills = (ctx.tools ?? []).filter((t) => t.trim().length > 0).map((t) => ({ name: t.trim(), level: "Découverte" }));
  if (skills.length > 0) {
    prefill.competences = { skills };
  }

  if (ctx.dreamStatement && ctx.dreamStatement.trim().length > 0) {
    prefill.ambition = { vision: ctx.dreamStatement.trim() };
  }

  const modes = mapClassToModes(ctx.class);
  if (modes.length > 0) {
    prefill.contribution = { modes };
  }

  if (ctx.mainObjective && ctx.mainObjective.trim().length > 0) {
    prefill.objectif = { objectif: ctx.mainObjective.trim() };
  }

  return prefill;
}

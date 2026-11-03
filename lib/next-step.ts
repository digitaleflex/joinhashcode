export type NextStepTone = "primary" | "warning" | "info" | "success";

export interface NextStep {
  title: string;
  description: string;
  href: string;
  cta: string;
  tone: NextStepTone;
}

interface SubmissionLike {
  status: string;
}

/**
 * Derive the single most useful next step for an established member.
 * Priority: fix what is blocking → get a first proof → wait for review →
 * capitalise on existing proofs.
 */
export function getMemberNextStep(
  submissions: SubmissionLike[],
  missionsCompleted = 0,
): NextStep {
  const hasRevision = submissions.some((s) => s.status === "NEEDS_REVISION");
  const hasApproved = submissions.some((s) => s.status === "APPROVED");
  const inReview = submissions.some(
    (s) => s.status === "PENDING" || s.status === "IN_REVIEW",
  );

  if (hasRevision) {
    return {
      title: "Un Lab demande des corrections",
      description:
        "Un reviewer a laissé un retour. Corrige les points signalés pour faire valider ta preuve.",
      href: "/missions",
      cta: "Corriger mon Lab",
      tone: "warning",
    };
  }

  if (!hasApproved && missionsCompleted === 0) {
    return {
      title: "Publie ta première preuve",
      description:
        "Choisis un Lab adapté à ton domaine, livre un résultat concret et fais-le valider.",
      href: "/missions",
      cta: "Choisir un Lab",
      tone: "primary",
    };
  }

  if (inReview) {
    return {
      title: "Ton Lab est en relecture",
      description:
        "Un reviewer vérifie ta soumission. En attendant, tu peux préparer le prochain Lab.",
      href: "/missions",
      cta: "Voir mes Labs",
      tone: "info",
    };
  }

  return {
    title: "Capitalise sur tes preuves",
    description:
      "Tes Labs validés construisent ton portfolio. Vérifie qu'ils sont bien visibles et à jour.",
    href: "/dossier",
    cta: "Voir mon portfolio",
    tone: "success",
  };
}

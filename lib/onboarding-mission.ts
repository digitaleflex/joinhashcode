// Définition des sous-missions M01 — itératives, soummissables une par une
// L'utilisateur peut revenir à tout moment, aucune étape n'est "verrouillée"
// Le seuil d'activation J+7 compte le nombre de sous-missions validées (≥ 3 sur 5)

// ✅ Sous-mission 1 — Toi (présentation)
// ✅ Sous-mission 2 — Tes domaines (intérêts)
// ✅ Sous-mission 3 — Ton niveau (compétences)
// ✅ Sous-mission 4 — Ton ambition
// ✅ Sous-mission 5 — Ton objectif 30 jours

export type StepFieldType =
  | "TEXT"
  | "TEXTAREA"
  | "MULTI_SELECT"
  | "SELECT"
  | "SKILLS"
  | "ENV"
  | "SLIDER"
  | "SCORED_CRITERIA"
  | "SOLUTIONS_TABLE"
  | "EISENHOWER"
  | "ROADMAP"
  | "RISK_TABLE"
  | "SMART_GOALS"
  | "SYNTHESIS"
  | "DYNAMIC_TABLE"

export interface StepFieldOption {
  value: string
  label: string
  description?: string
}

export interface StepFieldSkill {
  levels: string[]
}

export interface StepField {
  key: string
  label: string
  type: StepFieldType
  placeholder?: string
  required?: boolean
  maxLength?: number
  minLines?: number
  hint?: string
  options?: StepFieldOption[]
  skills?: StepFieldSkill
  defaultLines?: number
  /** Pour SLIDER : valeurs min/max/step (défaut 0/10/1). */
  min?: number
  max?: number
  step?: number
  /** Pour SCORED_CRITERIA : critères avec notes /10, justification, preuves, confiance. */
  criteria?: {
    key: string
    label: string
    question: string
    reflect?: string[]
  }[]
  /** Nombre minimum d'éléments requis (tableaux, risques, objectifs…). */
  minItems?: number
  /** Pour SCORED_CRITERIA : maximum de la somme des notes. */
  totalMax?: number
  /** Pour DYNAMIC_TABLE : colonnes configurables du tableau dynamique. */
  columns?: {
    key: string
    label: string
    type?: "text" | "textarea" | "select"
    options?: StepFieldOption[]
  }[]
}

export interface MissionSubDef {
  key: string
  title: string
  shortTitle: string
  description: string
  fields: StepField[]
  /** Score max pour la review de cette sous-mission (défaut 0 = noté dans grid global). */
  scoreMax?: number
  /** Si true, cette sous-mission peut être soumise indépendamment des autres. */
  independent: boolean
}

export interface OnboardingMissionDef {
  slug: string
  title: string
  shortDesc: string
  description: string
  duration: string
  xpReward: number
  category: string
  difficulty: number
  missionLevel: string
  targetProfiles: string[]
  requirements: string[]
  deliverables: string[]
  submissionMethod: string
  acceptanceCriteria: { id: string; label: string; weight: "REQUIRED" | "BONUS" }[]
  evaluatorNotes: string
  qualityIndicators: { good: string; exemplary: string }
  /** Sous-missions M01 — chaque élément peut être soumis indépendamment. */
  subMissions: MissionSubDef[]
  /** Nombre minimum de sous-missions à valider pour considérer M01 "complet" (seuil J+7). */
  minSubmissionsForCompletion: number
  /** Si true, l'utilisateur peut soumettre la même sous-mission plusieurs fois. */
  allowRereview: boolean
  /** Grille de scoring globale (/25). */
  scoringGrid: { key: string; label: string; max: number }[]
}

export const ONBOARDING_MISSION: OnboardingMissionDef = {
  slug: "mission-01-decouverte",
  title: "Fais connaissance avec HashCode",
  shortDesc: "Ton premier profil HashCode. Comprends qui tu es, ce qui t'intéresse et où tu veux aller.",
  description:
    "Ton diagnostic est déjà fait — ici, tu le confirms et tu le complètes en quelques minutes. À la fin, ton profil HashCode officiel est généré. Chaque sous-mission peut être soumise indépendamment — pas de pression, tu reviens quand tu veux.",
  duration: "~15 minutes",
  xpReward: 150,
  category: "INTRO",
  difficulty: 1,
  missionLevel: "INIT",
  targetProfiles: ["builder", "creator", "strategist", "catalyst"],
  requirements: [],
  deliverables: ["Profil HashCode v1 validé"],
  submissionMethod: "TEXT_RESPONSE",
  acceptanceCriteria: [
    { id: "intro-complete", label: "Minimum 3 des 5 sous-missions validées par pairs", weight: "REQUIRED" },
    { id: "intro-authentic", label: "Ton personnel et authentique (pas générique)", weight: "REQUIRED" },
    { id: "intro-objective", label: "Premier objectif concret et actionnable", weight: "REQUIRED" },
    { id: "intro-coherent", label: "Ambition cohérente avec les intérêts déclarés", weight: "BONUS" },
  ],
  evaluatorNotes:
    "Il ne s'agit PAS d'une évaluation de niveau. Le reviewer vérifie la complétude, la clarté et l'authenticité par sous-mission. Un objectif vague (\"progresser\") = révision demandée par sous-mission. Ne jamais transformer une déclaration en compétence validée. L'utilisateur peut corriger/submettre à nouveau n'importe quelle sous-mission.",
  qualityIndicators: {
    good: "Profil complet avec des réponses personnelles et un objectif SMART, minimum 3/5 sous-missions validées.",
    exemplary: "Profil soigné, ambition claire, qui inspire confiance immédiatement. Toutes les sous-missions validées ou presque.",
  },
  // ✅ 5 sous-missions indépendantes, dans un ordre suggéré mais libre
  subMissions: [
    // ✅ Sous-mission 1 — Toi (présentation)
    {
      key: "presentation",
      title: "Toi",
      shortTitle: "Toi",
      description:
        "Permets aux autres membres de découvrir la personne derrière le profil. Présente-toi simplement, sans chercher à être parfait.",
      fields: [
        { key: "firstName", label: "Prénom", type: "TEXT", required: true, placeholder: "Ton prénom", maxLength: 80 },
        { key: "pseudo", label: "Pseudo / username", type: "TEXT", required: true, placeholder: "Ton pseudo HashCode", maxLength: 40 },
        {
          key: "presentation",
          label: "Présentation",
          type: "TEXTAREA",
          required: true,
          placeholder: "Parle de ton parcours, ce qui t'intéresse, une chose que les autres devraient savoir sur toi…",
          minLines: 3,
          maxLength: 800,
          hint: "3 à 6 lignes suffisent.",
        },
      ],
      scoreMax: 5,
      independent: true,
    },
    // ✅ Sous-mission 2 — Tes domaines (intérêts)
    {
      key: "domains",
      title: "Tes domaines",
      shortTitle: "Domaines",
      description:
        "On a retenu tes domaines depuis ton diagnostic. Confirme ou ajuste, puis dis-nous pourquoi.",
      fields: [
        {
          key: "domains",
          label: "Domaines qui t'intéressent",
          type: "MULTI_SELECT",
          required: true,
          hint: "Pré-cochés d'après ton diagnostic — décoche si ce n'est plus toi.",
          options: [
            { value: "web", label: "Développement Web" },
            { value: "cyber", label: "Cybersécurité" },
            { value: "cloud", label: "Cloud & DevOps" },
            { value: "ai", label: "Intelligence Artificielle" },
            { value: "data", label: "Data" },
            { value: "reseaux", label: "Réseaux" },
            { value: "linux", label: "Systèmes & Linux" },
            { value: "qa", label: "QA / Testing" },
            { value: "uxui", label: "UX/UI" },
            { value: "produit", label: "Produit" },
            { value: "business", label: "Business / Entrepreneuriat" },
            { value: "automation", label: "Automatisation" },
            { value: "autre", label: "Autre" },
          ],
        },
        {
          key: "pourquoi-domaines",
          label: "Pourquoi ces domaines t'intéressent-ils ?",
          type: "TEXTAREA",
          required: true,
          minLines: 2,
          maxLength: 600,
          hint: "Réponse courte.",
        },
      ],
      scoreMax: 5,
      independent: true,
    },
    // ✅ Sous-mission 3 — Ton niveau (compétences)
    {
      key: "competences",
      title: "Ton niveau",
      shortTitle: "Niveau",
      description:
        "Voici les outils que tu as déclarés. Indique simplement ton niveau actuel pour chacun — c'est déclaratif, pas une évaluation.",
      fields: [
        {
          key: "skills",
          label: "Compétences",
          type: "SKILLS",
          required: true,
          hint: "Ces niveaux sont déclaratifs. Ils ne constituent pas encore une évaluation HashCode.",
          skills: {
            levels: ["Découverte", "Débutant", "Intermédiaire", "Avancé", "Expert"],
          },
        },
      ],
      scoreMax: 5,
      independent: true,
    },
    // ✅ Sous-mission 4 — Ton ambition
    {
      key: "ambition",
      title: "Ton ambition",
      shortTitle: "Ambition",
      description:
        "Tu nous as déjà confié ta rêverie pendant ton diagnostic. Repars de là et raconte comment tu comptes y arriver.",
      fields: [
        {
          key: "vision",
          label: "Si tout se passe bien, qu'aimerais-tu être capable de faire ou devenir dans 1 à 3 ans ?",
          type: "TEXTAREA",
          required: true,
          minLines: 3,
          maxLength: 1200,
          hint: "Ta rêverie du diagnostic est pré-remplie — completes-la ou réécris-la.",
        },
        { key: "metier", label: "Quel métier ou rôle t'intéresse aujourd'hui ?", type: "TEXT", required: false, maxLength: 200, placeholder: "Ex : Développeur full-stack, pentester…" },
      ],
      scoreMax: 5,
      independent: true,
    },
    // ✅ Sous-mission 5 — Ton objectif 30 jours
    {
      key: "objectif",
      title: "Ton objectif 30 jours",
      shortTitle: "Objectif",
      description:
        "Ton objectif déclaré est pré-rempli ci-dessous. Rends-le concret : que veux-tu avoir accompli dans tes 30 premiers jours ?",
      fields: [
        {
          key: "objectif",
          label: "Ton premier objectif",
          type: "TEXTAREA",
          required: true,
          minLines: 1,
          maxLength: 500,
          placeholder: "Ex : Être capable de créer et déployer ma première application web.",
          hint: "Un objectif clair, réaliste et suffisamment concret.",
        },
        {
          key: "pourquoi-objectif",
          label: "Pourquoi cet objectif est-il important pour toi ?",
          type: "TEXTAREA",
          required: false,
          minLines: 1,
          maxLength: 500,
        },
      ],
      scoreMax: 5,
      independent: true,
    },
  ],
  scoringGrid: [
    { key: "completude", label: "Complétude", max: 5 },
    { key: "clarte", label: "Clarté", max: 5 },
    { key: "reflexion", label: "Réflexion", max: 5 },
    { key: "coherence_objectif", label: "Cohérence de l'objectif", max: 5 },
    { key: "qualite_presentation", label: "Qualité de présentation", max: 5 },
  ],
  minSubmissionsForCompletion: 3,
  allowRereview: true,
}
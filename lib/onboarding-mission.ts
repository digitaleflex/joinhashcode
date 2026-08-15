// Définition configurable des missions à étapes (onboarding).
// Mission 01 — "Fais connaissance avec HashCode" est la première.
// Chaque mission à étapes définit ses métadonnées, étapes, champs et règles de review.
// Le moteur (lib/mission-engine.ts) reste générique : rien n'est codé en dur pour Mission 01.

export type StepFieldType =
  | "TEXT"
  | "TEXTAREA"
  | "MULTI_SELECT"
  | "SELECT"
  | "SKILLS"
  | "ENV"

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
}

export interface MissionStepDef {
  key: string
  title: string
  shortTitle: string
  description: string
  fields: StepField[]
  /** Score max pour la review de cette étape (défaut 0 = non noté séparément). */
  scoreMax?: number
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
  steps: MissionStepDef[]
  /** Grille de scoring globale (/25). */
  scoringGrid: { key: string; label: string; max: number }[]
}

export const ONBOARDING_MISSION: OnboardingMissionDef = {
  slug: "mission-01-decouverte",
  title: "Fais connaissance avec HashCode",
  shortDesc: "Ton premier profil HashCode. Comprends qui tu es, ce qui t'intéresse et où tu veux aller.",
  description:
    "Avant les formations, les challenges et les projets, HashCode veut comprendre qui tu es, ce qui t'intéresse, ce que tu sais déjà faire et où tu aimerais aller. Cette mission construit ton premier profil HashCode.",
  duration: "2-3 jours",
  xpReward: 150,
  category: "INTRO",
  difficulty: 1,
  missionLevel: "INIT",
  targetProfiles: ["builder", "creator", "strategist", "catalyst"],
  requirements: [],
  deliverables: ["Profil HashCode v1 validé"],
  submissionMethod: "TEXT_RESPONSE",
  acceptanceCriteria: [
    { id: "intro-complete", label: "Toutes les étapes complétées", weight: "REQUIRED" },
    { id: "intro-authentic", label: "Ton personnel et authentique (pas générique)", weight: "REQUIRED" },
    { id: "intro-objective", label: "Premier objectif concret et actionnable", weight: "REQUIRED" },
    { id: "intro-coherent", label: "Ambition cohérente avec les intérêts déclarés", weight: "BONUS" },
    { id: "intro-memorable", label: "Présentation finale mémorable et soignée", weight: "BONUS" },
  ],
  evaluatorNotes:
    "Il ne s'agit PAS d'une évaluation de niveau. Le reviewer vérifie la complétude, la clarté et l'authenticité. Un objectif vague (\"progresser\") = révision demandée. Ne jamais transformer une déclaration en compétence validée.",
  qualityIndicators: {
    good: "Profil complet avec des réponses personnelles et un objectif SMART.",
    exemplary: "Présentation finale soignée, ambition claire, profil qui inspire confiance immédiatement.",
  },
  steps: [
    {
      key: "presentation",
      title: "Présente-toi",
      shortTitle: "Présentation",
      description:
        "Permets aux autres membres de découvrir la personne derrière le profil. Présente-toi simplement, sans chercher à être parfait.",
      scoreMax: 5,
      fields: [
        { key: "firstName", label: "Prénom", type: "TEXT", required: true, placeholder: "Ton prénom", maxLength: 80 },
        { key: "pseudo", label: "Pseudo / username", type: "TEXT", required: true, placeholder: "Ton pseudo HashCode", maxLength: 40 },
        {
          key: "presentation",
          label: "Présentation",
          type: "TEXTAREA",
          required: true,
          placeholder: "Parle de ton parcours, ce qui t'intéresse, une chose que les autres devraient savoir sur toi…",
          minLines: 5,
          maxLength: 1500,
          hint: "5 à 10 lignes recommandées.",
        },
      ],
    },
    {
      key: "interets",
      title: "Mon univers technologique",
      shortTitle: "Intérêts",
      description:
        "Sélectionne les domaines qui t'attirent naturellement, puis explique pourquoi.",
      fields: [
        {
          key: "domains",
          label: "Domaines qui t'intéressent",
          type: "MULTI_SELECT",
          required: true,
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
          key: "pourquoi",
          label: "Pourquoi ces domaines t'intéressent-ils ?",
          type: "TEXTAREA",
          required: true,
          minLines: 2,
          maxLength: 800,
          hint: "Réponse courte.",
        },
      ],
    },
    {
      key: "competences",
      title: "Ce que je sais déjà faire",
      shortTitle: "Compétences",
      description:
        "Indique les technologies, outils ou compétences que tu as déjà utilisés, avec un niveau déclaratif.",
      scoreMax: 5,
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
    },
    {
      key: "ambition",
      title: "Mon ambition",
      shortTitle: "Ambition",
      description:
        "Comprends où tu souhaites aller. Cette réponse aide HashCode à comprendre la direction que tu prends.",
      scoreMax: 5,
      fields: [
        {
          key: "vision",
          label: "Si tout se passe bien, qu'aimerais-tu être capable de faire ou devenir dans 1 à 3 ans ?",
          type: "TEXTAREA",
          required: true,
          minLines: 3,
          maxLength: 1200,
        },
        { key: "metier", label: "Quel métier ou rôle t'intéresse aujourd'hui ?", type: "TEXT", required: false, maxLength: 200, placeholder: "Ex : Développeur full-stack, pentester…" },
        {
          key: "competence",
          label: "Quelle compétence aimerais-tu absolument maîtriser ?",
          type: "TEXTAREA",
          required: false,
          minLines: 1,
          maxLength: 500,
        },
        {
          key: "projet",
          label: "Quel type de projet aimerais-tu être capable de construire ?",
          type: "TEXTAREA",
          required: false,
          minLines: 2,
          maxLength: 800,
        },
        {
          key: "objectifPro",
          label: "As-tu un objectif professionnel ou entrepreneurial particulier ?",
          type: "TEXTAREA",
          required: false,
          minLines: 1,
          maxLength: 600,
        },
      ],
    },
    {
      key: "apprentissage",
      title: "Comment j'aime apprendre",
      shortTitle: "Apprentissage",
      description:
        "Identifie tes préférences d'apprentissage pour que HashCode te propose les bonnes ressources.",
      fields: [
        {
          key: "preferences",
          label: "Comment tu apprends le mieux",
          type: "MULTI_SELECT",
          required: true,
          options: [
            { value: "docs", label: "Documentation" },
            { value: "videos", label: "Vidéos" },
            { value: "cours", label: "Cours structurés" },
            { value: "exercices", label: "Exercices pratiques" },
            { value: "projets", label: "Projets" },
            { value: "challenges", label: "Challenges" },
            { value: "groupe", label: "Travail en groupe" },
            { value: "individuel", label: "Travail individuel" },
            { value: "mentorat", label: "Mentorat" },
            { value: "experimentation", label: "Expérimentation" },
            { value: "enseignement", label: "Enseigner à quelqu'un d'autre" },
          ],
        },
        {
          key: "explique",
          label: "Qu'est-ce qui t'aide le plus à comprendre quelque chose que tu ne connais pas encore ?",
          type: "TEXTAREA",
          required: true,
          minLines: 2,
          maxLength: 600,
        },
      ],
    },
    {
      key: "contribution",
      title: "Ma manière de contribuer",
      shortTitle: "Contribution",
      description:
        "Identifie les formes de contribution qui t'attirent naturellement.",
      fields: [
        {
          key: "modes",
          label: "Comment tu aimes contribuer",
          type: "MULTI_SELECT",
          required: true,
          options: [
            { value: "construire", label: "Construire", description: "Créer des applications, systèmes ou projets." },
            { value: "analyser", label: "Analyser", description: "Chercher, comprendre et résoudre des problèmes." },
            { value: "securiser", label: "Sécuriser", description: "Identifier les risques et protéger les systèmes." },
            { value: "creer", label: "Créer", description: "Imaginer des concepts, interfaces ou contenus." },
            { value: "organiser", label: "Organiser", description: "Structurer les processus et coordonner les activités." },
            { value: "documenter", label: "Documenter", description: "Transformer les connaissances en ressources utiles." },
            { value: "former", label: "Former", description: "Expliquer et aider les autres." },
            { value: "rechercher", label: "Rechercher", description: "Explorer de nouvelles technologies et méthodes." },
            { value: "communiquer", label: "Communiquer", description: "Présenter, écrire, partager et représenter le groupe." },
          ],
        },
        {
          key: "priorite",
          label: "Parmi ces contributions, laquelle aimerais-tu développer en priorité ?",
          type: "TEXT",
          required: true,
          maxLength: 200,
          placeholder: "Ex : Construire",
        },
      ],
    },
    {
      key: "attentes",
      title: "Ce que j'attends de HashCode",
      shortTitle: "Attentes",
      description: "Comprends les attentes du nouveau membre.",
      fields: [
        {
          key: "attentes",
          label: "Qu'aimerais-tu obtenir de ton expérience chez HashCode ?",
          type: "MULTI_SELECT",
          required: true,
          options: [
            { value: "competences", label: "Développer mes compétences" },
            { value: "projets", label: "Construire des projets" },
            { value: "accompagnement", label: "Être accompagné" },
            { value: "mentor", label: "Trouver un mentor" },
            { value: "rencontres", label: "Rencontrer d'autres passionnés" },
            { value: "reseau", label: "Développer mon réseau" },
            { value: "confiance", label: "Gagner en confiance" },
            { value: "opportunites", label: "Trouver des opportunités" },
            { value: "entreprendre", label: "Entreprendre" },
            { value: "autre", label: "Autre" },
          ],
        },
        {
          key: "detail",
          label: "Précise ce que tu attends de ton expérience chez HashCode",
          type: "TEXTAREA",
          required: false,
          minLines: 2,
          maxLength: 800,
        },
        {
          key: "risque",
          label: "Qu'est-ce qui pourrait te faire perdre ta motivation ? (facultatif)",
          type: "TEXTAREA",
          required: false,
          minLines: 1,
          maxLength: 500,
        },
      ],
    },
    {
      key: "environnement",
      title: "Mon environnement",
      shortTitle: "Environnement",
      description:
        "Ces informations servent uniquement à adapter certaines missions et recommandations à ton environnement. Aucune donnée sensible n'est demandée.",
      fields: [
        {
          key: "env",
          label: "Environnement technique",
          type: "ENV",
          required: true,
          options: [
            { value: "systeme", label: "Système principal" },
            { value: "ide", label: "Environnement de développement" },
            { value: "connexion", label: "Qualité de connexion" },
          ],
        },
      ],
    },
    {
      key: "objectif",
      title: "Mon premier objectif HashCode",
      shortTitle: "Objectif",
      description:
        "Choisis un seul objectif concret que tu aimerais atteindre pendant tes premières semaines chez HashCode.",
      scoreMax: 5,
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
          key: "pourquoi",
          label: "Pourquoi cet objectif est-il important pour toi ?",
          type: "TEXTAREA",
          required: false,
          minLines: 1,
          maxLength: 500,
        },
      ],
    },
    {
      key: "presentation_finale",
      title: "Présentation finale",
      shortTitle: "Final",
      description:
        "Transforme tes réponses en une véritable présentation. Tu peux modifier, revenir à une étape, puis soumettre.",
      scoreMax: 5,
      fields: [
        {
          key: "format",
          label: "Format de présentation",
          type: "SELECT",
          required: false,
          options: [
            { value: "texte", label: "Texte" },
            { value: "video", label: "Vidéo (2-5 min max)" },
            { value: "audio", label: "Audio + texte" },
            { value: "autre", label: "Autre format" },
          ],
        },
        {
          key: "message",
          label: "Ta présentation finale",
          type: "TEXTAREA",
          required: false,
          minLines: 3,
          maxLength: 2000,
          hint: "Qui suis-je ? Ce que je sais faire · Ce qui m'intéresse · Ce que je veux apprendre · Mon ambition · Mon premier objectif · Ce que je peux apporter à la communauté.",
        },
        {
          key: "lien",
          label: "Lien (vidéo, audio, présentation)",
          type: "TEXT",
          required: false,
          maxLength: 500,
          placeholder: "https://… (si tu choisis un format autre que texte)",
        },
      ],
    },
  ],
  scoringGrid: [
    { key: "completude", label: "Complétude", max: 5 },
    { key: "clarte", label: "Clarté", max: 5 },
    { key: "reflexion", label: "Réflexion", max: 5 },
    { key: "coherence_objectif", label: "Cohérence de l'objectif", max: 5 },
    { key: "qualite_presentation", label: "Qualité de présentation", max: 5 },
  ],
}

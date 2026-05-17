export type ProfileType = 'builder' | 'creator' | 'strategist' | 'catalyst'

export interface Truth {
  icon: string
  bold: string
  rest: string
}

export interface Mission {
  title: string
  xp: number
}

export interface ProfileContent {
  name: string
  pain: string
  painBold: string
  truths: [Truth, Truth, Truth]
  unlockedMissions: [Mission, Mission]
  lockedMissions: Mission[]
  socialProof: string
  whatsappText: string
  ctaLabel: string
}

export const PROFILE_COLORS: Record<ProfileType, string> = {
  builder: '#B8FF3B',
  creator: '#A855F7',
  strategist: '#22D3EE',
  catalyst: '#F97316',
}

export const PROFILE_CONTENT: Record<ProfileType, ProfileContent> = {
  builder: {
    name: 'Builder',
    pain: "Tu sais construire. Le problème, c'est que tu construis seul, dans le vide — sans savoir si ce que tu fais vaut quelque chose.",
    painBold: 'seul, dans le vide',
    truths: [
      {
        icon: '🔁',
        bold: 'Tu recommences souvent de zéro.',
        rest: " Pas parce que tu es instable — parce que personne ne t'a montré comment avancer étape par étape.",
      },
      {
        icon: '🔇',
        bold: 'Ton entourage ne comprend pas ce que tu fais.',
        rest: " Ni ta famille, ni tes amis. Tu construis quelque chose qu'ils ne voient pas encore.",
      },
      {
        icon: '🧱',
        bold: 'Tu accumules des projets non terminés.',
        rest: " Chacun t'a appris quelque chose — mais aucun ne te représente encore. Ça, ça change ici.",
      },
    ],
    unlockedMissions: [
      { title: 'Construire et livrer un projet en 48h', xp: 50 },
      { title: 'Documenter et publier ton code sur GitHub', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Collaborer avec un Stratège du Guild', xp: 60 },
      { title: 'Présenter ton travail à la communauté', xp: 40 },
      { title: 'Mentorer un Builder débutant', xp: 80 },
    ],
    socialProof:
      "Des Builders comme toi ont livré leurs premiers projets et décroché leurs premiers clients depuis ce Guild.",
    whatsappText:
      "Je viens de découvrir mon profil HASHCODE : Builder 🧱\nFais le quiz et découvre le tien → joinhashcode.com",
    ctaLabel: 'Rejoindre le Guild Builder →',
  },

  creator: {
    name: 'Créateur',
    pain: "Tu as des idées que les autres n'ont pas encore. Mais tu passes plus de temps à tout imaginer tout seul qu'à créer vraiment.",
    painBold: 'tout imaginer tout seul',
    truths: [
      {
        icon: '🎨',
        bold: 'Tu crées, puis tu effaces.',
        rest: " Pas parce que c'est mauvais — parce que tu n'as personne à qui montrer avant que ce soit parfait.",
      },
      {
        icon: '🔦',
        bold: 'Tu te perds dans les détails.',
        rest: " Une idée en entraîne une autre, et tu n'arrives jamais à la ligne d'arrivée.",
      },
      {
        icon: '🪟',
        bold: "Tu manques d'une scène.",
        rest: " Pas de talent — tu n'as juste jamais eu le bon endroit pour montrer ce que tu fais vraiment.",
      },
    ],
    unlockedMissions: [
      { title: 'Publier un projet personnel en public', xp: 50 },
      { title: 'Créer et partager ton premier design system', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Co-créer avec un Builder du Guild', xp: 60 },
      { title: 'Pitcher ta vision à la communauté', xp: 40 },
      { title: 'Produire un projet de A à Z en 7 jours', xp: 80 },
    ],
    socialProof:
      "Des Créateurs du Guild ont publié leurs projets pour la première fois — et reçu des retours vrais, pas des likes vides.",
    whatsappText:
      "Je viens de découvrir mon profil HASHCODE : Créateur 🎨\nFais le quiz et découvre le tien → joinhashcode.com",
    ctaLabel: 'Rejoindre le Guild Créateur →',
  },

  strategist: {
    name: 'Stratège',
    pain: "Tu vois tout plus loin que les autres. Le problème, c'est que pendant que tu analyses, les autres agissent — et toi tu regardes.",
    painBold: 'les autres agissent — et toi tu regardes',
    truths: [
      {
        icon: '🧠',
        bold: 'Tu penses beaucoup, tu livres peu.',
        rest: " Pas par paresse — tu veux que ce soit bien fait avant de commencer. Ça t'immobilise.",
      },
      {
        icon: '📐',
        bold: 'Personne ne te demande ton avis.',
        rest: " Pourtant tu vois des choses que les autres ratent. Il te manque un cadre où ta profondeur est valorisée.",
      },
      {
        icon: '🔗',
        bold: 'Tu travailles seul sur des idées qui méritent une équipe.',
        rest: " Ici tu trouves les personnes qui ont besoin exactement de ce que tu sais faire.",
      },
    ],
    unlockedMissions: [
      { title: 'Produire une analyse produit complète', xp: 50 },
      { title: 'Rédiger une roadmap pour un vrai projet', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Mentorer un Builder du Guild', xp: 60 },
      { title: 'Présenter ta stratégie à la communauté', xp: 40 },
      { title: 'Diriger un projet de Guild de A à Z', xp: 100 },
    ],
    socialProof:
      "Des Stratèges du Guild ont rejoint des équipes qui avaient besoin exactement de leur façon de penser.",
    whatsappText:
      "Je viens de découvrir mon profil HASHCODE : Stratège 🧠\nFais le quiz et découvre le tien → joinhashcode.com",
    ctaLabel: 'Rejoindre le Guild Stratège →',
  },

  catalyst: {
    name: 'Catalyst',
    pain: "Tu motives tout le monde autour de toi. Mais à la fin de la journée, qui te motive, toi ?",
    painBold: 'qui te motive, toi ?',
    truths: [
      {
        icon: '🔥',
        bold: 'Tu donnes beaucoup, tu reçois peu.',
        rest: " Tu portes des groupes entiers sans structure pour toi-même. Tu t'épuises.",
      },
      {
        icon: '🌀',
        bold: "Ton énergie part dans tous les sens.",
        rest: " Pas par manque de sérieux — tu n'as pas encore trouvé le cadre qui concentre ce que tu apportes.",
      },
      {
        icon: '🤝',
        bold: 'Tu es fait pour bâtir des communautés.',
        rest: " Ici on t'en donne une vraie — avec des gens aussi engagés que toi.",
      },
    ],
    unlockedMissions: [
      { title: 'Animer ta première session communautaire', xp: 50 },
      { title: 'Recruter 3 membres actifs pour ton Guild', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Co-organiser un événement avec un Stratège', xp: 60 },
      { title: "Lancer ton propre cercle d'apprentissage", xp: 40 },
      { title: "Fédérer une équipe autour d'un projet commun", xp: 100 },
    ],
    socialProof:
      "Des Catalysts du Guild ont lancé leurs propres cercles d'apprentissage dans leurs villes.",
    whatsappText:
      "Je viens de découvrir mon profil HASHCODE : Catalyst 🔥\nFais le quiz et découvre le tien → joinhashcode.com",
    ctaLabel: 'Rejoindre le Guild Catalyst →',
  },
}

export function getProfileContent(profile: ProfileType): ProfileContent {
  return PROFILE_CONTENT[profile]
}

export function getHybridContent(
  primary: ProfileType,
  secondary: ProfileType
): Omit<ProfileContent, 'name' | 'ctaLabel'> & { name: string; ctaLabel: string } {
  const p = PROFILE_CONTENT[primary]
  const s = PROFILE_CONTENT[secondary]
  return {
    ...p,
    name: `${p.name} × ${s.name}`,
    truths: [p.truths[0], p.truths[1], s.truths[0]],
    ctaLabel: `Rejoindre le Guild ${p.name} →`,
  }
}

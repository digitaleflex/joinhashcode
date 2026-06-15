export type MissionLevel = 1 | 2 | 3 | 4;
export type MissionType = "CODE" | "DESIGN" | "BUSINESS" | "NETWORK" | "GENERAL" | "INTRO";
export type UserProfile = "builder" | "creator" | "strategist" | "catalyst";
export type ProgressionLevel = "INIT" | "CORE" | "PRO";

export interface Mission {
  id: string;
  slug?: string;
  title: string;
  description: string;
  shortDesc: string;
  xpReward: number;
  requiredLevel: MissionLevel;
  targetLevel: MissionLevel;
  requirements: string[];
  type: MissionType;
  // Profil Vivant fields
  targetProfiles: UserProfile[];
  missionLevel: ProgressionLevel;
  duration?: string;
  weightBuilder?: number;
  weightCreator?: number;
  weightStrategist?: number;
  weightCatalyst?: number;
  comingSoon?: boolean;
  // Extra DB fields
  deliverables?: string[];
  fullBriefing?: string;
  submissionMethod?: "ANY_LINK" | "TEXT_RESPONSE" | "LIVE_URL" | "DOCUMENT_LINK" | "GITHUB_REPO";
}

export const MISSIONS: Mission[] = [
  // --- MISSIONS D'INITIALISATION (QUICK WINS) ---
  {
    id: "signal-ouverture",
    title: "Signal d'Ouverture",
    shortDesc: "Initialise ton lien avec le réseau.",
    description: "Confirme que tu es prêt à builder. Cette action synchronise ton terminal avec le serveur central de HASHCODE.",
    xpReward: 15,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Confirmer la disponibilité pour la phase active.",
    ],
    type: "INTRO",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "1min",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    comingSoon: false,
    deliverables: ["Confirmation de synchronisation"],
    fullBriefing: `
# Mission : Signal d'Ouverture

Félicitations, tu as franchi les premières couches de sécurité. Ton profil est actif, mais ton signal doit être stabilisé.

### Instructions
1. Dans le champ de réponse, tape simplement : **"SIGNAL_ACTIF"**.
2. Valide la mission.

### Résultat attendu
- Gain immédiat d'XP.
- Stabilisation de ton profil dans la base de données.
    `
  },
  // --- MISSIONS GÉNÉRIQUES / INTRO ---
  {
    id: "introduction-ancrage",
    title: "Ancrage Initial",
    shortDesc: "Pose ton identité dans la communauté.",
    description: "Avant toute chose, présente-toi. Qui es-tu, qu'est-ce que tu construis, et où veux-tu aller dans les 3 prochains mois ?",
    xpReward: 25,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Décris ce que tu construis en une phrase.",
      "Partage ton objectif principal pour les 3 prochains mois."
    ],
    type: "INTRO",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "30min",
    weightBuilder: 0.1,
    weightCreator: 0.1,
    weightStrategist: 0.1,
    weightCatalyst: 0.7,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Bio du profil", "Objectif principal à 3 mois"],
    fullBriefing: `
# Mission : Ancrage Initial

Bienvenue dans la communauté HASHCODE. Avant toute chose, présente-toi. Qui es-tu, qu'est-ce que tu construis, et où veux-tu aller dans les 3 prochains mois ?

### Instructions
1. Décris ce que tu construis en une phrase percutante.
2. Partage ton objectif principal pour les 3 prochains mois.
3. Rédige une courte bio (2-3 lignes) qui sera affichée sur ton profil.

### Critères de validation
- Réponse claire et structurée.
- Objectif SMART (Spécifique, Mesurable, Atteignable, Réaliste, Temporel).
    `
  },
  {
    id: "social-connection-protocol",
    title: "Protocole de Connexion Globale",
    shortDesc: "Rejoins le réseau neuronal de HASHCODE.",
    description: "La force de HASHCODE réside dans sa communauté. Rejoins nos canaux officiels : Telegram, Discord et WhatsApp.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Rejoindre le canal Telegram et renseigner ton pseudo (@mon_pseudo).",
      "Rejoindre le serveur Discord et renseigner ton pseudo.",
      "Rejoindre le groupe WhatsApp et renseigner ton numéro de téléphone."
    ],
    type: "NETWORK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "15min",
    weightBuilder: 0.0,
    weightCreator: 0.1,
    weightStrategist: 0.1,
    weightCatalyst: 0.8,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Pseudo Telegram", "Pseudo Discord", "Numéro WhatsApp"],
    fullBriefing: `
# Mission : Protocole de Connexion Globale

La force de HASHCODE réside dans son intelligence collective. Pour ne rien manquer et commencer à collaborer, tu dois intégrer nos canaux de communication.

### Instructions
1. Rejoins le canal Telegram **@innovcode** pour les annonces officielles.
2. Intègre le serveur **Discord officiel** pour les échanges techniques et créatifs.
3. Rejoins le **groupe WhatsApp** de ta cohorte ou communauté locale.

### Critères de validation
- Confirmation de ton identifiant sur ces plateformes.
    `
  },

  // --- MISSIONS ACTIVATION (communautaires, disponibles au lancement) ---
  {
    id: "profil-complet",
    title: "Profil Complet",
    shortDesc: "Complète ton profil pour activer ta présence sur le réseau.",
    description: "Ton profil est ton identité sur HASHCODE. Remplis ta bio, ajoute tes liens et précise tes objectifs pour être visible des autres membres.",
    xpReward: 50,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Remplir ta bio dans les paramètres.",
      "Ajouter au moins un lien externe (GitHub, LinkedIn ou portfolio).",
    ],
    type: "INTRO",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "15min",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Capture d'écran de ton profil complété"],
    fullBriefing: `
# Mission : Profil Complet

Ton profil HASHCODE est ta carte d'identité dans la communauté. Sans lui, tu es invisible. C'est la première mission que chaque membre doit accomplir.

### Instructions
1. Va dans **Paramètres → Identité** et remplis ta bio (minimum 2 lignes).
2. Ajoute au moins **un lien externe** : GitHub, LinkedIn, portfolio ou tout autre lien professionnel.
3. Vérifie que ton pseudo est unique et mémorisable.

### Critères de validation
- Bio remplie et cohérente avec ton profil.
- Au moins un lien externe valide.
    `
  },
  {
    id: "squad-genesis",
    title: "Genèse du Squad",
    shortDesc: "Rejoins ou crée ton premier squad pour ne pas avancer seul.",
    description: "Sur HASHCODE, on ne build pas en solo. Crée ton squad ou rejoins celui d'un membre via son lien d'invitation. Ensemble, votre cohésion monte plus vite.",
    xpReward: 100,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Créer un squad via la page Squad, ou rejoindre un squad existant via un lien d'invitation.",
    ],
    type: "NETWORK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "10min",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Nom de ton squad ou lien d'invitation utilisé"],
    fullBriefing: `
# Mission : Genèse du Squad

Sur HASHCODE, personne ne build seul. Un squad, c'est ton équipe de co-création : 5 membres synchronisés qui progressent ensemble, partagent leurs ressources et décuplent leur impact.

### Instructions
**Option A — Créer ton squad :**
1. Va sur la page **Squad** dans le menu de navigation.
2. Clique sur **"Initialiser le protocole"**.
3. Personnalise le nom et le lien d'invitation de ton squad (si tu es Leader).

**Option B — Rejoindre un squad :**
1. Obtiens un lien d'invitation d'un membre de la communauté.
2. Clique sur le lien et accepte l'invitation.

### Critères de validation
- Être membre actif d'un squad (créé ou rejoint).
    `
  },
  {
    id: "invite-pioneer",
    title: "Recrutement Pioneer",
    shortDesc: "Invite le premier membre de ton réseau dans la communauté.",
    description: "Les meilleures communautés grandissent par cooptation. Partage ton lien d'invite personnel et accueille un premier bâtisseur dans HASHCODE.",
    xpReward: 75,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Partager ton lien d'invite (disponible sur la page Squad).",
      "Un nouveau membre rejoint HASHCODE via ton lien.",
    ],
    type: "NETWORK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "5min",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Pseudo du membre que tu as invité"],
    fullBriefing: `
# Mission : Recrutement Pioneer

Chaque grand réseau a commencé par une première invitation. Tu es l'un des pionniers de HASHCODE — c'est à toi de faire grandir la tribu.

### Instructions
1. Va sur la page **Squad** et copie ton lien d'invitation personnel.
2. Envoie-le à quelqu'un de ton réseau qui mérite de rejoindre HASHCODE (développeur, designer, entrepreneur, marketer, etc.).
3. Attends qu'il crée son compte via ton lien.

### Critères de validation
- Un membre rejoint HASHCODE via ton lien d'invitation unique.
- Note le pseudo de ce nouveau membre pour valider ta mission.
    `
  },

  // --- PREMIÈRE PREUVE DE MAÎTRISE (remplace les 9 missions profil-spécifiques) ---
  {
    id: "premiere-preuve-maitrise",
    title: "Première Preuve de Maîtrise",
    shortDesc: "Ton premier livrable concret, adapté à ton profil.",
    description: "HASHCODE n'est pas un réseau de déclarations d'intention. C'est un réseau de preuves. Produis ton premier livrable concret selon les standards de ta guilde.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: [
      "Un livrable public correspondant à ton profil (lien requis).",
      "2-3 lignes expliquant ce que tu as voulu prouver.",
    ],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "3h",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien vers ton livrable", "Explication de ce que tu as voulu prouver (2-3 lignes)"],
    fullBriefing: `## Contexte
HASHCODE n'est pas un réseau de déclarations d'intention. C'est un réseau de preuves. Chaque profil a ses standards — cette mission te demande de respecter les tiens.

## Objectif
Produire un premier livrable concret, public et personnel, selon les critères de ta guilde.

## Étapes suggérées par guilde

🛠️ **Builders** — Partage un projet personnel avec un repo GitHub public :
1. Crée ou prépare un repo avec un README qui explique ce que fait le projet et comment le lancer
2. Assure-toi d'avoir minimum 5 commits réels (pas un seul "initial commit")
3. Le code doit être fonctionnel sur la branche main

🎨 **Creators** — Publie un contenu original lié à ton domaine :
1. Rédige un article, crée une vidéo, un design ou une série de posts
2. Publie-le sur une plateforme publique (blog, Medium, LinkedIn, Behance, YouTube…)
3. Le contenu doit être ta propre création (pas un repost ni de la curation)

🧠 **Strategists** — Rédige une analyse d'une page sur un marché ou une opportunité :
1. Identifie le problème, les acteurs en présence et ton angle d'attaque
2. Inclus au moins une donnée chiffrée avec sa source
3. Termine par une conclusion actionnable (pas juste descriptive)

🗣️ **Catalysts** — Documente une mise en relation ou une connexion que tu as créée :
1. Présente le contexte : qui, pourquoi, comment tu les as connectés
2. Décris le résultat concret de cette connexion
3. Obtiens un témoignage ou une confirmation d'au moins une des parties

## Critères d'acceptation
- Le livrable correspond au profil déclaré
- Le travail est clairement personnel (non généré, non copié)
- L'objectif spécifique à la guilde est atteint selon les critères ci-dessus`
  },

  // --- MISSIONS UNIVERSELLES ---
  {
    id: "uni-01-portfolio-launch",
    title: "Mise en Orbite : Le Portfolio Actif",
    shortDesc: "Prouve ta valeur en publiant ton espace personnel en ligne.",
    description: "Le monde doit savoir qui tu es. Déploie un site web personnel (portfolio, blog, ou landing page) et prouve ton expertise selon les standards de ta Guilde.",
    xpReward: 250,
    requiredLevel: 2,
    targetLevel: 2,
    requirements: ["URL publique et fonctionnelle.", "Validation de l'objectif spécifique à ta Guilde."],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "4h",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "LIVE_URL",
    deliverables: ["URL du projet", "Explication de ton choix de guilde (2 lignes)"],
    fullBriefing: `
# Mission Universelle 01 : Mise en Orbite

Un profil Hashcode n'est rien sans preuve de travail. Ta première mission est de déployer un espace personnel en ligne (Portfolio ou Landing Page).
Cependant, l'évaluation dépendra de la Guilde que tu as rejointe.

### Objectifs par Guilde (Choisis celui de ton profil) :
* 🛠️ **Guilde des Builders :** Le design n'a pas d'importance. Prouve-nous que ton code est propre. Déploie via GitHub Pages/Railway, mets en place ton repo GitHub proprement, et obtiens un score Lighthouse de 90+ en performance.
* 🎨 **Guilde des Creators :** La technique passe au second plan. On veut voir une identité visuelle marquante. Un Dark Mode soigné, une typographie parfaite, et au moins une micro-animation (Framer Motion ou CSS pur).
* 🧠 **Guilde des Strategists :** On veut voir de l'impact. Ton site doit être optimisé pour le SEO (balises meta parfaites) et intégrer un outil d'Analytics (Google Analytics, Plausible) pour traquer tes visiteurs.
* 🗣️ **Guilde des Catalysts :** Le site n'est qu'un prétexte. Ta mission est de déployer la page, puis d'écrire un post LinkedIn ou Twitter pour annoncer son lancement et d'attirer au moins 20 visiteurs uniques le premier jour.

### Critères de validation (Généraux)
- L'URL doit être publique.
- Le projet ne doit pas crasher.
    `
  },
  {
    id: "uni-02-audit-teardown",
    title: "Le Diagnostic : Audit de l'Existant",
    shortDesc: "Analyser pour mieux reconstruire.",
    description: "Prends un projet open-source, le site d'une entreprise locale, ou un de tes anciens projets, et audite-le sous le prisme de ta Guilde.",
    xpReward: 300,
    requiredLevel: 3,
    targetLevel: 3,
    requirements: ["Le lien vers le projet audité.", "Un rapport contenant 3 problèmes identifiés et 3 solutions proposées."],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "3h",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Lien du rapport d'audit (Notion, PDF ou GitHub Gist)"],
    fullBriefing: `
# Mission Universelle 02 : Le Diagnostic

Les meilleurs professionnels savent lire l'existant avant de créer du nouveau. Choisis un projet numérique existant (site web, app, repo open-source) et réalise un audit complet.

### L'angle d'attaque de ta Guilde :
* 🛠️ **Builders :** Fais un audit de la dette technique ou de la sécurité. Pointe les vulnérabilités (XSS, Auth faible) ou les requêtes lentes, et propose une refonte architecturale.
* 🎨 **Creators :** Fais un audit UX/UI. Quels sont les points de friction ? L'accessibilité est-elle respectée ? Propose un wireframe ou un nouveau design system pour réparer ça.
* 🧠 **Strategists :** Fais un audit du Business Model et du Funnel de conversion. Où perdent-ils des clients ? Propose une stratégie Go-To-Market ou de rétention ambitieuse et orientée impact.
* 🗣️ **Catalysts :** Fais un audit du positionnement communautaire et de la marque. Leur communication est-elle plate ? Propose une stratégie de création de contenu et de distribution virale.

### Critères de validation
- Le rapport doit être lisible, clair, et aller droit au but (pas de blabla).
- Les solutions proposées doivent être réalistes et actionnables.
    `
  },
  {
    id: "uni-03-cross-pollination",
    title: "Projet Inter-Guildes",
    shortDesc: "Co-construis quelque chose de réel avec un profil différent.",
    description: "Forme un binôme avec un membre d'une autre Guilde et co-construisez un livrable commun sur 2 semaines minimum. Le projet doit être visible, utilisable ou publiable.",
    xpReward: 400,
    requiredLevel: 4,
    targetLevel: 4,
    requirements: [
      "Le pseudo du co-créateur et sa Guilde.",
      "Lien vers le livrable co-construit.",
      "Répartition claire des rôles dans le projet.",
      "Bilan de ce que chaque profil a apporté (3-5 lignes).",
    ],
    type: "NETWORK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "PRO",
    duration: "2 semaines",
    weightBuilder: 0.20,
    weightCreator: 0.20,
    weightStrategist: 0.20,
    weightCatalyst: 0.40,
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien vers le livrable commun", "Bilan de collaboration (rôles + apprentissages)"],
    fullBriefing: `## Contexte
Un échange de compétences (Échange de Compétences, niveau CORE) c'est bien. Un projet co-construit, c'est différent. Ici, il s'agit de produire quelque chose ensemble qui n'aurait pas existé sans la complémentarité de vos deux profils.

## Objectif
Co-construire un livrable réel, visible et utilisable avec un membre d'une Guilde différente — en assumant pleinement votre complémentarité.

## Ce que "livrable réel" signifie
- Un produit en ligne (landing page, outil, app)
- Un contenu publié (article, vidéo, guide, newsletter)
- Une ressource communautaire (template, dataset, framework)
- Un projet open-source avec README et usage réel

## Exemples de binômes productifs
| Binôme | Ce qu'ils peuvent produire |
|---|---|
| Builder + Creator | Un SaaS ou app avec une interface soignée |
| Strategist + Creator | Un contenu de marque avec une analyse de marché intégrée |
| Builder + Catalyst | Un outil communautaire déployé et adopté |
| Strategist + Builder | Un MVP validé par la donnée |

## Instructions
1. Identifie un co-créateur avec un profil complémentaire au tien
2. Définis ensemble le projet en 1 session de cadrage (30-60 min max)
3. Travaillez sur 2 semaines minimum avec au moins 2 points de sync
4. Publiez ou déployez le livrable
5. Documentez la répartition des rôles et ce que le cross-profil vous a apporté

## Critères d'acceptation
- Le livrable est public et accessible
- Les deux rôles sont clairement distincts (pas un simple "on a travaillé ensemble")
- Le bilan montre une réelle complémentarité inter-guildes exploitée`
  },

  // --- MISSIONS CORE SOLO ---
  {
    id: "core-transmission-savoir",
    title: "Transmission de Savoir",
    shortDesc: "Enseigne ce que tu sais. Solidifie ce que tu maîtrises.",
    description: "Rédige un tutoriel, un guide ou un article qui enseigne quelque chose de concret dans ton domaine. Publie-le publiquement et partage-le dans la communauté.",
    xpReward: 200,
    requiredLevel: 2,
    targetLevel: 2,
    requirements: [
      "Un contenu pédagogique publié publiquement (article, guide, vidéo, thread).",
      "Le contenu doit enseigner une compétence ou un concept précis.",
      "Lien vers la publication.",
    ],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "2-3h",
    weightBuilder: 0.25,
    weightCreator: 0.30,
    weightStrategist: 0.25,
    weightCatalyst: 0.20,
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien vers le contenu publié", "En une phrase : ce que le lecteur/spectateur apprend"],
    fullBriefing: `## Contexte
Enseigner est la meilleure façon de valider une maîtrise. Si tu ne peux pas l'expliquer simplement, tu ne le comprends pas vraiment. Cette mission te demande de produire un contenu pédagogique réel — pas un résumé générique, mais quelque chose d'utile pour quelqu'un qui apprend.

## Objectif
Publier un contenu qui enseigne une compétence ou un concept précis dans ton domaine, adapté à ton profil.

## Le contenu doit être
- **Ciblé** : une seule compétence ou un seul concept, pas un survol général
- **Actionnable** : le lecteur peut appliquer ce qu'il apprend immédiatement
- **Original** : ta perspective, ton expérience, pas un copier-coller de documentation

## Formats acceptés par Guilde

🛠️ **Builders** — Tutoriel technique :
1. Choisis une librairie, un pattern ou un concept que tu maîtrises
2. Écris un tutoriel étape par étape avec exemples de code réels (GitHub Gist, article, README)
3. Teste le tutoriel sur un projet vierge pour confirmer qu'il fonctionne

🎨 **Creators** — Guide visuel ou template :
1. Crée un guide visuel (Figma, Canva, PDF) ou un template réutilisable
2. Inclus une explication de tes choix (pourquoi ce layout, cette palette, cette typo)
3. Publie sur Behance, Notion, ou un lien public

🧠 **Strategists** — Framework ou playbook :
1. Formalise un process ou un cadre de décision que tu utilises
2. Structure-le en étapes claires avec des exemples concrets
3. Publie sur Notion, LinkedIn ou Medium

🗣️ **Catalysts** — Case study communautaire :
1. Documente comment tu as lancé, développé ou animé une communauté ou un groupe
2. Partage les tactiques qui ont fonctionné et celles qui ont échoué
3. Publie sous forme d'article ou de thread LinkedIn/X

## Critères d'acceptation
- Le contenu est publié et accessible via un lien
- Il enseigne quelque chose de précis (pas un survol)
- Il est clairement le tien (ton expérience, ton angle)`
  },
  {
    id: "core-veille-strategique",
    title: "Veille Stratégique",
    shortDesc: "Analyse un marché, une tendance ou un écosystème dans ton domaine.",
    description: "Produis une analyse structurée d'un sujet de ton domaine : tendance tech, marché émergent, outil, ou évolution d'un écosystème. Pas de survol — un vrai point de vue avec des données.",
    xpReward: 250,
    requiredLevel: 3,
    targetLevel: 3,
    requirements: [
      "Un sujet précis et délimité (pas générique).",
      "Au moins 3 sources citées.",
      "Une conclusion avec ton point de vue personnel.",
      "Lien vers le document ou la publication.",
    ],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "2-4h",
    weightBuilder: 0.20,
    weightCreator: 0.20,
    weightStrategist: 0.40,
    weightCatalyst: 0.20,
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Lien vers l'analyse (Notion, PDF, article)", "Le sujet analysé en une phrase"],
    fullBriefing: `## Contexte
Les meilleurs professionnels tech ne réagissent pas à l'actualité — ils l'anticipent. La veille stratégique est une compétence rare : savoir lire les signaux faibles, les croiser avec des données, et en tirer une perspective actionnelle.

## Objectif
Produire une analyse structurée d'un sujet précis dans ton domaine — avec des données, un angle clair, et un point de vue personnel.

## Le sujet doit être
- **Précis** : pas "l'IA en Afrique" mais "l'adoption des LLMs par les fintech africaines en 2025"
- **Délimité** : un marché, un outil, une tendance, un acteur — pas tout à la fois
- **Pertinent** : quelque chose qui impacte ton travail ou ta communauté

## Angle d'analyse par Guilde

🛠️ **Builders — Analyse technique :**
Compare 3 outils, frameworks ou architectures sur un cas d'usage précis. Documente les trade-offs, les cas où chaque option gagne, et ta recommandation finale.

🎨 **Creators — Analyse de tendance visuelle ou éditoriale :**
Identifie une tendance émergente dans le design, le contenu ou les médias. Montre des exemples concrets, analyse pourquoi ça monte, et préds ce qui vient ensuite.

🧠 **Strategists — Analyse de marché ou business model :**
Évalue un marché ou un acteur : taille, dynamiques, avantages compétitifs, angles d'entrée. Inclus au moins une donnée chiffrée et une recommandation actionnable.

🗣️ **Catalysts — Cartographie d'écosystème :**
Mappe les acteurs clés d'un écosystème (communauté, secteur, réseau) : qui influence qui, quels sont les hubs, où est l'énergie. Propose une stratégie de positionnement dans cet écosystème.

## Structure recommandée
1. **Contexte** — Pourquoi ce sujet maintenant ?
2. **Analyse** — Ce que les données et les signaux montrent
3. **Implications** — Ce que ça change pour ton domaine
4. **Point de vue** — Ta prise de position personnelle

## Critères d'acceptation
- Le sujet est précis et délimité
- Au moins 3 sources sont citées (liens, études, données)
- La conclusion contient ton point de vue (pas juste une description)
- Le document est lisible et structuré`
  },

  // --- HYBRID CHALLENGES ---
  {
    id: "h1-hackathon-48h",
    title: "Hackathon 48h",
    shortDesc: "Construis, crée, stratégie — ensemble.",
    description: "Forme une équipe de 2-4 profils différents et construis un prototype fonctionnel en 48h. Pitch le résultat à la communauté.",
    xpReward: 600,
    requiredLevel: 4,
    targetLevel: 4,
    requirements: [
      "Composition de l'équipe (minimum 2 profils différents).",
      "Lien vers le prototype ou la démo.",
      "Lien vers le pitch (slides ou vidéo).",
    ],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "PRO",
    duration: "48h",
    weightBuilder: 0.3,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.2,
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien du projet", "Pitch Slides/Vidéo", "Liste des membres de l'équipe"],
    fullBriefing: `
# Mission : Hackathon 48h

L'épreuve de feu. Travaille sous pression pour sortir un produit minimum viable.

### Instructions
1. Trouve des partenaires avec des profils complémentaires (ex: 1 Builder, 1 Creator, 1 Strategist).
2. Définissez un problème à résoudre.
3. Construisez le prototype en 48 heures chronos.
4. Présentez-le lors de la session de pitch communautaire.

### Critères de validation
- Prototype fonctionnel.
- Collaboration interdisciplinaire visible.
    `
  },
  {
    id: "h2-cross-profile-collab",
    title: "Échange de Compétences",
    shortDesc: "Résous un problème concret avec un profil différent du tien.",
    description: "Trouve un membre d'une autre Guilde et organisez un échange de compétences ciblé : tu l'aides sur un problème de ton domaine, il t'aide sur un problème du sien. Un livrable de chaque côté.",
    xpReward: 400,
    requiredLevel: 3,
    targetLevel: 3,
    requirements: [
      "Le pseudo du membre de l'autre Guilde.",
      "Description du problème que tu as résolu pour lui.",
      "Description du problème qu'il a résolu pour toi.",
      "Preuve de l'échange (capture, doc, lien).",
    ],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "3-5 jours",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "ANY_LINK",
    deliverables: ["Preuve de l'échange bidirectionnel", "Ce que tu as appris de l'autre guilde (2-3 lignes)"],
    fullBriefing: `## Contexte
Les meilleurs acteurs tech ne restent pas dans leur silo. Cette mission te force à sortir de ton domaine et à créer de la valeur pour quelqu'un qui pense différemment — en échange de valeur pour toi.

## Objectif
Organiser un échange de compétences ciblé avec un membre d'une Guilde différente. Chacun résout un problème concret pour l'autre.

## Instructions

**Étape 1 — Identifier le binôme**
Trouve un membre actif d'une Guilde différente de la tienne. Les paires les plus productives :
- Builder + Creator (technique ↔ design/contenu)
- Strategist + Catalyst (analyse ↔ réseau/activation)
- Builder + Strategist (produit ↔ go-to-market)

**Étape 2 — Définir les problèmes**
Chacun identifie UN problème concret et limité qu'il n'arrive pas à résoudre seul :
- Ex: "J'ai un bug CSS que je n'arrive pas à isoler" (Builder pour Creator)
- Ex: "J'ai besoin d'une analyse concurrente pour mon marché" (Creator pour Strategist)

**Étape 3 — Échanger**
Organisez un call ou échangez de façon asynchrone. L'objectif est que chacun reparte avec son problème résolu (ou avancé).

**Étape 4 — Documenter**
Capture l'échange : screenshot de conversation, document partagé, lien vers la PR/le Figma commenté.

## Angle par Guilde
- 🛠️ **Builders** : Aide sur du code, un setup technique, une architecture — et demande en échange du feedback sur ton UX ou ton positionnement.
- 🎨 **Creators** : Aide sur un design, un contenu, une story — et demande en échange un audit technique ou une analyse stratégique.
- 🧠 **Strategists** : Aide sur une analyse, un business model, une roadmap — et demande en échange un support créatif ou une mise en réseau.
- 🗣️ **Catalysts** : Aide à connecter des personnes, animer une dynamique — et demande en échange une compétence technique ou créative spécifique.

## Critères d'acceptation
- L'échange est réel et bidirectionnel (les deux membres en bénéficient)
- Le problème résolu est concret, pas générique
- Tu articules ce que tu as appris de l'autre discipline`
  },
  {
    id: "h3-community-project",
    title: "Projet Communautaire",
    shortDesc: "Crée quelque chose pour la communauté HASHCODE.",
    description: "Initie ou co-construis un projet qui bénéficie directement à la communauté : ressource, outil, guide, événement ou initiative à impact collectif.",
    xpReward: 500,
    requiredLevel: 4,
    targetLevel: 4,
    requirements: [
      "Description du projet et de son impact communautaire.",
      "Livrable accessible à tous les membres.",
    ],
    type: "NETWORK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "PRO",
    duration: "3 semaines",
    weightBuilder: 0.2,
    weightCreator: 0.25,
    weightStrategist: 0.2,
    weightCatalyst: 0.35,
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien vers la ressource / outil communautaire"],
    fullBriefing: `
# Mission : Projet Communautaire

Laisse une trace durable dans l'histoire de HASHCODE.

### Instructions
1. Identifie un manque dans la communauté (ex: pas d'annuaire des outils, besoin d'un guide de survie freelance).
2. Forme une équipe si nécessaire.
3. Produis et livre la ressource.
4. Assure son adoption par les membres.

### Critères de validation
- Utilité publique démontrée.
- Qualité de finition.
    `
  },
  {
    id: "h1-solve-real-problem",
    title: "Résoudre un problème réel",
    shortDesc: "Passe de l'idée à la solution concrète.",
    description: "Identifie un problème concret dans ton environnement et apporte une solution adaptée à ton profil.",
    xpReward: 200,
    requiredLevel: 2,
    targetLevel: 3,
    requirements: [
      "Description du problème réel observé (contexte précis).",
      "Preuve de ta solution : lien, document ou description détaillée.",
      "Résultat obtenu ou attendu avec indicateur mesurable.",
    ],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "1 semaine",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "ANY_LINK",
    deliverables: ["Description du problème", "Lien ou document de ta solution", "Résultat / impact mesuré"],
    fullBriefing: `## Contexte
Les meilleurs acteurs tech ne résolvent pas des exercices — ils résolvent de vrais problèmes. Cette mission valide ta capacité à identifier une friction réelle et à passer à l'action.

## Objectif
Trouver un problème concret dans ton environnement, produire une solution adaptée à ton profil, et documenter l'impact.

## Le problème doit être réel
- Quelque chose que tu as observé ou vécu (pas un cas fictif ou générique)
- Une vraie friction : process manuel, manque d'information, frustration récurrente
- Contexte précis : ta ville, ton école, ton secteur, ta communauté, ton équipe

## Étapes suggérées par guilde

🛠️ **Builders** — Développe un outil ou un script qui automatise ou résout le problème. Même petit, même basique — mais fonctionnel, avec le code partagé et le problème expliqué dans le README.

🎨 **Creators** — Crée un contenu (guide visuel, vidéo explicative, template) qui résout un problème de communication ou d'accès à l'information. Mesure l'engagement ou le feedback reçu.

🧠 **Strategists** — Rédige un plan d'action structuré avec des étapes concrètes, des ressources nécessaires et un indicateur de succès. Le plan doit être assez précis pour être exécutable par quelqu'un d'autre.

🗣️ **Catalysts** — Mobilise les bonnes personnes autour du problème et documente les premières étapes d'une initiative collective : qui tu as contacté, comment, et quelle réponse tu as obtenu.

## Critères d'acceptation
- Le problème est réel et le contexte est précis (pas générique)
- La solution est concrète et adaptée au profil déclaré
- L'impact est décrit, même modeste — un chiffre, un témoignage, un avant/après`
  }
];

export interface WeeklyChallenge {
  id: string;
  title: string;
  shortDesc: string;
  xp: number;
  type: MissionType;
  submissionMethod: Mission["submissionMethod"];
  targetProfiles: UserProfile[];
  weeklySlot: number | null;
}

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: "weekly-share-resource",
    title: "Partage une ressource",
    shortDesc: "Un article, une vidéo, un outil qui t'a été utile cette semaine.",
    xp: 30,
    type: "GENERAL",
    submissionMethod: "TEXT_RESPONSE",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    weeklySlot: null,
  },
  {
    id: "weekly-tech-problem",
    title: "Un problème, une idée",
    shortDesc: "Décris un problème tech que tu observes dans ton environnement.",
    xp: 25,
    type: "GENERAL",
    submissionMethod: "TEXT_RESPONSE",
    targetProfiles: ["builder", "strategist"],
    weeklySlot: null,
  },
  {
    id: "weekly-share-project",
    title: "Montre ton travail",
    shortDesc: "Partage le lien d'un projet ou commit récent. Peu importe la taille.",
    xp: 35,
    type: "CODE",
    submissionMethod: "GITHUB_REPO",
    targetProfiles: ["builder", "creator"],
    weeklySlot: null,
  },
  {
    id: "weekly-squad-checkin",
    title: "Check-in squad",
    shortDesc: "Fais un check-in quotidien avec ton squad pour maintenir la cohésion.",
    xp: 20,
    type: "GENERAL",
    submissionMethod: "TEXT_RESPONSE",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    weeklySlot: null,
  },
];

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getCurrentWeeklyChallenge(): WeeklyChallenge {
  const weekNumber = getWeekNumber(new Date());
  return WEEKLY_CHALLENGES[weekNumber % WEEKLY_CHALLENGES.length];
}

export function getCurrentCycleKey(mission?: { isWeeklyChallenge: boolean }): string {
  if (!mission || !mission.isWeeklyChallenge) return "PERMANENT";
  const now = new Date();
  const year = now.getFullYear();
  const week = getWeekNumber(now);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

export const XP_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 400,
  4: 1400
};

const fs = require('fs');
const file = 'prisma/seed.ts';
let content = fs.readFileSync(file, 'utf8');

const newMissions = `  {
    id: "uni-01-portfolio-launch",
    slug: "uni-01-portfolio-launch",
    title: "Mise en Orbite : Le Portfolio Actif",
    shortDesc: "Prouve ta valeur en publiant ton espace personnel en ligne.",
    description: "Le monde doit savoir qui tu es. Déploie un site web personnel (portfolio, blog, ou landing page) et prouve ton expertise selon les standards de ta Guilde.",
    category: "core",
    difficulty: 2,
    xp: 250,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "4h",
    requirements: ["URL publique et fonctionnelle.", "Validation de l'objectif spécifique à ta Guilde."],
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "LIVE_URL",
    deliverables: ["URL du projet", "Explication de ton choix de guilde (2 lignes)"],
    fullBriefing: \`
# Mission Universelle 01 : Mise en Orbite

Un profil Hashcode n'est rien sans preuve de travail. Ta première mission est de déployer un espace personnel en ligne (Portfolio ou Landing Page).
Cependant, l'évaluation dépendra de la Guilde que tu as rejointe.

### Objectifs par Guilde (Choisis celui de ton profil) :
* 🛠️ **Guilde des Builders :** Le design n'a pas d'importance. Prouve-nous que ton code est propre. Déploie via Vercel/Railway, mets en place ton repo GitHub proprement, et obtiens un score Lighthouse de 90+ en performance.
* 🎨 **Guilde des Creators :** La technique passe au second plan. On veut voir une identité visuelle marquante. Un Dark Mode soigné, une typographie parfaite, et au moins une micro-animation (Framer Motion ou CSS pur).
* 🧠 **Guilde des Strategists :** On veut voir de l'impact. Ton site doit être optimisé pour le SEO (balises meta parfaites) et intégrer un outil d'Analytics (Google Analytics, Plausible) pour traquer tes visiteurs.
* 🗣️ **Guilde des Catalysts :** Le site n'est qu'un prétexte. Ta mission est de déployer la page, puis d'écrire un post LinkedIn ou Twitter pour annoncer son lancement et d'attirer au moins 20 visiteurs uniques le premier jour.

### Critères de validation (Généraux)
- L'URL doit être publique.
- Le projet ne doit pas crasher.
    \`,
  },
  {
    id: "uni-02-audit-teardown",
    slug: "uni-02-audit-teardown",
    title: "Le Scalpel : Audit de l'Existant",
    shortDesc: "Détruis pour mieux reconstruire.",
    description: "Prends un projet open-source, le site d'une entreprise locale, ou un de tes anciens projets, et audite-le sous le prisme de ta Guilde.",
    category: "core",
    difficulty: 3,
    xp: 300,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "3h",
    requirements: ["Le lien vers le projet audité.", "Un rapport contenant 3 problèmes identifiés et 3 solutions proposées."],
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Lien du rapport d'audit (Notion, PDF ou GitHub Gist)"],
    fullBriefing: \`
# Mission Universelle 02 : Le Scalpel

Les meilleurs professionnels savent lire l'existant avant de créer du nouveau. Choisis un projet numérique existant (site web, app, repo open-source) et réalise un audit complet.

### L'angle d'attaque de ta Guilde :
* 🛠️ **Builders :** Fais un audit de la dette technique ou de la sécurité. Pointe les vulnérabilités (XSS, Auth faible) ou les requêtes lentes, et propose une refonte architecturale.
* 🎨 **Creators :** Fais un audit UX/UI. Quels sont les points de friction ? L'accessibilité est-elle respectée ? Propose un wireframe ou un nouveau design system pour réparer ça.
* 🧠 **Strategists :** Fais un audit du Business Model et du Funnel de conversion. Où perdent-ils des clients ? Propose une stratégie Go-To-Market ou de rétention plus agressive.
* 🗣️ **Catalysts :** Fais un audit du positionnement communautaire et de la marque. Leur communication est-elle plate ? Propose une stratégie de création de contenu et de distribution virale.

### Critères de validation
- Le rapport doit être lisible, clair, et aller droit au but (pas de blabla).
- Les solutions proposées doivent être réalistes et actionnables.
    \`,
  },
  {
    id: "uni-03-cross-pollination",
    slug: "uni-03-cross-pollination",
    title: "Pollinisation Croisée",
    shortDesc: "Sors de ta zone de confort avec un pair.",
    description: "Trouve un membre d'une autre Guilde sur Hashcode. Aidez-vous mutuellement sur une problématique spécifique à votre expertise.",
    category: "community",
    difficulty: 4,
    xp: 400,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "PRO",
    duration: "1 semaine",
    requirements: ["Le pseudo du membre avec qui tu as collaboré.", "La preuve de l'échange (Screenshot de PR, document collaboratif, etc.)."],
    weightBuilder: 0.20,
    weightCreator: 0.20,
    weightStrategist: 0.20,
    weightCatalyst: 0.40,
    submissionMethod: "ANY_LINK",
    deliverables: ["Preuve de la collaboration", "Bilan de ce que tu as appris de l'autre guilde"],
    fullBriefing: \`
# Mission Universelle 03 : Pollinisation Croisée

L'élite technologique n'est jamais isolée. Ta force réside dans ta capacité à parler le langage des autres disciplines. 

### Instructions
1. Identifie un membre actif qui appartient à une Guilde DIFFÉRENTE de la tienne.
2. Propose-lui un échange de compétences (Ex: "Je suis Builder, je te règle ton problème de base de données si tu m'aides à améliorer le design de ma page d'accueil (Creator)").
3. Réalisez cet échange de manière asynchrone ou lors d'un call.

### Critères de validation
- La preuve du travail accompli ensemble (Lien vers une Pull Request, un Figma commenté, etc.).
- Les deux membres de la collaboration obtiendront les points d'XP pour cette mission !
    \`,
  },`;

content = content.replace(/\/\/ ─── BUILDER \(B1 → B7\)[\s\S]*?\/\/ ─── HYBRID CHALLENGES \(H1 → H3\)/, '// ─── MISSIONS UNIVERSELLES (MVP PHASE) ───────────────────────────────────\n\n' + newMissions + '\n\n  // ─── HYBRID CHALLENGES (H1 → H3)');
fs.writeFileSync(file, content);

import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface GitHubIssue {
  title: string;
  labels: string[];
  body: string;
}

const ISSUES: GitHubIssue[] = [
  // ─── ÉTAPE 1 — DB & TYPES ──────────────────────────────────────────────────

  {
    title: "[SPEC] Nouveaux champs DB + types TypeScript pour le système de spécialisation",
    labels: ["type: db-schema", "type: dx", "priority: critical", "area: platform"],
    body: `## Contexte

Le système de spécialisation actuel stocke \`domains\`, \`tools\` et \`technicalLevel\` mais ces champs sont insuffisants pour supporter un quiz de spécialisation complet avec sous-domaines, certifications et recommandations de missions.

## Objectif

Ajouter les champs DB nécessaires et mettre à jour les types TypeScript pour supporter l'identité complète **Profil × Spécialisation × Niveau**.

## Changements Prisma

\`\`\`prisma
model User {
  // Existants — conserver
  domains          String[]
  tools            String[]
  technicalLevel   String?    // BEGINNER | INTERMEDIATE | ADVANCED

  // NOUVEAUX
  primaryDomain    String?    // domaine principal — ex: "Cybersecurity"
  subDomain        String?    // sous-domaine — ex: "offensive"
  learningTools    String[]   // outils en cours d'apprentissage (≠ maîtrisés)
  practiceMode     String?    // "github" | "ctf_platform" | "learning_platform" | "team"
  certifications   String[]   // ex: ["OSCP", "AWS-SAA", "CEH"]
  specializationAt DateTime?  // date de passage du quiz spécialisation
}
\`\`\`

Commande : \`npx prisma migrate dev --name add-specialization-fields\`

## Nouveaux types dans \`lib/types.ts\`

\`\`\`typescript
export type PrimaryDomain =
  | "Web" | "Cybersecurity" | "Cloud" | "IA"
  | "Mobile" | "Automation" | "UI/UX" | "Web3" | "Data" | "DevOps"

export type SubDomain =
  // Web
  | "frontend" | "backend" | "fullstack" | "web3"
  // Cybersec
  | "offensive" | "defensive" | "appsec" | "crypto"
  // Cloud
  | "cloud" | "containers" | "iac" | "sre"
  // IA
  | "ml" | "llm" | "data-eng" | "analytics"

export type PracticeMode = "github" | "ctf_platform" | "learning_platform" | "team"

export const TECH_TREE_V2: Record<PrimaryDomain, {
  subDomains: SubDomain[]
  tools: string[]
  platforms?: string[]
}> = {
  Cybersecurity: {
    subDomains: ["offensive", "defensive", "appsec", "crypto"],
    tools: [
      "Kali Linux", "Metasploit", "Burp Suite", "Nmap", "SQLmap",
      "Wireshark", "Aircrack-ng", "Gobuster", "Hydra", "ELK Stack",
      "Splunk", "Snort", "Suricata", "OWASP ZAP", "Semgrep", "Nuclei",
      "OpenSSL", "Hashcat", "CyberChef"
    ],
    platforms: ["HackTheBox", "TryHackMe", "Root-Me", "CTFtime", "PicoCTF", "PortSwigger"]
  },
  Web: {
    subDomains: ["frontend", "backend", "fullstack", "web3"],
    tools: [
      "Next.js", "React", "Vue.js", "TypeScript", "Tailwind",
      "Node.js", "Express", "NestJS", "FastAPI", "PostgreSQL",
      "Redis", "Prisma", "tRPC", "Bun"
    ]
  },
  Cloud: {
    subDomains: ["cloud", "containers", "iac", "sre"],
    tools: [
      "Docker", "Kubernetes", "Terraform", "Ansible", "AWS",
      "GCP", "Azure", "GitHub Actions", "ArgoCD", "Prometheus",
      "Grafana", "Nginx", "Helm", "Pulumi"
    ]
  },
  IA: {
    subDomains: ["ml", "llm", "data-eng", "analytics"],
    tools: [
      "Python", "PyTorch", "LangChain", "LlamaIndex", "CrewAI",
      "Hugging Face", "OpenAI SDK", "Ollama", "Pandas", "dbt",
      "Apache Spark", "Airflow", "Kafka", "BigQuery", "Chroma"
    ]
  },
  Mobile: {
    subDomains: [],
    tools: ["React Native", "Flutter", "Expo", "Swift", "Kotlin"]
  },
  Automation: {
    subDomains: [],
    tools: ["Python", "Bash", "GitHub Actions", "n8n", "Zapier", "Playwright"]
  },
  "UI/UX": {
    subDomains: [],
    tools: ["Figma", "Adobe XD", "Framer", "Spline", "Storybook", "Maze"]
  },
  Web3: {
    subDomains: [],
    tools: ["Solidity", "Ethers.js", "Hardhat", "Wagmi", "Foundry", "IPFS"]
  },
  Data: {
    subDomains: ["data-eng", "analytics"],
    tools: ["SQL", "dbt", "Airflow", "BigQuery", "Metabase", "Superset"]
  },
  DevOps: {
    subDomains: ["containers", "iac", "sre"],
    tools: ["Docker", "Kubernetes", "Terraform", "Prometheus", "Grafana", "Linux"]
  },
}
\`\`\`

## Fichiers à modifier

- \`prisma/schema.prisma\` — nouveaux champs
- \`lib/types.ts\` — PrimaryDomain, SubDomain, PracticeMode, TECH_TREE_V2
- \`lib/tech-tree.ts\` → remplacer par \`lib/tech-tree-v2.ts\`
- \`app/api/user/me/route.ts\` — inclure \`primaryDomain\`, \`subDomain\`, \`certifications\` dans le select
- \`app/api/user/update/route.ts\` — accepter les nouveaux champs dans le Zod schema

## Critères d'acceptation
- [ ] Migration créée et appliquée sans breaking change
- [ ] Tous les nouveaux champs sont optionnels (rétrocompatibilité)
- [ ] \`user/me\` retourne les nouveaux champs
- [ ] \`user/update\` accepte et valide les nouveaux champs
- [ ] Aucun test existant cassé`,
  },

  // ─── ÉTAPE 2 — QUIZ SPÉCIALISATION ─────────────────────────────────────────

  {
    title: "[FEATURE] Quiz de spécialisation — 10 questions avec branching par domaine",
    labels: ["type: feature", "priority: critical", "area: platform"],
    body: `## Contexte

Le quiz de spécialisation actuel est composé de **3 questions superficielles** enfouies dans \`Settings > Expertise\`. 90% des utilisateurs ne le font jamais.

Le nouveau quiz doit être **obligatoire dans le funnel**, juste après le quiz psychométrique.

## Objectif

Créer un quiz de spécialisation de 10 questions avec branching (selon le domaine choisi en Q1), intégré dans le funnel post-quiz psychométrique.

## Funnel cible

\`\`\`
Quiz psychométrique 13Q → Profil assigné
  ↓
Quiz spécialisation 10Q → primaryDomain + subDomain + technicalLevel + tools + learningTools
  ↓
Dashboard — missions recommandées par profil × domaine
\`\`\`

## Structure du quiz

### Q1 — Domaine primaire (obligatoire)
4 options principales + bouton "Voir plus" → Q1b (Mobile, Automation, UI/UX, Web3)

### Q2 — Sous-domaine (branching selon Q1)

**Cybersécurité :** Offensif · Défensif · AppSec · Crypto
**Web :** Frontend · Backend · Fullstack · Web3
**Cloud :** AWS/GCP/Azure · Docker/K8s · CI/CD & IaC · SRE
**IA :** ML Engineering · LLM & Agents · Data Engineering · Analytics

### Q3 — Niveau auto-déclaré
BEGINNER · INTERMEDIATE · ADVANCED (avec descriptions honnêtes)

### Q4 — Outils maîtrisés (multi-select, max 5)
Liste filtrée selon Q1 depuis \`TECH_TREE_V2\`

### Q5 — Outils en cours d'apprentissage (multi-select, max 3)
Options restantes de Q4

### Q6 — Plateforme de pratique principale
Projets perso · Challenges/CTF · Formations en ligne · Équipe/travail
→ Si cybersec + challenges → afficher plateformes : HTB, THM, Root-Me

### Q7 — Objectif dans la spécialisation
Premier job/stage · Montée en niveau · Lancer un projet · Open-source

### Q8 — Mode d'apprentissage préféré
Construire des projets · Résoudre des challenges · Lire + expérimenter · Peer learning

### Q9 — Certifications existantes
Certifs pro · Parcours complétés · Objectif futur · Apprentissage autonome

### Q10 — Expérience terrain
App en production / audit livré → +1 niveau
Projet perso fonctionnel → 0
Projet en cours → 0
Je commence → plancher BEGINNER

## Fichiers à créer/modifier

**Nouveau :**
- \`components/quiz/specialization-quiz.tsx\` — composant 10Q avec branching
- \`app/api/specialization/route.ts\` — POST → sauvegarde en DB
- \`app/specialization/page.tsx\` — page dédiée post-quiz

**Modifier :**
- \`app/quiz/page.tsx\` ou \`middleware.ts\` — ajouter redirect vers /specialization si \`primaryDomain\` null
- \`components/settings/expertise-diagnostic.tsx\` — pointer vers le nouveau quiz

## Critères d'acceptation
- [ ] Quiz de 10 questions avec branching selon Q1
- [ ] Le branching affiche les bonnes options selon le domaine
- [ ] Les résultats sont sauvegardés : primaryDomain, subDomain, technicalLevel, tools, learningTools
- [ ] Le middleware redirige vers /specialization si non complété (après quiz psycho)
- [ ] Accessible depuis Settings pour mise à jour
- [ ] Responsive mobile
- [ ] Temps estimé affiché : "~3 minutes"`,
  },

  // ─── MISSIONS CYBERSÉCURITÉ ─────────────────────────────────────────────────

  {
    title: "[MISSIONS] Cybersécurité INIT — Rapport OWASP Top 10 + Write-up CTF",
    labels: ["type: feature", "priority: high", "area: missions"],
    body: `## Contexte

Aucune mission dédiée à la cybersécurité n'existe dans HASHCODE. Les utilisateurs avec \`primaryDomain = "Cybersecurity"\` ne trouvent aucune mission adaptée à leur spécialisation.

## Objectif

Ajouter 2 missions de niveau INIT pour les profils cybersécurité.

## Mission 1 — Rapport OWASP Top 10

\`\`\`typescript
{
  id: "cyber-owasp-top10",
  title: "Rapport OWASP Top 10",
  slug: "rapport-owasp-top10",
  category: "CYBERSECURITY",
  difficulty: "INTERMEDIATE",
  stage: "INIT",
  xp: 75,
  domains: ["Cybersecurity"],
  techLevel: "BEGINNER",
  submissionMethod: "DOCUMENT_LINK",
  profileWeights: { builder: 0.3, creator: 0.2, strategist: 0.4, catalyst: 0.1 },
  briefing: \`
    Rédige un rapport de 1-2 pages expliquant les 3 vulnérabilités OWASP Top 10
    que tu considères les plus critiques en 2025.
    Pour chacune : description, exemple d'attaque réel, impact business, contre-mesure.
  \`,
  deliverables: [
    "Document PDF ou Markdown (min 800 mots)",
    "3 vulnérabilités OWASP analysées en profondeur",
    "1 exemple concret par vulnérabilité (CVE ou cas réel)",
    "Contre-mesures techniques détaillées"
  ],
  acceptanceCriteria: [
    { criterion: "Précision technique", weight: 0.4 },
    { criterion: "Qualité des exemples", weight: 0.3 },
    { criterion: "Pertinence des contre-mesures", weight: 0.3 }
  ]
}
\`\`\`

## Mission 2 — Write-up CTF

\`\`\`typescript
{
  id: "cyber-ctf-writeup",
  title: "Write-up CTF — HackTheBox ou TryHackMe",
  slug: "writeup-ctf-htb-thm",
  category: "CYBERSECURITY",
  difficulty: "INTERMEDIATE",
  stage: "INIT",
  xp: 100,
  domains: ["Cybersecurity"],
  techLevel: "BEGINNER",
  submissionMethod: "ANY_LINK",
  profileWeights: { builder: 0.5, creator: 0.1, strategist: 0.3, catalyst: 0.1 },
  briefing: \`
    Résous une machine ou un challenge de niveau Easy/Medium sur une plateforme CTF
    et publie un write-up détaillé de ta méthodologie.
    Plateformes acceptées : HackTheBox, TryHackMe, Root-Me, PicoCTF, CTFtime.
  \`,
  deliverables: [
    "Lien vers le write-up (GitHub Pages, blog, HackMD, Medium)",
    "Phases documentées : reconnaissance → exploitation → privilege escalation",
    "Commandes utilisées avec explications",
    "Lessons learned (ce que tu as appris)"
  ],
  acceptanceCriteria: [
    { criterion: "Clarté de la méthodologie", weight: 0.4 },
    { criterion: "Rigueur technique des explications", weight: 0.4 },
    { criterion: "Lessons learned pertinentes", weight: 0.2 }
  ]
}
\`\`\`

## Critères d'acceptation
- [ ] Les 2 missions sont ajoutées dans \`lib/missions.ts\`
- [ ] Champ \`domains: ["Cybersecurity"]\` présent sur chaque mission
- [ ] Missions visibles pour les utilisateurs avec \`primaryDomain = "Cybersecurity"\`
- [ ] Formulaire de soumission accepte DOCUMENT_LINK et ANY_LINK correctement
- [ ] Acceptance criteria configurés pour le peer review`,
  },

  {
    title: "[MISSIONS] Cybersécurité CORE — Audit AppSec + Lab Pentesting Kali",
    labels: ["type: feature", "priority: high", "area: missions"],
    body: `## Contexte

Suite des missions cybersécurité — niveau CORE (intermédiaire), accessible après validation des missions INIT.

## Mission 1 — Audit de sécurité d'une application web

\`\`\`typescript
{
  id: "cyber-audit-webapp",
  title: "Audit de Sécurité — Application Web",
  slug: "audit-securite-webapp",
  category: "CYBERSECURITY",
  difficulty: "ADVANCED",
  stage: "CORE",
  xp: 200,
  domains: ["Cybersecurity"],
  techLevel: "INTERMEDIATE",
  submissionMethod: "GITHUB_REPO",
  profileWeights: { builder: 0.4, creator: 0.1, strategist: 0.4, catalyst: 0.1 },
  briefing: \`
    Audite le code source d'une application web (fournie ci-dessous ou une app open-source
    de ton choix) et produis un rapport de vulnérabilités professionnel avec preuves de concept.

    Applications suggérées : DVWA, WebGoat, Juice Shop, NodeGoat
  \`,
  deliverables: [
    "Repo GitHub avec rapport PDF/Markdown",
    "Minimum 5 vulnérabilités identifiées et documentées",
    "PoC (Proof of Concept) pour chaque vuln critique",
    "Recommandations correctives avec code ou configuration"
  ],
  acceptanceCriteria: [
    { criterion: "Nombre et pertinence des vulnérabilités trouvées", weight: 0.4 },
    { criterion: "Qualité des PoC", weight: 0.3 },
    { criterion: "Recommandations correctives", weight: 0.3 }
  ]
}
\`\`\`

## Mission 2 — Lab Pentesting Kali Linux

\`\`\`typescript
{
  id: "cyber-lab-kali",
  title: "Lab de Pentesting — Environnement Isolé Kali",
  slug: "lab-pentesting-kali",
  category: "CYBERSECURITY",
  difficulty: "ADVANCED",
  stage: "CORE",
  xp: 250,
  domains: ["Cybersecurity"],
  techLevel: "INTERMEDIATE",
  submissionMethod: "GITHUB_REPO",
  profileWeights: { builder: 0.6, creator: 0.1, strategist: 0.2, catalyst: 0.1 },
  briefing: \`
    Monte un lab de pentesting local complet et documente une chaîne d'exploitation
    bout-en-bout sur une machine cible volontairement vulnérable.

    Stack recommandée : Kali Linux + VirtualBox/VMware + Metasploitable2 ou DVWA
  \`,
  deliverables: [
    "Repo GitHub avec documentation du lab (architecture, config)",
    "Scripts ou commandes utilisés avec explications",
    "Rapport d'exploitation : recon → scan → exploitation → post-exploitation",
    "Recommandations défensives pour chaque vecteur exploité"
  ],
  acceptanceCriteria: [
    { criterion: "Rigueur de la documentation lab", weight: 0.3 },
    { criterion: "Profondeur de la chaîne d'exploitation", weight: 0.4 },
    { criterion: "Qualité des recommandations défensives", weight: 0.3 }
  ]
}
\`\`\`

## Critères d'acceptation
- [ ] Les 2 missions sont ajoutées dans \`lib/missions.ts\`
- [ ] \`techLevel: "INTERMEDIATE"\` présent → visibles uniquement si user.technicalLevel !== "BEGINNER"
- [ ] Missions CORE débloquées après validation de la mission INIT Cybersec
- [ ] Peer reviewers avec \`primaryDomain = "Cybersecurity"\` sont prioritaires`,
  },

  {
    title: "[MISSIONS] Cybersécurité PRO — Red Team Simulation + Blue Team Incident Response",
    labels: ["type: feature", "priority: medium", "area: missions"],
    body: `## Contexte

Niveau PRO cybersécurité — missions avancées pour les profils expérimentés (ADVANCED).

## Mission 1 — Red Team Simulation

\`\`\`typescript
{
  id: "cyber-redteam-sim",
  title: "Red Team Simulation — Opération Bout-en-Bout",
  slug: "red-team-simulation",
  category: "CYBERSECURITY",
  difficulty: "EXPERT",
  stage: "PRO",
  xp: 450,
  domains: ["Cybersecurity"],
  techLevel: "ADVANCED",
  submissionMethod: "GITHUB_REPO",
  profileWeights: { builder: 0.4, creator: 0.1, strategist: 0.4, catalyst: 0.1 },
  briefing: \`
    Simule une opération Red Team complète suivant la méthodologie PTES sur un lab isolé
    ou une plateforme dédiée (HTB Pro Labs, CRTE, RastaLabs...).

    Phases requises : OSINT → Reconnaissance → Exploitation → Persistence → Lateral Movement → Reporting
  \`,
  deliverables: [
    "Rapport professionnel format PTES (min 15 pages)",
    "Timeline d'attaque chronologique",
    "TTPs documentés selon MITRE ATT&CK",
    "Recommandations défensives détaillées par phase"
  ],
  acceptanceCriteria: [
    { criterion: "Couverture complète des phases PTES", weight: 0.35 },
    { criterion: "Qualité du rapport et clarté", weight: 0.35 },
    { criterion: "Mapping MITRE ATT&CK pertinent", weight: 0.3 }
  ]
}
\`\`\`

## Mission 2 — Blue Team Incident Response

\`\`\`typescript
{
  id: "cyber-blueteam-ir",
  title: "Blue Team — Analyser et Répondre à une Intrusion Simulée",
  slug: "blueteam-incident-response",
  category: "CYBERSECURITY",
  difficulty: "EXPERT",
  stage: "PRO",
  xp: 400,
  domains: ["Cybersecurity"],
  techLevel: "ADVANCED",
  submissionMethod: "GITHUB_REPO",
  profileWeights: { builder: 0.3, creator: 0.1, strategist: 0.5, catalyst: 0.1 },
  briefing: \`
    À partir de logs d'intrusion simulée fournis, identifie les TTPs utilisés,
    reconstitue la timeline d'attaque et produis un rapport d'incident complet
    avec plan de remédiation.

    Jeux de logs fournis : pcap Wireshark + logs système + logs SIEM simulés
  \`,
  deliverables: [
    "Rapport d'incident format NIST (détection, confinement, éradication, recovery)",
    "Timeline reconstituée de l'attaque",
    "Règles de détection créées (Sigma, Snort ou Suricata)",
    "Post-mortem : comment améliorer la détection future"
  ],
  acceptanceCriteria: [
    { criterion: "Précision de la reconstruction de l'attaque", weight: 0.4 },
    { criterion: "Qualité des règles de détection", weight: 0.3 },
    { criterion: "Plan de remédiation actionnable", weight: 0.3 }
  ]
}
\`\`\`

## Critères d'acceptation
- [ ] Les 2 missions PRO ajoutées dans \`lib/missions.ts\`
- [ ] \`techLevel: "ADVANCED"\` présent
- [ ] Prérequis vérifiés : missions CORE Cybersec validées ET level >= 3
- [ ] Les jeux de logs (Blue Team) fournis comme assets ou liens dans le briefing`,
  },

  // ─── MISSIONS CLOUD/DEVOPS ──────────────────────────────────────────────────

  {
    title: "[MISSIONS] Cloud & DevOps — 4 missions INIT→PRO (Docker, Terraform, Monitoring, Multi-env)",
    labels: ["type: feature", "priority: high", "area: missions"],
    body: `## Contexte

Aucune mission dédiée Cloud/DevOps n'existe. Les utilisateurs avec \`primaryDomain = "Cloud"\` ou \`"DevOps"\` n'ont pas de parcours adapté.

## 4 missions à ajouter dans \`lib/missions.ts\`

### INIT — Dockeriser une app + CI/CD GitHub Actions (75 XP)
\`\`\`typescript
{
  id: "cloud-docker-cicd",
  title: "Dockeriser + CI/CD GitHub Actions",
  slug: "docker-cicd-github-actions",
  category: "DEVOPS",
  stage: "INIT",
  xp: 100,
  domains: ["Cloud", "DevOps"],
  techLevel: "BEGINNER",
  submissionMethod: "GITHUB_REPO",
  profileWeights: { builder: 0.5, creator: 0.05, strategist: 0.3, catalyst: 0.15 },
  deliverables: [
    "Dockerfile optimisé (multi-stage si pertinent)",
    "docker-compose.yml fonctionnel",
    "Workflow GitHub Actions : build + test automatiques",
    "README avec instructions de déploiement"
  ]
}
\`\`\`

### CORE — Infrastructure as Code Terraform (250 XP)
\`\`\`typescript
{
  id: "cloud-terraform-iac",
  title: "Infrastructure as Code — Terraform sur Free Tier",
  slug: "terraform-iac-free-tier",
  category: "DEVOPS",
  stage: "CORE",
  xp: 250,
  domains: ["Cloud", "DevOps"],
  techLevel: "INTERMEDIATE",
  submissionMethod: "GITHUB_REPO",
  profileWeights: { builder: 0.5, creator: 0.05, strategist: 0.3, catalyst: 0.15 },
  deliverables: [
    "Modules Terraform organisés par ressource",
    "State géré via backend distant (S3 ou GCS)",
    "Variables et outputs documentés",
    "README avec architecture et coûts estimés"
  ]
}
\`\`\`

### CORE — Stack monitoring Prometheus + Grafana (200 XP)
\`\`\`typescript
{
  id: "cloud-monitoring-stack",
  title: "Stack Monitoring — Prometheus + Grafana sur VPS",
  slug: "monitoring-prometheus-grafana",
  category: "DEVOPS",
  stage: "CORE",
  xp: 200,
  domains: ["Cloud", "DevOps"],
  techLevel: "INTERMEDIATE",
  submissionMethod: "GITHUB_REPO",
  profileWeights: { builder: 0.4, creator: 0.1, strategist: 0.4, catalyst: 0.1 },
  deliverables: [
    "docker-compose.yml déployé sur VPS réel",
    "Dashboards Grafana exportés (JSON)",
    "Règles d'alerting configurées (min 3 alertes)",
    "Runbook : que faire si alerte X se déclenche"
  ]
}
\`\`\`

### PRO — Architecture multi-environnement (400 XP)
\`\`\`typescript
{
  id: "cloud-multi-env-arch",
  title: "Architecture Multi-Environnement (dev/staging/prod)",
  slug: "architecture-multi-environnement",
  category: "DEVOPS",
  stage: "PRO",
  xp: 400,
  domains: ["Cloud", "DevOps"],
  techLevel: "ADVANCED",
  submissionMethod: "GITHUB_REPO",
  profileWeights: { builder: 0.35, creator: 0.05, strategist: 0.45, catalyst: 0.15 },
  deliverables: [
    "IaC complet avec 3 environnements séparés",
    "Pipelines CI/CD avec promotion automatique",
    "Feature flags (LaunchDarkly ou implémentation custom)",
    "ADR (Architecture Decision Record) documentant les choix"
  ]
}
\`\`\`

## Critères d'acceptation
- [ ] 4 missions ajoutées dans \`lib/missions.ts\`
- [ ] Champ \`domains\` correct sur chaque mission
- [ ] techLevel progression correcte (BEGINNER → INTERMEDIATE → ADVANCED)
- [ ] Missions visibles pour \`primaryDomain IN ["Cloud", "DevOps"]\``,
  },

  // ─── MISSIONS IA & AGENTS ───────────────────────────────────────────────────

  {
    title: "[MISSIONS] IA & Agents — 4 missions INIT→PRO (Agent LLM, Fine-tuning, RAG, Multi-agents)",
    labels: ["type: feature", "priority: high", "area: missions"],
    body: `## Contexte

L'IA est un domaine clé pour la communauté HASHCODE. Aucune mission dédiée n'existe pour les profils \`primaryDomain = "IA"\`.

## 4 missions à ajouter

### INIT — Construire un agent LLM fonctionnel (100 XP)
\`\`\`typescript
{
  id: "ai-agent-llm",
  title: "Construire un Agent LLM Fonctionnel",
  slug: "agent-llm-fonctionnel",
  category: "AI",
  stage: "INIT",
  xp: 100,
  domains: ["IA"],
  techLevel: "BEGINNER",
  submissionMethod: "GITHUB_REPO",
  profileWeights: { builder: 0.4, creator: 0.2, strategist: 0.3, catalyst: 0.1 },
  briefing: \`
    Construis un agent LLM capable d'utiliser au moins 2 outils externes
    (recherche web, API tierce, calcul, base de connaissances locale, etc.)
    Stack : LangChain, CrewAI, OpenAI Assistants API, ou équivalent open-source.
  \`,
  deliverables: [
    "Repo GitHub avec code commenté",
    "README : use case, architecture, outils utilisés",
    "Démo fonctionnelle (vidéo < 3 min ou URL live)",
    "Limitations identifiées et pistes d'amélioration"
  ]
}
\`\`\`

### CORE — Fine-tuning modèle open-source Hugging Face (250 XP)
\`\`\`typescript
{
  id: "ai-finetune-hf",
  title: "Fine-tuning Modèle Open-Source — Hugging Face",
  slug: "fine-tuning-hugging-face",
  category: "AI",
  stage: "CORE",
  xp: 250,
  domains: ["IA"],
  techLevel: "INTERMEDIATE",
  submissionMethod: "ANY_LINK",
  profileWeights: { builder: 0.5, creator: 0.1, strategist: 0.3, catalyst: 0.1 },
  briefing: \`
    Fine-tune un modèle open-source (LLaMA 3, Mistral, Phi-3, Qwen...) sur un dataset
    custom de ton choix. Publie le modèle sur Hugging Face Hub avec une Model Card complète.
  \`,
  deliverables: [
    "Lien vers le modèle publié sur HF Hub",
    "Code d'entraînement sur GitHub (dataset prep + training script)",
    "Model Card : use case, dataset, métriques d'évaluation",
    "Comparaison avant/après fine-tuning (exemples concrets)"
  ]
}
\`\`\`

### CORE — Pipeline RAG sur base de connaissances locale (250 XP)
\`\`\`typescript
{
  id: "ai-rag-pipeline",
  title: "Pipeline RAG — Base de Connaissances Locale",
  slug: "pipeline-rag-local",
  category: "AI",
  stage: "CORE",
  xp: 250,
  domains: ["IA"],
  techLevel: "INTERMEDIATE",
  submissionMethod: "GITHUB_REPO",
  profileWeights: { builder: 0.4, creator: 0.2, strategist: 0.3, catalyst: 0.1 },
  briefing: \`
    Construis un système RAG qui indexe des documents locaux (PDF, Markdown, code...)
    et répond à des questions en citant ses sources.
    Stack : LlamaIndex ou LangChain + Chroma/Qdrant + embeddings open-source.
  \`,
  deliverables: [
    "Ingestion pipeline : parsing, chunking, embedding, indexation",
    "Retrieval + génération avec citations des sources",
    "Interface simple (CLI ou API ou frontend minimaliste)",
    "Évaluation : 10 questions test + scores de pertinence"
  ]
}
\`\`\`

### PRO — Système multi-agents orchestré (500 XP)
\`\`\`typescript
{
  id: "ai-multiagents",
  title: "Système Multi-Agents Orchestré",
  slug: "systeme-multi-agents",
  category: "AI",
  stage: "PRO",
  xp: 500,
  domains: ["IA"],
  techLevel: "ADVANCED",
  submissionMethod: "GITHUB_REPO",
  profileWeights: { builder: 0.3, creator: 0.2, strategist: 0.4, catalyst: 0.1 },
  briefing: \`
    Conçois et implémente un système multi-agents capable de décomposer une tâche complexe,
    coordonner des agents spécialisés et produire un output cohérent avec gestion des erreurs.
    Stack : CrewAI, AutoGen, LangGraph, ou architecture custom documentée.
  \`,
  deliverables: [
    "Architecture documentée : agents, rôles, flux de communication",
    "Implémentation fonctionnelle avec gestion des erreurs",
    "Benchmark : temps d'exécution, coût tokens, qualité output",
    "Cas d'usage réel résolu (pas un hello-world)"
  ]
}
\`\`\`

## Critères d'acceptation
- [ ] 4 missions ajoutées dans \`lib/missions.ts\`
- [ ] \`domains: ["IA"]\` présent sur chaque mission
- [ ] Progression techLevel cohérente : BEGINNER → INTERMEDIATE → ADVANCED
- [ ] Missions visibles pour \`primaryDomain = "IA"\``,
  },

  // ─── RECOMMANDATION MISSIONS ────────────────────────────────────────────────

  {
    title: "[FEATURE] Moteur de recommandation missions par Profil × Domaine × Niveau",
    labels: ["type: feature", "priority: high", "area: missions", "area: platform"],
    body: `## Contexte

Actuellement les missions sont recommandées uniquement selon le profil comportemental (Builder/Creator/...). Avec l'ajout de \`primaryDomain\` et \`technicalLevel\`, la recommandation peut être bien plus pertinente.

## Objectif

Implémenter un moteur de recommandation 2D : **Profil × Domaine × Niveau** pour servir les bonnes missions aux bons utilisateurs.

## Implémentation dans \`lib/missions.ts\`

\`\`\`typescript
export interface Mission {
  // Existant
  id: string
  title: string
  slug: string
  stage: "INIT" | "CORE" | "PRO"
  xp: number
  profileWeights: Record<string, number>

  // NOUVEAUX CHAMPS
  domains?: string[]           // ex: ["Cybersecurity"] ou [] = tous domaines
  techLevel?: TechnicalLevel   // niveau minimum requis
  subDomains?: string[]        // sous-domaines ciblés
}

export function recommendMissions(user: {
  class: string
  primaryDomain: string | null
  technicalLevel: string | null
  level: number
  completedMissionIds: string[]
}): Mission[] {
  return MISSIONS
    .filter(m => !user.completedMissionIds.includes(m.id))
    .filter(m => m.minLevel == null || m.minLevel <= user.level)
    .filter(m => {
      if (!m.techLevel) return true
      if (user.technicalLevel === "ADVANCED") return true
      if (user.technicalLevel === "INTERMEDIATE") return m.techLevel !== "ADVANCED"
      return m.techLevel === "BEGINNER" // BEGINNER ne voit que les missions BEGINNER
    })
    .map(m => {
      const profileScore = m.profileWeights[user.class] ?? 0.25
      const domainMatch = user.primaryDomain &&
        m.domains && m.domains.includes(user.primaryDomain) ? 0.5 : 0.0
      const genericBonus = (!m.domains || m.domains.length === 0) ? 0.1 : 0.0

      return { ...m, _score: profileScore * 0.4 + domainMatch + genericBonus }
    })
    .sort((a, b) => (b as any)._score - (a as any)._score)
    .slice(0, 12)
}
\`\`\`

## Changements dans le dashboard

Dans \`app/dashboard/page.tsx\` :
\`\`\`typescript
const recommendedMissions = recommendMissions({
  class: user.class,
  primaryDomain: user.primaryDomain,
  technicalLevel: user.technicalLevel,
  level: user.level,
  completedMissionIds: submissions
    .filter(s => s.status === "APPROVED")
    .map(s => s.missionId)
})
\`\`\`

Passer \`recommendedMissions\` au composant missions du dashboard.

## Label de contexte dans l'UI

Afficher sous le titre "Missions recommandées" :
\`\`\`
→ Pour toi : Builder · Cybersécurité · Intermédiaire
\`\`\`

## Ajouter \`domains\` et \`techLevel\` sur les missions existantes

Missions sans domaine = visibles par tous → ajouter \`domains: []\` explicitement.
Missions INIT génériques (ancrage, profil, squad) → \`domains: []\`, \`techLevel: "BEGINNER"\`.

## Critères d'acceptation
- [ ] \`recommendMissions()\` implémentée et exportée depuis \`lib/missions.ts\`
- [ ] Toutes les missions existantes ont \`domains\` et \`techLevel\` renseignés
- [ ] Le dashboard utilise \`recommendMissions()\` au lieu d'une liste statique
- [ ] Un Builder Cybersec INTERMEDIATE voit les missions cybersec en premier
- [ ] Un Creator UI/UX BEGINNER voit les missions design en premier
- [ ] Pas de régression sur l'affichage des missions génériques (ancrage, squad...)
- [ ] Tests unitaires sur \`recommendMissions()\` : 5 cas couverts`,
  },
];

async function createMilestone(): Promise<number> {
  try {
    const result = execFileSync(
      "gh",
      [
        "api", "repos/digitaleflex/joinhashcode/milestones",
        "-X", "POST",
        "-f", "title=S0 — Système de Spécialisation",
        "-f", "description=Quiz spécialisation 10Q, missions Cybersec/Cloud/IA, moteur de recommandation Profil×Domaine×Niveau",
        "-f", "due_on=2026-07-17T23:59:59Z",
      ],
      { encoding: "utf-8" }
    );
    const data = JSON.parse(result);
    console.log(`✓ Milestone créé : #${data.number} — ${data.title}`);
    return data.number;
  } catch (e: any) {
    // Peut exister déjà
    const list = execFileSync(
      "gh",
      ["api", "repos/digitaleflex/joinhashcode/milestones", "--jq", ".[] | select(.title | contains(\"Spécialisation\")) | .number"],
      { encoding: "utf-8" }
    ).trim();
    if (list) return parseInt(list);
    throw e;
  }
}

async function main() {
  console.log("🔐 Publication des issues — Système de Spécialisation HASHCODE\n");

  try {
    execFileSync("gh", ["--version"], { stdio: "ignore" });
    execFileSync("gh", ["auth", "status"], { stdio: "ignore" });
  } catch {
    console.error("❌ CLI GitHub non disponible ou non authentifiée.");
    process.exit(1);
  }

  console.log("✓ CLI GitHub OK.");

  const milestoneNumber = await createMilestone();

  console.log(`\n📋 ${ISSUES.length} issues prêtes...\n`);

  const tempDir = path.join(process.cwd(), ".temp_spec_issues");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const created: string[] = [];

  try {
    for (let i = 0; i < ISSUES.length; i++) {
      const issue = ISSUES[i];
      console.log(`⏳ [${i + 1}/${ISSUES.length}] ${issue.title}`);

      const tempFile = path.join(tempDir, `issue_${i}.md`);
      fs.writeFileSync(tempFile, issue.body, "utf-8");

      const url = execFileSync(
        "gh",
        [
          "issue", "create",
          "--title", issue.title,
          "--body-file", tempFile,
          "--label", issue.labels.join(","),
          "--milestone", "S0 — Système de Spécialisation",
        ],
        { encoding: "utf-8" }
      ).trim();

      created.push(url);
      console.log(`   ✓ ${url}\n`);

      await new Promise((r) => setTimeout(r, 500));
    }

    console.log(`\n🎉 ${created.length} issues créées dans le milestone "S0 — Système de Spécialisation" !`);
    console.log(`\nhttps://github.com/digitaleflex/joinhashcode/milestones`);
  } catch (error: any) {
    console.error("❌ Erreur :", error.message);
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.readdirSync(tempDir).forEach((f) => fs.unlinkSync(path.join(tempDir, f)));
      fs.rmdirSync(tempDir);
    }
  }
}

main();

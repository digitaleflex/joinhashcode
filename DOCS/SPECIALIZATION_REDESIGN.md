# REDESIGN — SYSTÈME DE SPÉCIALISATION HASHCODE

### Spec technique complète · Version 1.0 · Juin 2026

---

## VISION

Le système actuel a deux dimensions qui ne se parlent pas :

```
Dimension 1 — Profil comportemental (QUI tu es)
  Builder · Creator · Strategist · Catalyst
  → Déterminé par le quiz psychométrique 13 questions

Dimension 2 — Spécialisation technique (CE QUE tu fais)
  Web · Cybersec · Cloud · IA · Mobile · Data · DevOps · UI/UX...
  → 3 questions superficielles dans Settings > Expertise (jamais faites)
```

**Cible :**

```
Identité complète = Profil × Spécialisation × Niveau
Ex: "Builder Cybersécurité · Niveau Intermédiaire · Stack : Kali, Burp Suite, Python"
Ex: "Stratège IA & Data · Niveau Avancé · Stack : LangChain, Python, PostgreSQL"
```

---

## MATRICE PROFIL × SPÉCIALISATION

Chaque combinaison génère un persona unique avec missions et missions adaptées.

```
           WEB   CYBER  CLOUD   IA   MOBILE  DATA  DEVOPS  UI/UX  AUTO  WEB3
Builder     ✦     ✦      ✦      ✦      ✦      ✦      ✦      ·      ✦     ✦
Creator     ✦     ·      ·      ✦      ✦      ·      ·      ✦      ✦     ·
Strategist  ✦     ✦      ✦      ✦      ·      ✦      ✦      ✦      ✦     ✦
Catalyst    ✦     ✦      ·      ✦      ✦      ·      ·      ✦      ✦     ·

✦ = combinaison courante   · = combinaison rare mais possible
```

---

## NOUVEAU QUIZ DE SPÉCIALISATION — 10 questions

### Placement dans le funnel

```
Signin
  ↓
Onboarding étape 1 — pays + situation           (existant)
  ↓
Quiz psychométrique 13Q — Profil                (existant)
  ↓
Quiz spécialisation 10Q — Domaine + Niveau      (NOUVEAU — obligatoire)
  ↓
Dashboard — missions recommandées par profil × domaine
```

Le quiz de spécialisation remplace/enrichit le formulaire `Settings > Expertise`.  
Il reste accessible depuis les settings pour mise à jour ultérieure.

---

### Q1 — Domaine primaire

**Texte :** "Dans quel univers tech passes-tu le plus de temps (ou veux-tu évoluer) ?"

| Option | Label                     | Domaines assignés     |
| ------ | ------------------------- | --------------------- |
| A      | 🌐 Web & Applications     | `["Web"]`             |
| B      | 🔐 Cybersécurité          | `["Cybersecurity"]`   |
| C      | ☁️ Cloud & Infrastructure | `["Cloud", "DevOps"]` |
| D      | 🤖 IA, Data & Agents      | `["IA", "Data"]`      |

> Si aucune option ne correspond → bouton "Voir plus" → Q1b (domaines secondaires)

### Q1b — Domaines secondaires (si "Voir plus")

| Option | Label                            | Domaines assignés |
| ------ | -------------------------------- | ----------------- |
| A      | 📱 Mobile & Applications natives | `["Mobile"]`      |
| B      | ⚙️ Automation & Scripting        | `["Automation"]`  |
| C      | 🎨 Design & UI/UX                | `["UI/UX"]`       |
| D      | 🔗 Blockchain & Web3             | `["Web3"]`        |

---

### Q2 — Sous-domaine (branching selon Q1)

**Branche WEB :**

> "Tu fais plutôt du front, du back, ou les deux ?"

| Option | Label                                            | Tags        |
| ------ | ------------------------------------------------ | ----------- |
| A      | Frontend — interfaces, animations, accessibilité | `frontend`  |
| B      | Backend — APIs, bases de données, architecture   | `backend`   |
| C      | Fullstack — tu couvres tout le stack             | `fullstack` |
| D      | Web3 — dApps, smart contracts, wallets           | `web3`      |

**Branche CYBERSÉCURITÉ :**

> "Tu te situes plutôt en attaque, en défense, ou en audit ?"

| Option | Label                                            | Tags        |
| ------ | ------------------------------------------------ | ----------- |
| A      | 🗡️ Offensif — Pentesting, Red Team, CTF          | `offensive` |
| B      | 🛡️ Défensif — Blue Team, SOC, Monitoring         | `defensive` |
| C      | 🔍 AppSec — audit code, OWASP, Bug Bounty        | `appsec`    |
| D      | 🔑 Crypto & Privacy — chiffrement, anonymisation | `crypto`    |

**Branche CLOUD & INFRA :**

> "Ton terrain de jeu principal ?"

| Option | Label                                              | Tags         |
| ------ | -------------------------------------------------- | ------------ |
| A      | AWS / GCP / Azure — déploiement cloud              | `cloud`      |
| B      | Docker & Kubernetes — conteneurisation             | `containers` |
| C      | CI/CD & IaC — pipelines, Terraform                 | `iac`        |
| D      | SRE & Monitoring — uptime, alerting, observabilité | `sre`        |

**Branche IA & DATA :**

> "Tu construis des modèles, des pipelines, ou des agents ?"

| Option | Label                                             | Tags        |
| ------ | ------------------------------------------------- | ----------- |
| A      | ML Engineering — modèles, fine-tuning, évaluation | `ml`        |
| B      | LLM & Agents — ChatBots, RAG, orchestration       | `llm`       |
| C      | Data Engineering — pipelines, warehouses, ETL     | `data-eng`  |
| D      | Analytics & BI — dashboards, insights, SQL        | `analytics` |

---

### Q3 — Niveau technique (auto-déclaré)

**Texte :** "Comment tu évalues honnêtement ton niveau ?"

| Option | Label         | TechnicalLevel | Description                                           |
| ------ | ------------- | -------------- | ----------------------------------------------------- |
| A      | Débutant      | `BEGINNER`     | "Je débute, j'apprends les bases"                     |
| B      | Intermédiaire | `INTERMEDIATE` | "J'ai des projets en production ou des CTF résolus"   |
| C      | Avancé        | `ADVANCED`     | "Je conçois des architectures, j'encadre ou j'audite" |

---

### Q4 — Outils maîtrisés (multi-select, max 5)

**Texte :** "Coche les outils que tu utilises vraiment (pas juste entendu parler)"

Outils affichés selon le domaine de Q1 (voir TECH_TREE_V2 ci-dessous).

---

### Q5 — Outils en cours d'apprentissage (multi-select, max 3)

**Texte :** "Et ceux sur lesquels tu bosses en ce moment ?"

Même liste que Q4, options non sélectionnées en Q4.

---

### Q6 — Plateforme de pratique

**Texte :** "Où tu pratiques / t'entraînes principalement ?"

| Option | Label                       | Plateformes         |
| ------ | --------------------------- | ------------------- |
| A      | Projets personnels / GitHub | `github`            |
| B      | Plateformes de challenges   | `ctf_platform`      |
| C      | Formations en ligne         | `learning_platform` |
| D      | En équipe / travail / école | `team`              |

> Si cybersec + B → afficher : HackTheBox, TryHackMe, Root-Me, CTFtime

---

### Q7 — Objectif dans la spécialisation

**Texte :** "Ton objectif concret dans ce domaine ?"

| Option | Label                                                 |
| ------ | ----------------------------------------------------- |
| A      | Décrocher un premier job / stage dans ce domaine      |
| B      | Monter en niveau pour évoluer dans mon poste actuel   |
| C      | Lancer un projet / produit dans ce domaine            |
| D      | Contribuer à des projets open-source / communautaires |

---

### Q8 — Mode d'apprentissage préféré

**Texte :** "Tu apprends mieux comment ?"

| Option | Label                                                       |
| ------ | ----------------------------------------------------------- |
| A      | En construisant des projets de A à Z                        |
| B      | En résolvant des challenges / CTF / exercices               |
| C      | En lisant de la doc et en expérimentant                     |
| D      | En collaborant avec d'autres et en faisant du peer learning |

---

### Q9 — Certifications / preuves existantes

**Texte :** "Tu as déjà obtenu des certifs ou complété des parcours reconnus ?"

| Option | Label                                                     |
| ------ | --------------------------------------------------------- |
| A      | Oui — certifications professionnelles (AWS, OSCP, GCP...) |
| B      | Oui — parcours complétés (TryHackMe, Coursera, HTB...)    |
| C      | Pas encore, mais c'est un objectif                        |
| D      | Non, j'apprends en autonomie sans certif                  |

---

### Q10 — Expérience terrain

**Texte :** "Tu as déjà livré quelque chose de concret dans ce domaine ?"

| Option | Label                                                       | Impact sur le scoring         |
| ------ | ----------------------------------------------------------- | ----------------------------- |
| A      | Oui — application en production / audit livré / CTF top 100 | +1 niveau                     |
| B      | Oui — projet perso fonctionnel, accessible en ligne         | 0                             |
| C      | En cours — projet non terminé mais avancé                   | 0                             |
| D      | Non — je commence maintenant                                | -1 niveau (plancher BEGINNER) |

---

## TECH_TREE_V2 — Outils complets par domaine

### 🌐 Web

```
Frontend :  Next.js, React, Vue.js, TypeScript, Tailwind, Framer Motion, Vercel
Backend  :  Node.js, Express, NestJS, FastAPI, PostgreSQL, Redis, Prisma
Fullstack:  Next.js, PostgreSQL, tRPC, Bun, Hono
Web3     :  Solidity, Ethers.js, Wagmi, Hardhat, thirdweb
```

### 🔐 Cybersécurité

```
Offensif  : Kali Linux, Metasploit, Burp Suite, Nmap, SQLmap, Aircrack-ng,
            Gobuster, Hydra, John the Ripper, Wireshark, Responder
Défensif  : Wireshark, Snort, Suricata, Splunk, ELK Stack, pfSense,
            Zeek, Wazuh, OSSEC, CrowdStrike, Graylog
AppSec    : Burp Suite, OWASP ZAP, SonarQube, Semgrep, Nikto, Nuclei
Crypto    : OpenSSL, GPG, Hashcat, CyberChef, Python (cryptography lib)
Plateformes: HackTheBox, TryHackMe, Root-Me, CTFtime, PicoCTF, PortSwigger
```

### ☁️ Cloud & DevOps

```
Cloud    : AWS (EC2, S3, Lambda), GCP, Azure, Cloudflare, DigitalOcean
Containers: Docker, Kubernetes, Podman, Docker Compose, Helm
IaC      : Terraform, Ansible, Pulumi, CloudFormation
CI/CD    : GitHub Actions, GitLab CI, Jenkins, ArgoCD, CircleCI
SRE      : Prometheus, Grafana, Datadog, PagerDuty, Nginx, Caddy
```

### 🤖 IA & Data

```
ML       : Python, PyTorch, TensorFlow, scikit-learn, Hugging Face, ONNX
LLM      : LangChain, LlamaIndex, CrewAI, OpenAI SDK, Ollama, Groq
Data Eng : Apache Spark, dbt, Airflow, Kafka, BigQuery, Snowflake
Analytics: SQL, Pandas, Metabase, Superset, Tableau, Power BI
```

### 📱 Mobile

```
Cross-platform: React Native, Flutter, Expo, Ionic
iOS            : Swift, SwiftUI, Xcode
Android        : Kotlin, Jetpack Compose, Android Studio
```

### ⚙️ Automation

```
Scripts  : Python, Bash, PowerShell, Node.js
No-code  : n8n, Zapier, Make (Integromat), Airtable
CI/CD    : GitHub Actions, GitLab CI, Bitbucket Pipelines
Testing  : Playwright, Cypress, Vitest, Jest, k6
```

### 🎨 UI/UX & Design

```
Design    : Figma, Adobe XD, Sketch, Penpot
Motion    : Framer, Spline, Lottie, After Effects
Design Sys: Storybook, Chromatic, Zeroheight
Research  : Maze, Hotjar, UserTesting, Dovetail
```

### 🔗 Blockchain & Web3

```
Smart Contracts: Solidity, Rust (Solana), Move (Aptos)
Tooling        : Hardhat, Foundry, Truffle, OpenZeppelin
Frontend Web3  : Ethers.js, Wagmi, Web3.js, thirdweb, RainbowKit
Infrastructure : IPFS, The Graph, Chainlink, Alchemy, Infura
```

---

## MISSIONS PAR SPÉCIALISATION

### 🔐 Cybersécurité — 6 missions

#### [INIT] Rapport OWASP Top 10

- **XP :** 75
- **Type :** Document (PDF / Markdown)
- **Objectif :** Rédiger un rapport de 1-2 pages expliquant les 3 vulnérabilités OWASP Top 10 que tu considères les plus critiques en 2025, avec un exemple concret pour chacune.
- **Livrables :** Document structuré avec : description vuln, exemple d'attaque, impact, contre-mesure.
- **Profil dominant :** Builder(0.3) · Strategist(0.4) · Catalyst(0.1) · Creator(0.2)
- **Critères :** Précision technique, qualité des exemples, pertinence des contre-mesures

#### [INIT] Write-up CTF — HackTheBox ou TryHackMe

- **XP :** 100
- **Type :** Lien (write-up publié sur GitHub / blog)
- **Objectif :** Résoudre une machine ou un challenge de niveau Easy/Medium et publier un write-up détaillé de la méthodologie.
- **Livrables :** Write-up public avec : reconnaissance, exploitation, privilege escalation, lessons learned.
- **Plateformes acceptées :** HackTheBox, TryHackMe, Root-Me, PicoCTF, CTFtime
- **Profil dominant :** Builder(0.5) · Strategist(0.3) · Creator(0.1) · Catalyst(0.1)

#### [CORE] Audit de sécurité d'une application web

- **XP :** 200
- **Type :** GitHub repo
- **Objectif :** Auditer le code source d'une app web fournie (ou open-source) et produire un rapport de vulnérabilités avec preuves de concept.
- **Livrables :** Repo GitHub avec : rapport PDF/MD, PoC exploits documentés, recommandations correctives.
- **Outils suggérés :** Burp Suite, OWASP ZAP, Semgrep, SQLmap
- **Profil dominant :** Builder(0.4) · Strategist(0.4) · Creator(0.1) · Catalyst(0.1)

#### [CORE] Lab de Pentesting — Environnement isolé Kali

- **XP :** 250
- **Type :** GitHub repo + vidéo ou screenshots
- **Objectif :** Monter un lab de pentesting local (Kali + VirtualBox/VMware + machine cible) et documenter une chaîne d'exploitation complète.
- **Livrables :** Documentation du lab, scripts utilisés, rapport d'exploitation, recommandations.
- **Stack :** Kali Linux, Metasploit, Nmap, Wireshark, cible Metasploitable ou DVWA
- **Profil dominant :** Builder(0.6) · Strategist(0.2) · Creator(0.1) · Catalyst(0.1)

#### [PRO] Red Team Simulation — Scénario bout-en-bout

- **XP :** 450
- **Type :** GitHub repo + rapport professionnel
- **Objectif :** Simuler une opération Red Team complète (OSINT → Recon → Exploitation → Persistence → Reporting) sur un lab isolé ou une plateforme dédiée (HTB Pro Lab, etc.).
- **Livrables :** Rapport professionnel format PTES, timeline d'attaque, recommandations défensives.
- **Profil dominant :** Builder(0.4) · Strategist(0.4) · Creator(0.1) · Catalyst(0.1)
- **Prérequis :** Niveau Intermédiaire + missions CORE cybersec validées

#### [PRO] Blue Team — Détecter et répondre à une intrusion simulée

- **XP :** 400
- **Type :** GitHub repo + rapport d'incident
- **Objectif :** Analyser des logs d'intrusion simulée, identifier les TTPs (MITRE ATT&CK), produire un rapport d'incident et un plan de remédiation.
- **Livrables :** Rapport d'incident (format NIST), règles de détection créées (Snort/Suricata), post-mortem.
- **Stack :** Wireshark, ELK Stack ou Splunk, MITRE ATT&CK Navigator
- **Profil dominant :** Builder(0.3) · Strategist(0.5) · Creator(0.1) · Catalyst(0.1)

---

### ☁️ Cloud & DevOps — 4 missions

#### [INIT] Dockeriser une app + CI/CD GitHub Actions

- **XP :** 100
- **Type :** GitHub repo
- **Objectif :** Prendre une application existante (la tienne ou fournie), la conteneuriser avec Docker, et mettre en place un pipeline CI/CD qui build et teste automatiquement.
- **Livrables :** Dockerfile, docker-compose.yml, workflow GitHub Actions fonctionnel, README.
- **Profil dominant :** Builder(0.5) · Strategist(0.3) · Creator(0.1) · Catalyst(0.1)

#### [CORE] Infrastructure as Code — Terraform sur free tier cloud

- **XP :** 250
- **Type :** GitHub repo
- **Objectif :** Provisionner une infrastructure complète (VPC, instances, base de données, stockage) via Terraform sur AWS ou GCP free tier.
- **Livrables :** Modules Terraform organisés, state géré proprement (backend S3/GCS), documentation.
- **Profil dominant :** Builder(0.5) · Strategist(0.3) · Creator(0.05) · Catalyst(0.15)

#### [CORE] Stack de monitoring — Prometheus + Grafana sur VPS

- **XP :** 200
- **Type :** GitHub repo + screenshots dashboard
- **Objectif :** Déployer une stack de monitoring complète sur un VPS (Hostinger, DigitalOcean, Hetzner) avec alerting configuré.
- **Livrables :** docker-compose.yml, dashboards Grafana exportés, règles d'alerting, runbook.
- **Profil dominant :** Builder(0.4) · Strategist(0.4) · Creator(0.1) · Catalyst(0.1)

#### [PRO] Architecture multi-environnement (dev/staging/prod)

- **XP :** 400
- **Type :** GitHub repo + ADR (Architecture Decision Record)
- **Objectif :** Concevoir et implémenter une architecture multi-environnement avec promotion automatique (dev → staging → prod), feature flags et rollback.
- **Livrables :** IaC complet, pipelines CI/CD séparés, documentation d'architecture, ADR.
- **Profil dominant :** Builder(0.35) · Strategist(0.45) · Creator(0.05) · Catalyst(0.15)

---

### 🤖 IA & Agents — 4 missions

#### [INIT] Construire un agent LLM fonctionnel

- **XP :** 100
- **Type :** GitHub repo + démo (vidéo ou live URL)
- **Objectif :** Construire un agent LLM capable d'utiliser des outils (recherche web, calcul, API externe) avec LangChain, CrewAI ou l'OpenAI Assistants API.
- **Livrables :** Repo GitHub clean, README avec use case, démo fonctionnelle.
- **Stack :** Python, LangChain ou CrewAI, OpenAI / Mistral / Groq
- **Profil dominant :** Builder(0.4) · Strategist(0.3) · Creator(0.2) · Catalyst(0.1)

#### [CORE] Fine-tuning d'un modèle open-source (Hugging Face)

- **XP :** 250
- **Type :** GitHub repo + modèle publié sur HF Hub
- **Objectif :** Fine-tuner un modèle open-source (LLaMA, Mistral, etc.) sur un dataset custom et publier le modèle sur Hugging Face Hub avec une carte de modèle complète.
- **Livrables :** Code d'entraînement, dataset documenté, modèle publié, évaluation (métriques).
- **Profil dominant :** Builder(0.5) · Strategist(0.3) · Creator(0.1) · Catalyst(0.1)

#### [CORE] Pipeline RAG sur base de connaissances locale

- **XP :** 250
- **Type :** GitHub repo + démo
- **Objectif :** Construire un système RAG (Retrieval-Augmented Generation) qui indexe des documents locaux et répond à des questions avec sources citées.
- **Livrables :** Indexation de docs, retrieval vectoriel, génération avec citations, interface simple.
- **Stack :** LlamaIndex ou LangChain, Chroma ou Qdrant, embeddings open-source
- **Profil dominant :** Builder(0.4) · Strategist(0.3) · Creator(0.2) · Catalyst(0.1)

#### [PRO] Système multi-agents orchestré

- **XP :** 500
- **Type :** GitHub repo + documentation d'architecture + démo
- **Objectif :** Concevoir et implémenter un système multi-agents capable de décomposer une tâche complexe, de coordonner plusieurs agents spécialisés et de produire un output cohérent.
- **Livrables :** Architecture documentée, agents spécialisés, orchestrateur, évaluation des performances.
- **Stack :** CrewAI, AutoGen, LangGraph, ou framework custom
- **Profil dominant :** Builder(0.3) · Strategist(0.4) · Creator(0.2) · Catalyst(0.1)

---

### 🌐 Web — 4 missions (complément au stock existant)

#### [INIT] Audit de performance web (Core Web Vitals)

- **XP :** 75
- **Type :** Document + screenshots
- **Objectif :** Auditer les Core Web Vitals (LCP, FID, CLS) d'un site en production et proposer un plan d'amélioration priorisé.
- **Outils :** Lighthouse, WebPageTest, Chrome DevTools
- **Profil dominant :** Builder(0.3) · Strategist(0.4) · Creator(0.2) · Catalyst(0.1)

#### [CORE] API REST sécurisée et documentée

- **XP :** 200
- **Type :** GitHub repo
- **Objectif :** Construire une API REST complète avec : authentification JWT, rate limiting, validation des inputs, documentation OpenAPI, tests d'intégration.
- **Stack :** Node.js/Python/Go, PostgreSQL, OpenAPI/Swagger
- **Profil dominant :** Builder(0.6) · Strategist(0.2) · Creator(0.1) · Catalyst(0.1)

#### [CORE] Refactoring — améliorer une codebase existante

- **XP :** 200
- **Type :** GitHub repo (fork + PR)
- **Objectif :** Forker un projet open-source, identifier les problèmes de qualité (dette technique, sécurité, performances) et soumettre une PR substantielle.
- **Profil dominant :** Builder(0.5) · Strategist(0.3) · Creator(0.1) · Catalyst(0.1)

#### [PRO] Architecture microservices

- **XP :** 450
- **Type :** GitHub repo + ADR
- **Objectif :** Décomposer un monolithe en microservices avec communication async (message queue), service discovery, et observabilité.
- **Stack :** Docker, RabbitMQ ou Kafka, Prometheus, API Gateway
- **Profil dominant :** Builder(0.4) · Strategist(0.4) · Creator(0.05) · Catalyst(0.15)

---

## CHANGEMENTS DB REQUIS

### Nouveaux champs sur `User`

```prisma
model User {
  // Existant à conserver
  domains          String[]
  tools            String[]
  technicalLevel   String?    // BEGINNER | INTERMEDIATE | ADVANCED

  // NOUVEAU
  primaryDomain    String?    // domaine principal (ex: "Cybersecurity")
  subDomain        String?    // sous-domaine (ex: "offensive")
  learningTools    String[]   // outils en cours d'apprentissage
  practiceMode     String?    // github | ctf_platform | learning_platform | team
  certifications   String[]   // certifs obtenues (OSCP, AWS-SAA, etc.)
  specializationAt DateTime?  // date du quiz de spécialisation
}
```

Migration : `npx prisma migrate dev --name add-specialization-fields`

---

## LOGIQUE DE RECOMMANDATION MISSIONS

```typescript
// lib/missions.ts — à ajouter
export function recommendMissions(user: {
  class: string;
  primaryDomain: string;
  technicalLevel: string;
  level: number;
  completedMissionIds: string[];
}): Mission[] {
  return MISSIONS.filter((m) => !user.completedMissionIds.includes(m.id))
    .filter((m) => m.minLevel <= user.level)
    .filter(
      (m) =>
        // Filtre domaine : mission compatible avec la spécialisation
        !m.domains ||
        m.domains.length === 0 ||
        m.domains.includes(user.primaryDomain),
    )
    .map((m) => ({
      ...m,
      score:
        (m.profileWeights[user.class] ?? 0.25) * 0.5 +
        (m.domains?.includes(user.primaryDomain) ? 0.4 : 0.1) +
        (m.techLevel === user.technicalLevel ? 0.1 : 0.0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}
```

---

## IMPLÉMENTATION — Ordre recommandé

```
Étape 1 (2j) — DB + types
  ├── Migration Prisma (nouveaux champs User)
  ├── Mettre à jour lib/types.ts (SubDomain, PracticeMode, etc.)
  └── Mettre à jour lib/tech-tree.ts → lib/tech-tree-v2.ts

Étape 2 (3j) — Quiz spécialisation
  ├── Créer components/quiz/specialization-quiz.tsx (10 questions + branching)
  ├── Créer app/api/specialization/route.ts (POST — sauvegarder résultats)
  └── Intégrer dans le funnel post-quiz psychométrique

Étape 3 (3j) — Missions
  ├── Ajouter les 18 nouvelles missions dans lib/missions.ts
  ├── Ajouter champ domains[] et techLevel sur chaque mission
  └── Implémenter recommendMissions() dans lib/missions.ts

Étape 4 (1j) — Recommandation dashboard
  ├── Brancher recommendMissions() dans app/dashboard/page.tsx
  └── Afficher "Recommandées pour toi : Builder Cybersec Intermediate"

Étape 5 (1j) — Update Settings
  ├── Mettre à jour components/settings/expertise-diagnostic.tsx
  └── Afficher primaryDomain + subDomain dans le dossier public
```

**Total estimé : ~10 jours**

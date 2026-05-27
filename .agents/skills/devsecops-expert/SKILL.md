# Skill: DevSecOps Expert 🛡️

Expertise de pointe en intégration de la sécurité dans le cycle de vie du développement logiciel (SDLC). Ce skill impose des standards rigoureux pour l'automatisation, l'audit et la remédiation des failles de sécurité.

## 🎯 Objectifs
- Éliminer les secrets en dur et les fuites d'identifiants.
- Sécuriser l'Infrastructure as Code (IaC) et les configurations Docker.
- Automatiser l'audit de vulnérabilités (SAST, SCA, DAST).
- Appliquer le principe du moindre privilège partout.

## 🛠️ Workflows Mandataires

### 1. Audit de Code (Shift-Left Security)
Avant toute validation de code, vérifier :
- **Secrets :** Aucune clé API, mot de passe ou token n'est présent (utiliser `.env.example` ou des gestionnaires de secrets).
- **SAST (Static Analysis) :** Vérification des injections SQL, XSS, et mauvaise gestion des erreurs (recherche de `dangerouslySetInnerHTML`, `eval`, etc.).
- **SCA (Software Composition Analysis) :** Vérification des dépendances vulnérables (`npm audit`).

### 2. Sécurité des Conteneurs (Docker)
- **Utilisateur :** Toujours définir un utilisateur non-root dans le Dockerfile (`USER nodejs`).
- **Surface d'attaque :** Utiliser des images de base minimales (`-alpine`).
- **Secrets au Build :** Ne jamais inclure de secrets de production dans les instructions `ENV` ou `ARG` du build (utiliser des placeholders si nécessaire pour la compilation Next.js).

### 3. Pipeline CI/CD (GitHub Actions)
- **Permissions :** Utiliser des permissions minimales pour les `GITHUB_TOKEN`.
- **Validation :** Intégrer des étapes de scan (`Trivy`, `Gitleaks`, `Checkov`) avant le déploiement.

## 📋 Checklist de Remédiation
Si une faille est détectée :
1. Isoler le composant vulnérable.
2. Analyser l'impact (propagation des données).
3. Appliquer le patch minimal (Hotfix).
4. Vérifier la régression.

## 📖 Références Standard
- **OWASP Top 10** (Web Security)
- **CIS Benchmarks** (Infrastructure hardening)
- **NIST 800-204** (Microservices Security)

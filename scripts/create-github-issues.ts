import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface GitHubIssue {
  title: string;
  labels: string[];
  body: string;
}

const ISSUES: GitHubIssue[] = [
  {
    title: "[SQUAD] Implémentation du Cron de Décomposition Quotidienne de la Cohésion (Cohesion Decay)",
    labels: ["type: feature", "priority: high", "area: squad"],
    body: `Afin d'éviter que la cohésion des escouades reste figée à $1.0$ sans activité continue (brisant la boucle neurologique d'engagement), nous devons implémenter une tâche planifiée quotidienne de dégradation de la cohésion. Si une escouade est inactive, sa cohésion baisse de $0.1$ par jour. Si le score descend sous le seuil critique de $0.9$, la série quotidienne (*streak*) est rompue.

### 🛠️ Spécifications Techniques
1. Créer une API route sécurisée : \`/app/api/internal/cron/squad-decay/route.ts\`.
2. Protéger la route par vérification du token \`CRON_SECRET\` présent dans l'en-tête \`Authorization: Bearer <token>\`.
3. Effectuer une mise à jour globale via Prisma :
   * \`cohesionScore = Math.max(0.0, cohesionScore - 0.1)\`
   * Si \`cohesionScore < 0.9\`, réinitialiser \`streakCount = 0\`.
4. Générer des logs système de type \`SQUAD_DECAY\` dans la table \`ActivityLog\`.

### 🧪 Critères d'Acceptation (Definition of Done)
* [ ] La route renvoie une erreur \`401 Unauthorized\` si le Bearer token est absent ou invalide.
* [ ] Une escouade inactive voit sa cohésion baisser de $10\\%$ par exécution du cron.
* [ ] Le streak d'une escouade avec $1.0$ de cohésion tombe à $0$ s'il passe en dessous de $0.9$.
* [ ] Les tests unitaires valident le calcul de la décomposition et la réinitialisation des streaks.`
  },
  {
    title: "[SQUAD] Calcul de l'Indice de Synergie Cognitive (Cross-Profiling Bonus)",
    labels: ["type: feature", "priority: high", "area: squad"],
    body: `HASHCODE valorise la diversité des compétences. Nous devons exploiter la typologie des 4 profils (*Builder, Creator, Strategist, Catalyst*) pour calculer un **Index de Synergie** au sein du Squad. Plus l'escouade réunit des profils complémentaires, plus elle bénéficie de bonus d'XP collectifs et d'une cohésion naturelle accrue.

### 🛠️ Spécifications Techniques
1. Créer une fonction utilitaire dans \`lib/squad-logic.ts\` : \`calculateSquadSynergy(members)\`.
2. Extraire la liste unique des classes de profil (\`User.class\`) des membres du Squad.
3. Calculer le score de synergie : $\\text{Score} = \\text{Nombre de classes uniques} \\div 4$.
4. Mettre en place un multiplicateur de récompense appliqué lors des soumissions de missions de Squad :
   * 1 profil unique : multiplicateur $x1.0$
   * 2 profils uniques : multiplicateur $x1.10$
   * 3 profils uniques : multiplicateur $x1.15$
   * 4 profils uniques (Synergie Parfaite) : multiplicateur $x1.25$ (+25% d'XP pour le groupe).
5. Afficher visuellement dans le composant \`SquadJourney\` les profils manquants pour motiver le recrutement stratégique.

### 🧪 Critères d'Acceptation (Definition of Done)
* [ ] La synergie est recalculée dynamiquement à chaque adhésion ou départ du Squad.
* [ ] Les bonus de multiplicateurs d'XP sont appliqués correctement lors du calcul des gains des missions.
* [ ] Le composant UI affiche clairement les icônes des profils cognitifs présents et en pointillés ceux qui manquent.`
  },
  {
    title: "[MISSIONS] Concept de Soumission Collective pour les Projets de Squad",
    labels: ["type: feature", "priority: high", "area: squad", "area: missions"],
    body: `Les missions de niveau \`PRO\` (Hackathons, projets inter-guildes) requièrent un travail d'équipe. Il est inefficace que chaque membre soumette le même lien séparément. Nous devons introduire un modèle de **Livrable de Squad**.

### 🛠️ Spécifications Techniques
1. Modifier la table \`MissionSubmission\` ou ajouter une table de liaison pour associer un co-auteur ou le \`organizationId\` (Squad) à la soumission.
2. Lorsqu'un membre soumet un projet au nom du Squad :
   * Il renseigne le projet et associe les co-auteurs parmi la liste des membres du Squad.
   * Une notification de validation de co-auteur est envoyée aux autres membres tagués pour éviter les abus.
3. Dès validation par l'administrateur, l'XP est distribuée au prorata de la synergie du Squad à tous les participants enregistrés.

### 🧪 Critères d'Acceptation (Definition of Done)
* [ ] Un utilisateur peut lier sa soumission de quête à son Squad et taguer un ou plusieurs co-équipiers.
* [ ] Les co-auteurs reçoivent une notification interactive pour accepter la paternité de la soumission.
* [ ] La validation par l'administrateur crédite l'XP à tous les co-auteurs validés en une seule transaction.`
  }
];

async function main() {
  console.log("🚀 Lancement du script d'envoi d'issues GitHub pour HASHCODE...\n");

  // 1. Vérification de l'existence de la CLI 'gh'
  try {
    execSync("gh --version", { stdio: "ignore" });
  } catch (error) {
    console.error("❌ Erreur : La CLI GitHub 'gh' n'est pas installée sur votre système.");
    console.error("👉 Installez-la via: winget install GitHub.cli (sur Windows)");
    process.exit(1);
  }

  // 2. Vérification de l'état d'authentification
  try {
    execSync("gh auth status", { stdio: "ignore" });
  } catch (error) {
    console.error("❌ Erreur : La CLI GitHub 'gh' n'est pas authentifiée.");
    console.error("👉 Lancez la commande suivante dans votre terminal :");
    console.error("   gh auth login");
    process.exit(1);
  }

  console.log("✓ CLI GitHub détectée et authentifiée.");
  console.log(`📋 ${ISSUES.length} issues prêtes à être envoyées...\n`);

  // 3. Création des issues
  const tempDir = path.join(process.cwd(), ".temp_issues");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  try {
    for (let i = 0; i < ISSUES.length; i++) {
      const issue = ISSUES[i];
      console.log(`⏳ Envoi de l'issue ${i + 1}/${ISSUES.length} : "${issue.title}"...`);

      // Écriture du corps dans un fichier temporaire pour éviter les problèmes d'échappement Shell
      const tempFilePath = path.join(tempDir, `issue_${i}.md`);
      fs.writeFileSync(tempFilePath, issue.body, "utf-8");

      const labelsArg = issue.labels.join(",");
      const command = `gh issue create --title "${issue.title.replace(/"/g, '\\"')}" --body-file "${tempFilePath}" --label "${labelsArg}"`;

      const result = execSync(command, { encoding: "utf-8" }).trim();
      console.log(`   ✓ Succès ! Issue créée : ${result}\n`);
    }
    console.log("🎉 Toutes les issues ont été injectées sur GitHub !");
  } catch (error: any) {
    console.error("❌ Une erreur est survenue lors de l'envoi d'une issue :");
    console.error(error.message);
  } finally {
    // Nettoyage des fichiers temporaires
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file));
      }
      fs.rmdirSync(tempDir);
    }
  }
}

main();

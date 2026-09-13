import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, Dirent } from "fs";
import { join, relative, sep } from "path";

const APP_DIR = join(process.cwd(), "app");
const PROXY_PATH = join(process.cwd(), "proxy.ts");

const GUARDS = ["requireSession", "requireRole", "requirePageSession", "requirePageRole"];

/**
 * Récursivement, trouve tous les fichiers page.tsx sous app/.
 */
function findPageFiles(dir: string): string[] {
  const results: string[] = [];
  let entries: Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPageFiles(fullPath));
    } else if (entry.name === "page.tsx") {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Normalise le chemin d'un fichier page.tsx en route d'URL.
 * Exemples :
 *   app/academy/my-courses/page.tsx         → /academy/my-courses
 *   app/academy/my-courses/[id]/page.tsx   → /academy/my-courses/[id]
 *   app/(auth)/signin/page.tsx            → /signin   (groupe supprimé)
 */
function pageToRoute(filePath: string): string {
  const rel = relative(APP_DIR, filePath);
  const parts = rel.split(sep);
  const routeParts = parts.filter(
    (p) => p !== "page.tsx" && !(p.startsWith("(") && p.endsWith(")")),
  );
  return "/" + routeParts.join("/");
}

/**
 * Lit PROTECTED_PATHS depuis proxy.ts par parsing du tableau de chaînes.
 */
function readProtectedPaths(): string[] {
  const content = readFileSync(PROXY_PATH, "utf-8");
  const match = content.match(/PROTECTED_PATHS\s*=\s*\[([^\]]*)\]/s);
  if (!match) return [];
  const paths: string[] = [];
  const strRegex = /"([^"]*)"|'([^']*)'/g;
  let m: RegExpExecArray | null;
  while ((m = strRegex.exec(match[1])) !== null) {
    paths.push(m[1] ?? m[2]);
  }
  return paths;
}

/**
 * Vérifie qu'une route est couverte par au moins un PROTECTED_PATHS
 * en utilisant le même matching startsWith que proxy.ts.
 */
function isProtected(route: string, protectedPaths: string[]): boolean {
  return protectedPaths.some((p) => route.startsWith(p));
}

/**
 * Détecte l'appel d'une fonction de garde dans le contenu d'une page.
 * Retourne le nom de la première garde trouvée, ou null.
 */
function detectGuardCall(content: string): string | null {
  for (const guard of GUARDS) {
    // requireSession(  → mais PAS requirePageSession(
    // requirePageSession n'est pas un préfixe de requireSession, donc l'ordre
    // des itérations n'introduit pas d'amBIGÜITÉ.
    if (new RegExp(`${guard}\\s*\\(`).test(content)) {
      return guard;
    }
  }
  return null;
}

describe("Private routes guard — chaque page utilisant une fonction d'auth doit être dans PROTECTED_PATHS", () => {
  const protectedPaths = readProtectedPaths();
  const pageFiles = findPageFiles(APP_DIR);

  it("PROTECTED_PATHS est non vide et couvre les routes academy", () => {
    expect(protectedPaths.length).toBeGreaterThan(0);
    expect(protectedPaths).toContain("/academy/my-courses");
    expect(protectedPaths).toContain("/academy/certificates");
  });

  it("toutes les pages privées sont protégées par PROTECTED_PATHS", () => {
    const uncovered: { route: string; guard: string }[] = [];

    for (const file of pageFiles) {
      const content = readFileSync(file, "utf-8");
      const route = pageToRoute(file);
      const guard = detectGuardCall(content);

      if (guard && !isProtected(route, protectedPaths)) {
        uncovered.push({ route, guard });
      }
    }

    if (uncovered.length > 0) {
      const details = uncovered
        .map(
          (u) =>
            `Route privée NON protégée : ${u.route}\n` +
            `Elle appelle ${u.guard} mais n'est couverte par aucun PROTECTED_PATHS de proxy.ts.\n` +
            "Ajoute-la à PROTECTED_PATHS (ou vérifie que c'est intentionnel).",
        )
        .join("\n\n");
      throw new Error(details);
    }

    expect(uncovered).toHaveLength(0);
  });
});

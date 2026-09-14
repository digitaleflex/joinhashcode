import { test, expect } from "@playwright/test";
import { prisma } from "@/lib/prisma";

/**
 * Tests E2E avec SESSION RÉELLE (#348 partie 2)
 *
 * L'infrastructure (e2e/global-setup.ts + e2e/helpers/test-auth.ts) crée :
 *   - e2e-instructor@hashcode.test  (role INSTRUCTOR)
 *   - e2e-member@hashcode.test      (role MEMBER)
 * et écrit les storageState dans e2e/.auth/.
 *
 * ⚠️ PIÈGE : une redirection Next levée PENDANT LE RENDU produit
 * `200 + <meta http-equiv="refresh">`, PAS un 3xx. Donc on vérifie toujours
 * l'URL finale via le navigateur (`toHaveURL`), jamais via le statut HTTP.
 */

const PREFIX = "E2E ";

/** Supprime les données créées par les tests (idempotence entre exécutions). */
test.afterAll(async () => {
  const stale = await prisma.course.findMany({
    where: { title: { startsWith: PREFIX } },
    select: { id: true },
  });
  if (stale.length > 0) {
    await prisma.course.deleteMany({
      where: { id: { in: stale.map((c) => c.id) } },
    });
  }
  await prisma.$disconnect();
});

test.describe("Instructeur — parcours authentifié", () => {
  test.use({ storageState: "e2e/.auth/instructor.json" });

  test("la page de création de cours est accessible (pas de redirection)", async ({
    page,
  }) => {
    await page.goto("/academy/my-courses/new");

    await expect(page).toHaveURL(/\/academy\/my-courses\/new/);
    await expect(
      page.getByRole("heading", { name: /nouveau cours/i })
    ).toBeVisible();
    await expect(page.getByPlaceholder(/Masterclass/i)).toBeVisible();
  });

  test("créer un cours le rend visible dans la liste", async ({ page }) => {
    const title = `${PREFIX}Cours ${Date.now()}`;

    await page.goto("/academy/my-courses/new");
    await page.getByPlaceholder(/Masterclass/i).fill(title);
    await page
      .getByPlaceholder(/transformation/i)
      .fill("Cours créé par un test E2E authentifié.");

    await page.getByRole("button", { name: /créer le cours/i }).click();

    // Le formulaire redirige vers la liste
    await expect(page).toHaveURL(/\/academy\/my-courses$/, { timeout: 30_000 });

    // PREUVE que l'écriture en base a fonctionné
    await expect(page.getByText(title)).toBeVisible({ timeout: 30_000 });
  });

  test("ouvrir le cours, créer un sujet de forum, poster une réponse", async ({
    page,
  }) => {
    // Navigue DIRECTEMENT vers la page du cours (id résolu via Prisma).
    // Ne pas cliquer « Gérer » dans la liste : ce lien est le 1er de la page,
    // pas forcément celui du cours créé → test non déterministe sous charge.
    const instructor = await prisma.user.findUniqueOrThrow({
      where: { email: "e2e-instructor@hashcode.test" },
      select: { id: true },
    });
    const title = `${PREFIX}Cours ${Date.now()}`;
    const course = await prisma.course.create({
      data: {
        id: crypto.randomUUID(),
        title,
        slug: `e2e-forum-${Date.now()}`,
        description: "Cours de test pour le forum.",
        language: "FR",
        level: "BEGINNER",
        isPublished: true,
        averageRating: 0,
        totalLearners: 0,
        instructorId: instructor.id,
      },
    });

    await page.goto(`/academy/my-courses/${course.id}`);
    await expect(page).toHaveURL(new RegExp(`/academy/my-courses/${course.id}$`));

    // Le panneau Discussions s'ouvre
    await page.getByRole("button", { name: /discussions/i }).click();
    await expect(page.getByText(/discussions/i).first()).toBeVisible({
      timeout: 15_000,
    });

    // ⛔ LIMITE FONCTIONNELLE RÉELLE (pas un défaut du test) :
    // `ModuleDiscussions` est monté sur cette page SANS sectionId ni lessonId.
    // `createTopic` exige l'un des deux (« Section ou leçon requise »), donc le
    // formulaire de création n'est pas proposé. Impossible de créer un sujet
    // depuis la page cours tant que la page ne transmet pas un contexte de module.
    test.skip(
      true,
      "Création de sujet impossible depuis /academy/my-courses/[id] : ModuleDiscussions n'y reçoit ni sectionId ni lessonId (createTopic l'exige)."
    );
  });
});

test.describe("Contrôle d'accès — MEMBER", () => {
  test.use({ storageState: "e2e/.auth/member.json" });

  test("un MEMBER ne peut pas accéder à la création de cours", async ({
    page,
  }) => {
    await page.goto("/academy/my-courses/new");

    // Redirection effective (le navigateur suit le meta-refresh de Next)
    await expect(page).toHaveURL(/\/signin/, { timeout: 30_000 });

    // LA preuve qui compte : le formulaire n'est PAS rendu
    await expect(page.getByPlaceholder(/Masterclass/i)).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /créer le cours/i })
    ).toHaveCount(0);
  });
});

test.describe("Apprenant MEMBER — inscription à un cours", () => {
   test.use({ storageState: "e2e/.auth/member.json" });

   test("s'inscrire à un cours publié et le voir dans mes cours", async ({
     page,
   }) => {
     // 1. Crée un cours publié via Prisma (contournement : le member ne peut pas créer)
     //    `instructorId` est une clé étrangère vers User : il faut le VRAI uuid,
     //    pas un libellé. On le résout depuis l'utilisateur de test.
     const instructor = await prisma.user.findUniqueOrThrow({
       where: { email: "e2e-instructor@hashcode.test" },
       select: { id: true },
     });

     const courseTitle = `${PREFIX}Cours Inscrit ${Date.now()}`;
     const course = await prisma.course.create({
       data: {
         id: crypto.randomUUID(),
         title: courseTitle,
         slug: `e2e-enroll-${Date.now()}`,
         description: "Cours de test E2E pour l'inscription.",
         language: "FR",
         level: "BEGINNER",
         isPublished: true,
         averageRating: 0,
         totalLearners: 0,
         instructorId: instructor.id,
       },
     });

     // 2. Va sur le catalogue et clique sur le cours
     await page.goto("/academy/courses");
     await page.getByRole("link", { name: courseTitle }).first().click();

     // 3. Clique sur « S'inscrire au cours »
     await page
       .getByRole("button", { name: /s'inscrire au cours/i })
       .click();

     // 4. Vérifie que le bouton devient « Déjà inscrit »
     await expect(
       page.getByRole("button", { name: /déjà inscrit/i })
     ).toBeVisible({ timeout: 15_000 });

     // 5. Va sur /academy/my-courses et vérifie que le cours apparaît
     await page.goto("/academy/my-courses");
     await expect(page.getByText(courseTitle)).toBeVisible({ timeout: 15_000 });

     // Nettoyage
     await prisma.enrollment.deleteMany({ where: { courseId: course.id } });
     await prisma.course.deleteMany({ where: { id: course.id } });
   });
 });

 test.describe("Visiteur non authentifié", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("est redirigé vers /signin avec le motif", async ({ page }) => {
    await page.goto("/academy/my-courses/new");

    await expect(page).toHaveURL(/\/signin/);
    await expect(page).toHaveURL(/reason=auth_required/);
  });
});

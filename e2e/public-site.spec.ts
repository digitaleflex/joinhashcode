import { expect, test } from "@playwright/test"

test.describe("Vitrine publique HashCode", () => {
  test("présente clairement la proposition de valeur sur l'accueil", async ({ page }) => {
    await page.goto("/")

    await expect(page).toHaveTitle(/HashCode/i)
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /analyste SOC junior/i,
    )
    await expect(
      page.getByRole("link", { name: /Faire mon premier lab/i }).first(),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Voir des preuves" }).first(),
    ).toBeVisible()
  })

  test("présente les trois domaines actifs et les ancres correspondantes", async ({ page }) => {
    await page.goto("/programs")

    await expect(
      page.getByRole("heading", { name: "Développement web" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Cybersécurité" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Intelligence artificielle appliquée" }),
    ).toBeVisible()

    await expect(page.locator("#web-development")).toBeVisible()
    await expect(page.locator("#cybersecurity")).toBeVisible()
    await expect(page.locator("#applied-ai")).toBeVisible()
  })

  test("expose la FAQ et ses réponses", async ({ page }) => {
    await page.goto("/")
    const question = page.getByText("À qui s'adresse HashCode ?")
    await expect(question).toBeVisible()
    await question.click()
    await expect(
      page.getByText(/autodidactes, étudiants et personnes en reconversion/i),
    ).toBeVisible()
  })

  test("les principales pages publiques utilisent la structure de vitrine", async ({ page }) => {
    const routes = [
      { path: "/about", heading: /Faire grandir les talents/i },
      { path: "/labs", heading: /Apprendre en pratiquant/i },
      { path: "/community", heading: /Une communauté portée/i },
      { path: "/talents", heading: /Des preuves, pas de simples déclarations/i },
      { path: "/recruteurs", heading: /Lire une preuve HashCode/i },
    ]

    for (const route of routes) {
      await page.goto(route.path)
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        route.heading,
      )
    }
  })

  test("le menu mobile est accessible et permet d'ouvrir la page des labs", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")

    await page.getByRole("button", { name: "Ouvrir le menu" }).click()
    const mobileNavigation = page.getByRole("navigation", {
      name: "Navigation mobile",
    })
    await expect(mobileNavigation).toBeVisible()

    await mobileNavigation.getByRole("link", { name: "Labs" }).click()
    await expect(page).toHaveURL(/\/labs$/)
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Apprendre en pratiquant/i,
    )
  })
})

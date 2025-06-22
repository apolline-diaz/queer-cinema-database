import { test as base, expect, Page } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.PLAYWRIGHT_USER_EMAIL as string;
const password = process.env.PLAYWRIGHT_USER_PASSWORD as string;

type CustomFixtures = {
  authenticatedPage: Page;
};

const test = base.extend<CustomFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto("/login");
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.getByPlaceholder("Tapez votre adresse e-mail").fill(email);
    await page.getByPlaceholder("Tapez votre mot de passe").fill(password);

    await page.getByRole("button", { name: "Se connecter" }).click();

    await page.locator('[id="radix-\\:Riicq\\:"]').click();

    await expect(
      page.getByRole("menuitem", { name: "Mes Listes" })
    ).toBeVisible();

    await use(page);
  },
});

test("edit a movie", async ({ authenticatedPage: page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Catalogue", exact: true }).click();

  await page.getByRole("link", { name: "Movie Title" }).click();

  await page
    .getByRole("link")
    .filter({ hasText: /^$/ })
    .getByRole("button")
    .click();

  // Title
  await page.locator('input[name="title"]').fill("Movie Title Update");

  // Director
  await page
    .getByRole("textbox", { name: "Chercher et ajouter des ré" })
    .click();
  await page.getByText("Karen Duthie").click();

  await page.locator('textarea[name="description"]').fill("Update description");

  // Year
  await page.locator('select[name="release_date"]').selectOption("2011");

  // Country
  await page.getByLabel("Pays").selectOption("628");

  // Language
  await page.locator('input[name="language"]').fill("Anglais");

  // Mots-clés

  await page
    .getByRole("textbox", { name: "Chercher et ajouter des mot-" })
    .click();
  await page
    .getByRole("textbox", { name: "Chercher et ajouter des mot-" })
    .fill("d");
  await page.getByText("Amérique du Nord").click();
  await page
    .locator("span")
    .filter({ hasText: "Afrique×" })
    .getByRole("button")
    .click();

  // Enregistrer les modifications
  await page
    .getByRole("button", { name: "Enregistrer les modifications" })
    .click();

  // Vérifier que le titre modifié est bien présent
  await expect(page.getByText("Movie Title Update")).toBeVisible();
});

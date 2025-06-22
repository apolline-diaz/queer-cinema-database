import { test as base, expect, Page } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.PLAYWRIGHT_USER_EMAIL as string;
const password = process.env.PLAYWRIGHT_USER_PASSWORD as string;

type CustomFixtures = {
  authenticatedPage: Page;
};

// create a custom test fixture that includes authentication
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
    // pass the authenticated page to the test
    await use(page);
  },
});

test("add a movie", async ({ authenticatedPage: page }) => {
  await page.goto("/");

  await page.locator('[id="radix-\\:Riicq\\:"]').click();

  await page.getByRole("link", { name: "Contribuer" }).click();

  await page.locator("html").click();

  // Title field
  await page
    .getByRole("textbox", { name: "Tapez le titre..." })
    .fill("Movie Title");

  // Director field
  await page
    .getByRole("textbox", { name: "Tapez le nom du/de la ré" })
    .fill("Director");

  // Description field
  await page
    .getByRole("textbox", { name: "Résumé de l'oeuvre..." })
    .fill("Description");

  // Year release
  await page.locator('select[name="release_date"]').selectOption("2025");

  // Country of production
  await page.locator('select[name="country_id"]').selectOption("666");

  // Runtime
  await page.getByPlaceholder("00").fill("12");

  // Type
  await page.locator('select[name="type"]').selectOption("Moyen-métrage");

  // Genre
  await page.locator('select[name="genre_id"]').selectOption("6");

  // Keywords
  await page
    .getByRole("textbox", { name: "Chercher et ajouter des mot-" })
    .click();
  await page
    .getByRole("textbox", { name: "Chercher et ajouter des mot-" })
    .fill("a");
  await page.getByText("Afrique", { exact: true }).click();

  // Upload d'image - utilise le name attribute
  await page
    .locator('input[name="image_url"]')
    .setInputFiles("public/assets/diary.png");

  // Cliquer sur le bouton Ajouter
  await page.getByRole("button", { name: "Ajouter" }).click();
});

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
    await page.setViewportSize({ width: 1280, height: 720 });

    // perform login
    await page.goto("/login");
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page.getByTestId("profile-link-desktop")).toBeVisible();
    // pass the authenticated page to the test
    await use(page);
  },
});

test("create movie", async ({ authenticatedPage: page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Contribuer" }).click();
  await expect(
    page.getByRole("heading", { name: "Ajouter un film" })
  ).toBeVisible();

  // fill in the form with proper selectors matching your form
  // Remplir le titre - utilise le name attribute du register
  await page.locator('input[name="title"]').fill("Titre du film de test");

  // Remplir le titre original - correction de la faute de frappe
  await page
    .locator('input[name="original_title"]')
    .fill("Original Movie Title");

  // Remplir le réalisateur
  await page.locator('input[name="director_name"]').fill("Réalisateur du film");

  // Remplir la description
  await page
    .locator('textarea[name="description"]')
    .fill("Description du film de test");

  // Sélectionner l'année de sortie
  await page.locator('select[name="release_date"]').selectOption("2023");

  // Sélectionner le pays - utilise le name attribute
  await page.locator('select[name="country_id"]').selectOption("1"); // Ajustez l'ID selon vos données

  // Remplir la durée
  await page.locator('input[name="runtime"]').fill("120");

  // Sélectionner le type
  await page.locator('select[name="type"]').selectOption("Long-métrage");

  // Sélectionner le genre
  await page.locator('select[name="genre_id"]').selectOption("1"); // Ajustez l'ID selon vos données

  // Gérer les mots-clés avec MultiSelect
  // Vous devrez ajuster ceci selon l'implémentation de votre composant MultiSelect
  // Si votre MultiSelect a un input spécifique, utilisez son sélecteur approprié
  await page
    .locator('input[placeholder="Chercher et ajouter des mot-clés..."]')
    .click();
  await page
    .locator('input[placeholder="Chercher et ajouter des mot-clés..."]')
    .fill("romance");
  // Attendre que les options apparaissent et cliquer sur une option
  await page.waitForSelector("text=romance", { timeout: 5000 });
  await page.getByText("romance").first().click();

  // Upload d'image - utilise le name attribute
  await page
    .locator('input[name="image_url"]')
    .setInputFiles("public/assets/diary.png");

  // Cliquer sur le bouton Ajouter
  await page.getByRole("button", { name: "Ajouter" }).click();
});

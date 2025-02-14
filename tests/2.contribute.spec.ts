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
    // perform login
    await page.goto("http://localhost:3000/login");
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page.getByRole("link", { name: "Profil" })).toBeVisible();

    // pass the authenticated page to the test
    await use(page);
  },
});

test("contribute", async ({ authenticatedPage: page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page.getByRole("link", { name: "movie diary" })).toBeVisible();

  await page.getByRole("link", { name: "Profil" }).click();

  await expect(page.getByText("Contribuer")).toBeVisible();

  await page.getByRole("link", { name: "Profil" }).click();

  await page.getByRole("link", { name: "Ajouter un film" }).click();

  await expect(page.getByText("Ajouter un film au catalogue")).toBeVisible();

  await page.getByRole("textbox", { name: "Titre" }).click();
  await page.getByRole("textbox", { name: "Titre" }).fill("Titre du film");

  await page.getByRole("textbox", { name: "Réalisateur-ice" }).click();
  await page
    .getByRole("textbox", { name: "Réalisateur-ice" })
    .fill("Réalisateur du film");

  await page.getByRole("textbox", { name: "Synopsis" }).click();
  await page
    .getByRole("textbox", { name: "Synopsis" })
    .fill("Description du film");

  await page.getByLabel("Année de sortie").selectOption("2025");

  await page.locator("#grid-country").selectOption("510");

  await page.getByRole("spinbutton", { name: "Durée (minutes)" }).click();
  await page.getByRole("spinbutton", { name: "Durée (minutes)" }).fill("100");

  await page.locator("#grid-genre").selectOption("3");
  await page
    .getByRole("textbox", { name: "Tapez pour rechercher des mots-clés" })
    .click();
  await page
    .getByRole("textbox", { name: "Tapez pour rechercher des mots-clés" })
    .fill("lg");

  await page.getByText("lgbt").click();

  await page.getByRole("textbox", { name: "Image" }).click();
  await page
    .getByRole("textbox", { name: "Image" })
    .setInputFiles("public/assets/diary.png");
  await page.getByRole("button", { name: "Ajouter" }).click();
});

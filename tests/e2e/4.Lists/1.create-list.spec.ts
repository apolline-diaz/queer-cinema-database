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

test("create list", async ({ authenticatedPage: page }) => {
  await page.goto("/");

  await page.locator('[id="radix-\\:Riicq\\:"]').click();
  await page.getByRole("link", { name: "Mes Listes" }).click();
  await page.locator("html").click();
  await page.getByRole("link", { name: "Créer une nouvelle liste" }).click();

  await page
    .getByRole("textbox", { name: "Entrez un titre..." })
    .fill("New List");
  await page
    .getByRole("textbox", { name: "Entrez une description..." })
    .click();
  await page
    .getByRole("textbox", { name: "Entrez une description..." })
    .fill("Description list");
  await page.getByRole("textbox", { name: "Cherchez des films..." }).click();
  await page.getByRole("textbox", { name: "Cherchez des films..." }).fill("a");
  await page
    .getByRole("listitem")
    .filter({ hasText: "% Woman 2004" })
    .locator("span")
    .click();
  await page.getByRole("button", { name: "Créer la liste" }).click();

  await expect(page.getByRole("heading", { name: "New List" })).toBeVisible();
});

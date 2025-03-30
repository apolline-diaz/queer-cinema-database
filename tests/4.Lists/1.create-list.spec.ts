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
    // pass the authenticated page to the test
    await use(page);
  },
});

test("create list", async ({ authenticatedPage: page }) => {
  await page.goto("/");

  await page.getByTestId("profile-link-desktop").click();
  await page.getByRole("link", { name: "Créer une nouvelle liste" }).click();
  await page.getByRole("textbox", { name: "Titre de la liste" }).click();
  await page
    .getByRole("textbox", { name: "Titre de la liste" })
    .fill("Ma nouvelle liste");
  await page.getByRole("textbox", { name: "Description" }).click();
  await page
    .getByRole("textbox", { name: "Description" })
    .fill("Liste de mes derniers films vus");
  await page.getByRole("textbox", { name: "Films" }).click();
  await page.getByRole("textbox", { name: "Films" }).fill("Jennifer");
  await page.getByText("Jennifer's Body2009").click();
  await page.getByRole("button", { name: "Ajouter" }).click();
});

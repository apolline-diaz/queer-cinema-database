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
    await page.goto("/login");
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.waitForURL("/**"); // Attendre la fin de la redirection

    // Augmentez le timeout pour l'élément profile-link-desktop
    await expect(page.getByTestId("profile-link-desktop")).toBeVisible({
      timeout: 10000,
    });
    // pass the authenticated page to the test
    await use(page);
  },
});

test("create movie", async ({ authenticatedPage: page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Contribuer" }).click();
  await expect(
    page.getByRole("heading", { name: "Ajouter un film au catalogue" })
  ).toBeVisible();

  // fill in the form with proper selectors matching your form
  await page.locator("#title").click();
  await page.locator("#title").fill("Titre du film");

  await page.locator("#director_name").click();
  await page.locator("#director_name").fill("Réalisateur du film");

  await page.locator("#description").click();
  await page.locator("#description").fill("Description du film");

  await page.locator("#release_date").selectOption("2025");

  await page.locator("#grid-country").selectOption("510");

  await page.locator("#runtime").click();
  await page.locator("#runtime").fill("100");

  await page.locator("#grid-genre").selectOption("3");

  // handle keywords with proper name attribute
  await page.locator("#keyword_input").click();
  await page.locator("#keyword_input").fill("lg");
  await page.getByText("lgbt").click();

  // handle file upload with proper input type
  await page.locator("#image_url").setInputFiles("public/assets/diary.png");

  await page.getByRole("button", { name: "Ajouter" }).click();
});

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

    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(password);
    await page.getByTestId("login-submit-button").click();

    await page.waitForURL("/", { timeout: 10000 });

    await use(page);
  },
});

test("create list", async ({ authenticatedPage: page }) => {
  const mobileMenu = page.getByTestId("user-menu-trigger-mobile");
  const desktopMenu = page.getByTestId("user-menu-trigger-desktop");

  if (await mobileMenu.isVisible()) {
    await mobileMenu.click();
  } else {
    await desktopMenu.click();
  }

  await page.getByTestId("lists-link").click();

  await page.waitForURL(/.*\/lists/);

  await page.waitForLoadState("networkidle");

  await page.getByTestId("create-list-link").click();

  await page.waitForURL(/.*\/lists\/create/);

  await page.getByTestId("title-input").fill("New List");

  await page.getByTestId("description-input").fill("Description list");

  await page.getByTestId("movie-search-input").fill("a");

  await page.waitForSelector('[data-testid="movie-suggestions-list"]', {
    timeout: 5000,
  });

  await page
    .getByTestId("movie-suggestions-list")
    .locator("li")
    .filter({ hasText: "% Woman 2004" })
    .click();

  await page.getByTestId("create-list-submit-button").click();

  await expect(page.getByRole("heading", { name: "New List" })).toBeVisible();
});

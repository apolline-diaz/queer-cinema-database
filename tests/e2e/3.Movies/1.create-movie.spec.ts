import { test as base, expect, Page } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

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

    // pass the authenticated page to the test
    await use(page);
  },
});

test("create movie", async ({ authenticatedPage: page }) => {
  await page.goto("/");
  await page.setViewportSize({ width: 1280, height: 720 });

  const mobileMenu = page.getByTestId("user-menu-trigger-mobile");
  const desktopMenu = page.getByTestId("user-menu-trigger-desktop");

  if (await mobileMenu.isVisible()) {
    await mobileMenu.click();
    await page.waitForSelector('[data-testid="user-menu-mobile"]', {
      state: "visible",
    });
    await page.getByTestId("contribute-menu-item").click({ force: true });
  } else {
    await desktopMenu.click();

    await page.waitForSelector('[data-testid="user-menu-desktop"]', {
      state: "visible",
    });

    await page.getByTestId("contribute-menu-item").click({ force: true });
  }

  await page.getByTestId("title-input").fill("Test Movie");
  await page.getByTestId("original-title-input").fill("Test Movie Original");
  await page.getByTestId("director-name-input").fill("Test Director");
  await page.getByTestId("description-textarea").fill("Un super film de test");
  await page.getByTestId("release-date-select").selectOption("2025");
  await page.getByTestId("country-select").selectOption("666");
  await page.getByTestId("runtime-input").fill("90");
  await page.getByTestId("type-select").selectOption("Long-métrage");
  await page.getByTestId("genre-select").selectOption("6");

  await page.getByTestId("keywords-multiselect").click();
  await page.getByTestId("keywords-multiselect").fill("Afrique");
  await page.getByText("Afrique").click();

  const filePath = path.resolve(__dirname, "../public/assets/diary.png");
  await page.getByTestId("image-upload").setInputFiles(filePath);

  await page.getByTestId("submit-button").click();

  await expect(page).toHaveURL(/.*\/movies/);
});

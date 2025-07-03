import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.PLAYWRIGHT_USER_EMAIL as string;
const password = process.env.PLAYWRIGHT_USER_PASSWORD as string;

test("login", async ({ page }) => {
  await page.goto("/login");
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.getByTestId("email-input").fill(email);
  await page.getByTestId("password-input").fill(password);

  await page.getByTestId("login-submit-button").click();

  await page.waitForURL("/", { timeout: 10000 });

  const mobileMenu = page.getByTestId("user-menu-trigger-mobile");
  const desktopMenu = page.getByTestId("user-menu-trigger-desktop");

  if (await mobileMenu.isVisible()) {
    await mobileMenu.click();
  } else {
    await desktopMenu.click();
  }
  await expect(page.getByTestId("my-lists-menu-item")).toBeVisible();

  await expect(page.getByTestId("logout-button")).toBeVisible();
});

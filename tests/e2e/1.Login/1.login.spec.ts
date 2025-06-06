import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.PLAYWRIGHT_USER_EMAIL as string;
const password = process.env.PLAYWRIGHT_USER_PASSWORD as string;

test("login", async ({ page }) => {
  await page.goto("/login");
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByTestId("profile-link-desktop")).toBeVisible();
  await page.getByTestId("profile-link-desktop").click();
});

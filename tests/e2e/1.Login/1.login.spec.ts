import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.PLAYWRIGHT_USER_EMAIL as string;
const password = process.env.PLAYWRIGHT_USER_PASSWORD as string;

test("login", async ({ page }) => {
  await page.goto("/login");
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.getByPlaceholder("Tapez votre adresse e-mail").fill(email);
  await page.getByPlaceholder("Tapez votre mot de passe").fill(password);

  console.log("Email:", email);
  console.log("Password:", password);

  await page.getByRole("button", { name: "Se connecter" }).click();

  await page.locator('[id="radix-\\:Riicq\\:"]').click();

  await expect(
    page.getByRole("menuitem", { name: "Mes Listes" })
  ).toBeVisible();
});

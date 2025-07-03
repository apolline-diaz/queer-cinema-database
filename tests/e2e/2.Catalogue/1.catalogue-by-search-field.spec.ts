import { test, expect } from "@playwright/test";

test("catalogue by searchfield", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize({ width: 1280, height: 720 });

  await page
    .getByRole("link", { name: "Catalogue", exact: true })
    .first()
    .click();

  await expect(
    page.locator("h1.text-2xl", { hasText: "Catalogue" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Recherche simple" }).click();

  await page
    .getByRole("textbox", { name: "Entrez un mot ou un titre..." })
    .fill("jennifer");
  await page.getByRole("button", { name: "Rechercher" }).click();

  await expect(page.getByText("Jennifer's Body")).toBeVisible();
});

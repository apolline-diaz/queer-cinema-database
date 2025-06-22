import { test, expect } from "@playwright/test";

test("catalogue by searchfield", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("link", { name: "Catalogue", exact: true })
    .first()
    .click();

  await expect(page.getByRole("heading", { name: "Catalogue" })).toBeVisible();

  await page
    .getByRole("textbox", { name: "Entrez un mot ou un titre..." })
    .fill("gay");
  await page.getByRole("button", { name: "Rechercher" }).click();

  await expect(page.getByText("INSIDE THE CHINESE CLOSET")).toBeVisible();
});

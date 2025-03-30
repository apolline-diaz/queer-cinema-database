import { test, expect } from "@playwright/test";

test("catalogue by searchfield", async ({ page }) => {
  await page.goto("/");

  // expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Movie Diary");

  await page.getByRole("link", { name: "Catalogue", exact: true }).click();
  await page.getByRole("button", { name: "Recherche simple" }).click();
  await page.getByRole("textbox", { name: "Entrez un titre de film" }).click();
  await page
    .getByRole("textbox", { name: "Entrez un titre de film" })
    .fill("jennifer");
  await page
    .getByRole("link", { name: "Jennifer's Body Jennifer's Body" })
    .click();
  await page.getByRole("heading", { name: "Jennifer's Body" }).click();
});

import { test, expect } from "@playwright/test";

test("catalogue", async ({ page }) => {
  await page.goto("/");

  // expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Movie Diary");

  await expect(page.getByRole("link", { name: "Catalogue" })).toBeVisible();

  await page.getByRole("link", { name: "Catalogue" }).click();
  await expect(page.getByText("Recherche")).toBeVisible();
});

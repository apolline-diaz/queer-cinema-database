import { test, expect } from "@playwright/test";

test("films by searchfield", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.getByRole("link", { name: "Films", exact: true }).first().click();

  await expect(page.locator("h1", { hasText: "Films" })).toBeVisible();

  await page.getByTestId("simple-search-button").click();

  await expect(page.getByTestId("search-input")).toBeVisible();

  await page.getByTestId("search-input").fill("jennifer");

  await page.getByTestId("search-button").click();

  await page.waitForLoadState("networkidle");

  await expect(page.getByText("Jennifer's Body")).toBeVisible();

  await expect(page.getByTestId("results-count")).toContainText(
    "titres trouvés"
  );
});

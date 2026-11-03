import { expect, test } from "@playwright/test";

test("/ redirects to /home", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL("/home");
});

test("/contact redirects to /home", async ({ page }) => {
  await page.goto("/contact");

  await expect(page).toHaveURL("/home");
});

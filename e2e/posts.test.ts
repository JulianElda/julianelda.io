import { expect, test } from "@playwright/test";

test("/posts groups posts by year with a count", async ({ page }) => {
  await page.goto("/posts");

  await expect(
    page.getByRole("heading", { level: 2, name: "2026" }),
  ).toBeVisible();
  await expect(page.getByText("2 posts")).toBeVisible();
});

test("the Writing nav link is current on a post page", async ({ page }) => {
  await page.goto("/posts/fail-early-fail-fast");

  await expect(
    page.getByRole("navigation", { name: "Sections" }).getByRole("link", {
      name: "Writing",
    }),
  ).toHaveAttribute("aria-current", "page");
});

test("a post page shows its reading time", async ({ page }) => {
  await page.goto("/posts/fail-early-fail-fast");

  await expect(page.getByText(/\d+ min read/)).toBeVisible();
});

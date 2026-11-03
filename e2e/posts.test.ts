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

test("links to other sites open in a new tab; links within the site do not", async ({
  page,
}) => {
  await page.goto("/posts/my-tech-stack");

  const external = page.locator(
    'main a[href^="http"], article a[href^="http"]',
  );
  await expect(external.first()).toBeVisible();
  const attributes = await external.evaluateAll((links) =>
    links.map((link) => [
      link.getAttribute("target"),
      link.getAttribute("rel"),
    ]),
  );
  expect(attributes.length).toBeGreaterThan(0);
  expect(attributes).toEqual(
    attributes.map(() => ["_blank", "noopener noreferrer"]),
  );
  await expect(
    page.getByRole("link", { name: "← All writing" }),
  ).not.toHaveAttribute("target");

  await page.goto("/home");
  await expect(page.getByRole("link", { name: "Instagram" })).toHaveAttribute(
    "target",
    "_blank",
  );
  await expect(
    page.getByRole("link", { name: "Fail early, fail fast" }),
  ).not.toHaveAttribute("target");
});

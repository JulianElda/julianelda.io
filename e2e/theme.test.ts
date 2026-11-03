import { expect, test } from "@playwright/test";

test.describe("SSR theme resolution", () => {
  test.use({ javaScriptEnabled: false });

  test("resolves dark from the theme cookie", async ({ context, page }) => {
    await context.addCookies([
      { name: "theme", url: "http://localhost:5173", value: "dark" },
    ]);
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("resolves light from the theme cookie", async ({ context, page }) => {
    await context.addCookies([
      { name: "theme", url: "http://localhost:5173", value: "light" },
    ]);
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});

test("resolves the OS preference and persists it when no cookie is set", async ({
  context,
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const cookies = await context.cookies();
  expect(cookies.find((cookie) => cookie.name === "theme")?.value).toBe("dark");
});

test("toggling the theme flips data-theme and updates the cookie", async ({
  context,
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Blackboard theme" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const cookies = await context.cookies();
  expect(cookies.find((cookie) => cookie.name === "theme")?.value).toBe(
    "light",
  );
});

test("the theme corner's pressed state follows the theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const corner = page.getByRole("button", { name: "Blackboard theme" });
  await expect(corner).toHaveAttribute("aria-pressed", "false");
  await expect(corner).toHaveAttribute("title", "Turn to the blackboard");

  await corner.click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(corner).toHaveAttribute("aria-pressed", "true");
  await expect(corner).toHaveAttribute("title", "Turn back to paper");
});

test("theme persists across a reload after toggling", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Blackboard theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("the corner turns the page before the theme flips", async ({ page }) => {
  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "no-preference",
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const corner = page.getByRole("button", { name: "Blackboard theme" });
  await corner.click();

  await expect(corner).toHaveAttribute("data-turning");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(corner).not.toHaveAttribute("data-turning");
});

test("with reduced motion the theme flips without a page turn", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const corner = page.getByRole("button", { name: "Blackboard theme" });
  await corner.click();

  // Read once, without retrying: a turn would still be under way here.
  expect(await page.locator("html").getAttribute("data-theme")).toBe("dark");
  expect(await corner.getAttribute("data-turning")).toBeNull();
});

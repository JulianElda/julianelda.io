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

  await page.getByRole("button", { name: "Toggle theme" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const cookies = await context.cookies();
  expect(cookies.find((cookie) => cookie.name === "theme")?.value).toBe(
    "light",
  );
});

test("theme persists across a reload after toggling", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

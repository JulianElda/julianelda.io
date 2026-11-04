import { expect, test } from "@playwright/test";

test("the Photos nav link is current on /photos", async ({ page }) => {
  await page.goto("/photos");

  await expect(
    page.getByRole("navigation", { name: "Sections" }).getByRole("link", {
      name: "Photos",
    }),
  ).toHaveAttribute("aria-current", "page");
});

test("a photo opens with its caption, gear and exposure", async ({ page }) => {
  await page.goto("/photos");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Open photo: Jenner summit" }).click();

  const viewer = page.getByRole("dialog", { name: "Jenner summit" });
  await expect(viewer).toBeVisible();
  await expect(
    viewer.getByText(
      "Olympus E-M1 Mark III · M.Zuiko 14–42mm F3.5–5.6 II · 42mm",
    ),
  ).toBeVisible();
  await expect(viewer.getByText("ƒ/8 · 1/160s · ISO 200")).toBeVisible();
});

test("Escape closes the viewer and returns focus to the print", async ({
  page,
}) => {
  await page.goto("/photos");
  await page.waitForLoadState("networkidle");

  const print = page.getByRole("button", {
    name: "Open photo: frost and fog",
  });
  await print.click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.keyboard.press("Escape");

  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(print).toBeFocused();
});

test("clicking outside the print closes the viewer", async ({ page }) => {
  await page.goto("/photos");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Open photo: frost and fog" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.mouse.click(5, 300);

  await expect(page.getByRole("dialog")).toBeHidden();
});

---
name: generate-e2e-test
description: Generate Playwright e2e tests for this project. Use when creating or updating *.test.ts files inside an e2e/ directory. Enforces conventions from packages/oikos/e2e/ and packages/biblio/e2e/.
---

# Generate E2E Test (Playwright)

Generate Playwright e2e tests for this project. Use when creating or updating `*.test.ts` files inside an `e2e/` directory. Enforces the conventions established across `packages/oikos/e2e/` and `packages/biblio/e2e/`.

## When to use

- Writing a new e2e test file for an existing page or feature
- Adding test cases to an existing e2e file
- Rewriting a broken test to match current conventions

## Key conventions

### File location

```
packages/<app>/e2e/<page-name>.test.ts          # authenticated pages
packages/<app>/e2e/login.test.ts                # unauthenticated only
packages/<app>/e2e/auth.setup.ts                # auth setup (do not edit)
packages/<app>/e2e/helpers/supabase.ts          # DB helper functions
```

### Imports

```typescript
import { expect, test } from "@playwright/test";
import { Temporal } from "temporal-polyfill"; // only when using dates
import { getSpendingsForMonth, resetDb } from "./helpers/supabase"; // DB helpers as needed
```

### Test structure

- No top-level `describe()` for flat test lists — use `test(...)` directly
- Use `test.describe(...)` only to group logically related tests (e.g. navigation, edit entry)
- Use `test` not `it`
- No shared constants for inline values — inline them unless reused across multiple tests

### Standard page setup

Always follow with `waitForLoadState("networkidle")` after navigation:

```typescript
await page.goto("/month/2026-06");
await page.waitForLoadState("networkidle");
```

### Locator patterns

Prefer `getByTestId` for element lookup:

```typescript
page.getByTestId("spending-row");
page.getByTestId("month-header-month");
page.locator(`#spending-row-${id}`); // ID-based for specific rows
page.getByRole("link", { name: "Next" });
```

Filter rows by nested content using `.filter({ has: ... })`:

```typescript
const row = page.getByTestId("spending-row").filter({
  has: page
    .getByTestId("spending-row-description")
    .filter({ hasText: "Pharmacy" }),
});
```

### Assertions

Amounts always use `.toFixed(2)`:

```typescript
await expect(row.getByTestId("spending-row-amount")).toHaveText(
  spending.amount.toFixed(2),
);
```

Parallelize independent assertions with `Promise.all`:

```typescript
await Promise.all([
  expect(page.getByTestId("total")).toHaveText(total.toFixed(2)),
  expect(page.getByTestId("average")).toHaveText(average.toFixed(2)),
]);
```

Map over data arrays for row-level assertions:

```typescript
await Promise.all(
  spendings.map((spending) => {
    const row = page.locator(`#spending-row-${spending.id}`);
    return Promise.all([
      expect(row.getByTestId("spending-row-date")).toHaveText(spending.date),
      expect(row.getByTestId("spending-row-amount")).toHaveText(
        spending.amount.toFixed(2),
      ),
    ]);
  }),
);
```

### Data-driven tests

Query the actual database via helpers, then assert the UI matches:

```typescript
const spendings = await getSpendingsForMonth(2026, 6);
await page.goto("/month/2026-06");
await page.waitForLoadState("networkidle");
await expect(page.getByTestId("spending-row")).toHaveCount(spendings.length);
```

Use a named constant for seeded values referenced across the file:

```typescript
const SEEDED_MONTH = { month: 6, year: 2026 };
const SEEDED_SPENDING_ID = "1bed39a6-9d7d-4967-af82-e257a5287e59";
```

### Mutation tests (write operations)

Always reset the DB in `beforeEach` when the test writes data:

```typescript
test.beforeEach(() => resetDb());
```

For tests that use `await` inside a loop, add the oxlint disable comment at the top of the file:

```typescript
// oxlint-disable no-await-in-loop
```

### Temporal for dynamic dates

Use `temporal-polyfill` (not `new Date()`) for current date arithmetic:

```typescript
const now = Temporal.Now.plainDateISO();
const current = now.toPlainYearMonth().toString(); // "2026-06"
const previous = now.subtract({ months: 1 }).toPlainYearMonth().toString();
```

Exception: `login.test.ts` uses `new Date()` for simple year/month display — only switch to Temporal when using `.subtract()`, `.add()`, or `PlainYearMonth`.

### Auth project routing

The playwright config splits tests into:

- `setup` — runs `auth.setup.ts` only
- `unauthenticated` — runs `login.test.ts` only (no auth dependency)
- `authenticated` — all other tests, depends on `setup`, uses saved storage state

New tests automatically land in `authenticated` unless the filename is `login.test.ts`.

## After generating the test

After writing or updating the test file, **always run it** before reporting done:

```bash
# From within the package directory
bunx playwright test e2e/<file>.test.ts

# From repo root
cd packages/oikos && bunx playwright test e2e/<file>.test.ts
```

If tests fail, fix them before reporting done. Do not report success without a passing run.

## DB helper pattern (for adding new helpers)

Place new query functions in `e2e/helpers/supabase.ts`. Use the admin client, throw on error:

```typescript
export async function getSpendingsForMonth(year: number, month: number) {
  const { daysInMonth } = Temporal.PlainYearMonth.from({ month, year });
  const { data, error } = await adminClient
    .from("spendings")
    .select("id,date,description,amount,categories(id,name)")
    .gte("date", Temporal.PlainDate.from({ day: 1, month, year }).toString())
    .lte(
      "date",
      Temporal.PlainDate.from({ day: daysInMonth, month, year }).toString(),
    );
  if (error) throw new Error(`getSpendingsForMonth failed: ${error.message}`);
  return data ?? [];
}
```

## Example: read-only page test

```typescript
import { expect, test } from "@playwright/test";

import { getSpendingsForMonth } from "./helpers/supabase";

const SEEDED_MONTH = { month: 6, year: 2026 };

test("shows seeded spending rows with correct values", async ({ page }) => {
  const { month, year } = SEEDED_MONTH;
  const spendings = await getSpendingsForMonth(year, month);

  await page.goto(`/month/2026-06`);
  await page.waitForLoadState("networkidle");

  await expect(page.getByTestId("spending-row")).toHaveCount(spendings.length);

  await Promise.all(
    spendings.map((spending) => {
      const row = page.locator(`#spending-row-${spending.id}`);
      return Promise.all([
        expect(row.getByTestId("spending-row-date")).toHaveText(spending.date),
        expect(row.getByTestId("spending-row-amount")).toHaveText(
          spending.amount.toFixed(2),
        ),
      ]);
    }),
  );
});
```

## Example: mutation test

```typescript
import { expect, test } from "@playwright/test";

import { resetDb } from "./helpers/supabase";

test.beforeEach(() => resetDb());

test("editing a row updates the display", async ({ page }) => {
  const SEEDED_ID = "1bed39a6-9d7d-4967-af82-e257a5287e59";

  await page.goto("/month/2026-06");
  await page.waitForLoadState("networkidle");

  const row = page.locator(`#spending-row-${SEEDED_ID}`);
  await row.dblclick();

  await page.getByTestId("form-amount").fill("99.99");
  await page.getByTestId("form-amount").press("Enter");
  await page.waitForLoadState("networkidle");

  await expect(row.getByTestId("spending-row-amount")).toHaveText("99.99");
});
```

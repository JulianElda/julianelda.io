---
name: generate-component-test
description: Generate Svelte component tests for this project using Vitest Browser + vitest-browser-svelte. Use when creating or updating *.svelte.test.ts files. Enforces AGENTS testing conventions.
---

# Generate Component Test (Svelte + Vitest Browser)

Create or update a component test file that matches this repository's established testing style.

## When To Use

- You need a new test for a Svelte component.
- You are updating an existing component test after prop or UI changes.
- You want tests to follow project rules and avoid style drift.

## Required Conventions

1. Use Vitest with:
   - expect, test from vitest
   - render from vitest-browser-svelte
2. Do not wrap the entire file in a single top-level describe for the component (for example `describe("MyComponent", () => { ... })` containing every test).
3. Scoped describe blocks are allowed when they group a specific behavior or scenario.
4. Use test, not it.
5. Keep TypeScript strict:
   - avoid any
   - use type-only imports for types
6. Prefer inline test values unless shared mocks are intentionally reused.
7. Keep assertions user-facing and stable:
   - prefer getByText or getByTestId where appropriate
   - avoid fragile implementation-coupled selectors unless needed

## File And Naming Rules

1. Co-locate test with the component.
2. Use the naming pattern:
   - component-name.svelte.test.ts
3. Keep imports minimal and remove unused imports.

## Test Naming

Write test names as direct descriptions of what the test verifies, without "should" language:

- ✓ `test("renders initial values", ...)`
- ✓ `test("sorted by date descending by default", ...)`
- ✗ `test("should render initial values", ...)`
- ✗ `test("should be sorted by date descending", ...)`

Test names appear in CI logs and test reports—keep them concise and action-focused.

## Mocking Child Components (When Requested)

Only mock child components if the user explicitly asks for it. By default, child components render normally.

When the user requests mocking, use this pattern:

```ts
import { describe, test, vi } from "vitest";

vi.mock("./components/ChildComponent", () => ({
  default: vi.fn(({ someProp }) => `<div>Mocked: ${someProp}</div>`),
}));
```

Use the pattern `vi.mock(import('path/to/component'), () => ({ default: vi.fn(...) }))` to replace child components with minimal stubs that return simple HTML. This isolates the component under test and avoids rendering nested component trees.

## Test Generation Workflow

1. Inspect component props and rendering paths (normal, empty, fallback states).
2. Build minimal valid props:
   - inline values by default
   - shared mocks only when already suitable and reusable
3. Render component with render(Component, { props }).
4. Assert key behavior:
   - required text and labels
   - formatting expectations (amount/date, etc.)
   - presence of semantic/test-id targets when meaningful
5. Keep one test focused on one behavior.

## Output Pattern

Use this shape for generated tests:

```ts
import type { SomeType } from "path/to/types";
import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";

import ComponentName from "./component-name.svelte";

test("renders with provided props", async () => {
  const props: SomeType = {
    // inline realistic values, or shared mocks when intentionally reused
  };

  const { getByText, getByTestId } = await render(ComponentName, {
    props,
  });

  await expect.element(getByText("...")).toBeInTheDocument();
  await expect.element(getByTestId("...")).toHaveTextContent("...");
});
```

## Quality Checklist

- Test compiles with strict TypeScript.
- Uses test (not it) and no describe wrapper.
- Assertions verify user-visible behavior.
- Mock/value choice follows AGENTS guidance:
  - inline by default
  - shared mocks only when intended for reuse.
- File naming and location match component conventions.

## After Generating Tests

After writing the test file, prompt the user to run it with the specific file path:

```
bun vitest <path-to-test-file> --run
```

For example: `bun vitest src/lib/components/month-sum/month-sum-row.svelte.test.ts --run`

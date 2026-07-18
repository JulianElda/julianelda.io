---
name: generate-server-test
description: Generate SvelteKit server tests for this project using Vitest. Use when creating or updating +page.server.ts and +layout.server.ts test files. Enforces AGENTS testing conventions.
---

# Generate Server Test (SvelteKit + Vitest)

Create or update a server test file that matches this repository's established testing style for `+page.server.ts` and `+layout.server.ts` files.

## When To Use

- You need a new test for a SvelteKit server file.
- You are updating an existing `+page.server.ts` or `+layout.server.ts` test after route logic changes.
- You want tests to follow the repo's server-test patterns and avoid style drift.

## Required Conventions

1. Use Vitest with:
   - `expect`, `test`, and lifecycle hooks such as `beforeEach` or `afterEach`
   - `vi` for spies and module mocks
2. Server tests should stay flat: do not wrap the file in a top-level `describe` block around the route module.
3. Keep helper functions local and focused, for example `createEvent()` or `getThrown()`, when they make a `load` test easier to read.
4. Use `test`, not `it`.
5. Keep TypeScript strict:
   - avoid `any`
   - use type-only imports for types
6. Prefer inline test values unless shared mocks are intentionally reused.
7. Keep assertions user-facing and stable:
   - assert redirect/status/location values for thrown `redirect` and `error` results
   - prefer direct expectations on returned payloads and mocked function calls
8. Use `vi.hoisted()` when module mocks need hoisted typed mocks for imports used by the server file.

## File And Naming Rules

1. Co-locate the test with the server file.
2. Use the naming pattern:
   - `page.server.test.ts`
   - `layout.server.test.ts`
3. Keep imports minimal and remove unused imports.

## Test Naming

Write test names as direct descriptions of what the test verifies, without "should" language:

- ✓ `test("redirects bare year to current month with 307", ...)`
- ✓ `test("parses slug, calls queries, and returns mapped payload", ...)`
- ✗ `test("should redirect bare year to current month", ...)`
- ✗ `test("should return mapped payload", ...)`

Test names appear in CI logs and test reports—keep them concise and action-focused.

## Mocking And Spies

Use the repo's existing server-test pattern when a `load` function depends on modules or external helpers:

```ts
import type { someDependency } from "$lib/utils/some-utils";
import { expect, test, vi } from "vitest";

import { load } from "./+page.server";

const { someDependencyMock } = vi.hoisted(() => ({
  someDependencyMock: vi.fn<typeof someDependency>(),
}));

vi.mock(import("$lib/utils/some-utils"), () => ({
  someDependency: someDependencyMock,
}));
```

When the route file throws redirects or errors, use a small helper to capture the thrown value so you can assert on it:

```ts
type LoadEvent = Parameters<typeof load>[0];

function createEvent(slug?: string): LoadEvent {
  return { params: { slug } } as unknown as LoadEvent;
}

function getThrown(slug?: string) {
  try {
    void load(createEvent(slug));
    return;
  } catch (thrown) {
    return thrown as { location?: string; status: number };
  }
}
```

Prefer `beforeEach` to clear mock state and `afterEach` to restore spies when tests modify globals like `Temporal.Now`.

## Test Generation Workflow

1. Inspect the server file's exported `load` function or other exported helpers.
2. Build a typed event with `Parameters<typeof load>[0]` when testing `load`.
3. Stub dependencies with typed `vi.fn<typeof dependency>()` mocks when needed.
4. Render no UI; assert the server behavior directly:
   - returned payloads
   - redirect/error status and location
   - calls to mocked dependencies
5. Keep one test focused on one behavior.

## Output Pattern

Use this shape for generated tests:

```ts
import type { dependencyFn } from "$lib/utils/dependency";
import { beforeEach, expect, test, vi } from "vitest";

import { load } from "./+page.server";

type LoadEvent = Parameters<typeof load>[0];

const { dependencyFnMock } = vi.hoisted(() => ({
  dependencyFnMock: vi.fn<typeof dependencyFn>(),
}));

vi.mock(import("$lib/utils/dependency"), () => ({
  dependencyFn: dependencyFnMock,
}));

function createEvent(slug: string): LoadEvent {
  return { params: { slug } } as unknown as LoadEvent;
}

beforeEach(() => {
  vi.clearAllMocks();
});

test("returns mapped payload", async () => {
  dependencyFnMock.mockReturnValue("value");

  const result = await load(createEvent("2026-04"));

  expect(dependencyFnMock).toHaveBeenCalledOnce();
  expect(result).toStrictEqual({ value: "value" });
});
```

## Quality Checklist

- Test compiles with strict TypeScript.
- Uses `test` (not `it`).
- Server tests stay flat and do not use a top-level `describe` around the route module.
- Helpers are local and focused when they improve readability.
- There are no linter errors.
- Thrown redirects and errors are asserted through status/location or similar returned metadata.
- Mock/value choice follows AGENTS guidance:
  - inline by default
  - shared mocks only when intended for reuse.
- File naming and location match server-test conventions.

## After Generating Tests

After writing the test file, prompt the user to run it with the specific file path:

```bash
bun vitest <path-to-test-file> --run
```

For example: `bun vitest src/routes/month/[slug]/page.server.test.ts --run`

# General

- Filenames must be kebab-case.
- Files of the same feature or domain can be indicated with `.`, e.g. `my-component.ts`, `my-component.types.ts`, `my-component.api.ts`.
- Shared utilities must be domain scoped, e.g. `string.utils.ts`, `api.utils.ts`, `build.utils.ts`.
- Keep formatting and linting aligned with the shared lexis preset used by oxfmt and oxlint.
- Use `bun` for package management.
- Prefer named exports instead of default exports, e.g. `export function MyFunction()`.

# TypeScript

- Keep strict typing. Avoid any and avoid type assertions unless there is no safer option.
- Use type-only imports for TypeScript types: `import type { MyType } from '...'`.
- Prefer undefined over null, except when it is required by external libraries.
- Prefer interface for public object shapes; use type for unions, intersections, and advanced types.
- A type file should be named `{domain|feature}.types.ts` and placed where it is relevant.
- Prefer `Record` over index signature, e.g. `type RecordType = Record<string, number>;`

# Svelte

- Declare component props using the `$props()` rune with an interface immediately above the component script.
- Name props interfaces as `ComponentNameProps` (e.g., `HeaderProps`, `ButtonProps`).
- Destructure props using the `const { prop1, prop2 } = $props()` pattern immediately after the script tag.
- Use `$effect()` for reactive side effects; avoid reactive blocks (`$:`) for clarity.
- Name event handlers descriptively with `handle` prefix: `handleClick`, `handleChange`, `handleSubmit`.
- Order attribute name alphabetically.
- Order element attributes alphabetically.
- Keep components small and focused with single responsibility; extract logic into separate components or utility functions.
- Return/conditional-render early for empty, loading, or error states using `{#if}` blocks.
- Use `let` for component state; prefer `let` over module-level variables to scope state.
- Prefer Svelte runes.

# Styling

- Use utility-first class composition patterns consistently.
- Reuse shared UI components before creating new variants.

# Testing

- Avoid abstraction in test codes. Only shared setup is acceptable.
- Prefer inlining values like strings in the test, do not extract same values to a const.
- Do not wrap tests in a file in a `describe()`.
- Use `test`, not `it`.

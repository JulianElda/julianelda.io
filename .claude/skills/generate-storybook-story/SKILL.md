---
name: generate-storybook-story
description: Generate Svelte Storybook story files for this project. Use when creating or updating *.stories.svelte files. Follow existing CSF structure and always prefer exported mocks from the shared mock type files before adding inline args.
---

# Generate Storybook Story (Svelte)

Create or update a story file that matches the project’s existing Storybook pattern.

## When To Use

- You need a new story for a Svelte component.
- You need to update story args to use shared mock data.
- You want story files to stay consistent across components.

## Required Conventions

1. Use script module with defineMeta from @storybook/addon-svelte-csf.
2. Import the component from the same directory.
3. Set title to Components/ComponentName.
4. Export Story from defineMeta and include at least one story named Default.
5. Prefer shared mocks from the existing mock modules when they match the component props.
6. If no suitable mock export exists, use minimal inline args with realistic values.
7. Keep imports minimal and remove unused imports.

## Mock Selection Rules

1. First, inspect shared mocks in src/lib/types.
2. Prefer exports from files ending in .mocks.ts.
3. Reuse existing mock collections for array props.
4. Reuse existing single mock objects for object props.
5. Only create inline args for props not covered by shared mocks.

## Story Output Pattern

Use this structure:

<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import ComponentName from "./component-name.svelte";
  import { MOCK_EXPORTS } from "$lib/types/FILE.mocks";

  const { Story } = defineMeta({
    component: ComponentName,
    title: "Components/ComponentName",
  });
</script>

<Story
name="Default"
args={{
    /* map props to shared mocks first */
  }} />

## Quality Checklist

- Story renders with valid args for required props.
- Story title and component names are correct.
- Shared mocks are used whenever available.
- No ad hoc local mock duplication when shared mocks exist.
- File naming follows \*.stories.svelte in component directory.

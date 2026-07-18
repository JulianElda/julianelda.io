import lexis from "@julianelda/lexis/oxlint/svelte";
import { defineConfig } from "oxlint";

export default defineConfig({
  ...lexis,
  overrides: [
    ...(lexis.overrides ?? []),
    {
      files: ["e2e/**"],
      rules: {
        "vitest/prefer-importing-vitest-globals": "off",
      },
    },
  ],
});

import lexis from "@julianelda/lexis";
import tailwind from "@julianelda/lexis/tsx-tailwind";
import tsParser from "@typescript-eslint/parser";

export default [
  ...tailwind,
  {
    files: ["**/*.{ts,tsx,cts,mts}"],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    settings: {
      "better-tailwindcss": {
        entryPoint: "app/globals.css",
        tsconfig: "tsconfig.json",
      },
    },
  },
  ...lexis,
];

import lexis from "@julianelda/lexis/react";
import next from "@next/eslint-plugin-next";

const eslintConfig = [
  {
    plugins: {
      "@next/next": next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
    },
  },
  ...lexis,
  {
    rules: {
      "unicorn/prevent-abbreviations": "off",
    },
  },
];

export default eslintConfig;

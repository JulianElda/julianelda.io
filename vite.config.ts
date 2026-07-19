import type { BundledLanguage } from "shiki";

import adapter from "@sveltejs/adapter-vercel";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { escapeSvelte, mdsvex } from "mdsvex";
import { createHighlighter } from "shiki";
import { defineConfig } from "vitest/config";

const highlighterPromise = createHighlighter({
  langs: [
    "javascript",
    "typescript",
    "jsx",
    "tsx",
    "svelte",
    "bash",
    "json",
    "css",
    "html",
  ],
  themes: ["ayu-light", "ayu-mirage"],
});

async function highlightCode(code: string, lang: null | string | undefined) {
  const highlighter = await highlighterPromise;
  const html = highlighter.codeToHtml(code, {
    lang: (lang || "text") as BundledLanguage,
    themes: { dark: "ayu-mirage", light: "ayu-light" },
  });
  return `{@html \`${escapeSvelte(html)}\`}`;
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: adapter({
        runtime: "nodejs22.x",
      }),
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },
      extensions: [".svelte", ".svx", ".md"],
      preprocess: [
        mdsvex({
          extensions: [".svx", ".md"],
          highlight: { highlighter: highlightCode },
        }),
      ],
    }),
  ],
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          browser: {
            enabled: true,
            instances: [{ browser: "chromium", headless: true }],
            provider: playwright(),
          },
          exclude: ["src/lib/server/**"],
          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          name: "client",
        },
      },

      {
        extends: "./vite.config.ts",
        test: {
          environment: "node",
          exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          include: ["src/**/*.{test,spec}.{js,ts}"],
          name: "server",
        },
      },
    ],
  },
});
